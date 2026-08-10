"use client";

import { useState, useEffect, use } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Building2,
  Lock,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  User,
  KeyRound,
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

  const [org, setOrg] = useState<any>(null);
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
      <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6200]" />
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (notFound || !org) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans">
        <PublicNav />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="font-bricolage text-2xl font-bold text-white mb-2">Institution Portal Not Found</h1>
          <p className="text-xs text-[#888898] max-w-md mb-6">
            No active college portal found for code <code className="text-white font-mono">{code}</code>. Please verify your institution link.
          </p>
          <Button onClick={() => router.push("/institutions")} className="bg-[#FF6200] hover:bg-[#E55700] text-white rounded-full font-bold text-xs px-6">
            View Institution Plans →
          </Button>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans">
      <PublicNav />

      {/* ── Institution Header Banner ── */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center border-b border-[#2E2E2E]">
        <Badge className="bg-violet-950/60 text-violet-300 border border-violet-800/60 px-4 py-1 text-xs font-mono mb-3 uppercase tracking-wider gap-1.5">
          <GraduationCap className="w-4 h-4 text-violet-400" /> Official Campus Placement Cell Portal
        </Badge>

        <h1 className="font-bricolage text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
          {org.name}
        </h1>
        <p className="text-[#888898] max-w-xl mx-auto text-xs sm:text-sm font-mono">
          Unique Institution Portal Code: <strong className="text-violet-300 font-bold">{org.uniqueCode}</strong> · Powered by Jinzai AI
        </p>
      </section>

      {/* ── Login Container ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <Card className="p-6 sm:p-8 bg-[#141414] border-2 border-violet-600/40 rounded-3xl shadow-2xl shadow-violet-950/30 text-left space-y-5">
          
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#0D0D0D] border border-[#2E2E2E] rounded-full text-xs font-semibold">
            <button
              onClick={() => setActiveTab("student")}
              className={`py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "student" ? "bg-violet-600 text-white font-bold shadow-md" : "text-[#888898] hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Student Login
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "admin" ? "bg-violet-600 text-white font-bold shadow-md" : "text-[#888898] hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" /> Officer / Admin Login
            </button>
          </div>

          {/* Tab 1: Student Login */}
          {activeTab === "student" && (
            <div className="space-y-4 pt-1">
              <div className="text-center space-y-1">
                <h2 className="font-bricolage text-lg font-bold text-white">Student Portal Sign In</h2>
                <p className="text-xs text-[#888898]">Enter your Student Roll No / ID and password issued by your placement cell</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#888898] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-violet-400" /> Student Roll No / ID
                </Label>
                <Input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder={`e.g. 23001 or 23001@${org.uniqueCode.toLowerCase()}.edu`}
                  className="bg-[#0D0D0D] border-[#2E2E2E] focus:border-violet-500 text-white placeholder:text-[#5A5A6A] rounded-xl text-xs h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#888898] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-violet-400" /> Student Password
                </Label>
                <Input
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  type="password"
                  placeholder={`e.g. 23001${org.uniqueCode}`}
                  onKeyDown={(e) => e.key === "Enter" && handleStudentLogin()}
                  className="bg-[#0D0D0D] border-[#2E2E2E] focus:border-violet-500 text-white placeholder:text-[#5A5A6A] rounded-xl text-xs h-11"
                />
              </div>

              <Button
                onClick={handleStudentLogin}
                disabled={loadingStudentLogin}
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-full shadow-lg shadow-violet-600/20 text-xs gap-2 transition-all mt-2"
              >
                {loadingStudentLogin ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Launch Student Dashboard &amp; AI Editor →
              </Button>

              <div className="p-3 bg-violet-950/20 border border-violet-800/30 rounded-2xl text-[11px] text-[#888898] space-y-1">
                <p className="font-bold text-violet-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-violet-400" /> Full Pro Features Unlocked
                </p>
                <p>Includes 78 master templates, ATS match scanner, AI bullet rewrites, and vector PDF exports.</p>
              </div>
            </div>
          )}

          {/* Tab 2: Institutional Admin / Placement Officer Login */}
          {activeTab === "admin" && (
            <div className="space-y-4 pt-1">
              <div className="text-center space-y-1">
                <h2 className="font-bricolage text-lg font-bold text-white">Placement Officer Sign In</h2>
                <p className="text-xs text-[#888898]">Manage student rosters, upload CSV files, and inspect placement resumes</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#888898] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-violet-400" /> Institutional Contact Email
                </Label>
                <Input
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="e.g. placement@iitb.ac.in"
                  className="bg-[#0D0D0D] border-[#2E2E2E] focus:border-violet-500 text-white placeholder:text-[#5A5A6A] rounded-xl text-xs h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#888898] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-violet-400" /> Institutional Admin Password
                </Label>
                <Input
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  type="password"
                  placeholder="Enter admin password"
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                  className="bg-[#0D0D0D] border-[#2E2E2E] focus:border-violet-500 text-white placeholder:text-[#5A5A6A] rounded-xl text-xs h-11"
                />
              </div>

              <Button
                onClick={handleAdminLogin}
                disabled={loadingAdminLogin}
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-full shadow-lg shadow-violet-600/20 text-xs gap-2 transition-all mt-2"
              >
                {loadingAdminLogin ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4" />}
                Access Institutional Management Dashboard →
              </Button>

              <div className="p-3 bg-violet-950/20 border border-violet-800/30 rounded-2xl text-[11px] text-[#888898] space-y-1">
                <p className="font-bold text-violet-300 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-violet-400" /> College Admin Control
                </p>
                <p>Upload student rosters via CSV / Excel, view student ATS scores, and issue logins.</p>
              </div>
            </div>
          )}

        </Card>
      </section>

      {/* ── Features List ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full border-t border-[#2E2E2E]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {[
            {
              title: "78 Master Templates",
              desc: "Instant access to all professional, technical, executive & modern resume layouts.",
              icon: LayoutGrid,
            },
            {
              title: "ATS Score & Optimization",
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
              <Card key={item.title} className="p-4 bg-[#141414] border-[#2E2E2E] rounded-2xl space-y-2">
                <Icon className="w-5 h-5 text-violet-400" />
                <h3 className="text-xs font-bold text-white">{item.title}</h3>
                <p className="text-[11px] text-[#888898]">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
