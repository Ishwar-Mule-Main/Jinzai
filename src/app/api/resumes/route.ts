import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPlanConfig, canCreateResume } from "@/lib/resume/plans";
import type { ResumeData } from "@/lib/resume/types";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "resume";
}

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string })?.id || null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const resume = await db.resume.findUnique({ where: { id } });
      if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(resume);
    }

    const resumes = await db.resume.findMany({
      where: userId ? { userId } : {},
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        template: true,
        accentColor: true,
        fontFamily: true,
        contactLocked: true,
        userId: true,
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
    const userId = await getUserId();
    const body = await req.json();
    const { title, template, accentColor, fontFamily, content } = body;
    if (!title || !content) {
      return NextResponse.json({ error: "title and content are required" }, { status: 400 });
    }

    // Check plan limits if user is logged in
    if (userId) {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (user) {
        const count = await db.resume.count({ where: { userId } });
        if (!canCreateResume(user.plan, count)) {
          const config = getPlanConfig(user.plan);
          return NextResponse.json({
            error: `You've reached the resume limit (${config.maxResumes === -1 ? "unlimited" : config.maxResumes}) for the ${config.name} plan. Please upgrade to create more.`,
            limit: config.maxResumes,
            plan: user.plan,
          }, { status: 403 });
        }
      }
    }

    // Detect contact details in content for contact lock
    let contactLocked = false;
    try {
      const data: ResumeData = JSON.parse(content);
      if (data.personalInfo?.email || data.personalInfo?.phone) {
        const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
        const planConfig = getPlanConfig(user?.plan || "free");
        if (planConfig.contactLock) {
          contactLocked = true;
        }
      }
    } catch {
      // ignore parse errors
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
        contactLocked,
        userId,
      },
    });
    return NextResponse.json(resume, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    const { id, title, template, accentColor, fontFamily, content } = body;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Check ownership
    const existing = await db.resume.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.userId && existing.userId !== userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (template !== undefined) data.template = template;
    if (accentColor !== undefined) data.accentColor = accentColor;
    if (fontFamily !== undefined) data.fontFamily = fontFamily;
    if (content !== undefined) {
      data.content = content;
      // Set contact lock if not already locked and content has contact details
      if (!existing.contactLocked) {
        try {
          const parsed: ResumeData = JSON.parse(content);
          if (parsed.personalInfo?.email || parsed.personalInfo?.phone) {
            const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
            const planConfig = getPlanConfig(user?.plan || "free");
            if (planConfig.contactLock) {
              data.contactLocked = true;
            }
          }
        } catch {
          // ignore
        }
      }
    }

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
    const userId = await getUserId();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Check ownership
    const existing = await db.resume.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.userId && existing.userId !== userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await db.resume.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
