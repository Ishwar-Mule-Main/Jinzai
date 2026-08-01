"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { useResumeStore } from "@/lib/resume/store";
import { getPlanConfig, isPaidPlan } from "@/lib/resume/plans";
import { TemplateThumbnail } from "@/components/resume/template-thumbnail";
import { ResumeRenderer } from "@/components/resume/resume-renderer";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { A4MultiPageWrapper } from "@/components/resume/a4-multi-page-wrapper";
import { ZoomControls } from "@/components/resume/zoom-controls";
import { ResumeScoreDialog, AtsDialog, CoverLetterDialog } from "@/components/resume/ai-dialogs";
import { PricingDialog } from "@/components/resume/pricing-dialog";
import { SupportDialog } from "@/components/resume/support-dialog";
import { BrandMark } from "@/components/resume/brand-mark";
import { LogoutButton } from "@/components/resume/auth-dialogs";
import { downloadPdfDirectly } from "@/lib/resume/pdf-export";
import { TEMPLATES } from "@/lib/resume/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  LayoutGrid,
  Palette,
  Download,
  Save,
  Sparkles,
  Loader2,
  Crown,
  Check,
  Eye,
  Pencil,
  Info,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

const ACCENT_COLORS = [
  { name: "Teal", value: "#0f766e" },
  { name: "Orange", value: "#FF6200" },
  { name: "Navy Blue", value: "#1e3a8a" },
  { name: "Green", value: "#047857" },
  { name: "Purple", value: "#6d28d9" },
  { name: "Red", value: "#be123c" },
  { name: "Dark Grey", value: "#334155" },
];

