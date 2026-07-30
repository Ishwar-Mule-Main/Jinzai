"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Check, QrCode, Smartphone, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PLAN_LIMITS, type PlanId } from "@/lib/resume/plans";

const UPI_ID = "domainexpansion@okaxis";
const QR_CODE_URL = "/upi-qr-code.jpeg";

export function PaymentDialog({
  plan,
  open,
  onClose,
  onPaymentSuccess,
}: {
  plan: PlanId;
  open: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}) {
  const planConfig = PLAN_LIMITS[plan];
  const [step, setStep] = useState<"pay" | "verify" | "success">("pay");
  const [transactionId, setTransactionId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const verifyPayment = async () => {
    if (!transactionId || transactionId.trim().length < 8) {
      toast.error("Please enter a valid transaction ID (min 8 characters)");
      return;
    }
    setVerifying(true);
    // Simulate verification — in production, verify with payment gateway API
    await new Promise((r) => setTimeout(r, 2000));
    setVerifying(false);
    setStep("success");
    toast.success("Payment verified! Your plan is now active.");
    setTimeout(() => {
      onPaymentSuccess();
      onClose();
      // Reset for next time
      setStep("pay");
      setTransactionId("");
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-teal-600" />
            Pay ₹{planConfig.price} for {planConfig.name}
          </DialogTitle>
          <DialogDescription>
            Complete payment via UPI to activate your {planConfig.name} plan.
          </DialogDescription>
        </DialogHeader>

        {step === "pay" && (
          <div className="space-y-4">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl border">
              <div className="relative">
                <img
                  src={QR_CODE_URL}
                  alt="UPI QR Code"
                  className="w-48 h-48 object-contain rounded-lg"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full border">
                  <span className="text-[9px] font-medium text-muted-foreground">Scan to Pay</span>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Scan this QR code with any UPI app (GPay, PhonePe, Paytm, BHIM)
              </p>
            </div>

            {/* UPI ID */}
            <div className="rounded-xl border p-3 bg-muted/30">
              <Label className="text-xs text-muted-foreground">Or pay via UPI ID</Label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 px-3 py-2 bg-white rounded-md text-sm font-mono border">{UPI_ID}</code>
                <Button size="sm" variant="outline" onClick={copyUpi} className="gap-1 shrink-0">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>

            {/* Amount */}
            <div className="rounded-xl border p-3 bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Amount to pay</span>
                <span className="text-2xl font-bold text-teal-700 dark:text-teal-300">₹{planConfig.price}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {plan === "trial_99" ? "One-time payment for 2-day trial" : "Monthly subscription"}
              </p>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 dark:text-amber-200">
                After payment, you'll receive a transaction ID in your UPI app. Enter it below to verify and activate your plan.
              </p>
            </div>

            <Button onClick={() => setStep("verify")} className="w-full gap-1.5 bg-[#111111] text-white hover:bg-[#000000]">
              I've Paid — Enter Transaction ID
            </Button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-sm font-medium">Verify your payment</p>
              <p className="text-xs text-muted-foreground mt-1">Enter the transaction ID from your UPI app</p>
            </div>

            <div>
              <Label className="text-xs">Transaction ID / UTR Number</Label>
              <Input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g., 456789012345"
                className="mt-1 font-mono"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Find this in your UPI app's payment receipt or transaction history
              </p>
            </div>

            <div className="rounded-lg border p-3 bg-muted/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">{planConfig.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">₹{planConfig.price}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">UPI ID</span>
                <span className="font-mono">{UPI_ID}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("pay")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={verifyPayment}
                disabled={verifying || !transactionId}
                className="flex-1 gap-1.5 bg-[#111111] text-white hover:bg-[#000000]"
              >
                {verifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {verifying ? "Verifying..." : "Verify & Activate"}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-1">Payment Successful!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your {planConfig.name} plan is now active. You can now access all premium features.
            </p>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300 border-0">
              {planConfig.name} Plan Active
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
