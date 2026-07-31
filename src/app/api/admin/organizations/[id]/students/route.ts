import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";
import { PLAN_LIMITS, type PlanId } from "@/lib/resume/plans";

export const runtime = "nodejs";

// POST /api/admin/organizations/[id]/students — create one or many student accounts under an org
// Body: { students: [{ studentId, name, email? }] } OR { studentId, name, email? } (single)
// Email auto-generated as {studentId}@{orguniquecode}.edu if not provided
// Password = studentId + org.uniqueCode (as specified by the user)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { id } = await params;
    const body = await req.json();

    const org = await db.organization.findUnique({ where: { id } });
    if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

    // Normalize input into an array of students
    let students: { studentId: string; name: string; email?: string }[] = [];
    if (Array.isArray(body.students)) {
      students = body.students;
    } else if (body.studentId) {
      students = [{ studentId: body.studentId, name: body.name, email: body.email }];
    } else {
      return NextResponse.json({ error: "Provide studentId (single) or students array" }, { status: 400 });
    }

    const planId = (body.plan as PlanId) || (org.plan as PlanId);
    const config = PLAN_LIMITS[planId];
    if (!config) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    const results: { studentId: string; name: string; email: string; password: string; status: "created" | "exists" | "error"; error?: string }[] = [];

    for (const s of students) {
      const studentId = String(s.studentId).trim();
      if (!studentId) {
        results.push({ studentId, name: s.name, email: "", password: "", status: "error", error: "Empty studentId" });
        continue;
      }
      // Auto-generate email if not provided
      const email = (s.email || `${studentId}@${org.uniqueCode.toLowerCase()}.edu`).toLowerCase();
      // Password = studentId + org.uniqueCode (e.g. "23001" + "IITABC" = "23001IITABC")
      const password = `${studentId}${org.uniqueCode}`;

      try {
        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
          results.push({ studentId, name: s.name, email, password: "•••• (already exists)", status: "exists" });
          continue;
        }
        const hashed = await bcrypt.hash(password, 10);
        const now = new Date();
        const planExpiresAt = config.durationDays
          ? new Date(now.getTime() + config.durationDays * 24 * 60 * 60 * 1000)
          : null;

        const user = await db.user.create({
          data: {
            email,
            name: s.name || `Student ${studentId}`,
            password: hashed,
            plan: planId,
            planExpiresAt,
            role: "student",
            organizationId: org.id,
            studentId,
          },
        });

        // Record a transaction (org-sponsored)
        if (config.price > 0) {
          await db.transaction.create({
            data: {
              userId: user.id,
              email: user.email,
              plan: planId,
              amount: config.price,
              status: "success",
              method: "org",
              note: `Org-sponsored: ${org.name} (${org.uniqueCode})`,
            },
          });
        }

        results.push({ studentId, name: s.name || `Student ${studentId}`, email, password, status: "created" });
      } catch (e) {
        results.push({ studentId, name: s.name, email, password, status: "error", error: (e as Error).message });
      }
    }

    return NextResponse.json({
      organization: { id: org.id, name: org.name, uniqueCode: org.uniqueCode },
      plan: planId,
      total: students.length,
      created: results.filter((r) => r.status === "created").length,
      exists: results.filter((r) => r.status === "exists").length,
      errors: results.filter((r) => r.status === "error").length,
      students: results,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
