import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";

// GET /api/admin/users/[id]/resumes — list all resumes for a user (with full content)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { id } = await params;

    const resumes = await db.resume.findMany({
      where: { userId: id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true, title: true, slug: true, template: true, accentColor: true,
        fontFamily: true, content: true, isShared: true, contactLocked: true,
        createdAt: true, updatedAt: true,
      },
    });

    return NextResponse.json({ resumes });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
