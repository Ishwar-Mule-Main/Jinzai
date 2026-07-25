import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

// GET /api/me — returns current user's plan + resume count
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ user: null });
    }
    const userId = (session.user as { id: string }).id;
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ user: null });

    const resumeCount = await db.resume.count({ where: { userId } });

    // Check if plan expired
    let plan = user.plan;
    if (user.plan !== "free" && user.planExpiresAt && new Date(user.planExpiresAt) < new Date()) {
      // Plan expired — downgrade to free
      await db.user.update({ where: { id: userId }, data: { plan: "free" } });
      plan = "free";
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan,
        planExpiresAt: user.planExpiresAt?.toISOString() || null,
        resumeCount,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// PUT /api/me — update user profile (name only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = (session.user as { id: string }).id;
    const { name } = await req.json();
    const user = await db.user.update({
      where: { id: userId },
      data: { name },
    });
    return NextResponse.json({ id: user.id, email: user.email, name: user.name, plan: user.plan });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
