import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Suggest skills based on a job title — uses LLM to generate relevant, categorized skills
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle, existingSkills } = body;

    if (!jobTitle || jobTitle.trim().length < 2) {
      return NextResponse.json({ error: "jobTitle is required" }, { status: 400 });
    }

    const existing = Array.isArray(existingSkills)
      ? existingSkills.flatMap((s: { items: string[] }) => s.items).slice(0, 30)
      : [];

    const prompt = `Suggest 12-18 professional skills for someone applying as a "${jobTitle}".

${existing.length > 0 ? `The candidate already lists these skills — do NOT repeat them: ${existing.join(", ")}.` : ""}

Return the skills as a JSON array of objects with this exact shape:
[{"category":"Category Name","items":["Skill 1","Skill 2","Skill 3"]}]

Rules:
- Group skills into 2-4 logical categories (e.g. "Design", "Tools", "Code", "Methods").
- Each category should have 3-6 items.
- Mix hard skills (tools, technologies, methodologies) with relevant soft skills.
- Be specific (e.g. "Figma" not "Design tools", "TypeScript" not "Programming").
- Return ONLY the JSON array, no markdown, no code fences, no commentary.`;

    const { openRouterChat } = await import("@/lib/openrouter");
    const raw = await openRouterChat([
      {
        role: "system",
        content:
          "You are a career advisor who suggests relevant, specific skills for job seekers. Return ONLY a valid JSON array, no markdown or commentary.",
      },
      { role: "user", content: prompt },
    ]);
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

    let categories: { category: string; items: string[] }[] = [];
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        categories = parsed
          .filter((x) => x && typeof x.category === "string" && Array.isArray(x.items))
          .map((x) => ({
            category: String(x.category).slice(0, 50),
            items: x.items.filter((i: unknown) => typeof i === "string").map((i: string) => i.slice(0, 60)),
          }))
          .filter((x) => x.items.length > 0);
      }
    } catch {
      // fallback: return a generic set
      categories = [
        { category: "Core", items: ["Communication", "Problem Solving", "Collaboration"] },
      ];
    }

    if (categories.length === 0) {
      return NextResponse.json({ error: "Could not parse suggestions" }, { status: 500 });
    }

    return NextResponse.json({ categories });
  } catch (e) {
    console.error("AI skills error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
