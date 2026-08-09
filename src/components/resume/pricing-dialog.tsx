"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Rocket, CheckCircle2, Smartphone, Building2, Sparkles, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PLAN_LIMITS, PAID_PLANS, type PlanId } from "@/lib/resume/plans";
import { PaymentDialog } from "./payment-dialog";

const PLAN_ICONS: Record<PlanId, typeof Crown> = {
  free: Rocket,
  single_99: Zap,
  pro_399: Crown,
  business_999: Rocket,
  institution_4999: Building2,
  trial_99: Zap,
  pro_499: Crown,
  business_1999: Rocket,
};

export function PricingDialog({
  currentPlan,
  onSubscribed,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  currentPlan: string;
  onSubscribed?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<PlanId | null>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? (setControlledOpen || (() => {})) : setInternalOpen;

  const handlePaymentSuccess = async (plan: PlanId) => {
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`${PLAN_LIMITS[plan].name} activated successfully! You can now download PDFs.`);
      onSubscribed?.();
      setPaymentPlan(null);
      setIsOpen(false);
    } catch {
      toast.error("Failed to activate plan. Please contact support.");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="max-w-6xl w-[96vw] max-h-[92vh] overflow-y-auto bg-[#141414] border border-[#2E2E2E] text-white p-6 sm:p-8 lg:p-10">
          <DialogHeader className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center mx-auto mb-1">
              <Crown className="w-6 h-6 text-[#FF6200]" />
            </div>
            <DialogTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Unlock Unlimited Resumes &amp; Vector PDF Exports
            </DialogTitle>
            <DialogDescription className="text-[#888898] text-xs sm:text-sm max-w-xl mx-auto">
              Choose the plan that fits your goals — from single export passes to Pro, Business, and Institution plans. Instant UPI activation.
            </DialogDescription>
          </DialogHeader>

          {/* Pricing cards grid — 4 Plans */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {PAID_PLANS.map((planId) => {
              const config = PLAN_LIMITS[planId];
              const Icon = PLAN_ICONS[planId] || Crown;
              const isCurrent = currentPlan === planId || (currentPlan === "trial_99" && planId === "single_99") || (currentPlan === "pro_499" && planId === "pro_399");
              const isPopular = planId === "pro_399";
              const isInstitution = planId === "institution_4999";

              return (
                <div
                  key={planId}
                  className={`relative p-5 sm:p-6 rounded-2xl bg-[#1A1A1A] border transition-all duration-300 flex flex-col justify-between ${
                    isPopular
                      ? "border-[#FF6200] shadow-xl shadow-[#FF6200]/15 ring-1 ring-[#FF6200]"
                      : isInstitution
                      ? "border-teal-500/60 shadow-xl shadow-teal-500/10"
                      : "border-[#2E2E2E] hover:border-[#FF6200]/40"
                  }`}
                >
                  {config.badge && (
                    <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-0.5 border-0 ${
                      isPopular ? "bg-[#FF6200]" : isInstitution ? "bg-teal-600" : "bg-[#333333]"
                    }`}>
                      {config.badge}
                    </Badge>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isInstitution ? "bg-teal-500/10 text-teal-400" : "bg-[#FF6200]/10 text-[#FF6200]"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-white truncate">{config.name}</h3>
                        <p className="text-[10px] text-[#888898] truncate">{config.period}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-[#2E2E2E]">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white">₹{config.price}</span>
                      <span className="text-[11px] text-[#888898] ml-1">/ {config.period}</span>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2 mb-6 text-[11px] text-[#888898]">
                      {config.features.map((feat) => {
                        const isNegative = feat.startsWith("❌");
                        return (
                          <li key={feat} className={`flex items-start gap-1.5 ${isNegative ? "text-[#888898]/70" : "text-[#CCCCCC]"}`}>
                            {isNegative ? (
                              <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-[#FF6200] shrink-0 mt-0.5" />
                            )}
                            <span className="leading-tight">{feat}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => {
                      if (isCurrent) return;
                      setPaymentPlan(planId);
                    }}
                    disabled={isCurrent}
                    className={`w-full h-10 font-semibold rounded-full gap-1.5 text-xs transition-all duration-300 ${
                      isCurrent
                        ? "bg-[#2E2E2E] text-[#888898] cursor-default"
                        : isPopular
                        ? "bg-[#FF6200] hover:bg-[#E55700] text-white shadow-lg shadow-[#FF6200]/20"
                        : isInstitution
                        ? "bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20"
                        : "bg-transparent border border-[#2E2E2E] hover:border-[#FF6200] text-white hover:bg-[#222222]"
                    }`}
                  >
                    {isCurrent ? (
                      "Your Active Plan"
                    ) : (
                      <>
                        <Smartphone className="w-3.5 h-3.5" />
                        Pay ₹{config.price} via UPI
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-black/40 border border-[#2E2E2E] text-center space-y-1">
            <p className="text-xs font-semibold text-white">⚡ Instant UPI Activation for All Plans</p>
            <p className="text-[11px] text-[#888898]">
              Scan QR code or use UPI ID <strong className="text-[#FF6200]">domainexpansion@okaxis</strong> with GPay, PhonePe, Paytm, or BHIM. Enter reference number for instant upgrade.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* UPI Payment Flow Modal */}
      {paymentPlan && (
        <PaymentDialog
          plan={paymentPlan}
          open={!!paymentPlan}
          onClose={() => setPaymentPlan(null)}
          onPaymentSuccess={() => handlePaymentSuccess(paymentPlan)}
        />
      )}
    </>
  );
}
