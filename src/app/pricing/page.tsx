"use client";

import { useState } from "react";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { Button } from "@/components/ui/button";
import { Check, Crown, XCircle, Smartphone, GraduationCap } from "lucide-react";
import { PLAN_LIMITS, PAID_PLANS, type PlanId } from "@/lib/resume/plans";
import { PaymentDialog } from "@/components/resume/payment-dialog";
import Link from "next/link";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full relative">
        <div className="text-center mb-12">
          <p className="text-xs font-mono text-[#FF6200] mb-2 uppercase tracking-widest">Simple, transparent pricing</p>
          <h1 className="font-bricolage text-4xl sm:text-6xl font-bold tracking-tight text-white mb-3">
            Choose your <span className="text-gradient-orange">plan</span>
          </h1>
          <p className="text-[#888898] max-w-xl mx-auto text-sm sm:text-base">
            Start free. Upgrade when you are ready to export vector ATS resumes. From single export passes to Pro, Business, and Institution plans.
          </p>
        </div>

        {/* Free plan banner */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-[#141414] rounded-2xl border border-[#2E2E2E] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bricolage font-bold text-xl text-white">Free Plan</h2>
              <p className="text-xs text-[#888898] mt-1">Browse all 78 templates, create 1 resume, interactive preview included.</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-3xl font-bold font-mono text-white">₹0</p>
              <p className="text-[10px] text-[#888898] font-mono">Forever Free</p>
            </div>
          </div>
        </div>

        {/* Paid plans grid (4 Plans) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PAID_PLANS.map((planId) => {
            const plan = PLAN_LIMITS[planId];
            const isFeatured = plan.highlight;
            const isInstitution = planId === "institution_4999";

            return (
              <div
                key={planId}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? "bg-[#1A1A1A] border-2 border-[#FF6200] shadow-2xl shadow-[#FF6200]/15 relative"
                    : isInstitution
                    ? "bg-[#141414] border-2 border-teal-500/60 shadow-xl shadow-teal-500/10"
                    : "bg-[#141414] border border-[#2E2E2E] hover:border-[#FF6200]/40"
                }`}
              >
                <div>
                  {plan.badge && (
                    <div className="mb-3">
                      <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        isFeatured ? "bg-[#FF6200] text-white" : isInstitution ? "bg-teal-600 text-white" : "bg-[#1A1A1A] text-[#888898] border border-[#2E2E2E]"
                      }`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  <h2 className="font-bricolage font-bold text-2xl mb-1 text-white">{plan.name}</h2>
                  <div className="mb-5">
                    <span className="text-3xl sm:text-4xl font-bold font-mono text-white">{plan.priceLabel}</span>
                    <span className="text-xs text-[#888898] ml-1 font-mono">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, i) => {
                      const isNegative = f.startsWith("❌");
                      return (
                        <li key={i} className={`flex items-start gap-2 text-xs ${isNegative ? "text-[#888898]/70" : "text-[#CCCCCC]"}`}>
                          {isNegative ? (
                            <XCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                          ) : (
                            <Check className="w-4 h-4 shrink-0 text-[#FF6200] mt-0.5" />
                          )}
                          <span>{f}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <Button
                    onClick={() => setSelectedPlan(planId)}
                    className={`w-full gap-2 rounded-full font-semibold h-11 text-xs ${
                      isFeatured
                        ? "bg-[#FF6200] hover:bg-[#E55700] text-white shadow-lg shadow-[#FF6200]/30"
                        : isInstitution
                        ? "bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30"
                        : "bg-transparent border border-[#2E2E2E] hover:border-[#FF6200] text-white hover:bg-[#222222]"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" /> Pay ₹{plan.price} via UPI
                  </Button>
                  {isInstitution && (
                    <Link href="/institutions" className="block text-center text-[11px] text-teal-400 hover:underline mt-2">
                      <GraduationCap className="w-3 h-3 inline mr-1" /> Institution Details →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="font-bricolage text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              { q: "What is the Single Export (₹99) pass?", a: "It allows you to export 1 resume to high-precision vector PDF & DOCX. It does not include AI Rewriter or ATS Score tools." },
              { q: "Which plans include AI Rewriter and ATS features?", a: "Pro (₹399/mo), Business (₹999/mo), and Institution (₹4,999/mo) plans include full access to ALL AI writing, ATS scoring, and cover letter features." },
              { q: "What is the Institution Plan (₹4,999/mo)?", a: "Designed for Colleges, Universities & Placement Officers. Includes 300 student resume exports every month with placement cell tracking." },
              { q: "Can I cancel anytime?", a: "Yes! Cancel anytime in your dashboard. Your plan stays active until the end of the billing period." },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl bg-[#141414] border border-[#2E2E2E] p-4">
                <summary className="cursor-pointer text-sm font-semibold text-white flex items-center justify-between">
                  {faq.q}
                  <span className="text-[#FF6200] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs text-[#888898] leading-relaxed mt-2.5">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />

      {selectedPlan && (
        <PaymentDialog
          plan={selectedPlan}
          open={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onPaymentSuccess={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}
