import { NextRequest, NextResponse } from "next/server";
import { openRouterChat } from "@/lib/openrouter";

export const runtime = "nodejs";

// POST /api/ai/upload-rewrite — takes resume text, AI agent rewrites everything for maximum impact
function fallbackRewrite(text: string) {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);

  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 2);
  const fullName = lines[0] ? lines[0].replace(/[^a-zA-Z\s.]/g, "").trim() : "Professional Candidate";
  const jobTitle = lines[1] && lines[1].length < 60 ? lines[1] : "Senior Professional";

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
    summary: text.slice(0, 400).trim(),
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
      return NextResponse.json({ error: "Please provide resume text to rewrite" }, { status: 400 });
    }

    const cleanText = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ").replace(/\s+/g, " ");

    const expertPrompt = `You are an elite resume writer with 20+ years of experience across all industries.
Your task: Take the following raw resume text and completely rewrite it for MAXIMUM IMPACT.

Rewrite the ENTIRE resume into this exact JSON structure:
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
  "summary": "A powerful 2-3 sentence professional summary.",
  "experience": [
    {
      "company": "",
      "position": "",
      "location": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "description": "Role overview.",
      "achievements": ["3-4 rewritten impact bullets"]
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

Raw resume text to rewrite:
"""
${cleanText.slice(0, 8000)}
"""`;

    try {
      const raw = await openRouterChat(
        [
          {
            role: "system",
            content: "You are an elite AI resume writer using GPT-4o-mini. Return ONLY valid JSON, no markdown or commentary.",
          },
          { role: "user", content: expertPrompt },
        ],
        { model: "openai/gpt-4o-mini" }
      );

      const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({ data: parsed });
    } catch {
      const fallback = fallbackRewrite(cleanText);
      return NextResponse.json({ data: fallback });
    }
  } catch (e) {
    console.error("Upload rewrite error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
