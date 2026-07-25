import { NextRequest, NextResponse } from "next/server";
import { openRouterChat } from "@/lib/openrouter";

export const runtime = "nodejs";

// POST /api/ai/import-resume — takes raw text from an old resume and parses it into structured ResumeData
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || text.trim().length < 50) {
      return NextResponse.json({ error: "Please provide at least 50 characters of resume text" }, { status: 400 });
    }

    const prompt = `Parse the following resume text into a structured JSON object. Extract all available information.

Resume text:
"""
${text.slice(0, 8000)}
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

    const raw = await openRouterChat([
      {
        role: "system",
        content:
          "You are a resume parser that extracts structured data from raw text. Return ONLY valid JSON, no markdown or commentary.",
      },
      { role: "user", content: prompt },
    ]);

    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Could not parse resume. Please try pasting cleaner text." }, { status: 500 });
    }

    return NextResponse.json({ data: parsed });
  } catch (e) {
    console.error("Import resume error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
