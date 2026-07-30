"use client";

import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import { useResumeStore } from "@/lib/resume/store";
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
import { Loader2, Mail, Lock, User, Chrome, KeyRound, LogOut, ShieldCheck, Sparkles } from "lucide-react";
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
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const open = mode !== null;

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setName("");
      setCode("");
      setSentCode(false);
      setDemoCode(null);
      setLoginMethod("password");
    }
  }, [open]);

  const handleCredentials = async () => {
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
        setLoading(false);
      } else {
        // Wait a moment for session to update, then refresh
        await new Promise((r) => setTimeout(r, 500));
        toast.success("Logged in successfully");
        onSuccess?.();
        onClose();
      }
    } catch (e) {
      toast.error("Login failed — please try again");
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password) {
      toast.error("Enter email and password");
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
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Signup failed");
      }
      // Auto-login after signup
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (loginRes?.error) throw new Error("Auto-login failed");
      toast.success("Account created successfully");
      onSuccess?.();
      onClose();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Enter your Gmail address");
      return;
    }
    setLoading(true);
    const res = await signIn("google", {
      email,
      name: name || undefined,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      toast.error("Google login failed");
    } else {
      toast.success("Logged in with Google");
      onSuccess?.();
      onClose();
    }
  };

  const sendCode = async () => {
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
      if (!res.ok) throw new Error("Failed to send code");
      const json = await res.json();
      setSentCode(true);
      setDemoCode(json.demoCode || null);
      toast.success(`Verification code sent to ${email}. Check your inbox (and spam folder).`);
    } catch {
      toast.error("Could not send code");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!email || !code) {
      toast.error("Enter the code");
      return;
    }
    setLoading(true);
    const res = await signIn("email-code", {
      email,
      code,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid or expired code");
    } else {
      toast.success("Logged in successfully");
      onSuccess?.();
      onClose();
    }
  };

  const fillDemo = () => {
    setEmail("ishwar@domainexpansion.in");
    setPassword("Domain Expansion");
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
              ? "Sign up to create and export professional resumes."
              : "Log in to access your resumes and templates."}
          </DialogDescription>
        </DialogHeader>

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
                <KeyRound className="w-3 h-3" /> Code
              </TabsTrigger>
            </TabsList>

            {/* Password login */}
            <TabsContent value="password" className="space-y-3 mt-3">
              <div>
                <Label className="text-xs">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" className="pl-9" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="pl-9" onKeyDown={(e) => e.key === "Enter" && handleCredentials()} />
                </div>
              </div>
              <Button onClick={handleCredentials} disabled={loading} className="w-full gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Log In
              </Button>
              <button onClick={fillDemo} className="w-full text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> Use demo credentials
              </button>
            </TabsContent>

            {/* Google login */}
            <TabsContent value="google" className="space-y-3 mt-3">
              <div>
                <Label className="text-xs">Gmail address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="yourname@gmail.com" className="pl-9" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Your name (optional)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="pl-9" />
                </div>
              </div>
              <Button onClick={handleGoogle} disabled={loading} className="w-full gap-1.5 bg-white border border-input text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-white dark:border-slate-600">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4" />}
                Continue with Google
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">
                Demo mode: any email works. In production, this uses Google OAuth.
              </p>
            </TabsContent>

            {/* Email code login */}
            <TabsContent value="code" className="space-y-3 mt-3">
              <div>
                <Label className="text-xs">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" className="pl-9" />
                </div>
              </div>
              {sentCode && (
                <div>
                  <Label className="text-xs">6-digit code</Label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-lg tracking-[0.5em] font-mono"
                    onKeyDown={(e) => e.key === "Enter" && verifyCode()}
                  />
                </div>
              )}
              {!sentCode ? (
                <Button onClick={sendCode} disabled={loading} variant="outline" className="w-full gap-1.5">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Send login code
                </Button>
              ) : (
                <Button onClick={verifyCode} disabled={loading} className="w-full gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  Verify & Log In
                </Button>
              )}
              {sentCode && (
                <button onClick={sendCode} className="w-full text-xs text-muted-foreground hover:underline">
                  Resend code
                </button>
              )}
            </TabsContent>
          </Tabs>
        )}

        {mode === "signup" && (
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="pl-9" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" className="pl-9" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Password (min 6 characters)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="pl-9" onKeyDown={(e) => e.key === "Enter" && handleSignup()} />
              </div>
            </div>
            <Button onClick={handleSignup} disabled={loading} className="w-full gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
              Create Account
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
            </div>
            <Button
              onClick={() => {
                if (!email || !email.includes("@")) {
                  toast.error("Enter your email above first");
                  return;
                }
                handleGoogle();
              }}
              disabled={loading}
              className="w-full gap-1.5 bg-white border border-input text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-white dark:border-slate-600"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4" />}
              Sign up with Google
            </Button>
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
    await signOut({ redirect: false });
    setLoading(false);
    toast.success("Logged out");
    onLogout?.();
  };
  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loading} className="gap-1.5">
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
      <span className="hidden sm:inline">Log out</span>
    </Button>
  );
}
