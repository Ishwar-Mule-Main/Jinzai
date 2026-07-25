import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { position, company, description } = body;

    if (!position) {
      return NextResponse.json({ error: "position is required" }, { status: 400 });
    }

    const prompt = `Generate 3 to 4 achievement bullet points for a resume experience entry.

Role: ${position}${company ? ` at ${company}` : ""}
${description ? `Context: ${description}` : ""}

Requirements:
- Each bullet must start with a strong action verb (Led, Built, Shipped, Drove, Reduced, Launched, etc.).
- Quantify impact with realistic placeholder metrics (e.g. "by 30%", "for 10K+ users", "$2M ARR").
- One sentence each, max 22 words.
- No first person, no fluff.
- Return as a JSON array of strings, e.g. ["Led...", "Built...", "Shipped..."]`;

    const { openRouterChat } = await import("@/lib/openrouter");
    const raw = await openRouterChat([
      {
        role: "system",
        content:
          "You are an expert resume writer. Return ONLY a valid JSON array of strings, no markdown, no code fences, no commentary.",
      },
      { role: "user", content: prompt },
    ]);
    let bullets: string[] = [];
    // Try to parse JSON; tolerate code fences
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        bullets = parsed.filter((x) => typeof x === "string").map((x) => x.trim());
      }
    } catch {
      // Fallback: split by newlines and strip bullets
      bullets = cleaned
        .split(/\n+/)
        .map((l) => l.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);
    }

    if (bullets.length === 0) {
      return NextResponse.json({ error: "Could not parse bullets" }, { status: 500 });
    }
    return NextResponse.json({ bullets: bullets.slice(0, 5) });
  } catch (e) {
    console.error("AI bullets error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
