"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shows a one-time "Logged out successfully" popup when the user
 * arrives at the homepage after logging out.
 * The flag is set in sessionStorage by the LogoutButton before redirect.
 */
export function LogoutToast() {
  // Lazy initializer reads sessionStorage once on first client render (no effect needed)
  const [show, setShow] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem("jinzai-logged-out") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!show) return;
    // Clear the flag so the popup doesn't reappear on refresh
    try {
      sessionStorage.removeItem("jinzai-logged-out");
    } catch {
      // ignore storage errors
    }
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto"
        onClick={() => setShow(false)}
      />
      {/* Popup */}
      <div className="relative z-10 w-full max-w-sm pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-2xl bg-white shadow-2xl border border-emerald-200 overflow-hidden">
          {/* Header band */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5 text-center relative">
            <button
              onClick={() => setShow(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 ring-4 ring-white/30">
              <CheckCircle2 className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Logged Out Successfully</h2>
          </div>
          {/* Body */}
          <div className="px-6 py-5 text-center">
            <p className="text-sm text-slate-600 mb-1">
              You have been securely logged out of your Jinzai account.
            </p>
            <p className="text-xs text-slate-400 mb-5 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Your data is safe. Come back anytime to continue building your resume.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShow(false)}
                variant="outline"
                className="flex-1"
              >
                Stay on Homepage
              </Button>
              <Button
                onClick={() => {
                  setShow(false);
                  // Dispatch a custom event that the auth dialog listens for to open the login modal
                  window.dispatchEvent(new CustomEvent("jinzai:open-login"));
                }}
                className="flex-1 gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              >
                Log In Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
