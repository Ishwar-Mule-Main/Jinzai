"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
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
    // This opens Google's consent screen in a popup/redirect
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signup"
              ? "Sign up with email + OTP verification or Google."
              : "Log in with password, Google, or email code."}
          </DialogDescription>
        </DialogHeader>

        {/* ===== LOGIN MODE ===== */}
        {mode === "login" && (
          <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as typeof loginMethod)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="password" className="text-xs gap-1">
                <Lock className="w-3 h-3" /> Password
              </TabsTrigger>
              <TabsTrigger value="google" className="text-xs gap-1">
                <Chrome className="w-3 h-3" /> Google
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs gap-1">
                <KeyRound className="w-3 h-3" /> OTP
              </TabsTrigger>
            </TabsList>

            {/* Password login */}
            <TabsContent value="password" className="space-y-3 mt-3">
              <div>
                <Label className="text-xs">Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" />
              </div>
              <div>
                <Label className="text-xs">Password</Label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
              </div>
              <Button onClick={handleLogin} disabled={loading} className="w-full gap-1.5 bg-[#111111] text-white hover:bg-[#000000]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Log In
              </Button>
              <button onClick={fillDemo} className="w-full text-xs text-teal-600 hover:underline flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> Use demo credentials
              </button>
            </TabsContent>

            {/* Google login */}
            <TabsContent value="google" className="space-y-3 mt-3">
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Click below to sign in with your Google account.
                </p>
                <Button onClick={handleGoogle} disabled={loading} className="w-full gap-1.5 bg-white border border-input text-gray-700 hover:bg-gray-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4" />}
                  Continue with Google
                </Button>
                <p className="text-[10px] text-muted-foreground text-center mt-3">
                  You'll be redirected to Google to choose your account.
                </p>
              </div>
            </TabsContent>

            {/* OTP login */}
            <TabsContent value="code" className="space-y-3 mt-3">
              <div>
                <Label className="text-xs">Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" />
              </div>
              {loginOtpSent && (
                <div>
                  <Label className="text-xs">6-digit code</Label>
                  <Input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-lg tracking-[0.5em] font-mono"
                    onKeyDown={(e) => e.key === "Enter" && verifyLoginOtp()}
                  />
                </div>
              )}
              {!loginOtpSent ? (
                <Button onClick={sendLoginOtp} disabled={loading} variant="outline" className="w-full gap-1.5">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Send login code
                </Button>
              ) : (
                <Button onClick={verifyLoginOtp} disabled={loading} className="w-full gap-1.5 bg-[#111111] text-white hover:bg-[#000000]">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  Verify & Log In
                </Button>
              )}
              {loginOtpSent && (
                <button onClick={sendLoginOtp} className="w-full text-xs text-muted-foreground hover:underline">
                  Resend code
                </button>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* ===== SIGNUP MODE ===== */}
        {mode === "signup" && (
          <div className="space-y-3">
            {signupStep === "details" ? (
              <>
                {/* Step 1: Enter details */}
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" />
                </div>
                <div>
                  <Label className="text-xs">Password (min 6 characters)</Label>
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleSignupSubmit()} />
                </div>
                <Button onClick={handleSignupSubmit} disabled={loading} className="w-full gap-1.5 bg-[#111111] text-white hover:bg-[#000000]">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Send Verification Code
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
                </div>

                {/* Google signup */}
                <Button onClick={handleGoogle} disabled={loading} className="w-full gap-1.5 bg-white border border-input text-gray-700 hover:bg-gray-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4" />}
                  Sign up with Google
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">
                  You'll be redirected to Google to choose your account and grant access.
                </p>
              </>
            ) : (
              <>
                {/* Step 2: Verify OTP */}
                <div className="text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-teal-600" />
                  </div>
                  <p className="text-sm font-medium">Verify your email</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We sent a 6-digit code to <strong>{email}</strong>
                  </p>
                </div>
                <div>
                  <Label className="text-xs">6-digit verification code</Label>
                  <Input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-lg tracking-[0.5em] font-mono"
                    onKeyDown={(e) => e.key === "Enter" && handleSignupVerify()}
                  />
                </div>
                <Button onClick={handleSignupVerify} disabled={loading} className="w-full gap-1.5 bg-[#111111] text-white hover:bg-[#000000]">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Verify & Create Account
                </Button>
                <button
                  onClick={() => setSignupStep("details")}
                  className="w-full text-xs text-muted-foreground hover:underline"
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
  const handleLogout = async () => {
    setLoading(true);
    // Set a flag so the homepage can show the "logged out successfully" popup
    try {
      sessionStorage.setItem("jinzai-logged-out", "1");
    } catch {
      // ignore storage errors
    }
    await signOut({ redirect: false });
    setLoading(false);
    onLogout?.();
    // Redirect to the main homepage so the user sees the logged-out state with a popup
    window.location.href = "/";
  };
  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loading} className="gap-1.5">
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
      <span className="hidden sm:inline">Log out</span>
    </Button>
  );
}
