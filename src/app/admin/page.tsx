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
  ChevronRight, RefreshCw, Menu, X,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6200]/10 rounded-full blur-[140px] pointer-events-none" />
        <Card className="max-w-md w-full p-8 bg-[#141414] border-[#2E2E2E] shadow-2xl relative z-10 rounded-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6200] to-[#FF8C42] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#FF6200]/20 border border-white/10">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-bricolage text-2xl font-bold text-white">Admin Control Panel</h1>
            <p className="text-xs text-[#888898] font-mono mt-1">Domain Expansion Technologies — Protected Portal</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-[11px] font-mono text-[#888898] mb-1.5 block">Sender Email Address</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@email.com" className="bg-[#0B0B0C] border-[#2E2E2E] focus:border-[#FF6200] text-white rounded-xl text-xs" />
            </div>
            <div>
              <Label className="text-[11px] font-mono text-[#888898] mb-1.5 block">Password</Label>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="bg-[#0B0B0C] border-[#2E2E2E] focus:border-[#FF6200] text-white rounded-xl text-xs" onKeyDown={(e) => e.key === "Enter" && login()} />
            </div>
            <Button onClick={login} disabled={loading} className="w-full gap-2 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-xl shadow-lg shadow-[#FF6200]/20">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Login to Admin Panel
            </Button>
            <button
              onClick={() => { setEmail(ADMIN_EMAIL); setPassword(ADMIN_PASSWORD); }}
              className="w-full text-xs text-[#FF6200] hover:underline font-mono text-center block pt-1"
            >
              Use default admin credentials
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

  // Switch section and auto-close the sidebar on mobile
  const goToSection = (s: Section) => {
    setSection(s);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex font-sans">
      {/* Mobile overlay backdrop — click to close sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left sidebar — fixed off-canvas on mobile, static on desktop */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 shrink-0 border-r border-[#2E2E2E] bg-[#141414] flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-[#2E2E2E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6200] to-[#FF8C42] flex items-center justify-center shadow-lg shadow-[#FF6200]/20 border border-white/10">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bricolage font-bold text-sm leading-tight text-white">Jinzai Admin</p>
              <p className="text-[10px] text-[#888898] font-mono leading-tight">domain.expansion</p>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#888898] hover:bg-[#1A1A1A] hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => goToSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs transition-all group ${
                    active
                      ? "bg-[#FF6200]/10 text-[#FF6200] border border-[#FF6200]/30 font-semibold"
                      : "text-[#888898] hover:bg-[#1A1A1A] hover:text-white"
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-[#FF6200]" : ""}`} />
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge className={`text-[9px] font-mono px-1.5 py-0 h-4 border-0 ${active ? "bg-[#FF6200] text-white" : "bg-[#1A1A1A] text-[#888898]"}`}>
                      {item.badge}
                    </Badge>
                  )}
                  {active && <ChevronRight className="w-3.5 h-3.5 text-[#FF6200]" />}
                </button>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="p-3 border-t border-[#2E2E2E] space-y-2">
          <div className="rounded-xl bg-[#0B0B0C] border border-[#2E2E2E] p-3">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#888898] mb-1">
              <HeadphonesIcon className="w-3 h-3 text-[#FF6200]" /> SUPPORT QUEUE
            </div>
            <p className="text-xs text-white font-mono"><span className="text-[#FF6200] font-bold">{stats?.openTickets || 0}</span> tickets open</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="w-full gap-2 text-[#888898] hover:text-white hover:bg-[#1A1A1A] justify-start rounded-xl">
            <LogOut className="w-3.5 h-3.5" /> Logout Session
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 w-full bg-[#0D0D0D]">
        {/* Top bar */}
        <header className="border-b border-[#2E2E2E] bg-[#0D0D0D]/90 backdrop-blur sticky top-0 z-20">
          <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#888898] hover:bg-[#1A1A1A] shrink-0 border border-[#2E2E2E]"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
              <h2 className="font-bricolage text-base font-bold capitalize truncate text-white">{navItems.find((n) => n.id === section)?.label}</h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-[#888898] shrink-0">
              <button onClick={() => loadDashboard(token!)} className="flex items-center gap-1.5 hover:text-white transition-colors bg-[#141414] border border-[#2E2E2E] px-2.5 py-1 rounded-lg">
                <RefreshCw className="w-3 h-3 text-[#FF6200]" /> <span className="hidden sm:inline">Refresh</span>
              </button>
              <span className="hidden sm:inline text-[#2E2E2E]">|</span>
              <span className="hidden sm:inline text-[11px]">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {section === "dashboard" && <DashboardSection stats={stats} users={users} tickets={tickets} onJump={goToSection} token={token!} />}
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
