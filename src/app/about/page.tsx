import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  Globe2,
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
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-[#FF6200] selection:text-white">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full space-y-16 sm:space-y-24">
        {/* ── 1. Hero Section ── */}
        <section className="text-center max-w-4xl mx-auto space-y-5">
          <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 px-3.5 py-1 text-xs font-mono rounded-full gap-2 inline-flex uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> About Jinzai — 人材
          </Badge>
          <h1 className="font-bricolage text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Solving the Global Resume &amp; Unemployment Challenge through <span className="text-gradient-orange">AI &amp; ATS Innovation</span>
          </h1>
          <p className="text-sm sm:text-base text-[#9A9AAB] leading-relaxed max-w-2xl mx-auto font-normal">
            <strong className="text-white">Jinzai</strong> (人材) — Japanese for <em>"Exceptional Human Talent"</em> — is an advanced AI resume building platform engineered to help job seekers, college freshers, and institutions overcome automated ATS hiring barriers worldwide.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono text-[#9A9AAB]">
            <span className="px-3.5 py-1.5 bg-[#141414] border border-[#2E2E2E] rounded-full text-white">
              Parent Company: <strong className="text-[#FF6200]">Domain Expansion</strong>
            </span>
            <span className="px-3.5 py-1.5 bg-[#141414] border border-[#2E2E2E] rounded-full text-white">
              78+ Master Templates
            </span>
            <span className="px-3.5 py-1.5 bg-[#141414] border border-[#2E2E2E] rounded-full text-white">
              100% Remote &amp; Global Operations
            </span>
          </div>
        </section>

        {/* ── 2. Worldwide Challenges Section ── */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-0.5 text-xs font-mono">
              THE GLOBAL PROBLEM
            </Badge>
            <h2 className="font-bricolage text-2xl sm:text-4xl font-bold text-white">
              The Hard Realities Facing Job Seekers Worldwide
            </h2>
            <p className="text-[#9A9AAB] text-xs sm:text-sm max-w-xl mx-auto">
              Millions of qualified candidates remain unemployed not because of a lack of skill, but because of systemic barriers in modern hiring software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {WORLDWIDE_CHALLENGES.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="p-6 sm:p-7 bg-[#141414] border-[#2E2E2E] hover:border-red-500/40 transition-all duration-300 rounded-2xl flex items-start gap-4 shadow-lg"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <h3 className="font-bricolage text-base sm:text-lg font-bold text-white leading-snug">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-[#9A9AAB] leading-relaxed">{item.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── 3. How Our Platform Helps Section ── */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#141414] via-[#1A1A1A] to-[#141414] border border-[#FF6200]/40 p-6 sm:p-10 overflow-hidden shadow-2xl space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6200]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 px-3 py-0.5 text-xs font-mono">
              THE JINZAI SOLUTION
            </Badge>
            <h2 className="font-bricolage text-2xl sm:text-4xl font-extrabold text-white">
              How Jinzai Empowers Candidates &amp; Freshers
            </h2>
            <p className="text-[#9A9AAB] text-xs sm:text-sm max-w-xl mx-auto">
              We engineered Jinzai to bridge the gap between job seekers and Applicant Tracking Systems with intelligent design and AI assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {PLATFORM_SOLUTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="p-6 bg-[#0D0D0D] border border-[#2E2E2E] rounded-2xl space-y-3 hover:border-[#FF6200]/50 transition-colors flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center text-[#FF6200] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bricolage font-bold text-base text-white leading-snug mb-1.5">{s.title}</h3>
                    <p className="text-xs text-[#9A9AAB] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. Key Features We Provide Section ── */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge className="bg-[#1A1A1A] border-[#2E2E2E] text-white px-3 py-0.5 text-xs font-mono">
              PLATFORM FEATURES
            </Badge>
            <h2 className="font-bricolage text-2xl sm:text-4xl font-bold text-white">
              Everything You Need to Win Interviews
            </h2>
            <p className="text-[#9A9AAB] text-xs sm:text-sm">
              Comprehensive resume building, AI optimization, and institutional tools built into one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CORE_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <Card
                  key={feat.title}
                  className="p-6 bg-[#141414] border-[#2E2E2E] hover:border-[#FF6200]/40 transition-all duration-300 rounded-2xl flex items-start gap-4 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] group-hover:border-[#FF6200]/50 flex items-center justify-center text-[#FF6200] shrink-0 mt-0.5 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bricolage font-bold text-base text-white leading-snug">{feat.title}</h3>
                    <p className="text-xs text-[#9A9AAB] leading-relaxed">{feat.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── 5. Domain Expansion Parent Company Section ── */}
        <section className="rounded-3xl bg-[#141414] border-2 border-[#FF6200]/40 p-6 sm:p-10 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6200]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2E2E] pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6200] flex items-center justify-center shadow-lg shadow-[#FF6200]/30 shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 text-[10px] uppercase font-mono mb-1">
                  PARENT ENTERPRISE
                </Badge>
                <h2 className="font-bricolage text-xl sm:text-2xl font-extrabold text-white">Domain Expansion</h2>
                <p className="text-xs text-[#9A9AAB] font-mono">100% Remote-First Enterprise • Global Reach</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-mono text-[#9A9AAB] block">Official Website</span>
              <a
                href="https://domainexpansion.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs sm:text-sm font-bold text-[#FF6200] hover:underline inline-flex items-center gap-1"
              >
                domainexpansion.in <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#9A9AAB] leading-relaxed">
            <p>
              <strong className="text-white">Jinzai (人材)</strong> is created, engineered, and operated by <strong className="text-white">Domain Expansion</strong> as its parent company. Domain Expansion is a premier technology enterprise focused on building transformative digital products, artificial intelligence platforms, and enterprise tools that solve high-stakes real-world problems.
            </p>
            <p>
              As a fully remote-first organization with distributed engineering teams, Domain Expansion serves candidates, educational institutions, and job seekers worldwide with cutting-edge engineering standards, strict data privacy protocols, and high-availability cloud infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#2E2E2E]">
            <div className="p-3.5 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E]">
              <p className="text-[11px] text-[#9A9AAB] font-mono">Parent Entity</p>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5">Domain Expansion</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E]">
              <p className="text-[11px] text-[#9A9AAB] font-mono">Operations</p>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5">100% Remote &amp; Global</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E]">
              <p className="text-[11px] text-[#9A9AAB] font-mono">Official Email</p>
              <p className="text-xs sm:text-sm font-bold text-[#FF6200] mt-0.5">admin@domainexpansion.in</p>
            </div>
          </div>
        </section>

        {/* ── 6. High-Impact Call To Action (CTA) ── */}
        <section className="text-center rounded-3xl bg-gradient-to-r from-[#FF6200]/20 via-[#141414] to-[#FF6200]/10 border border-[#FF6200]/40 p-8 sm:p-12 space-y-5 shadow-2xl">
          <Badge className="bg-[#FF6200] text-white text-xs font-bold uppercase tracking-wider px-4 py-1">
            Build Your Winning Resume
          </Badge>
          <h2 className="font-bricolage text-2xl sm:text-4xl font-extrabold text-white">
            Ready to Beat the ATS &amp; Land Your Next Interview?
          </h2>
          <p className="text-xs sm:text-sm text-[#9A9AAB] max-w-xl mx-auto leading-relaxed">
            Join thousands of job seekers, college freshers, and professionals building ATS-optimized resumes with Jinzai. Browse 78+ templates or upload your old resume to begin.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto">
            <Link href="/editor" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-11 px-7 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-bold text-xs sm:text-sm gap-2 shadow-xl shadow-[#FF6200]/30 transition-all">
                <FileText className="w-4 h-4" /> Start Building Resume →
              </Button>
            </Link>
            <Link href="/templates" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-11 px-7 rounded-full border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#222222] font-semibold text-xs sm:text-sm">
                Explore 78 Templates
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
