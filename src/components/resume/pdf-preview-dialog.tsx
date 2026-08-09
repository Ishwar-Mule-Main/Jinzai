"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      toast.info("Generating high-precision vector ATS PDF...");
      await downloadPdfDirectly(data, font, template);
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
      <DialogContent className="max-w-4xl sm:max-w-5xl w-[95vw] max-h-[92vh] flex flex-col bg-[#141414] border border-[#2E2E2E] text-white p-6 sm:p-8">
        <DialogHeader className="space-y-1.5 shrink-0">
          <DialogTitle className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold text-white">
            <div className="w-9 h-9 rounded-xl bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#FF6200]" />
            </div>
            PDF Export Preview
          </DialogTitle>
          <DialogDescription className="text-[#888898] text-xs sm:text-sm">
            Review how your resume will look when downloaded. Click <strong className="text-white">Export / Download Now</strong> to save the vector PDF.
          </DialogDescription>
        </DialogHeader>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 py-2 border-b border-[#2E2E2E] shrink-0">
          <Badge className="bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 gap-1 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% ATS Vector Compliant
          </Badge>
          <Badge className="bg-[#1A1A1A] text-[#888898] border border-[#2E2E2E] gap-1 text-[11px] font-mono">
            <FileText className="w-3.5 h-3.5 text-[#FF6200]" /> A4 Standard Format
          </Badge>
          <Badge className="bg-[#FF6200]/10 text-[#FF6200] border border-[#FF6200]/30 gap-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5" /> High Precision Render
          </Badge>
        </div>

        {/* Live A4 Preview Container */}
        <div className="flex-1 overflow-y-auto min-h-[380px] max-h-[550px] my-3 p-4 bg-[#0A0A0B] rounded-2xl border border-[#2E2E2E] flex justify-center items-start">
          <div className="bg-white text-black shadow-2xl rounded-sm overflow-hidden w-full max-w-[700px] border border-gray-300 transform scale-[0.90] origin-top transition-all">
            <ResumeRenderer data={data} accent={accent} font={font} template={template} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#2E2E2E] shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 px-5 border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#222222] rounded-full text-xs font-semibold"
          >
            Cancel
          </Button>

          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="h-11 px-8 gap-2 bg-[#FF6200] hover:bg-[#E55700] text-white font-bold rounded-full shadow-xl shadow-[#FF6200]/30 hover:shadow-[#FF6200]/50 text-sm transition-all duration-300"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Vector PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export / Download Now →
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
