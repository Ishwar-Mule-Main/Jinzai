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
  { id: "free", name: "Free", price: 0, durationDays: null as number | null },
  { id: "trial_99", name: "Trial", price: 99, durationDays: 2 },
  { id: "pro_499", name: "Pro", price: 499, durationDays: 30 },
  { id: "business_1999", name: "Business", price: 1999, durationDays: 30 },
];

export function planBadge(plan: string): string {
  switch (plan) {
    case "free": return "bg-slate-700 text-slate-300";
    case "trial_99": return "bg-amber-900/50 text-amber-300";
    case "pro_499": return "bg-teal-900/50 text-teal-300";
    case "business_1999": return "bg-violet-900/50 text-violet-300";
    default: return "bg-slate-700 text-slate-300";
  }
}

export function planLabel(plan: string): string {
  return plan.replace("_", " ₹");
}

export function StatCard({ icon: Icon, label, value, sub, color, onClick }: {
  icon: typeof Card; label: string; value: string | number; sub?: string; color: string; onClick?: () => void;
}) {
  const colors: Record<string, string> = {
    teal: "text-teal-400 bg-teal-950/40",
    emerald: "text-emerald-400 bg-emerald-950/40",
    violet: "text-violet-400 bg-violet-950/40",
    amber: "text-amber-400 bg-amber-950/40",
  };
  return (
    <Card className={`p-5 bg-slate-900 border-slate-800 ${onClick ? "cursor-pointer hover:border-slate-700 transition-colors" : ""}`} onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-1">{sub}</p>}
    </Card>
  );
}
