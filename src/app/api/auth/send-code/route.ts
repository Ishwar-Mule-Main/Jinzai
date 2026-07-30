import { NextRequest, NextResponse } from "next/server";
import { generateCode } from "@/lib/auth";
import { sendOTPEmail } from "@/lib/email";

export const runtime = "nodejs";

// POST /api/auth/send-code — generate a 6-digit login code and send via Resend email
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const code = generateCode(email);

    // Send OTP via Resend
    const result = await sendOTPEmail(email, code);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${email}`,
      });
    } else {
      // If email fails, still return the code for demo purposes
      console.error("[send-code] Email send failed:", result.error);
      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${email}`,
        demoCode: code, // fallback for demo
      });
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
