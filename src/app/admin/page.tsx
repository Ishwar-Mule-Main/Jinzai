"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield, Users, DollarSign, HeadphonesIcon, LogOut, Loader2, Lock,
  LayoutDashboard, Settings as SettingsIcon, TrendingUp, UserPlus,
  ChevronRight, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  StatCard, planBadge, planLabel, PLAN_OPTIONS,
  type Section, type AdminStats, type AdminUser, type AdminTicket,
} from "./page-helpers";
import {
  DashboardSection, UsersSection, FinanceSection, TrafficSection,
  SettingsSection, AccountsSection,
} from "./sections";

const ADMIN_EMAIL = "Ishwar.mule007@gmail.com";
const ADMIN_PASSWORD = "Ishwar@2513";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<Section>("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tickets, setTickets] = useState<AdminTicket[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("admin-token");
    if (saved) {
      setToken(saved);
      loadDashboard(saved);
    }
  }, []);

  const authHeaders = (t: string) => ({ Authorization: `Bearer ${t}` });

  const loadDashboard = useCallback(async (t: string) => {
    try {
      const res = await fetch("/api/admin", { headers: authHeaders(t) });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setStats(json.stats);
      setUsers(json.users);
      setTickets(json.tickets);
    } catch {
      toast.error("Failed to load dashboard");
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

  const logout = () => {
    setToken(null);
    localStorage.removeItem("admin-token");
    setEmail("");
    setPassword("");
  };

  // ---------- Login screen ----------
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <Card className="max-w-md w-full p-8 bg-slate-900 border-slate-800">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-teal-900/40">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Control Panel</h1>
            <p className="text-xs text-slate-400 mt-1">Domain Expansion Technologies — Authorized access only</p>
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
              Login to Admin Panel
            </Button>
            <button
              onClick={() => { setEmail(ADMIN_EMAIL); setPassword(ADMIN_PASSWORD); }}
              className="w-full text-xs text-teal-400 hover:underline"
            >
              Use admin credentials
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const navItems: { id: Section; label: string; icon: typeof Users; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Users & Resumes", icon: Users, badge: stats?.totalUsers },
    { id: "finance", label: "Finance", icon: DollarSign },
    { id: "traffic", label: "Traffic & Analytics", icon: TrendingUp, badge: stats?.uniqueVisitors },
    { id: "settings", label: "AI Settings", icon: SettingsIcon },
    { id: "accounts", label: "Account Creation", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Left sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900 flex flex-col sticky top-0 h-screen">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Jinzai Admin</p>
              <p className="text-[10px] text-slate-400 leading-tight">Domain Expansion</p>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                    active
                      ? "bg-gradient-to-r from-teal-600/20 to-emerald-600/10 text-teal-300 border border-teal-700/40"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-teal-400" : ""}`} />
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge className={`text-[10px] px-1.5 py-0 h-5 border-0 ${active ? "bg-teal-700/50 text-teal-200" : "bg-slate-800 text-slate-400"}`}>
                      {item.badge}
                    </Badge>
                  )}
                  {active && <ChevronRight className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="rounded-lg bg-slate-800/50 p-2.5">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
              <HeadphonesIcon className="w-3 h-3" /> Support Tickets
            </div>
            <p className="text-xs"><span className="text-amber-400 font-bold">{stats?.openTickets || 0}</span> open</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="w-full gap-1.5 text-slate-400 hover:text-white hover:bg-slate-800 justify-start">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20">
          <div className="px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold capitalize">{navItems.find((n) => n.id === section)?.label}</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <button onClick={() => loadDashboard(token!)} className="flex items-center gap-1 hover:text-white">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
              <span className="text-slate-600">|</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </header>

        <div className="p-6">
          {section === "dashboard" && <DashboardSection stats={stats} users={users} tickets={tickets} onJump={setSection} />}
          {section === "users" && <UsersSection token={token!} onRefresh={() => loadDashboard(token!)} />}
          {section === "finance" && <FinanceSection token={token!} stats={stats} />}
          {section === "traffic" && <TrafficSection token={token!} stats={stats} />}
          {section === "settings" && <SettingsSection token={token!} />}
          {section === "accounts" && <AccountsSection token={token!} onRefresh={() => loadDashboard(token!)} />}
        </div>
      </main>
    </div>
  );
}
