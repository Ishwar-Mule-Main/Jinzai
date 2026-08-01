import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";

// GET /api/admin/analytics — visitor & traffic analytics
export async function GET(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d";

    const now = new Date();
    const ranges: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90, all: 36500 };
    const days = ranges[range] || 30;
    const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    let pageViews: { path: string; referrer: string | null; device: string | null; sessionId: string | null; userId: string | null; isNew: boolean; createdAt: Date }[] = [];
    try {
      pageViews = await db.pageView.findMany({
        where: range === "all" ? undefined : { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      pageViews = [];
    }

    const totalViews = pageViews.length;
    const uniqueSessions = new Set(pageViews.map((p) => p.sessionId).filter(Boolean)).size;
    const uniqueUsers = new Set(pageViews.map((p) => p.userId).filter(Boolean)).size;
    const newVisitors = pageViews.filter((p) => p.isNew).length;

    // Daily series
    const dailyMap: Record<string, { views: number; visitors: number }> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = { views: 0, visitors: 0 };
    }
    const seenSessionsPerDay: Record<string, Set<string>> = {};
    for (const p of pageViews) {
      const key = new Date(p.createdAt).toISOString().slice(0, 10);
      if (key in dailyMap) {
        dailyMap[key].views += 1;
        if (p.sessionId) {
          seenSessionsPerDay[key] = seenSessionsPerDay[key] || new Set();
          if (!seenSessionsPerDay[key].has(p.sessionId)) {
            seenSessionsPerDay[key].add(p.sessionId);
            dailyMap[key].visitors += 1;
          }
        }
      }
    }
    const dailySeries = Object.entries(dailyMap).map(([date, v]) => ({ date, ...v }));

    // Top pages
    const pageCounts: Record<string, number> = {};
    for (const p of pageViews) pageCounts[p.path] = (pageCounts[p.path] || 0) + 1;
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([path, views]) => ({ path, views }));

    // Top referrers
    const refCounts: Record<string, number> = {};
    for (const p of pageViews) {
      if (p.referrer) {
        try {
          const host = new URL(p.referrer).host;
          refCounts[host] = (refCounts[host] || 0) + 1;
        } catch {
          refCounts[p.referrer] = (refCounts[p.referrer] || 0) + 1;
        }
      }
    }
    const topReferrers = Object.entries(refCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([source, visits]) => ({ source, visits }));

    // Devices
    const deviceCounts: Record<string, number> = {};
    for (const p of pageViews) {
      const d = p.device || "unknown";
      deviceCounts[d] = (deviceCounts[d] || 0) + 1;
    }

    // Conversion funnel
    const users = await db.user.findMany({ select: { id: true, plan: true, createdAt: true } });
    const totalUsers = users.length;
    const paidUsers = users.filter((u) => u.plan !== "free").length;
    const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;
    const signupRate = uniqueSessions > 0 ? (totalUsers / uniqueSessions) * 100 : 0;

    return NextResponse.json({
      range,
      totalViews,
      uniqueVisitors: uniqueSessions,
      uniqueUsers,
      newVisitors,
      dailySeries,
      topPages,
      topReferrers,
      devices: deviceCounts,
      funnel: {
        visitors: uniqueSessions,
        signups: totalUsers,
        paid: paidUsers,
        signupRate,
        conversionRate,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
