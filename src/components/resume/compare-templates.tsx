"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES } from "@/lib/resume/types";
import { ResumeRenderer } from "./resume-renderer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Columns3, Check, X } from "lucide-react";
import { toast } from "sonner";

export function CompareTemplatesDialog() {
  const data = useResumeStore((s) => s.data);
  const accent = useResumeStore((s) => s.accentColor);
  const font = useResumeStore((s) => s.fontFamily);
  const template = useResumeStore((s) => s.template);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const [open, setOpen] = useState(false);

  const hasContent = data.personalInfo.fullName || data.summary || data.experience.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Columns3 className="w-3.5 h-3.5" /> Compare
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Columns3 className="w-5 h-5 text-teal-600" /> Compare Templates
          </DialogTitle>
          <DialogDescription>
            See how your resume looks across all 8 templates. Click any template to switch to it.
            {!hasContent && " Add some content first to see meaningful previews."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {TEMPLATES.map((t) => {
            const isActive = template === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTemplate(t.id);
                  toast.success(`Switched to ${t.name}`);
                  setOpen(false);
                }}
                className={`text-left rounded-xl border-2 overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${
                  isActive ? "border-teal-500 ring-2 ring-teal-500/20" : "border-border"
                }`}
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden relative">
                  <div className="origin-top-left scale-[0.18] w-[800px] absolute top-0 left-0 pointer-events-none">
                    <ResumeRenderer data={data} accent={accent} font={font} template={t.id} />
                  </div>
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  {!hasContent && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground">Empty preview</span>
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold truncate">{t.name}</p>
                    {isActive && <Badge className="text-[8px] py-0 px-1 h-3.5">Active</Badge>}
                  </div>
                  <p className="text-[9px] text-muted-foreground line-clamp-1">{t.tags.join(" · ")}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border p-3 bg-muted/30 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Tip: Use the same accent color across all templates for fair comparison. Switch templates anytime — your content stays the same.
          </p>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="gap-1.5 shrink-0">
            <X className="w-3.5 h-3.5" /> Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
