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
import { Check, Crown, Zap, Rocket, Smartphone, Building2, XCircle } from "lucide-react";
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
        <DialogContent className="max-w-6xl w-[96vw] max-h-[92vh] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 sm:p-8 lg:p-10 rounded-xl selection:bg-[#faff69] selection:text-[#0a0a0a]">
          <DialogHeader className="text-center space-y-2">
            <div className="w-10 h-10 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-1 text-[#faff69]">
              <Crown className="w-5 h-5" />
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Unlock Unlimited Resumes &amp; Vector PDF Exports
            </DialogTitle>
            <DialogDescription className="text-[#888888] text-xs sm:text-sm max-w-xl mx-auto">
              Choose the tier that matches your career goals — single export passes, Pro, Business, or Institution plans. Instant UPI activation.
            </DialogDescription>
          </DialogHeader>

          {/* Pricing cards grid */}
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
                  className={`relative p-5 sm:p-6 rounded-xl bg-[#121212] border transition-all flex flex-col justify-between ${
                    isPopular
                      ? "border-[#faff69] bg-[#1a1a1a]"
                      : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                  }`}
                >
                  {config.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#faff69] text-[#0a0a0a] text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {config.badge}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-white truncate">{config.name}</h3>
                        <p className="text-[10px] text-[#888888] font-mono truncate">{config.period}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-[#2a2a2a]">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">₹{config.price}</span>
                      <span className="text-[11px] text-[#888888] ml-1 font-mono">/ {config.period}</span>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2 mb-6 text-[11px] text-[#888888]">
                      {config.features.map((feat) => {
                        const isNegative = feat.startsWith("❌");
                        return (
                          <li key={feat} className={`flex items-start gap-1.5 ${isNegative ? "text-[#888888]/60" : "text-[#cccccc]"}`}>
                            {isNegative ? (
                              <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-[#faff69] shrink-0 mt-0.5" />
                            )}
                            <span className="leading-tight">{feat}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      if (isCurrent) return;
                      setPaymentPlan(planId);
                    }}
                    disabled={isCurrent}
                    className={`w-full h-10 font-semibold rounded-md gap-1.5 text-xs transition-colors inline-flex items-center justify-center ${
                      isCurrent
                        ? "bg-[#242424] text-[#888888] cursor-default"
                        : isPopular
                        ? "bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a]"
                        : "bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] text-white"
                    }`}
                  >
                    {isCurrent ? (
                      "Active Plan"
                    ) : (
                      <>
                        <Smartphone className="w-3.5 h-3.5" />
                        Pay ₹{config.price} via UPI
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[#121212] border border-[#2a2a2a] text-center space-y-1">
            <p className="text-xs font-semibold text-white">⚡ Instant UPI Activation for All Plans</p>
            <p className="text-[11px] text-[#888888] font-mono">
              Scan QR code or use UPI ID <strong className="text-[#faff69]">domainexpansion@okaxis</strong> with GPay, PhonePe, Paytm, or BHIM. Enter reference number for instant upgrade.
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
