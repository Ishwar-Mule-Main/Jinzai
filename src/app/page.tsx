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
  Search,
  Target,
  Gauge,
  Mail,
  Building2,
  ShieldCheck,
  Star,
  ChevronDown,
  UserPlus,
  Crown,
  ArrowRight,
  Terminal,
  Layers,
  Cpu,
} from "lucide-react";
import { TEMPLATES } from "@/lib/resume/types";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { useResumeStore } from "@/lib/resume/store";
import { getSampleProfile } from "@/lib/resume/sample-profiles";

export default function HomePage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  // Template Search & Filter state
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showAllTemplates, setShowAllTemplates] = useState(false);

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

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.map((t, index) => ({ t, originalIndex: index })).filter(({ t }) => {
      const matchesSearch =
        search === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

      let matchesCategory = true;
      if (activeCategory === "ats") matchesCategory = t.tags.some((tag) => tag.toLowerCase().includes("ats"));
      if (activeCategory === "entry") matchesCategory = t.tags.some((tag) => tag.toLowerCase().includes("entry") || tag.toLowerCase().includes("college") || tag.toLowerCase().includes("academic"));
      if (activeCategory === "tech") matchesCategory = t.tags.some((tag) => tag.toLowerCase().includes("tech") || tag.toLowerCase().includes("developer"));
      if (activeCategory === "creative") matchesCategory = t.tags.some((tag) => tag.toLowerCase().includes("creative") || tag.toLowerCase().includes("bold"));
      if (activeCategory === "executive") matchesCategory = t.tags.some((tag) => tag.toLowerCase().includes("executive") || tag.toLowerCase().includes("serif"));

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
      {/* Navbar */}
      <PublicNav onLogin={() => setAuthMode("login")} onSignup={() => setAuthMode("signup")} />

      {/* ── Hero Section (ClickHouse 7/5 Grid & High Voltage Electric Yellow) ── */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action Signal (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffffff] px-3.5 py-1.5 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#faff69]"></span>
              <span className="text-[#cccccc]">Jinzai Engine</span>
              <span className="text-[#888888]">/</span>
              <span className="text-[#faff69] font-semibold">AI Resume Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              The High-Performance <span className="text-[#faff69]">AI Resume Builder</span>
            </h1>

            <p className="text-[#cccccc] text-base sm:text-lg max-w-xl leading-relaxed">
              Jinzai (人材) delivers ultra-fast AI rewriting, ATS compliance scoring, and 78 engineered templates. Build, optimize, and export recruiter-certified vector resumes in seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleStartBuilding}
                className="h-11 px-7 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-sm rounded-md transition-colors inline-flex items-center gap-2"
              >
                <FileText className="w-4 h-4" /> Start Building Free
              </button>

              <ImportResumeDialog
                trigger={
                  <button className="h-11 px-6 bg-[#1a1a1a] hover:bg-[#242424] text-white border border-[#2a2a2a] hover:border-[#3a3a3a] text-sm font-semibold rounded-md transition-colors inline-flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#faff69]" /> Upload &amp; Parse
                  </button>
                }
              />

              <button
                onClick={handleTrySample}
                className="h-11 px-5 text-[#888888] hover:text-white text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4 text-[#faff69]" /> Try Sample
              </button>
            </div>

            {user && (
              <div className="pt-1">
                <Link href="/dashboard">
                  <span className="inline-flex items-center gap-2 text-xs font-mono text-[#faff69] bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1.5 rounded-md hover:border-[#faff69]/40 transition-colors">
                    Logged in as {user.email} — Open Console →
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Code Window Card / Product UI Fragment (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 shadow-2xl font-mono text-xs text-[#cccccc] space-y-3">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3 text-[#888888]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/80"></span>
                  <span className="text-[11px] text-[#888888] ml-2">resume-optimizer.sql</span>
                </div>
                <span className="text-[10px] text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/30 px-2 py-0.5 rounded">ATS 100%</span>
              </div>

              {/* Code Content */}
              <div className="space-y-1 text-[13px] leading-relaxed pt-1">
                <p><span className="text-[#3b82f6]">SELECT</span> candidate_name, ats_score, target_role</p>
                <p><span className="text-[#3b82f6]">FROM</span> jinzai_resumes</p>
                <p><span className="text-[#3b82f6]">WHERE</span> template_id = <span className="text-[#faff69]">&apos;tech-lead-pro&apos;</span></p>
                <p>&nbsp;&nbsp;<span className="text-[#3b82f6]">AND</span> keyword_match_rate &gt;= <span className="text-[#22c55e]">0.98</span></p>
                <p><span className="text-[#3b82f6]">OPTIMIZE WITH</span> (ai_action_verbs = <span className="text-[#faff69]">true</span>);</p>
              </div>

              {/* Metrics Output Banner */}
              <div className="mt-4 p-3 bg-[#121212] border border-[#2a2a2a] rounded-lg space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#888888]">Parsed Keywords:</span>
                  <span className="text-white font-bold">24 / 24 Matched</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#888888]">Export Format:</span>
                  <span className="text-[#faff69] font-bold">Vector PDF (ISO A4)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#888888]">Engine Status:</span>
                  <span className="text-[#22c55e]">● Ready in 1.2s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat Callouts Row (ClickHouse Yellow Stat Display Numbers) ── */}
        <div className="max-w-7xl mx-auto pt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-4xl sm:text-5xl font-bold tracking-tight text-[#faff69]">78+</p>
            <p className="text-xs text-[#888888] uppercase tracking-wider font-semibold mt-1">Recruiter Templates</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-bold tracking-tight text-[#faff69]">100%</p>
            <p className="text-xs text-[#888888] uppercase tracking-wider font-semibold mt-1">ATS Text Extraction</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-bold tracking-tight text-[#faff69]">&lt; 3m</p>
            <p className="text-xs text-[#888888] uppercase tracking-wider font-semibold mt-1">Generation Time</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-bold tracking-tight text-[#faff69]">50k+</p>
            <p className="text-xs text-[#888888] uppercase tracking-wider font-semibold mt-1">Resumes Exported</p>
          </div>
        </div>
      </section>

      {/* ── Interactive Templates Gallery ── */}
      <section id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#faff69] px-3 py-1 rounded-full text-xs font-mono mb-3">
              78 PRODUCTION TEMPLATES
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Choose Your Engineered Layout</h2>
            <p className="text-sm text-[#cccccc] mt-1">Recruiter-tested typography, layout hierarchy, and instant vector export.</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates by role or style..."
              className="w-full pl-10 pr-4 h-10 bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#faff69] text-white text-xs rounded-md outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#2a2a2a] pb-4">
          {[
            { id: "all", label: "All 78 Templates" },
            { id: "ats", label: "100% ATS Optimized" },
            { id: "tech", label: "Tech & Engineering" },
            { id: "executive", label: "Executive & Senior" },
            { id: "entry", label: "Freshers & Academic" },
            { id: "creative", label: "Design & Creative" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-[#1a1a1a] text-white border border-[#faff69]"
                  : "bg-transparent text-[#888888] hover:text-white hover:bg-[#1a1a1a]/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Uniform Grid of Equal Shape Template Cards */}
        {(() => {
          const displayedTemplates =
            showAllTemplates || search !== "" || activeCategory !== "all"
              ? filteredTemplates
              : filteredTemplates.slice(0, 8);

          return (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
                {displayedTemplates.map(({ t, originalIndex }) => (
                  <TemplateCard key={t.id} id={t} index={originalIndex} user={user} onAuthRequired={() => setAuthMode("signup")} />
                ))}
              </div>

              {/* See More Templates Section */}
              {filteredTemplates.length > 8 && (
                <div className="pt-8 text-center space-y-4">
                  <p className="text-xs font-mono text-[#888888]">
                    Showing {displayedTemplates.length} of {filteredTemplates.length} templates
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                      href="/templates"
                      className="h-11 px-8 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-sm rounded-md transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#faff69]/10"
                    >
                      <span>Explore All 78 Templates</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setShowAllTemplates(!showAllTemplates)}
                      className="h-11 px-6 bg-[#1a1a1a] hover:bg-[#242424] text-white border border-[#2a2a2a] hover:border-[#3a3a3a] text-sm font-semibold rounded-md transition-colors inline-flex items-center gap-2"
                    >
                      {showAllTemplates ? "Show Less (8)" : `View More on Page (+${filteredTemplates.length - 8})`}
                    </button>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </section>

      {/* ── AI Features (ClickHouse Dark Feature Cards) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-12 border-t border-[#2a2a2a]">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Built for Maximum Recruiter Impact</h2>
          <p className="text-sm text-[#cccccc]">Precision intelligence modules to rewrite bullets, match target job requirements, and score structure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "LLM Bullet Optimizer", desc: "Quantifies your responsibilities into high-impact metric-backed achievements with strong action verbs.", icon: Sparkles },
            { title: "Resume Quality Rating", desc: "Real-time automated evaluation across quantification, brevity, formatting, and structural completeness.", icon: Gauge },
            { title: "Target ATS Matcher", desc: "Upload or paste any job description to discover missing hard keywords and compute similarity indices.", icon: Target },
            { title: "Role Cover Letters", desc: "Generates tailored cover letters aligned with your resume experience in modern or formal tone with 1 click.", icon: Mail },
          ].map((f) => (
            <div key={f.title} className="p-8 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors group space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69]">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight">{f.title}</h3>
              <p className="text-xs text-[#888888] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Transparent Pricing (ClickHouse Featured Yellow Tier) ── */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-12 border-t border-[#2a2a2a]">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Simple, Predictable Pricing</h2>
          <p className="text-sm text-[#cccccc]">Create and edit for free. Upgrade when you are ready to export your ATS-compliant vector PDF.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { name: "Single Export", price: "₹99", period: "/ export", features: ["1 Resume PDF Export", "Access all 78 templates", "Vector A4 PDF download", "❌ No AI rewriting"], highlight: false },
            { name: "Pro Plan", price: "₹399", period: "/ month", features: ["5 Resume PDF Exports", "LLM Bullet Rewriting", "ATS Keyword Matcher", "Cover Letter Generator", "All 78 templates"], highlight: true },
            { name: "Business Plan", price: "₹999", period: "/ month", features: ["50 Resume PDF Exports", "Full AI Suite Access", "Priority Vector Processing", "No Contact Lock", "All 78 templates"], highlight: false },
            { name: "Institution Plan", price: "₹4,999", period: "/ month", features: ["300 Student Portals", "Placement Cell Console", "Bulk Vector Exports", "Institution Domain Setup"], highlight: false },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 flex flex-col justify-between transition-all ${
                plan.highlight
                  ? "bg-[#faff69] text-[#0a0a0a] border border-[#faff69]"
                  : "bg-[#1a1a1a] text-white border border-[#2a2a2a]"
              }`}
            >
              <div>
                {plan.highlight && (
                  <span className="bg-[#0a0a0a] text-[#faff69] text-[10px] font-mono px-2.5 py-0.5 uppercase font-bold rounded-full inline-block mb-3">
                    RECOMMENDED
                  </span>
                )}
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

      {/* ── Testimonials ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-10 border-t border-[#2a2a2a]">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Approved by Engineers &amp; Leaders</h2>
          <p className="text-sm text-[#cccccc]">Job seekers across top tier technology companies trust Jinzai.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Rahul Verma", role: "Software Engineer at Google", quote: "I received 3 interview calls within a week of deploying my resume with Jinzai. The AI bullet optimizer was decisive.", avatar: "R" },
            { name: "Ananya Krishnan", role: "Product Lead at Swiggy", quote: "The ATS keyword comparison allowed me to tailor my CV for competitive leadership roles in minutes.", avatar: "A" },
            { name: "Vikram Singh", role: "Staff Data Scientist at Amazon", quote: "78 master templates allowed me to pick a crisp, high-density format that passed Taleo ATS instantly.", avatar: "V" },
          ].map((t) => (
            <div key={t.name} className="p-8 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[#242424] border border-[#2a2a2a] text-[#faff69] flex items-center justify-center font-bold text-sm shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-[#888888]">{t.role}</p>
                </div>
              </div>
              <p className="text-xs text-[#cccccc] leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ClickHouse Signature Full-Bleed Yellow CTA Band (cta-band-yellow) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="rounded-xl bg-[#faff69] text-[#0a0a0a] p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-left">
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
              className="h-12 px-8 bg-[#0a0a0a] hover:bg-[#242424] text-white font-semibold text-sm rounded-md transition-colors inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <PublicFooter />

      {/* ── Auth Dialog ── */}
      <AuthDialog mode={authMode} onClose={() => setAuthMode(null)} onSuccess={() => router.push("/dashboard")} />
    </div>
  );
}
