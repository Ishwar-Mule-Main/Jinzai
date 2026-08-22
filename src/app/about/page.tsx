import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import {
  Sparkles,
  Shield,
  Zap,
  Target,
  FileText,
  Building2,
  ArrowRight,
  AlertTriangle,
  GraduationCap,
  Users,
  LayoutGrid,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Jinzai | Powered by Domain Expansion",
  description: "Learn how Jinzai (人材) — created and owned by Domain Expansion — operates remotely to solve global resume creation and ATS rejection challenges for job seekers, freshers, and institutions.",
};

const WORLDWIDE_CHALLENGES = [
  {
    icon: AlertTriangle,
    title: "The ATS Rejection Gatekeeper",
    desc: "Over 75% of resumes are automatically rejected by Applicant Tracking Systems (ATS like Workday, Taleo, Greenhouse) before a human recruiter ever sees them — simply due to unparseable formatting, multi-column tables, or hidden layout errors.",
  },
  {
    icon: GraduationCap,
    title: "Fresher & Graduate Dilemma",
    desc: "College freshers and entry-level job seekers face the classic 'experience chicken-and-egg' trap. Without prior work history, they struggle to translate academic projects, campus leadership, and coursework into recruiter-worthy impact statements.",
  },
  {
    icon: Users,
    title: "Global Unemployment Pressure",
    desc: "With over 200+ million active job seekers worldwide competing for limited positions, recruiters spend an average of just 6 seconds scanning each resume. Standing out requires immediate clarity, proper hierarchy, and bullet quantification.",
  },
  {
    icon: Zap,
    title: "Predatory & Expensive Resume Tools",
    desc: "Most online resume builders lure job seekers with 'free preview' bait, only to lock basic PDF downloads behind hidden $30+/month recurring subscriptions that are difficult to cancel.",
  },
];

const PLATFORM_SOLUTIONS = [
  {
    icon: Target,
    title: "100% Vector ATS Compliance",
    desc: "Jinzai generates crisp, vector-rendered A4 PDF text layers guaranteed to parse cleanly across all major enterprise ATS platforms without losing font data or structure.",
  },
  {
    icon: Sparkles,
    title: "AI Bullet Quantification Engine",
    desc: "Our GPT-powered AI converts vague duty statements into high-impact, quantified achievement bullets packed with industry-specific action verbs and metrics.",
  },
  {
    icon: GraduationCap,
    title: "Dedicated Fresher & College Pathway",
    desc: "Tailored project layouts, skill category matrices, and entry-level templates designed specifically to highlight potential, academic achievements, and internship outcomes.",
  },
  {
    icon: Shield,
    title: "Transparent & Accessible Pricing",
    desc: "No hidden recurring traps. Options range from ₹99 single export passes to affordable monthly subscriptions and institutional placement packages.",
  },
];

