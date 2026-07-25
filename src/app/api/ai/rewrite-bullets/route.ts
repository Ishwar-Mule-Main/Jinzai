import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Rewrite weak achievement bullets to be quantified + action-verb powered
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { position, company, bullets } = body;

    if (!Array.isArray(bullets) || bullets.length === 0) {
      return NextResponse.json({ error: "bullets array is required" }, { status: 400 });
    }

    const bulletsText = bullets.map((b: string, i: number) => `${i + 1}. ${b}`).join("\n");

    const prompt = `Rewrite these resume achievement bullets to be more impactful. Each bullet should:
- Start with a strong action verb (Led, Built, Shipped, Drove, Reduced, Launched, etc.)
- Include realistic quantified metrics where missing (%, $, x, counts, time saved)
- Be concise (max 22 words)
- Be specific and concrete

Role: ${position || "Professional"}${company ? ` at ${company}` : ""}

Original bullets:
${bulletsText}

Return ONLY a JSON array of rewritten strings, same length as input. No markdown, no code fences.`;

    const { openRouterChat } = await import("@/lib/openrouter");
    const raw = await openRouterChat([
      {
        role: "system",
        content:
          "You are an expert resume writer. Return ONLY a valid JSON array of strings, no markdown or commentary.",
      },
      { role: "user", content: prompt },
    ]);
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

    let rewritten: string[] = [];
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        rewritten = parsed.filter((x) => typeof x === "string").map((x) => x.trim());
      }
    } catch {
      // Fallback: return originals
      rewritten = bullets;
    }

    if (rewritten.length === 0) {
      rewritten = bullets;
    }

    return NextResponse.json({ bullets: rewritten });
  } catch (e) {
    console.error("AI rewrite error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
