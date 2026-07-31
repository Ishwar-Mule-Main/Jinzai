import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";
import { PLAN_LIMITS, type PlanId } from "@/lib/resume/plans";

export const runtime = "nodejs";

// Demo organizations config
const DEMO_ORGS: {
  name: string;
  type: string;
  uniqueCode: string;
  contactEmail: string;
  plan: PlanId;
  seats: number;
}[] = [
  {
    name: "IIT Bombay",
    type: "college",
    uniqueCode: "IITBMB",
    contactEmail: "placements@iitb.ac.in",
    plan: "pro_499",
    seats: 200,
  },
  {
    name: "Delhi University",
    type: "university",
    uniqueCode: "DELUNI",
    contactEmail: "placements@du.ac.in",
    plan: "business_1999",
    seats: 500,
  },
  {
    name: "VIT Vellore",
    type: "university",
    uniqueCode: "VITVEL",
    contactEmail: "placements@vit.ac.in",
    plan: "pro_499",
    seats: 300,
  },
];

// 5 demo student names per org (will be reused across orgs)
const DEMO_STUDENT_NAMES = [
  "Aarav Sharma", "Diya Patel", "Vivaan Reddy", "Ananya Iyer", "Arjun Mehta",
];

// 8 demo individual users with varied plans + createdAt offsets (days ago)
const DEMO_INDIVIDUALS: {
  email: string;
  name: string;
  password: string;
  plan: PlanId;
  createdAtDaysAgo: number;
}[] = [
  { email: "rahul.verma.demo@gmail.com", name: "Rahul Verma", password: "demo1234", plan: "free", createdAtDaysAgo: 28 },
  { email: "priya.singh.demo@gmail.com", name: "Priya Singh", password: "demo1234", plan: "trial_99", createdAtDaysAgo: 18 },
  { email: "karan.malhotra.demo@outlook.com", name: "Karan Malhotra", password: "demo1234", plan: "pro_499", createdAtDaysAgo: 15 },
  { email: "neha.gupta.demo@yahoo.com", name: "Neha Gupta", password: "demo1234", plan: "pro_499", createdAtDaysAgo: 12 },
  { email: "rohit.nair.demo@gmail.com", name: "Rohit Nair", password: "demo1234", plan: "business_1999", createdAtDaysAgo: 9 },
  { email: "isha.kapoor.demo@gmail.com", name: "Isha Kapoor", password: "demo1234", plan: "trial_99", createdAtDaysAgo: 6 },
  { email: "aditya.joshi.demo@gmail.com", name: "Aditya Joshi", password: "demo1234", plan: "free", createdAtDaysAgo: 4 },
  { email: "sneha.raghav.demo@gmail.com", name: "Sneha Raghav", password: "demo1234", plan: "pro_499", createdAtDaysAgo: 1 },
];

// Random helpers
function randItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PAGE_PATHS = ["/", "/admin", "/pricing", "/templates", "/editor", "/resume/example", "/about", "/contact", "/login", "/signup"];
const REFERRERS = ["https://google.com", "https://linkedin.com", "https://instagram.com", "https://twitter.com", "https://youtube.com", null, null, null];
const DEVICES = ["mobile", "mobile", "mobile", "desktop", "desktop", "tablet"];

// 5 demo support tickets
const DEMO_TICKETS: {
  email: string;
  name: string;
  subject: string;
  message: string;
  status: "open" | "replied" | "resolved";
  reply?: string;
  createdAtDaysAgo: number;
}[] = [
  {
    email: "rahul.verma.demo@gmail.com",
    name: "Rahul Verma",
    subject: "Cannot export my resume to PDF",
    message: "Hi, I'm on the Free plan and the export button is disabled. Can you help?",
    status: "open",
    createdAtDaysAgo: 2,
  },
  {
    email: "karan.malhotra.demo@outlook.com",
    name: "Karan Malhotra",
    subject: "Payment successful but plan not upgraded",
    message: "I paid ₹499 via UPI but my account still shows Free plan. Please check.",
    status: "replied",
    reply: "Hi Karan, thanks for reaching out. We've manually upgraded your account to Pro. Please log out and log back in.",
    createdAtDaysAgo: 5,
  },
  {
    email: "aarav.sharma@iitbmb.edu",
    name: "Aarav Sharma",
    subject: "Template preview not loading",
    message: "When I click on Campus Navy template, the preview stays blank. Tried refreshing.",
    status: "open",
    createdAtDaysAgo: 1,
  },
  {
    email: "neha.gupta.demo@yahoo.com",
    name: "Neha Gupta",
    subject: "How do I add a custom section?",
    message: "I want to add an 'Achievements' section to my resume but don't see the option.",
    status: "resolved",
    reply: "Hi Neha, you can add custom sections via the 'Add Section' dropdown in the editor. Marking this as resolved.",
    createdAtDaysAgo: 7,
  },
  {
    email: "rohit.nair.demo@gmail.com",
    name: "Rohit Nair",
    subject: "Bulk resume creation for my team",
    message: "We have 10 people in our company who need resumes. Can we get a team discount on Business plan?",
    status: "replied",
    reply: "Hi Rohit, yes! We offer 20% off for teams of 5+. Let me connect you with our sales team.",
    createdAtDaysAgo: 3,
  },
];

