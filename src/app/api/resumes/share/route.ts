import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function genToken() {
  return (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
}

// POST /api/resumes/share?id=... — toggle sharing on/off, returns share token + URL
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const existing = await db.resume.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Toggle
    if (existing.isShared && existing.shareToken) {
      // Turn off sharing
      const updated = await db.resume.update({
        where: { id },
        data: { isShared: false, shareToken: null },
      });
      return NextResponse.json({ shared: false, shareToken: null, url: null });
    } else {
      // Turn on sharing
      const shareToken = genToken();
      const updated = await db.resume.update({
        where: { id },
        data: { isShared: true, shareToken },
      });
      const url = `/share/${shareToken}`;
      return NextResponse.json({ shared: true, shareToken, url });
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// GET /api/resumes/share?id=... — get current share status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const resume = await db.resume.findUnique({
      where: { id },
      select: { isShared: true, shareToken: true },
    });
    if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      shared: resume.isShared,
      shareToken: resume.shareToken,
      url: resume.shareToken ? `/share/${resume.shareToken}` : null,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
