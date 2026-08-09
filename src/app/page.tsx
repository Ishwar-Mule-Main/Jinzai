"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { TemplateCard } from "@/components/resume/template-card";
import { AuthDialog, type AuthMode } from "@/components/resume/auth-dialogs";
import { ImportResumeDialog } from "@/components/resume/import-resume-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  FileText,
  Upload,
  Wand2,
  Check,
  Search,
  SlidersHorizontal,
  Target,
  Gauge,
  Mail,
  Building2,
  ShieldCheck,
  Star,
  ChevronDown,
  UserPlus,
  Crown,
  Smartphone,
  GraduationCap,
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
    loadSample(getSampleProfile("software"));
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
      if (activeCategory === "executive") fontMatches: matchesCategory = t.tags.some((tag) => tag.toLowerCase().includes("executive") || tag.tags.includes("Serif"));

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-[#FF6200] selection:text-white">
      {/* Navbar */}
      <PublicNav onLogin={() => setAuthMode("login")} onSignup={() => setAuthMode("signup")} />

      {/* ── Hero Section ── */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6200]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <Badge className="bg-[#1A1A1A] border-[#2E2E2E] text-[#FF6200] px-4 py-1.5 rounded-full font-mono text-xs gap-2 inline-flex shadow-lg shadow-[#FF6200]/10">
            <Sparkles className="w-4 h-4" /> Domain Expansion AI Resume Builder
          </Badge>

          <h1 className="font-bricolage text-4xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            Transform Your Career Story into <span className="text-gradient-orange">Unstoppable Opportunity</span>
          </h1>

          <p className="text-[#888898] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            <strong className="text-white">Jinzai</strong> (人材) pairs LLMs / AI / GPTs intelligence with 78 ATS-certified templates to craft high-impact resumes, cover letters, and live web profiles in under 3 minutes.
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

      {/* ── Interactive Templates Gallery ── */}
      <section id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 text-xs font-mono mb-2">78 MASTER TEMPLATES</Badge>
            <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">Choose Your Professional Design</h2>
            <p className="text-sm text-[#888898]">Hover any card to use template immediately or filter by category.</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#888898] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="pl-10 h-10 bg-[#141414] border-[#2E2E2E] focus:border-[#FF6200] text-white text-xs rounded-full"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#2E2E2E] pb-4">
          {[
            { id: "all", label: "All 78 Templates" },
            { id: "ats", label: "100% ATS Friendly" },
            { id: "entry", label: "College / Freshers" },
            { id: "tech", label: "Tech / Developers" },
            { id: "executive", label: "Executive / Senior" },
            { id: "creative", label: "Creative & Bold" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-[#FF6200] text-white font-bold shadow-md shadow-[#FF6200]/20"
                  : "bg-[#141414] border border-[#2E2E2E] text-[#888898] hover:text-white hover:border-[#FF6200]/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Uniform Grid of Equal Shape Template Cards */}
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
          <p className="text-sm text-[#888898]">LLMs / AI / GPTs writing assistance, ATS keyword matching, and 78 recruiter-approved templates.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "LLMs / AI / GPTs Rewriter", desc: "Transforms basic work bullet points into high-impact quantified achievements with action verbs.", icon: Sparkles },
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
          <p className="text-sm text-[#888898]">Build free. Upgrade when you are ready to download your vector PDF.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { name: "Single Export Pass", price: "₹99", period: "per export", features: ["1 Resume PDF Export", "Access all 78 templates", "Vector A4 PDF download", "❌ No AI/ATS Tools"], highlight: false },
            { name: "Pro Plan", price: "₹399", period: "/month", features: ["5 Resume Exports", "LLMs / AI / GPTs Rewriter", "ATS Score & Match Analysis", "AI Cover Letter Generator", "All 78 templates"], highlight: true },
            { name: "Business Plan", price: "₹999", period: "/month", features: ["50 Resume Exports", "LLMs / AI / GPTs Rewriter", "ATS Score & Match Analysis", "Priority Support", "No contact lock"], highlight: false },
            { name: "Institution Plan", price: "₹4,999", period: "/month", features: ["300 Student Resumes", "Placement Cell Portal", "All AI & ATS Features", "College Branding"], highlight: false },
          ].map((plan) => (
            <Card key={plan.name} className={`rounded-2xl p-6 bg-[#141414] border flex flex-col justify-between transition-all ${plan.highlight ? "border-[#FF6200] ring-2 ring-[#FF6200]/20 shadow-xl shadow-[#FF6200]/10" : "border-[#2E2E2E]"}`}>
              <div>
                {plan.highlight && (
                  <Badge className="bg-[#FF6200] text-white text-[9px] font-mono mb-3 px-2 py-0.5 uppercase font-bold">MOST POPULAR</Badge>
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
            { q: "How does the LLMs / AI / GPTs scanning & writing work?", a: "Our AI scans raw resume text or uploaded files (.pdf, .docx, .json, .md, .txt), parses all information, and populates all prebuilt sections automatically." },
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
