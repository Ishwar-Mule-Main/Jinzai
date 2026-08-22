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
import { X, ArrowRight, Check, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export function RoleExamplesDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const setData = useResumeStore((s) => s.setData);
  const setContactLocked = useResumeStore((s) => s.setContactLocked);
  const setView = useResumeStore((s) => s.setView);

  const loadRole = (roleId: string) => {
    const data = getRoleExample(roleId);
    if (!data) return;
    data.personalInfo.email = "";
    data.personalInfo.phone = "";
    setData(data);
    setContactLocked(false);
    setView("editor");
    setOpen(false);
    toast.success("Loaded role template — fill in your details to get started");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="h-9 px-3 gap-1.5 text-xs text-[#cccccc] hover:text-white bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] rounded-md font-semibold inline-flex items-center transition-colors">
            <Lightbulb className="w-3.5 h-3.5 text-[#faff69]" /> Examples
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white tracking-tight">
            <Lightbulb className="w-5 h-5 text-[#faff69]" /> Resume Examples by Role
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888888]">
            Start from a curated industry blueprint tailored for your target engineering or executive career.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {ROLE_EXAMPLES.map((role) => (
            <button
              key={role.id}
              onClick={() => loadRole(role.id)}
              className="text-left rounded-xl border border-[#2a2a2a] bg-[#121212] p-4 hover:border-[#faff69] hover:bg-[#1a1a1a] transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-xl shrink-0">
                  {role.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-white flex items-center gap-1">
                    {role.label}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#faff69]" />
                  </p>
                  <p className="text-[11px] text-[#888888] mt-0.5">{role.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {role.data.experience.slice(0, 2).map((exp) => (
                      <span key={exp.id} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[#cccccc]">
                        {exp.company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-[#888888] text-center mt-3 font-mono">
          Contact details are cleared — add your personal credentials in the editor.
        </p>
      </DialogContent>
    </Dialog>
  );
}

const TOUR_STEPS = [
  {
    title: "Welcome to Jinzai 👋",
    body: "Build an ultra-fast, high-density ATS resume with 78 master layouts, AI writing tools, and zero-loss vector PDF export.",
    icon: "⚡",
  },
  {
    title: "78 Architectural Templates",
    body: "Browse our gallery of 78 distinct designs. Filter by style (Technical, Sidebar, Minimal, Executive, ATS-compliant). Real-time hot-swapping.",
    icon: "📐",
  },
  {
    title: "AI Co-Pilot & ATS Validation",
    body: "Use AI to optimize bullet points, quantify metrics, verify keyword density, and generate tailored cover letters.",
    icon: "✨",
  },
  {
    title: "Instant Vector Export",
    body: "Produce pixel-perfect, selectable vector PDF documents designed for Taleo, Greenhouse, and Workday parsing.",
    icon: "📄",
  },
  {
    title: "Ready to Deploy",
    body: "Start from a blank canvas, sample profile, or pre-built industry example. Happy building!",
    icon: "🚀",
  },
];

const TOUR_SEEN_KEY = "resumeforge-tour-seen";

export function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(TOUR_SEEN_KEY);
      if (!seen) {
        const timer = setTimeout(() => setOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(TOUR_SEEN_KEY, "1");
    } catch {}
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
      <DialogContent className="max-w-md bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <button
          onClick={skip}
          className="absolute right-4 top-4 text-[#888888] hover:text-white transition-colors"
          aria-label="Skip tour"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="text-center py-2">
          <div className="text-4xl mb-4">{current.icon}</div>
          <h2 className="text-lg font-bold mb-2 text-white tracking-tight">{current.title}</h2>
          <p className="text-xs text-[#888888] leading-relaxed mb-6">{current.body}</p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-[#faff69]" : i < step ? "w-1.5 bg-[#faff69]/40" : "w-1.5 bg-[#2a2a2a]"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button onClick={skip} className="h-9 px-3 text-xs text-[#888888] hover:text-white font-semibold transition-colors">
              Skip tour
            </button>
            <button
              onClick={next}
              className="h-9 px-5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs rounded-md inline-flex items-center gap-1.5 transition-colors"
            >
              {isLast ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Get Started
                </>
              ) : (
                <>
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-[#888888] font-mono mt-3">
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
  } catch {}
}
