import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { personalInfo, summary, experience, skills, jobDescription, tone } = body;

    if (!personalInfo?.fullName || !personalInfo?.jobTitle) {
      return NextResponse.json({ error: "Personal info (name + jobTitle) is required" }, { status: 400 });
    }

    const topSkills =
      skills && Array.isArray(skills) && skills.length > 0
        ? skills.flatMap((s: { items: string[] }) => s.items).slice(0, 10).join(", ")
        : "";

    const topExp =
      experience && Array.isArray(experience) && experience.length > 0
        ? experience
            .slice(0, 3)
            .map((e: { position: string; company: string; achievements: string[] }) => {
              const ach = (e.achievements || []).slice(0, 2).join(" ");
              return `- ${e.position} at ${e.company}: ${ach}`;
            })
            .join("\n")
        : "";

    const toneLabel = tone === "formal" ? "formal and traditional" : tone === "concise" ? "concise and punchy" : "warm and confident";

    const prompt = `Write a tailored cover letter for ${personalInfo.fullName} applying for a ${personalInfo.jobTitle} role.

Candidate context:
${summary ? `Summary: ${summary}` : ""}
${topExp ? `Recent experience:\n${topExp}` : ""}
${topSkills ? `Key skills: ${topSkills}` : ""}

${jobDescription ? `Job description:\n${jobDescription.slice(0, 1500)}` : "No specific job description provided — write a general-purpose cover letter."}

Requirements:
- Tone: ${toneLabel}.
- 3 short paragraphs (intro, body, close). Max ~280 words total.
- Address it "Dear Hiring Manager,".
- Reference specific achievements from the candidate's experience.
- ${jobDescription ? "Mirror 2-3 keywords from the job description naturally." : "Highlight transferable strengths."}
- End with a confident call to action.
- Output only the cover letter text, no preamble, no signature line beyond "Sincerely,\\n${personalInfo.fullName}".`;

    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert career writer who crafts personalized, non-generic cover letters. Output only the letter text.",
        },
        { role: "user", content: prompt },
      ],
      thinking: { type: "disabled" },
    });

    const letter = completion.choices[0]?.message?.content?.trim() || "";
    if (!letter) {
      return NextResponse.json({ error: "Empty response" }, { status: 500 });
    }
    return NextResponse.json({ letter });
  } catch (e) {
    console.error("AI cover letter error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
