"use client";

import { useState } from "react";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
  Crown,
  FileCheck,
  Building2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  BarChart3,
  Smartphone,
} from "lucide-react";
import { PricingDialog } from "@/components/resume/pricing-dialog";
import { PaymentDialog } from "@/components/resume/payment-dialog";
import { useCurrentUser } from "@/lib/resume/use-current-user";

export default function InstitutionsPage() {
  const { user } = useCurrentUser();
  const [pricingOpen, setPricingOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans">
      <PublicNav />

      {/* ── Hero Section ── */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center border-b border-[#2E2E2E]">
        <Badge className="bg-[#FF6200]/10 text-[#FF6200] border border-[#FF6200]/30 px-4 py-1 text-xs font-mono mb-4 uppercase tracking-widest">
          <GraduationCap className="w-3.5 h-3.5 mr-1.5 inline" /> Colleges &amp; Universities Platform
        </Badge>
        <h1 className="font-bricolage text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Empower Your Campus Placements with <br className="hidden sm:inline" />
          <span className="text-gradient-orange">ATS-Verified Student Resumes</span>
        </h1>
        <p className="text-[#888898] max-w-2xl mx-auto text-base sm:text-lg mb-8 leading-relaxed">
          One unified enterprise platform for Colleges, Universities, and Placement Officers. Give up to <strong className="text-white">300 students</strong> AI-powered ATS resume building and direct PDF export.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Button
            onClick={() => setPaymentOpen(true)}
            className="w-full sm:w-auto h-12 px-8 bg-[#FF6200] hover:bg-[#E55700] text-white font-bold rounded-full shadow-xl shadow-[#FF6200]/30 hover:shadow-[#FF6200]/50 text-sm gap-2 transition-all"
          >
            <Crown className="w-4 h-4" /> Activate Institution Plan (₹4,999/mo) →
          </Button>
          <Button
            onClick={() => setPricingOpen(true)}
            variant="outline"
            className="w-full sm:w-auto h-12 px-6 border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#222222] rounded-full text-sm font-semibold"
          >
            View All Plans
          </Button>
        </div>
      </section>

      {/* ── Institution Pricing Box Section ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white mb-2">
            Simple Institution Pricing
          </h2>
          <p className="text-xs sm:text-sm text-[#888898]">
            Full platform access for 300 student resume exports every month.
          </p>
        </div>

        <Card className="relative p-8 sm:p-12 bg-gradient-to-br from-[#141414] via-[#1A1A1A] to-[#141414] border-2 border-[#FF6200] rounded-3xl shadow-2xl shadow-[#FF6200]/15">
          <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF6200] text-white text-xs font-bold uppercase tracking-wider px-4 py-1 shadow-md">
            College &amp; University Special
          </Badge>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-[#FF6200]" />
                </div>
                <div>
                  <h3 className="font-bricolage text-2xl font-bold text-white">Institution Plan</h3>
                  <p className="text-xs text-[#888898]">Designed for Colleges, Universities &amp; Placement Cells</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  "Up to 300 Student Resumes per month",
                  "ALL AI Rewriter & Writing tools included for all students",
                  "ALL ATS Score & Job Match analysis for all students",
                  "100% Vector ATS PDF export for all students",
                  "Bulk Student Onboarding & Admin Progress Portal",
                  "Institutional Branding & Custom College Header",
                  "Placement Drive Ready Compliance Reports",
                  "Dedicated Account Manager & 24/7 Priority Support",
                ].map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#CCCCCC]">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6200] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Pricing Card */}
            <div className="lg:col-span-5 bg-[#0D0D0D] border border-[#2E2E2E] rounded-2xl p-6 text-center space-y-4">
              <div>
                <span className="text-xs font-mono text-[#888898] uppercase">Monthly Subscription</span>
                <div className="text-4xl sm:text-5xl font-extrabold text-white mt-1">₹4,999</div>
                <span className="text-xs text-[#888898]">/ month for 300 students</span>
              </div>

              <div className="p-3 bg-[#FF6200]/10 border border-[#FF6200]/20 rounded-xl text-left text-xs text-[#FF6200] font-mono space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Instant UPI Activation
                </p>
                <p className="text-[11px] text-[#888898]">
                  Scan QR &amp; pay via GPay, PhonePe, Paytm, or BHIM for instant institution onboarding.
                </p>
              </div>

              <Button
                onClick={() => setPaymentOpen(true)}
                className="w-full h-12 bg-[#FF6200] hover:bg-[#E55700] text-white font-bold rounded-full shadow-lg shadow-[#FF6200]/30 text-sm gap-2 transition-all"
              >
                <Smartphone className="w-4 h-4" /> Pay ₹4,999 via UPI Now
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* ── Why Institutions Choose Jinzai ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-[#2E2E2E]">
        <div className="text-center mb-12">
          <h2 className="font-bricolage text-3xl sm:text-4xl font-bold text-white mb-2">
            Why Colleges &amp; Placement Cells Prefer Jinzai
          </h2>
          <p className="text-xs sm:text-sm text-[#888898]">
            Built to eliminate generic resume formats and boost student interview callback rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "100% ATS Verification",
              desc: "Every student resume is parsed and verified against top campus recruiters' Applicant Tracking Systems (Workday, Taleo, Greenhouse).",
              icon: ShieldCheck,
            },
            {
              title: "AI Bullet Quantifier",
              desc: "Students can rewrite weak experience bullets into quantified, high-impact achievement statements automatically.",
              icon: Sparkles,
            },
            {
              title: "Placement Analytics",
              desc: "Placement Officers get a centralized view of student resume completion, ATS scores, and ready PDF downloads.",
              icon: BarChart3,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="p-6 bg-[#141414] border-[#2E2E2E] rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#FF6200]" />
                </div>
                <h3 className="font-bricolage font-bold text-lg text-white">{item.title}</h3>
                <p className="text-xs text-[#888898] leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <PublicFooter />

      {/* Pricing Dialog */}
      <PricingDialog
        currentPlan={user?.plan || "free"}
        open={pricingOpen}
        onOpenChange={setPricingOpen}
      />

      {/* Institution Payment Dialog */}
      {paymentOpen && (
        <PaymentDialog
          plan="institution_4999"
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          onPaymentSuccess={() => {
            setPaymentOpen(false);
          }}
        />
      )}
    </div>
  );
}
