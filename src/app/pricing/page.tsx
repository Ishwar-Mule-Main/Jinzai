"use client";

import { useState } from "react";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { Check, XCircle, Smartphone, GraduationCap } from "lucide-react";
import { PLAN_LIMITS, PAID_PLANS, type PlanId } from "@/lib/resume/plans";
import { PaymentDialog } from "@/components/resume/payment-dialog";
import Link from "next/link";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#faff69] px-3.5 py-1 rounded-full text-xs font-mono">
            PRICING TIERS
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Predictable Pricing for <span className="text-[#faff69]">Engineered Resumes</span>
          </h1>
          <p className="text-[#cccccc] max-w-xl mx-auto text-base">
            Start free. Upgrade when you are ready to export vector ATS resumes. Simple UPI checkout with instant activation.
          </p>
        </div>

        {/* Free plan banner */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">STARTER TIER</span>
              <h2 className="font-bold text-2xl text-white mt-1">Free Sandbox</h2>
              <p className="text-xs text-[#888888] mt-1">Browse all 78 templates, create 1 draft resume, interactive live preview.</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-4xl font-bold text-white font-mono">₹0</p>
              <p className="text-xs text-[#888888] font-mono">Forever Free</p>
            </div>
          </div>
        </div>

        {/* Paid plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PAID_PLANS.map((planId) => {
            const plan = PLAN_LIMITS[planId];
            const isFeatured = plan.highlight;

            return (
              <div
                key={planId}
                className={`rounded-xl p-8 flex flex-col justify-between transition-all duration-200 ${
                  isFeatured
                    ? "bg-[#faff69] text-[#0a0a0a] border border-[#faff69] shadow-xl"
                    : "bg-[#1a1a1a] text-white border border-[#2a2a2a] hover:border-[#3a3a3a]"
                }`}
              >
                <div>
                  {plan.badge && (
                    <div className="mb-3">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        isFeatured ? "bg-[#0a0a0a] text-[#faff69]" : "bg-[#242424] text-[#faff69] border border-[#2a2a2a]"
                      }`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  <h2 className={`font-bold text-xl mb-1 ${isFeatured ? "text-[#0a0a0a]" : "text-white"}`}>{plan.name}</h2>
                  <div className="mb-6">
                    <span className={`text-4xl font-bold font-mono ${isFeatured ? "text-[#0a0a0a]" : "text-white"}`}>{plan.priceLabel}</span>
                    <span className={`text-xs ml-1.5 ${isFeatured ? "text-[#2a2a2a]" : "text-[#888888]"}`}>/ {plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, i) => {
                      const isNegative = f.startsWith("❌");
                      return (
                        <li key={i} className={`flex items-start gap-2.5 text-xs ${isNegative ? "text-[#888888]" : isFeatured ? "text-[#1a1a1a]" : "text-[#cccccc]"}`}>
                          {isNegative ? (
                            <XCircle className="w-4 h-4 shrink-0 text-[#ef4444] mt-0.5" />
                          ) : (
                            <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isFeatured ? "text-[#0a0a0a]" : "text-[#faff69]"}`} />
                          )}
                          <span>{f}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => setSelectedPlan(planId)}
                    className={`w-full gap-2 rounded-md font-semibold h-11 text-xs transition-colors inline-flex items-center justify-center ${
                      isFeatured
                        ? "bg-[#0a0a0a] hover:bg-[#242424] text-white"
                        : "bg-[#242424] hover:bg-[#3a3a3a] text-white border border-[#2a2a2a]"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" /> Pay ₹{plan.price} via UPI
                  </button>
                  {planId === "institution_4999" && (
                    <Link href="/institutions" className="block text-center text-[11px] text-[#faff69] hover:underline mt-2.5 font-mono">
                      <GraduationCap className="w-3.5 h-3.5 inline mr-1" /> Placement Portal →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 border-t border-[#2a2a2a] pt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center tracking-tight">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              { q: "What is the Single Export (₹99) pass?", a: "It allows you to export 1 resume to high-precision vector PDF. It does not include AI Rewriter or ATS Score tools." },
              { q: "Which plans include AI Rewriter and ATS features?", a: "Pro (₹399/mo), Business (₹999/mo), and Institution (₹4,999/mo) plans include full access to ALL AI writing, ATS scoring, and cover letter features." },
              { q: "What is the Institution Plan (₹4,999/mo)?", a: "Designed for Colleges, Universities & Placement Officers. Includes 300 student resume exports every month with placement cell tracking." },
              { q: "Can I cancel anytime?", a: "Yes! Cancel anytime in your dashboard. Your plan stays active until the end of the billing period." },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-5">
                <summary className="cursor-pointer text-sm font-semibold text-white flex items-center justify-between">
                  {faq.q}
                  <span className="text-[#faff69] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs text-[#888888] leading-relaxed mt-3 pt-3 border-t border-[#2a2a2a]">{faq.a}</p>
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
