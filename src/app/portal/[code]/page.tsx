"use client";

import { useState, useEffect, use } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Building2,
  Lock,
  Loader2,
  Sparkles,
  ShieldCheck,
  FileText,
  User,
  LayoutGrid,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";

export default function InstitutionPortalPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();

  const [org, setOrg] = useState<{ name?: string; uniqueCode?: string; contactEmail?: string } | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student");

  // Student form state
  const [studentId, setStudentId] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [loadingStudentLogin, setLoadingStudentLogin] = useState(false);

  // Admin form state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loadingAdminLogin, setLoadingAdminLogin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingOrg(true);

    fetch(`/api/portal/${code}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setOrg(data.organization);
          setAdminEmail(data.organization.contactEmail || "");
          setNotFound(false);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoadingOrg(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  const handleStudentLogin = async () => {
    if (!studentId || !studentPassword) {
      toast.error("Please enter your Student Roll No / ID and password");
      return;
    }

    setLoadingStudentLogin(true);
    try {
      const email = studentId.includes("@")
        ? studentId.trim().toLowerCase()
        : `${studentId.trim()}@${org?.uniqueCode?.toLowerCase()}.edu`.toLowerCase();

      const res = await signIn("credentials", {
        email,
        password: studentPassword,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid student credentials. Please check your Student Roll No and password.");
      } else {
        toast.success(`Welcome to ${org?.name || "Institution"} Placement Portal!`);
        router.push("/dashboard");
      }
    } catch {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoadingStudentLogin(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminEmail || !adminPassword) {
      toast.error("Please enter your Institutional Email and Admin Password");
      return;
    }

    setLoadingAdminLogin(true);
    try {
      const res = await signIn("credentials", {
        email: adminEmail.trim().toLowerCase(),
        password: adminPassword,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid institutional admin credentials.");
      } else {
        toast.success(`Welcome back, Placement Cell Officer!`);
        router.push(`/portal/${code}/dashboard`);
      }
    } catch {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoadingAdminLogin(false);
    }
  };

  if (loadingOrg) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#faff69]" />
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (notFound || !org) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
        <PublicNav />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-14 h-14 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center mb-4 text-[#ef4444]">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Institution Portal Not Found</h1>
          <p className="text-xs text-[#888888] max-w-md mb-6 font-mono">
            No active college portal found for code: <code className="text-white">{code}</code>.
          </p>
          <button onClick={() => router.push("/institutions")} className="h-10 px-5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] rounded-md font-semibold text-xs transition-colors">
            View Institutional Solutions →
          </button>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
      <PublicNav />

      {/* ── Institution Header Banner ── */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center border-b border-[#2a2a2a]">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] text-xs font-mono text-[#888888] mb-3 uppercase tracking-wider">
          <GraduationCap className="w-4 h-4 text-[#faff69]" /> Official Campus Placement Portal
        </span>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
          {org.name}
        </h1>
        <p className="text-[#888888] max-w-xl mx-auto text-xs sm:text-sm font-mono">
          Unique Institution Portal Code: <strong className="text-[#faff69] font-bold">{org.uniqueCode}</strong> · Powered by Jinzai
        </p>
      </section>

      {/* ── Login Container ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="p-6 sm:p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-left space-y-5">
          
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#121212] border border-[#2a2a2a] rounded-md text-xs font-semibold">
            <button
              onClick={() => setActiveTab("student")}
              className={`py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "student" ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "text-[#888888] hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Student Login
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "admin" ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "text-[#888888] hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" /> Placement Officer
            </button>
          </div>

          {/* Tab 1: Student Login */}
          {activeTab === "student" && (
            <div className="space-y-4 pt-1">
              <div className="text-center space-y-1">
                <h2 className="text-base font-bold text-white tracking-tight">Student Portal Sign In</h2>
                <p className="text-xs text-[#888888]">Enter your Student Roll No / ID and password issued by placement cell</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#888888] flex items-center gap-1.5 font-mono">
                  <User className="w-3.5 h-3.5 text-[#faff69]" /> Student Roll No / ID
                </label>
                <input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder={`e.g. 23001 or 23001@${org.uniqueCode?.toLowerCase()}.edu`}
                  className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md text-xs h-10 px-3 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#888888] flex items-center gap-1.5 font-mono">
                  <Lock className="w-3.5 h-3.5 text-[#faff69]" /> Student Password
                </label>
                <input
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  type="password"
                  placeholder={`e.g. 23001${org.uniqueCode}`}
                  onKeyDown={(e) => e.key === "Enter" && handleStudentLogin()}
                  className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md text-xs h-10 px-3 outline-none"
                />
              </div>

              <button
                onClick={handleStudentLogin}
                disabled={loadingStudentLogin}
                className="w-full h-11 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md text-xs gap-2 transition-colors mt-2 inline-flex items-center justify-center disabled:opacity-50"
              >
                {loadingStudentLogin ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Launch Student Dashboard &amp; AI Editor →
              </button>

              <div className="p-3 bg-[#121212] border border-[#2a2a2a] rounded-lg text-[11px] text-[#888888] space-y-1">
                <p className="font-bold text-[#faff69] flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3" /> Full Pro Tier Unlocked
                </p>
                <p>Includes 78 master templates, ATS validator, AI rewrites, and vector PDF exports.</p>
              </div>
            </div>
          )}

          {/* Tab 2: Placement Officer Login */}
          {activeTab === "admin" && (
            <div className="space-y-4 pt-1">
              <div className="text-center space-y-1">
                <h2 className="text-base font-bold text-white tracking-tight">Placement Officer Sign In</h2>
                <p className="text-xs text-[#888888]">Manage student rosters, upload CSV files, and inspect placement resumes</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#888888] flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-[#faff69]" /> Institutional Contact Email
                </label>
                <input
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="e.g. placement@iitb.ac.in"
                  className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md text-xs h-10 px-3 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#888888] flex items-center gap-1.5 font-mono">
                  <Lock className="w-3.5 h-3.5 text-[#faff69]" /> Institutional Admin Password
                </label>
                <input
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  type="password"
                  placeholder="Enter admin password"
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                  className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md text-xs h-10 px-3 outline-none"
                />
              </div>

              <button
                onClick={handleAdminLogin}
                disabled={loadingAdminLogin}
                className="w-full h-11 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md text-xs gap-2 transition-colors mt-2 inline-flex items-center justify-center disabled:opacity-50"
              >
                {loadingAdminLogin ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4" />}
                Access Institutional Console →
              </button>

              <div className="p-3 bg-[#121212] border border-[#2a2a2a] rounded-lg text-[11px] text-[#888888] space-y-1">
                <p className="font-bold text-[#faff69] flex items-center gap-1 font-mono">
                  <ShieldAlert className="w-3 h-3" /> Campus Admin Controls
                </p>
                <p>Upload student rosters via CSV / Excel, view student ATS scores, and manage access.</p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── Features List ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full border-t border-[#2a2a2a]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {[
            {
              title: "78 Master Templates",
              desc: "Full access to all engineering, executive, and modern layouts.",
              icon: LayoutGrid,
            },
            {
              title: "ATS Optimization",
              desc: "Real-time job match scanner and bullet point achievement quantifier.",
              icon: ShieldCheck,
            },
            {
              title: "Vector PDF Download",
              desc: "100% vector PDF export ready for campus placement recruiters.",
              icon: FileText,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl space-y-2">
                <Icon className="w-5 h-5 text-[#faff69]" />
                <h3 className="text-xs font-bold text-white">{item.title}</h3>
                <p className="text-[11px] text-[#888888]">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
