import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const ADMIN_EMAIL = "Ishwar.mule007@gmail.com";

// PUT /api/admin/tickets — reply to a support ticket
export async function PUT(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = auth.replace("Bearer ", "");
    const decoded = Buffer.from(token, "base64").toString();
    if (!decoded.startsWith(ADMIN_EMAIL)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId, reply } = await req.json();
    if (!ticketId || !reply) {
      return NextResponse.json({ error: "ticketId and reply are required" }, { status: 400 });
    }

    const ticket = await db.supportTicket.update({
      where: { id: ticketId },
      data: { reply, status: "replied", updatedAt: new Date() },
    });
    return NextResponse.json(ticket);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
