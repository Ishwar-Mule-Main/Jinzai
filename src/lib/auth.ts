import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const DEMO_EMAIL = "ishwar@domainexpansion.in";
const DEMO_PASSWORD = "DomainEx@26";

// In-memory store for email verification codes
const codeStore = new Map<string, { code: string; expires: number; name?: string; password?: string }>();

export function generateCode(email: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codeStore.set(email.toLowerCase(), {
    ...codeStore.get(email.toLowerCase()),
    code,
    expires: Date.now() + 5 * 60 * 1000,
  });
  return code;
}

export function setSignupData(email: string, name: string, password: string, plan: string = "free") {
  codeStore.set(email.toLowerCase(), {
    code: codeStore.get(email.toLowerCase())?.code || "",
    expires: codeStore.get(email.toLowerCase())?.expires || 0,
    name,
    password,
    plan,
  });
}

export function getSignupData(email: string) {
  return codeStore.get(email.toLowerCase());
}

export function clearSignupData(email: string) {
  codeStore.delete(email.toLowerCase());
}

export function verifyCode(email: string, code: string): boolean {
  const entry = codeStore.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expires) {
    codeStore.delete(email.toLowerCase());
    return false;
  }
  if (entry.code !== code) return false;
  return true;
}

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

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    // 1. Email + Password (login only — signup goes through OTP flow)
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

    // 2. Google OAuth — real Google login with popup
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            authorization: {
              params: {
                prompt: "select_account",
                access_type: "offline",
                response_type: "code",
                scope: "openid email profile",
              },
            },
          }),
        ]
      : []),

    // 3. Email OTP — for signup verification + login
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

        const signupData = getSignupData(credentials.email);

        // If this is a signup (has name + password), create the account
        if (signupData?.name && signupData?.password) {
          const hashed = await bcrypt.hash(signupData.password, 10);
          const user = await db.user.upsert({
            where: { email: credentials.email.toLowerCase() },
            update: { name: signupData.name, password: hashed },
            create: {
              email: credentials.email.toLowerCase(),
              name: signupData.name,
              password: hashed,
              plan: (signupData as any).plan || "free",
            },
          });
          clearSignupData(credentials.email);
          return { id: user.id, email: user.email, name: user.name, plan: user.plan };
        }

        // Otherwise it's a login — find or create user
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
  pages: {
    signIn: "/",
    error: "/",
  },
};
