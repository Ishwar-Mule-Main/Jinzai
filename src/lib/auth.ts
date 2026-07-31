import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const DEMO_EMAIL = "ishwar@domainexpansion.in";
const DEMO_PASSWORD = "DomainEx@26";

// In-memory store for email verification codes
const codeStore = new Map<string, { code: string; expires: number }>();

export function generateCode(email: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codeStore.set(email.toLowerCase(), {
    code,
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
  return code;
}

export function verifyCode(email: string, code: string): boolean {
  const entry = codeStore.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expires) {
    codeStore.delete(email.toLowerCase());
    return false;
  }
  if (entry.code !== code) return false;
  codeStore.delete(email.toLowerCase());
  return true;
}

// Ensure the demo user exists with Business plan
async function ensureDemoUser() {
  try {
    const existing = await db.user.findUnique({ where: { email: DEMO_EMAIL } });
    if (!existing) {
      const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);
      await db.user.create({
        data: {
          email: DEMO_EMAIL,
          name: "Ishwar",
          password: hashed,
          plan: "business_1999",
        },
      });
    } else {
      // Update password to new one if different
      const match = await bcrypt.compare(DEMO_PASSWORD, existing.password || "");
      if (!match && existing.password) {
        const newHashed = await bcrypt.hash(DEMO_PASSWORD, 10);
        await db.user.update({
          where: { id: existing.id },
          data: { password: newHashed, plan: "business_1999" },
        });
      }
    }
  } catch {
    // ignore
  }
}

async function findOrCreateUser(email: string, name?: string) {
  const normalized = email.toLowerCase();
  let user = await db.user.findUnique({ where: { email: normalized } });
  if (!user) {
    user = await db.user.create({
      data: { email: normalized, name: name || null, plan: "free" },
    });
  }
  return user;
}

const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    // 1. Email + Password
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await ensureDemoUser();
        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user || !user.password) return null;

        // Demo user shortcut
        if (credentials.email.toLowerCase() === DEMO_EMAIL && credentials.password === DEMO_PASSWORD) {
          return { id: user.id, email: user.email, name: user.name, plan: user.plan };
        }

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name, plan: user.plan };
      },
    }),

    // 2. Google OAuth — real Google login
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : []),

    // 3. Google simulation (fallback if OAuth not configured)
    CredentialsProvider({
      id: "google",
      name: "google",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const user = await findOrCreateUser(credentials.email, credentials.name || undefined);
        return { id: user.id, email: user.email, name: user.name, plan: user.plan };
      },
    }),

    // 4. Email verification code login
    CredentialsProvider({
      id: "email-code",
      name: "email-code",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) return null;
        if (!verifyCode(credentials.email, credentials.code)) return null;
        const user = await findOrCreateUser(credentials.email);
        return { id: user.id, email: user.email, name: user.name, plan: user.plan };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Handle Google OAuth sign-in
      if (account?.provider === "google" && user?.email) {
        const dbUser = await findOrCreateUser(user.email, user.name || undefined);
        token.id = dbUser.id;
        token.plan = dbUser.plan;
      } else if (user) {
        token.id = (user as { id: string }).id;
        token.plan = (user as { plan: string }).plan || "free";
      }
      if (token.id) {
        const dbUser = await db.user.findUnique({ where: { id: token.id as string } });
        if (dbUser) {
          token.plan = dbUser.plan;
          token.planExpiresAt = dbUser.planExpiresAt?.toISOString() || null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { plan?: string }).plan = (token.plan as string) || "free";
        (session.user as { planExpiresAt?: string | null }).planExpiresAt = token.planExpiresAt as string | null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "resumeforge-domain-expansion-secret-2025",
};
