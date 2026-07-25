import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "resume";
}

export async function GET() {
  try {
    const resumes = await db.resume.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        template: true,
        accentColor: true,
        fontFamily: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json({ resumes });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, template, accentColor, fontFamily, content } = body;
    if (!title || !content) {
      return NextResponse.json({ error: "title and content are required" }, { status: 400 });
    }
    const slug = `${slugify(title)}-${Date.now().toString(36)}`;
    const resume = await db.resume.create({
      data: {
        title,
        slug,
        template: template || "modern",
        accentColor: accentColor || "#0f766e",
        fontFamily: fontFamily || "inter",
        content,
      },
    });
    return NextResponse.json(resume, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, template, accentColor, fontFamily, content } = body;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (template !== undefined) data.template = template;
    if (accentColor !== undefined) data.accentColor = accentColor;
    if (fontFamily !== undefined) data.fontFamily = fontFamily;
    if (content !== undefined) data.content = content;

    const resume = await db.resume.update({
      where: { id },
      data,
    });
    return NextResponse.json(resume);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await db.resume.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
