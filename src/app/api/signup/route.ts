import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSignupData, generateCode } from "@/lib/auth";
import { sendOTPEmail } from "@/lib/email";

export const runtime = "nodejs";

// POST /api/signup — Step 1: Register email+name+password, send OTP
export async function POST(req: NextRequest) {
  try {
    const { email, password, name, plan } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists. Please log in." }, { status: 409 });
    }

    // Store signup data temporarily (until OTP verified)
    setSignupData(normalizedEmail, name || email.split("@")[0], password, plan || "free");

    // Generate and send OTP
    const code = generateCode(normalizedEmail);
    const emailResult = await sendOTPEmail(normalizedEmail, code, name);

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}. Check your inbox (and spam folder).`,
      emailSent: emailResult.success,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
