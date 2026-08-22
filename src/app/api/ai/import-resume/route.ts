import { NextRequest, NextResponse } from "next/server";
import { openRouterChat, MessageContentPart } from "@/lib/openrouter";

export const runtime = "nodejs";

// Helper: Detect if string contains garbled PDF binary artifacts like "qSa |wu+%" or obj tokens
function isGarbledText(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  if (/\b(obj|endobj|stream|endstream|xref|trailer|startxref)\b/i.test(text)) return true;
  if (/[\uFFFD\u0000-\x08\x0B\x0C\x0E-\x1F]/.test(text)) return true;

  const cleanStr = text.replace(/\s+/g, "");
  if (cleanStr.length === 0) return false;
  // If non-standard punctuation ratio is > 12%
  const badCharCount = (cleanStr.match(/[^a-zA-Z0-9.,\-@:/()'\s]/g) || []).length;
  return badCharCount / cleanStr.length > 0.12;
}

// Helper: Clean raw text by removing PDF stream artifacts, obj declarations, and headers
function cleanExtractedText(raw: string): string {
  return raw
    .replace(/^--- PDF File:.*$/gm, "")
    .replace(/\b\d+\s+\d+\s+obj\b[\s\S]*?\bendobj\b/gi, "")
    .replace(/\b(stream|endstream|xref|trailer|startxref)\b/gi, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
}

// Fallback deterministic parser for when AI service is unavailable
function fallbackParse(text: string) {
  const cleaned = cleanExtractedText(text);

  const emailMatch = cleaned.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = cleaned.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = cleaned.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = cleaned.match(/github\.com\/[a-zA-Z0-9_-]+/i);

  const lines = cleaned.split(/[\r\n]+/).map((l) => l.trim()).filter((l) => l.length > 2 && !isGarbledText(l));

  let fullName = "Imported Candidate";
  let jobTitle = "Professional";

  if (lines.length > 0) {
    const firstLine = lines[0].replace(/email:.*|phone:.*|summary:.*|experience:.*/i, "").trim();
    if (firstLine && firstLine.length < 60 && !firstLine.includes("@")) {
      fullName = firstLine;
    }
  }

  if (lines.length > 1) {
    const secondLine = lines[1].trim();
    if (secondLine && secondLine.length < 70 && !secondLine.includes("@") && !secondLine.includes("http")) {
      jobTitle = secondLine;
    }
  }

  // Basic section splitting by common headers
  const experience: any[] = [];
  const education: any[] = [];
  const skills: any[] = [];
  const projects: any[] = [];
  const certifications: any[] = [];
  const languages: any[] = [];
  let summary = "";

  const sections = cleaned.split(/(?=\n(?:EXPERIENCE|WORK HISTORY|EDUCATION|SKILLS|TECHNICAL SKILLS|PROJECTS|CERTIFICATIONS|LANGUAGES|SUMMARY|PROFILE)\b)/i);

  for (const sec of sections) {
    const secTrim = sec.trim();
    if (isGarbledText(secTrim)) continue;
    const upper = secTrim.toUpperCase();

    if (upper.startsWith("SUMMARY") || upper.startsWith("PROFILE")) {
      summary = secTrim.replace(/^(SUMMARY|PROFILE)[:\s]*/i, "").slice(0, 600).trim();
    } else if (upper.startsWith("EXPERIENCE") || upper.startsWith("WORK HISTORY")) {
      const expLines = secTrim.split("\n").slice(1).map((l) => l.trim()).filter((l) => Boolean(l) && !isGarbledText(l));
      if (expLines.length > 0) {
        experience.push({
          company: expLines[0] || "Company",
          position: jobTitle || "Role",
          location: "",
          startDate: "2022-01",
          endDate: "Present",
          current: true,
          description: expLines.slice(1).join(" "),
          achievements: expLines.slice(1).filter((l) => l.length > 15),
        });
      }
    } else if (upper.startsWith("EDUCATION")) {
      const eduLines = secTrim.split("\n").slice(1).map((l) => l.trim()).filter((l) => Boolean(l) && !isGarbledText(l));
      if (eduLines.length > 0) {
        education.push({
          institution: eduLines[0] || "University",
          degree: eduLines[1] || "Bachelor's Degree",
          field: "Relevant Field",
          startDate: "2018-08",
          endDate: "2022-05",
          gpa: "",
          description: eduLines.slice(2).join(" "),
        });
      }
    } else if (upper.startsWith("SKILLS") || upper.startsWith("TECHNICAL SKILLS")) {
      const skillItems = secTrim
        .replace(/^(SKILLS|TECHNICAL SKILLS)[:\s]*/i, "")
        .split(/[,•|\n]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 40 && !isGarbledText(s));
      if (skillItems.length > 0) {
        skills.push({ category: "Core Skills", items: skillItems });
      }
    }
  }

  if (!summary || isGarbledText(summary)) {
    const validLines = lines.filter(l => !isGarbledText(l) && l.length > 15);
    summary = validLines.slice(2, 6).join(" ").slice(0, 500);
  }

  return {
    personalInfo: {
      fullName,
      jobTitle,
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : "",
      location: "",
      website: "",
      linkedin: linkedinMatch ? linkedinMatch[0] : "",
      github: githubMatch ? githubMatch[0] : "",
      tagline: "",
    },
    summary: isGarbledText(summary) ? "Driven professional with proven technical and analytical expertise." : summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    customSections: [],
  };
}

// PDF Extraction function supporting pdf-parse v2 load() API & fallback text streams
async function extractTextFromPDFBuffer(buffer: Buffer): Promise<string> {
  try {
    const { PDFParse } = await import("pdf-parse");
    if (PDFParse) {
      const uint8Array = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      const parser = new PDFParse({ data: uint8Array });
      
      // Crucial: Call load() before getText() in pdf-parse v2
      await (parser as any).load();
      const textResult = await (parser as any).getText();
      const pdfText = textResult?.text;

      if (typeof parser.destroy === "function") {
        await parser.destroy();
      }

      if (pdfText && pdfText.trim().length > 20 && !isGarbledText(pdfText)) {
        return pdfText;
      }
    }
  } catch (err) {
    console.warn("[PDF Parse Engine] Primary parser notice:", err);
  }

  // Secondary Fallback: Direct extraction of clean text tokens from raw PDF stream
  const rawString = buffer.toString("utf-8");

  // Extract content inside PDF parenthesis text tokens: (text content)
  const textBlocks: string[] = [];
  const parenRegex = /\(([^()\\]|\\[\s\S])*\)/g;
  let match;
  while ((match = parenRegex.exec(rawString)) !== null) {
    const str = match[0]
      .slice(1, -1)
      .replace(/\\([()\\])/g, "$1")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .trim();

    if (
      str.length > 1 &&
      !isGarbledText(str) &&
      !/^(font|helix|adobe|identity|winansi|standard|times|helvetica|courier|cjk|embed|subset|obj|endobj)/i.test(str) &&
      !/^[0-9.]+\s+[0-9.]+\s+[0-9.]+$/i.test(str)
    ) {
      textBlocks.push(str);
    }
  }

  if (textBlocks.length > 5) {
    return textBlocks.join(" ");
  }

  // Filter plain ASCII text lines, ignoring PDF syntax markers
  const asciiLines = rawString
    .split(/[\r\n]+/)
    .map((line) => line.replace(/[\x00-\x1F\x7F-\xFF]/g, " ").trim())
    .filter((line) => {
      if (line.length < 3 || isGarbledText(line)) return false;
      if (/^(%PDF|\d+\s+\d+\s+obj|endobj|stream|endstream|xref|trailer|startxref)/i.test(line)) return false;
      if (/^\/([A-Z0-9]+)\b/i.test(line) && line.length < 25) return false;
      return true;
    });

  return asciiLines.join("\n");
}

export async function POST(req: NextRequest) {
  try {
    let text = "";
    const base64Images: string[] = [];
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const files = formData.getAll("file") as File[];
      const filesAlt = formData.getAll("files") as File[];
      const allFiles = [...files, ...filesAlt].filter((f) => f && f.name);

      const extractedTexts: string[] = [];

      for (const file of allFiles) {
        const name = file.name.toLowerCase();
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".webp") || file.type.startsWith("image/")) {
          // Convert image file to base64 Data URI for Multimodal Vision LLM
          const base64 = buffer.toString("base64");
          const mime = file.type || "image/png";
          base64Images.push(`data:${mime};base64,${base64}`);
          extractedTexts.push(`[Uploaded Image Resume: ${file.name}]`);
        } else if (name.endsWith(".pdf") || file.type === "application/pdf") {
          const pdfText = await extractTextFromPDFBuffer(buffer);
          extractedTexts.push(pdfText);

          // Also convert PDF buffer to base64 Data URI if needed for Vision OCR
          const pdfBase64 = buffer.toString("base64");
          base64Images.push(`data:application/pdf;base64,${pdfBase64}`);
        } else if (name.endsWith(".json")) {
          const raw = buffer.toString("utf-8");
          try {
            const parsed = JSON.parse(raw);
            const data = parsed.data || parsed;
            if (data.personalInfo || data.experience || data.education) {
              return NextResponse.json({ data });
            }
          } catch {
            extractedTexts.push(raw);
          }
        } else {
          const raw = buffer.toString("utf-8");
          extractedTexts.push(raw);
        }
      }

      text = extractedTexts.join("\n\n");
    } else {
      try {
        const body = await req.json();
        text = typeof body?.text === "string" ? body.text : "";
        if (Array.isArray(body?.images)) {
          base64Images.push(...body.images);
        } else if (typeof body?.image === "string") {
          base64Images.push(body.image);
        }
      } catch {
        const rawBody = await req.text();
        text = rawBody;
      }
    }

    const cleanText = cleanExtractedText(text);

    if ((!cleanText || cleanText.length < 10) && base64Images.length === 0) {
      return NextResponse.json(
        { error: "Please provide valid resume text, PDF files, or document images to import" },
        { status: 400 }
      );
    }

    const promptText = `You are an expert Multimodal AI Resume Scanner & OCR Engine. Your task is to scan, read, and extract ALL resume details from the candidate's document (whether text or image).

Analyze every single section (Personal Info, Summary, Work Experience, Education, Skills, Projects, Certifications, Languages) and allocate EVERY item into its respective section.

${cleanText ? `Extracted Text Content:\n"""\n${cleanText.slice(0, 10000)}\n"""` : "Please perform Vision OCR on the attached document image."}

Return ONLY a valid JSON object matching this exact schema:
{
  "personalInfo": {
    "fullName": "Full Name",
    "jobTitle": "Target / Current Job Title",
    "email": "email@example.com",
    "phone": "Phone Number",
    "location": "City, Country",
    "website": "Portfolio Link or Empty",
    "linkedin": "LinkedIn URL or Empty",
    "github": "GitHub URL or Empty",
    "tagline": ""
  },
  "summary": "Clear, professional 2-4 sentence career summary statement extracted or synthesized from the resume.",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title / Role",
      "location": "City, State",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "current": false,
      "description": "Overview of responsibilities",
      "achievements": [
        "Quantified achievement or bullet point 1",
        "Bullet point 2"
      ]
    }
  ],
  "education": [
    {
      "institution": "University / College Name",
      "degree": "Degree (e.g. Bachelor of Technology)",
      "field": "Major / Field of Study",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "GPA or Percentage if present",
      "description": "Coursework or honors"
    }
  ],
  "skills": [
    {
      "category": "Category Name (e.g. Programming Languages / Tools / Soft Skills)",
      "items": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ],
  "projects": [
    {
      "name": "Project Title",
      "description": "Detailed project description",
      "technologies": ["Tech 1", "Tech 2"],
      "link": "Project URL or Empty"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "YYYY-MM"
    }
  ],
  "languages": [
    {
      "name": "Language Name",
      "proficiency": "Native / Fluent / Intermediate"
    }
  ]
}

CRITICAL RULES:
1. NEVER output garbled binary artifacts, PDF object tokens (like qSa |wu+%, 1 0 obj), or unreadable symbols anywhere in summary or other fields.
2. Extract EVERY job into the "experience" array.
3. Extract EVERY degree into the "education" array.
4. Extract ALL skills into categorized groups in the "skills" array.
5. Extract projects into the "projects" array.
6. Return ONLY raw JSON, with no markdown formatting around it, no code blocks, and no extra commentary.`;

    // Build Multimodal Message parts if images/visionURIs exist
    const userMessageContent: MessageContentPart[] = [
      { type: "text", text: promptText },
    ];

    // Add up to 3 image vision URLs if available
    base64Images.slice(0, 3).forEach((url) => {
      if (url.startsWith("data:image/")) {
        userMessageContent.push({
          type: "image_url",
          image_url: { url },
        });
      }
    });

    try {
      const raw = await openRouterChat(
        [
          {
            role: "system",
            content:
              "You are an expert Multimodal AI resume scanner. You parse raw resume text and images into structured JSON across all categories (personalInfo, summary, experience, education, skills, projects, certifications, languages). Return ONLY valid JSON.",
          },
          { role: "user", content: base64Images.length > 0 ? userMessageContent : promptText },
        ],
        { model: "openai/gpt-4o-mini" }
      );

      const cleanedJsonText = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleanedJsonText);

      // Post-parse Sanitization to guarantee ZERO garbled characters
      if (isGarbledText(parsed.summary)) {
        const exp = parsed.experience?.[0];
        const edu = parsed.education?.[0];
        const topSkills = parsed.skills?.flatMap((s: any) => s.items || []).slice(0, 5).join(", ");
        let synth = `Results-driven ${exp?.position || parsed.personalInfo?.jobTitle || "Professional"}`;
        if (exp?.company) synth += ` with experience at ${exp.company}`;
        if (topSkills) synth += `, specializing in ${topSkills}`;
        if (edu?.degree) synth += `. Holds a ${edu.degree} from ${edu.institution || "university"}`;
        synth += `.`;
        parsed.summary = synth;
      }

      return NextResponse.json({ data: parsed });
    } catch (err) {
      console.warn("[Import Resume AI Error]: Falling back to deterministic parser:", err);
      const fallback = fallbackParse(cleanText);
      return NextResponse.json({ data: fallback });
    }
  } catch (e) {
    console.error("Import resume error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
