"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES, ACCENT_PRESETS, FONT_OPTIONS, FONT_SIZE_OPTIONS } from "@/lib/resume/types";
import { ResumeRenderer } from "./resume-renderer";
import { TemplateThumbnail } from "./template-thumbnail";
import { ResumeEditor } from "./resume-editor";
import { getCompletion } from "@/lib/resume/sample-data";
import { getSampleProfile } from "@/lib/resume/sample-profiles";
import { downloadDocx } from "@/lib/resume/docx-export";
import { downloadPdfDirectly } from "@/lib/resume/pdf-export";
import { A4MultiPageWrapper } from "./a4-multi-page-wrapper";
import { useKeyboardShortcuts } from "@/lib/resume/use-shortcuts";
import { CoverLetterDialog, AtsDialog, ResumeScoreDialog } from "./ai-dialogs";
import { SavedResumesDialog, ImportExportJson } from "./saved-resumes";
import { ShareDialog } from "./share-dialog";
import { CompareTemplatesDialog } from "./compare-templates";
import { TemplateSidePanel } from "./template-side-panel";
import { RoleExamplesDialog, OnboardingTour } from "./role-examples-dialog";
import { ImportResumeDialog } from "./import-resume-dialog";
import { SupportDialog } from "./support-dialog";
import { NotificationBell } from "./notification-bell";
import { ZoomControls } from "./zoom-controls";
import { BuildChoice } from "./build-choice";
import { AuthDialog, LogoutButton, type AuthMode } from "./auth-dialogs";
import { PricingDialog } from "./pricing-dialog";
import { Footer } from "./footer";
import { BrandMark } from "./brand-mark";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { getPlanConfig, isPaidPlan, canCreateResume, remainingResumes } from "@/lib/resume/plans";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText,
  Sparkles,
  Download,
  Save,
  Undo2,
  Redo2,
  Loader2,
  ArrowLeft,
  Eye,
  Settings2,
  Wand2,
  Check,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Search,
  Star,
  ChevronDown,
  FolderOpen,
  Mail,
  Target,
  ImageIcon,
  Gauge,
  PanelLeftClose,
  Crown,
  Lock,
  LogIn,
  UserPlus,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ---------- Dashboard ----------

