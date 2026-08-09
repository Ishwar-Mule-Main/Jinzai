"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { useResumeStore } from "@/lib/resume/store";
import { getPlanConfig, isPaidPlan } from "@/lib/resume/plans";
import { ResumeRenderer } from "@/components/resume/resume-renderer";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { AiCopilotPanel } from "@/components/resume/ai-copilot-panel";
import { A4MultiPageWrapper } from "@/components/resume/a4-multi-page-wrapper";
import { ZoomControls } from "@/components/resume/zoom-controls";
import { PricingDialog } from "@/components/resume/pricing-dialog";
import { PdfPreviewDialog } from "@/components/resume/pdf-preview-dialog";
import { SupportDialog } from "@/components/resume/support-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Download,
  Save,
  Sparkles,
  Loader2,
  Crown,
  Eye,
  Pencil,
  Info,
  CheckCircle2,
  GripVertical,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function EditorPage() {
  const router = useRouter();
  const { user, refresh } = useCurrentUser();
  const resumeRef = useRef<HTMLDivElement>(null);

  // States
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  // Draggable Left Panel Width state (default 460px, min 320px, max 680px)
  const [leftPanelWidth, setLeftPanelWidth] = useState(460);
  const [isResizing, setIsResizing] = useState(false);

  // Mobile tab: "edit", "preview", or "ai"
  const [mobileTab, setMobileTab] = useState<"edit" | "preview" | "ai">("edit");

  // Store bindings
  const title = useResumeStore((s) => s.title);
  const setTitle = useResumeStore((s) => s.setTitle);
  const template = useResumeStore((s) => s.template);
  const accentColor = useResumeStore((s) => s.accentColor);
  const fontFamily = useResumeStore((s) => s.fontFamily);
  const fontSize = useResumeStore((s) => s.fontSize);
  const data = useResumeStore((s) => s.data);
  const savedId = useResumeStore((s) => s.savedId);
  const setSavedId = useResumeStore((s) => s.setSavedId);

  const planConfig = user ? getPlanConfig(user.plan) : getPlanConfig("free");
  const canExport = user ? isPaidPlan(user.plan) : false;

  // Auto-save on data change (debounced 2s)
  useEffect(() => {
    if (!savedId) return;
    const timer = setTimeout(() => handleSave(true), 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, template, accentColor, fontFamily, fontSize, title]);

  // Drag Resizer Handlers
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth >= 320 && newWidth <= 680) {
          setLeftPanelWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

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
      if (!silent) toast.success("Resume saved successfully!");
    } catch {
      toast.error("Could not save your resume. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!canExport) {
      toast.info("Downloading requires an active plan. Purchase a plan to export high-precision PDFs!");
      setPricingOpen(true);
      return;
    }
    setPdfPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-[#FF6200] selection:text-white">
      
      {/* ── Top Announcement Banner for Free Users ── */}
      {!canExport && (
        <div className="bg-gradient-to-r from-[#FF6200]/20 via-[#141414] to-[#141414] border-b border-[#FF6200]/40 px-4 py-2 flex items-center justify-between gap-3 text-xs z-50">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#FF6200] shrink-0" />
            <span>
              <strong className="text-white font-semibold">Free Account Notice:</strong> You are editing on a Free Account. Purchase a plan to export vector PDFs &amp; unlock all 78 templates.
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

      {/* ── Main Clean Top Header (Removed Change Design, Pick Color, Score, ATS, Cover Letter buttons) ── */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-[#2E2E2E]">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          
          {/* Left: Back to Dashboard + Resume Title */}
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="h-9 px-3 rounded-full border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] text-xs sm:text-sm gap-1.5 shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF6200]" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume title…"
              className="hidden sm:flex h-9 w-44 sm:w-56 bg-[#141414] border-[#2E2E2E] focus-visible:ring-[#FF6200] text-white font-semibold text-xs sm:text-sm rounded-xl"
            />
          </div>

          {/* Center: Save status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#888898]">
            {saving ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6200]" /> Saving resume…</>
            ) : saved ? (
              <><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Auto-saved</>
            ) : null}
          </div>

          {/* Right Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Support Dialog */}
            <SupportDialog />

            {/* AI Drawer Toggle (for tablet/mobile screens) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className="xl:hidden h-9 px-3 rounded-xl border-[#2E2E2E] bg-[#141414] text-white text-xs gap-1.5 hover:border-[#FF6200]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6200]" />
              <span className="hidden sm:inline">AI Intelligence</span>
            </Button>

            {/* Save Button */}
            <Button
              onClick={() => handleSave(false)}
              disabled={saving}
              variant="outline"
              size="sm"
              className="hidden sm:flex h-9 px-3 rounded-xl border-[#2E2E2E] bg-[#141414] text-white text-xs sm:text-sm gap-1.5 hover:border-[#FF6200]/50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6200]" /> : <Save className="w-3.5 h-3.5 text-[#FF6200]" />}
              Save
            </Button>

            {/* Upgrade CTA */}
            {!canExport && (
              <Button
                onClick={() => setPricingOpen(true)}
                size="sm"
                className="h-9 px-3 rounded-full bg-gradient-to-r from-[#FF6200] to-[#E55700] text-white font-bold text-xs gap-1.5 shadow-md shadow-[#FF6200]/20"
              >
                <Crown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upgrade Plan</span>
              </Button>
            )}

            {/* Export / Download PDF */}
            <Button
              onClick={handleExportPDF}
              size="sm"
              className="h-9 px-3 sm:px-4 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-bold text-xs sm:text-sm gap-1.5 shadow-md shadow-[#FF6200]/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Mobile Tab Navigation Switcher ── */}
      <div className="md:hidden sticky top-14 z-30 bg-[#0D0D0D] border-b border-[#2E2E2E] px-4 py-2">
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#141414] border border-[#2E2E2E] rounded-full text-xs">
          <button
            onClick={() => setMobileTab("edit")}
            className={`py-1.5 px-2 rounded-full font-semibold flex items-center justify-center gap-1 transition-all ${
              mobileTab === "edit" ? "bg-[#FF6200] text-white shadow-md shadow-[#FF6200]/20" : "text-[#888898]"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`py-1.5 px-2 rounded-full font-semibold flex items-center justify-center gap-1 transition-all ${
              mobileTab === "preview" ? "bg-[#FF6200] text-white shadow-md shadow-[#FF6200]/20" : "text-[#888898]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <button
            onClick={() => setMobileTab("ai")}
            className={`py-1.5 px-2 rounded-full font-semibold flex items-center justify-center gap-1 transition-all ${
              mobileTab === "ai" ? "bg-[#FF6200] text-white shadow-md shadow-[#FF6200]/20" : "text-[#888898]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Suite
          </button>
        </div>
      </div>

      {/* ── Main Workspace Body (3 Columns with Left Drag Resizer) ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* COLUMN 1: Resizable Left Panel (Form & Design Controls) */}
        <div
          style={{ width: `${leftPanelWidth}px` }}
          className={`bg-[#0D0D0D] border-r border-[#2E2E2E] overflow-y-auto p-4 sm:p-5 shrink-0 transition-all ${
            mobileTab === "edit" ? "block w-full md:w-auto" : "hidden md:block"
          }`}
        >
          <ResumeEditor />
        </div>

        {/* DRAG RESIZER BAR between Column 1 and Column 2 */}
        <div
          onMouseDown={startResizing}
          className="hidden md:flex w-2 bg-[#141414] hover:bg-[#FF6200] cursor-col-resize items-center justify-center border-r border-[#2E2E2E] group transition-colors select-none z-10"
          title="Drag sidewise to expand or reduce left panel width"
        >
          <GripVertical className="w-3 h-3 text-[#888898] group-hover:text-white" />
        </div>

        {/* COLUMN 2: Middle Well-Fitted Screen with Zoom Controls & A4 Live Preview */}
        <div
          className={`flex-1 bg-[#111111] overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-start space-y-5 ${
            mobileTab === "preview" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Zoom Controls Bar */}
          <div className="w-full flex items-center justify-between gap-4 max-w-[210mm] bg-[#141414] border border-[#2E2E2E] p-2.5 rounded-2xl">
            <ZoomControls />
            {!canExport && (
              <Button
                size="sm"
                onClick={() => setPricingOpen(true)}
                className="h-8 px-3 bg-[#FF6200] hover:bg-[#E55700] text-white font-bold text-xs rounded-full gap-1.5 shadow-md shadow-[#FF6200]/20"
              >
                <Crown className="w-3.5 h-3.5" /> Purchase Plan
              </Button>
            )}
          </div>

          {/* Live A4 Render Canvas */}
          <div className="w-full flex justify-center overflow-x-auto pb-12" style={{ minHeight: "550px" }}>
            <A4MultiPageWrapper>
              <div ref={resumeRef} className="resume-protected w-[210mm] bg-white text-black shadow-2xl rounded-sm">
                <ResumeRenderer data={data} accent={accentColor} font={fontFamily} template={template} />
              </div>
            </A4MultiPageWrapper>
          </div>
        </div>

        {/* COLUMN 3: Right AI Intelligence & Content Optimizer Panel */}
        <div
          className={`w-full xl:w-[360px] 2xl:w-[380px] shrink-0 h-full overflow-y-auto ${
            mobileTab === "ai" ? "block" : "hidden xl:block"
          }`}
        >
          <AiCopilotPanel />
        </div>
      </div>

      {/* AI Drawer Modal for Tablet/Small Desktop */}
      <Dialog open={aiPanelOpen} onOpenChange={setAiPanelOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto bg-[#141414] border-[#2E2E2E] text-white p-4 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-bricolage text-lg font-bold text-white">AI Intelligence Workbench</DialogTitle>
          </DialogHeader>
          <AiCopilotPanel />
        </DialogContent>
      </Dialog>

      {/* Controlled Pricing Dialog */}
      <PricingDialog
        currentPlan={user?.plan || "free"}
        onSubscribed={refresh}
        open={pricingOpen}
        onOpenChange={setPricingOpen}
      />

      {/* PDF Export Live Preview Dialog */}
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
