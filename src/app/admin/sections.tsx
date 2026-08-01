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
  X, Building2, GraduationCap, UserPlus, Save, Sparkles, FlaskConical,
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
import { StatCard, planBadge, planLabel, PLAN_OPTIONS, type AdminUser, type AdminStats, type AdminTicket, type AdminResume, type Section } from "./page-helpers";

const authHeaders = (t: string) => ({ Authorization: `Bearer ${t}` });

// ============================================================
// DASHBOARD SECTION
// ============================================================
export function DashboardSection({ stats, users, tickets, onJump, token }: {
  stats: AdminStats | null;
  users: AdminUser[];
  tickets: AdminTicket[];
  onJump: (s: Section) => void;
  token: string;
}) {
  const [seeding, setSeeding] = useState(false);

  if (!stats) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-teal-400" /></div>;

  const recentUsers = users.slice(0, 5);
  const recentTickets = tickets.filter((t) => t.status !== "resolved").slice(0, 4);

  const handleSeed = async () => {
    if (!token || seeding) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/seed-demo", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Seed failed");
      }
      const json = await res.json();
      const r = json.results || {};
      toast.success(
        `Seeded: ${r.orgs || 0} orgs · ${r.students || 0} students · ${r.users || 0} users · ${r.transactions || 0} transactions · ${r.pageViews || 0} page views · ${r.tickets || 0} tickets`,
        { duration: 6000 }
      );
      // Reload dashboard stats
      onJump("dashboard");
      // Best-effort page reload to refresh all stats from server
      setTimeout(() => window.location.reload(), 800);
    } catch (e) {
      toast.error("Failed to seed demo data: " + (e as Error).message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Seed Demo Data action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">Dashboard Overview</h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time platform metrics and quick actions</p>
        </div>
        <Button
          onClick={handleSeed}
          disabled={seeding}
          className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
        >
          {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
          {seeding ? "Seeding..." : "Seed Demo Data"}
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} sub={`${stats.freeUsers} free · ${stats.activePaid} paid`} color="teal" onClick={() => onJump("users")} />
        <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} sub={`${stats.transactions} transactions`} color="emerald" onClick={() => onJump("finance")} />
        <StatCard icon={TrendingUp} label="Unique Visitors" value={stats.uniqueVisitors} sub={`${stats.pageViews} page views`} color="violet" onClick={() => onJump("traffic")} />
        <StatCard icon={FileText} label="Resumes Created" value={stats.totalResumes} sub={`${stats.organizations} orgs · ${stats.students} students`} color="amber" />
      </div>

      {/* Conversion + Revenue snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-teal-400" /> Conversion Rate</p>
          <p className="text-3xl font-bold text-teal-400">{stats.totalUsers > 0 ? Math.round((stats.activePaid / stats.totalUsers) * 100) : 0}%</p>
          <p className="text-[11px] text-slate-400 mt-1">{stats.activePaid} paid of {stats.totalUsers} users</p>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden mt-3">
            <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{ width: `${stats.totalUsers > 0 ? (stats.activePaid / stats.totalUsers) * 100 : 0}%` }} />
          </div>
        </Card>
        <Card className="p-5 bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Revenue by Plan</p>
          <div className="space-y-2">
            {Object.entries(stats.revenueByPlan).map(([plan, amount]) => {
              const pct = stats.totalRevenue > 0 ? (amount / stats.totalRevenue) * 100 : 0;
              return (
                <div key={plan}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">{planLabel(plan)}</span>
                    <span className="text-slate-400">₹{amount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5 bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-violet-400" /> Organizations</p>
          <p className="text-3xl font-bold text-violet-400">{stats.organizations}</p>
          <p className="text-[11px] text-slate-400 mt-1">{stats.students} student accounts</p>
          <Button variant="outline" size="sm" className="w-full mt-3 gap-1.5 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" onClick={() => onJump("accounts")}>
            <Plus className="w-3 h-3" /> Create Org / Student
          </Button>
        </Card>
      </div>

      {/* Recent users + tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-300">Recent Users</p>
            <button onClick={() => onJump("users")} className="text-[10px] text-teal-400 hover:underline">View all →</button>
          </div>
          <div className="space-y-2">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold">{u.email[0]?.toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{u.email}</p>
                  <p className="text-[10px] text-slate-400">{u.name || "—"} · {new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge className={`text-[9px] border-0 ${planBadge(u.plan)}`}>{planLabel(u.plan)}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5 bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-300">Open Support Tickets</p>
            <Badge className="bg-amber-900/50 text-amber-300 border-0 text-[10px]">{recentTickets.length} open</Badge>
          </div>
          {recentTickets.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">No open tickets 🎉</p>
          ) : (
            <div className="space-y-2">
              {recentTickets.map((t) => (
                <div key={t.id} className="p-2 rounded-lg bg-slate-800/50">
                  <p className="text-xs font-medium truncate">{t.subject}</p>
                  <p className="text-[10px] text-slate-400">{t.name || t.email} · {new Date(t.createdAt).toLocaleDateString()}</p>
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
// USERS & RESUMES SECTION
// ============================================================
export function UsersSection({ token, onRefresh }: { token: string; onRefresh: () => void }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (planFilter && planFilter !== "all") params.set("plan", planFilter);
      if (roleFilter && roleFilter !== "all") params.set("role", roleFilter);
      const res = await fetch(`/api/admin/users?${params}`, { headers: authHeaders(token) });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setUsers(json.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token, search, planFilter, roleFilter]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

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
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4 bg-slate-900 border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email, name, or student ID..."
              className="pl-9 bg-slate-800 border-slate-700 text-white h-9"
              onKeyDown={(e) => e.key === "Enter" && loadUsers()}
            />
          </div>
          <Select value={planFilter || "all"} onValueChange={(v) => setPlanFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white h-9"><SelectValue placeholder="All plans" /></SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">All plans</SelectItem>
              {PLAN_OPTIONS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={roleFilter || "all"} onValueChange={(v) => setRoleFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white h-9"><SelectValue placeholder="All roles" /></SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="org_admin">Org Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadUsers} variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 h-9 gap-1.5">
            <Search className="w-3.5 h-3.5" /> Search
          </Button>
          <div className="text-xs text-slate-400 ml-auto">{users.length} users</div>
        </div>
      </Card>

      {/* Users list */}
      <Card className="bg-slate-900 border-slate-800">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-teal-400" /></div>
        ) : users.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">No users found.</p>
        ) : (
          <div className="divide-y divide-slate-800">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-4 hover:bg-slate-800/40 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-semibold shrink-0">
                  {u.email[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{u.email}</p>
                    {u.role === "student" && <Badge className="bg-violet-900/50 text-violet-300 border-0 text-[9px]"><GraduationCap className="w-2.5 h-2.5 mr-0.5" />Student</Badge>}
                    {u.organization && <Badge className="bg-slate-800 text-slate-300 border-0 text-[9px]">{u.organization.name}</Badge>}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {u.name || "—"} · {u.resumeCount} resumes · {u.studentId ? `ID: ${u.studentId} · ` : ""}Joined {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={`border-0 text-[10px] ${planBadge(u.plan)}`}>{planLabel(u.plan)}</Badge>
                {u.planExpiresAt && new Date(u.planExpiresAt) < new Date() && (
                  <Badge className="bg-rose-900/50 text-rose-300 border-0 text-[10px]">Expired</Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-800">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
                    <DropdownMenuLabel className="text-slate-400 text-xs">Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => openUserDetail(u)} className="text-slate-200 text-xs cursor-pointer">
                      <Eye className="w-3.5 h-3.5 mr-2" /> View Details & Resumes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedUser(u); setEditOpen(true); }} className="text-slate-200 text-xs cursor-pointer">
                      <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem onClick={() => { setSelectedUser(u); setDeleteOpen(true); }} className="text-rose-400 text-xs cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </Card>

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
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete user account?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete <span className="text-rose-400 font-medium">{selectedUser?.email}</span> and all their resumes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700">Delete permanently</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// User detail dialog — shows user info + their resumes (with view/edit)
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
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden bg-slate-900 border-slate-700 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm">{user.email[0]?.toUpperCase()}</div>
            User Details
          </DialogTitle>
          <DialogDescription className="text-slate-400">Full account info and resume management</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto pr-1 space-y-4">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <InfoRow label="Email" value={user.email} onCopy={copyCreds} />
            <InfoRow label="Name" value={user.name || "—"} />
            <InfoRow label="Plan" value={<Badge className={`border-0 ${planBadge(user.plan)}`}>{planLabel(user.plan)}</Badge>} />
            <InfoRow label="Role" value={user.role} />
            <InfoRow label="Student ID" value={user.studentId || "—"} />
            <InfoRow label="Organization" value={user.organization?.name || "—"} />
            <InfoRow label="Plan Expires" value={user.planExpiresAt ? new Date(user.planExpiresAt).toLocaleString() : "No expiry"} />
            <InfoRow label="Joined" value={new Date(user.createdAt).toLocaleString()} />
          </div>

          {/* Resumes */}
          <div>
            <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Resumes ({resumes.length})</p>
            {loading ? (
              <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-teal-400" /></div>
            ) : resumes.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6 bg-slate-800/30 rounded-lg">No resumes created yet.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {resumes.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/50">
                    <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{r.title}</p>
                      <p className="text-[10px] text-slate-400">{r.template} · Updated {new Date(r.updatedAt).toLocaleDateString()}{r.contactLocked && " · 🔒 locked"}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-[10px] gap-1 text-teal-400" onClick={() => window.open(`/r/${r.slug}`, "_blank")}>
                      <ExternalLink className="w-3 h-3" /> Open
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onDelete} className="gap-1.5 bg-rose-900/30 border-rose-800 text-rose-300 hover:bg-rose-900/50">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </Button>
          <Button onClick={onEdit} className="gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600">
            <Pencil className="w-3.5 h-3.5" /> Edit Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value, onCopy }: { label: string; value: React.ReactNode; onCopy?: () => void }) {
  return (
    <div className="rounded-lg bg-slate-800/50 p-2.5">
      <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <p className="text-xs text-slate-100 break-all">{value}</p>
        {onCopy && <Copy className="w-3 h-3 text-slate-500 hover:text-teal-400 cursor-pointer shrink-0" onClick={onCopy} />}
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
      <DialogContent className="max-w-lg bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2"><Pencil className="w-4 h-4 text-teal-400" /> Edit User Account</DialogTitle>
          <DialogDescription className="text-slate-400">Modify account data, plan, or reset password</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <Label className="text-xs text-slate-300">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div>
            <Label className="text-xs text-slate-300">Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-300">Plan</Label>
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {PLAN_OPTIONS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} {p.price > 0 && `(₹${p.price})`}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-300">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="org_admin">Org Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-300">Custom Duration (days)</Label>
              <Input value={planDurationDays} onChange={(e) => setPlanDurationDays(e.target.value)} type="number" placeholder="e.g. 365" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pb-2">
                <input type="checkbox" checked={resetPlan} onChange={(e) => setResetPlan(e.target.checked)} className="accent-teal-500" />
                Reset plan expiry to default
              </label>
            </div>
          </div>
          <div>
            <Label className="text-xs text-slate-300">Reset Password (leave blank to keep)</Label>
            <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="text" placeholder="New password" className="bg-slate-800 border-slate-700 text-white" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-slate-800 border-slate-700 text-slate-300">Cancel</Button>
          <Button onClick={save} disabled={saving} className="gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// FINANCE SECTION
// ============================================================
export function FinanceSection({ token, stats }: { token: string; stats: AdminStats | null }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/finance?range=${range}`, { headers: authHeaders(token) });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch {
      toast.error("Failed to load finance data");
    } finally {
      setLoading(false);
    }
  }, [token, range]);

  useEffect(() => { load(); }, [load]);

  if (loading || !data) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-teal-400" /></div>;

  const maxDaily = Math.max(...(data.dailySeries || []).map((d: any) => d.amount), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">Financial analytics — revenue, transactions, conversion</p>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[120px] bg-slate-800 border-slate-700 text-white h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
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

      {/* Revenue chart */}
      <Card className="p-5 bg-slate-900 border-slate-800">
        <p className="text-xs font-semibold text-slate-300 mb-4 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Revenue Over Time</p>
        <div className="flex items-end gap-1 h-40">
          {(data.dailySeries || []).map((d: any) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div
                className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-teal-400 hover:from-emerald-500 hover:to-teal-300 transition-colors"
                style={{ height: `${(d.amount / maxDaily) * 100}%`, minHeight: d.amount > 0 ? "4px" : "1px" }}
              />
              <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                ₹{d.amount} · {d.date.slice(5)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-2">
          <span>{data.dailySeries?.[0]?.date?.slice(5) || ""}</span>
          <span>{data.dailySeries?.[data.dailySeries.length - 1]?.date?.slice(5) || ""}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue by plan */}
        <Card className="p-5 bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-300 mb-3">Revenue by Plan</p>
          <div className="space-y-3">
            {Object.entries(data.revenueByPlan || {}).map(([plan, amount]: [string, any]) => {
              const pct = data.totalRevenue > 0 ? (amount / data.totalRevenue) * 100 : 0;
              return (
                <div key={plan}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{planLabel(plan)}</span>
                    <span className="text-slate-400">₹{amount.toLocaleString("en-IN")} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {data.refunds > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <p className="text-[11px] text-rose-400">Refunds: ₹{data.refunds.toLocaleString("en-IN")}</p>
            </div>
          )}
        </Card>

        {/* Plan distribution */}
        <Card className="p-5 bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-300 mb-3">Plan Distribution</p>
          <div className="space-y-2">
            {Object.entries(data.planDistribution || {}).map(([plan, count]: [string, any]) => {
              const total = Object.values(data.planDistribution || {}).reduce((s: number, c: any) => s + c, 0);
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={plan} className="flex items-center gap-3">
                  <Badge className={`border-0 ${planBadge(plan)} text-[10px] w-20 justify-center`}>{planLabel(plan)}</Badge>
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-slate-600" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-12 text-right">{count} ({pct.toFixed(0)}%)</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Transactions table */}
      <Card className="bg-slate-900 border-slate-800">
        <div className="p-4 border-b border-slate-800">
          <p className="text-xs font-semibold text-slate-300">Recent Transactions</p>
        </div>
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-800">
          {(data.transactions || []).length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">No transactions recorded yet. Revenue is estimated from current paid plans.</p>
          ) : data.transactions.map((t: any) => (
            <div key={t.id} className="flex items-center gap-3 p-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.status === "success" ? "bg-emerald-950/40 text-emerald-400" : t.status === "refunded" ? "bg-rose-950/40 text-rose-400" : "bg-amber-950/40 text-amber-400"}`}>
                {t.status === "success" ? <ArrowUpCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{t.email}</p>
                <p className="text-[10px] text-slate-400">{planLabel(t.plan)} · {t.method} · {new Date(t.createdAt).toLocaleString()}</p>
                {t.note && <p className="text-[10px] text-slate-500 mt-0.5">{t.note}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-400">₹{t.amount.toLocaleString("en-IN")}</p>
                <Badge className={`text-[9px] border-0 ${t.status === "success" ? "bg-emerald-900/50 text-emerald-300" : t.status === "refunded" ? "bg-rose-900/50 text-rose-300" : "bg-amber-900/50 text-amber-300"}`}>{t.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// TRAFFIC & ANALYTICS SECTION
// ============================================================
export function TrafficSection({ token, stats }: { token: string; stats: AdminStats | null }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`, { headers: authHeaders(token) });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [token, range]);

  useEffect(() => { load(); }, [load]);

  if (loading || !data) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-teal-400" /></div>;

  const maxDailyViews = Math.max(...(data.dailySeries || []).map((d: any) => d.views), 1);
  const deviceIcon = (d: string) => d === "mobile" ? Smartphone : d === "tablet" ? Tablet : Monitor;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">Visitor traffic, page views, and conversion funnel</p>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[120px] bg-slate-800 border-slate-700 text-white h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Globe} label="Page Views" value={data.totalViews || 0} sub={`${range} range`} color="teal" />
        <StatCard icon={Users} label="Unique Visitors" value={data.uniqueVisitors || 0} sub={`${data.newVisitors || 0} new`} color="violet" />
        <StatCard icon={TrendingUp} label="Signup Rate" value={`${(data.funnel?.signupRate || 0).toFixed(1)}%`} sub={`${data.funnel?.signups || 0} signups`} color="emerald" />
        <StatCard icon={DollarSign} label="Conversion" value={`${(data.funnel?.conversionRate || 0).toFixed(1)}%`} sub={`${data.funnel?.paid || 0} paid`} color="amber" />
      </div>

      {/* Traffic chart */}
      <Card className="p-5 bg-slate-900 border-slate-800">
        <p className="text-xs font-semibold text-slate-300 mb-4 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-teal-400" /> Traffic Over Time</p>
        <div className="flex items-end gap-1 h-40">
          {(data.dailySeries || []).map((d: any) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5 group relative">
              <div className="w-full rounded-t bg-gradient-to-t from-teal-600 to-violet-400 hover:from-teal-500 hover:to-violet-300 transition-colors" style={{ height: `${(d.views / maxDailyViews) * 100}%`, minHeight: d.views > 0 ? "4px" : "1px" }} />
              {d.visitors > 0 && (
                <div className="w-full bg-violet-600/60 rounded-b" style={{ height: "3px" }} />
              )}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                {d.views} views · {d.visitors} visitors
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px]">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-teal-500" /> Page views</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-violet-500" /> Unique visitors</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top pages */}
        <Card className="p-5 bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-teal-400" /> Top Pages</p>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {(data.topPages || []).length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">No page views yet.</p>
            ) : data.topPages.map((p: any, i: number) => (
              <div key={p.path} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 w-4">{i + 1}</span>
                <span className="text-xs text-slate-300 flex-1 truncate font-mono">{p.path}</span>
                <span className="text-xs text-teal-400 font-medium">{p.views}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top referrers */}
        <Card className="p-5 bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-violet-400" /> Top Referrers</p>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {(data.topReferrers || []).length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">No referrers tracked yet.</p>
            ) : data.topReferrers.map((r: any) => (
              <div key={r.source} className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-300 flex-1 truncate">{r.source}</span>
                <span className="text-xs text-violet-400 font-medium">{r.visits}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Conversion funnel */}
      <Card className="p-5 bg-slate-900 border-slate-800">
        <p className="text-xs font-semibold text-slate-300 mb-4 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Conversion Funnel</p>
        <div className="space-y-3">
          {[
            { label: "Visitors", value: data.funnel?.visitors || 0, color: "from-teal-600 to-teal-400", icon: Globe },
            { label: "Signups", value: data.funnel?.signups || 0, color: "from-violet-600 to-violet-400", icon: Users },
            { label: "Paid Users", value: data.funnel?.paid || 0, color: "from-emerald-600 to-emerald-400", icon: DollarSign },
          ].map((step) => {
            const max = data.funnel?.visitors || 1;
            const pct = max > 0 ? (step.value / max) * 100 : 0;
            return (
              <div key={step.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5"><step.icon className="w-3 h-3" /> {step.label}</span>
                  <span className="text-slate-400">{step.value} ({pct.toFixed(1)}%)</span>
                </div>
                <div className="h-6 rounded bg-slate-800 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${step.color} flex items-center justify-end px-2`} style={{ width: `${Math.max(pct, 2)}%` }}>
                    {pct > 10 && <span className="text-[10px] text-white font-medium">{step.value}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Devices */}
      {data.devices && Object.keys(data.devices).length > 0 && (
        <Card className="p-5 bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-300 mb-3">Devices</p>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(data.devices).map(([d, count]: [string, any]) => {
              const Icon = deviceIcon(d);
              const total = Object.values(data.devices).reduce((s: number, c: any) => s + c, 0);
              return (
                <div key={d} className="rounded-lg bg-slate-800/50 p-3 text-center">
                  <Icon className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <p className="text-lg font-bold">{count}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{d} · {total > 0 ? Math.round((count / total) * 100) : 0}%</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
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
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", { headers: authHeaders(token) });
      if (!res.ok) throw new Error("Failed");
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

  const testModel = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "Software Engineer",
          experience: "3 years building React apps",
          skills: ["React", "TypeScript"],
        }),
      });
      if (!res.ok) throw new Error("Test failed");
      const j = await res.json();
      setTestResult(j.summary || j.text || "Success — model responded");
      toast.success("AI model is working!");
    } catch (e) {
      setTestResult(`Error: ${(e as Error).message}`);
      toast.error("Model test failed");
    } finally {
      setTesting(false);
    }
  };

  if (loading || !settings) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-teal-400" /></div>;

  return (
    <div className="space-y-4 max-w-3xl">
      <Card className="p-5 bg-slate-900 border-slate-800">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-violet-950/40 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">OpenRouter AI Configuration</p>
            <p className="text-[11px] text-slate-400">Change the AI model or API key anytime. Changes apply platform-wide instantly — no redeploy needed.</p>
          </div>
        </div>

        {/* Current status */}
        <div className="rounded-lg bg-slate-800/50 p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5"><KeyRound className="w-3 h-3" /> Current API Key</p>
            {settings.hasApiKey ? (
              <Badge className="bg-emerald-900/50 text-emerald-300 border-0 text-[10px]"><CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Active</Badge>
            ) : (
              <Badge className="bg-rose-900/50 text-rose-300 border-0 text-[10px]"><AlertCircle className="w-2.5 h-2.5 mr-1" /> Missing</Badge>
            )}
          </div>
          <p className="text-xs font-mono text-slate-300 break-all">{settings.apiKey || "(none — using fallback)"}</p>
          <p className="text-[10px] text-slate-500 mt-1">{settings.apiKeyLength} characters</p>
        </div>

        {/* New API key */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-slate-300 flex items-center gap-1.5"><KeyRound className="w-3 h-3" /> New API Key (leave blank to keep current)</Label>
            <Input value={newApiKey} onChange={(e) => setNewApiKey(e.target.value)} type="password" placeholder="sk-or-v1-..." className="bg-slate-800 border-slate-700 text-white font-mono" />
            <p className="text-[10px] text-slate-500 mt-1">Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-teal-400 hover:underline">openrouter.ai/keys</a></p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-xs text-slate-300 flex items-center gap-1.5"><Cpu className="w-3 h-3 text-[#FF6200]" /> Select OpenRouter Model ({settings.models?.length || 0} models available)</Label>
            </div>
            <Input
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              placeholder="e.g. openai/gpt-4o-mini or anthropic/claude-3.5-sonnet"
              className="bg-slate-800 border-slate-700 text-white font-mono text-xs mb-2"
            />
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Choose from OpenRouter catalog..." /></SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 max-h-80">
                {(settings.models || []).map((m: any) => (
                  <SelectItem key={m.id} value={m.id} className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{m.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{m.id}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-slate-400 mt-1">
              Select from catalog or type any valid OpenRouter model ID string above (e.g. <code className="text-[#FF6200]">openai/gpt-4o-mini</code>, <code className="text-[#FF6200]">deepseek/deepseek-r1</code>).
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button onClick={save} disabled={saving || (!newApiKey.trim() && selectedModel === settings.model)} className="gap-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Settings
            </Button>
            <Button onClick={testModel} disabled={testing} variant="outline" className="gap-1.5 bg-slate-800 border-slate-700 text-slate-300">
              {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Test Model
            </Button>
          </div>

          {testResult && (
            <div className="rounded-lg bg-slate-800/50 p-3 mt-2">
              <p className="text-[10px] text-slate-400 mb-1">Test result:</p>
              <p className="text-xs text-slate-200">{testResult}</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 bg-slate-900 border-slate-800">
        <p className="text-[11px] text-slate-400 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span><strong className="text-slate-300">Note:</strong> Some models have region restrictions or rate limits. If AI features stop working, switch to <code className="text-teal-400">meta-llama/llama-3.3-70b-instruct</code> which works globally. Settings are stored in the database and override environment variables.</span>
        </p>
      </Card>
    </div>
  );
}

// ============================================================
// ACCOUNT CREATION SECTION (2 subsections)
// ============================================================
export function AccountsSection({ token, onRefresh }: { token: string; onRefresh: () => void }) {
  const [sub, setSub] = useState<"individual" | "organization">("individual");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSub("individual")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${sub === "individual" ? "bg-teal-600/20 text-teal-300 border border-teal-700/40" : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"}`}
        >
          <UserPlus className="w-4 h-4" /> Individual Account
        </button>
        <button
          onClick={() => setSub("organization")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${sub === "organization" ? "bg-violet-600/20 text-violet-300 border border-violet-700/40" : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"}`}
        >
          <Building2 className="w-4 h-4" /> Organization / College
        </button>
      </div>

      {sub === "individual" ? <IndividualAccountForm token={token} onCreated={onRefresh} /> : <OrganizationSection token={token} onCreated={onRefresh} />}
    </div>
  );
}

function IndividualAccountForm({ token, onCreated }: { token: string; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState("pro_499");
  const [duration, setDuration] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<{ email: string; plan: string } | null>(null);

  const submit = async () => {
    if (!email || !password) { toast.error("Email and password are required"); return; }
    setSaving(true);
    try {
      const body: Record<string, unknown> = { email, password, plan };
      if (name) body.name = name;
      if (duration) body.planDurationDays = Number(duration);
      const res = await fetch("/api/admin/accounts/individual", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed");
      }
      const j = await res.json();
      setCreated({ email: j.email, plan: j.plan });
      toast.success(`Account created: ${j.email}`);
      setName(""); setEmail(""); setPassword(""); setDuration("");
      onCreated();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const genPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    let p = "";
    for (let i = 0; i < 12; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setPassword(p);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-5 bg-slate-900 border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-teal-950/40 flex items-center justify-center"><UserPlus className="w-4.5 h-4.5 text-teal-400" /></div>
          <div>
            <p className="text-sm font-semibold text-white">Create Individual Account</p>
            <p className="text-[11px] text-slate-400">Manually create a user with any plan access</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-slate-300">Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div>
            <Label className="text-xs text-slate-300">Email *</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="user@email.com" className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div>
            <Label className="text-xs text-slate-300">Password *</Label>
            <div className="flex gap-2">
              <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set a password" className="bg-slate-800 border-slate-700 text-white" />
              <Button onClick={genPassword} variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 shrink-0">Generate</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-300">Plan Access</Label>
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {PLAN_OPTIONS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}{p.price > 0 && ` (₹${p.price})`}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-300">Duration (days)</Label>
              <Input value={duration} onChange={(e) => setDuration(e.target.value)} type="number" placeholder="Default" className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <Button onClick={submit} disabled={saving} className="w-full gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Create Account
          </Button>
        </div>
      </Card>

      <Card className="p-5 bg-slate-900 border-slate-800">
        <p className="text-xs font-semibold text-slate-300 mb-3">Created Account Details</p>
        {created ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-emerald-950/30 border border-emerald-900 p-4">
              <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><p className="text-sm font-semibold text-emerald-300">Account created successfully</p></div>
              <div className="space-y-1.5 text-xs">
                <p><span className="text-slate-400">Email:</span> <span className="text-slate-200 font-mono">{created.email}</span></p>
                <p><span className="text-slate-400">Plan:</span> <Badge className={`border-0 ${planBadge(created.plan)}`}>{planLabel(created.plan)}</Badge></p>
              </div>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-3">
              <p className="text-[10px] text-slate-400 mb-1">Share these credentials with the user:</p>
              <p className="text-xs text-slate-300">Login URL: <span className="text-teal-400 font-mono">/</span> (homepage → Login)</p>
              <p className="text-xs text-slate-300 mt-1">The user can now sign in with the email and password you set.</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-xs text-slate-400 py-12">Fill the form to create an account. The created credentials will appear here.</p>
        )}
      </Card>
    </div>
  );
}

// ============================================================
// ORGANIZATION / COLLEGE SECTION
// ============================================================
function OrganizationSection({ token, onCreated }: { token: string; onCreated: () => void }) {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [showStudents, setShowStudents] = useState(false);

  // Create org form
  const [name, setName] = useState("");
  const [type, setType] = useState("college");
  const [uniqueCode, setUniqueCode] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [plan, setPlan] = useState("pro_499");
  const [seats, setSeats] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/organizations", { headers: authHeaders(token) });
      if (!res.ok) throw new Error("Failed");
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

  const deleteOrg = async (id: string) => {
    if (!confirm("Delete this organization? Student accounts will be unlinked but not deleted.")) return;
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

  const genCode = () => {
    const base = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");
    const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
    setUniqueCode(`${base}${rand}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">Create college/institution accounts and bulk student accounts under them</p>
        <Button onClick={() => setShowCreate(true)} className="gap-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600">
          <Plus className="w-3.5 h-3.5" /> New Organization
        </Button>
      </div>

      {/* How it works */}
      <Card className="p-4 bg-violet-950/20 border-violet-900/40">
        <div className="flex items-start gap-3">
          <GraduationCap className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-300 space-y-1">
            <p className="font-semibold text-violet-300">How bulk student accounts work:</p>
            <p>1. Create an organization (e.g. "IIT Bombay") with a unique code (e.g. <code className="text-violet-300">IITBX3</code>).</p>
            <p>2. Add student accounts under it — student ID becomes their login prefix, password = <code className="text-violet-300">studentId + uniqueCode</code>.</p>
            <p>3. Example: Student ID <code className="text-violet-300">23001</code> → email <code className="text-violet-300">23001@iitbx3.edu</code>, password <code className="text-violet-300">23001IITBX3</code>.</p>
          </div>
        </div>
      </Card>

      {/* Orgs list */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-violet-400" /></div>
      ) : orgs.length === 0 ? (
        <Card className="p-8 bg-slate-900 border-slate-800 text-center">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No organizations yet. Create one to start adding student accounts.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orgs.map((o) => (
            <Card key={o.id} className="p-4 bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-violet-950/40 flex items-center justify-center"><Building2 className="w-5 h-5 text-violet-400" /></div>
                  <div>
                    <p className="text-sm font-semibold text-white">{o.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{o.type} · {new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge className={`border-0 ${planBadge(o.plan)}`}>{planLabel(o.plan)}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="rounded bg-slate-800/50 p-2">
                  <p className="text-[10px] text-slate-400">Unique Code</p>
                  <p className="font-mono text-violet-300 font-bold">{o.uniqueCode}</p>
                </div>
                <div className="rounded bg-slate-800/50 p-2">
                  <p className="text-[10px] text-slate-400">Students</p>
                  <p className="font-bold text-white">{o.studentCount}{o.seats > 0 && <span className="text-[10px] text-slate-500"> / {o.seats}</span>}</p>
                </div>
              </div>
              {o.contactEmail && <p className="text-[10px] text-slate-400 mb-2">📧 {o.contactEmail}</p>}
              <div className="flex gap-2">
                <Button onClick={() => { setSelectedOrg(o); setShowStudents(true); }} size="sm" className="flex-1 gap-1.5 bg-violet-700 hover:bg-violet-600">
                  <GraduationCap className="w-3.5 h-3.5" /> Manage Students
                </Button>
                <Button onClick={() => deleteOrg(o.id)} size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-rose-400 hover:bg-rose-900/30">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create org dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2"><Building2 className="w-4 h-4 text-violet-400" /> Create Organization / College</DialogTitle>
            <DialogDescription className="text-slate-400">Create a parent account to manage student accounts under it</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <Label className="text-xs text-slate-300">Organization Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. IIT Bombay" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-300">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="institute">Institute</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-300">Default Student Plan</Label>
                <Select value={plan} onValueChange={setPlan}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {PLAN_OPTIONS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}{p.price > 0 && ` (₹${p.price})`}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-300">Unique Code</Label>
              <div className="flex gap-2">
                <Input value={uniqueCode} onChange={(e) => setUniqueCode(e.target.value.toUpperCase())} placeholder="e.g. IITBX3" className="bg-slate-800 border-slate-700 text-white font-mono" maxLength={10} />
                <Button onClick={genCode} variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 shrink-0">Auto</Button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Used in student passwords: <code className="text-violet-300">studentId + uniqueCode</code></p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-300">Contact Email</Label>
                <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" placeholder="placement@college.edu" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-xs text-slate-300">Contact Phone</Label>
                <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+91..." className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-300">Total Seats</Label>
              <Input value={seats} onChange={(e) => setSeats(e.target.value)} type="number" placeholder="e.g. 200" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-xs text-slate-300">Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any internal notes..." className="bg-slate-800 border-slate-700 text-white min-h-[60px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="bg-slate-800 border-slate-700 text-slate-300">Cancel</Button>
            <Button onClick={createOrg} disabled={saving || !name} className="gap-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage students dialog */}
      {selectedOrg && (
        <ManageStudentsDialog org={selectedOrg} token={token} open={showStudents} onOpenChange={setShowStudents} onCreated={() => { load(); onCreated(); }} />
      )}
    </div>
  );
}

function ManageStudentsDialog({ org, token, open, onOpenChange, onCreated }: {
  org: any; token: string; open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void;
}) {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [plan, setPlan] = useState(org.plan);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState<any>(null);

  const createStudents = async () => {
    setSaving(true);
    setResults(null);
    try {
      let body: any;
      if (mode === "single") {
        if (!studentId) { toast.error("Student ID is required"); setSaving(false); return; }
        body = { studentId, name: studentName, plan };
      } else {
        // Parse bulk: one student per line, format "studentId,name" or just "studentId"
        const lines = bulkText.split("\n").map((l) => l.trim()).filter(Boolean);
        const students = lines.map((l) => {
          const [sid, ...nameParts] = l.split(",").map((s) => s.trim());
          return { studentId: sid, name: nameParts.join(",") || "" };
        });
        if (students.length === 0) { toast.error("Add at least one student"); setSaving(false); return; }
        body = { students, plan };
      }
      const res = await fetch(`/api/admin/organizations/${org.id}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed");
      }
      const j = await res.json();
      setResults(j);
      toast.success(`${j.created} student(s) created`);
      setStudentId(""); setStudentName(""); setBulkText("");
      onCreated();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const downloadCredentials = () => {
    if (!results?.students) return;
    const csv = "Student ID,Name,Email,Password,Status\n" + results.students.map((s: any) =>
      `"${s.studentId}","${s.name}","${s.email}","${s.password}","${s.status}"`
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${org.name}-student-credentials.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Credentials downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2"><GraduationCap className="w-4 h-4 text-violet-400" /> Manage Students — {org.name}</DialogTitle>
          <DialogDescription className="text-slate-400">Code: <code className="text-violet-300">{org.uniqueCode}</code> · Password format: <code className="text-violet-300">studentId + {org.uniqueCode}</code></DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => setMode("single")} className={`px-3 py-1.5 rounded text-xs ${mode === "single" ? "bg-violet-700 text-white" : "bg-slate-800 text-slate-400"}`}>Single</button>
          <button onClick={() => setMode("bulk")} className={`px-3 py-1.5 rounded text-xs ${mode === "bulk" ? "bg-violet-700 text-white" : "bg-slate-800 text-slate-400"}`}>Bulk (CSV)</button>
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {mode === "single" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-300">Student ID *</Label>
                <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 23001" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-xs text-slate-300">Student Name</Label>
                <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g. Ramesh Kumar" className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>
          ) : (
            <div>
              <Label className="text-xs text-slate-300">Bulk Students (one per line: <code className="text-violet-300">studentId,name</code> or just <code className="text-violet-300">studentId</code>)</Label>
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={"23001,Ramesh Kumar\n23002,Priya Sharma\n23003,Amit Patel"}
                className="bg-slate-800 border-slate-700 text-white font-mono text-xs min-h-[120px]"
              />
            </div>
          )}
          <div>
            <Label className="text-xs text-slate-300">Plan</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {PLAN_OPTIONS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}{p.price > 0 && ` (₹${p.price})`}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {results && (
            <div className="rounded-lg bg-slate-800/50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">Results: {results.created} created, {results.exists} already existed, {results.errors} errors</p>
                {results.created > 0 && (
                  <Button onClick={downloadCredentials} size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-teal-400 gap-1.5 h-7 text-[10px]">
                    <Copy className="w-3 h-3" /> Download CSV
                  </Button>
                )}
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {results.students.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] p-1.5 rounded bg-slate-900/50">
                    {s.status === "created" ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : s.status === "exists" ? <AlertCircle className="w-3 h-3 text-amber-400" /> : <AlertCircle className="w-3 h-3 text-rose-400" />}
                    <span className="text-slate-300 w-16">{s.studentId}</span>
                    <span className="text-slate-400 flex-1 truncate">{s.email}</span>
                    <span className="text-slate-500 font-mono">{s.password}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-slate-800 border-slate-700 text-slate-300">Close</Button>
          <Button onClick={createStudents} disabled={saving} className="gap-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GraduationCap className="w-3.5 h-3.5" />} Create {mode === "bulk" ? "Students" : "Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
