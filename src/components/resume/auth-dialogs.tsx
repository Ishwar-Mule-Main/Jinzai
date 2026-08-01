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
import { Loader2, Mail, Lock, User, Chrome, KeyRound, LogOut, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export type AuthMode = "login" | "signup" | null;

export function AuthDialog({
  mode,
  onClose,
  onSuccess,
}: {
  mode: AuthMode;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "google" | "code">("password");

  // Signup OTP state
  const [signupStep, setSignupStep] = useState<"details" | "otp">("details");
  const [otpCode, setOtpCode] = useState("");

  const open = mode !== null;

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setName("");
      setOtpCode("");
      setSignupStep("details");
      setLoginMethod("password");
    }
  }, [open]);

  // ===== LOGIN: Password =====
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Enter email and password");
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
        toast.error("Invalid email or password");
      } else {
        await new Promise((r) => setTimeout(r, 500));
        toast.success("Logged in successfully");
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
      toast.error("Enter the code");
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
        toast.success("Logged in successfully");
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

  const fillDemo = () => {
    setEmail("ishwar@domainexpansion.in");
    setPassword("DomainEx@26");
    setLoginMethod("password");
    toast.info("Demo credentials filled — click Login");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md bg-[#141414] border border-[#2E2E2E] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-xl font-semibold text-white">
            <div className="w-8 h-8 rounded-lg bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#FF6200]" />
            </div>
            {mode === "signup" ? "Join free — it takes 30 seconds" : "Welcome back! Sign in to continue"}
          </DialogTitle>
          <DialogDescription className="text-[#888898] text-sm">
            {mode === "signup"
              ? "Create your free account to save and manage your resumes."
              : "Sign in to access your saved resumes."}
          </DialogDescription>
        </DialogHeader>

        {/* ===== LOGIN MODE ===== */}
        {mode === "login" && (
          <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as typeof loginMethod)}>
            <TabsList className="grid grid-cols-3 w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-1">
              <TabsTrigger
                value="google"
                className="text-xs gap-1 text-[#888898] data-[state=active]:bg-[#FF6200] data-[state=active]:text-white rounded-md transition-all"
              >
                <Chrome className="w-3 h-3" /> Google
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="text-xs gap-1 text-[#888898] data-[state=active]:bg-[#FF6200] data-[state=active]:text-white rounded-md transition-all"
              >
                <Lock className="w-3 h-3" /> Password
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="text-xs gap-1 text-[#888898] data-[state=active]:bg-[#FF6200] data-[state=active]:text-white rounded-md transition-all"
              >
                <KeyRound className="w-3 h-3" /> Email Code
              </TabsTrigger>
            </TabsList>

            {/* Google login — shown first */}
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
                <p className="text-xs text-[#5A5A6A] text-center mt-3">
                  You'll be redirected to Google — takes just a few seconds.
                </p>
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
              {loginOtpSent && (
                <button
                  onClick={sendLoginOtp}
                  className="w-full text-xs text-[#888898] hover:text-[#FF6200] transition-colors"
                >
                  Didn't receive it? Resend the code
                </button>
              )}  
            </TabsContent>
          </Tabs>
        )}

        {/* ===== SIGNUP MODE ===== */}
        {mode === "signup" && (
          <div className="space-y-3">
            {signupStep === "details" ? (<>
                {/* Google signup — top option */}
                <Button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full h-11 gap-2 bg-[#1A1A1A] border border-[#2E2E2E] hover:border-[#FF6200]/50 text-white hover:bg-[#222222] transition-all rounded-full font-semibold"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4 text-[#FF6200]" />}
                  Sign up with Google (Recommended)
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-2 text-xs text-[#5A5A6A]">
                  <div className="flex-1 h-px bg-[#2E2E2E]" /> or sign up with email <div className="flex-1 h-px bg-[#2E2E2E]" />
                </div>

                {/* Step 1: Enter details */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-[#888898]">Your name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

                <p className="text-[10px] text-[#5A5A6A] text-center">
                  We'll send a 6-digit code to your email to verify it's you. Check spam if you don't see it.
                </p>
              </>
            ) : (
              <>
                {/* Step 2: Verify OTP */}
                <div className="text-center py-2">
                  <div className="w-14 h-14 rounded-full bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-[#FF6200]" />
                  </div>
                  <p className="text-sm font-semibold text-white">Check your email inbox</p>
                  <p className="text-sm text-[#888898] mt-1">
                    We sent a 6-digit code to <strong className="text-white">{email}</strong>. Check your spam folder if you don't see it.
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
                <button
                  onClick={() => setSignupStep("details")}
                  className="w-full text-xs text-[#888898] hover:text-[#FF6200] transition-colors"
                >
                  ← Back to edit details
                </button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function LogoutButton({ onLogout }: { onLogout?: () => void }) {
  const [loading, setLoading] = useState(false);
  const handleLogout = () => {
    setLoading(true);

    try {
      sessionStorage.setItem("jinzai-logged-out", "1");
    } catch {
      // ignore storage errors
    }

    onLogout?.();

    // 0ms instant cookie clearance
    try {
      document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch {}

    // Asynchronous background signout request (non-blocking)
    signOut({ redirect: false }).catch(() => {});

    // Instant browser navigation to homepage
    window.location.href = "/";
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loading} className="gap-1.5 hover:text-[#FF6200] transition-colors">
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6200]" /> : <LogOut className="w-3.5 h-3.5" />}
      <span className="hidden sm:inline">Log out</span>
    </Button>
  );
}
