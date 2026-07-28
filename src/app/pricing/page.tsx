"use client";

import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";
import { PLAN_LIMITS, PAID_PLANS, type PlanId } from "@/lib/resume/plans";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f5f1ec] flex flex-col">
      <PublicNav />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-[#626260] mb-2">Simple, transparent pricing</p>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#111111] mb-3" style={{ letterSpacing: "-1.4px" }}>
            Choose your plan
          </h1>
          <p className="text-[#626260] max-w-xl mx-auto text-base">
            Start free. Upgrade when you're ready to export. Cancel anytime.
          </p>
        </div>

        {/* Free plan */}
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-[#d3cec6]/60 p-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg text-[#111111]">Free</h2>
              <p className="text-sm text-[#626260]">Browse all 72 templates, create 1 resume, no export.</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-medium text-[#111111]">₹0</p>
              <p className="text-xs text-[#7b7b78]">forever</p>
            </div>
          </div>
        </div>

        {/* Paid plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PAID_PLANS.map((planId) => {
            const plan = PLAN_LIMITS[planId];
            const isFeatured = plan.highlight;
            return (
              <div
                key={planId}
                className={`rounded-xl p-6 ${
                  isFeatured
                    ? "bg-[#111111] text-white"
                    : "bg-white text-[#111111] border border-[#d3cec6]/60"
                }`}
              >
                {plan.badge && (
                  <div className="mb-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      isFeatured ? "bg-white/20 text-white" : "bg-[#ebe7e1] text-[#626260]"
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                <h2 className="font-semibold text-lg mb-1">{plan.name}</h2>
                <div className="mb-4">
                  <span className="text-3xl font-medium">{plan.priceLabel}</span>
                  <span className={`text-sm ${isFeatured ? "text-white/60" : "text-[#7b7b78]"}`}>{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isFeatured ? "text-white" : "text-[#111111]"}`} />
                      <span className={isFeatured ? "text-white/80" : "text-[#626260]"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full gap-1.5 rounded-md ${
                    isFeatured
                      ? "bg-white text-[#111111] hover:bg-white/90"
                      : "bg-[#111111] text-white hover:bg-[#000000]"
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" /> Get {plan.name}
                </Button>
                <p className={`text-[10px] text-center mt-2 ${isFeatured ? "text-white/40" : "text-[#7b7b78]"}`}>
                  {planId === "trial_99" ? "2-day access, one-time payment" : "Billed monthly, cancel anytime"}
                </p>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-medium text-[#111111] mb-4 text-center">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              { q: "Is there a free plan?", a: "Yes! Browse all 72 templates and create 1 resume for free. Upgrade to export." },
              { q: "Can I cancel anytime?", a: "Yes, cancel anytime. Your plan stays active until the end of the billing period." },
              { q: "What is the contact lock?", a: "On Trial and Pro plans, contact details are locked once added to prevent plan sharing. Business plan has no lock." },
              { q: "Do you offer refunds?", a: "Trial (₹99) is non-refundable. Monthly plans are refundable within 7 days if usage is minimal (under 3 exports)." },
            ].map((faq, i) => (
              <details key={i} className="group rounded-lg bg-white border border-[#d3cec6]/60 p-4">
                <summary className="cursor-pointer text-sm font-medium text-[#111111] flex items-center justify-between">
                  {faq.q}
                  <span className="text-[#9c9fa5] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs text-[#626260] leading-relaxed mt-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
