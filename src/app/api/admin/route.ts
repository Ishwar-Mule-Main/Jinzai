import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const ADMIN_EMAIL = "Ishwar.mule007@gmail.com";
const ADMIN_PASSWORD = "Ishwar@2513";

// POST /api/admin — admin login
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Return a simple admin token (in production, use JWT or session)
      const token = Buffer.from(`${ADMIN_EMAIL}:${Date.now()}`).toString("base64");
      return NextResponse.json({ token, email: ADMIN_EMAIL });
    }
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// GET /api/admin — verify admin token + get dashboard stats
export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Simple token check (in production, verify JWT)
    const token = auth.replace("Bearer ", "");
    const decoded = Buffer.from(token, "base64").toString();
    if (!decoded.startsWith(ADMIN_EMAIL)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Gather stats
    const users = await db.user.findMany({
      select: {
        id: true, email: true, name: true, plan: true, planExpiresAt: true,
        createdAt: true, updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const resumes = await db.resume.findMany({
      select: { id: true, title: true, template: true, userId: true, createdAt: true, contactLocked: true },
    });

    const tickets = await db.supportTicket?.findMany?.({
      orderBy: { createdAt: "desc" },
    }).catch(() => []) || [];

    // Calculate revenue (simulated — each paid plan's price)
    const planPrices: Record<string, number> = {
      trial_99: 99, pro_499: 499, business_1999: 1999,
    };
    let totalRevenue = 0;
    const revenueByPlan: Record<string, number> = {};
    for (const u of users) {
      if (u.plan !== "free" && planPrices[u.plan]) {
        totalRevenue += planPrices[u.plan];
        revenueByPlan[u.plan] = (revenueByPlan[u.plan] || 0) + planPrices[u.plan];
      }
    }

    const activePaid = users.filter((u) => u.plan !== "free").length;
    const expired = users.filter((u) => u.plan !== "free" && u.planExpiresAt && new Date(u.planExpiresAt) < new Date()).length;
    const freeUsers = users.filter((u) => u.plan === "free").length;

    return NextResponse.json({
      stats: {
        totalUsers: users.length,
        freeUsers,
        activePaid,
        expired,
        totalResumes: resumes.length,
        totalRevenue,
        revenueByPlan,
        openTickets: tickets.filter((t: { status?: string }) => t.status !== "resolved").length,
      },
      users: users.map((u) => ({
        ...u,
        resumeCount: resumes.filter((r) => r.userId === u.id).length,
      })),
      resumes: resumes.slice(0, 50),
      tickets,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
