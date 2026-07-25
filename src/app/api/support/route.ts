import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

// POST /api/support — create a support ticket
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, subject, message } = body;
    if (!email || !subject || !message) {
      return NextResponse.json({ error: "Email, subject, and message are required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || null;

    const ticket = await db.supportTicket.create({
      data: { userId, email, name: name || null, subject, message, status: "open" },
    });
    return NextResponse.json(ticket, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// GET /api/support — get user's tickets + replies
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ tickets: [] });
    const userId = (session.user as { id: string }).id;
    const tickets = await db.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ tickets });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
