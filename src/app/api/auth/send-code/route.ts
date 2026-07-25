import { NextRequest, NextResponse } from "next/server";
import { generateCode } from "@/lib/auth";

export const runtime = "nodejs";

// POST /api/auth/send-code — generate a 6-digit login code and "send" it
// In production, this would email the code. In demo, the code is returned for display.
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const code = generateCode(email);

    // In production: send email here.
    // In demo: return the code so the UI can display it in a toast.
    return NextResponse.json({
      success: true,
      message: `Login code sent to ${email}`,
      // Demo only: include code in response for toast display
      demoCode: code,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
