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
      <DialogContent className="max-w-md bg-[#141414] border border-[#2E2E2E] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-white font-semibold">
            <div className="w-8 h-8 rounded-lg bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-[#FF6200]" />
            </div>
            Pay ₹{planConfig.price} for {planConfig.name}
          </DialogTitle>
          <DialogDescription className="text-[#888898]">
            Complete payment via UPI to activate your {planConfig.name} plan.
          </DialogDescription>
        </DialogHeader>

        {step === "pay" && (
          <div className="space-y-4">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl border border-[#2E2E2E]">
              <div className="relative">
                <img
                  src={QR_CODE_URL}
                  alt="UPI QR Code"
                  className="w-48 h-48 object-contain rounded-lg"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF6200] px-3 py-0.5 rounded-full">
                  <span className="text-[9px] font-semibold text-white">Scan to Pay</span>
                </div>
              </div>
              <p className="text-xs text-center text-[#888898]">
                Scan this QR code with any UPI app (GPay, PhonePe, Paytm, BHIM)
              </p>
            </div>

            {/* UPI ID */}
            <div className="rounded-xl border border-[#2E2E2E] p-3 bg-[#1A1A1A]">
              <Label className="text-[11px] font-mono text-[#888898]">Or pay via UPI ID:</Label>
              <div className="flex items-center gap-2 mt-2">
                <code className="flex-1 px-3 py-2 bg-black/40 rounded-lg text-sm font-mono border border-[#2E2E2E] text-white">
                  {UPI_ID}
                </code>
                <Button
                  size="sm"
                  onClick={copyUpi}
                  className="gap-1 shrink-0 bg-transparent border border-[#2E2E2E] hover:border-[#FF6200] hover:bg-[#222222] text-white rounded-lg transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5 text-[#888898]" />}
                </Button>
              </div>
            </div>

            {/* Amount */}
            <div className="rounded-xl border border-[#FF6200]/30 p-4 bg-[#FF6200]/5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#888898]">Amount to pay</span>
                <span className="text-2xl font-bold text-[#FF6200]">₹{planConfig.price}</span>
              </div>
              <p className="text-[10px] text-[#5A5A6A] mt-1">
                {plan === "trial_99" ? "One-time payment for 2-day trial" : "Monthly subscription"}
              </p>
            </div>

            {/* Info notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E]">
              <AlertCircle className="w-3.5 h-3.5 text-[#FF8C42] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#888898]">
                After payment, you'll receive a transaction ID in your UPI app. Enter it below to verify and activate your plan.
              </p>
            </div>

            <Button
              onClick={() => setStep("verify")}
              className="w-full gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-full shadow-lg shadow-[#FF6200]/20 hover:shadow-[#FF6200]/40 transition-all duration-300"
            >
              I've Paid — Enter Transaction ID
            </Button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6 text-[#FF6200]" />
              </div>
              <p className="text-sm font-semibold text-white">Verify your payment</p>
              <p className="text-xs text-[#888898] mt-1">Enter the transaction ID from your UPI app</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-mono text-[#888898]">Transaction ID / UTR Number:</Label>
              <Input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g., 456789012345"
                className="mt-1 font-mono bg-black/40 border-[#2E2E2E] focus:border-[#FF6200] text-white placeholder:text-[#5A5A6A] rounded-lg"
              />
              <p className="text-[10px] text-[#5A5A6A]">
                Find this in your UPI app's payment receipt or transaction history
              </p>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-[#2E2E2E] p-3 bg-[#1A1A1A] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#888898]">Plan</span>
                <span className="font-semibold text-white">{planConfig.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#888898]">Amount</span>
                <span className="font-semibold text-[#FF6200]">₹{planConfig.price}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#888898]">UPI ID</span>
                <span className="font-mono text-white text-[11px]">{UPI_ID}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setStep("pay")}
                className="flex-1 bg-transparent border border-[#2E2E2E] hover:border-[#FF6200] text-white hover:bg-[#1A1A1A] rounded-full transition-all duration-300"
              >
                Back
              </Button>
              <Button
                onClick={verifyPayment}
                disabled={verifying || !transactionId}
                className="flex-1 gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-full shadow-lg shadow-[#FF6200]/20 hover:shadow-[#FF6200]/40 transition-all duration-300"
              >
                {verifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {verifying ? "Verifying..." : "Verify & Activate"}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[#22C55E]" />
            </div>
            <h3 className="text-lg font-bold mb-1 text-white">Payment Successful!</h3>
            <p className="text-sm text-[#888898] mb-4">
              Your {planConfig.name} plan is now active. You can now access all premium features.
            </p>
            <Badge className="bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 font-semibold">
              {planConfig.name} Plan Active
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
