import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PLAN_LIMITS, type PlanId } from "@/lib/resume/plans";

export const runtime = "nodejs";

// POST /api/subscribe — set user plan (simulated payment)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = (session.user as { id: string }).id;
    const { plan } = await req.json();

    if (!PLAN_LIMITS[plan as PlanId]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const config = PLAN_LIMITS[plan as PlanId];
    const now = new Date();
    const planExpiresAt = config.durationDays
      ? new Date(now.getTime() + config.durationDays * 24 * 60 * 60 * 1000)
      : null; // business_1999 has no expiry (recurring monthly, but we don't auto-expire here)

    const user = await db.user.update({
      where: { id: userId },
      data: {
        plan,
        planExpiresAt,
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      plan: user.plan,
      planExpiresAt: user.planExpiresAt?.toISOString() || null,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
