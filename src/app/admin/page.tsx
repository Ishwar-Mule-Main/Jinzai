"use client";

import { useState, useEffect, useCallback } from "react";
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
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("admin-token");
          setToken(null);
          return;
        }
        throw new Error("Failed");
      }
      const json = await res.json();
      setStats(json.stats);
      setUsers(json.users);
      setTickets(json.tickets);
    } catch {
      toast.error("Failed to load admin dashboard");
    }
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <div className="max-w-md w-full p-8 bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl relative z-10 rounded-xl space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-[#faff69] flex items-center justify-center mx-auto mb-3 text-[#0a0a0a] font-bold shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Console</h1>
            <p className="text-xs text-[#888888] font-mono mt-1">Domain Expansion Technologies — Protected Workspace</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-mono text-[#888888] mb-1.5 block">Sender Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="admin@email.com"
                className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md text-xs h-10 px-3 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-[#888888] mb-1.5 block">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md text-xs h-10 px-3 outline-none transition-colors"
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>
            <button
              onClick={login}
              disabled={loading}
              className="w-full h-11 gap-2 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md transition-colors inline-flex items-center justify-center text-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Authenticate Admin Session
            </button>
            <button
              onClick={() => { setEmail(ADMIN_EMAIL); setPassword(ADMIN_PASSWORD); }}
              className="w-full text-xs text-[#faff69] hover:underline font-mono text-center block pt-1"
            >
              Use default admin credentials
            </button>
          </div>
        </div>
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

  const goToSection = (s: Section) => {
    setSection(s);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 shrink-0 border-r border-[#2a2a2a] bg-[#121212] flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#faff69] flex items-center justify-center text-[#0a0a0a] font-bold text-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight text-white">Jinzai Admin</p>
              <p className="text-[10px] text-[#888888] font-mono leading-tight">domain.expansion</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-8 h-8 rounded-md flex items-center justify-center text-[#888888] hover:bg-[#1a1a1a] hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => goToSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs transition-all ${
                    active
                      ? "bg-[#1a1a1a] text-[#faff69] border border-[#2a2a2a] font-semibold"
                      : "text-[#888888] hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-[#faff69]" : ""}`} />
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${active ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "bg-[#1a1a1a] text-[#888888]"}`}>
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="w-3.5 h-3.5 text-[#faff69]" />}
                </button>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="p-3 border-t border-[#2a2a2a] space-y-2">
          <div className="rounded-md bg-[#1a1a1a] border border-[#2a2a2a] p-3">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#888888] mb-1">
              <HeadphonesIcon className="w-3 h-3 text-[#faff69]" /> SUPPORT QUEUE
            </div>
            <p className="text-xs text-white font-mono"><span className="text-[#faff69] font-bold">{stats?.openTickets || 0}</span> tickets open</p>
          </div>
          <button onClick={logout} className="w-full h-9 px-3 text-xs text-[#888888] hover:text-white hover:bg-[#1a1a1a] rounded-md transition-colors flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5" /> Logout Session
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 w-full bg-[#0a0a0a]">
        {/* Top bar */}
        <header className="border-b border-[#2a2a2a] bg-[#0a0a0a]/90 backdrop-blur sticky top-0 z-20">
          <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden w-9 h-9 rounded-md flex items-center justify-center text-[#888888] hover:bg-[#1a1a1a] shrink-0 border border-[#2a2a2a]"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-sm font-bold capitalize truncate text-white">{navItems.find((n) => n.id === section)?.label}</h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-[#888888] shrink-0">
              <button onClick={() => loadDashboard(token!)} className="flex items-center gap-1.5 hover:text-white transition-colors bg-[#1a1a1a] border border-[#2a2a2a] px-2.5 py-1 rounded-md">
                <RefreshCw className="w-3 h-3 text-[#faff69]" /> <span className="hidden sm:inline">Refresh</span>
              </button>
              <span className="hidden sm:inline text-[#2a2a2a]">|</span>
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
