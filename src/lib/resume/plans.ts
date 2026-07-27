// Plan definitions, pricing, and limits for Jinzai

export type PlanId = "free" | "trial_99" | "pro_499" | "business_1999";

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number; // in INR
  priceLabel: string;
  period: string;
  durationDays?: number; // for trial (null = recurring monthly)
  maxResumes: number; // -1 = unlimited
  canExport: boolean;
  contactLock: boolean; // if true, contact details locked once added
  features: string[];
  highlight?: boolean;
  badge?: string;
}

export const PLAN_LIMITS: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    priceLabel: "₹0",
    period: "forever",
    maxResumes: 1,
    canExport: false,
    contactLock: false,
    features: [
      "Browse all 52 templates",
      "Create 1 resume",
      "Live preview",
      "AI suggestions (limited)",
    ],
  },
  trial_99: {
    id: "trial_99",
    name: "Trial",
    price: 99,
    priceLabel: "₹99",
    period: "2 days",
    durationDays: 2,
    maxResumes: 1,
    canExport: true,
    contactLock: true,
    badge: "2-day trial",
    features: [
      "Create 1 resume",
      "Export to PDF & DOCX",
      "Contact details locked to you",
      "All 52 templates",
      "AI features included",
    ],
  },
  pro_499: {
    id: "pro_499",
    name: "Pro",
    price: 499,
    priceLabel: "₹499",
    period: "/month",
    maxResumes: 5,
    canExport: true,
    contactLock: true,
    highlight: true,
    badge: "Most popular",
    features: [
      "Create up to 5 resumes",
      "Export to PDF & DOCX",
      "Contact details locked per resume",
      "All 52 templates",
      "All AI features",
      "Public share links",
      "Priority support",
    ],
  },
  business_1999: {
    id: "business_1999",
    name: "Business",
    price: 1999,
    priceLabel: "₹1,999",
    period: "/month",
    maxResumes: -1,
    canExport: true,
    contactLock: false,
    badge: "Full access",
    features: [
      "Unlimited resumes",
      "Export to PDF & DOCX",
      "No contact lock — use for anyone",
      "All 52 templates",
      "All AI features",
      "Public share links",
      "Multi-page resume support",
      "Priority support",
    ],
  },
};

export const PAID_PLANS: PlanId[] = ["trial_99", "pro_499", "business_1999"];

export function isPaidPlan(plan: string): boolean {
  return PAID_PLANS.includes(plan as PlanId);
}

export function getPlanConfig(plan: string): PlanConfig {
  return PLAN_LIMITS[plan as PlanId] || PLAN_LIMITS.free;
}

export function canCreateResume(plan: string, currentCount: number): boolean {
  const config = getPlanConfig(plan);
  if (config.maxResumes === -1) return true;
  return currentCount < config.maxResumes;
}

export function remainingResumes(plan: string, currentCount: number): number {
  const config = getPlanConfig(plan);
  if (config.maxResumes === -1) return Infinity;
  return Math.max(0, config.maxResumes - currentCount);
}
