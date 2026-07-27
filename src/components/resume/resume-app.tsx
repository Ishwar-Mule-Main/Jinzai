"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES, ACCENT_PRESETS, FONT_OPTIONS, FONT_SIZE_OPTIONS } from "@/lib/resume/types";
import { ResumeRenderer } from "./resume-renderer";
import { TemplateThumbnail } from "./template-thumbnail";
import { ResumeEditor } from "./resume-editor";
import { getCompletion } from "@/lib/resume/sample-data";
import { getSampleProfile } from "@/lib/resume/sample-profiles";
import { downloadDocx } from "@/lib/resume/docx-export";
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
    <Card className="overflow-hidden group hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 hover:-translate-y-1.5 border-border/50 rounded-2xl">
      <div className="bg-white overflow-hidden relative border-b border-border/40" style={{ height: "320px" }}>
        {/* LIVE resume preview with sample data — scaled to fit card width */}
        <div className="origin-top-left absolute top-0 left-0 pointer-events-none" style={{ transform: "scale(0.40)", width: "250%", minHeight: "800px" }}>
          <ResumeRenderer data={sampleData} accent={id.accentDefault} font={id.fontDefault} template={id.id} />
        </div>
        {/* Hover actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-5 gap-2">
          <Button size="sm" onClick={useTemplate} className="h-8 gap-1.5 shadow-lg">
            <FileText className="w-3.5 h-3.5" /> Use Template
          </Button>
        </div>
        {/* Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
          {id.premium && (
            <Badge className="bg-amber-500 text-white border-0 gap-0.5 text-[8px] shadow-sm">
              <Crown className="w-2.5 h-2.5" /> PRO
            </Badge>
          )}
          {id.hasPhoto && (
            <Badge className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border-0 gap-1 text-[9px] shadow-sm">
              <ImageIcon className="w-2.5 h-2.5" /> Photo
            </Badge>
          )}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-base mb-1.5">{id.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{id.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {id.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
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
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-teal-600 to-emerald-600 bg-clip-text text-transparent">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
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
          <h2 className="text-2xl font-bold tracking-tight mb-1">Choose a template</h2>
          <p className="text-sm text-muted-foreground">{TEMPLATES.length} distinct designs — each auto-adapts to hide empty sections and rebalance to your content.</p>
        </div>
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
          <LayoutGrid className="w-3.5 h-3.5" /> {filtered.length} shown
        </Badge>
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-3 sticky top-14 z-10 bg-background/80 backdrop-blur py-2 -mx-1 px-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates by name or description…"
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filter === cat
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
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
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
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

  const planConfig = user ? getPlanConfig(user.plan) : getPlanConfig("free");
  const canCreate = user ? canCreateResume(user.plan, user.resumeCount) : true; // not logged in = can try

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
    // If logged in, the ImportResumeDialog will open normally
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 gap-1.5 py-1 px-3 rounded-full">
            <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" /> AI-powered resume builder
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-[1.05]">
            Build a resume that
            <br />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 bg-clip-text text-transparent">
              gets you hired
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Pick from {TEMPLATES.length} professionally designed templates, fill in your details, and watch your resume adapt
            in real time. AI summaries, ATS keyword matching, cover letters, and one-click PDF export.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-12">
          <StatCard value={String(TEMPLATES.length)} label="Templates" />
          <StatCard value="9" label="Sections" />
          <StatCard value="100%" label="Free" />
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <Button onClick={handleTrySample} size="lg" className="gap-2 h-12 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg shadow-teal-600/20">
            <Wand2 className="w-4 h-4" /> Try with sample data
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 h-12 px-6"
            onClick={handleStartBuilding}
          >
            <FileText className="w-4 h-4" /> {user ? "Start from scratch" : "Get Started"}
          </Button>
          <RoleExamplesDialog trigger={
            <Button variant="outline" size="lg" className="gap-2 h-12 px-6">
              <Sparkles className="w-4 h-4" /> Browse examples
            </Button>
          } />
          {!user && (
            <p className="w-full text-center text-xs text-muted-foreground">
              Sign up free to create and save your resume. Upgrade to export.
            </p>
          )}
          {user && user.plan === "free" && (
            <p className="w-full text-center text-xs text-muted-foreground">
              You're on the Free plan. <PricingDialog currentPlan={user.plan} onSubscribed={refresh} trigger={<button className="text-teal-600 underline">Upgrade</button>} /> to export your resume.
            </p>
          )}
          {user && isPaidPlan(user.plan) && (
            <p className="w-full text-center text-xs text-muted-foreground">
              {remainingResumes(user.plan, user.resumeCount) === Infinity
                ? "Unlimited resumes available."
                : `${remainingResumes(user.plan, user.resumeCount)} resume${remainingResumes(user.plan, user.resumeCount) === 1 ? "" : "s"} remaining on your ${planConfig.name} plan.`}
            </p>
          )}
        </div>

        {/* Template gallery */}
        <TemplateGallery user={user} onAuthRequired={() => setAuthMode("signup")} />

        {/* Features strip */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Everything you need to land the interview</h2>
            <p className="text-sm text-muted-foreground">AI writing assistance, ATS optimization, and beautiful templates — all in one place.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "AI summaries & bullets", desc: "Generate a professional summary and achievement bullets tuned to your role in one click.", icon: Sparkles, color: "teal" },
              { title: "Resume quality score", desc: "Get an instant A–F grade across 8 dimensions — quantification, action verbs, completeness, and more.", icon: Gauge, color: "emerald" },
              { title: "ATS keyword match", desc: "Paste a job description to see your match score and the exact keywords you're missing.", icon: Target, color: "amber" },
              { title: "AI cover letters", desc: "Tailor a cover letter to any role using your resume content — confident, formal, or concise.", icon: Mail, color: "violet" },
            ].map((f) => (
              <Card key={f.title} className="p-5 rounded-2xl border-border/50 hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                  f.color === "teal" ? "bg-teal-50 dark:bg-teal-950/40" :
                  f.color === "emerald" ? "bg-emerald-50 dark:bg-emerald-950/40" :
                  f.color === "amber" ? "bg-amber-50 dark:bg-amber-950/40" :
                  f.color === "violet" ? "bg-violet-50 dark:bg-violet-950/40" :
                  "bg-sky-50 dark:bg-sky-950/40"
                }`}>
                  <f.icon className={`w-5 h-5 ${
                    f.color === "teal" ? "text-teal-600 dark:text-teal-400" :
                    f.color === "emerald" ? "text-emerald-600 dark:text-emerald-400" :
                    f.color === "amber" ? "text-amber-600 dark:text-amber-400" :
                    f.color === "violet" ? "text-violet-600 dark:text-violet-400" :
                    "text-sky-600 dark:text-sky-400"
                  }`} />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing preview */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Simple, transparent pricing</h2>
            <p className="text-sm text-muted-foreground">Start free. Upgrade when you're ready to export.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { name: "Trial", price: "₹99", period: "2 days", features: ["1 resume", "Export to PDF & DOCX", "All 52 templates"], highlight: false },
              { name: "Pro", price: "₹499", period: "/month", features: ["Up to 5 resumes", "Export to PDF & DOCX", "All AI features", "Public share links"], highlight: true },
              { name: "Business", price: "₹1,999", period: "/month", features: ["Unlimited resumes", "Full features", "No contact lock", "Multi-page support"], highlight: false },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl border-2 p-5 ${plan.highlight ? "border-teal-500 ring-2 ring-teal-500/20" : "border-border"}`}>
                <p className="font-bold text-sm mb-1">{plan.name}</p>
                <p className="text-2xl font-bold mb-1">{plan.price}<span className="text-sm font-normal text-muted-foreground">{plan.period}</span></p>
                <ul className="space-y-1 mt-3">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-teal-600" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            {user ? (
              <PricingDialog currentPlan={user.plan} onSubscribed={refresh} trigger={
                <Button className="gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                  <Crown className="w-4 h-4" /> View full pricing
                </Button>
              } />
            ) : (
              <Button onClick={() => setAuthMode("signup")} className="gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                <UserPlus className="w-4 h-4" /> Sign up to get started
              </Button>
            )}
          </div>
        </div>

        {/* Trust banner */}
        <div className="mt-16 rounded-2xl border bg-gradient-to-br from-muted/40 to-background p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold">ATS-friendly</p>
                <p className="text-xs text-muted-foreground">Clean structure recruiters' tools can parse.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Zap className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Real-time preview</p>
                <p className="text-xs text-muted-foreground">See edits reflected instantly, no refresh.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Download className="w-5 h-5 text-violet-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold">PDF & DOCX export</p>
                <p className="text-xs text-muted-foreground">Export in your chosen design with content.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials / Social Proof */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-3 gap-1.5 py-1 px-3 rounded-full">
              <Star className="w-3 h-3 text-amber-500" /> Loved by job seekers
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Trusted by thousands of professionals</h2>
            <p className="text-sm text-muted-foreground">Real stories from people who landed their dream jobs with ResumeForge.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Rahul Verma", role: "Software Engineer at Google", quote: "I got 3 interview calls within a week of using ResumeForge. The AI summary feature was a game-changer — it highlighted my achievements perfectly.", avatar: "R", color: "teal" },
              { name: "Ananya Krishnan", role: "Product Manager at Swiggy", quote: "The ATS keyword match tool helped me optimize my resume for exactly what recruiters were looking for. Landed my dream PM role!", avatar: "A", color: "violet" },
              { name: "Vikram Singh", role: "Data Scientist at Amazon", quote: "52 templates meant I could find the perfect design. The resume score feature told me exactly what to improve. Worth every rupee.", avatar: "V", color: "amber" },
            ].map((t) => (
              <Card key={t.name} className="p-5 rounded-2xl border-border/50 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                    t.color === "teal" ? "bg-teal-500" : t.color === "violet" ? "bg-violet-500" : "bg-amber-500"
                  }`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[0,1,2,3,4].map((i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-white text-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-xs text-white/80">Resumes created</p>
            </div>
            <div>
              <p className="text-3xl font-bold">52</p>
              <p className="text-xs text-white/80">Professional templates</p>
            </div>
            <div>
              <p className="text-3xl font-bold">7</p>
              <p className="text-xs text-white/80">AI-powered features</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4.9★</p>
              <p className="text-xs text-white/80">Average rating</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground">Everything you need to know about ResumeForge.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              { q: "Is ResumeForge really free?", a: "Yes! You can browse all 52 templates and create 1 resume for free. To export your resume as PDF or DOCX, upgrade to a paid plan starting at just ₹99 for a 2-day trial." },
              { q: "How does the AI resume writing work?", a: "Our AI (powered by OpenRouter with Claude/Llama models) analyzes your role and experience to generate professional summaries, achievement bullets, skill suggestions, and cover letters. You can also import your old resume and AI will parse it automatically." },
              { q: "What's the difference between plans?", a: "Free lets you create 1 resume (no export). Trial (₹99/2 days) gives 1 resume with export. Pro (₹499/month) gives 5 resumes with export. Business (₹1,999/month) gives unlimited resumes with no contact lock — ideal for agencies." },
              { q: "Are the resumes ATS-friendly?", a: "Yes! All templates use clean, parseable HTML structures. Our ATS keyword match tool (Pro plan+) analyzes your resume against any job description and shows you exactly which keywords you're missing." },
              { q: "Can I import my existing resume?", a: "Yes! Click \"Import Resume\" in the dashboard, paste your old resume text, and our AI will automatically parse it into our structured format — filling in all sections for you." },
              { q: "Is my data secure?", a: "Absolutely. Passwords are bcrypt-hashed, all data is transmitted over HTTPS, and resume content is protected with right-click and copy disabled. Your data is never shared with third parties. See our Privacy Policy for full details." },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border p-4 hover:bg-muted/30 transition-colors">
                <summary className="cursor-pointer text-sm font-semibold flex items-center justify-between gap-2 list-none">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2 pl-1">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Ready to build your resume?</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">Join thousands of professionals who landed their dream jobs with ResumeForge. Start free — no credit card required.</p>
          <Button size="lg" onClick={() => setAuthMode("signup")} className="gap-2 h-12 px-8 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg shadow-teal-600/20">
            <UserPlus className="w-4 h-4" /> Get Started Free
          </Button>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Auth dialog */}
      <AuthDialog mode={authMode} onClose={() => setAuthMode(null)} onSuccess={async () => { await refresh(); clearAll(); setTemplate("modern"); setView("editor"); }} />
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
  const saveRef = useRef<(() => void) | null>(null);
  const { user, refresh } = useCurrentUser();
  const planConfig = user ? getPlanConfig(user.plan) : getPlanConfig("free");
  const canExport = user ? planConfig.canExport : false;

  const print = () => {
    if (!canExport) {
      toast.error("Export is available on paid plans. Upgrade to export your resume.");
      return;
    }
    window.print();
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
            <Button size="sm" onClick={print} disabled={!canExport} className="gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50">
              {canExport ? <Download className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} Export PDF
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
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="content" className="text-xs gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Content
                </TabsTrigger>
                <TabsTrigger value="design" className="text-xs gap-1.5">
                  <Settings2 className="w-3.5 h-3.5" /> Design
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="content" className="p-4 mt-0">
              <ResumeEditor />
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
          <div className="p-2 sm:p-4 lg:p-8 flex justify-center print:p-0 origin-top transition-transform" style={{ transform: `scale(${previewZoom})` }}>
            <div
              className="bg-white shadow-2xl shadow-slate-400/30 print:shadow-none print:w-auto page-break-indicator resume-protected"
              onContextMenu={(e) => {
                e.preventDefault();
                toast.error("Content is protected — right-click is disabled on the resume preview");
              }}
              onCopy={(e) => {
                e.preventDefault();
                toast.error("Content is protected — copying is disabled");
              }}
              onDragStart={(e) => e.preventDefault()}
              style={{
                width: "210mm",
                minHeight: "297mm",
              }}
            >
              <ResumeRenderer data={data} accent={accent} font={font} fontSize={fontSize} template={template} />
            </div>
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
