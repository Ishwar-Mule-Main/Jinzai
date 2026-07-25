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
import { Check, Crown, Zap, Rocket, Loader2, CreditCard, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PLAN_LIMITS, PAID_PLANS, type PlanId } from "@/lib/resume/plans";

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
  const [subscribing, setSubscribing] = useState<PlanId | null>(null);

  const subscribe = async (plan: PlanId) => {
    setSubscribing(plan);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Subscribed to ${PLAN_LIMITS[plan].name} plan!`);
      onSubscribed?.();
      setOpen(false);
    } catch {
      toast.error("Subscription failed");
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
            <Crown className="w-3.5 h-3.5" /> Upgrade
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-teal-600" /> Choose your plan
          </DialogTitle>
          <DialogDescription>
            Start free, upgrade when you're ready. All plans include access to all 52 templates.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {PAID_PLANS.map((planId) => {
            const plan = PLAN_LIMITS[planId];
            const Icon = PLAN_ICONS[planId];
            const isCurrent = currentPlan === planId;
            const isHigher = PLAN_LIMITS[currentPlan as PlanId]?.price > plan.price;

            return (
              <div
                key={planId}
                className={`relative rounded-2xl border-2 p-5 flex flex-col ${
                  plan.highlight ? "border-teal-500 ring-2 ring-teal-500/20" : "border-border"
                } ${isCurrent ? "bg-teal-50/50 dark:bg-teal-950/20" : ""}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className={`shadow-sm ${plan.highlight ? "bg-teal-600" : "bg-slate-700"} text-white border-0`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.highlight ? "bg-teal-100 dark:bg-teal-950/40" : "bg-muted"
                  }`}>
                    <Icon className={`w-5 h-5 ${plan.highlight ? "text-teal-600 dark:text-teal-400" : "text-foreground"}`} />
                  </div>
                  <div>
                    <p className="font-bold text-base">{plan.name}</p>
                    <p className="text-[11px] text-muted-foreground">{plan.period}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.priceLabel}</span>
                  {plan.period !== "2 days" && <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>}
                </div>

                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="rounded-lg bg-teal-600 text-white text-center py-2 text-sm font-medium flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" /> Current plan
                  </div>
                ) : (
                  <Button
                    onClick={() => subscribe(planId)}
                    disabled={subscribing === planId}
                    className={`w-full gap-1.5 ${
                      plan.highlight
                        ? "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                        : ""
                    }`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {subscribing === planId ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Crown className="w-3.5 h-3.5" />
                    )}
                    {subscribing === planId ? "Processing..." : `Get ${plan.name}`}
                  </Button>
                )}

                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  {planId === "trial_99" ? "2-day access, one-time payment" : "Billed monthly, cancel anytime"}
                </p>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border p-4 bg-muted/30 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs font-semibold">Free plan included</p>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Browse all 52 templates and create 1 resume for free. Upgrade to export your resume and unlock more.
          </p>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Demo mode: clicking "Get" instantly activates the plan (no real payment). All prices in INR (₹).
        </p>
      </DialogContent>
    </Dialog>
  );
}
