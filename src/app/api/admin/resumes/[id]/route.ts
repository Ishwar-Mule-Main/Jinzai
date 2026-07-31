import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";

// GET /api/admin/resumes/[id] — get a single resume (full content)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { id } = await params;

    const resume = await db.resume.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    return NextResponse.json({ resume });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// PUT /api/admin/resumes/[id] — update resume fields (title, template, accentColor, fontFamily, content)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { id } = await params;
    const body = await req.json();
    const { title, template, accentColor, fontFamily, content, contactLocked } = body;

    const existing = await db.resume.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (template !== undefined) data.template = template;
    if (accentColor !== undefined) data.accentColor = accentColor;
    if (fontFamily !== undefined) data.fontFamily = fontFamily;
    if (content !== undefined) data.content = content;
    if (contactLocked !== undefined) data.contactLocked = contactLocked;

    const resume = await db.resume.update({ where: { id }, data });
    return NextResponse.json({ resume });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// DELETE /api/admin/resumes/[id] — delete a resume
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { id } = await params;

    const existing = await db.resume.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    await db.resume.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