export async function POST(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();

    const now = new Date();
    let orgsCreated = 0;
    let studentsCreated = 0;
    let individualsCreated = 0;
    let transactionsCreated = 0;
    let pageViewsCreated = 0;
    let ticketsCreated = 0;

    // ---------------------------------------------------------
    // 1. ORGANIZATIONS
    // ---------------------------------------------------------
    for (const o of DEMO_ORGS) {
      // Skip if an org with this uniqueCode already exists
      const existing = await db.organization.findUnique({ where: { uniqueCode: o.uniqueCode } }).catch(() => null);
      if (existing) {
        continue;
      }
      await db.organization.create({
        data: {
          name: o.name,
          type: o.type,
          uniqueCode: o.uniqueCode,
          contactEmail: o.contactEmail,
          contactPhone: null,
          plan: o.plan,
          seats: o.seats,
          notes: "Demo data — auto-seeded",
        },
      }).catch(() => null);
      orgsCreated++;
    }

    // ---------------------------------------------------------
    // 2. STUDENTS (5 per org)
    // ---------------------------------------------------------
    for (let orgIdx = 0; orgIdx < DEMO_ORGS.length; orgIdx++) {
      const o = DEMO_ORGS[orgIdx];
      const org = await db.organization.findUnique({ where: { uniqueCode: o.uniqueCode } }).catch(() => null);
      if (!org) continue;

      const config = PLAN_LIMITS[o.plan];
      if (!config) continue;

      for (let i = 0; i < DEMO_STUDENT_NAMES.length; i++) {
        const studentId = String(10001 + i + orgIdx * 100);
        const email = `${studentId}@${org.uniqueCode.toLowerCase()}.edu`;
        const password = `${studentId}${org.uniqueCode}`;

        // Skip if already exists
        const existing = await db.user.findUnique({ where: { email } }).catch(() => null);
        if (existing) continue;

        const hashed = await bcrypt.hash(password, 10);
        const planExpiresAt = config.durationDays
          ? new Date(now.getTime() + config.durationDays * 24 * 60 * 60 * 1000)
          : null;

        const user = await db.user.create({
          data: {
            email,
            name: DEMO_STUDENT_NAMES[i],
            password: hashed,
            plan: o.plan,
            planExpiresAt,
            role: "student",
            organizationId: org.id,
            studentId,
            createdAt: new Date(now.getTime() - randInt(1, 20) * 24 * 60 * 60 * 1000),
          },
        }).catch(() => null);

        if (user && config.price > 0) {
          await db.transaction.create({
            data: {
              userId: user.id,
              email: user.email,
              plan: o.plan,
              amount: config.price,
              status: "success",
              method: "org",
              note: `Org-sponsored: ${org.name} (${org.uniqueCode}) [demo]`,
              createdAt: user.createdAt,
            },
          }).catch(() => null);
          transactionsCreated++;
        }
        studentsCreated++;
      }
    }

    // ---------------------------------------------------------
    // 3. INDIVIDUAL DEMO USERS
    // ---------------------------------------------------------
    for (const u of DEMO_INDIVIDUALS) {
      const existing = await db.user.findUnique({ where: { email: u.email.toLowerCase() } }).catch(() => null);
      if (existing) continue;

      const config = PLAN_LIMITS[u.plan];
      if (!config) continue;

      const hashed = await bcrypt.hash(u.password, 10);
      const planExpiresAt = config.durationDays
        ? new Date(now.getTime() + config.durationDays * 24 * 60 * 60 * 1000)
        : null;
      const createdAt = new Date(now.getTime() - u.createdAtDaysAgo * 24 * 60 * 60 * 1000);

      const user = await db.user.create({
        data: {
          email: u.email.toLowerCase(),
          name: u.name,
          password: hashed,
          plan: u.plan,
          planExpiresAt,
          role: "user",
          createdAt,
        },
      }).catch(() => null);

      if (user && u.plan !== "free" && config.price > 0) {
        await db.transaction.create({
          data: {
            userId: user.id,
            email: user.email,
            plan: u.plan,
            amount: config.price,
            status: "success",
            method: "upi",
            note: `Demo: ${config.name} plan purchase`,
            createdAt,
          },
        }).catch(() => null);
        transactionsCreated++;
      }
      individualsCreated++;
    }

    // ---------------------------------------------------------
    // 4. PAGE VIEWS (~300 over last 30 days)
    // ---------------------------------------------------------
    const PAGE_VIEW_TARGET = 300;
    // Generate ~40 unique session IDs across the 30-day window
    const sessions: string[] = [];
    for (let i = 0; i < 40; i++) {
      sessions.push(`demo-sess-${i}-${Math.random().toString(36).slice(2, 10)}`);
    }

    for (let i = 0; i < PAGE_VIEW_TARGET; i++) {
      const daysAgo = randInt(0, 29);
      const minutesAgo = randInt(0, 24 * 60);
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - minutesAgo * 60 * 1000);
      const sessionId = randItem(sessions);
      await db.pageView.create({
        data: {
          path: randItem(PAGE_PATHS),
          referrer: randItem(REFERRERS),
          device: randItem(DEVICES),
          sessionId,
          userId: null,
          isNew: Math.random() < 0.25,
          createdAt,
        },
      }).catch(() => null);
      pageViewsCreated++;
    }

    // ---------------------------------------------------------
    // 5. SUPPORT TICKETS
    // ---------------------------------------------------------
    for (const t of DEMO_TICKETS) {
      const existing = await db.supportTicket.findFirst({
        where: { email: t.email, subject: t.subject },
      }).catch(() => null);
      if (existing) continue;

      await db.supportTicket.create({
        data: {
          email: t.email,
          name: t.name,
          subject: t.subject,
          message: t.message,
          status: t.status,
          reply: t.reply || null,
          createdAt: new Date(now.getTime() - t.createdAtDaysAgo * 24 * 60 * 60 * 1000),
        },
      }).catch(() => null);
      ticketsCreated++;
    }

    return NextResponse.json({
      success: true,
      results: {
        orgs: orgsCreated,
        students: studentsCreated,
        users: individualsCreated,
        transactions: transactionsCreated,
        pageViews: pageViewsCreated,
        tickets: ticketsCreated,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
