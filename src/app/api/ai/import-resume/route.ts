import { NextRequest, NextResponse } from "next/server";
import { openRouterChat } from "@/lib/openrouter";

export const runtime = "nodejs";

// POST /api/ai/import-resume — takes raw text from an old resume and parses it into structured ResumeData
function fallbackParse(text: string) {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);

  const lines = text.split(/[\r\n]+/).map((l) => l.trim()).filter((l) => l.length > 2);
  const rawName = lines[0] || "Imported Resume";
  const fullName = rawName.replace(/email:.*|phone:.*|summary:.*|experience:.*/i, "").trim();
  const jobTitle = lines[1] && lines[1].length < 60 && !lines[1].includes("@") ? lines[1] : "";

  return {
    personalInfo: {
      fullName: fullName.slice(0, 60),
      jobTitle: jobTitle,
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : "",
      location: "",
      website: "",
      linkedin: linkedinMatch ? linkedinMatch[0] : "",
      github: githubMatch ? githubMatch[0] : "",
      tagline: "",
    },
    summary: text.slice(0, 500).trim(),
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
  };
}

export async function POST(req: NextRequest) {
  try {
    let text = "";
    try {
      const body = await req.json();
      text = typeof body?.text === "string" ? body.text : "";
    } catch {
      const rawBody = await req.text();
      try {
        const sanitizedBody = rawBody.replace(/[\x00-\x1F\x7F-\x9F]/g, (match) => {
          if (match === "\n" || match === "\r" || match === "\t") return " ";
          return "";
        });
        const body = JSON.parse(sanitizedBody);
        text = typeof body?.text === "string" ? body.text : rawBody;
      } catch {
        text = rawBody;
      }
    }

    if (!text || typeof text !== "string" || text.trim().length < 15) {
      return NextResponse.json({ error: "Please provide resume text to import" }, { status: 400 });
    }

    const cleanText = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ").replace(/\s+/g, " ");

    const prompt = `Parse the following resume text into a structured JSON object. Extract all available information.

Resume text:
"""
${cleanText.slice(0, 8000)}
"""

Return ONLY a valid JSON object with this exact structure (omit fields you can't find, use empty strings/arrays):
{
  "personalInfo": {
    "fullName": "",
    "jobTitle": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedin": "",
    "github": "",
    "tagline": ""
  },
  "summary": "",
  "experience": [
    {
      "company": "",
      "position": "",
      "location": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "description": "",
      "achievements": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "",
      "description": ""
    }
  ],
  "skills": [
    { "category": "", "items": [] }
  ],
  "projects": [
    { "name": "", "description": "", "technologies": [], "link": "" }
  ],
  "certifications": [
    { "name": "", "issuer": "", "date": "" }
  ],
  "languages": [
    { "name": "", "proficiency": "" }
  ]
}

Rules:
- Dates should be "YYYY-MM" format. If only year is available, use "YYYY-01".
- For "current": true if the person says "Present" or "Current".
- Split achievements into individual array items.
- Group skills into logical categories.
- Return ONLY the JSON, no markdown, no commentary.`;

    try {
      const raw = await openRouterChat(
        [
          {
            role: "system",
            content:
              "You are an expert AI resume scanner. You scan raw resume text, extract every section (personal info, summary, experience, education, skills, projects, certifications, languages, custom sections), and allocate each content item into prebuilt JSON sections. Return ONLY valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        { model: "openai/gpt-4o-mini" }
      );

      const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({ data: parsed });
    } catch {
      // Deterministic fallback if OpenRouter key is unconfigured or AI parsing times out
      const fallback = fallbackParse(cleanText);
      return NextResponse.json({ data: fallback });
    }
  } catch (e) {
    console.error("Import resume error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
