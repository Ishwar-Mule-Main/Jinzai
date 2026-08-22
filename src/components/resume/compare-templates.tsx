"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES } from "@/lib/resume/types";
import { TemplateThumbnail } from "./template-thumbnail";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Columns3, Check, X } from "lucide-react";
import { toast } from "sonner";

export function CompareTemplatesDialog() {
  const template = useResumeStore((s) => s.template);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-9 px-3 gap-1.5 text-xs text-[#cccccc] hover:text-white bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] rounded-md font-semibold inline-flex items-center transition-colors">
          <Columns3 className="w-3.5 h-3.5 text-[#faff69]" /> Compare
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
            <Columns3 className="w-5 h-5 text-[#faff69]" /> Compare Layout Engines
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888888]">
            Browse and compare all {TEMPLATES.length} templates. Select any card to switch.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
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
                className={`text-left rounded-xl border overflow-hidden transition-all bg-[#121212] ${
                  isActive ? "border-[#faff69] ring-1 ring-[#faff69]" : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                }`}
              >
                <div className="aspect-[3/4] bg-[#0a0a0a] overflow-hidden relative">
                  <TemplateThumbnail templateId={t.id} className="w-full h-full" />
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 bg-[#faff69] text-[#0a0a0a] rounded-full w-5 h-5 flex items-center justify-center shadow">
                      <Check className="w-3 h-3 font-bold" />
                    </div>
                  )}
                </div>
                <div className="p-2.5 bg-[#121212]">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-white truncate">{t.name}</p>
                    {isActive && <span className="text-[8px] font-mono font-bold bg-[#faff69] text-[#0a0a0a] px-1 rounded">Active</span>}
                  </div>
                  <p className="text-[9px] text-[#888888] font-mono line-clamp-1">{t.tags.join(" · ")}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-[#2a2a2a] p-3 bg-[#121212] flex items-center justify-between gap-3 mt-4">
          <p className="text-xs text-[#888888]">
            Switch templates anytime — all resume content remains preserved with 100% fidelity.
          </p>
          <button onClick={() => setOpen(false)} className="h-8 px-3 rounded-md bg-[#1a1a1a] hover:bg-[#242424] text-white text-xs font-semibold gap-1 inline-flex items-center transition-colors">
            <X className="w-3.5 h-3.5" /> Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
