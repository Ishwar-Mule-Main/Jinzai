import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";

// GET /api/admin/finance — detailed financial analytics
export async function GET(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d"; // 7d | 30d | 90d | all

    const now = new Date();
    const ranges: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90, all: 36500 };
    const days = ranges[range] || 30;
    const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const transactions = await db.transaction.findMany({
      where: range === "all" ? undefined : { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true, name: true } } },
    });

    const users = await db.user.findMany({
      select: { id: true, email: true, name: true, plan: true, planExpiresAt: true, createdAt: true },
    });

    const planPrices: Record<string, number> = { trial_99: 99, pro_499: 499, business_1999: 1999 };

    // Ledger-based revenue
    const successful = transactions.filter((t) => t.status === "success");
    const totalRevenue = successful.reduce((s, t) => s + t.amount, 0);
    const revenueByPlan: Record<string, number> = {};
    for (const t of successful) {
      revenueByPlan[t.plan] = (revenueByPlan[t.plan] || 0) + t.amount;
    }

    // MRR estimate (monthly recurring from pro_499 + business_1999 in last 30 days)
    const mrr = successful
      .filter((t) => (t.plan === "pro_499" || t.plan === "business_1999"))
      .reduce((s, t) => s + t.amount, 0);

    // Daily revenue series for chart (last N days)
    const dailyMap: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = 0;
    }
    for (const t of successful) {
      const key = new Date(t.createdAt).toISOString().slice(0, 10);
      if (key in dailyMap) dailyMap[key] += t.amount;
    }
    const dailySeries = Object.entries(dailyMap).map(([date, amount]) => ({ date, amount }));

    // Active paid + conversion
    const activePaid = users.filter((u) => u.plan !== "free").length;
    const totalUsers = users.length;
    const conversionRate = totalUsers > 0 ? (activePaid / totalUsers) * 100 : 0;
    const arpu = activePaid > 0 ? totalRevenue / activePaid : 0;

    // Plan distribution
    const planDist: Record<string, number> = {};
    for (const u of users) planDist[u.plan] = (planDist[u.plan] || 0) + 1;

    // Refunds
    const refunds = transactions.filter((t) => t.status === "refunded").reduce((s, t) => s + t.amount, 0);

    // If ledger is empty, estimate revenue from current plans (fallback)
    let estimatedRevenue = totalRevenue;
    const revenueByPlanEstimate: Record<string, number> = { ...revenueByPlan };
    if (estimatedRevenue === 0) {
      for (const u of users) {
        if (u.plan !== "free" && planPrices[u.plan]) {
          estimatedRevenue += planPrices[u.plan];
          revenueByPlanEstimate[u.plan] = (revenueByPlanEstimate[u.plan] || 0) + planPrices[u.plan];
        }
      }
    }

    return NextResponse.json({
      range,
      totalRevenue: estimatedRevenue,
      ledgerRevenue: totalRevenue,
      revenueByPlan: revenueByPlanEstimate,
      mrr,
      refunds,
      activePaid,
      totalUsers,
      conversionRate,
      arpu,
      planDistribution: planDist,
      dailySeries,
      transactions: transactions.slice(0, 200).map((t) => ({
        id: t.id,
        email: t.email,
        userName: t.user?.name,
        plan: t.plan,
        amount: t.amount,
        status: t.status,
        method: t.method,
        note: t.note,
        createdAt: t.createdAt,
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
