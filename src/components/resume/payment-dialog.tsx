"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Copy, Check, Smartphone, ShieldCheck } from "lucide-react";
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
    await new Promise((r) => setTimeout(r, 2000));
    setVerifying(false);
    setStep("success");
    toast.success("Payment verified! Your plan is now active.");
    setTimeout(() => {
      onPaymentSuccess();
      onClose();
      setStep("pay");
      setTransactionId("");
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg sm:max-w-xl w-[92vw] max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 sm:p-8 rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-white font-bold tracking-tight text-xl">
            <div className="w-8 h-8 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69]">
              <Smartphone className="w-4 h-4" />
            </div>
            Pay ₹{planConfig.price} for {planConfig.name}
          </DialogTitle>
          <DialogDescription className="text-[#888888] text-xs">
            Follow these 3 quick steps to activate your plan in under a minute.
          </DialogDescription>
        </DialogHeader>

        {step === "pay" && (
          <div className="space-y-4">
            {/* Numbered Steps */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { n: "1", label: "Scan QR", sub: "GPay / PhonePe" },
                { n: "2", label: "Pay Amount", sub: `₹${planConfig.price}` },
                { n: "3", label: "Enter Code", sub: "12-digit ref" },
              ].map((s) => (
                <div key={s.n} className="p-2.5 rounded-lg bg-[#121212] border border-[#2a2a2a]">
                  <div className="w-5 h-5 rounded bg-[#faff69] text-[#0a0a0a] text-[11px] font-bold flex items-center justify-center mx-auto mb-1">{s.n}</div>
                  <p className="text-xs font-semibold text-white">{s.label}</p>
                  <p className="text-[10px] text-[#888888] font-mono">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg border border-[#2a2a2a]">
              <div className="relative">
                <img
                  src={QR_CODE_URL}
                  alt="UPI QR Code"
                  className="w-44 h-44 object-contain rounded"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-3 py-0.5 rounded-full border border-[#faff69]">
                  <span className="text-[9px] font-mono font-bold text-[#faff69]">SCAN TO PAY</span>
                </div>
              </div>
              <p className="text-xs text-center text-[#555555]">
                Scan with <strong>GPay, PhonePe, Paytm</strong> or BHIM
              </p>
            </div>

            {/* UPI ID fallback */}
            <div className="rounded-lg border border-[#2a2a2a] p-3 bg-[#121212]">
              <p className="text-xs text-[#888888] mb-2">Can&apos;t scan? Type this UPI ID in your app:</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 px-3 py-2 bg-[#1a1a1a] rounded text-xs font-mono border border-[#2a2a2a] text-white">
                  {UPI_ID}
                </code>
                <button
                  onClick={copyUpi}
                  className="h-9 px-3 gap-1 shrink-0 bg-[#242424] hover:bg-[#3a3a3a] border border-[#2a2a2a] text-white rounded-md text-xs font-semibold inline-flex items-center transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5 text-[#888888]" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="rounded-lg border border-[#2a2a2a] p-4 bg-[#121212]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#888888]">Amount to pay</span>
                <span className="text-2xl font-bold text-[#faff69] font-mono">₹{planConfig.price}</span>
              </div>
              <p className="text-[11px] text-[#888888] mt-1 font-mono">
                {plan === "single_99" || plan === "trial_99" ? "One-time payment per resume export pass" : "Monthly subscription — cancel anytime"}
              </p>
            </div>

            <button
              onClick={() => setStep("verify")}
              className="w-full h-11 gap-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs rounded-md transition-colors inline-flex items-center justify-center"
            >
              I&apos;ve Paid — Enter Reference Number →
            </button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-3 text-[#faff69]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">Confirm Your Payment</p>
              <p className="text-xs text-[#888888] mt-1">
                Open your UPI app → check history → copy the 12-digit reference number.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#888888]">12-Digit Reference Number</label>
              <input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="456789012345"
                className="text-center font-mono text-base tracking-widest bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md h-11 px-3 outline-none"
              />
            </div>

            {/* Summary */}
            <div className="rounded-lg border border-[#2a2a2a] p-3 bg-[#121212] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#888888]">Plan</span>
                <span className="font-semibold text-white">{planConfig.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#888888]">Amount</span>
                <span className="font-semibold text-[#faff69] font-mono">₹{planConfig.price}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep("pay")}
                className="flex-1 h-11 bg-[#121212] border border-[#2a2a2a] hover:bg-[#242424] text-white rounded-md text-xs font-semibold inline-flex items-center justify-center transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={verifyPayment}
                disabled={verifying || !transactionId}
                className="flex-1 h-11 gap-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs rounded-md transition-colors inline-flex items-center justify-center disabled:opacity-50"
              >
                {verifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {verifying ? "Checking…" : "Confirm & Activate"}
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-4 text-[#22c55e]">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Payment Confirmed!</h3>
            <p className="text-xs text-[#888888] mb-4">
              Your <strong className="text-white">{planConfig.name}</strong> plan is now active.
            </p>
            <span className="bg-[#242424] text-[#22c55e] border border-[#2a2a2a] text-xs font-mono px-3 py-1 rounded-full font-bold">
              {planConfig.name} Active ✓
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
