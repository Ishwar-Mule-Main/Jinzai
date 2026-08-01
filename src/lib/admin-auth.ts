// Admin authentication helper — shared across all admin API routes
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "Ishwar.mule007@gmail.com";
const ADMIN_PASSWORD = "Ishwar@2513";

export const ADMIN_CREDENTIALS = { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };

/**
 * Verify the admin bearer token from the Authorization header.
 * Returns true if valid, false otherwise.
 */
export function verifyAdmin(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return false;
  const token = auth.replace("Bearer ", "");
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const tokenEmail = decoded.split(":")[0];
    return tokenEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  } catch {
    return false;
  }
}

export function adminUnauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * Login admin — returns token if credentials match.
 */
export function adminLogin(email: string, password: string): string | null {
  if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    return Buffer.from(`${ADMIN_EMAIL}:${Date.now()}`).toString("base64");
  }
  return null;
}
