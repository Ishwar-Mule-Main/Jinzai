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
  Award,
  Globe2,
  Cpu,
  Building2,
  ArrowRight,
  CheckCircle2,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Jinzai | Domain Expansion",
  description: "Learn how Jinzai (人材) combines cutting-edge AI with world-class design to help talent win interviews globally.",
};

const PILLARS = [
  {
    icon: Sparkles,
    title: "AI Intelligence",
    desc: "Powered by GPT-4o-mini via OpenRouter to scan raw resume text, extract structured data, and rewrite weak bullets into quantified impact statements.",
  },
  {
    icon: Target,
    title: "100% ATS Integrity",
    desc: "Every exported document outputs crisp, selectable vector text layers that pass applicant tracking systems (Taleo, Greenhouse, Workday) with 100% readability.",
  },
  {
    icon: Award,
    title: "72 Master Templates",
    desc: "Curated by Fortune 500 recruiters and senior designers across executive, tech, creative, academic, and modern industries.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "Your professional data belongs to you. Zero data selling, encrypted persistence, and full export/import capabilities anytime.",
  },
];

const TECH_STACK = [
  { name: "Next.js 16", desc: "React Framework & Server Components" },
  { name: "TypeScript", desc: "Type-safe architecture" },
  { name: "OpenRouter API", desc: "GPT-4o-mini AI scanning engine" },
  { name: "Tailwind CSS v4", desc: "DE Master Design System tokens" },
  { name: "Prisma & SQLite", desc: "High-speed database persistence" },
  { name: "html2pdf & jsPDF", desc: "Vector ATS document export" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-[#FF6200] selection:text-white">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <Badge className="bg-[#1A1A1A] border-[#2E2E2E] text-[#FF6200] px-3 py-1 text-xs font-mono rounded-full gap-1.5 inline-flex">
            <Sparkles className="w-3.5 h-3.5" /> About Jinzai — 人材
          </Badge>
          <h1 className="font-bricolage text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Empowering Global Talent Through <span className="text-gradient-orange">Design & AI Intelligence</span>
          </h1>
          <p className="text-base sm:text-lg text-[#888898] leading-relaxed">
            <strong className="text-white">Jinzai</strong> (人材) — Japanese for <em>"Exceptional Human Talent"</em> — is an advanced AI-powered career platform engineered by <strong className="text-white">Domain Expansion</strong> to eliminate resume friction and accelerate career breakthroughs.
          </p>
        </section>

        {/* Mission Statement Banner */}
        <section className="relative rounded-3xl bg-[#141414] border border-[#2E2E2E] p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6200]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 font-mono text-xs">OUR MISSION</Badge>
              <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">
                Democratizing Professional Career Tools Worldwide
              </h2>
              <p className="text-[#888898] leading-relaxed text-sm sm:text-base">
                We believe that every professional deserves a world-class resume that accurately reflects their capabilities. By combining cutting-edge AI parsing with recruiter-approved design systems, Jinzai turns job applications into interview invitations.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] text-center">
                <p className="font-bricolage text-3xl sm:text-4xl font-bold text-gradient-orange">72+</p>
                <p className="text-xs font-mono text-[#888898] mt-1">Master Templates</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] text-center">
                <p className="font-bricolage text-3xl sm:text-4xl font-bold text-gradient-orange">100%</p>
                <p className="text-xs font-mono text-[#888898] mt-1">Vector ATS Compatible</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] text-center">
                <p className="font-bricolage text-3xl sm:text-4xl font-bold text-gradient-orange">GPT-4o</p>
                <p className="text-xs font-mono text-[#888898] mt-1">AI Intelligence Engine</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] text-center">
                <p className="font-bricolage text-3xl sm:text-4xl font-bold text-gradient-orange">&lt; 3 Min</p>
                <p className="text-xs font-mono text-[#888898] mt-1">Average Build Time</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Pillars Grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-bricolage text-3xl font-bold text-white mb-2">Built on Four Core Pillars</h2>
            <p className="text-[#888898] text-sm">Engineered for candidates who refuse to compromise on quality.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.title} className="p-6 bg-[#141414] border-[#2E2E2E] rounded-2xl hover:border-[#FF6200]/40 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] group-hover:border-[#FF6200]/50 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-6 h-6 text-[#FF6200]" />
                  </div>
                  <h3 className="font-bricolage text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-[#888898] leading-relaxed">{p.desc}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Parent Company & Technology */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Profile */}
          <div className="lg:col-span-2 rounded-2xl bg-[#141414] border border-[#2E2E2E] p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6200] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bricolage text-xl font-bold text-white">Domain Expansion</h3>
                <p className="text-xs font-mono text-[#888898]">Parent Enterprise • Bengaluru, India</p>
              </div>
            </div>
            <p className="text-sm text-[#888898] leading-relaxed">
              Domain Expansion is a technology enterprise dedicated to building transformative digital products. Based out of Bengaluru, Karnataka, India, our team designs high-performance software that solves complex real-world problems for job seekers, businesses, and creators.
            </p>
            <div className="pt-4 border-t border-[#2E2E2E] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[#888898]">
              <div>
                <p className="text-white font-semibold mb-1">Corporate HQ</p>
                <p>Domain Expansion</p>
                <p>Bengaluru, Karnataka, India</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Official Contact</p>
                <p>Email: admin@domainexpansion.in</p>
                <p>Web: domainexpansion.in</p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="rounded-2xl bg-[#141414] border border-[#2E2E2E] p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#FF6200]" />
              <h3 className="font-bricolage text-xl font-bold text-white">Tech Architecture</h3>
            </div>
            <div className="space-y-3">
              {TECH_STACK.map((t) => (
                <div key={t.name} className="p-3 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex justify-between items-center">
                  <span className="text-xs font-bold text-white">{t.name}</span>
                  <span className="text-[10px] font-mono text-[#888898]">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center rounded-3xl bg-gradient-to-r from-[#FF6200]/20 via-[#141414] to-[#FF8C42]/10 border border-[#FF6200]/30 p-10 sm:p-14 space-y-6">
          <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">
            Ready to Build Your Winning Resume?
          </h2>
          <p className="text-sm text-[#888898] max-w-xl mx-auto">
            Choose from 72 templates or upload your existing resume to scan and parse with GPT-4o-mini in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button className="h-12 px-8 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold gap-2 shadow-lg shadow-[#FF6200]/30">
                <FileText className="w-4 h-4" /> Start Building Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
