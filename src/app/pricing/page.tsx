"use client";

import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";
import { PLAN_LIMITS, PAID_PLANS, type PlanId } from "@/lib/resume/plans";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      <PublicNav />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full relative">
        <div className="text-center mb-12">
          <p className="text-xs font-mono text-[#FF6200] mb-2 uppercase tracking-widest">Simple, transparent pricing</p>
          <h1 className="font-bricolage text-4xl sm:text-6xl font-bold tracking-tight text-white mb-3">
            Choose your <span className="text-gradient-orange">plan</span>
          </h1>
          <p className="text-[#888898] max-w-xl mx-auto text-sm sm:text-base">
            Start free. Upgrade when you're ready to export high-conversion resumes. Cancel anytime.
          </p>
        </div>

        {/* Free plan */}
        <div className="mb-8">
          <div className="bg-[#141414] rounded-2xl border border-[#2E2E2E] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bricolage font-bold text-xl text-white">Free Plan</h2>
              <p className="text-xs text-[#888898] mt-1">Browse all 72 templates, create 1 resume, interactive preview included.</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-3xl font-bold font-mono text-white">₹0</p>
              <p className="text-[10px] text-[#888898] font-mono">Forever Free</p>
            </div>
          </div>
        </div>

        {/* Paid plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PAID_PLANS.map((planId) => {
            const plan = PLAN_LIMITS[planId];
            const isFeatured = plan.highlight;
            return (
              <div
                key={planId}
                className={`rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                  isFeatured
                    ? "bg-[#1A1A1A] border-2 border-[#FF6200] shadow-2xl shadow-[#FF6200]/10 relative"
                    : "bg-[#141414] border border-[#2E2E2E] hover:border-[#FF6200]/40"
                }`}
              >
                {plan.badge && (
                  <div className="mb-3">
                    <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      isFeatured ? "bg-[#FF6200] text-white" : "bg-[#1A1A1A] text-[#888898] border border-[#2E2E2E]"
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                <h2 className="font-bricolage font-bold text-2xl mb-1 text-white">{plan.name}</h2>
                <div className="mb-5">
                  <span className="text-3xl sm:text-4xl font-bold font-mono text-white">{plan.priceLabel}</span>
                  <span className="text-xs text-[#888898] ml-1 font-mono">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#888898]">
                      <Check className="w-4 h-4 shrink-0 text-[#FF6200] mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full gap-2 rounded-xl font-semibold ${
                    isFeatured
                      ? "bg-[#FF6200] hover:bg-[#E55700] text-white shadow-lg shadow-[#FF6200]/30"
                      : "bg-[#1A1A1A] text-white hover:bg-[#FF6200] border border-[#2E2E2E] hover:border-[#FF6200]"
                  }`}
                >
                  <Crown className="w-4 h-4" /> Get {plan.name}
                </Button>
                <p className="text-[10px] text-center mt-2.5 text-[#888898] font-mono">
                  {planId === "trial_99" ? "2-day full access, one-time payment" : "Billed monthly, cancel anytime"}
                </p>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="font-bricolage text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              { q: "Is there a free plan?", a: "Yes! Browse all 72 templates and create 1 resume for free. Upgrade to export." },
              { q: "Can I cancel anytime?", a: "Yes, cancel anytime. Your plan stays active until the end of the billing period." },
              { q: "What is the contact lock?", a: "On Trial and Pro plans, contact details are locked once added to prevent plan sharing. Business plan has no lock." },
              { q: "Do you offer refunds?", a: "Trial (₹99) is non-refundable. Monthly plans are refundable within 7 days if usage is minimal (under 3 exports)." },
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
    </div>
  );
}