export default function EditorPage() {
  const router = useRouter();
  const { user, refresh } = useCurrentUser();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mobile tab: "edit" or "preview"
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  const title = useResumeStore((s) => s.title);
  const setTitle = useResumeStore((s) => s.setTitle);
  const template = useResumeStore((s) => s.template);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const accentColor = useResumeStore((s) => s.accentColor);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);
  const fontFamily = useResumeStore((s) => s.fontFamily);
  const data = useResumeStore((s) => s.data);
  const savedId = useResumeStore((s) => s.savedId);
  const setSavedId = useResumeStore((s) => s.setSavedId);

  const planConfig = user ? getPlanConfig(user.plan) : getPlanConfig("free");
  const canExport = user ? isPaidPlan(user.plan) : false;

  // Auto-save on data change (debounced 2s)
  useEffect(() => {
    if (!savedId) return; // Only auto-save if resume was already saved once
    const timer = setTimeout(() => handleSave(true), 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, template, accentColor, fontFamily, title]);

  const handleSave = async (silent = false) => {
    if (saving) return;
    setSaving(true);
    try {
      const payload = {
        id: savedId,
        title,
        template,
        accentColor,
        fontFamily,
        content: JSON.stringify(data),
      };
      const res = await fetch("/api/resumes", {
        method: savedId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setSavedId(json.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (!silent) toast.success("Resume saved!");
    } catch {
      toast.error("Could not save your resume. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!canExport) {
      toast.error("Downloading requires a paid plan. Upgrade to unlock PDF downloads.");
      return;
    }
    if (!resumeRef.current) {
      toast.error("Preview not ready yet — please wait a moment.");
      return;
    }
    setExporting(true);
    const toastId = toast.loading("Preparing your PDF download…");
    try {
      await downloadPdfDirectly(resumeRef.current, title);
      toast.success("Your PDF is downloading!", { id: toastId });
    } catch {
      toast.error("Download failed. Please try again.", { id: toastId });
      window.print();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-[#FF6200] selection:text-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-[#2E2E2E]">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">

          {/* Left: Back + Title */}
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="h-9 px-3 rounded-full border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] text-sm gap-1.5 shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF6200]" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>

            {/* Resume title (hidden on very small mobile) */}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume title…"
              className="hidden sm:flex h-9 w-44 sm:w-52 bg-[#141414] border-[#2E2E2E] focus:border-[#FF6200] text-white font-semibold text-sm rounded-xl"
            />
          </div>

          {/* Center: Save status (desktop) */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-[#888898]">
            {saving ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6200]" /> Saving…</>
            ) : saved ? (
              <><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Saved</>
            ) : null}
          </div>

          {/* Right: Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Change Design (template picker) */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-2.5 sm:px-3 rounded-xl border-[#2E2E2E] bg-[#141414] text-white text-xs sm:text-sm gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-[#FF6200]" />
                  <span className="hidden sm:inline">Change Design</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-[#141414] border-[#2E2E2E] text-white max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-bricolage text-xl font-bold">Choose a Design</DialogTitle>
                  <DialogDescription className="text-sm text-[#888898]">
                    Pick any style you like — your information stays exactly the same, only the look changes.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        template === t.id
                          ? "border-[#FF6200] bg-[#FF6200]/10 ring-2 ring-[#FF6200]/20"
                          : "border-[#2E2E2E] bg-[#0B0B0C] hover:border-[#FF6200]/40"
                      }`}
                    >
                      <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 relative">
                        <TemplateThumbnail templateId={t.id} className="w-full h-full object-cover" />
                        {template === t.id && (
                          <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#FF6200] flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="font-bricolage text-xs font-bold text-white truncate">{t.name}</p>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Pick Color */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-2.5 sm:px-3 rounded-xl border-[#2E2E2E] bg-[#141414] text-white text-xs sm:text-sm gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#FF6200]" />
                  <span className="hidden sm:inline">Pick Color</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm bg-[#141414] border-[#2E2E2E] text-white">
                <DialogHeader>
                  <DialogTitle className="font-bricolage text-xl font-bold">Choose a Color</DialogTitle>
                  <DialogDescription className="text-sm text-[#888898]">
                    This changes the highlight color used throughout your resume.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 pt-3">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setAccentColor(c.value)}
                      className={`p-3 rounded-xl border flex items-center gap-2 text-sm transition-all ${
                        accentColor === c.value
                          ? "border-[#FF6200] bg-[#FF6200]/10"
                          : "border-[#2E2E2E] bg-[#0B0B0C] hover:border-[#FF6200]/40"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: c.value }} />
                      <span className="text-white">{c.name}</span>
                      {accentColor === c.value && <Check className="w-3.5 h-3.5 text-[#FF6200] ml-auto" />}
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* AI Tools (desktop only) */}
            <div className="hidden lg:flex items-center gap-1.5">
              <ResumeScoreDialog />
              <AtsDialog />
              <CoverLetterDialog />
            </div>

            {/* Save (desktop) */}
            <Button
              onClick={() => handleSave(false)}
              disabled={saving}
              variant="outline"
              size="sm"
              className="hidden sm:flex h-9 px-3 rounded-xl border-[#2E2E2E] bg-[#141414] text-white text-sm gap-1.5 hover:border-[#FF6200]/50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-[#FF6200]" />}
              Save
            </Button>

            {/* Download PDF */}
            <Button
              onClick={handleExportPDF}
              disabled={exporting}
              size="sm"
              className="h-9 px-3 sm:px-4 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold text-xs sm:text-sm gap-1.5 shadow-md shadow-[#FF6200]/20"
            >
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{exporting ? "Preparing…" : "Download PDF"}</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>

        {/* ── Tip strip (desktop only) ── */}
        <div className="hidden md:flex items-center gap-2 px-4 sm:px-6 py-2 bg-[#141414]/50 border-t border-[#2E2E2E]/50">
          <Info className="w-3.5 h-3.5 text-[#FF6200] shrink-0" />
          <p className="text-xs text-[#888898]">
            <strong className="text-white">Tip:</strong> Fill in each section on the left and watch your resume update live on the right.
            Don't worry about the order — you can rearrange sections anytime.
          </p>
        </div>

        {/* ── Mobile tab switcher (stuck under header) ── */}
        <div className="md:hidden flex items-center bg-[#141414] border-t border-[#2E2E2E]">
          <button
            onClick={() => setMobileTab("edit")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
              mobileTab === "edit"
                ? "text-[#FF6200] border-b-2 border-[#FF6200]"
                : "text-[#888898] border-b-2 border-transparent"
            }`}
          >
            <Pencil className="w-4 h-4" /> Fill in Details
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
              mobileTab === "preview"
                ? "text-[#FF6200] border-b-2 border-[#FF6200]"
                : "text-[#888898] border-b-2 border-transparent"
            }`}
          >
            <Eye className="w-4 h-4" /> Preview Resume
          </button>
        </div>
      </header>

      {/* ── Workspace ── */}
      <div className="flex-1 max-w-[1800px] w-full mx-auto p-3 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

        {/* Left panel — Form (hidden on mobile when preview tab active) */}
        <div className={`lg:col-span-5 flex flex-col gap-4 ${mobileTab === "preview" ? "hidden md:flex" : "flex"}`}>

          {/* Mobile save status */}
          <div className="md:hidden flex items-center justify-between px-1">
            <p className="text-xs text-[#888898]">
              Fill in your details below — your resume updates automatically.
            </p>
            {saving ? (
              <span className="flex items-center gap-1 text-xs text-[#888898]"><Loader2 className="w-3 h-3 animate-spin text-[#FF6200]" /> Saving…</span>
            ) : saved ? (
              <span className="flex items-center gap-1 text-xs text-[#22C55E]"><CheckCircle2 className="w-3 h-3" /> Saved</span>
            ) : null}
          </div>

          <Card className="p-4 sm:p-6 bg-[#141414] border-[#2E2E2E] rounded-2xl flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
            <ResumeEditor />
          </Card>

          {/* Mobile save + AI tools strip */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              onClick={() => handleSave(false)}
              disabled={saving}
              variant="outline"
              className="flex-1 h-10 rounded-xl border-[#2E2E2E] bg-[#141414] text-white text-sm gap-1.5"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#FF6200]" />}
              Save Resume
            </Button>
            <ResumeScoreDialog />
            <AtsDialog />
          </div>
        </div>

        {/* Right panel — Preview (hidden on mobile when edit tab active) */}
        <div className={`lg:col-span-7 flex flex-col gap-3 ${mobileTab === "edit" ? "hidden md:flex" : "flex"}`}>

          {/* Preview bar */}
          <div className="flex items-center justify-between bg-[#141414] border border-[#2E2E2E] px-4 py-2.5 rounded-2xl">
            <div className="flex items-center gap-2 text-xs text-[#888898]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6200]" />
              <span>Live Preview — this is exactly how your resume will look when downloaded</span>
            </div>
            <ZoomControls />
          </div>

          {/* Resume preview area */}
          <div
            className="flex-1 bg-[#0B0B0C] border border-[#2E2E2E] rounded-2xl p-4 sm:p-6 overflow-auto flex justify-center items-start"
            style={{ minHeight: "500px" }}
          >
            <A4MultiPageWrapper>
              <div ref={resumeRef} className="resume-protected w-[210mm] bg-white text-black shadow-2xl">
                <ResumeRenderer data={data} accent={accentColor} font={fontFamily} template={template} />
              </div>
            </A4MultiPageWrapper>
          </div>

          {/* Download button repeated below preview on mobile */}
          <div className="md:hidden">
            <Button
              onClick={handleExportPDF}
              disabled={exporting}
              className="w-full h-12 rounded-2xl bg-[#FF6200] hover:bg-[#E55700] text-white font-bold text-sm gap-2 shadow-lg shadow-[#FF6200]/20"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exporting ? "Preparing your download…" : "Download as PDF"}
            </Button>
            {!canExport && (
              <p className="text-xs text-[#888898] text-center mt-2">
                💡 PDF download requires a paid plan. <span className="text-[#FF6200]">Upgrade now</span> to unlock it.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
