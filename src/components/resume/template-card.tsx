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
  Basic: "bg-[#222222] text-[#A0A0B0] border border-[#333333]",
  College: "bg-teal-950/70 text-teal-300 border border-teal-800/60",
  Advanced: "bg-[#FF6200]/15 text-[#FF6200] border border-[#FF6200]/30",
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
    <Card className="overflow-hidden group hover:shadow-2xl hover:shadow-[#FF6200]/15 transition-all duration-300 hover:-translate-y-1.5 border-[#2E2E2E] hover:border-[#FF6200]/60 bg-[#141414] rounded-2xl flex flex-col justify-between w-full h-full">
      {/* Equal Shape Thumbnail Box */}
      <div className="bg-white overflow-hidden relative border-b border-[#2E2E2E] aspect-[3/4] w-full">
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-20">
          <Button
            size="sm"
            onClick={handleUseTemplate}
            className="h-10 gap-2 bg-[#FF6200] hover:bg-[#E55700] text-white font-bold rounded-full shadow-xl shadow-[#FF6200]/40 px-6 text-xs transition-transform duration-200 group-hover:scale-105"
          >
            <FileText className="w-4 h-4" /> Use This Template
          </Button>
        </div>

        {/* Top-Right Badges (PRO / Photo) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
          {template.premium && (
            <Badge className="bg-[#FF6200] text-white border-0 gap-1 text-[9px] font-mono shadow-md px-2 py-0.5">
              <Crown className="w-2.5 h-2.5" /> PRO
            </Badge>
          )}
          {template.hasPhoto && (
            <Badge className="bg-black/80 text-white border border-white/10 gap-1 text-[9px] font-mono backdrop-blur-xs">
              <ImageIcon className="w-2.5 h-2.5" /> Photo
            </Badge>
          )}
        </div>
      </div>

      {/* Clean Bottom Footer: Title + 1-Word Level Badge Only */}
      <div className="p-4 flex items-center justify-between gap-2 bg-[#141414]">
        <h3 className="font-bricolage font-bold text-sm text-white truncate min-w-0" title={template.name}>
          {template.name}
        </h3>
        <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wide ${LEVEL_STYLES[level]}`}>
          {level}
        </span>
      </div>
    </Card>
  );
}
