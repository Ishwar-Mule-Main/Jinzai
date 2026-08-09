"use client";

import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Mail, Lock, Chrome, KeyRound, LogOut, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useResumeStore } from "@/lib/resume/store";

export type AuthMode = "login" | "signup" | null;

export function AuthDialog({
  mode: initialMode,
  onClose,
  onSuccess,
}: {
  mode: AuthMode;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [activeMode, setActiveMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "google" | "code">("password");

  // Signup OTP state
  const [signupStep, setSignupStep] = useState<"plan" | "details" | "otp">("plan");
  const [selectedPlan, setSelectedPlan] = useState<string>("pro_399");
  const [otpCode, setOtpCode] = useState("");

  const open = initialMode !== null;

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setName("");
    setOtpCode("");
    setSignupStep("plan");
    setSelectedPlan("pro_399");
    setLoginMethod("password");
  }, [open, activeMode, initialMode]);

  // ===== LOGIN: Password =====
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Enter your email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Invalid credentials. If you registered via Google or Email Code, click the Google or Email Code tab above!");
      } else {
        await new Promise((r) => setTimeout(r, 500));
        toast.success("Signed in successfully!");
        onSuccess?.();
        onClose();
      }
    } catch {
      toast.error("Login failed — please try again");
    } finally {
      setLoading(false);
    }
  };

  // ===== LOGIN/SIGNUP: Google =====
  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/", redirect: true });
  };

  // ===== LOGIN: Email OTP =====
  const [loginOtpSent, setLoginOtpSent] = useState(false);

  const sendLoginOtp = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Enter your email first");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setLoginOtpSent(true);
      toast.success(`Verification code sent to ${email}`);
    } catch {
      toast.error("Could not send code");
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginOtp = async () => {
    if (!email || !otpCode) {
      toast.error("Enter the code from your email");
      return;
    }
    setLoading(true);
    try {
      const res = await signIn("email-code", {
        email,
        code: otpCode,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Invalid or expired code");
      } else {
        await new Promise((r) => setTimeout(r, 500));
        toast.success("Signed in successfully!");
        onSuccess?.();
        onClose();
      }
    } catch {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== SIGNUP: Email + Password → OTP =====
  const handleSignupSubmit = async () => {
    if (!email || !password) {
      toast.error("Fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || email.split("@")[0] }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          toast.info("An account with this email already exists! Switching to Sign In...");
          setActiveMode("login");
          return;
        }
        throw new Error(json.error || "Signup failed");
      }
      setSignupStep("otp");
      toast.success(`Verification code sent to ${email}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerify = async () => {
    if (!otpCode) {
      toast.error("Enter the verification code");
      return;
    }
    setLoading(true);
    try {
      const res = await signIn("email-code", {
        email,
        code: otpCode,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Invalid or expired code");
      } else {
        await new Promise((r) => setTimeout(r, 500));
        toast.success("Account created successfully! Welcome to Jinzai.");
        onSuccess?.();
        onClose();
      }
    } catch {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md bg-[#141414] border border-[#2E2E2E] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-xl font-semibold text-white">
            <div className="w-8 h-8 rounded-lg bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#FF6200]" />
            </div>
            {activeMode === "signup" ? "Join free — it takes 30 seconds" : "Welcome back! Sign in to continue"}
          </DialogTitle>
          <DialogDescription className="text-[#888898] text-sm">
            {activeMode === "signup"
              ? "Create your free account to save and manage your resumes."
              : "Sign in to access your saved resumes."}
          </DialogDescription>
        </DialogHeader>

        {/* ===== LOGIN MODE ===== */}
        {activeMode === "login" && (
          <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as typeof loginMethod)}>
            <TabsList className="grid grid-cols-3 w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-1">
              <TabsTrigger
                value="google"
                className="text-xs gap-1 text-[#888898] data-[state=active]:bg-[#FF6200] data-[state=active]:text-white rounded-md transition-all"
              >
                <Chrome className="w-3.5 h-3.5" /> Google
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="text-xs gap-1 text-[#888898] data-[state=active]:bg-[#FF6200] data-[state=active]:text-white rounded-md transition-all"
              >
                <Lock className="w-3.5 h-3.5" /> Password
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="text-xs gap-1 text-[#888898] data-[state=active]:bg-[#FF6200] data-[state=active]:text-white rounded-md transition-all"
              >
                <KeyRound className="w-3.5 h-3.5" /> Email Code
              </TabsTrigger>
            </TabsList>

            {/* Google login */}
            <TabsContent value="google" className="space-y-3 mt-4">
              <div className="text-center py-3">
                <p className="text-sm text-[#888898] mb-4">
                  The easiest way to sign in — no password needed.
                </p>
                <Button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full gap-2 h-11 bg-[#1A1A1A] border border-[#2E2E2E] hover:border-[#FF6200]/50 text-white hover:bg-[#222222] transition-all rounded-full text-sm font-semibold"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4 text-[#FF6200]" />}
                  Continue with Google
                </Button>
              </div>
            </TabsContent>

            {/* Password login */}
            <TabsContent value="password" className="space-y-3 mt-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-[#888898]">Your email address</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="off"
                  placeholder="you@email.com"
                  className="bg-black/40 border-[#2E2E2E] focus:border-[#FF6200] text-white placeholder:text-[#5A5A6A] rounded-lg text-sm h-11"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-[#888898]">Your password</Label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-black/40 border-[#2E2E2E] focus:border-[#FF6200] text-white placeholder:text-[#5A5A6A] rounded-lg text-sm h-11"
                />
              </div>
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full h-11 gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-full shadow-lg shadow-[#FF6200]/20 hover:shadow-[#FF6200]/40 transition-all duration-300"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Sign In
              </Button>
            </TabsContent>

            {/* OTP login */}
            <TabsContent value="code" className="space-y-3 mt-4">
              <p className="text-sm text-[#888898]">We'll send a 6-digit code to your email — no password needed.</p>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-[#888898]">Your email address</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@email.com"
                  className="bg-black/40 border-[#2E2E2E] focus:border-[#FF6200] text-white placeholder:text-[#5A5A6A] rounded-lg text-sm h-11"
                />
              </div>
              {loginOtpSent && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-[#888898]">Enter the 6-digit code from your email</Label>
                  <Input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="e.g. 123456"
                    maxLength={6}
                    className="text-center text-lg tracking-[0.5em] font-mono bg-black/40 border-[#2E2E2E] focus:border-[#FF6200] text-white placeholder:text-[#5A5A6A] rounded-lg h-12"
                    onKeyDown={(e) => e.key === "Enter" && verifyLoginOtp()}
                  />
                </div>
              )}
              {!loginOtpSent ? (
                <Button
                  onClick={sendLoginOtp}
                  disabled={loading}
                  className="w-full h-11 gap-1.5 bg-transparent border border-[#2E2E2E] hover:border-[#FF6200] text-white hover:bg-[#1A1A1A] rounded-full transition-all duration-300"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 text-[#FF6200]" />}
                  Send me a code by email
                </Button>
              ) : (
                <Button
                  onClick={verifyLoginOtp}
                  disabled={loading}
                  className="w-full h-11 gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-full shadow-lg shadow-[#FF6200]/20 transition-all duration-300"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  Verify &amp; Sign In
                </Button>
              )}
            </TabsContent>

            <div className="pt-3 border-t border-[#2E2E2E] text-center">
              <button
                onClick={() => setActiveMode("signup")}
                className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors"
              >
                Don't have an account yet? <strong className="text-[#FF6200]">Sign up free →</strong>
              </button>
            </div>
          </Tabs>
        )}

        {/* ===== SIGNUP MODE ===== */}
        {activeMode === "signup" && (
          <div className="space-y-3">
            {signupStep === "plan" ? (
              <>
                <div className="text-center pb-2">
                  <p className="text-sm font-semibold text-white">Step 1 of 2: Select Your Plan</p>
                  <p className="text-xs text-[#888898] mt-0.5">Choose your starting plan. You can upgrade or change anytime.</p>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {[
                    { id: "free", name: "Free Plan", price: "₹0", sub: "1 Resume preview (No Export)" },
                    { id: "single_99", name: "Single Export Pass", price: "₹99", sub: "1 Resume PDF Export (No AI/ATS)" },
                    { id: "pro_399", name: "Pro Plan (Popular)", price: "₹399/mo", sub: "5 Resumes + ALL AI & ATS Features" },
                    { id: "business_999", name: "Business Plan", price: "₹999/mo", sub: "50 Resumes + ALL AI & ATS Features" },
                    { id: "institution_4999", name: "Institution Plan", price: "₹4,999/mo", sub: "300 Student Resumes + ALL Features" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlan(p.id)}
                      className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                        selectedPlan === p.id
                          ? "border-[#FF6200] bg-[#FF6200]/10 ring-1 ring-[#FF6200]"
                          : "border-[#2E2E2E] bg-[#1A1A1A] hover:border-[#FF6200]/40"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{p.name}</p>
                        <p className="text-[10px] text-[#888898] mt-0.5">{p.sub}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#FF6200] shrink-0 ml-2">{p.price}</span>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() => setSignupStep("details")}
                  className="w-full h-11 gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-full shadow-lg shadow-[#FF6200]/20 hover:shadow-[#FF6200]/40 transition-all duration-300 mt-2"
                >
                  Continue with Selected Plan →
                </Button>
              </>
            ) : signupStep === "details" ? (
              <>
                <div className="flex items-center justify-between text-xs text-[#888898] pb-1">
                  <span>Selected: <strong className="text-white">{selectedPlan}</strong></span>
                  <button onClick={() => setSignupStep("plan")} className="text-[#FF6200] hover:underline">Change plan</button>
                </div>
                {/* Google signup — top option */}
                <Button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full h-11 gap-2 bg-[#1A1A1A] border border-[#2E2E2E] hover:border-[#FF6200]/50 text-white hover:bg-[#222222] transition-all rounded-full font-semibold"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4 text-[#FF6200]" />}
                  Sign up with Google (Recommended)
                </Button>

                <div className="flex items-center gap-2 text-xs text-[#5A5A6A]">
                  <div className="flex-1 h-px bg-[#2E2E2E]" /> or sign up with email <div className="flex-1 h-px bg-[#2E2E2E]" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-[#888898]">Your name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="off"
                    placeholder="e.g. Rahul Sharma"
                    className="bg-black/40 border-[#2E2E2E] focus:border-[#FF6200] text-white placeholder:text-[#5A5A6A] rounded-lg text-sm h-11"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-[#888898]">Your email address</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="off"
                    placeholder="you@email.com"
                    className="bg-black/40 border-[#2E2E2E] focus:border-[#FF6200] text-white placeholder:text-[#5A5A6A] rounded-lg text-sm h-11"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-[#888898]">Create a password (at least 6 characters)</Label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Choose a password"
                    onKeyDown={(e) => e.key === "Enter" && handleSignupSubmit()}
                    className="bg-black/40 border-[#2E2E2E] focus:border-[#FF6200] text-white placeholder:text-[#5A5A6A] rounded-lg text-sm h-11"
                  />
                </div>
                <Button
                  onClick={handleSignupSubmit}
                  disabled={loading}
                  className="w-full h-11 gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-full shadow-lg shadow-[#FF6200]/20 hover:shadow-[#FF6200]/40 transition-all duration-300"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Send me a verification code
                </Button>
              </>
            ) : (
              <>
                <div className="text-center py-2">
                  <div className="w-14 h-14 rounded-full bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-[#FF6200]" />
                  </div>
                  <p className="text-sm font-semibold text-white">Check your email inbox</p>
                  <p className="text-sm text-[#888898] mt-1">
                    We sent a 6-digit code to <strong className="text-white">{email}</strong>
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-[#888898]">Enter the 6-digit code from your email</Label>
                  <Input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="e.g. 123456"
                    maxLength={6}
                    className="text-center text-xl tracking-[0.5em] font-mono bg-black/40 border-[#2E2E2E] focus:border-[#FF6200] text-white placeholder:text-[#5A5A6A] rounded-lg h-14"
                    onKeyDown={(e) => e.key === "Enter" && handleSignupVerify()}
                  />
                </div>
                <Button
                  onClick={handleSignupVerify}
                  disabled={loading}
                  className="w-full h-11 gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-full shadow-lg shadow-[#FF6200]/20 hover:shadow-[#FF6200]/40 transition-all duration-300"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Confirm &amp; Create My Account
                </Button>
              </>
            )}

            <div className="pt-3 border-t border-[#2E2E2E] text-center">
              <button
                onClick={() => setActiveMode("login")}
                className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors"
              >
                Already have an account? <strong className="text-[#FF6200]">Sign In →</strong>
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function LogoutButton({ onLogout }: { onLogout?: () => void }) {
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);

    try {
      sessionStorage.setItem("jinzai-logged-out", "1");
      localStorage.removeItem("resumeforge-store");
      localStorage.removeItem("admin-token");
      useResumeStore.getState().clearAll();
      useResumeStore.getState().setSavedId(null);
    } catch {
      // ignore
    }

    onLogout?.();

    try {
      document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch {}

    await signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loading} className="gap-1.5 hover:text-[#FF6200] transition-colors">
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6200]" /> : <LogOut className="w-3.5 h-3.5" />}
      <span className="hidden sm:inline">Log out</span>
    </Button>
  );
}
