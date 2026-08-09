"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { useResumeStore } from "@/lib/resume/store";
import { getPlanConfig, isPaidPlan } from "@/lib/resume/plans";
import { TemplateCard } from "@/components/resume/template-card";
import { ResumeRenderer } from "@/components/resume/resume-renderer";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { A4MultiPageWrapper } from "@/components/resume/a4-multi-page-wrapper";
import { ZoomControls } from "@/components/resume/zoom-controls";
import { ResumeScoreDialog, AtsDialog, CoverLetterDialog } from "@/components/resume/ai-dialogs";
import { PricingDialog } from "@/components/resume/pricing-dialog";
import { PdfPreviewDialog } from "@/components/resume/pdf-preview-dialog";
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
  const [pricingOpen, setPricingOpen] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);

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
      toast.info("Downloading requires an active plan. Choose a plan to unlock instant PDF downloads!");
      setPricingOpen(true);
      return;
    }
    setPdfPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-[#FF6200] selection:text-white">

      {/* ── Free Account Purchase Notice Top Banner ── */}
      {!canExport && (
        <div className="bg-gradient-to-r from-[#FF6200]/20 via-[#141414] to-[#141414] border-b border-[#FF6200]/40 px-4 py-2 flex items-center justify-between gap-3 text-xs z-50">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#FF6200] shrink-0" />
            <span>
              <strong className="text-white font-semibold">Free Account Notice:</strong> You are editing on a Free Account. Purchase a plan to download your high-precision PDF resume &amp; unlock all 78 templates.
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => setPricingOpen(true)}
            className="h-7 px-3 bg-[#FF6200] hover:bg-[#E55700] text-white font-bold rounded-full text-[11px] shrink-0 gap-1 shadow-md shadow-[#FF6200]/20"
          >
            <Crown className="w-3.5 h-3.5" /> Purchase Plan &amp; Download PDF
          </Button>
        </div>
      )}

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
              <DialogContent className="max-w-4xl sm:max-w-5xl w-[95vw] bg-[#141414] border-[#2E2E2E] text-white max-h-[85vh] overflow-y-auto p-6 sm:p-8">
                <DialogHeader>
                  <DialogTitle className="font-bricolage text-xl font-bold">Choose a Design</DialogTitle>
                  <DialogDescription className="text-sm text-[#888898]">
                    Pick any style you like — your information stays exactly the same, only the look changes.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
                  {TEMPLATES.map((t, idx) => (
                    <TemplateCard key={t.id} id={t} index={idx} onSelect={() => setTemplate(t.id)} />
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

            {/* Upgrade Button (shown if free user) */}
            {!canExport && (
              <Button
                onClick={() => setPricingOpen(true)}
                size="sm"
                className="h-9 px-3 rounded-full bg-gradient-to-r from-[#FF6200] to-[#E55700] text-white font-bold text-xs gap-1.5 shadow-md shadow-[#FF6200]/20"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Upgrade Plan</span>
              </Button>
            )}

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
            {!canExport && <> <span className="text-[#FF6200] font-semibold">Purchase a plan</span> to download your PDF anytime.</>}
          </p>
        </div>
      </header>

      {/* ── Mobile Tab Switcher (Fill Details vs Preview Resume) ── */}
      <div className="md:hidden sticky top-14 z-30 bg-[#0D0D0D] border-b border-[#2E2E2E] px-4 py-2">
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#141414] border border-[#2E2E2E] rounded-full">
          <button
            onClick={() => setMobileTab("edit")}
            className={`py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mobileTab === "edit"
                ? "bg-[#FF6200] text-white shadow-md shadow-[#FF6200]/20"
                : "text-[#888898] hover:text-white"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            1. Fill Details
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mobileTab === "preview"
                ? "bg-[#FF6200] text-white shadow-md shadow-[#FF6200]/20"
                : "text-[#888898] hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            2. Preview Resume
          </button>
        </div>
      </div>

      {/* ── Main Editor Area ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Column: Form Editor */}
        <div
          className={`w-full md:w-1/2 lg:w-[45%] xl:w-[40%] bg-[#0D0D0D] border-r border-[#2E2E2E] overflow-y-auto p-4 sm:p-6 ${
            mobileTab === "preview" ? "hidden md:block" : "block"
          }`}
        >
          <ResumeEditor />
        </div>

        {/* Right Column: Live Preview & Zoom */}
        <div
          className={`w-full md:w-1/2 lg:w-[55%] xl:w-[60%] bg-[#111111] overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start space-y-6 ${
            mobileTab === "edit" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Zoom & View Controls */}
          <div className="w-full flex items-center justify-between gap-4 max-w-[210mm]">
            <ZoomControls />
            {!canExport && (
              <Button
                size="sm"
                onClick={() => setPricingOpen(true)}
                className="h-8 px-3 bg-[#FF6200] hover:bg-[#E55700] text-white font-bold text-xs rounded-full gap-1.5 shadow-md shadow-[#FF6200]/20"
              >
                <Crown className="w-3.5 h-3.5" /> Purchase Plan &amp; Download PDF
              </Button>
            )}
          </div>

          {/* Live A4 Render Canvas */}
          <div
            className="w-full flex justify-center overflow-x-auto pb-12"
            style={{ minHeight: "500px" }}
          >
            <A4MultiPageWrapper>
              <div ref={resumeRef} className="resume-protected w-[210mm] bg-white text-black shadow-2xl">
                <ResumeRenderer data={data} accent={accentColor} font={fontFamily} template={template} />
              </div>
            </A4MultiPageWrapper>
          </div>

          {/* Download button repeated below preview on mobile */}
          <div className="md:hidden w-full max-w-[210mm]">
            <Button
              onClick={handleExportPDF}
              disabled={exporting}
              className="w-full h-12 rounded-2xl bg-[#FF6200] hover:bg-[#E55700] text-white font-bold text-sm gap-2 shadow-lg shadow-[#FF6200]/20"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exporting ? "Preparing your download…" : "Download as PDF"}
            </Button>
            {!canExport && (
              <button
                onClick={() => setPricingOpen(true)}
                className="w-full text-xs text-[#FF6200] text-center mt-2 font-semibold hover:underline"
              >
                💡 Free Account: Click here to Purchase a Plan &amp; Download PDF →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controlled Pricing Dialog */}
      <PricingDialog
        currentPlan={user?.plan || "free"}
        onSubscribed={refresh}
        open={pricingOpen}
        onOpenChange={setPricingOpen}
      />

      {/* PDF Export Preview Dialog */}
      <PdfPreviewDialog
        open={pdfPreviewOpen}
        onOpenChange={setPdfPreviewOpen}
        data={data}
        accent={accentColor}
        font={fontFamily}
        template={template}
      />
    </div>
  );
}
