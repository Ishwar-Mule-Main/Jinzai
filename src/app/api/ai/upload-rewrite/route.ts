import { NextRequest, NextResponse } from "next/server";
import { openRouterChat } from "@/lib/openrouter";

export const runtime = "nodejs";

// POST /api/ai/upload-rewrite — takes resume text, AI agent rewrites everything for maximum impact
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || text.trim().length < 50) {
      return NextResponse.json({ error: "Please provide at least 50 characters of resume text" }, { status: 400 });
    }

    const expertPrompt = `You are an elite resume writer with 20+ years of experience across all industries — tech, finance, healthcare, marketing, design, consulting, manufacturing, and more. You have deep knowledge of what recruiters at Fortune 500 companies, startups, and agencies look for. You understand ATS algorithms, keyword optimization, and human psychology in hiring.

Your task: Take the following raw resume text and completely rewrite it for MAXIMUM IMPACT. Transform every section to be:
- Quantified with realistic metrics (%, $, x, counts, time saved) where appropriate
- Started with strong action verbs (Led, Built, Shipped, Drove, Reduced, Launched, Architected, Optimized, etc.)
- Concise (max 22 words per bullet)
- ATS-optimized with industry-standard keywords
- Impact-focused (showing outcomes, not just tasks)
- Professional tone with zero buzzword stuffing

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
  "summary": "A powerful 2-3 sentence professional summary. Lead with years of experience, core expertise, and quantified impact. No first person.",
  "experience": [
    {
      "company": "",
      "position": "",
      "location": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "description": "One line role description.",
      "achievements": ["3-4 rewritten bullets with metrics"]
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
- Dates: "YYYY-MM" format. Use "YYYY-01" if only year available.
- current: true if "Present" or "Current".
- Split achievements into 3-4 powerful bullets per role.
- Group skills into 2-3 logical categories with 4-6 items each.
- Add quantified metrics even if the original didn't have them (use realistic estimates).
- Improve the professional summary to be impactful and specific.
- If the original has weak bullets like "responsible for" or "worked on", transform them into "Led", "Architected", "Drove".
- Return ONLY the JSON, no markdown, no commentary.

Raw resume text to rewrite:
"""
${text.slice(0, 8000)}
"""`;

    const raw = await openRouterChat([
      {
        role: "system",
        content: "You are an elite resume writer with 20+ years of experience across all industries. You understand ATS algorithms, keyword optimization, and what recruiters at top companies look for. You transform weak resumes into powerful, quantified, impact-focused documents. Return ONLY valid JSON, no markdown or commentary.",
      },
      { role: "user", content: expertPrompt },
    ]);

    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Could not parse rewritten resume. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ data: parsed });
  } catch (e) {
    console.error("Upload rewrite error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
