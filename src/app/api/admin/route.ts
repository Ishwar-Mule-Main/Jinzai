import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminLogin, verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";

// POST /api/admin — admin login
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const token = adminLogin(email, password);
    if (!token) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    return NextResponse.json({ token, email });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// GET /api/admin — verify admin token + get dashboard stats (fully resilient)
export async function GET(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();

    let users: any[] = [];
    try {
      users = await db.user.findMany({
        select: {
          id: true, email: true, name: true, plan: true, planExpiresAt: true,
          role: true, studentId: true, organizationId: true, createdAt: true, updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      users = [];
    }

    let resumes: any[] = [];
    try {
      resumes = await db.resume.findMany({
        select: { id: true, title: true, template: true, userId: true, createdAt: true, contactLocked: true },
      });
    } catch {
      resumes = [];
    }

    let tickets: { id: string; email: string; name: string | null; subject: string; message: string; status: string; reply: string | null; createdAt: Date }[] = [];
    try {
      tickets = await db.supportTicket.findMany({ orderBy: { createdAt: "desc" } });
    } catch {
      tickets = [];
    }

    let transactions: { amount: number; plan: string; status: string; createdAt: Date }[] = [];
    try {
      transactions = await db.transaction.findMany({ orderBy: { createdAt: "desc" } });
    } catch {
      transactions = [];
    }

    let orgsCount = 0;
    try {
      orgsCount = await db.organization.count();
    } catch {
      orgsCount = 0;
    }

    let pageViews = 0;
    let uniqueVisitors = 0;
    try {
      pageViews = await db.pageView.count();
      uniqueVisitors = await db.pageView.groupBy({ by: ["sessionId"] }).then((g) => g.length).catch(() => 0);
    } catch {
      pageViews = 0;
      uniqueVisitors = 0;
    }

    // Revenue calculations
    const planPrices: Record<string, number> = { trial_99: 99, pro_499: 499, business_1999: 1999 };
    let ledgerRevenue = 0;
    const revenueByPlan: Record<string, number> = {};
    for (const t of transactions) {
      if (t.status === "success") {
        ledgerRevenue += t.amount;
        revenueByPlan[t.plan] = (revenueByPlan[t.plan] || 0) + t.amount;
      }
    }
    let totalRevenue = ledgerRevenue;
    if (totalRevenue === 0) {
      for (const u of users) {
        if (u.plan && u.plan !== "free" && planPrices[u.plan]) {
          totalRevenue += planPrices[u.plan];
          revenueByPlan[u.plan] = (revenueByPlan[u.plan] || 0) + planPrices[u.plan];
        }
      }
    }

    const activePaid = users.filter((u) => u.plan && u.plan !== "free").length;
    const expired = users.filter((u) => u.plan && u.plan !== "free" && u.planExpiresAt && new Date(u.planExpiresAt) < new Date()).length;
    const freeUsers = users.filter((u) => !u.plan || u.plan === "free").length;
    const studentCount = users.filter((u) => u.role === "student").length;

    return NextResponse.json({
      stats: {
        totalUsers: users.length,
        freeUsers,
        activePaid,
        expired,
        totalResumes: resumes.length,
        totalRevenue,
        revenueByPlan,
        openTickets: tickets.filter((t) => t.status !== "resolved").length,
        organizations: orgsCount,
        students: studentCount,
        pageViews,
        uniqueVisitors,
        transactions: transactions.length,
      },
      users: users.map((u) => ({
        ...u,
        resumeCount: resumes.filter((r) => r.userId === u.id).length,
      })),
      resumes: resumes.slice(0, 50),
      tickets,
      transactions: transactions.slice(0, 100),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
