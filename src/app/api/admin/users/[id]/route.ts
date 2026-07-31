import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";
import { PLAN_LIMITS, type PlanId } from "@/lib/resume/plans";

export const runtime = "nodejs";

// GET /api/admin/users/[id] — get a single user with full details
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      include: {
        resumes: { select: { id: true, title: true, template: true, createdAt: true, updatedAt: true, contactLocked: true } },
        transactions: { orderBy: { createdAt: "desc" }, take: 50 },
        organization: { select: { id: true, name: true, uniqueCode: true } },
      },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// PUT /api/admin/users/[id] — update a user (name, email, plan, planExpiresAt, role, password)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { id } = await params;
    const body = await req.json();
    const { name, email, plan, planDurationDays, planExpiresAt, role, organizationId, studentId, password, resetPlan } = body;

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name || null;
    if (email !== undefined) {
      const conflict = await db.user.findUnique({ where: { email: email.toLowerCase() } });
      if (conflict && conflict.id !== id) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
      data.email = email.toLowerCase();
    }
    if (plan !== undefined) {
      const planId = plan as PlanId;
      if (!PLAN_LIMITS[planId]) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      data.plan = planId;
      // Set expiry based on plan duration or custom duration
      const config = PLAN_LIMITS[planId];
      if (resetPlan) {
        data.planExpiresAt = config?.durationDays
          ? new Date(Date.now() + config.durationDays * 24 * 60 * 60 * 1000)
          : null;
      } else if (planDurationDays !== undefined) {
        data.planExpiresAt = new Date(Date.now() + planDurationDays * 24 * 60 * 60 * 1000);
      }
      // Record a transaction when plan changes to a paid plan
      if (planId !== existing.plan && planId !== "free" && config?.price) {
        await db.transaction.create({
          data: {
            userId: id,
            email: existing.email,
            plan: planId,
            amount: config.price,
            status: "success",
            method: "manual",
            note: `Admin ${existing.plan} → ${planId} upgrade`,
          },
        });
      }
    }
    if (planExpiresAt !== undefined) data.planExpiresAt = planExpiresAt ? new Date(planExpiresAt) : null;
    if (role !== undefined) data.role = role;
    if (organizationId !== undefined) data.organizationId = organizationId || null;
    if (studentId !== undefined) data.studentId = studentId || null;
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await db.user.update({ where: { id }, data });
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      planExpiresAt: user.planExpiresAt,
      role: user.role,
      organizationId: user.organizationId,
      studentId: user.studentId,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] — permanently delete a user and all their data
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { id } = await params;

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Cascade delete resumes (set userId null is not an option due to relation; use deleteMany)
    await db.resume.deleteMany({ where: { userId: id } });
    await db.transaction.updateMany({ where: { userId: id }, data: { userId: null } });
    await db.user.delete({ where: { id } });

    return NextResponse.json({ success: true, id });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
