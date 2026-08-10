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
    case "free": return "bg-white/5 text-[#888898] border border-[#2E2E2E]";
    case "single_99":
    case "trial_99": return "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30";
    case "pro_399":
    case "pro_499": return "bg-[#FF6200]/10 text-[#FF6200] border border-[#FF6200]/30";
    case "business_999":
    case "business_1999": return "bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/30";
    case "institution_4999": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
    default: return "bg-white/5 text-[#888898] border border-[#2E2E2E]";
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
  icon: typeof Card; label: string; value: string | number; sub?: string; color: string; onClick?: () => void;
}) {
  const colors: Record<string, string> = {
    teal: "text-[#FF6200] bg-[#FF6200]/10 border border-[#FF6200]/20",
    emerald: "text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20",
    violet: "text-[#A855F7] bg-[#A855F7]/10 border border-[#A855F7]/20",
    amber: "text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20",
  };
  return (
    <Card className={`p-5 bg-[#141414] border border-[#2E2E2E] hover:border-[#FF6200]/50 transition-all rounded-xl ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color] || colors.teal}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <p className="text-2xl font-bold font-mono text-white">{value}</p>
      <p className="text-[11px] font-mono text-[#888898] mt-1">{label}</p>
      {sub && <p className="text-[10px] font-mono text-[#888898]/70 mt-1">{sub}</p>}
    </Card>
  );
}
