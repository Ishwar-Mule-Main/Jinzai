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
      <DialogContent className="max-w-md bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold text-white tracking-tight">
            <div className="w-8 h-8 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            {activeMode === "signup" ? "Join Jinzai Platform" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription className="text-[#888888] text-xs">
            {activeMode === "signup"
              ? "Create your account to save, customize, and export ATS resumes."
              : "Sign in to access your saved resume profiles."}
          </DialogDescription>
        </DialogHeader>

        {/* ===== LOGIN MODE ===== */}
        {activeMode === "login" && (
          <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as typeof loginMethod)}>
            <TabsList className="grid grid-cols-3 w-full bg-[#121212] border border-[#2a2a2a] rounded-md p-1">
              <TabsTrigger
                value="google"
                className="text-xs gap-1 text-[#888888] data-[state=active]:bg-[#faff69] data-[state=active]:text-[#0a0a0a] rounded-md transition-all font-semibold"
              >
                <Chrome className="w-3.5 h-3.5" /> Google
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="text-xs gap-1 text-[#888888] data-[state=active]:bg-[#faff69] data-[state=active]:text-[#0a0a0a] rounded-md transition-all font-semibold"
              >
                <Lock className="w-3.5 h-3.5" /> Password
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="text-xs gap-1 text-[#888888] data-[state=active]:bg-[#faff69] data-[state=active]:text-[#0a0a0a] rounded-md transition-all font-semibold"
              >
                <KeyRound className="w-3.5 h-3.5" /> Code
              </TabsTrigger>
            </TabsList>

            {/* Google login */}
            <TabsContent value="google" className="space-y-3 mt-4">
              <div className="text-center py-2">
                <p className="text-xs text-[#888888] mb-4">
                  Quick single sign-on with your Google account.
                </p>
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full gap-2 h-11 bg-[#242424] border border-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition-colors rounded-md text-xs font-semibold inline-flex items-center justify-center"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4 text-[#faff69]" />}
                  Continue with Google
                </button>
              </div>
            </TabsContent>

            {/* Password login */}
            <TabsContent value="password" className="space-y-3 mt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888888]">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="off"
                  placeholder="you@email.com"
                  className="bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md text-xs h-10 px-3 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888888]">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md text-xs h-10 px-3 outline-none"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full h-11 gap-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md transition-colors inline-flex items-center justify-center text-xs"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Sign In
              </button>
            </TabsContent>

            {/* OTP login */}
            <TabsContent value="code" className="space-y-3 mt-4">
              <p className="text-xs text-[#888888]">We&apos;ll dispatch a 6-digit verification code to your email.</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888888]">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@email.com"
                  className="bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md text-xs h-10 px-3 outline-none"
                />
              </div>
              {loginOtpSent && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#888888]">6-Digit Code</label>
                  <input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-lg tracking-[0.5em] font-mono bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md h-11 outline-none"
                    onKeyDown={(e) => e.key === "Enter" && verifyLoginOtp()}
                  />
                </div>
              )}
              {!loginOtpSent ? (
                <button
                  onClick={sendLoginOtp}
                  disabled={loading}
                  className="w-full h-11 gap-1.5 bg-[#242424] border border-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-md transition-colors inline-flex items-center justify-center text-xs font-semibold"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 text-[#faff69]" />}
                  Send Code by Email
                </button>
              ) : (
                <button
                  onClick={verifyLoginOtp}
                  disabled={loading}
                  className="w-full h-11 gap-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md transition-colors inline-flex items-center justify-center text-xs"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  Verify &amp; Sign In
                </button>
              )}
            </TabsContent>

            <div className="pt-3 border-t border-[#2a2a2a] text-center">
              <button
                onClick={() => setActiveMode("signup")}
                className="text-xs text-[#888888] hover:text-[#faff69] transition-colors font-mono"
              >
                Need an account? <strong className="text-[#faff69]">Register now →</strong>
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
                  <p className="text-xs text-[#888888] mt-0.5">Choose your starting tier. Upgrade anytime.</p>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {[
                    { id: "free", name: "Free Plan", price: "₹0", sub: "1 Resume preview (No Vector Export)" },
                    { id: "single_99", name: "Single Export Pass", price: "₹99", sub: "1 Vector PDF Export" },
                    { id: "pro_399", name: "Pro Plan (Featured)", price: "₹399/mo", sub: "5 Resumes + ALL AI & ATS Tools" },
                    { id: "business_999", name: "Business Plan", price: "₹999/mo", sub: "50 Resumes + Priority Support" },
                    { id: "institution_4999", name: "Institution Plan", price: "₹4,999/mo", sub: "300 Student Roster + Placement Portal" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlan(p.id)}
                      className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition-all ${
                        selectedPlan === p.id
                          ? "border-[#faff69] bg-[#242424]"
                          : "border-[#2a2a2a] bg-[#121212] hover:border-[#3a3a3a]"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{p.name}</p>
                        <p className="text-[10px] text-[#888888] mt-0.5 font-mono">{p.sub}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#faff69] shrink-0 ml-2">{p.price}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSignupStep("details")}
                  className="w-full h-11 gap-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md transition-colors mt-2 inline-flex items-center justify-center text-xs"
                >
                  Continue with Selected Plan →
                </button>
              </>
            ) : signupStep === "details" ? (
              <>
                <div className="flex items-center justify-between text-xs text-[#888888] pb-1">
                  <span>Plan: <strong className="text-white font-mono">{selectedPlan}</strong></span>
                  <button onClick={() => setSignupStep("plan")} className="text-[#faff69] hover:underline font-mono">Change</button>
                </div>

                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full h-11 gap-2 bg-[#242424] border border-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition-colors rounded-md text-xs font-semibold inline-flex items-center justify-center"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4 text-[#faff69]" />}
                  Sign up with Google (Recommended)
                </button>

                <div className="flex items-center gap-2 text-xs text-[#888888]">
                  <div className="flex-1 h-px bg-[#2a2a2a]" /> or with email <div className="flex-1 h-px bg-[#2a2a2a]" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#888888]">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="off"
                    placeholder="e.g. Rahul Sharma"
                    className="bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md text-xs h-10 px-3 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#888888]">Email Address</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="off"
                    placeholder="you@email.com"
                    className="bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md text-xs h-10 px-3 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#888888]">Password (min 6 characters)</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Choose a password"
                    onKeyDown={(e) => e.key === "Enter" && handleSignupSubmit()}
                    className="bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md text-xs h-10 px-3 outline-none"
                  />
                </div>
                <button
                  onClick={handleSignupSubmit}
                  disabled={loading}
                  className="w-full h-11 gap-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md transition-colors inline-flex items-center justify-center text-xs"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Send Verification Code
                </button>
              </>
            ) : (
              <>
                <div className="text-center py-2">
                  <div className="w-12 h-12 rounded-lg bg-[#242424] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-3 text-[#faff69]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-white">Check your email</p>
                  <p className="text-xs text-[#888888] mt-1 font-mono">
                    Code sent to <strong className="text-white">{email}</strong>
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#888888]">6-Digit Code</label>
                  <input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-xl tracking-[0.5em] font-mono bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md h-12 outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleSignupVerify()}
                  />
                </div>
                <button
                  onClick={handleSignupVerify}
                  disabled={loading}
                  className="w-full h-11 gap-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md transition-colors inline-flex items-center justify-center text-xs"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Confirm &amp; Activate Account
                </button>
              </>
            )}

            <div className="pt-3 border-t border-[#2a2a2a] text-center">
              <button
                onClick={() => setActiveMode("login")}
                className="text-xs text-[#888888] hover:text-[#faff69] transition-colors font-mono"
              >
                Already have an account? <strong className="text-[#faff69]">Sign In →</strong>
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
    } catch {}

    onLogout?.();

    try {
      document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch {}

    await signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <button onClick={handleLogout} disabled={loading} className="h-9 px-3 bg-[#1a1a1a] hover:bg-[#242424] text-[#cccccc] hover:text-white border border-[#2a2a2a] rounded-md text-xs font-semibold gap-1.5 inline-flex items-center transition-colors">
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#faff69]" /> : <LogOut className="w-3.5 h-3.5" />}
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}
