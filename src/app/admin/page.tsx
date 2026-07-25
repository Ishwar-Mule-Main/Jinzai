"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Shield, Users, DollarSign, HeadphonesIcon, LogOut, Loader2, Send, Lock } from "lucide-react";
import { toast } from "sonner";

const ADMIN_EMAIL = "Ishwar.mule007@gmail.com";
const ADMIN_PASSWORD = "Ishwar@2513";

interface AdminStats {
  totalUsers: number;
  freeUsers: number;
  activePaid: number;
  expired: number;
  totalResumes: number;
  totalRevenue: number;
  revenueByPlan: Record<string, number>;
  openTickets: number;
}

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  planExpiresAt: string | null;
  createdAt: string;
  resumeCount: number;
}

interface AdminTicket {
  id: string;
  email: string;
  name: string | null;
  subject: string;
  message: string;
  status: string;
  reply: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem("admin-token");
    if (saved) {
      setToken(saved);
      loadDashboard(saved);
    }
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const json = await res.json();
      setToken(json.token);
      localStorage.setItem("admin-token", json.token);
      toast.success("Admin login successful");
      loadDashboard(json.token);
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async (t: string) => {
    try {
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setStats(json.stats);
      setUsers(json.users);
      setTickets(json.tickets);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  const replyTicket = async (ticketId: string) => {
    const reply = replyText[ticketId];
    if (!reply) return;
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ticketId, reply }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Reply sent");
      setReplyText({ ...replyText, [ticketId]: "" });
      loadDashboard(token!);
    } catch {
      toast.error("Failed to send reply");
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("admin-token");
    setEmail("");
    setPassword("");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <Card className="max-w-md w-full p-8 bg-slate-900 border-slate-800">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-slate-400 mt-1">ResumeForge Administration — Authorized access only</p>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-slate-300">Admin Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@email.com" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-xs text-slate-300">Password</Label>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="bg-slate-800 border-slate-700 text-white" onKeyDown={(e) => e.key === "Enter" && login()} />
            </div>
            <Button onClick={login} disabled={loading} className="w-full gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400" />
            <span className="font-bold">ResumeForge Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-slate-400">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {stats && (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="teal" />
              <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} color="emerald" />
              <StatCard icon={Users} label="Paid Users" value={stats.activePaid} color="violet" />
              <StatCard icon={HeadphonesIcon} label="Open Tickets" value={stats.openTickets} color="amber" />
            </div>

            {/* Revenue breakdown */}
            <Card className="p-4 mb-6 bg-slate-900 border-slate-800">
              <p className="text-xs font-semibold text-slate-300 mb-3">Revenue by Plan</p>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(stats.revenueByPlan).map(([plan, amount]) => (
                  <div key={plan} className="rounded-lg bg-slate-800 p-3 text-center">
                    <p className="text-[10px] text-slate-400 uppercase">{plan.replace("_", " ₹")}</p>
                    <p className="text-lg font-bold text-emerald-400">₹{amount.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Tabs defaultValue="users">
              <TabsList className="grid grid-cols-3 w-full mb-4 bg-slate-900 border border-slate-800">
                <TabsTrigger value="users" className="text-xs gap-1.5 data-[state=active]:bg-slate-800"><Users className="w-3.5 h-3.5" /> Users</TabsTrigger>
                <TabsTrigger value="tickets" className="text-xs gap-1.5 data-[state=active]:bg-slate-800"><HeadphonesIcon className="w-3.5 h-3.5" /> Support ({stats.openTickets})</TabsTrigger>
                <TabsTrigger value="finances" className="text-xs gap-1.5 data-[state=active]:bg-slate-800"><DollarSign className="w-3.5 h-3.5" /> Finances</TabsTrigger>
              </TabsList>

              {/* Users tab */}
              <TabsContent value="users" className="space-y-2">
                <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
                  <Badge className="bg-slate-800 text-slate-300 border-0">{stats.freeUsers} Free</Badge>
                  <Badge className="bg-emerald-900/50 text-emerald-300 border-0">{stats.activePaid} Paid</Badge>
                  <Badge className="bg-rose-900/50 text-rose-300 border-0">{stats.expired} Expired</Badge>
                  <Badge className="bg-slate-800 text-slate-300 border-0">{stats.totalResumes} Resumes</Badge>
                </div>
                {users.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 p-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold">
                      {u.email[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.email}</p>
                      <p className="text-[11px] text-slate-400">
                        {u.name || "—"} · {u.resumeCount} resumes · Joined {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`border-0 ${
                      u.plan === "free" ? "bg-slate-700 text-slate-300" :
                      u.plan === "trial_99" ? "bg-amber-900/50 text-amber-300" :
                      u.plan === "pro_499" ? "bg-teal-900/50 text-teal-300" :
                      "bg-violet-900/50 text-violet-300"
                    }`}>
                      {u.plan.replace("_", " ₹")}
                    </Badge>
                    {u.planExpiresAt && new Date(u.planExpiresAt) < new Date() && (
                      <Badge className="bg-rose-900/50 text-rose-300 border-0">Expired</Badge>
                    )}
                  </div>
                ))}
              </TabsContent>

              {/* Tickets tab */}
              <TabsContent value="tickets" className="space-y-3">
                {tickets.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-8">No support tickets yet.</p>
                ) : (
                  tickets.map((t) => (
                    <Card key={t.id} className="p-4 bg-slate-900 border-slate-800">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-sm font-semibold">{t.subject}</p>
                          <p className="text-[11px] text-slate-400">From: {t.name || t.email} · {new Date(t.createdAt).toLocaleString()}</p>
                        </div>
                        <Badge className={`border-0 ${
                          t.status === "open" ? "bg-amber-900/50 text-amber-300" :
                          t.status === "replied" ? "bg-teal-900/50 text-teal-300" :
                          "bg-slate-700 text-slate-300"
                        }`}>{t.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-300 mb-3 p-2 rounded bg-slate-800">{t.message}</p>
                      {t.reply && (
                        <p className="text-xs text-emerald-300 mb-3 p-2 rounded bg-emerald-950/30 border border-emerald-900">
                          <span className="font-semibold">Admin reply:</span> {t.reply}
                        </p>
                      )}
                      {t.status !== "resolved" && (
                        <div className="flex gap-2">
                          <Input
                            value={replyText[t.id] || ""}
                            onChange={(e) => setReplyText({ ...replyText, [t.id]: e.target.value })}
                            placeholder="Type your reply..."
                            className="bg-slate-800 border-slate-700 text-white text-xs h-8"
                          />
                          <Button size="sm" onClick={() => replyTicket(t.id)} disabled={!replyText[t.id]} className="gap-1.5 shrink-0">
                            <Send className="w-3 h-3" /> Reply
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Finances tab */}
              <TabsContent value="finances" className="space-y-4">
                <Card className="p-6 bg-slate-900 border-slate-880">
                  <p className="text-xs font-semibold text-slate-300 mb-4">Financial Overview</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-slate-800 p-4">
                      <p className="text-[11px] text-slate-400">Total Revenue</p>
                      <p className="text-3xl font-bold text-emerald-400">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="rounded-lg bg-slate-800 p-4">
                      <p className="text-[11px] text-slate-400">Active Paid Users</p>
                      <p className="text-3xl font-bold text-teal-400">{stats.activePaid}</p>
                    </div>
                    <div className="rounded-lg bg-slate-800 p-4">
                      <p className="text-[11px] text-slate-400">ARPU (Avg Revenue/User)</p>
                      <p className="text-2xl font-bold text-violet-400">
                        ₹{stats.activePaid > 0 ? Math.round(stats.totalRevenue / stats.activePaid).toLocaleString("en-IN") : 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-800 p-4">
                      <p className="text-[11px] text-slate-400">Conversion Rate</p>
                      <p className="text-2xl font-bold text-amber-400">
                        {stats.totalUsers > 0 ? Math.round((stats.activePaid / stats.totalUsers) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-slate-900 border-slate-800">
                  <p className="text-xs font-semibold text-slate-300 mb-3">Revenue Breakdown</p>
                  {Object.entries(stats.revenueByPlan).map(([plan, amount]) => {
                    const pct = stats.totalRevenue > 0 ? (amount / stats.totalRevenue) * 100 : 0;
                    return (
                      <div key={plan} className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">{plan.replace("_", " ₹")}</span>
                          <span className="text-slate-400">₹{amount.toLocaleString("en-IN")} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Users; label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    teal: "text-teal-400 bg-teal-950/40",
    emerald: "text-emerald-400 bg-emerald-950/40",
    violet: "text-violet-400 bg-violet-950/40",
    amber: "text-amber-400 bg-amber-950/40",
  };
  return (
    <Card className="p-4 bg-slate-900 border-slate-800">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[11px] text-slate-400">{label}</p>
    </Card>
  );
}
