// Shared types, constants, and helpers for the admin panel
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type Section = "dashboard" | "users" | "finance" | "traffic" | "settings" | "accounts";

export interface AdminStats {
  totalUsers: number;
  freeUsers: number;
  activePaid: number;
  expired: number;
  totalResumes: number;
  totalRevenue: number;
  revenueByPlan: Record<string, number>;
  openTickets: number;
  organizations: number;
  students: number;
  pageViews: number;
  uniqueVisitors: number;
  transactions: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  planExpiresAt: string | null;
  role: string;
  studentId: string | null;
  organizationId: string | null;
  organization: { name: string; uniqueCode: string } | null;
  createdAt: string;
  updatedAt: string;
  resumeCount: number;
  transactionCount?: number;
}

export interface AdminTicket {
  id: string;
  email: string;
  name: string | null;
  subject: string;
  message: string;
  status: string;
  reply: string | null;
  createdAt: string;
}

export interface AdminResume {
  id: string;
  title: string;
  template: string;
  userId: string | null;
  createdAt: string;
  contactLocked: boolean;
}

export const PLAN_OPTIONS = [
  { id: "free", name: "Free Plan", price: 0, durationDays: null as number | null },
  { id: "single_99", name: "Single Export Pass", price: 99, durationDays: null as number | null },
  { id: "pro_399", name: "Pro Plan", price: 399, durationDays: 30 },
  { id: "business_999", name: "Business Plan", price: 999, durationDays: 30 },
  { id: "institution_4999", name: "Institution Plan", price: 4999, durationDays: 30 },
];

export function handleAuthError(res: Response): boolean {
  if (res.status === 401) {
    localStorage.removeItem("admin-token");
    window.location.reload();
    return true;
  }
  return false;
}

export function planBadge(plan: string): string {
  switch (plan) {
    case "free": return "bg-[#1a1a1a] text-[#888888] border border-[#2a2a2a]";
    case "single_99":
    case "trial_99": return "bg-[#1a1a1a] text-[#faff69] border border-[#faff69]/40";
    case "pro_399":
    case "pro_499": return "bg-[#faff69] text-[#0a0a0a] font-bold";
    case "business_999":
    case "business_1999": return "bg-[#242424] text-white border border-[#2a2a2a]";
    case "institution_4999": return "bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30";
    default: return "bg-[#1a1a1a] text-[#888888] border border-[#2a2a2a]";
  }
}

export function planLabel(plan: string): string {
  switch (plan) {
    case "free": return "Free (₹0)";
    case "single_99":
    case "trial_99": return "Single Export (₹99)";
    case "pro_399":
    case "pro_499": return "Pro Plan (₹399/mo)";
    case "business_999":
    case "business_1999": return "Business (₹999/mo)";
    case "institution_4999": return "Institution (₹4,999/mo)";
    default: return plan.replace("_", " ₹");
  }
}

export function StatCard({ icon: Icon, label, value, sub, color, onClick }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; sub?: string; color: string; onClick?: () => void;
}) {
  return (
    <div
      className={`p-6 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors rounded-xl ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#242424] border border-[#2a2a2a] text-[#faff69]">
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <p className="text-3xl font-bold font-mono text-[#faff69] tracking-tight">{value}</p>
      <p className="text-xs font-mono text-[#888888] uppercase tracking-wider mt-1">{label}</p>
      {sub && <p className="text-[11px] font-mono text-[#888888]/80 mt-1">{sub}</p>}
    </div>
  );
}
