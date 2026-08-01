import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";
import { PLAN_LIMITS, type PlanId } from "@/lib/resume/plans";

export const runtime = "nodejs";

// POST /api/admin/accounts/individual — create a single custom account with chosen access
// Body: { email, name, password, plan, planDurationDays?, sendWelcome? }
export async function POST(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const body = await req.json();
    const { email, name, password, plan, planDurationDays } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const planId = (plan as PlanId) || "free";
    const config = PLAN_LIMITS[planId];
    if (!config) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    const now = new Date();
    const planExpiresAt = planDurationDays
      ? new Date(now.getTime() + planDurationDays * 24 * 60 * 60 * 1000)
      : config.durationDays
      ? new Date(now.getTime() + config.durationDays * 24 * 60 * 60 * 1000)
      : null;

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
        password: hashed,
        plan: planId,
        planExpiresAt,
        role: "user",
      },
    });

    // Record a transaction if it's a paid plan
    if (planId !== "free" && config.price) {
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
      success: true,
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      planExpiresAt: user.planExpiresAt,
      loginUrl: "/",
      createdAt: user.createdAt,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
