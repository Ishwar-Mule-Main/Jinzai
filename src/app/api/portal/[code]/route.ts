import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

// GET /api/portal/[code] — public endpoint to fetch college/institution details by unique code
export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const normalizedCode = code.trim().toUpperCase();

    const org = await db.organization.findFirst({
      where: {
        OR: [
          { uniqueCode: { equals: normalizedCode, mode: "insensitive" } },
          { id: normalizedCode.toLowerCase() },
        ],
      },
      include: {
        _count: { select: { users: true } },
      },
    });

    if (!org) {
      return NextResponse.json({ error: "Institution portal not found" }, { status: 404 });
    }

    return NextResponse.json({
      organization: {
        id: org.id,
        name: org.name,
        type: org.type,
        uniqueCode: org.uniqueCode,
        plan: org.plan,
        seats: org.seats,
        studentCount: org._count.users,
        contactEmail: org.contactEmail,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