const CORE_FEATURES = [
  {
    title: "78+ Recruiter-Approved ATS Templates",
    desc: "Categorized by career level (Freshers/College, Experienced, Tech, Creative) with single-click instant design switching.",
    icon: LayoutGrid,
  },
  {
    title: "AI Bullet Rewriter & Quantifier",
    desc: "Turn weak bullet points into high-impact impact statements backed by quantifiable metrics with 1 click.",
    icon: Sparkles,
  },
  {
    title: "ATS Keyword Matcher & Scoring",
    desc: "Paste any job description to compare your resume's keyword match score, formatting compliance, and receive instant fix suggestions.",
    icon: Target,
  },
  {
    title: "AI Cover Letter Generator",
    desc: "Generate customized, job-tailored cover letters in seconds based on your resume profile and target job description.",
    icon: FileText,
  },
  {
    title: "College & Placement Cell Portal",
    desc: "Dedicated enterprise plan (₹4,999/mo) for 300 student resumes, allowing campus placement cells to manage student resume compliance.",
    icon: GraduationCap,
  },
  {
    title: "Vector A4 PDF & DOCX Export",
    desc: "Export high-precision, print-ready vector PDF files and editable Word documents anytime.",
    icon: Zap,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-20">
        {/* ── 1. Hero Section ── */}
        <section className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#faff69] px-3.5 py-1 text-xs font-mono rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> About Jinzai — 人材
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Solving the Global Resume &amp; Hiring Challenge with <span className="text-[#faff69]">Precision AI</span>
          </h1>
          <p className="text-base sm:text-lg text-[#cccccc] leading-relaxed max-w-2xl mx-auto">
            <strong className="text-white">Jinzai</strong> (人材) — Japanese for <em>&ldquo;Exceptional Human Talent&rdquo;</em> — is an engineered AI platform designed to help candidates, freshers, and institutions overcome automated ATS hiring barriers.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#888888]">
            <span className="px-3.5 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[#cccccc]">
              Parent Enterprise: <strong className="text-[#faff69]">Domain Expansion</strong>
            </span>
            <span className="px-3.5 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[#cccccc]">
              78+ Engineered Layouts
            </span>
            <span className="px-3.5 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[#cccccc]">
              100% Remote &amp; Global Operations
            </span>
          </div>
        </section>

        {/* ── 2. Worldwide Challenges Section ── */}
        <section className="space-y-8 border-t border-[#2a2a2a] pt-16">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[10px] font-mono text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/30 px-3 py-1 rounded-full uppercase">
              THE GLOBAL CHALLENGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              The Realities Facing Modern Candidates
            </h2>
            <p className="text-[#888888] text-sm max-w-xl mx-auto">
              Millions of qualified candidates remain unseen because of systemic formatting and keyword barriers in automated recruitment software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WORLDWIDE_CHALLENGES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-8 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors rounded-xl flex items-start gap-5 shadow-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#ef4444] shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <h3 className="text-lg font-semibold text-white tracking-tight">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 3. Platform Solutions ── */}
        <section className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-8 sm:p-12 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[10px] font-mono text-[#faff69] bg-[#242424] border border-[#2a2a2a] px-3 py-1 rounded-full uppercase">
              THE JINZAI SOLUTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineering a Clear Advantage
            </h2>
            <p className="text-[#888888] text-sm max-w-xl mx-auto">
              We designed Jinzai to bridge candidate experience and corporate ATS requirements with intelligent structure and AI validation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLATFORM_SOLUTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="p-6 bg-[#121212] border border-[#2a2a2a] rounded-xl space-y-4 hover:border-[#3a3a3a] transition-colors flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-white leading-snug mb-2">{s.title}</h3>
                    <p className="text-xs text-[#888888] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. Core Features ── */}
        <section className="space-y-8 border-t border-[#2a2a2a] pt-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineered for Immediate Impact
            </h2>
            <p className="text-[#888888] text-sm">
              Comprehensive resume compilation, AI bullet optimization, and institutional tooling in one clean workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-8 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors rounded-xl flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69] shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <h3 className="font-semibold text-base text-white leading-snug">{feat.title}</h3>
                    <p className="text-xs text-[#888888] leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 5. Domain Expansion Parent Company ── */}
        <section className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-8 sm:p-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2a2a] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#faff69] flex items-center justify-center text-[#0a0a0a] font-bold text-lg shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#faff69]">PARENT ENTERPRISE</span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Domain Expansion</h2>
                <p className="text-xs text-[#888888] font-mono">100% Remote-First Enterprise • Global Reach</p>
              </div>
            </div>

            <div>
              <a
                href="https://domainexpansion.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs sm:text-sm font-semibold text-[#faff69] hover:underline inline-flex items-center gap-1 font-mono"
              >
                domainexpansion.in <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#cccccc] leading-relaxed">
            <p>
              <strong className="text-white">Jinzai (人材)</strong> is created, engineered, and operated by <strong className="text-white">Domain Expansion</strong> as its parent company. Domain Expansion is a technology enterprise focused on building transformative digital products and enterprise tools.
            </p>
            <p>
              As a fully remote-first organization with distributed engineering teams, Domain Expansion serves candidates, educational institutions, and job seekers worldwide with strict data privacy protocols and high-availability cloud infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#2a2a2a]">
            <div className="p-4 rounded-lg bg-[#121212] border border-[#2a2a2a]">
              <p className="text-[11px] text-[#888888] font-mono">Parent Entity</p>
              <p className="text-sm font-bold text-white mt-1">Domain Expansion</p>
            </div>
            <div className="p-4 rounded-lg bg-[#121212] border border-[#2a2a2a]">
              <p className="text-[11px] text-[#888888] font-mono">Operations</p>
              <p className="text-sm font-bold text-white mt-1">100% Remote &amp; Global</p>
            </div>
            <div className="p-4 rounded-lg bg-[#121212] border border-[#2a2a2a]">
              <p className="text-[11px] text-[#888888] font-mono">Official Email</p>
              <p className="text-sm font-bold text-[#faff69] mt-1">admin@domainexpansion.in</p>
            </div>
          </div>
        </section>

        {/* ── 6. Yellow CTA Band ── */}
        <section className="rounded-xl bg-[#faff69] text-[#0a0a0a] p-10 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-left">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0a0a0a]">
              Ready to Win Your Next Interview?
            </h2>
            <p className="text-sm sm:text-base text-[#1a1a1a] max-w-xl">
              Build your ATS-certified resume in under 3 minutes with 78 engineered layouts.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link href="/editor">
              <button className="h-12 px-8 bg-[#0a0a0a] hover:bg-[#242424] text-white font-semibold text-sm rounded-md transition-colors inline-flex items-center gap-2">
                <FileText className="w-4 h-4" /> Start Building Free
              </button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
