import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";
import { PLAN_LIMITS, type PlanId } from "@/lib/resume/plans";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

// Generate a unique code for an organization (6-char alphanumeric, uppercase)
function generateUniqueCode(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${base}${rand}`;
}

// GET /api/admin/organizations — list all organizations with student counts
export async function GET(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const orgs = await db.organization.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { users: true } },
      },
    });
    return NextResponse.json({
      organizations: orgs.map((o) => ({
        id: o.id,
        name: o.name,
        type: o.type,
        uniqueCode: o.uniqueCode,
        contactEmail: o.contactEmail,
        contactPhone: o.contactPhone,
        plan: o.plan,
        seats: o.seats,
        notes: o.notes,
        studentCount: o._count.users,
        createdAt: o.createdAt,
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// POST /api/admin/organizations — create a new organization/college
export async function POST(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const body = await req.json();
    const { name, type, uniqueCode, contactEmail, contactPhone, password, plan, seats, notes } = body;

    if (!name) return NextResponse.json({ error: "College / Organization name is required" }, { status: 400 });
    if (!contactEmail) return NextResponse.json({ error: "Institutional contact email is required" }, { status: 400 });
    if (!password) return NextResponse.json({ error: "Institutional admin password is required" }, { status: 400 });
    if (!contactPhone) return NextResponse.json({ error: "Contact phone number is required" }, { status: 400 });

    const code = (uniqueCode || generateUniqueCode(name)).toUpperCase();
    // Ensure uniqueness
    const existing = await db.organization.findUnique({ where: { uniqueCode: code } });
    if (existing) {
      return NextResponse.json({ error: "Unique portal code already in use. Try another." }, { status: 400 });
    }

    const planId = (plan as PlanId) || "pro_399";
    if (!PLAN_LIMITS[planId]) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    const org = await db.organization.create({
      data: {
        name,
        type: type || "college",
        uniqueCode: code,
        contactEmail: contactEmail.trim().toLowerCase(),
        contactPhone: contactPhone.trim(),
        plan: planId,
        seats: Number(seats) || 300,
        notes: notes || null,
      },
    });

    // Hash admin password and create/upsert Institutional Admin User
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = await db.user.upsert({
      where: { email: contactEmail.trim().toLowerCase() },
      update: {
        name: `${name} Placement Cell Admin`,
        password: hashedPassword,
        role: "org_admin",
        organizationId: org.id,
        plan: planId,
      },
      create: {
        email: contactEmail.trim().toLowerCase(),
        name: `${name} Placement Cell Admin`,
        password: hashedPassword,
        role: "org_admin",
        organizationId: org.id,
        plan: planId,
      },
    });

    return NextResponse.json({
      id: org.id,
      name: org.name,
      type: org.type,
      uniqueCode: org.uniqueCode,
      contactEmail: org.contactEmail,
      contactPhone: org.contactPhone,
      adminEmail: adminUser.email,
      plan: org.plan,
      seats: org.seats,
      createdAt: org.createdAt,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// DELETE /api/admin/organizations — delete an organization (students are unlinked, not deleted)
export async function DELETE(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    // Unlink students first (set organizationId null)
    await db.user.updateMany({ where: { organizationId: id }, data: { organizationId: null } });
    await db.organization.delete({ where: { id } });

    return NextResponse.json({ success: true, id });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
