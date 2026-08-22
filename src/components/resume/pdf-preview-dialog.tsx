"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, FileText, CheckCircle2, Loader2, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ResumeRenderer } from "./resume-renderer";
import { downloadPdfDirectly } from "@/lib/resume/pdf-export";
import type { ResumeData } from "@/lib/resume/types";

export function PdfPreviewDialog({
  open,
  onOpenChange,
  data,
  accent,
  font,
  template,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ResumeData;
  accent: string;
  font: string;
  template: string;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      toast.info("Generating high-precision vector ATS PDF...");
      await downloadPdfDirectly(previewRef.current, data.personalInfo.fullName || "Resume");
      toast.success("Resume PDF downloaded successfully!");
      onOpenChange(false);
    } catch {
      toast.error("Could not download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl sm:max-w-5xl w-[95vw] max-h-[92vh] flex flex-col bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 sm:p-8 rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader className="space-y-1.5 shrink-0">
          <DialogTitle className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold text-white tracking-tight">
            <div className="w-8 h-8 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69]">
              <Eye className="w-4 h-4" />
            </div>
            PDF Export Preview
          </DialogTitle>
          <DialogDescription className="text-[#888888] text-xs">
            Review how your resume will render when downloaded. Click <strong className="text-white">Download PDF</strong> to save vector document.
          </DialogDescription>
        </DialogHeader>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 py-2 border-b border-[#2a2a2a] shrink-0 font-mono text-[11px]">
          <span className="bg-[#121212] text-[#22c55e] border border-[#2a2a2a] px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% ATS Vector Compliant
          </span>
          <span className="bg-[#121212] text-[#cccccc] border border-[#2a2a2a] px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#faff69]" /> A4 Standard Format
          </span>
          <span className="bg-[#121212] text-[#faff69] border border-[#2a2a2a] px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> High Precision Render
          </span>
        </div>

        {/* Live A4 Preview Container */}
        <div className="flex-1 overflow-y-auto min-h-[380px] max-h-[550px] my-3 p-4 bg-[#0a0a0a] rounded-xl border border-[#2a2a2a] flex justify-center items-start">
          <div ref={previewRef} className="bg-white text-black shadow-2xl rounded-sm overflow-hidden w-full max-w-[700px] border border-gray-300 transform scale-[0.90] origin-top transition-all">
            <ResumeRenderer data={data} accent={accent} font={font} template={template as any} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#2a2a2a] shrink-0">
          <button
            onClick={() => onOpenChange(false)}
            className="h-10 px-5 border border-[#2a2a2a] bg-[#121212] hover:bg-[#242424] text-white rounded-md text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="h-10 px-6 gap-2 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md text-xs transition-colors inline-flex items-center justify-center disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Vector PDF…
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF Now
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