function TemplateCard({ id, index, user, onAuthRequired }: { id: (typeof TEMPLATES)[number]; index: number; user: { plan: string } | null; onAuthRequired: () => void }) {
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setView = useResumeStore((s) => s.setView);
  const sampleData = getSampleProfile(index);

  const useTemplate = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    setTemplate(id.id);
    setView("editor");
  };

  return (
    <Card className="overflow-hidden group hover:shadow-2xl hover:shadow-[#FF6200]/10 transition-all duration-300 hover:-translate-y-1.5 border-[#2E2E2E] hover:border-[#FF6200]/50 bg-[#141414] rounded-2xl">
      <div className="bg-white overflow-hidden relative border-b border-[#2E2E2E]" style={{ height: "320px" }}>
        {/* LIVE resume preview with sample data — scaled to fit card width */}
        <div className="origin-top-left absolute top-0 left-0 pointer-events-none" style={{ transform: "scale(0.40)", width: "250%", minHeight: "800px" }}>
          <ResumeRenderer data={sampleData} accent={id.accentDefault} font={id.fontDefault} template={id.id} />
        </div>
        {/* Hover actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-5 gap-2">
          <Button size="sm" onClick={useTemplate} className="h-9 gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-full shadow-lg shadow-[#FF6200]/30 px-5">
            <FileText className="w-4 h-4" /> Use Template
          </Button>
        </div>
        {/* Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end z-10">
          {id.premium && (
            <Badge className="bg-[#FF6200] text-white border-0 gap-1 text-[8px] font-mono shadow-md px-2 py-0.5">
              <Crown className="w-2.5 h-2.5" /> PRO
            </Badge>
          )}
          {id.hasPhoto && (
            <Badge className="bg-black/80 text-white border border-white/10 gap-1 text-[9px] font-mono backdrop-blur">
              <ImageIcon className="w-2.5 h-2.5" /> Photo
            </Badge>
          )}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bricolage font-bold text-base mb-1 text-white">{id.name}</h3>
        <p className="text-xs text-[#888898] line-clamp-2 mb-3.5 leading-relaxed">{id.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {id.tags.map((t) => (
            <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] text-[#888898] font-mono">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-4 rounded-xl bg-[#141414] border border-[#2E2E2E]">
      <p className="text-2xl sm:text-3xl font-bold font-bricolage text-gradient-orange">{value}</p>
      <p className="text-[11px] font-mono text-[#888898] mt-1">{label}</p>
    </div>
  );
}

const TEMPLATE_CATEGORIES = ["All", "Sidebar", "Banner", "Single", "Serif", "Minimal", "ATS", "Photo", "Numbered", "Creative"] as const;

function TemplateGallery({ user, onAuthRequired }: { user: { plan: string } | null; onAuthRequired: () => void }) {
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = TEMPLATES.map((t, originalIndex) => ({ t, originalIndex })).filter(({ t }) => {
    const matchesFilter = filter === "All" || t.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())) || t.name.toLowerCase().includes(filter.toLowerCase());
    const matchesQuery = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-bricolage text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">Choose a template</h2>
          <p className="text-sm text-[#888898]">{TEMPLATES.length} distinct designs — each auto-adapts to hide empty sections and rebalance to your content.</p>
        </div>
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-[#2E2E2E] bg-[#141414] text-[#888898] font-mono text-xs">
          <LayoutGrid className="w-3.5 h-3.5 text-[#FF6200]" /> {filtered.length} shown
        </Badge>
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-3 sticky top-16 z-10 bg-[#0D0D0D]/90 backdrop-blur py-3 -mx-1 px-1 border-b border-[#2E2E2E]/50">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888898]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates by name or tag…"
            className="pl-10 h-10 text-xs bg-[#141414] border-[#2E2E2E] focus:border-[#FF6200] text-white rounded-xl"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all ${
                filter === cat
                  ? "bg-[#FF6200] text-white border-[#FF6200] font-semibold shadow-md shadow-[#FF6200]/20"
                  : "bg-[#141414] text-[#888898] border-[#2E2E2E] hover:border-[#FF6200]/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(({ t, originalIndex }) => (
          <TemplateCard key={t.id} id={t} index={originalIndex} user={user} onAuthRequired={onAuthRequired} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#888898]">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-40 text-[#FF6200]" />
          <p className="text-sm">No templates match your search. Try a different filter.</p>
        </div>
      )}
    </>
  );
}

function Dashboard() {
  const loadSample = useResumeStore((s) => s.loadSample);
  const clearAll = useResumeStore((s) => s.clearAll);
  const setView = useResumeStore((s) => s.setView);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setContactLocked = useResumeStore((s) => s.setContactLocked);
  const { user, refresh } = useCurrentUser();
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [showBuildChoice, setShowBuildChoice] = useState(false);

  const planConfig = user ? getPlanConfig(user.plan) : getPlanConfig("free");
  const canCreate = user ? canCreateResume(user.plan, user.resumeCount) : true; // not logged in = can try

  // Listen for the "open login" event dispatched by the LogoutToast popup
  useEffect(() => {
    const openLogin = () => setAuthMode("login");
    window.addEventListener("jinzai:open-login", openLogin);
    return () => window.removeEventListener("jinzai:open-login", openLogin);
  }, []);

  const handleStartBuilding = () => {
    if (!user) {
      setAuthMode("signup");
      return;
    }
    if (!canCreate) {
      toast.error(`You've reached the resume limit for your ${planConfig.name} plan. Upgrade to create more.`);
      return;
    }
    clearAll();
    setContactLocked(false);
    setTemplate("modern");
    setView("editor");
  };

  const handleTrySample = () => {
    if (!user) {
      setAuthMode("signup");
      return;
    }
    loadSample();
    setContactLocked(false);
    setView("editor");
  };

  const handleImport = () => {
    if (!user) {
      setAuthMode("signup");
      return;
    }
    setShowBuildChoice(true);
  };

  if (showBuildChoice && user) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <BrandMark showParent />
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs">
                <span className="text-muted-foreground">{user.email}</span>
                <Badge variant="outline" className="text-[9px] py-0 px-1.5">{planConfig.name}</Badge>
              </div>
              <LogoutButton onLogout={async () => { await refresh(); setShowBuildChoice(false); }} />
            </div>
          </div>
        </header>
        <BuildChoice user={user} onChooseEditor={() => { setShowBuildChoice(false); setTemplate("modern"); setView("editor"); }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <TemplateSidePanel />
                <ImportResumeDialog />
                <SavedResumesDialog />
              </>
            ) : null}
            <SupportDialog />
            {user && (
              <PricingDialog currentPlan={user.plan} onSubscribed={refresh} trigger={
                <Button size="sm" className="gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                  <Crown className="w-3.5 h-3.5" /> {user.plan === "free" ? "Upgrade" : planConfig.name}
                </Button>
              } />
            )}
            {user ? (
              <>
                <NotificationBell />
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs">
                  <span className="text-muted-foreground">{user.email}</span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1.5">{planConfig.name}</Badge>
                </div>
                <LogoutButton onLogout={refresh} />
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setAuthMode("login")} className="gap-1.5">
                  <LogIn className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Log In</span>
                </Button>
                <Button size="sm" onClick={() => setAuthMode("signup")} className="gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                  <UserPlus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign Up</span>
                </Button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex-1 w-full space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <Badge className="bg-[#1A1A1A] border-[#2E2E2E] text-[#FF6200] px-3.5 py-1.5 rounded-full font-mono text-xs gap-2 inline-flex shadow-lg shadow-[#FF6200]/10">
            <Sparkles className="w-3.5 h-3.5" /> Domain Expansion AI Resume Platform v3.0
          </Badge>
          <h1 className="font-bricolage text-4xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            Transform Your Career Story into <span className="text-gradient-orange">Unstoppable Opportunity</span>
          </h1>
          <p className="text-[#888898] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            <strong className="text-white">Jinzai</strong> (人材) pairs GPT-4o-mini AI intelligence with 72 ATS-certified templates to craft high-impact resumes, cover letters, and live web profiles in under 3 minutes.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <StatCard value={String(TEMPLATES.length)} label="Master Templates" />
          <StatCard value="100%" label="Vector ATS Ready" />
          <StatCard value="20x" label="Interview Callback Rate" />
          <StatCard value="< 3m" label="Average Build Time" />
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap justify-center items-center gap-3">
          <Button onClick={handleStartBuilding} size="lg" className="h-12 px-7 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold gap-2 shadow-xl shadow-[#FF6200]/25 transition-all">
            <FileText className="w-4 h-4" /> {user ? "Start Building Resume" : "Get Started Free"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-6 rounded-full border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] hover:border-[#FF6200]/50 gap-2 transition-all"
            onClick={handleImport}
          >
            <Upload className="w-4 h-4 text-[#FF6200]" /> Upload & AI Scan
          </Button>
          <Button onClick={handleTrySample} variant="ghost" size="lg" className="h-12 px-5 text-[#888898] hover:text-white gap-2">
            <Wand2 className="w-4 h-4 text-[#FF6200]" /> Load Sample Profile
          </Button>
        </div>

        {/* Status text */}
        {!user && (
          <p className="text-center text-xs text-[#888898] font-mono">
            Sign up free to create and save your resume. Upgrade when ready to export.
          </p>
        )}

        {/* Template gallery */}
        <TemplateGallery user={user} onAuthRequired={() => setAuthMode("signup")} />

        {/* Features Strip */}
        <div className="pt-8">
          <div className="text-center mb-10 space-y-2">
            <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">Everything You Need to Land Top Offers</h2>
            <p className="text-sm text-[#888898] max-w-xl mx-auto">GPT-4o-mini AI writing assistance, ATS keyword matching, and 72 recruiter-approved templates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "GPT-4o-mini AI Rewriter", desc: "Transforms weak job descriptions into quantified bullet points with action verbs.", icon: Sparkles },
              { title: "Resume Quality Score", desc: "Instant A–F grade across 8 dimensions — quantification, action verbs, and completeness.", icon: Gauge },
              { title: "ATS Keyword Matcher", desc: "Paste target job descriptions to get match scores and missing keyword recommendations.", icon: Target },
              { title: "Tailored Cover Letters", desc: "Generate role-specific, compelling cover letters in formal, modern, or concise tones.", icon: Mail },
            ].map((f) => (
              <Card key={f.title} className="p-6 rounded-2xl bg-[#141414] border-[#2E2E2E] hover:border-[#FF6200]/40 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] group-hover:border-[#FF6200]/50 flex items-center justify-center mb-4 text-[#FF6200] transition-colors">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bricolage text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-[#888898] leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing preview */}
        <div className="pt-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">Transparent & Flexible Pricing</h2>
            <p className="text-sm text-[#888898]">Start free. Upgrade when you are ready to export your vector ATS PDF.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Trial", price: "₹99", period: "2 days", features: ["1 resume export", "Vector PDF & DOCX export", "Access to 52 templates"], highlight: false },
              { name: "Pro Plan", price: "₹499", period: "/month", features: ["Up to 5 resumes", "Vector PDF & DOCX export", "GPT-4o-mini AI rewriter", "ATS score & match analysis"], highlight: true },
              { name: "Business Plan", price: "₹1,999", period: "/month", features: ["Unlimited resumes", "All 72 templates", "Priority support", "Multi-page A4 export"], highlight: false },
            ].map((plan) => (
              <Card key={plan.name} className={`rounded-2xl p-6 bg-[#141414] border transition-all ${plan.highlight ? "border-[#FF6200] ring-2 ring-[#FF6200]/20 shadow-xl shadow-[#FF6200]/10" : "border-[#2E2E2E]"}`}>
                {plan.highlight && (
                  <Badge className="bg-[#FF6200] text-white text-[9px] font-mono mb-3 px-2 py-0.5">MOST POPULAR</Badge>
                )}
                <p className="font-bricolage font-bold text-lg text-white mb-1">{plan.name}</p>
                <p className="text-3xl font-bold text-white mb-1">{plan.price}<span className="text-xs font-normal text-[#888898]">{plan.period}</span></p>
                <ul className="space-y-2 mt-4 text-xs text-[#888898]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF6200]" /> {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <div className="text-center pt-2">
            {user ? (
              <PricingDialog currentPlan={user.plan} onSubscribed={refresh} trigger={
                <Button className="h-11 px-8 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold gap-2 shadow-lg shadow-[#FF6200]/20">
                  <Crown className="w-4 h-4" /> View Full Pricing & Upgrades
                </Button>
              } />
            ) : (
              <Button onClick={() => setAuthMode("signup")} className="h-11 px-8 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold gap-2 shadow-lg shadow-[#FF6200]/20">
                <UserPlus className="w-4 h-4" /> Create Free Account
              </Button>
            )}
          </div>
        </div>

        {/* Trust Banner */}
        <div className="rounded-3xl border border-[#2E2E2E] bg-[#141414] p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#FF6200] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">100% Vector ATS Ready</p>
                <p className="text-xs text-[#888898] mt-0.5">Selectable text layers Taleo and Workday parse cleanly.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#FF6200] shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Real-Time Live Adaptation</p>
                <p className="text-xs text-[#888898] mt-0.5">Instant design rebalancing as you add content.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#FF6200] shrink-0">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Direct Vector Export</p>
                <p className="text-xs text-[#888898] mt-0.5">Export high-precision PDF and Word (.docx) documents.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials / Social Proof */}
        <div className="pt-8">
          <div className="text-center mb-8 space-y-2">
            <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">Trusted by Thousands of Job Seekers</h2>
            <p className="text-sm text-[#888898]">Real success stories from professionals who landed top offers using Jinzai.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Rahul Verma", role: "Software Engineer at Google", quote: "I got 3 interview calls within a week of using Jinzai. The GPT-4o-mini rewriter highlighted my achievements with exact numbers.", avatar: "R" },
              { name: "Ananya Krishnan", role: "Product Manager at Swiggy", quote: "The ATS keyword matcher helped me optimize my resume for exactly what recruiters were looking for. Landed my PM role!", avatar: "A" },
              { name: "Vikram Singh", role: "Data Scientist at Amazon", quote: "72 master templates meant I could find the perfect design. The vector PDF export passed Taleo ATS without a hitch.", avatar: "V" },
            ].map((t) => (
              <Card key={t.name} className="p-6 rounded-2xl bg-[#141414] border-[#2E2E2E] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF6200] flex items-center justify-center font-bold text-white shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-[#888898]">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 text-amber-400">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#888898] leading-relaxed italic">"{t.quote}"</p>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-[#888898]">Everything you need to know about Jinzai and Domain Expansion.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              { q: "Is Jinzai free to start?", a: "Yes! You can browse all 72 templates and create your resume for free. To export high-precision vector PDFs or Word (.docx) documents, upgrade to a paid plan starting at just ₹99." },
              { q: "How does the GPT-4o-mini AI scanning & writing work?", a: "Our AI scans raw resume text or uploaded files (.pdf, .docx, .json, .md, .txt), parses all information, and populates all prebuilt sections automatically. It also rewrites weak bullets into quantified impact statements." },
              { q: "Are the exported PDFs 100% ATS friendly?", a: "Yes! All PDF exports use selectable vector text layers. ATS scanners (Taleo, Greenhouse, Workday, Jobscan) extract 100% of all text without OCR or formatting errors." },
              { q: "Can I import my old resume?", a: "Yes! Simply click 'Upload & AI Scan' or 'Import Resume', choose your file, and AI will parse all sections into structured editor fields." },
              { q: "Is my data secure?", a: "Absolutely. Passwords are bcrypt-hashed, all data is transmitted over HTTPS, and user content is encrypted with zero third-party data sharing." },
            ].map((faq, i) => (
              <details key={i} className="group rounded-2xl bg-[#141414] border border-[#2E2E2E] p-5">
                <summary className="cursor-pointer text-sm font-bold text-white flex items-center justify-between gap-2 list-none">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-[#888898] group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <p className="text-xs text-[#888898] leading-relaxed mt-3 pt-3 border-t border-[#2E2E2E]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="rounded-3xl bg-gradient-to-r from-[#FF6200]/20 via-[#141414] to-[#FF8C42]/10 border border-[#FF6200]/30 p-10 sm:p-14 text-center space-y-4">
          <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">Ready to Build Your Resume?</h2>
          <p className="text-sm text-[#888898] max-w-md mx-auto">Join thousands of professionals who landed top offers with Jinzai. Start building free today.</p>
          <Button size="lg" onClick={() => setAuthMode("signup")} className="h-12 px-8 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold gap-2 shadow-xl shadow-[#FF6200]/30">
            <UserPlus className="w-4 h-4" /> Get Started Free
          </Button>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Auth dialog */}
      <AuthDialog mode={authMode} onClose={() => setAuthMode(null)} onSuccess={async () => { await refresh(); setShowBuildChoice(true); }} />
      <OnboardingTour />
    </div>
  );
}

// ---------- Editor view ----------

function TemplateSwitcher() {
  const template = useResumeStore((s) => s.template);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <LayoutGrid className="w-3.5 h-3.5" /> Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Switch Template</DialogTitle>
          <DialogDescription>Pick a design — your content stays the same, only the layout changes. {TEMPLATES.length} templates available.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTemplate(t.id); }}
              className={`text-left rounded-xl border-2 overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${
                template === t.id ? "border-teal-500 ring-2 ring-teal-500/20" : "border-border"
              }`}
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden relative">
                <TemplateThumbnail templateId={t.id} className="w-full h-full" />
                {template === t.id && (
                  <div className="absolute top-1.5 right-1.5 bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold truncate">{t.name}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CustomizePanel() {
  const accent = useResumeStore((s) => s.accentColor);
  const setAccent = useResumeStore((s) => s.setAccentColor);
  const font = useResumeStore((s) => s.fontFamily);
  const setFont = useResumeStore((s) => s.setFontFamily);
  const fontSize = useResumeStore((s) => s.fontSize);
  const setFontSize = useResumeStore((s) => s.setFontSize);
  const template = useResumeStore((s) => s.template);
  const tpl = TEMPLATES.find((t) => t.id === template);
  const { user } = useCurrentUser();
  const isPaid = user ? isPaidPlan(user.plan) : false;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium mb-2">Accent color</p>
        <div className="flex flex-wrap gap-2 items-center">
          {ACCENT_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                accent === c ? "border-foreground scale-110 shadow-sm" : "border-transparent hover:scale-110"
              }`}
              style={{ background: c }}
              aria-label={`Select ${c}`}
            />
          ))}
          <label className="relative w-7 h-7 rounded-full overflow-hidden border border-input cursor-pointer flex items-center justify-center bg-gradient-to-br from-pink-500 via-yellow-500 to-teal-500" title="Custom color">
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium mb-2">Font size</p>
        <div className="flex gap-1.5">
          {FONT_SIZE_OPTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setFontSize(s.id)}
              className={`flex-1 py-1.5 rounded-md border text-xs font-medium transition-all ${
                fontSize === s.id ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300" : "border-border hover:bg-muted/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium">Font family</p>
          {!isPaid && <span className="text-[9px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5"><Lock className="w-2.5 h-2.5" /> Premium = paid plan</span>}
        </div>
        <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto">
          {FONT_OPTIONS.map((f) => {
            const isPremium = "premium" in f && f.premium;
            const locked = isPremium && !isPaid;
            return (
              <button
                key={f.id}
                onClick={() => !locked && setFont(f.id)}
                disabled={locked}
                className={`text-left px-3 py-2 rounded-md border text-sm transition-all flex items-center justify-between ${
                  font === f.id ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300" : "border-border hover:bg-muted/50"
                } ${locked ? "opacity-50 cursor-not-allowed" : ""} ${f.className}`}
              >
                <span>{f.label}</span>
                {locked && <Lock className="w-3 h-3 text-amber-500" />}
              </button>
            );
          })}
        </div>
      </div>
      {tpl && !tpl.hasPhoto && (
        <p className="text-[11px] text-muted-foreground italic">
          The {tpl.name} template does not include a photo slot.
        </p>
      )}
    </div>
  );
}

function SaveLoadBar({ saveRef }: { saveRef?: React.MutableRefObject<(() => void) | null> }) {
  const data = useResumeStore((s) => s.data);
  const template = useResumeStore((s) => s.template);
  const accent = useResumeStore((s) => s.accentColor);
  const font = useResumeStore((s) => s.fontFamily);
  const title = useResumeStore((s) => s.title);
  const setTitle = useResumeStore((s) => s.setTitle);
  const savedId = useResumeStore((s) => s.savedId);
  const setSavedId = useResumeStore((s) => s.setSavedId);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        id: savedId,
        title,
        template,
        accentColor: accent,
        fontFamily: font,
        content: JSON.stringify(data),
      };
      const res = await fetch("/api/resumes", {
        method: savedId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setSavedId(json.id);
      toast.success(savedId ? "Resume updated" : "Resume saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Expose save to parent via ref for keyboard shortcuts
  if (saveRef) saveRef.current = save;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-44 h-9 text-sm"
        placeholder="Resume title"
      />
      <Button size="sm" variant="outline" onClick={save} disabled={saving} className="gap-1.5">
        <Save className="w-3.5 h-3.5" /> {saving ? "Saving…" : savedId ? "Saved" : "Save"}
      </Button>
    </div>
  );
}

function KeyboardShortcutsHint() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="hidden lg:flex items-center gap-1 h-8 px-2 rounded-md text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Keyboard shortcuts"
        >
          <kbd className="font-sans">⌘</kbd>
          <kbd className="font-sans">K</kbd>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-base">⌨️</span> Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>Speed up your workflow with these shortcuts.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {[
            { keys: ["Ctrl", "Z"], action: "Undo" },
            { keys: ["Ctrl", "Shift", "Z"], action: "Redo" },
            { keys: ["Ctrl", "S"], action: "Save resume" },
            { keys: ["Ctrl", "P"], action: "Export to PDF (print)" },
            { keys: ["Esc"], action: "Back to templates" },
          ].map((s) => (
            <div key={s.action} className="flex items-center justify-between gap-3 py-1.5 border-b last:border-0">
              <span className="text-sm text-foreground/80">{s.action}</span>
              <div className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="min-w-6 h-6 px-1.5 inline-flex items-center justify-center rounded border bg-muted text-[10px] font-mono font-semibold"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground text-center pt-1">
          On Mac, use <kbd className="font-mono">⌘</kbd> instead of <kbd className="font-mono">Ctrl</kbd>.
        </p>
      </DialogContent>
    </Dialog>
  );
}

function EditorView() {
  const data = useResumeStore((s) => s.data);
  const template = useResumeStore((s) => s.template);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const accent = useResumeStore((s) => s.accentColor);
  const font = useResumeStore((s) => s.fontFamily);
  const fontSize = useResumeStore((s) => s.fontSize);
  const title = useResumeStore((s) => s.title);
  const contactLocked = useResumeStore((s) => s.contactLocked);
  const setView = useResumeStore((s) => s.setView);
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const past = useResumeStore((s) => s.past);
  const future = useResumeStore((s) => s.future);
  const completion = getCompletion(data);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [previewZoom, setPreviewZoom] = useState(1);
  const [exporting, setExporting] = useState(false);
  const saveRef = useRef<(() => void) | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const { user, refresh } = useCurrentUser();
  const planConfig = user ? getPlanConfig(user.plan) : getPlanConfig("free");
  const canExport = user ? planConfig.canExport : false;

  const print = async () => {
    if (!canExport) {
      toast.error("Export is available on paid plans. Upgrade to export your resume.");
      return;
    }

    if (!resumeRef.current) {
      toast.error("Resume content not ready");
      return;
    }

    setExporting(true);
    const toastId = toast.loading("Generating your A4 PDF resume...");

    try {
      await downloadPdfDirectly(resumeRef.current, title || "Resume");
      toast.success("Resume PDF downloaded directly!", { id: toastId });
    } catch (err) {
      console.error("PDF Export Error:", err);
      toast.error("Direct PDF download failed, opening print preview...", { id: toastId });
      window.print();
    } finally {
      setExporting(false);
    }
  };

  const handleDocxExport = () => {
    if (!canExport) {
      toast.error("Export is available on paid plans. Upgrade to export your resume.");
      return;
    }
    downloadDocx(data, accent, title);
    toast.success("Word document downloaded");
  };

  useKeyboardShortcuts({
    onSave: () => saveRef.current?.(),
    onPrint: print,
    onBack: () => setView("dashboard"),
    enabled: true,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top toolbar */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 sticky top-0 z-30 print:hidden">
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setView("dashboard")} className="gap-1.5">
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Templates</span>
            </Button>
            <div className="hidden sm:flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={past.length === 0} title="Undo (Ctrl+Z)">
                <Undo2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={future.length === 0} title="Redo (Ctrl+Shift+Z)">
                <Redo2 className="w-3.5 h-3.5" />
              </Button>
              <div className="h-5 w-px bg-border mx-0.5" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hidden lg:flex"
                onClick={() => setSidebarOpen((v) => !v)}
                title={sidebarOpen ? "Hide editor (maximize preview)" : "Show editor"}
              >
                <PanelLeftClose className={`w-3.5 h-3.5 transition-transform ${sidebarOpen ? "" : "rotate-180"}`} />
              </Button>
              <div className="h-5 w-px bg-border mx-0.5" />
              <ThemeToggle className="h-8 w-8" />
              <KeyboardShortcutsHint />
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <SaveLoadBar saveRef={saveRef} />
            <div className="hidden md:block h-5 w-px bg-border mx-0.5" />
            <TemplateSwitcher />
            <CompareTemplatesDialog />
            {/* Resume Score + ATS gated behind Pro (₹499+) plan */}
            {(user?.plan === "pro_499" || user?.plan === "business_1999") ? (
              <>
                <ResumeScoreDialog />
                <AtsDialog />
              </>
            ) : (
              <PricingDialog currentPlan={user?.plan || "free"} onSubscribed={refresh} trigger={
                <Button size="sm" variant="outline" className="gap-1.5 border-amber-400 text-amber-700 dark:text-amber-400">
                  <Lock className="w-3.5 h-3.5" /> Score & ATS
                </Button>
              } />
            )}
            <CoverLetterDialog />
            <ShareDialog />
            {user && !canExport && (
              <PricingDialog currentPlan={user.plan} onSubscribed={refresh} trigger={
                <Button size="sm" variant="outline" className="gap-1.5 border-amber-400 text-amber-700 dark:text-amber-400">
                  <Lock className="w-3.5 h-3.5" /> Unlock Export
                </Button>
              } />
            )}
            <Button size="sm" onClick={print} disabled={!canExport || exporting} className="gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold shadow-lg shadow-[#FF6200]/20 disabled:opacity-50">
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : canExport ? <Download className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {exporting ? "Downloading PDF..." : "Export PDF"}
            </Button>
          </div>
        </div>
        {/* progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </header>

      {/* Mobile view toggle */}
      <div className="lg:hidden border-b bg-background print:hidden">
        <div className="flex">
          <button
            onClick={() => setMobileView("edit")}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${mobileView === "edit" ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 bg-teal-50/50 dark:bg-teal-950/20" : "text-muted-foreground"}`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1.5" /> Edit
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${mobileView === "preview" ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 bg-teal-50/50 dark:bg-teal-950/20" : "text-muted-foreground"}`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1.5" /> Preview
          </button>
        </div>
      </div>

      {/* Main split */}
      <div className={`flex-1 grid print:block ${sidebarOpen ? "grid-cols-1 lg:grid-cols-[420px_1fr]" : "grid-cols-1"}`}>
        {/* Editor pane — hidden on mobile when in preview mode */}
        {sidebarOpen && (
        <div className={`border-r bg-muted/20 print:hidden overflow-y-auto max-h-[calc(100vh-113px)] lg:max-h-[calc(100vh-113px)] ${mobileView === "preview" ? "hidden lg:block" : "block"}`}>
          <Tabs defaultValue="content" className="w-full">
            <div className="px-4 pt-3 sticky top-0 bg-muted/20 backdrop-blur z-10 pb-2">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="content" className="text-xs gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Content
                </TabsTrigger>
                <TabsTrigger value="design" className="text-xs gap-1.5">
                  <Settings2 className="w-3.5 h-3.5" /> Design
                </TabsTrigger>
                <TabsTrigger value="templates" className="text-xs gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5" /> Templates
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="content" className="p-4 mt-0">
              <ResumeEditor />
              {/* Import Resume button in content tab */}
              <div className="mt-4 pt-4 border-t">
                <ImportResumeDialog />
              </div>
            </TabsContent>
            <TabsContent value="design" className="p-4 mt-0 space-y-4">
              <div className="rounded-xl border p-4 bg-card">
                <p className="text-xs font-semibold mb-3 flex items-center gap-1.5">
                  <Settings2 className="w-3.5 h-3.5" /> Customize
                </p>
                <CustomizePanel />
              </div>
              <div className="rounded-xl border p-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold">Completion</p>
                  <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{completion}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all" style={{ width: `${completion}%` }} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">Fill all key sections to reach 100% and maximize your chances.</p>
              </div>
              <div className="rounded-xl border p-4 bg-card">
                <p className="text-xs font-semibold mb-3">Export & Backup</p>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDocxExport}
                    disabled={!canExport}
                    className="w-full gap-1.5 justify-start disabled:opacity-50"
                  >
                    {canExport ? <FileText className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} Download as Word (.doc)
                  </Button>
                  <ImportExportJson />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="templates" className="p-4 mt-0">
              <div className="mb-3">
                <p className="text-xs font-semibold mb-1">Switch Template</p>
                <p className="text-[11px] text-muted-foreground">Your content stays the same — only the design changes. Live preview shows your data.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`text-left rounded-lg border-2 overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${
                      template === t.id ? "border-teal-500 ring-2 ring-teal-500/20" : "border-border"
                    }`}
                  >
                    <div className="bg-white overflow-hidden relative" style={{ height: "140px" }}>
                      <div className="origin-top-left absolute top-0 left-0 pointer-events-none" style={{ transform: "scale(0.18)", width: "556%", height: "556%" }}>
                        <ResumeRenderer data={data} accent={accent} font={font} fontSize={fontSize} template={t.id} />
                      </div>
                      {template === t.id && (
                        <div className="absolute top-1 right-1 bg-teal-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-1.5">
                      <p className="text-[10px] font-semibold truncate">{t.name}</p>
                      {t.premium && <span className="text-[8px] text-amber-600">PRO</span>}
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        )}

        {/* Floating reopen button when sidebar hidden */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background border shadow-lg flex items-center justify-center hover:bg-muted transition-colors print:hidden"
            title="Show editor"
          >
            <PanelLeftClose className="w-4 h-4 rotate-180" />
          </button>
        )}

        {/* Preview pane — hidden on mobile when in edit mode */}
        <div className={`relative bg-slate-200/60 dark:bg-slate-900/60 overflow-y-auto max-h-[calc(100vh-113px)] print:max-h-none print:overflow-visible print:bg-white ${mobileView === "edit" ? "hidden lg:block" : "block"}`}>
          {/* Zoom controls */}
          <div className="sticky top-2 right-2 z-10 flex justify-end print:hidden p-2">
            <ZoomControls zoom={previewZoom} setZoom={setPreviewZoom} />
          </div>
          <div className="p-2 sm:p-4 lg:p-8 flex justify-center print:p-0 print:scale-100 print:origin-top-left origin-top transition-transform" style={{ transform: `scale(${previewZoom})` }}>
            <A4MultiPageWrapper
              containerRef={resumeRef}
              onContextMenu={(e) => {
                e.preventDefault();
                toast.error("Content is protected — right-click is disabled on the resume preview");
              }}
              onCopy={(e) => {
                e.preventDefault();
                toast.error("Content is protected — copying is disabled");
              }}
            >
              <ResumeRenderer data={data} accent={accent} font={font} fontSize={fontSize} template={template} />
            </A4MultiPageWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResumeApp() {
  const view = useResumeStore((s) => s.view);
  return view === "dashboard" ? <Dashboard /> : <EditorView />;
}
