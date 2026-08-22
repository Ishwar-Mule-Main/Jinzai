"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { useResumeStore } from "@/lib/resume/store";
import { isPaidPlan } from "@/lib/resume/plans";
import { ResumeRenderer } from "@/components/resume/resume-renderer";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { AiCopilotPanel } from "@/components/resume/ai-copilot-panel";
import { A4MultiPageWrapper } from "@/components/resume/a4-multi-page-wrapper";
import { ZoomControls } from "@/components/resume/zoom-controls";
import { PricingDialog } from "@/components/resume/pricing-dialog";
import { PdfPreviewDialog } from "@/components/resume/pdf-preview-dialog";
import { SupportDialog } from "@/components/resume/support-dialog";
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
  CheckCircle2,
  GripVertical,
  Maximize2,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function EditorPage() {
  const router = useRouter();
  const { user, refresh } = useCurrentUser();
  const resumeRef = useRef<HTMLDivElement>(null);
  const centerColumnRef = useRef<HTMLDivElement>(null);

  // Layout States
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  // Zoom & Auto-Fit State
  const [zoom, setZoom] = useState(0.85);
  const [isAutoFit, setIsAutoFit] = useState(true);

  // Section Navigation & Highlight State
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Draggable Left Panel Width state
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

  const canExport = user ? isPaidPlan(user.plan) : false;

  // Auto-fit calculation
  const calculateFitZoom = useCallback(() => {
    if (!centerColumnRef.current) return 0.85;
    const availableWidth = centerColumnRef.current.clientWidth - 56; // container padding
    // A4 width in px is ~794px
    const fit = Math.min(1.35, Math.max(0.38, +(availableWidth / 794).toFixed(2)));
    return fit;
  }, []);

  // ResizeObserver on middle preview column for automatic fit
  useEffect(() => {
    const el = centerColumnRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      if (isAutoFit) {
        const fit = calculateFitZoom();
        setZoom(fit);
      }
    });

    observer.observe(el);
    // Initial calculate
    if (isAutoFit) {
      setZoom(calculateFitZoom());
    }

    return () => observer.disconnect();
  }, [isAutoFit, calculateFitZoom, leftPanelWidth]);

  // Handle Fit to Width button
  const handleFitToWidth = () => {
    setIsAutoFit(true);
    const fit = calculateFitZoom();
    setZoom(fit);
    toast.info(`Fitted preview to screen (${Math.round(fit * 100)}%)`);
  };

  // Handle Manual Zoom Change
  const handleManualZoomChange = (newZoom: number) => {
    setIsAutoFit(false);
    setZoom(newZoom);
  };

  // Handle Clickable Preview Section Navigation
  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    setHighlightedSection(section);
    if (mobileTab === "preview") {
      setMobileTab("edit");
    }

    // Scroll editor to section
    setTimeout(() => {
      const el = document.getElementById(`editor-section-${section}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);

    const sectionNames: Record<string, string> = {
      personal: "Personal Information",
      summary: "Professional Summary",
      experience: "Work Experience",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
      certifications: "Certifications",
      languages: "Languages",
      custom: "Custom Section",
    };

    toast.info(`Editing ${sectionNames[section] || section}`, {
      duration: 2000,
    });

    setTimeout(() => {
      setHighlightedSection(null);
    }, 2500);
  };

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
      toast.info("Downloading requires an active plan. Purchase a plan to export vector PDFs!");
      setPricingOpen(true);
      return;
    }
    setPdfPreviewOpen(true);
  };

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden selection:bg-[#faff69] selection:text-[#0a0a0a]">
      {/* ── Top Announcement Banner for Free Users ── */}
      {!canExport && (
        <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-2 flex items-center justify-between gap-3 text-xs shrink-0 z-50">
          <div className="flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 text-[#faff69] shrink-0" />
            <span className="text-[#cccccc]">
              <strong className="text-white font-semibold">Free Account:</strong> You are currently drafting for free. Activate a pass to unlock high-precision vector PDF exports.
            </span>
          </div>
          <button
            onClick={() => setPricingOpen(true)}
            className="h-7 px-3 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md text-[11px] shrink-0 inline-flex items-center gap-1 transition-colors"
          >
            <Crown className="w-3 h-3" /> Upgrade to Export
          </button>
        </div>
      )}

      {/* ── Clean Top Header ── */}
      <header className="bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a] shrink-0 z-40">
        <div className="max-w-[1800px] mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Left: Back to Dashboard + Resume Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push("/dashboard")}
              className="h-9 px-3 rounded-md border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] text-xs font-semibold gap-1.5 shrink-0 inline-flex items-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#faff69]" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume title…"
              className="hidden sm:flex h-9 w-48 sm:w-64 bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#faff69] text-white font-medium text-xs rounded-md px-3 outline-none transition-colors"
            />
          </div>

          {/* Center: Save status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#888888] font-mono">
            {saving ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin text-[#faff69]" /> Saving resume…</>
            ) : saved ? (
              <><CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> Saved to cloud</>
            ) : null}
          </div>

          {/* Right Toolbar */}
          <div className="flex items-center gap-2">
            <SupportDialog />

            <button
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className="xl:hidden h-9 px-3 rounded-md border border-[#2a2a2a] bg-[#1a1a1a] text-white text-xs gap-1.5 hover:border-[#faff69] inline-flex items-center font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#faff69]" />
              <span className="hidden sm:inline">AI Suite</span>
            </button>

            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="hidden sm:inline-flex items-center h-9 px-3.5 rounded-md border border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#242424] text-white text-xs font-semibold gap-1.5 transition-colors"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#faff69]" /> : <Save className="w-3.5 h-3.5 text-[#faff69]" />}
              Save
            </button>

            {!canExport && (
              <button
                onClick={() => setPricingOpen(true)}
                className="h-9 px-3.5 rounded-md border border-[#faff69]/40 bg-[#1a1a1a] text-[#faff69] hover:bg-[#242424] font-semibold text-xs gap-1.5 inline-flex items-center transition-colors"
              >
                <Crown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upgrade</span>
              </button>
            )}

            <button
              onClick={handleExportPDF}
              className="h-9 px-4 rounded-md bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs gap-1.5 inline-flex items-center transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Navigation Tabs ── */}
      <div className="md:hidden bg-[#0a0a0a] border-b border-[#2a2a2a] px-4 py-2 shrink-0">
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-xs font-semibold">
          <button
            onClick={() => setMobileTab("edit")}
            className={`py-1.5 px-2 rounded-md font-semibold flex items-center justify-center gap-1 transition-all ${
              mobileTab === "edit" ? "bg-[#faff69] text-[#0a0a0a]" : "text-[#888888]"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`py-1.5 px-2 rounded-md font-semibold flex items-center justify-center gap-1 transition-all ${
              mobileTab === "preview" ? "bg-[#faff69] text-[#0a0a0a]" : "text-[#888888]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <button
            onClick={() => setMobileTab("ai")}
            className={`py-1.5 px-2 rounded-md font-semibold flex items-center justify-center gap-1 transition-all ${
              mobileTab === "ai" ? "bg-[#faff69] text-[#0a0a0a]" : "text-[#888888]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Suite
          </button>
        </div>
      </div>

      {/* ── Fixed Workspace Height Container with Independent Scrolling Columns ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
        {/* COLUMN 1: Left Form & Design Panel */}
        <div
          style={{ width: `${leftPanelWidth}px` }}
          className={`bg-[#0a0a0a] border-r border-[#2a2a2a] overflow-y-auto p-4 sm:p-5 h-full shrink-0 ${
            mobileTab === "edit" ? "block w-full md:w-auto" : "hidden md:block"
          }`}
        >
          <ResumeEditor
            activeSection={activeSection}
            highlightedSection={highlightedSection}
          />
        </div>

        {/* DRAG RESIZER BAR */}
        <div
          onMouseDown={startResizing}
          className="hidden md:flex w-2 bg-[#121212] hover:bg-[#faff69] cursor-col-resize items-center justify-center border-r border-[#2a2a2a] group transition-colors select-none z-10 h-full"
          title="Drag sidewise to expand or reduce left panel width"
        >
          <GripVertical className="w-3 h-3 text-[#888888] group-hover:text-[#0a0a0a]" />
        </div>

        {/* COLUMN 2: Center Fixed Preview Screen */}
        <div
          ref={centerColumnRef}
          className={`flex-1 bg-[#121212] overflow-y-auto h-full p-3 sm:p-5 flex flex-col items-center justify-start space-y-4 ${
            mobileTab === "preview" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Zoom & Screen Fit Controls Bar */}
          <div className="w-full flex items-center justify-between gap-3 max-w-[210mm] bg-[#1a1a1a] border border-[#2a2a2a] p-2 rounded-xl shrink-0 shadow-lg">
            <ZoomControls
              zoom={zoom}
              setZoom={handleManualZoomChange}
              isAutoFit={isAutoFit}
              onFitToWidth={handleFitToWidth}
              onFullscreen={() => setFullscreenOpen(true)}
            />
            {!canExport && (
              <button
                onClick={() => setPricingOpen(true)}
                className="h-8 px-3 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs rounded-md gap-1.5 inline-flex items-center transition-colors shrink-0"
              >
                <Crown className="w-3.5 h-3.5" /> Upgrade Plan
              </button>
            )}
          </div>

          {/* Live A4 Render Canvas with Zoom Scale & Section Click Navigation */}
          <div className="w-full flex justify-center pb-12 pt-1 overflow-x-auto">
            <A4MultiPageWrapper
              zoom={zoom}
              onSectionClick={handleSectionClick}
              clickable={true}
            >
              <div
                ref={resumeRef}
                className="resume-protected w-[210mm] bg-white text-black shadow-2xl rounded-sm"
              >
                <ResumeRenderer
                  data={data}
                  accent={accentColor}
                  font={fontFamily}
                  fontSize={fontSize}
                  template={template}
                />
              </div>
            </A4MultiPageWrapper>
          </div>
        </div>

        {/* COLUMN 3: Right AI Intelligence Panel */}
        <div
          className={`w-full xl:w-[380px] 2xl:w-[400px] shrink-0 h-full overflow-y-auto bg-[#0a0a0a] border-l border-[#2a2a2a] ${
            mobileTab === "ai" ? "block" : "hidden xl:block"
          }`}
        >
          <AiCopilotPanel />
        </div>
      </div>

      {/* AI Drawer Modal for Tablet/Small Screens */}
      <Dialog open={aiPanelOpen} onOpenChange={setAiPanelOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto bg-[#1a1a1a] border-[#2a2a2a] text-white p-4 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white tracking-tight">
              AI Intelligence Suite
            </DialogTitle>
          </DialogHeader>
          <AiCopilotPanel />
        </DialogContent>
      </Dialog>

      {/* Fullscreen Lightbox Preview Modal */}
      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto bg-[#0a0a0a] border-[#2a2a2a] text-white p-6 rounded-2xl">
          <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#2a2a2a]">
            <DialogTitle className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-[#faff69]" />
              Fullscreen Resume Preview
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 flex justify-center items-start overflow-auto">
            <A4MultiPageWrapper zoom={1.0} clickable={false}>
              <div className="w-[210mm] bg-white text-black shadow-2xl rounded-sm">
                <ResumeRenderer
                  data={data}
                  accent={accentColor}
                  font={fontFamily}
                  fontSize={fontSize}
                  template={template}
                />
              </div>
            </A4MultiPageWrapper>
          </div>
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
