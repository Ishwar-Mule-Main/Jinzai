import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

// POST /api/track — record a page view
// Body: { path, referrer?, sessionId?, userId?, device? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, referrer, sessionId, userId } = body;

    if (!path) return NextResponse.json({ ok: false }, { status: 400 });

    // Detect device from user-agent
    const ua = req.headers.get("user-agent") || "";
    let device = "desktop";
    if (/mobile|android|iphone|ipod/i.test(ua)) device = "mobile";
    else if (/ipad|tablet/i.test(ua)) device = "tablet";

    // Determine if this is a new visitor for the session
    let isNew = false;
    if (sessionId) {
      const existing = await db.pageView.findFirst({ where: { sessionId } }).catch(() => null);
      isNew = !existing;
    }

    await db.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        device,
        sessionId: sessionId || null,
        userId: userId || null,
        isNew,
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
