"use client";

import { useState, useEffect } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { ROLE_EXAMPLES, getRoleExample } from "@/lib/resume/role-examples";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, X, ArrowRight, Check, Lightbulb } from "lucide-react";
import { toast } from "sonner";

// ---------- Role Examples Dialog ----------

export function RoleExamplesDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const setData = useResumeStore((s) => s.setData);
  const setContactLocked = useResumeStore((s) => s.setContactLocked);
  const setView = useResumeStore((s) => s.setView);

  const loadRole = (roleId: string) => {
    const data = getRoleExample(roleId);
    if (!data) return;
    // Clear contact details so user fills their own (plan enforcement)
    data.personalInfo.email = "";
    data.personalInfo.phone = "";
    setData(data);
    setContactLocked(false);
    setView("editor");
    setOpen(false);
    toast.success("Loaded role example — fill in your details to get started");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" /> Examples
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-teal-600" /> Resume Examples by Role
          </DialogTitle>
          <DialogDescription>
            Start with a pre-filled resume for your role. Edit the details to make it yours.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {ROLE_EXAMPLES.map((role) => (
            <button
              key={role.id}
              onClick={() => loadRole(role.id)}
              className="text-left rounded-xl border-2 p-4 hover:border-teal-500 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-xl shrink-0">
                  {role.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm flex items-center gap-1">
                    {role.label}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-teal-600" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {role.data.experience.slice(0, 2).map((exp) => (
                      <span key={exp.id} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {exp.company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground text-center mt-3">
          Contact details are cleared — add your own when ready.
        </p>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Onboarding Tour ----------

const TOUR_STEPS = [
  {
    title: "Welcome to ResumeForge! 👋",
    body: "Build a professional resume in minutes with 52 templates, AI writing tools, and one-click export. Let's get you started.",
    icon: "🚀",
  },
  {
    title: "52 Professional Templates",
    body: "Browse our gallery of 52 distinct designs. Filter by style (Sidebar, Banner, Minimal, ATS-friendly, and more). Click any template to start editing.",
    icon: "🎨",
  },
  {
    title: "AI-Powered Writing",
    body: "Use AI to generate summaries, achievement bullets, skill suggestions, and cover letters. Rewrite weak bullets to be quantified and impactful.",
    icon: "✨",
  },
  {
    title: "Export When Ready",
    body: "Free plan lets you create 1 resume. Upgrade to Trial (₹99), Pro (₹499), or Business (₹1,999) to export to PDF & DOCX and create more resumes.",
    icon: "📤",
  },
  {
    title: "You're All Set!",
    body: "Click \"Try with sample data\" to see a full resume, or \"Examples\" to start from a role-specific template. Happy building!",
    icon: "🎉",
  },
];

const TOUR_SEEN_KEY = "resumeforge-tour-seen";

export function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if tour has been seen
    try {
      const seen = localStorage.getItem(TOUR_SEEN_KEY);
      if (!seen) {
        // Small delay so it doesn't conflict with hydration
        const timer = setTimeout(() => setOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(TOUR_SEEN_KEY, "1");
    } catch {
      // ignore
    }
  };

  const next = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      close();
    }
  };

  const skip = () => close();

  if (!open) return null;

  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent className="max-w-md" style={{ pointerEvents: "auto" }}>
        <button
          onClick={skip}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Skip tour"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="text-center py-2">
          <div className="text-5xl mb-4">{current.icon}</div>
          <h2 className="text-xl font-bold mb-2">{current.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{current.body}</p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-teal-600" : i < step ? "w-1.5 bg-teal-400" : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm" onClick={skip} className="text-xs">
              Skip tour
            </Button>
            <Button
              onClick={next}
              size="sm"
              className="gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
            >
              {isLast ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Get started
                </>
              ) : (
                <>
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            Step {step + 1} of {TOUR_STEPS.length}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function resetTour() {
  try {
    localStorage.removeItem(TOUR_SEEN_KEY);
  } catch {
    // ignore
  }
}
