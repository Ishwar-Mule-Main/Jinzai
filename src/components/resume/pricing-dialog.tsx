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
import { Check, Crown, Zap, Rocket, CheckCircle2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { PLAN_LIMITS, PAID_PLANS, type PlanId } from "@/lib/resume/plans";
import { PaymentDialog } from "./payment-dialog";

const PLAN_ICONS: Record<PlanId, typeof Crown> = {
  free: Rocket,
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
      toast.success(`${PLAN_LIMITS[plan].name} plan activated successfully! You can now download PDFs.`);
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#141414] border border-[#2E2E2E] text-white p-6 sm:p-8">
          <DialogHeader className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center mx-auto mb-1">
              <Crown className="w-6 h-6 text-[#FF6200]" />
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-white">
              Unlock Unlimited Resumes &amp; Direct PDF Export
            </DialogTitle>
            <DialogDescription className="text-[#888898] text-sm max-w-md mx-auto">
              Choose the plan that fits your career goals. Instant UPI activation with 100% ATS-friendly PDF downloads.
            </DialogDescription>
          </DialogHeader>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {PAID_PLANS.map((planId) => {
              const config = PLAN_LIMITS[planId];
              const Icon = PLAN_ICONS[planId];
              const isCurrent = currentPlan === planId;
              const isPopular = planId === "pro_499";

              return (
                <div
                  key={planId}
                  className={`relative p-6 rounded-2xl bg-[#1A1A1A] border transition-all duration-300 flex flex-col justify-between ${
                    isPopular
                      ? "border-[#FF6200] shadow-xl shadow-[#FF6200]/10 ring-1 ring-[#FF6200]"
                      : "border-[#2E2E2E] hover:border-[#FF6200]/40"
                  }`}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6200] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5">
                      Most Popular
                    </Badge>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FF6200]/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#FF6200]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">{config.name}</h3>
                        <p className="text-[11px] text-[#888898]">
                          {config.durationDays ? `${config.durationDays}-day access` : "Monthly subscription"}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-5 pb-4 border-b border-[#2E2E2E]">
                      <span className="text-3xl font-extrabold text-white">₹{config.price}</span>
                      <span className="text-xs text-[#888898] ml-1">
                        / {config.durationDays ? `${config.durationDays} days` : "month"}
                      </span>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2.5 mb-6 text-xs text-[#888898]">
                      {config.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-[#CCCCCC]">
                          <Check className="w-4 h-4 text-[#FF6200] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                      <li className="flex items-start gap-2 text-white font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                        <span>Direct High-Precision PDF Download</span>
                      </li>
                      <li className="flex items-start gap-2 text-white font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                        <span>Instant UPI Payment &amp; Activation</span>
                      </li>
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => {
                      if (isCurrent) return;
                      setPaymentPlan(planId);
                    }}
                    disabled={isCurrent}
                    className={`w-full h-11 font-semibold rounded-full gap-2 transition-all duration-300 ${
                      isCurrent
                        ? "bg-[#2E2E2E] text-[#888898] cursor-default"
                        : isPopular
                        ? "bg-[#FF6200] hover:bg-[#E55700] text-white shadow-lg shadow-[#FF6200]/20"
                        : "bg-transparent border border-[#2E2E2E] hover:border-[#FF6200] text-white hover:bg-[#222222]"
                    }`}
                  >
                    {isCurrent ? (
                      "Your Current Plan"
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        Pay ₹{config.price} via UPI
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-black/40 border border-[#2E2E2E] text-center space-y-1">
            <p className="text-xs font-semibold text-white">⚡ Instant UPI Activation</p>
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
