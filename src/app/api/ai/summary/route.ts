import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, jobTitle, experience, skills, tagline } = body;

    if (!name || !jobTitle) {
      return NextResponse.json({ error: "name and jobTitle are required" }, { status: 400 });
    }

    const years =
      experience && Array.isArray(experience) && experience.length > 0
        ? `${experience.length}+ roles`
        : "early-career";

    const topSkills =
      skills && Array.isArray(skills) && skills.length > 0
        ? skills.flatMap((s: { items: string[] }) => s.items).slice(0, 6).join(", ")
        : "";

    const companies =
      experience && Array.isArray(experience)
        ? experience.map((e: { company: string }) => e.company).filter(Boolean).slice(0, 3).join(", ")
        : "";

    const prompt = `Write a professional resume summary (2-3 sentences, ~50-70 words) for ${name}, a ${jobTitle}.
${tagline ? `Tagline: ${tagline}` : ""}
${years !== "early-career" ? `Experience: ${years}${companies ? ` at ${companies}` : ""}` : ""}
${topSkills ? `Key skills: ${topSkills}` : ""}

Requirements:
- First person removed (no "I").
- Lead with the role and years of impact.
- Quantify outcomes where possible.
- Avoid buzzword stuffing; be specific and concrete.
- Return only the summary paragraph, no preamble.`;

    const { openRouterChat } = await import("@/lib/openrouter");
    const summary = await openRouterChat([
      {
        role: "system",
        content:
          "You are an expert resume writer who crafts concise, impactful professional summaries. Output only the summary text, no quotes or headings.",
      },
      { role: "user", content: prompt },
    ]);
    if (!summary) {
      return NextResponse.json({ error: "Empty response" }, { status: 500 });
    }
    return NextResponse.json({ summary });
  } catch (e) {
    console.error("AI summary error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
