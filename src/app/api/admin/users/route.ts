import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";
import { PLAN_LIMITS, type PlanId } from "@/lib/resume/plans";

export const runtime = "nodejs";

// GET /api/admin/users — list users with search/filter
export async function GET(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();
    const plan = searchParams.get("plan") || "";
    const role = searchParams.get("role") || "";

    const where: Record<string, unknown> = {};
    if (q) {
      where.OR = [
        { email: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
        { studentId: { contains: q, mode: "insensitive" } },
      ];
    }
    if (plan) where.plan = plan;
    if (role) where.role = role;

    const users = await db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { resumes: true, transactions: true } },
        organization: { select: { name: true, uniqueCode: true } },
      },
    });

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        plan: u.plan,
        planExpiresAt: u.planExpiresAt,
        role: u.role,
        studentId: u.studentId,
        organizationId: u.organizationId,
        organization: u.organization,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        resumeCount: u._count.resumes,
        transactionCount: u._count.transactions,
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// POST /api/admin/users — create a new user account (admin manual creation)
export async function POST(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const body = await req.json();
    const { email, name, password, plan, planDurationDays, role, organizationId, studentId, sendWelcome } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const now = new Date();
    const planId = (plan as PlanId) || "free";
    const config = PLAN_LIMITS[planId];
    const planExpiresAt = planDurationDays
      ? new Date(now.getTime() + planDurationDays * 24 * 60 * 60 * 1000)
      : config?.durationDays
      ? new Date(now.getTime() + config.durationDays * 24 * 60 * 60 * 1000)
      : null;

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
        password: hashed,
        plan: planId,
        planExpiresAt,
        role: role || "user",
        organizationId: organizationId || null,
        studentId: studentId || null,
      },
    });

    // Record a transaction if it's a paid plan
    if (planId !== "free" && config?.price) {
      await db.transaction.create({
        data: {
          userId: user.id,
          email: user.email,
          plan: planId,
          amount: config.price,
          status: "success",
          method: "manual",
          note: `Admin-created account with ${config.name} plan`,
        },
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      role: user.role,
      planExpiresAt: user.planExpiresAt,
      createdAt: user.createdAt,
      sendWelcome: !!sendWelcome,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
