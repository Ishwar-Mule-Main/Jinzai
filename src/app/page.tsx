"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { TemplateCard } from "@/components/resume/template-card";
import { AuthDialog, type AuthMode } from "@/components/resume/auth-dialogs";
import { ImportResumeDialog } from "@/components/resume/import-resume-dialog";
import {
  Sparkles,
  FileText,
  Upload,
  Wand2,
  Check,
  Target,
  Gauge,
  Mail,
  Building2,
  ShieldCheck,
  Star,
  ChevronRight,
  UserPlus,
  Crown,
  ArrowRight,
  CheckCircle2,
  Zap,
  Lock,
  Layers,
  GraduationCap,
  DownloadCloud,
  FileCheck2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TEMPLATES } from "@/lib/resume/types";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { useResumeStore } from "@/lib/resume/store";

// Hand-picked 8 premier templates showcasing distinct layout archetypes
const FEATURED_TEMPLATE_IDS = [
  "modern",
  "midnight-exec",
  "tech",
  "aurora-pro",
  "executive",
  "campus-navy",
  "minimal",
  "corporate-elite",
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  const loadSample = useResumeStore((s) => s.loadSample);
  const clearAll = useResumeStore((s) => s.clearAll);

  // Handle building new resume
  const handleStartBuilding = () => {
    if (!user) {
      setAuthMode("signup");
    } else {
      clearAll();
      router.push("/editor");
    }
  };

  // Handle sample load
  const handleTrySample = () => {
    loadSample();
    router.push("/editor");
  };

  // Extract exactly the 8 featured templates
  const featuredTemplates = useMemo(() => {
    const map = new Map(TEMPLATES.map((t, idx) => [t.id, { t, originalIndex: idx }]));
    return FEATURED_TEMPLATE_IDS.map((id) => map.get(id) || { t: TEMPLATES[0], originalIndex: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
      {/* Top Navbar */}
      <PublicNav onLogin={() => setAuthMode("login")} onSignup={() => setAuthMode("signup")} />

      {/* ── 1. Hero Section (ClickHouse Dark Canvas & High-Voltage Electric Yellow) ── */}
      <section className="relative pt-12 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#2a2a2a] overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#faff69]/5 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Engine Status Pill */}
            <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffffff] px-3.5 py-1.5 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#faff69] animate-pulse"></span>
              <span className="text-[#cccccc]">Jinzai Engine 2.0</span>
              <span className="text-[#888888]">/</span>
              <span className="text-[#faff69] font-semibold">AI Resume &amp; Talent Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              Build an <span className="text-[#faff69] underline decoration-[#faff69]/40 underline-offset-8">ATS-Crushing</span> Resume in Seconds
            </h1>

            {/* Subtitle */}
            <p className="text-[#cccccc] text-base sm:text-lg max-w-xl leading-relaxed">
              Jinzai (人材) pairs <strong>78 recruiter-certified templates</strong> with multimodal AI bullet rewriting, instant ATS job matching, and pixel-perfect vector PDF export.
            </p>

            {/* Action Buttons Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleStartBuilding}
                className="h-12 px-8 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-bold text-sm rounded-md transition-all inline-flex items-center gap-2 shadow-lg shadow-[#faff69]/10 hover:shadow-[#faff69]/20 transform hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4" /> Start Building Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <ImportResumeDialog
                trigger={
                  <button className="h-12 px-6 bg-[#1a1a1a] hover:bg-[#242424] text-white border border-[#2a2a2a] hover:border-[#3a3a3a] text-sm font-semibold rounded-md transition-colors inline-flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#faff69]" /> Upload &amp; Parse CV
                  </button>
                }
              />

              <button
                onClick={handleTrySample}
                className="h-12 px-5 text-[#888888] hover:text-white text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4 text-[#faff69]" /> Try Sample Data
              </button>
            </div>

            {/* Logged in indicator */}
            {user && (
              <div className="pt-1">
                <Link href="/dashboard">
                  <span className="inline-flex items-center gap-2 text-xs font-mono text-[#faff69] bg-[#1a1a1a] border border-[#2a2a2a] px-3.5 py-1.5 rounded-md hover:border-[#faff69]/40 transition-colors">
                    Logged in as {user.email} — Open Console →
                  </span>
                </Link>
              </div>
            )}

            {/* Micro Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#888888] font-mono border-t border-[#2a2a2a]/60">
              <span className="flex items-center gap-1.5 text-[#cccccc]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> 100% ATS Readable
              </span>
              <span className="flex items-center gap-1.5 text-[#cccccc]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#faff69]" /> Zero Print Popups
              </span>
              <span className="flex items-center gap-1.5 text-[#cccccc]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3b82f6]" /> STAR Metric AI
              </span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Interactive Preview Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 shadow-2xl space-y-4 relative group hover:border-[#3a3a3a] transition-all">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3 text-[#888888]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/80"></span>
                  <span className="text-[11px] text-[#888888] ml-2 font-mono">jinzai-copilot.engine</span>
                </div>
                <span className="text-[10px] text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/30 px-2 py-0.5 rounded font-mono font-bold">
                  ● ATS MATCH 98%
                </span>
              </div>

              {/* Target Role & Candidate Header */}
              <div className="p-3.5 bg-[#121212] border border-[#2a2a2a] rounded-lg space-y-1">
                <p className="text-[10px] text-[#888888] font-mono uppercase tracking-wider">Candidate Role</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">Staff Software Engineer</p>
                  <span className="text-xs text-[#faff69] font-mono font-semibold">Tier-1 Layout</span>
                </div>
              </div>

              {/* AI Bullet Transformation Showcase */}
              <div className="space-y-2 text-left">
                <p className="text-[10px] text-[#888888] font-mono uppercase tracking-wider">AI Bullet Rewriter (STAR Formula)</p>
                
                {/* Before */}
                <div className="p-2.5 bg-[#121212] border border-[#ef4444]/20 rounded-md text-[11px] text-[#888888] line-through">
                  &ldquo;Worked on the payments backend and handled database queries.&rdquo;
                </div>

                {/* After (Electric Yellow Highlight) */}
                <div className="p-3 bg-[#121212] border border-[#faff69]/40 rounded-md text-xs text-white space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#faff69] font-mono font-bold">
                    <Sparkles className="w-3 h-3" /> JINZAI AI OPTIMIZED
                  </div>
                  <p className="leading-relaxed">
                    &ldquo;Architected high-concurrency payment gateway handling <strong>₹24M+ ARR</strong> with <strong>99.99% uptime</strong>, slashing P99 database query latency by <strong>42%</strong>.&rdquo;
                  </p>
                </div>
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 bg-[#121212] border border-[#2a2a2a] rounded-md">
                  <span className="text-[#888888] block text-[9px]">Matched Skills:</span>
                  <span className="text-white font-bold">24 / 24 Keywords</span>
                </div>
                <div className="p-2.5 bg-[#121212] border border-[#2a2a2a] rounded-md">
                  <span className="text-[#888888] block text-[9px]">Export Quality:</span>
                  <span className="text-[#faff69] font-bold">Vector PDF (ISO A4)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Metric Display Stats (ClickHouse Signature Yellow Numbers) ── */}
        <div className="max-w-7xl mx-auto pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-left border-t border-[#2a2a2a]/60 mt-12">
          <div>
            <p className="text-4xl sm:text-5xl font-bold tracking-tight text-[#faff69]">78+</p>
            <p className="text-xs text-[#888888] uppercase tracking-wider font-semibold mt-1 font-mono">Recruiter Templates</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-bold tracking-tight text-[#faff69]">100%</p>
            <p className="text-xs text-[#888888] uppercase tracking-wider font-semibold mt-1 font-mono">ATS Text Compliance</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-bold tracking-tight text-[#faff69]">&lt; 60s</p>
            <p className="text-xs text-[#888888] uppercase tracking-wider font-semibold mt-1 font-mono">AI Generation Time</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-bold tracking-tight text-[#faff69]">50k+</p>
            <p className="text-xs text-[#888888] uppercase tracking-wider font-semibold mt-1 font-mono">Resumes Exported</p>
          </div>
        </div>
      </section>

      {/* ── 2. Featured Templates Spotlight (STRICTLY 8 TEMPLATES) ── */}
      <section id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#faff69] px-3.5 py-1 rounded-full text-xs font-mono">
              CURATED COLLECTION
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Featured Templates (8 of 78)
            </h2>
            <p className="text-sm text-[#cccccc]">
              Hand-picked, recruiter-certified layouts engineered for maximum readability and instant ATS pass rate.
            </p>
          </div>

          <Link
            href="/templates"
            className="h-11 px-6 bg-[#1a1a1a] hover:bg-[#242424] text-white border border-[#2a2a2a] hover:border-[#faff69]/40 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <span>Explore All 78 Templates</span>
            <ArrowRight className="w-4 h-4 text-[#faff69]" />
          </Link>
        </div>

        {/* The 8 Curated Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {featuredTemplates.map(({ t, originalIndex }) => (
            <TemplateCard
              key={t.id}
              id={t}
              index={originalIndex}
              user={user}
              onAuthRequired={() => setAuthMode("signup")}
            />
          ))}
        </div>

        {/* ── High-Impact "Explore All 78 Templates" Banner ── */}
        <div className="mt-8 p-8 sm:p-10 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#faff69]/50 rounded-xl transition-all text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#faff69]">
              <Layers className="w-4 h-4" /> 70 MORE SPECIALIZED DESIGNS AVAILABLE
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Need a sidebar, academic, or creative layout?
            </h3>
            <p className="text-xs sm:text-sm text-[#cccccc]">
              Browse our complete library of 78 templates categorized by Tech, Executive, Campus Placement, Minimalist, and Timeline formats.
            </p>
          </div>

          <Link
            href="/templates"
            className="h-12 px-8 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-bold text-sm rounded-md transition-all inline-flex items-center gap-2 shrink-0 shadow-md shadow-[#faff69]/10"
          >
            <span>View All 78 Templates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── 3. Core Features / Why Candidates Choose Jinzai ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-12 border-t border-[#2a2a2a]">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#faff69] px-3.5 py-1 rounded-full text-xs font-mono">
            ENGINEERED ADVANTAGES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Built for Maximum Recruiter Impact
          </h2>
          <p className="text-sm text-[#cccccc]">
            Every module in Jinzai is designed to help you stand out from automated ATS filters and hiring managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            {
              title: "AI STAR Bullet Rewriter",
              desc: "Transforms simple job responsibilities into metric-backed achievements using Google & Amazon STAR frameworks.",
              icon: Sparkles,
            },
            {
              title: "Real-Time ATS Radar",
              desc: "Paste any job description to discover missing hard keywords, skills, and compute your exact match percentage.",
              icon: Target,
            },
            {
              title: "Direct Vector PDF Export",
              desc: "Downloads pristine high-DPI A4 PDFs with multi-page overflow protection and zero printer popup hassles.",
              icon: DownloadCloud,
            },
            {
              title: "Tailored Cover Letters",
              desc: "Generates custom cover letters matched to your active resume in 3 tones (Confident, Formal, Concise) in 1 click.",
              icon: Mail,
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-8 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all group space-y-4"
            >
              <div className="w-12 h-12 rounded-lg bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69] group-hover:scale-105 transition-transform">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight">{f.title}</h3>
              <p className="text-xs text-[#888888] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Simple 3-Step Workflow ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-12 border-t border-[#2a2a2a]">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">How Jinzai Works</h2>
          <p className="text-sm text-[#cccccc]">From blank canvas to recruiter-ready resume in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              step: "01",
              title: "Choose Layout or Upload CV",
              desc: "Select from 78 engineered templates or upload your existing PDF/DOCX to auto-extract all experience.",
            },
            {
              step: "02",
              title: "AI Optimization & ATS Match",
              desc: "Let Jinzai AI polish your achievement bullets, score your content, and verify keywords against target jobs.",
            },
            {
              step: "03",
              title: "Direct Vector PDF Download",
              desc: "Download clean, razor-sharp vector PDFs ready for job applications, email submissions, and LinkedIn.",
            },
          ].map((s) => (
            <div key={s.step} className="p-8 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
              <span className="text-3xl font-bold text-[#faff69] font-mono">{s.step}</span>
              <h3 className="text-lg font-bold text-white">{s.title}</h3>
              <p className="text-xs text-[#cccccc] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Campus & Institution Callout ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="p-8 sm:p-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#242424] text-[#faff69] border border-[#2a2a2a] px-3 py-1 rounded-full text-xs font-mono">
              <GraduationCap className="w-3.5 h-3.5" /> INSTITUTION &amp; PLACEMENT PORTAL
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Are you a College, University, or Placement Cell?
            </h3>
            <p className="text-xs sm:text-sm text-[#cccccc] max-w-xl">
              Equip up to 300 students with dedicated accounts, placement officer tracking, and campus-branded resumes.
            </p>
          </div>

          <Link
            href="/institutions"
            className="h-11 px-7 bg-[#242424] hover:bg-[#333333] text-white border border-[#2a2a2a] font-semibold text-xs rounded-md transition-colors inline-flex items-center gap-2 shrink-0"
          >
            <Building2 className="w-4 h-4 text-[#faff69]" /> Learn About Campus Plans
          </Link>
        </div>
      </section>

      {/* ── 6. Transparent Pricing (ClickHouse Featured Yellow Tier) ── */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-12 border-t border-[#2a2a2a]">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#faff69] px-3.5 py-1 rounded-full text-xs font-mono">
            SIMPLE PRICING
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Transparent Plans for Every Career Stage
          </h2>
          <p className="text-sm text-[#cccccc]">Create and edit for free. Upgrade when you are ready to export your ATS-compliant vector PDF.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-left">
          {[
            {
              name: "Single Export",
              price: "₹99",
              period: "/ export",
              badge: "PAY-PER-DOWNLOAD",
              features: ["1 Resume PDF Export", "Access all 78 templates", "Vector A4 PDF download", "❌ No AI writing tools"],
              highlight: false,
            },
            {
              name: "Pro Plan",
              price: "₹399",
              period: "/ month",
              badge: "MOST POPULAR",
              features: ["5 Resume PDF Exports", "LLM Bullet Rewriting", "ATS Keyword Matcher", "Cover Letter Generator", "All 78 templates"],
              highlight: true,
            },
            {
              name: "Business Plan",
              price: "₹999",
              period: "/ month",
              badge: "POWER USERS",
              features: ["50 Resume PDF Exports", "Full AI Suite Access", "Priority Vector Processing", "No Contact Lock", "All 78 templates"],
              highlight: false,
            },
            {
              name: "Institution Plan",
              price: "₹4,999",
              period: "/ month",
              badge: "COLLEGES",
              features: ["300 Student Portals", "Placement Cell Console", "Bulk Vector Exports", "Institution Domain Setup"],
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 flex flex-col justify-between transition-all ${
                plan.highlight
                  ? "bg-[#faff69] text-[#0a0a0a] border border-[#faff69] shadow-xl"
                  : "bg-[#1a1a1a] text-white border border-[#2a2a2a]"
              }`}
            >
              <div>
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 uppercase font-bold rounded-full inline-block mb-3 ${
                    plan.highlight ? "bg-[#0a0a0a] text-[#faff69]" : "bg-[#242424] text-[#888888]"
                  }`}
                >
                  {plan.badge}
                </span>

                <p className={`text-xl font-bold ${plan.highlight ? "text-[#0a0a0a]" : "text-white"}`}>{plan.name}</p>
                <p className={`text-4xl font-bold mt-2 ${plan.highlight ? "text-[#0a0a0a]" : "text-white"}`}>
                  {plan.price}
                  <span className={`text-xs font-normal ml-1.5 ${plan.highlight ? "text-[#3a3a3a]" : "text-[#888888]"}`}>
                    {plan.period}
                  </span>
                </p>

                <ul className={`space-y-3 mt-6 text-xs ${plan.highlight ? "text-[#1a1a1a]" : "text-[#cccccc]"}`}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-[#0a0a0a]" : "text-[#faff69]"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={handleStartBuilding}
                  className={`w-full h-11 rounded-md font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? "bg-[#0a0a0a] hover:bg-[#242424] text-white"
                      : "bg-[#242424] hover:bg-[#3a3a3a] text-white border border-[#2a2a2a]"
                  }`}
                >
                  Start Building
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Frequently Asked Questions (Accordion) ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-8 border-t border-[#2a2a2a] text-left">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-[#888888]">Everything you need to know about Jinzai&apos;s templates and exports.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem value="item-1" className="border border-[#2a2a2a] rounded-xl px-4 bg-[#1a1a1a]">
            <AccordionTrigger className="text-xs sm:text-sm font-semibold text-white hover:no-underline">
              Are Jinzai resumes 100% ATS compliant?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-[#888888] leading-relaxed">
              Yes. All 78 templates are engineered with standard font encodings, clean semantic hierarchy, and pure text layers so automated Applicant Tracking Systems (Taleo, Workday, Lever, Greenhouse) can extract your experience flawlessly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border border-[#2a2a2a] rounded-xl px-4 bg-[#1a1a1a]">
            <AccordionTrigger className="text-xs sm:text-sm font-semibold text-white hover:no-underline">
              How does the Vector PDF download work?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-[#888888] leading-relaxed">
              Unlike regular websites that force open a browser print dialog with clipped headers and margins, Jinzai generates high-DPI Vector PDFs directly with built-in multi-page break protection.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border border-[#2a2a2a] rounded-xl px-4 bg-[#1a1a1a]">
            <AccordionTrigger className="text-xs sm:text-sm font-semibold text-white hover:no-underline">
              Can I customize fonts, colors, and photos?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-[#888888] leading-relaxed">
              Yes. In the Jinzai Editor, you can switch between 18 professional typography pairings, customize accent colors, and toggle candidate portraits with live real-time preview.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border border-[#2a2a2a] rounded-xl px-4 bg-[#1a1a1a]">
            <AccordionTrigger className="text-xs sm:text-sm font-semibold text-white hover:no-underline">
              Can I import an existing PDF or Word document?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-[#888888] leading-relaxed">
              Yes! Click &ldquo;Upload &amp; Parse CV&rdquo; in the hero section to upload your existing resume in PDF, DOCX, MD, or TXT format. Jinzai AI will parse and populate the editor automatically.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ── 8. ClickHouse Full-Bleed Yellow CTA Band ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="rounded-xl bg-[#faff69] text-[#0a0a0a] p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-2xl">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0a0a0a]">
              Build Your High-Impact Resume Today
            </h2>
            <p className="text-sm sm:text-base text-[#1a1a1a] max-w-xl">
              Access 78 templates, AI bullet optimization, and ATS verification. Get hired faster.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={handleStartBuilding}
              className="h-12 px-8 bg-[#0a0a0a] hover:bg-[#242424] text-white font-bold text-sm rounded-md transition-colors inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Start Building Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />

      {/* Auth Dialog */}
      <AuthDialog mode={authMode} onClose={() => setAuthMode(null)} onSuccess={() => router.push("/dashboard")} />
    </div>
  );
}
