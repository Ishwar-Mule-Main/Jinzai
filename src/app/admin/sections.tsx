"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, DollarSign, Loader2, Send, Trash2, Pencil, Search, Eye, FileText,
  TrendingUp, Cpu, KeyRound, CheckCircle2, AlertCircle, ArrowUpCircle,
  ArrowDownCircle, Copy, Plus, Globe, Smartphone, Monitor, Tablet, ExternalLink,
  X, Building2, GraduationCap, UserPlus, Save, Sparkles, Filter, Layers,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatCard, planBadge, planLabel, PLAN_OPTIONS, handleAuthError, type AdminUser, type AdminStats, type AdminTicket, type AdminResume, type Section } from "./page-helpers";

const authHeaders = (t: string) => ({ Authorization: `Bearer ${t}` });

// ============================================================
// DASHBOARD SECTION (REAL DATA ONLY — NO DEMO SEED BUTTON)
// ============================================================
export function DashboardSection({ stats, users, tickets, onJump, token }: {
  stats: AdminStats | null;
  users: AdminUser[];
  tickets: AdminTicket[];
  onJump: (s: Section) => void;
  token: string;
}) {
  if (!stats) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-[#FF6200]" /></div>;

  const recentUsers = users.slice(0, 5);
  const recentTickets = tickets.filter((t) => t.status !== "resolved").slice(0, 4);

  const individualUsers = users.filter((u) => u.role !== "student");
  const studentUsers = users.filter((u) => u.role === "student");

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2E2E2E] pb-4">
        <div>
          <h3 className="text-lg font-bold text-white font-bricolage">Realtime Analytics &amp; Platform Metrics</h3>
          <p className="text-xs text-[#888898] mt-0.5 font-mono">Actual live numbers calculated directly from your database</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 font-mono text-[10px] py-1 px-3">
            LIVE PRODUCTION DATABASE
          </Badge>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} sub={`${individualUsers.length} website · ${studentUsers.length} students`} color="teal" onClick={() => onJump("users")} />
        <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} sub={`${stats.transactions} transactions`} color="emerald" onClick={() => onJump("finance")} />
        <StatCard icon={TrendingUp} label="Unique Visitors" value={stats.uniqueVisitors} sub={`${stats.pageViews} page views`} color="violet" onClick={() => onJump("traffic")} />
        <StatCard icon={FileText} label="Resumes Created" value={stats.totalResumes} sub={`${stats.organizations} orgs · ${stats.students} students`} color="amber" onClick={() => onJump("users")} />
      </div>

      {/* Account Segregation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 bg-[#141414] border-[#2E2E2E] rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FF6200]/10 flex items-center justify-center border border-[#FF6200]/20">
                <Users className="w-4 h-4 text-[#FF6200]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Individual Website Users</h4>
                <p className="text-[10px] text-[#888898]">Direct registrations and plan purchases</p>
              </div>
            </div>
            <p className="text-xl font-bold text-white">{individualUsers.length}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2E2E2E] text-center text-xs">
            <div className="p-2 rounded-xl bg-[#0D0D0D]">
              <p className="text-[10px] text-[#888898]">Free Tier</p>
              <p className="font-bold text-white">{individualUsers.filter((u) => u.plan === "free").length}</p>
            </div>
            <div className="p-2 rounded-xl bg-[#0D0D0D]">
              <p className="text-[10px] text-[#888898]">Single (₹99)</p>
              <p className="font-bold text-[#FF6200]">{individualUsers.filter((u) => u.plan === "single_99" || u.plan === "trial_99").length}</p>
            </div>
            <div className="p-2 rounded-xl bg-[#0D0D0D]">
              <p className="text-[10px] text-[#888898]">Pro/Biz (₹399+)</p>
              <p className="font-bold text-emerald-400">{individualUsers.filter((u) => u.plan === "pro_399" || u.plan === "business_999").length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-[#141414] border-[#2E2E2E] rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                <GraduationCap className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Institutional Student Accounts</h4>
                <p className="text-[10px] text-[#888898]">Colleges, Universities &amp; Institutes</p>
              </div>
            </div>
            <p className="text-xl font-bold text-violet-400">{studentUsers.length}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2E2E2E] text-center text-xs">
            <div className="p-2 rounded-xl bg-[#0D0D0D]">
              <p className="text-[10px] text-[#888898]">Connected Colleges</p>
              <p className="font-bold text-violet-300">{stats.organizations}</p>
            </div>
            <div className="p-2 rounded-xl bg-[#0D0D0D]">
              <p className="text-[10px] text-[#888898]">Student Pro Access</p>
              <p className="font-bold text-emerald-400">{studentUsers.length} accounts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Conversion + Revenue snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 bg-[#141414] border-[#2E2E2E] rounded-2xl">
          <p className="text-xs font-semibold text-[#888898] mb-3 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-[#FF6200]" /> Conversion Rate</p>
          <p className="text-3xl font-bold text-[#FF6200]">{stats.totalUsers > 0 ? Math.round((stats.activePaid / stats.totalUsers) * 100) : 0}%</p>
          <p className="text-[11px] text-[#888898] mt-1">{stats.activePaid} paid of {stats.totalUsers} users</p>
          <div className="h-2 rounded-full bg-[#0D0D0D] overflow-hidden mt-3">
            <div className="h-full bg-gradient-to-r from-[#FF6200] to-emerald-500" style={{ width: `${stats.totalUsers > 0 ? (stats.activePaid / stats.totalUsers) * 100 : 0}%` }} />
          </div>
        </Card>

        <Card className="p-5 bg-[#141414] border-[#2E2E2E] rounded-2xl">
          <p className="text-xs font-semibold text-[#888898] mb-3 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Revenue Breakdown</p>
          <div className="space-y-2">
            {Object.entries(stats.revenueByPlan).map(([plan, amount]) => {
              const pct = stats.totalRevenue > 0 ? (amount / stats.totalRevenue) * 100 : 0;
              return (
                <div key={plan}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white font-medium">{planLabel(plan)}</span>
                    <span className="text-[#888898] font-mono">₹{amount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#0D0D0D] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-[#FF6200]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 bg-[#141414] border-[#2E2E2E] rounded-2xl">
          <p className="text-xs font-semibold text-[#888898] mb-3 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-violet-400" /> Institution Portals</p>
          <p className="text-3xl font-bold text-violet-400">{stats.organizations}</p>
          <p className="text-[11px] text-[#888898] mt-1">{stats.students} student accounts with ₹399/mo Pro features</p>
          <Button variant="outline" size="sm" className="w-full mt-3 gap-1.5 bg-[#0D0D0D] border-[#2E2E2E] text-white hover:bg-[#1A1A1A] rounded-full" onClick={() => onJump("accounts")}>
            <Plus className="w-3 h-3 text-[#FF6200]" /> Create Org / Student
          </Button>
        </Card>
      </div>

      {/* Recent users + tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 bg-[#141414] border-[#2E2E2E] rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Recent Registrations</p>
            <button onClick={() => onJump("users")} className="text-[10px] text-[#FF6200] hover:underline font-mono">View all →</button>
          </div>
          <div className="space-y-2">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0D0D0D] border border-[#2E2E2E]">
                <div className="w-8 h-8 rounded-full bg-[#141414] border border-[#2E2E2E] flex items-center justify-center text-xs font-semibold text-white">
                  {u.email[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium truncate text-white">{u.email}</p>
                    {u.role === "student" && <Badge className="bg-violet-900/50 text-violet-300 border-0 text-[9px]">Student</Badge>}
                  </div>
                  <p className="text-[10px] text-[#888898] font-mono">{u.name || "—"} · {new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge className={`text-[9px] border-0 ${planBadge(u.plan)}`}>{planLabel(u.plan)}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 bg-[#141414] border-[#2E2E2E] rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Open Support Tickets</p>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] font-mono">{recentTickets.length} open</Badge>
          </div>
          {recentTickets.length === 0 ? (
            <p className="text-center text-xs text-[#888898] py-8">No open support tickets</p>
          ) : (
            <div className="space-y-2">
              {recentTickets.map((t) => (
                <div key={t.id} className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#2E2E2E]">
                  <p className="text-xs font-medium truncate text-white">{t.subject}</p>
                  <p className="text-[10px] text-[#888898] font-mono">{t.name || t.email} · {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// USERS & RESUMES SECTION (SEPARATED USER TYPES)
// ============================================================
export function UsersSection({ token, onRefresh }: { token: string; onRefresh: () => void }) {
  const [activeTab, setActiveTab] = useState<"users" | "resumes">("users");

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userCategory, setUserCategory] = useState<"all" | "individual" | "student">("all");
  const [userSearch, setUserSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("");

  // Resumes state
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [resumeCategory, setResumeCategory] = useState<"all" | "individual" | "student">("all");
  const [resumeSearch, setResumeSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      if (userSearch) params.set("q", userSearch);
      if (planFilter && planFilter !== "all") params.set("plan", planFilter);
      if (userCategory === "individual") params.set("role", "user");
      else if (userCategory === "student") params.set("role", "student");

      const res = await fetch(`/api/admin/users?${params}`, { headers: authHeaders(token) });
      if (!res.ok) {
        if (handleAuthError(res)) return;
        throw new Error("Failed");
      }
      const json = await res.json();
      setUsers(json.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  }, [token, userSearch, planFilter, userCategory]);

  const loadResumes = useCallback(async () => {
    setLoadingResumes(true);
    try {
      const params = new URLSearchParams();
      if (resumeSearch) params.set("q", resumeSearch);
      if (resumeCategory !== "all") params.set("type", resumeCategory);

      const res = await fetch(`/api/admin/resumes?${params}`, { headers: authHeaders(token) });
      if (!res.ok) {
        if (handleAuthError(res)) return;
        throw new Error("Failed");
      }
      const json = await res.json();
      setResumes(json.resumes || []);
    } catch {
      toast.error("Failed to load resumes");
    } finally {
      setLoadingResumes(false);
    }
  }, [token, resumeSearch, resumeCategory]);

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    else loadResumes();
  }, [activeTab, loadUsers, loadResumes]);

  const openUserDetail = async (u: AdminUser) => {
    setSelectedUser(u);
    setUserDetailOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, { method: "DELETE", headers: authHeaders(token) });
      if (!res.ok) throw new Error("Failed");
      toast.success("User deleted");
      setDeleteOpen(false);
      setUserDetailOpen(false);
      loadUsers();
      onRefresh();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-5 text-left font-sans">
      {/* Top Mode Switcher: Users vs Resumes */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2E2E2E] pb-3">
        <div className="flex items-center gap-2 p-1 bg-[#141414] border border-[#2E2E2E] rounded-full text-xs font-semibold">
          <button
            onClick={() => setActiveTab("users")}
            className={`py-2 px-4 rounded-full flex items-center gap-2 transition-all ${
              activeTab === "users" ? "bg-[#FF6200] text-white shadow-md font-bold" : "text-[#888898] hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> User Accounts
          </button>
          <button
            onClick={() => setActiveTab("resumes")}
            className={`py-2 px-4 rounded-full flex items-center gap-2 transition-all ${
              activeTab === "resumes" ? "bg-[#FF6200] text-white shadow-md font-bold" : "text-[#888898] hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Resumes Explorer
          </button>
        </div>
      </div>

      {/* ================= MODE 1: USER ACCOUNTS ================= */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Sub-Category Tabs: All vs Individual vs Institutional Students */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setUserCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                userCategory === "all" ? "bg-white text-black font-bold" : "bg-[#141414] text-[#888898] border border-[#2E2E2E] hover:text-white"
              }`}
            >
              All Accounts ({users.length})
            </button>
            <button
              onClick={() => setUserCategory("individual")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                userCategory === "individual" ? "bg-[#FF6200] text-white font-bold" : "bg-[#141414] text-[#888898] border border-[#2E2E2E] hover:text-white"
              }`}
            >
              <Users className="w-3 h-3" /> Individual Website Users
            </button>
            <button
              onClick={() => setUserCategory("student")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                userCategory === "student" ? "bg-violet-600 text-white font-bold" : "bg-[#141414] text-[#888898] border border-[#2E2E2E] hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Institutional / College Students
            </button>
          </div>

          {/* Filters */}
          <Card className="p-4 bg-[#141414] border-[#2E2E2E] rounded-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888898]" />
                <Input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by email, name, college, or student ID..."
                  className="pl-9 bg-[#0D0D0D] border-[#2E2E2E] text-white h-9 text-xs rounded-xl focus:border-[#FF6200]"
                  onKeyDown={(e) => e.key === "Enter" && loadUsers()}
                />
              </div>
              <Select value={planFilter || "all"} onValueChange={(v) => setPlanFilter(v === "all" ? "" : v)}>
                <SelectTrigger className="w-[150px] bg-[#0D0D0D] border-[#2E2E2E] text-white h-9 text-xs rounded-xl"><SelectValue placeholder="All plans" /></SelectTrigger>
                <SelectContent className="bg-[#141414] border-[#2E2E2E] text-white">
                  <SelectItem value="all">All plans</SelectItem>
                  {PLAN_OPTIONS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={loadUsers} variant="outline" size="sm" className="bg-[#0D0D0D] border-[#2E2E2E] text-white h-9 text-xs rounded-xl gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#FF6200]" /> Search
              </Button>
            </div>
          </Card>

          {/* Users list */}
          <Card className="bg-[#141414] border-[#2E2E2E] rounded-2xl overflow-hidden">
            {loadingUsers ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-[#FF6200]" /></div>
            ) : users.length === 0 ? (
              <p className="text-center text-xs text-[#888898] py-12">No matching users found.</p>
            ) : (
              <div className="divide-y divide-[#2E2E2E]">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-4 hover:bg-[#1A1A1A] transition-colors">
                    <div className="w-9 h-9 rounded-full bg-[#0D0D0D] border border-[#2E2E2E] flex items-center justify-center text-xs font-semibold text-white shrink-0">
                      {u.email[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white truncate">{u.email}</p>
                        {u.role === "student" ? (
                          <Badge className="bg-violet-900/50 text-violet-300 border border-violet-700/50 text-[9px] gap-1">
                            <GraduationCap className="w-3 h-3" /> Institutional Student
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-900/40 text-blue-300 border border-blue-700/40 text-[9px]">
                            Individual Account
                          </Badge>
                        )}
                        {u.organization && <Badge className="bg-[#0D0D0D] text-[#888898] border border-[#2E2E2E] text-[9px]">{u.organization.name}</Badge>}
                      </div>
                      <p className="text-[11px] text-[#888898] font-mono mt-0.5">
                        {u.name || "—"} · {u.resumeCount} resumes · {u.studentId ? `Student ID: ${u.studentId} · ` : ""}Joined {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`border-0 text-[10px] ${planBadge(u.plan)}`}>{planLabel(u.plan)}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#888898] hover:bg-[#0D0D0D] rounded-xl">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#141414] border-[#2E2E2E] text-white">
                        <DropdownMenuLabel className="text-[#888898] text-[10px] font-mono">Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openUserDetail(u)} className="text-xs cursor-pointer">
                          <Eye className="w-3.5 h-3.5 mr-2 text-[#FF6200]" /> View Details &amp; Resumes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedUser(u); setEditOpen(true); }} className="text-xs cursor-pointer">
                          <Pencil className="w-3.5 h-3.5 mr-2 text-[#FF6200]" /> Edit Account
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#2E2E2E]" />
                        <DropdownMenuItem onClick={() => { setSelectedUser(u); setDeleteOpen(true); }} className="text-red-400 text-xs cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ================= MODE 2: RESUMES EXPLORER ================= */}
      {activeTab === "resumes" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setResumeCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                resumeCategory === "all" ? "bg-white text-black font-bold" : "bg-[#141414] text-[#888898] border border-[#2E2E2E] hover:text-white"
              }`}
            >
              All Resumes ({resumes.length})
            </button>
            <button
              onClick={() => setResumeCategory("individual")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                resumeCategory === "individual" ? "bg-[#FF6200] text-white font-bold" : "bg-[#141414] text-[#888898] border border-[#2E2E2E] hover:text-white"
              }`}
            >
              <Users className="w-3 h-3" /> Individual User Resumes
            </button>
            <button
              onClick={() => setResumeCategory("student")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                resumeCategory === "student" ? "bg-violet-600 text-white font-bold" : "bg-[#141414] text-[#888898] border border-[#2E2E2E] hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Institutional Student Resumes
            </button>
          </div>

          <Card className="p-4 bg-[#141414] border-[#2E2E2E] rounded-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888898]" />
              <Input
                value={resumeSearch}
                onChange={(e) => setResumeSearch(e.target.value)}
                placeholder="Search resumes by title, template, email..."
                className="pl-9 bg-[#0D0D0D] border-[#2E2E2E] text-white h-9 text-xs rounded-xl focus:border-[#FF6200]"
                onKeyDown={(e) => e.key === "Enter" && loadResumes()}
              />
            </div>
          </Card>

          <Card className="bg-[#141414] border-[#2E2E2E] rounded-2xl overflow-hidden">
            {loadingResumes ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-[#FF6200]" /></div>
            ) : resumes.length === 0 ? (
              <p className="text-center text-xs text-[#888898] py-12">No resumes found in database.</p>
            ) : (
              <div className="divide-y divide-[#2E2E2E]">
                {resumes.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-4 hover:bg-[#1A1A1A] transition-colors">
                    <FileText className="w-5 h-5 text-[#FF6200] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white truncate">{r.title}</p>
                        <Badge className="bg-[#0D0D0D] text-[#888898] border border-[#2E2E2E] text-[9px] uppercase font-mono">{r.template}</Badge>
                      </div>
                      <p className="text-[11px] text-[#888898] font-mono mt-0.5">
                        Author: {r.user?.email || "Anonymous"} {r.user?.organization ? `(${r.user.organization.name})` : ""} · Updated {new Date(r.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {r.user?.role === "student" ? (
                      <Badge className="bg-violet-900/50 text-violet-300 border-0 text-[9px]">Student Resume</Badge>
                    ) : (
                      <Badge className="bg-blue-900/40 text-blue-300 border-0 text-[9px]">User Resume</Badge>
                    )}
                    <Button size="sm" variant="outline" className="h-8 text-xs border-[#2E2E2E] bg-[#0D0D0D] text-white hover:bg-[#141414] rounded-full gap-1" onClick={() => window.open(`/share/${r.slug || r.shareToken || r.id}`, "_blank")}>
                      <ExternalLink className="w-3 h-3 text-[#FF6200]" /> View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* User detail dialog */}
      {selectedUser && (
        <UserDetailDialog
          key={selectedUser.id}
          user={selectedUser}
          token={token}
          open={userDetailOpen}
          onOpenChange={setUserDetailOpen}
          onEdit={() => { setUserDetailOpen(false); setEditOpen(true); }}
          onDelete={() => { setUserDetailOpen(false); setDeleteOpen(true); }}
        />
      )}

      {/* Edit dialog */}
      {selectedUser && (
        <EditUserDialog
          user={selectedUser}
          token={token}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSaved={() => { setEditOpen(false); loadUsers(); onRefresh(); }}
        />
      )}

      {/* Delete confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#141414] border-[#2E2E2E] text-white rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete user account?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#888898]">
              This will permanently delete <span className="text-red-400 font-bold">{selectedUser?.email}</span> and all their resumes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#0D0D0D] border-[#2E2E2E] text-white rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 rounded-full">Delete permanently</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// User detail dialog — shows user info + credentials + their resumes
function UserDetailDialog({ user, token, open, onOpenChange, onEdit, onDelete }: {
  user: AdminUser; token: string; open: boolean; onOpenChange: (v: boolean) => void; onEdit: () => void; onDelete: () => void;
}) {
  const [resumes, setResumes] = useState<{ id: string; title: string; template: string; createdAt: string; updatedAt: string; contactLocked: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch(`/api/admin/users/${user.id}/resumes`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((j) => { if (!cancelled) setResumes(j.resumes || []); })
      .catch(() => { if (!cancelled) toast.error("Failed to load resumes"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open, user.id, token]);

  const copyCreds = () => {
    navigator.clipboard.writeText(`${user.email}`);
    toast.success("Email copied");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden bg-[#141414] border-[#2E2E2E] text-white flex flex-col rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0D0D0D] border border-[#2E2E2E] flex items-center justify-center text-sm font-bold text-white">{user.email[0]?.toUpperCase()}</div>
            Account Details &amp; Resumes
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888898]">Full credentials and created resume documents</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto pr-1 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InfoRow label="Email / Login ID" value={user.email} onCopy={copyCreds} />
            <InfoRow label="Name" value={user.name || "—"} />
            <InfoRow label="Plan Status" value={<Badge className={`border-0 ${planBadge(user.plan)}`}>{planLabel(user.plan)}</Badge>} />
            <InfoRow label="Account Role" value={user.role === "student" ? "Institutional Student" : "Individual User"} />
            <InfoRow label="Student ID Number" value={user.studentId || "N/A"} />
            <InfoRow label="College / Institution" value={user.organization?.name || "N/A"} />
            <InfoRow label="Plan Expiry" value={user.planExpiresAt ? new Date(user.planExpiresAt).toLocaleString() : "Permanent / Active"} />
            <InfoRow label="Account Created" value={new Date(user.createdAt).toLocaleString()} />
          </div>

          <div>
            <p className="text-xs font-bold text-white mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[#FF6200]" /> Created Resumes ({resumes.length})</p>
            {loading ? (
              <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-[#FF6200]" /></div>
            ) : resumes.length === 0 ? (
              <p className="text-center text-xs text-[#888898] py-6 bg-[#0D0D0D] rounded-xl border border-[#2E2E2E]">No resumes created yet.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {resumes.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0D0D0D] border border-[#2E2E2E]">
                    <FileText className="w-4 h-4 text-[#FF6200] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-white">{r.title}</p>
                      <p className="text-[10px] text-[#888898] font-mono">{r.template} · Updated {new Date(r.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-[10px] gap-1 text-[#FF6200]" onClick={() => window.open(`/share/${r.id}`, "_blank")}>
                      <ExternalLink className="w-3 h-3" /> View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 pt-2 border-t border-[#2E2E2E]">
          <Button variant="outline" onClick={onDelete} className="gap-1.5 bg-red-950/20 border-red-800 text-red-300 hover:bg-red-900/40 rounded-full text-xs">
            <Trash2 className="w-3.5 h-3.5" /> Delete Account
          </Button>
          <Button onClick={onEdit} className="gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white rounded-full text-xs font-bold">
            <Pencil className="w-3.5 h-3.5" /> Edit Account &amp; Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value, onCopy }: { label: string; value: React.ReactNode; onCopy?: () => void }) {
  return (
    <div className="rounded-xl bg-[#0D0D0D] border border-[#2E2E2E] p-2.5">
      <p className="text-[10px] text-[#888898] font-mono uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <p className="text-xs font-semibold text-white break-all">{value}</p>
        {onCopy && <Copy className="w-3 h-3 text-[#888898] hover:text-white cursor-pointer shrink-0" onClick={onCopy} />}
      </div>
    </div>
  );
}

// Edit user dialog
function EditUserDialog({ user, token, open, onOpenChange, onSaved }: {
  user: AdminUser; token: string; open: boolean; onOpenChange: (v: boolean) => void; onSaved: () => void;
}) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email);
  const [plan, setPlan] = useState(user.plan);
  const [role, setRole] = useState(user.role);
  const [planDurationDays, setPlanDurationDays] = useState("");
  const [resetPlan, setResetPlan] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = { name, email, plan, role, resetPlan };
      if (planDurationDays) body.planDurationDays = Number(planDurationDays);
      if (newPassword) body.password = newPassword;
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed");
      }
      toast.success("User updated");
      onSaved();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[#141414] border-[#2E2E2E] text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2"><Pencil className="w-4 h-4 text-[#FF6200]" /> Edit Account &amp; Plan</DialogTitle>
          <DialogDescription className="text-xs text-[#888898]">Modify account parameters, tier, or reset login password</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <Label className="text-xs text-[#888898]">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl" />
          </div>
          <div>
            <Label className="text-xs text-[#888898]">Email / Login ID</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-[#888898]">Plan Tier</Label>
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#141414] border-[#2E2E2E] text-white">
                  {PLAN_OPTIONS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} {p.price > 0 && `(₹${p.price})`}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-[#888898]">Account Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#141414] border-[#2E2E2E] text-white">
                  <SelectItem value="user">User (Individual)</SelectItem>
                  <SelectItem value="student">Student (Institutional)</SelectItem>
                  <SelectItem value="org_admin">Org Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-[#888898]">Reset Password (leave blank to keep)</Label>
            <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="text" placeholder="New password" className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-[#0D0D0D] border-[#2E2E2E] text-white rounded-full text-xs">Cancel</Button>
          <Button onClick={save} disabled={saving} className="gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white rounded-full text-xs font-bold">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// FINANCE SECTION (REALTIME DATABASE LEDGER)
// ============================================================
export function FinanceSection({ token, stats }: { token: string; stats: AdminStats | null }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/finance?range=${range}`, { headers: authHeaders(token) });
      if (!res.ok) {
        if (handleAuthError(res)) return;
        throw new Error("Failed");
      }
      const json = await res.json();
      setData(json);
    } catch {
      toast.error("Failed to load finance data");
    } finally {
      setLoading(false);
    }
  }, [token, range]);

  useEffect(() => { load(); }, [load]);

  if (loading || !data) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-[#FF6200]" /></div>;

  return (
    <div className="space-y-4 text-left font-sans">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#888898] font-mono">Financial analytics — real-time revenue ledger and transactions</p>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[120px] bg-[#141414] border-[#2E2E2E] text-white h-8 text-xs rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#141414] border-[#2E2E2E] text-white">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={`₹${(data.totalRevenue || 0).toLocaleString("en-IN")}`} sub={`${data.transactions?.length || 0} transactions`} color="emerald" />
        <StatCard icon={TrendingUp} label="MRR (recurring)" value={`₹${(data.mrr || 0).toLocaleString("en-IN")}`} sub="Pro + Business" color="teal" />
        <StatCard icon={Users} label="Conversion Rate" value={`${(data.conversionRate || 0).toFixed(1)}%`} sub={`${data.activePaid}/${data.totalUsers} users`} color="violet" />
        <StatCard icon={DollarSign} label="ARPU" value={`₹${Math.round(data.arpu || 0).toLocaleString("en-IN")}`} sub="Avg per paid user" color="amber" />
      </div>

      {/* Transactions table */}
      <Card className="bg-[#141414] border-[#2E2E2E] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#2E2E2E]">
          <p className="text-xs font-bold text-white uppercase tracking-wider">Real Transaction History</p>
        </div>
        <div className="max-h-96 overflow-y-auto divide-y divide-[#2E2E2E]">
          {(data.transactions || []).length === 0 ? (
            <p className="text-center text-xs text-[#888898] py-8 font-mono">No transaction logs recorded yet.</p>
          ) : data.transactions.map((t: any) => (
            <div key={t.id} className="flex items-center gap-3 p-3.5 hover:bg-[#1A1A1A] transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 flex items-center justify-center">
                <ArrowUpCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{t.email}</p>
                <p className="text-[10px] text-[#888898] font-mono">{planLabel(t.plan)} · {t.method || "online"} · {new Date(t.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-400 font-mono">₹{t.amount.toLocaleString("en-IN")}</p>
                <Badge className="text-[9px] border-0 bg-emerald-900/50 text-emerald-300 font-mono">{t.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// TRAFFIC & ANALYTICS SECTION (REALTIME PAGEVIEWS)
// ============================================================
export function TrafficSection({ token, stats }: { token: string; stats: AdminStats | null }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`, { headers: authHeaders(token) });
      if (!res.ok) {
        if (handleAuthError(res)) return;
        throw new Error("Failed");
      }
      const json = await res.json();
      setData(json);
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [token, range]);

  useEffect(() => { load(); }, [load]);

  if (loading || !data) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-[#FF6200]" /></div>;

  return (
    <div className="space-y-4 text-left font-sans">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#888898] font-mono">Real visitor traffic, page views, and conversion funnel</p>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[120px] bg-[#141414] border-[#2E2E2E] text-white h-8 text-xs rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#141414] border-[#2E2E2E] text-white">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Globe} label="Page Views" value={data.totalViews || 0} sub={`${range} range`} color="teal" />
        <StatCard icon={Users} label="Unique Visitors" value={data.uniqueVisitors || 0} sub={`${data.newVisitors || 0} new`} color="violet" />
        <StatCard icon={TrendingUp} label="Signup Rate" value={`${(data.funnel?.signupRate || 0).toFixed(1)}%`} sub={`${data.funnel?.signups || 0} signups`} color="emerald" />
        <StatCard icon={DollarSign} label="Conversion" value={`${(data.funnel?.conversionRate || 0).toFixed(1)}%`} sub={`${data.funnel?.paid || 0} paid`} color="amber" />
      </div>

      <Card className="p-5 bg-[#141414] border-[#2E2E2E] rounded-2xl">
        <p className="text-xs font-bold text-white mb-3 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[#FF6200]" /> Top Visited Pages</p>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {(data.topPages || []).length === 0 ? (
            <p className="text-center text-xs text-[#888898] py-6 font-mono">No page views recorded yet.</p>
          ) : data.topPages.map((p: any, i: number) => (
            <div key={p.path} className="flex items-center gap-2 p-2 rounded-xl bg-[#0D0D0D] border border-[#2E2E2E]">
              <span className="text-[10px] text-[#888898] font-mono w-4">{i + 1}</span>
              <span className="text-xs text-white flex-1 truncate font-mono">{p.path}</span>
              <span className="text-xs text-[#FF6200] font-bold font-mono">{p.views} views</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// AI SETTINGS SECTION
// ============================================================
export function SettingsSection({ token }: { token: string }) {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newApiKey, setNewApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", { headers: authHeaders(token) });
      if (!res.ok) {
        if (handleAuthError(res)) return;
        throw new Error("Failed");
      }
      const json = await res.json();
      setSettings(json);
      setSelectedModel(json.model);
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      const body: Record<string, string> = {};
      if (newApiKey.trim()) body.apiKey = newApiKey.trim();
      if (selectedModel) body.model = selectedModel;
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed");
      }
      const json = await res.json();
      setSettings(json);
      setNewApiKey("");
      toast.success("Settings saved — applied platform-wide");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-[#FF6200]" /></div>;

  return (
    <div className="space-y-4 max-w-3xl text-left font-sans">
      <Card className="p-5 bg-[#141414] border-[#2E2E2E] rounded-2xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FF6200]/10 flex items-center justify-center border border-[#FF6200]/20">
            <Cpu className="w-5 h-5 text-[#FF6200]" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">LLMs / AI Model Configuration</p>
            <p className="text-[11px] text-[#888898] font-mono">Configure platform-wide Multimodal Vision &amp; LLMs settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs text-[#888898]">Update API Key (leave blank to keep current)</Label>
            <Input
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              type="password"
              placeholder="sk-or-v1-..."
              className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl"
            />
          </div>

          <Button onClick={save} disabled={saving} className="gap-2 bg-[#FF6200] hover:bg-[#E55700] text-white rounded-full text-xs font-bold shadow-md shadow-[#FF6200]/20">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// ACCOUNT CREATION & ORGANIZATION SECTION
// ============================================================
export function AccountsSection({ token, onRefresh }: { token: string; onRefresh: () => void }) {
  return (
    <div className="space-y-6 text-left font-sans">
      <OrganizationSection token={token} onCreated={onRefresh} />
    </div>
  );
}

function OrganizationSection({ token, onCreated }: { token: string; onCreated: () => void }) {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [showStudents, setShowStudents] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState("college");
  const [uniqueCode, setUniqueCode] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [plan, setPlan] = useState("pro_399");
  const [seats, setSeats] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Student creation states
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [createdStudentResult, setCreatedStudentResult] = useState<any>(null);

  // Bulk creation states
  const [creationMode, setCreationMode] = useState<"single" | "bulk_range" | "bulk_text">("single");
  const [startRoll, setStartRoll] = useState("");
  const [endRoll, setEndRoll] = useState("");
  const [batchPrefix, setBatchPrefix] = useState("Student");
  const [bulkText, setBulkText] = useState("");
  const [createdBulkResults, setCreatedBulkResults] = useState<any[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/organizations", { headers: authHeaders(token) });
      if (!res.ok) {
        if (handleAuthError(res)) return;
        throw new Error("Failed");
      }
      const j = await res.json();
      setOrgs(j.organizations || []);
    } catch {
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const createOrg = async () => {
    if (!name) { toast.error("Organization name is required"); return; }
    setSaving(true);
    try {
      const body: Record<string, unknown> = { name, type, plan };
      if (uniqueCode) body.uniqueCode = uniqueCode;
      if (contactEmail) body.contactEmail = contactEmail;
      if (contactPhone) body.contactPhone = contactPhone;
      if (seats) body.seats = Number(seats);
      if (notes) body.notes = notes;
      const res = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed");
      }
      toast.success("Organization created");
      setName(""); setUniqueCode(""); setContactEmail(""); setContactPhone(""); setSeats(""); setNotes("");
      setShowCreate(false);
      load();
      onCreated();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addStudent = async () => {
    if (!selectedOrg || !studentId) { toast.error("Student ID number is required"); return; }
    setCreatingStudent(true);
    try {
      const res = await fetch(`/api/admin/organizations/${selectedOrg.id}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({ studentId, name: studentName, email: studentEmail }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed");
      }
      const j = await res.json();
      setCreatedStudentResult(j.students?.[0]);
      toast.success("Student account created — credentials ready");
      setStudentId(""); setStudentName(""); setStudentEmail("");
      load();
      onCreated();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCreatingStudent(false);
    }
  };

  const addBulkStudents = async () => {
    if (!selectedOrg) return;
    let list: { studentId: string; name: string }[] = [];

    if (creationMode === "bulk_range") {
      const s = parseInt(startRoll, 10);
      const e = parseInt(endRoll, 10);
      if (isNaN(s) || isNaN(e) || e < s) {
        toast.error("Please enter a valid start and end roll number range (e.g. 23001 to 23050)");
        return;
      }
      if (e - s > 300) {
        toast.error("Max 300 accounts per bulk batch");
        return;
      }
      for (let i = s; i <= e; i++) {
        list.push({ studentId: String(i), name: `${batchPrefix} ${i}` });
      }
    } else if (creationMode === "bulk_text") {
      const lines = bulkText.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) {
        toast.error("Paste student IDs (one per line)");
        return;
      }
      for (const line of lines) {
        const parts = line.split(",").map((p) => p.trim());
        const id = parts[0];
        const name = parts[1] || `Student ${id}`;
        if (id) list.push({ studentId: id, name });
      }
    }

    setCreatingStudent(true);
    try {
      const res = await fetch(`/api/admin/organizations/${selectedOrg.id}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({ students: list }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed");
      }
      const j = await res.json();
      setCreatedBulkResults(j.students || []);
      toast.success(`Successfully issued credentials for ${j.created || 0} students!`);
      setStartRoll(""); setEndRoll(""); setBulkText("");
      load();
      onCreated();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCreatingStudent(false);
    }
  };

  const downloadRosterCsv = () => {
    if (createdBulkResults.length === 0) return;
    const header = "Student Roll ID,Name,Email,Password,Portal Link\n";
    const rows = createdBulkResults
      .map((r) => `"${r.studentId}","${r.name}","${r.email}","${r.password}","http://localhost:3000/portal/${selectedOrg.uniqueCode}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedOrg.name}_Student_Credentials.csv`;
    a.click();
  };

  const deleteOrg = async (id: string) => {
    if (!confirm("Delete this organization? Student accounts will be unlinked.")) return;
    try {
      const res = await fetch(`/api/admin/organizations?id=${id}`, { method: "DELETE", headers: authHeaders(token) });
      if (!res.ok) throw new Error("Failed");
      toast.success("Organization deleted");
      load();
      onCreated();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#888898] font-mono">Create college/institution accounts and student logins with full Pro portal access</p>
        <Button onClick={() => setShowCreate(true)} className="gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white rounded-full font-bold text-xs shadow-md shadow-[#FF6200]/20">
          <Plus className="w-3.5 h-3.5" /> New Organization / College
        </Button>
      </div>

      <Card className="p-4 bg-violet-950/20 border-violet-900/40 rounded-2xl">
        <div className="flex items-start gap-3">
          <GraduationCap className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <p className="font-bold text-violet-300">How Student Portal Logins Work:</p>
            <p>1. Create an Organization (e.g. "IIT Bombay") with a Unique Code (e.g. <code className="text-violet-300">IITBX3</code>).</p>
            <p>2. Add student accounts — Email defaults to <code className="text-violet-300">studentId@orgcode.edu</code>, Password defaults to <code className="text-violet-300">studentId + uniqueCode</code> (e.g. <code className="text-violet-300">23001IITBX3</code>).</p>
            <p>3. Students sign in directly at homepage login <code className="text-violet-300">/</code> and get instant access to Dashboard, Editor page, PDF exports, and AI features like a ₹399/mo Pro user.</p>
          </div>
        </div>
      </Card>

      {/* Orgs list */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-violet-400" /></div>
      ) : orgs.length === 0 ? (
        <Card className="p-8 bg-[#141414] border-[#2E2E2E] text-center rounded-2xl">
          <Building2 className="w-10 h-10 text-[#888898] mx-auto mb-3" />
          <p className="text-xs text-[#888898]">No organizations created yet. Click "New Organization" above to get started.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orgs.map((o) => (
            <Card key={o.id} className="p-4 bg-[#141414] border-[#2E2E2E] rounded-2xl hover:border-[#FF6200]/40 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-950/40 border border-violet-800/40 flex items-center justify-center"><Building2 className="w-5 h-5 text-violet-400" /></div>
                  <div>
                    <p className="text-xs font-bold text-white">{o.name}</p>
                    <p className="text-[10px] text-[#888898] font-mono capitalize">{o.type} · Code: {o.uniqueCode}</p>
                  </div>
                </div>
                <Badge className={`border-0 text-[9px] ${planBadge(o.plan)}`}>{planLabel(o.plan)}</Badge>
              </div>
              <div className="mb-3 p-2 rounded-xl bg-[#0D0D0D] border border-[#2E2E2E] flex items-center justify-between text-[11px]">
                <span className="text-[#888898] font-mono truncate">Portal: /portal/{o.uniqueCode}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px] text-violet-400 hover:text-violet-300 gap-1 p-1"
                  onClick={() => window.open(`/portal/${o.uniqueCode}`, "_blank")}
                >
                  <ExternalLink className="w-3 h-3" /> Open Portal
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => { setSelectedOrg(o); setShowStudents(true); }} size="sm" className="flex-1 gap-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-full text-xs font-bold">
                  <GraduationCap className="w-3.5 h-3.5" /> Manage Students ({o.studentCount || 0})
                </Button>
                <Button onClick={() => deleteOrg(o.id)} size="sm" variant="outline" className="bg-[#0D0D0D] border-[#2E2E2E] text-red-400 hover:bg-red-950/30 rounded-full">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create org dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg bg-[#141414] border-[#2E2E2E] text-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2"><Building2 className="w-4 h-4 text-[#FF6200]" /> Create College / Organization</DialogTitle>
            <DialogDescription className="text-xs text-[#888898]">Parent entity to issue student credentials</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-[#888898]">Organization Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. IIT Bombay" className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-[#888898]">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#141414] border-[#2E2E2E] text-white">
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="institute">Institute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-[#888898]">Student Default Plan</Label>
                <Select value={plan} onValueChange={setPlan}>
                  <SelectTrigger className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#141414] border-[#2E2E2E] text-white">
                    <SelectItem value="pro_399">Pro Plan (₹399/mo)</SelectItem>
                    <SelectItem value="business_999">Business Plan (₹999/mo)</SelectItem>
                    <SelectItem value="institution_4999">Institution Plan (₹4,999/mo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="bg-[#0D0D0D] border-[#2E2E2E] text-white rounded-full text-xs">Cancel</Button>
            <Button onClick={createOrg} disabled={saving} className="gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white rounded-full text-xs font-bold">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Students Dialog */}
      {selectedOrg && (
        <Dialog open={showStudents} onOpenChange={setShowStudents}>
          <DialogContent className="max-w-2xl bg-[#141414] border-[#2E2E2E] text-white rounded-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-violet-400" />
                Issue Student Login Credentials ({selectedOrg.name})
              </DialogTitle>
              <DialogDescription className="text-xs text-[#888898]">
                Created student accounts log in directly at homepage and access Dashboard &amp; Editor
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Creation Mode Switcher */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#0D0D0D] border border-[#2E2E2E] rounded-full text-xs font-semibold">
                <button
                  onClick={() => setCreationMode("single")}
                  className={`py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all ${
                    creationMode === "single" ? "bg-violet-600 text-white font-bold" : "text-[#888898] hover:text-white"
                  }`}
                >
                  <User className="w-3.5 h-3.5" /> Single Student
                </button>
                <button
                  onClick={() => setCreationMode("bulk_range")}
                  className={`py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all ${
                    creationMode === "bulk_range" ? "bg-violet-600 text-white font-bold" : "text-[#888898] hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Roll No Range
                </button>
                <button
                  onClick={() => setCreationMode("bulk_text")}
                  className={`py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all ${
                    creationMode === "bulk_text" ? "bg-violet-600 text-white font-bold" : "text-[#888898] hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Paste List (CSV)
                </button>
              </div>

              {/* Mode 1: Single Student */}
              {creationMode === "single" && (
                <div className="p-3.5 rounded-2xl bg-[#0D0D0D] border border-[#2E2E2E] space-y-3">
                  <p className="text-xs font-bold text-white">Issue Single Student Credential</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Student Roll No (e.g. 23001)"
                      className="bg-[#141414] border-[#2E2E2E] text-white text-xs rounded-xl"
                    />
                    <Input
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Full Name"
                      className="bg-[#141414] border-[#2E2E2E] text-white text-xs rounded-xl"
                    />
                    <Input
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="Custom Email (Optional)"
                      className="bg-[#141414] border-[#2E2E2E] text-white text-xs rounded-xl"
                    />
                  </div>
                  <Button onClick={addStudent} disabled={creatingStudent} className="w-full h-9 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded-full font-bold gap-1.5">
                    {creatingStudent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />} Issue Student Credentials
                  </Button>
                </div>
              )}

              {/* Mode 2: Bulk Roll Range */}
              {creationMode === "bulk_range" && (
                <div className="p-3.5 rounded-2xl bg-[#0D0D0D] border border-[#2E2E2E] space-y-3">
                  <p className="text-xs font-bold text-white">Generate Bulk Accounts by Roll Number Range</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      value={startRoll}
                      onChange={(e) => setStartRoll(e.target.value)}
                      placeholder="Start Roll No (e.g. 23001)"
                      type="number"
                      className="bg-[#141414] border-[#2E2E2E] text-white text-xs rounded-xl"
                    />
                    <Input
                      value={endRoll}
                      onChange={(e) => setEndRoll(e.target.value)}
                      placeholder="End Roll No (e.g. 23050)"
                      type="number"
                      className="bg-[#141414] border-[#2E2E2E] text-white text-xs rounded-xl"
                    />
                    <Input
                      value={batchPrefix}
                      onChange={(e) => setBatchPrefix(e.target.value)}
                      placeholder="Name Prefix (e.g. Student)"
                      className="bg-[#141414] border-[#2E2E2E] text-white text-xs rounded-xl"
                    />
                  </div>
                  <Button onClick={addBulkStudents} disabled={creatingStudent} className="w-full h-9 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded-full font-bold gap-1.5">
                    {creatingStudent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Generate Bulk Student Logins
                  </Button>
                </div>
              )}

              {/* Mode 3: Bulk Paste CSV List */}
              {creationMode === "bulk_text" && (
                <div className="p-3.5 rounded-2xl bg-[#0D0D0D] border border-[#2E2E2E] space-y-3">
                  <p className="text-xs font-bold text-white">Paste Roll Numbers / CSV List (one per line)</p>
                  <Textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`23001, Rahul Sharma\n23002, Priya Patel\n23003, Amit Kumar`}
                    rows={4}
                    className="bg-[#141414] border-[#2E2E2E] text-white text-xs rounded-xl font-mono"
                  />
                  <Button onClick={addBulkStudents} disabled={creatingStudent} className="w-full h-9 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded-full font-bold gap-1.5">
                    {creatingStudent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />} Issue Bulk Accounts from List
                  </Button>
                </div>
              )}

              {/* Single Result */}
              {createdStudentResult && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-1.5 text-xs">
                  <p className="font-bold text-emerald-300">✅ Student Account Successfully Created!</p>
                  <p className="text-slate-200">Email: <code className="text-emerald-400 font-mono">{createdStudentResult.email}</code></p>
                  <p className="text-slate-200">Password: <code className="text-emerald-400 font-mono">{createdStudentResult.password}</code></p>
                  <p className="text-[10px] text-slate-400 pt-1 font-mono">Portal URL: http://localhost:3000/portal/{selectedOrg.uniqueCode}</p>
                </div>
              )}

              {/* Bulk Results + CSV Export Button */}
              {createdBulkResults.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-emerald-300">✅ {createdBulkResults.length} Student Credentials Generated!</p>
                    <Button onClick={downloadRosterCsv} size="sm" className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full gap-1">
                      <Copy className="w-3 h-3" /> Download Roster CSV
                    </Button>
                  </div>
                  <div className="max-h-40 overflow-y-auto divide-y divide-emerald-900/30 text-[11px] font-mono">
                    {createdBulkResults.slice(0, 50).map((r, idx) => (
                      <div key={idx} className="py-1.5 flex justify-between">
                        <span className="text-slate-200">{r.studentId} ({r.name})</span>
                        <span className="text-emerald-400">Pass: {r.password}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
