import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/share/[token] — fetch a shared resume by its token (public, read-only)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

    const resume = await db.resume.findUnique({
      where: { shareToken: token },
    });
    if (!resume || !resume.isShared) {
      return NextResponse.json({ error: "Resume not found or not shared" }, { status: 404 });
    }
    return NextResponse.json({
      title: resume.title,
      template: resume.template,
      accentColor: resume.accentColor,
      fontFamily: resume.fontFamily,
      content: resume.content,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
