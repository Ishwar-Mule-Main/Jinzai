"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES } from "@/lib/resume/types";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { AuthDialog, type AuthMode } from "@/components/resume/auth-dialogs";
import { ImportResumeDialog } from "@/components/resume/import-resume-dialog";
import { PricingDialog } from "@/components/resume/pricing-dialog";
import { SupportDialog } from "@/components/resume/support-dialog";
import { TemplateThumbnail } from "@/components/resume/template-thumbnail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  FileText,
  Upload,
  Wand2,
  Crown,
  Search,
  LayoutGrid,
  Check,
  ShieldCheck,
  Zap,
  Star,
  ChevronDown,
  ArrowRight,
  Target,
  Gauge,
  Mail,
  UserPlus,
  LogIn,
  Layers,
  Award,
  CheckCircle2,
} from "lucide-react";
import { getSampleProfile } from "@/lib/resume/sample-profiles";
import { ResumeRenderer } from "@/components/resume/resume-renderer";

const TEMPLATE_CATEGORIES = ["All", "Sidebar", "Banner", "Single", "Serif", "Minimal", "ATS", "Photo", "Numbered", "Creative"] as const;

function TemplateCard({ id, index, user, onAuthRequired }: { id: (typeof TEMPLATES)[number]; index: number; user: any; onAuthRequired: () => void }) {
  const router = useRouter();
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setView = useResumeStore((s) => s.setView);
  const sampleData = getSampleProfile(index);

  const handleUseTemplate = () => {
    setTemplate(id.id);
    setView("editor");
    router.push("/editor");
  };

  return (
    <Card className="overflow-hidden group hover:shadow-2xl hover:shadow-[#FF6200]/15 transition-all duration-300 hover:-translate-y-1.5 border-[#2E2E2E] hover:border-[#FF6200]/50 bg-[#141414] rounded-2xl flex flex-col justify-between">
      <div className="bg-white overflow-hidden relative border-b border-[#2E2E2E]" style={{ height: "300px" }}>
        {/* LIVE resume preview scaled to fit card */}
        <div className="origin-top-left absolute top-0 left-0 pointer-events-none" style={{ transform: "scale(0.38)", width: "260%", minHeight: "800px" }}>
          <ResumeRenderer data={sampleData} accent={id.accentDefault} font={id.fontDefault} template={id.id} />
        </div>
        {/* Hover overlay with button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-5 px-4 gap-2">
          <Button size="sm" onClick={handleUseTemplate} className="w-full h-10 gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-full shadow-lg shadow-[#FF6200]/30 text-xs">
            <FileText className="w-4 h-4" /> Use {id.name}
          </Button>
        </div>
        {/* Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end z-10">
          {id.premium && (
            <Badge className="bg-[#FF6200] text-white border-0 gap-1 text-[8px] font-mono shadow-md px-2 py-0.5">
              <Crown className="w-2.5 h-2.5" /> PRO
            </Badge>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bricolage font-bold text-base text-white mb-1">{id.name}</h3>
        <p className="text-xs text-[#888898] line-clamp-2 mb-3 leading-relaxed">{id.description}</p>
        <div className="flex flex-wrap gap-1">
          {id.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] text-[#888898] font-mono">
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
    <div className="text-center p-5 rounded-2xl bg-[#141414] border border-[#2E2E2E]">
      <p className="text-3xl sm:text-4xl font-bold font-bricolage text-gradient-orange">{value}</p>
      <p className="text-xs font-mono text-[#888898] mt-1">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");

  const loadSample = useResumeStore((s) => s.loadSample);
  const clearAll = useResumeStore((s) => s.clearAll);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setView = useResumeStore((s) => s.setView);
  const setContactLocked = useResumeStore((s) => s.setContactLocked);

  const handleStartBuilding = () => {
    clearAll();
    setContactLocked(false);
    setTemplate("modern");
    setView("editor");
    router.push("/editor");
  };

  const handleTrySample = () => {
    loadSample();
    setContactLocked(false);
    setView("editor");
    router.push("/editor");
  };

  const filteredTemplates = TEMPLATES.map((t, originalIndex) => ({ t, originalIndex })).filter(({ t }) => {
    const matchesFilter = filter === "All" || t.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())) || t.name.toLowerCase().includes(filter.toLowerCase());
    const matchesQuery = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-[#FF6200] selection:text-white">

      {/* ── Public Top Nav ── */}
      <PublicNav onLogin={() => setAuthMode("login")} onSignup={() => setAuthMode("signup")} />

      {/* ── Hero Banner ── */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6200]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <Badge className="bg-[#1A1A1A] border-[#2E2E2E] text-[#FF6200] px-4 py-1.5 rounded-full font-mono text-xs gap-2 inline-flex shadow-lg shadow-[#FF6200]/10">
            <Sparkles className="w-4 h-4" /> Domain Expansion AI Resume Builder v3.0
          </Badge>

          <h1 className="font-bricolage text-4xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            Transform Your Career Story into <span className="text-gradient-orange">Unstoppable Opportunity</span>
          </h1>

          <p className="text-[#888898] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            <strong className="text-white">Jinzai</strong> (人材) pairs GPT-4o AI intelligence with 78 ATS-certified templates to craft high-impact resumes, cover letters, and live web profiles in under 3 minutes.
          </p>

          {/* Quick CTAs */}
          <div className="flex flex-wrap justify-center items-center gap-3 pt-4">
            <Button onClick={handleStartBuilding} size="lg" className="h-13 px-8 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-bold text-sm gap-2 shadow-xl shadow-[#FF6200]/30 transition-all active:scale-95">
              <FileText className="w-5 h-5" /> Start Building Free
            </Button>
            <ImportResumeDialog trigger={
              <Button variant="outline" size="lg" className="h-13 px-7 rounded-full border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] hover:border-[#FF6200]/50 text-sm gap-2 transition-all">
                <Upload className="w-5 h-5 text-[#FF6200]" /> Upload &amp; Auto-Fill
              </Button>
            } />
            <Button onClick={handleTrySample} variant="ghost" size="lg" className="h-13 px-6 text-[#888898] hover:text-white text-sm gap-2">
              <Wand2 className="w-4 h-4 text-[#FF6200]" /> Try Sample Profile
            </Button>
          </div>

          {user && (
            <div className="pt-2">
              <Link href="/dashboard">
                <span className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6200] bg-[#FF6200]/10 border border-[#FF6200]/30 px-3 py-1 rounded-full hover:underline">
                  Logged in as {user.email} — Open My Dashboard →
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Metrics Strip ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard value={String(TEMPLATES.length)} label="Master Templates" />
          <StatCard value="100%" label="Vector ATS Ready" />
          <StatCard value="20x" label="Callback Rate" />
          <StatCard value="< 3m" label="Build Time" />
        </div>
      </section>

      {/* ── Template Gallery Section ── */}
      <section id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2E2E2E] pb-6">
          <div>
            <Badge className="bg-[#1A1A1A] border-[#2E2E2E] text-[#FF6200] text-xs font-mono mb-2">78 DESIGNS AVAILABLE</Badge>
            <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">Choose a Master Template</h2>
            <p className="text-sm text-[#888898] mt-1">Each template auto-adapts to your content and exports crisp vector ATS PDFs.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888898]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or style…"
              className="pl-10 h-10 text-xs bg-[#141414] border-[#2E2E2E] focus:border-[#FF6200] text-white rounded-xl"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono border transition-all ${
                filter === cat
                  ? "bg-[#FF6200] text-white border-[#FF6200] font-bold shadow-lg shadow-[#FF6200]/20"
                  : "bg-[#141414] text-[#888898] border-[#2E2E2E] hover:border-[#FF6200]/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {filteredTemplates.map(({ t, originalIndex }) => (
            <TemplateCard key={t.id} id={t} index={originalIndex} user={user} onAuthRequired={() => setAuthMode("signup")} />
          ))}
        </div>
      </section>

      {/* ── AI Features Strip ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-10 border-t border-[#2E2E2E] mt-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">Everything You Need to Get Hired</h2>
          <p className="text-sm text-[#888898]">GPT-4o AI writing assistance, ATS keyword matching, and 78 recruiter-approved templates.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "GPT-4o AI Rewriter", desc: "Transforms basic work bullet points into high-impact quantified achievements with action verbs.", icon: Sparkles },
            { title: "Resume Quality Score", desc: "Instant A–F rating across quantification, action verbs, formatting, and completeness.", icon: Gauge },
            { title: "ATS Keyword Matcher", desc: "Paste any target job description to get match scores and missing keyword suggestions.", icon: Target },
            { title: "Tailored Cover Letters", desc: "Generate role-specific cover letters in formal, modern, or concise tone with one click.", icon: Mail },
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
      </section>

      {/* ── Transparent Pricing ── */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-10 border-t border-[#2E2E2E]">
        <div className="text-center space-y-2">
          <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">Transparent &amp; Simple Pricing</h2>
          <p className="text-sm text-[#888898]">Build free. Upgrade when you are ready to download your PDF.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: "Trial Plan", price: "₹99", period: "2 days access", features: ["1 resume export", "Vector PDF download", "Access to 52 templates", "Basic AI rewriter"], highlight: false, planId: "trial_99" },
            { name: "Pro Plan", price: "₹499", period: "/month", features: ["Up to 5 saved resumes", "Vector PDF export", "GPT-4o AI rewriter", "ATS keyword matcher", "Cover letter generator"], highlight: true, planId: "pro_499" },
            { name: "Business Plan", price: "₹1,999", period: "/month", features: ["Unlimited resumes", "All 78 templates", "Priority support", "Multi-page A4 export", "Public share links"], highlight: false, planId: "business_1999" },
          ].map((plan) => (
            <Card key={plan.name} className={`rounded-2xl p-6 bg-[#141414] border flex flex-col justify-between transition-all ${plan.highlight ? "border-[#FF6200] ring-2 ring-[#FF6200]/20 shadow-xl shadow-[#FF6200]/10" : "border-[#2E2E2E]"}`}>
              <div>
                {plan.highlight && (
                  <Badge className="bg-[#FF6200] text-white text-[9px] font-mono mb-3 px-2 py-0.5">MOST POPULAR</Badge>
                )}
                <p className="font-bricolage font-bold text-lg text-white mb-1">{plan.name}</p>
                <p className="text-3xl font-bold text-white mb-1">{plan.price}<span className="text-xs font-normal text-[#888898] ml-1">{plan.period}</span></p>
                <ul className="space-y-2 mt-5 text-xs text-[#888898]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF6200]" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6">
                <Button onClick={handleStartBuilding} className={`w-full h-11 rounded-full font-semibold text-sm gap-2 ${plan.highlight ? "bg-[#FF6200] hover:bg-[#E55700] text-white shadow-lg shadow-[#FF6200]/20" : "bg-transparent border border-[#2E2E2E] hover:border-[#FF6200] text-white hover:bg-[#1A1A1A]"}`}>
                  Start Building
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Reviews / Testimonials ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8 border-t border-[#2E2E2E]">
        <div className="text-center space-y-2">
          <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">Loved by Job Seekers</h2>
          <p className="text-sm text-[#888898]">Real success stories from professionals who landed offers using Jinzai.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Rahul Verma", role: "Software Engineer at Google", quote: "I got 3 interview calls within a week of using Jinzai. The AI rewriter highlighted my achievements with exact metrics.", avatar: "R" },
            { name: "Ananya Krishnan", role: "Product Manager at Swiggy", quote: "The ATS keyword matcher helped me optimize my resume for exactly what recruiters were looking for. Landed my PM role!", avatar: "A" },
            { name: "Vikram Singh", role: "Data Scientist at Amazon", quote: "78 master templates meant I could find the perfect design. The PDF export passed Taleo ATS without a hitch.", avatar: "V" },
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
      </section>

      {/* ── FAQ Section ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-6 border-t border-[#2E2E2E]">
        <div className="text-center space-y-2">
          <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-[#888898]">Everything you need to know about Jinzai.</p>
        </div>
        <div className="space-y-3">
          {[
            { q: "Is Jinzai free to start?", a: "Yes! You can browse all 78 templates and create your resume for free. Upgrade when you are ready to download your vector PDF." },
            { q: "How does the GPT-4o AI scanning & writing work?", a: "Our AI scans raw resume text or uploaded files (.pdf, .docx, .json, .md, .txt), parses all information, and populates all prebuilt sections automatically." },
            { q: "Are the exported PDFs 100% ATS friendly?", a: "Yes! All PDF exports use selectable vector text layers. ATS scanners (Taleo, Greenhouse, Workday) extract 100% of all text cleanly." },
            { q: "Can I import my existing resume?", a: "Yes! Simply click 'Upload & Auto-Fill', choose your file, and AI will parse all sections into structured editor fields." },
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
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full mb-10">
        <div className="rounded-3xl bg-gradient-to-r from-[#FF6200]/20 via-[#141414] to-[#FF8C42]/10 border border-[#FF6200]/30 p-10 sm:p-14 text-center space-y-4">
          <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">Ready to Land Your Next Job Offer?</h2>
          <p className="text-sm text-[#888898] max-w-md mx-auto">Create a recruiter-approved ATS resume in under 3 minutes.</p>
          <Button size="lg" onClick={handleStartBuilding} className="h-12 px-8 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-bold text-sm gap-2 shadow-xl shadow-[#FF6200]/30">
            <UserPlus className="w-4 h-4" /> Start Building Free
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <PublicFooter />

      {/* ── Auth Dialog ── */}
      <AuthDialog mode={authMode} onClose={() => setAuthMode(null)} onSuccess={() => router.push("/dashboard")} />
    </div>
  );
}
