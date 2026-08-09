// Plan definitions, pricing, and limits for Jinzai

export type PlanId =
  | "free"
  | "single_99"
  | "pro_399"
  | "business_999"
  | "institution_4999"
  | "trial_99" // legacy alias
  | "pro_499"  // legacy alias
  | "business_1999"; // legacy alias

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number; // in INR
  priceLabel: string;
  period: string;
  durationDays?: number;
  maxResumes: number; // -1 = unlimited
  canExport: boolean;
  hasAi: boolean; // if false, AI tools disabled
  hasAts: boolean; // if false, ATS score & match analysis disabled
  contactLock: boolean; // if true, contact details locked once added
  features: string[];
  highlight?: boolean;
  badge?: string;
}

export const PLAN_LIMITS: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Free Plan",
    price: 0,
    priceLabel: "₹0",
    period: "forever",
    maxResumes: 1,
    canExport: false,
    hasAi: false,
    hasAts: false,
    contactLock: false,
    features: [
      "Browse all 78 templates",
      "Create 1 resume",
      "Live interactive preview",
      "❌ No PDF export (upgrade required)",
      "❌ No AI writing tools",
      "❌ No ATS score analysis",
    ],
  },
  single_99: {
    id: "single_99",
    name: "Single Export",
    price: 99,
    priceLabel: "₹99",
    period: "per export",
    maxResumes: 1,
    canExport: true,
    hasAi: false,
    hasAts: false,
    contactLock: true,
    badge: "Pay-Per-Download",
    features: [
      "Export 1 Resume to PDF & DOCX",
      "High-Precision Vector PDF",
      "Access all 78 templates",
      "Instant UPI Activation",
      "❌ No AI Rewriter tools",
      "❌ No ATS Score analysis",
    ],
  },
  pro_399: {
    id: "pro_399",
    name: "Pro Plan",
    price: 399,
    priceLabel: "₹399",
    period: "/month",
    maxResumes: 5,
    canExport: true,
    hasAi: true,
    hasAts: true,
    contactLock: true,
    highlight: true,
    badge: "Most Popular",
    features: [
      "Create & Export up to 5 Resumes",
      "ALL AI Rewriter & Writing tools",
      "ALL ATS Score & Job Match analysis",
      "AI Cover Letter Generator",
      "Vector PDF & DOCX export",
      "All 78 templates unlocked",
      "Priority Support",
    ],
  },
  business_999: {
    id: "business_999",
    name: "Business Plan",
    price: 999,
    priceLabel: "₹999",
    period: "/month",
    maxResumes: 50,
    canExport: true,
    hasAi: true,
    hasAts: true,
    contactLock: false,
    badge: "Best Value",
    features: [
      "Create & Export up to 50 Resumes",
      "ALL AI Rewriter & Writing tools",
      "ALL ATS Score & Job Match analysis",
      "AI Cover Letter Generator",
      "Multi-Page A4 Resume support",
      "No contact locking — build for anyone",
      "Priority 24/7 Support",
    ],
  },
  institution_4999: {
    id: "institution_4999",
    name: "Institution Plan",
    price: 4999,
    priceLabel: "₹4,999",
    period: "/month",
    maxResumes: 300,
    canExport: true,
    hasAi: true,
    hasAts: true,
    contactLock: false,
    badge: "Colleges & Universities",
    features: [
      "Up to 300 Student Resumes per month",
      "ALL AI & ATS features for all students",
      "Bulk Student Onboarding & Admin Portal",
      "Institutional Branding & Custom Templates",
      "Placement Cell Progress Dashboard",
      "Dedicated Account Manager",
    ],
  },

  // Legacy Alias Mappings
  trial_99: {
    id: "trial_99",
    name: "Single Export (₹99)",
    price: 99,
    priceLabel: "₹99",
    period: "per export",
    maxResumes: 1,
    canExport: true,
    hasAi: false,
    hasAts: false,
    contactLock: true,
    badge: "Pay-Per-Download",
    features: [
      "Export 1 Resume to PDF & DOCX",
      "High-Precision Vector PDF",
      "Access all 78 templates",
      "Instant UPI Activation",
      "❌ No AI Rewriter tools",
      "❌ No ATS Score analysis",
    ],
  },
  pro_499: {
    id: "pro_499",
    name: "Pro Plan",
    price: 399,
    priceLabel: "₹399",
    period: "/month",
    maxResumes: 5,
    canExport: true,
    hasAi: true,
    hasAts: true,
    contactLock: true,
    highlight: true,
    badge: "Most Popular",
    features: [
      "Create & Export up to 5 Resumes",
      "ALL AI Rewriter & Writing tools",
      "ALL ATS Score & Job Match analysis",
      "AI Cover Letter Generator",
      "Vector PDF & DOCX export",
      "All 78 templates unlocked",
      "Priority Support",
    ],
  },
  business_1999: {
    id: "business_1999",
    name: "Business Plan",
    price: 999,
    priceLabel: "₹999",
    period: "/month",
    maxResumes: 50,
    canExport: true,
    hasAi: true,
    hasAts: true,
    contactLock: false,
    badge: "Best Value",
    features: [
      "Create & Export up to 50 Resumes",
      "ALL AI Rewriter & Writing tools",
      "ALL ATS Score & Job Match analysis",
      "AI Cover Letter Generator",
      "Multi-Page A4 Resume support",
      "Priority 24/7 Support",
    ],
  },
};

export const PAID_PLANS: PlanId[] = [
  "single_99",
  "pro_399",
  "business_999",
  "institution_4999",
];

export function isPaidPlan(plan: string): boolean {
  if (!plan) return false;
  return plan !== "free";
}

export function getPlanConfig(plan: string): PlanConfig {
  return PLAN_LIMITS[plan as PlanId] || PLAN_LIMITS.free;
}

export function hasAiAccess(plan: string): boolean {
  const config = getPlanConfig(plan);
  return config.hasAi;
}

export function hasAtsAccess(plan: string): boolean {
  const config = getPlanConfig(plan);
  return config.hasAts;
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
