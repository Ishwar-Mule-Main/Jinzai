"use client";

import { ResumeRenderer } from "@/components/resume/resume-renderer";
import { ResumeData, TemplateId } from "@/lib/resume/types";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileText } from "lucide-react";

export default function SharedResumeClient({
  data,
  template,
  accent,
  font,
  title,
}: {
  data: ResumeData;
  template: TemplateId;
  accent: string;
  font: string;
  title: string;
}) {
  const print = () => window.print();
  const name = data.personalInfo?.fullName || title;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
      {/* Header bar */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-30 print:hidden">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">{name}</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Shared via Jinzai</p>
            </div>
          </div>
          <Button size="sm" onClick={print} className="gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
            <Download className="w-3.5 h-3.5" /> Download PDF
          </Button>
        </div>
      </header>

      {/* Resume */}
      <div className="flex-1 flex justify-center py-8 print:py-0">
        <div
          className="bg-white shadow-2xl shadow-slate-400/30 print:shadow-none"
          style={{ width: "210mm", minHeight: "297mm" }}
        >
          <ResumeRenderer data={data} accent={accent} font={font} template={template} />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 print:hidden">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-muted-foreground">
          Built with <span className="font-semibold text-teal-600 dark:text-teal-400">Jinzai</span> — create your own professional resume for free.
        </div>
      </footer>
    </div>
  );
}
