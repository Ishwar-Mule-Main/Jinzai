"use client";

import { useState } from "react";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
      <PublicNav />

      {/* ── Hero Section ── */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center border-b border-[#2a2a2a]">
        <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#faff69] px-4 py-1 text-xs font-mono mb-4 uppercase tracking-widest rounded-full">
          <GraduationCap className="w-3.5 h-3.5 mr-1 inline" /> Campus Placement Platform
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
          Empower Campus Placements with <br className="hidden sm:inline" />
          <span className="text-[#faff69]">ATS-Verified Student Resumes</span>
        </h1>
        <p className="text-[#cccccc] max-w-2xl mx-auto text-base sm:text-lg mb-8 leading-relaxed">
          One unified enterprise platform for Colleges, Universities, and Placement Officers. Give up to <strong className="text-white">300 students</strong> AI-powered ATS resume building and direct vector PDF export.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => setPaymentOpen(true)}
            className="w-full sm:w-auto h-11 px-8 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md text-sm gap-2 transition-colors inline-flex items-center justify-center"
          >
            <Crown className="w-4 h-4" /> Activate Institution Plan (₹4,999/mo)
          </button>
          <button
            onClick={() => setPricingOpen(true)}
            className="w-full sm:w-auto h-11 px-6 border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] rounded-md text-sm font-semibold transition-colors"
          >
            View All Plans
          </button>
        </div>
      </section>

      {/* ── Institution Pricing Box Section ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Institutional Placement Package
          </h2>
          <p className="text-xs sm:text-sm text-[#888888]">
            Full platform access for 300 student resume exports every month.
          </p>
        </div>

        <div className="relative p-8 sm:p-12 bg-[#1a1a1a] border border-[#faff69] rounded-xl shadow-2xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69] shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Institution Plan</h3>
                  <p className="text-xs text-[#888888]">Designed for Colleges, Universities &amp; Placement Cells</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  "Up to 300 Student Resumes per month",
                  "ALL AI Rewriter & Writing tools included for all students",
                  "ALL ATS Score & Job Match analysis for all students",
                  "Vector print-ready A4 PDF download",
                  "College branding & Placement Cell tracking",
                  "Dedicated support line",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#cccccc]">
                    <CheckCircle2 className="w-4 h-4 text-[#faff69] shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Price CTA */}
            <div className="lg:col-span-5 bg-[#121212] border border-[#2a2a2a] rounded-xl p-8 text-center space-y-4">
              <span className="text-[10px] font-mono text-[#faff69] bg-[#242424] border border-[#2a2a2a] px-3 py-0.5 rounded-full uppercase font-bold">
                MONTHLY SUBSCRIPTION
              </span>
              <div>
                <p className="text-4xl sm:text-5xl font-bold text-white font-mono">₹4,999</p>
                <p className="text-xs text-[#888888] font-mono mt-1">/ month for 300 students</p>
                <p className="text-[11px] text-[#888888] font-mono mt-0.5">≈ ₹16.60 per student</p>
              </div>

              <button
                onClick={() => setPaymentOpen(true)}
                className="w-full h-11 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs rounded-md transition-colors inline-flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" /> Pay via UPI / QR Code
              </button>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />

      <PricingDialog open={pricingOpen} onOpenChange={setPricingOpen} currentPlan="free" />
      {paymentOpen && (
        <PaymentDialog
          plan="institution_4999"
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          onPaymentSuccess={() => setPaymentOpen(false)}
        />
      )}
    </div>
  );
}
