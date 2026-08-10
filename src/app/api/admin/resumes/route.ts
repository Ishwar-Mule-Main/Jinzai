import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";

// GET /api/admin/resumes — list all resumes with filters (individual vs student)
export async function GET(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();
    const type = searchParams.get("type") || "all"; // all | individual | student

    const where: Record<string, unknown> = {};

    if (type === "individual") {
      where.user = { role: { not: "student" } };
    } else if (type === "student") {
      where.user = { role: "student" };
    }

    if (q) {
      where.AND = [
        {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { template: { contains: q, mode: "insensitive" } },
            { user: { email: { contains: q, mode: "insensitive" } } },
            { user: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
      ];
    }

    const resumes = await db.resume.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 200,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            studentId: true,
            organization: { select: { name: true, uniqueCode: true } },
          },
        },
      },
    });

    return NextResponse.json({
      total: resumes.length,
      resumes: resumes.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        template: r.template,
        accentColor: r.accentColor,
        fontFamily: r.fontFamily,
        contactLocked: r.contactLocked,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        user: r.user
          ? {
              id: r.user.id,
              email: r.user.email,
              name: r.user.name,
              role: r.user.role,
              studentId: r.user.studentId,
              organization: r.user.organization,
            }
          : null,
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
