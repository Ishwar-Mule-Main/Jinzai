"use client";

import { useResumeStore } from "@/lib/resume/store";
import { getSampleProfile } from "@/lib/resume/sample-profiles";
import { ResumeRenderer } from "./resume-renderer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, ImageIcon, FileText } from "lucide-react";
import type { TEMPLATES } from "@/lib/resume/types";

export type TemplateItem = (typeof TEMPLATES)[number];
export type TemplateLevel = "Basic" | "College" | "Advanced";

export function getTemplateLevel(t: { id: string; name: string; tags: string[]; premium?: boolean }): TemplateLevel {
  const tagsStr = t.tags.join(" ").toLowerCase();
  const idStr = t.id.toLowerCase();
  const nameStr = t.name.toLowerCase();

  if (
    tagsStr.includes("college") ||
    tagsStr.includes("student") ||
    tagsStr.includes("academic") ||
    tagsStr.includes("entry") ||
    tagsStr.includes("intern") ||
    tagsStr.includes("fresh") ||
    idStr.includes("college") ||
    idStr.includes("student") ||
    idStr.includes("academic") ||
    nameStr.includes("college") ||
    nameStr.includes("student") ||
    nameStr.includes("academic")
  ) {
    return "College";
  }

  if (
    t.premium ||
    tagsStr.includes("executive") ||
    tagsStr.includes("sidebar") ||
    tagsStr.includes("banner") ||
    tagsStr.includes("creative") ||
    tagsStr.includes("advanced") ||
    tagsStr.includes("pro") ||
    idStr.includes("executive") ||
    idStr.includes("banner") ||
    idStr.includes("sidebar")
  ) {
    return "Advanced";
  }

  return "Basic";
}

const LEVEL_STYLES: Record<TemplateLevel, string> = {
  Basic: "bg-[#1a1a1a] text-[#888888] border border-[#2a2a2a]",
  College: "bg-[#1a1a1a] text-[#22c55e] border border-[#22c55e]/30",
  Advanced: "bg-[#faff69] text-[#0a0a0a] border border-[#faff69]/40 font-bold",
};

export function TemplateCard({
  id: template,
  index,
  user,
  onAuthRequired,
  onSelect,
}: {
  id: TemplateItem;
  index: number;
  user?: { plan: string } | null;
  onAuthRequired?: () => void;
  onSelect?: () => void;
}) {
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setView = useResumeStore((s) => s.setView);
  const sampleData = getSampleProfile(index);
  const level = getTemplateLevel(template);

  const handleUseTemplate = () => {
    if (onSelect) {
      onSelect();
      return;
    }
    if (user === null && onAuthRequired) {
      onAuthRequired();
      return;
    }
    setTemplate(template.id);
    setView("editor");
  };

  return (
    <div className="overflow-hidden group hover:border-[#3a3a3a] transition-all duration-200 border border-[#2a2a2a] bg-[#1a1a1a] rounded-xl flex flex-col justify-between w-full h-full">
      {/* Equal Shape Thumbnail Box */}
      <div className="bg-white overflow-hidden relative border-b border-[#2a2a2a] aspect-[3/4] w-full">
        {/* Render live scaled preview */}
        <div className="origin-top-left absolute top-0 left-0 pointer-events-none w-[250%] min-h-[800px] scale-[0.40]">
          <ResumeRenderer
            data={sampleData}
            accent={template.accentDefault}
            font={template.fontDefault}
            template={template.id}
          />
        </div>

        {/* Hover backdrop + Use This Template CTA Button */}
        <div className="absolute inset-0 bg-[#0a0a0a]/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4 z-20">
          <button
            onClick={handleUseTemplate}
            className="h-10 gap-2 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md px-5 text-xs transition-transform duration-150 group-hover:scale-105 inline-flex items-center"
          >
            <FileText className="w-4 h-4" /> Use Template
          </button>
        </div>

        {/* Top-Right Badges (PRO / Photo) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
          {template.premium && (
            <span className="bg-[#faff69] text-[#0a0a0a] font-bold text-[10px] uppercase tracking-wider rounded-full px-2.5 py-0.5 shadow-sm inline-flex items-center gap-1">
              <Crown className="w-2.5 h-2.5" /> PRO
            </span>
          )}
          {template.hasPhoto && (
            <span className="bg-[#0a0a0a]/90 text-white border border-[#2a2a2a] text-[10px] font-mono rounded-full px-2 py-0.5 backdrop-blur-xs inline-flex items-center gap-1">
              <ImageIcon className="w-2.5 h-2.5" /> Photo
            </span>
          )}
        </div>
      </div>

      {/* Clean Bottom Footer: Title + 1-Word Level Badge Only */}
      <div className="p-4 flex items-center justify-between gap-2 bg-[#1a1a1a]">
        <h3 className="font-sans font-semibold text-sm text-white truncate min-w-0" title={template.name}>
          {template.name}
        </h3>
        <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide ${LEVEL_STYLES[level]}`}>
          {level}
        </span>
      </div>
    </div>
  );
}
