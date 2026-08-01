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
import { Check, Crown, Zap, Rocket, Loader2, CreditCard, CheckCircle2, Smartphone } from "lucide-react";
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
}: {
  currentPlan: string;
  onSubscribed?: () => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<PlanId | null>(null);

  const handlePaymentSuccess = async (plan: PlanId) => {
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`${PLAN_LIMITS[plan].name} plan activated!`);
      onSubscribed?.();
      setPaymentPlan(null);
    } catch {
      toast.error("Failed to activate plan. Please contact support.");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button size="sm" className="gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-full shadow-lg shadow-[#FF6200]/20 transition-all duration-300">
              <Crown className="w-3.5 h-3.5" /> Upgrade
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0D0D0D] border border-[#2E2E2E] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3 font-semibold text-white">
              <div className="w-9 h-9 rounded-lg bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#FF6200]" />
              </div>
              Choose your plan
            </DialogTitle>
            <DialogDescription className="text-[#888898]">
              Pay easily using any UPI app — GPay, PhonePe, Paytm, or BHIM. Your plan starts the moment your payment is confirmed.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {PAID_PLANS.map((planId) => {
              const plan = PLAN_LIMITS[planId];
              const Icon = PLAN_ICONS[planId];
              const isCurrent = currentPlan === planId;

              return (
                <div
                  key={planId}
                  className={`relative rounded-xl border-2 p-5 flex flex-col transition-all duration-300 ${
                    plan.highlight
                      ? "border-[#FF6200] shadow-lg shadow-[#FF6200]/10 bg-[#FF6200]/5"
                      : "border-[#2E2E2E] bg-[#141414]"
                  } ${isCurrent ? "ring-2 ring-[#FF6200]/30" : ""}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge
                        className={`shadow-sm border-0 text-white font-semibold text-[11px] px-3 ${
                          plan.highlight ? "bg-[#FF6200]" : "bg-[#1A1A1A] border border-[#2E2E2E] text-[#888898]"
                        }`}
                      >
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      plan.highlight ? "bg-[#FF6200]/15 border border-[#FF6200]/30" : "bg-[#222222] border border-[#2E2E2E]"
                    }`}>
                      <Icon className={`w-5 h-5 ${plan.highlight ? "text-[#FF6200]" : "text-[#888898]"}`} />
                    </div>
                    <div>
                      <p className="font-bold text-base text-white">{plan.name}</p>
                      <p className="text-[11px] text-[#888898]">{plan.period}</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <span className={`text-3xl font-bold ${plan.highlight ? "text-[#FF6200]" : "text-white"}`}>
                      ₹{plan.price}
                    </span>
                    {plan.period !== "2 days" && (
                      <span className="text-sm text-[#888898] ml-1">{plan.period}</span>
                    )}
                  </div>

                  <ul className="space-y-2 mb-5 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.highlight ? "text-[#FF6200]" : "text-[#22C55E]"}`} />
                        <span className="text-[#888898]">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <div className="rounded-full bg-[#FF6200]/10 border border-[#FF6200]/30 text-[#FF6200] text-center py-2 text-sm font-semibold flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" /> ✓ Your current plan
                    </div>
                  ) : (
                    <Button
                      onClick={() => setPaymentPlan(planId)}
                      className={`w-full h-10 gap-1.5 rounded-full font-semibold transition-all duration-300 ${
                        plan.highlight
                          ? "bg-[#FF6200] hover:bg-[#E55700] text-white shadow-lg shadow-[#FF6200]/20 hover:shadow-[#FF6200]/40"
                          : "bg-transparent border border-[#2E2E2E] hover:border-[#FF6200] text-white hover:bg-[#1A1A1A]"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" /> Get {plan.name} — ₹{plan.price}
                    </Button>
                  )}

                  <p className="text-[10px] text-[#5A5A6A] text-center mt-2">
                    {planId === "trial_99" ? "2-day access, one-time payment" : "Billed monthly, cancel anytime"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Payment info banner */}
          <div className="rounded-xl border border-[#2E2E2E] p-4 bg-[#141414] mt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md bg-[#FF6200]/10 border border-[#FF6200]/20 flex items-center justify-center">
                <Smartphone className="w-3.5 h-3.5 text-[#FF6200]" />
              </div>
              <p className="text-xs font-semibold text-white">How to pay: Just use any UPI app</p>
            </div>
            <p className="text-sm text-[#888898]">
              Open GPay, PhonePe, Paytm, or BHIM → scan the QR code → enter the amount → pay.
              Once paid, copy the 12-digit reference number from your app and enter it to activate your plan.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment dialog */}
      {paymentPlan && (
        <PaymentDialog
          plan={paymentPlan}
          open={!!paymentPlan}
          onClose={() => setPaymentPlan(null)}
          onPaymentSuccess={() => {
            handlePaymentSuccess(paymentPlan);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
