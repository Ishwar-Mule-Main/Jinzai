"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

import {
  ArrowLeft,
  LayoutGrid,
  Palette,
  Type,
  Download,
  Save,
  Sparkles,
  Target,
  Gauge,
  Mail,
  Loader2,
  Crown,
  Check,
  Undo2,
  Redo2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

const ACCENT_COLORS = [
  { name: "Teal", value: "#0f766e" },
  { name: "Electric Orange", value: "#FF6200" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Emerald", value: "#047857" },
  { name: "Violet", value: "#6d28d9" },
  { name: "Rose", value: "#be123c" },
  { name: "Charcoal", value: "#334155" },
];

export default function EditorPage() {
  const router = useRouter();
  const { user, refresh } = useCurrentUser();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const title = useResumeStore((s) => s.title);
  const setTitle = useResumeStore((s) => s.setTitle);
  const template = useResumeStore((s) => s.template);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const accentColor = useResumeStore((s) => s.accentColor);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);
  const fontFamily = useResumeStore((s) => s.fontFamily);
  const setFontFamily = useResumeStore((s) => s.setFontFamily);
  const data = useResumeStore((s) => s.data);

  const planConfig = user ? getPlanConfig(user.plan) : getPlanConfig("free");
  const canExport = user ? isPaidPlan(user.plan) : false;

  const handleExportPDF = async () => {
    if (!canExport) {
      toast.error(`Export requires a paid plan. Please upgrade your ${planConfig.name} account.`);
      return;
    }
    if (!resumeRef.current) {
      toast.error("Resume preview not ready");
      return;
    }
    setExporting(true);
    const toastId = toast.loading("Generating 100% Vector ATS PDF...");
    try {
      await downloadPdfDirectly(resumeRef.current, title);
      toast.success("Vector PDF downloaded directly!", { id: toastId });
    } catch (err) {
      console.error("PDF Export error:", err);
      toast.error("Direct download fallback print", { id: toastId });
      window.print();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-[#FF6200] selection:text-white">
      {/* Editor SaaS Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-[#2E2E2E]">
        <div className="max-w-[1800px] mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="h-9 px-3 rounded-full border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] text-xs gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF6200]" /> Dashboard
            </Button>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 w-44 sm:w-64 bg-[#141414] border-[#2E2E2E] focus:border-[#FF6200] text-white font-bricolage font-bold text-sm rounded-xl"
            />
          </div>

          {/* Controls toolbar */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {/* Template selector */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-3 rounded-xl border-[#2E2E2E] bg-[#141414] text-white text-xs gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-[#FF6200]" /> {template}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-[#141414] border-[#2E2E2E] text-white max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-bricolage text-2xl font-bold">Switch Master Template</DialogTitle>
                  <DialogDescription className="text-xs text-[#888898]">Pick from 72 templates — content updates live with zero data loss.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        template === t.id ? "border-[#FF6200] bg-[#FF6200]/10 ring-2 ring-[#FF6200]/20" : "border-[#2E2E2E] bg-[#0B0B0C] hover:border-[#FF6200]/40"
                      }`}
                    >
                      <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2">
                        <TemplateThumbnail templateId={t.id} className="w-full h-full object-cover" />
                      </div>
                      <p className="font-bricolage text-xs font-bold text-white truncate">{t.name}</p>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Color Accent Picker */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-3 rounded-xl border-[#2E2E2E] bg-[#141414] text-white text-xs gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#FF6200]" /> Accent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-[#141414] border-[#2E2E2E] text-white">
                <DialogHeader>
                  <DialogTitle className="font-bricolage text-xl font-bold">Choose Accent Color</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-3 pt-3">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setAccentColor(c.value)}
                      className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-mono transition-all ${
                        accentColor === c.value ? "border-[#FF6200] bg-[#FF6200]/10" : "border-[#2E2E2E] bg-[#0B0B0C]"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: c.value }} />
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* AI Assistant Tools */}
            <ResumeScoreDialog />
            <AtsDialog />
            <CoverLetterDialog />

            {/* Export PDF */}
            <Button
              onClick={handleExportPDF}
              disabled={exporting}
              size="sm"
              className="h-9 px-4 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold text-xs gap-1.5 shadow-md shadow-[#FF6200]/20"
            >
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {exporting ? "Exporting..." : "Export Vector PDF"}
            </Button>
          </div>
        </div>
      </header>

      {/* Workspace 2-Panel Grid */}
      <div className="flex-1 max-w-[1800px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-64px)]">
        {/* Left Form Inputs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <Card className="p-6 bg-[#141414] border-[#2E2E2E] rounded-2xl flex-1 max-h-[calc(100vh-100px)] overflow-y-auto">
            <ResumeEditor />
          </Card>
        </div>

        {/* Right Preview Panel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between bg-[#141414] border border-[#2E2E2E] px-4 py-2 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#888898]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6200]" /> A4 Vector Live Preview
            </div>
            <ZoomControls />
          </div>

          <div className="flex-1 bg-[#0B0B0C] border border-[#2E2E2E] rounded-2xl p-6 overflow-auto flex justify-center items-start">
            <A4MultiPageWrapper>
              <div ref={resumeRef} className="resume-protected w-[210mm] bg-white text-black shadow-2xl">
                <ResumeRenderer data={data} accent={accentColor} font={fontFamily} template={template} />
              </div>
            </A4MultiPageWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
