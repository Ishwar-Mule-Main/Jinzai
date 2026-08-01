"use client";

import type { TemplateSpec, VisualArchetype } from "@/lib/resume/template-specs";
import type { TemplateId } from "@/lib/resume/types";
import { TEMPLATES } from "@/lib/resume/types";
import { SPEC_MAP } from "@/lib/resume/template-specs";

// Fast CSS-only thumbnail representing a template's visual style.
// Used in the dashboard gallery + compare dialog for performance.
export function TemplateThumbnail({ templateId, className = "" }: { templateId: TemplateId; className?: string }) {
  const meta = TEMPLATES.find((t) => t.id === templateId);
  const spec = SPEC_MAP[templateId];
  const accent = spec?.accent || meta?.accentDefault || "#0f766e";
  const accent2 = spec?.accent2;

  // The 8 original templates have distinct thumbnail styles
  if (!spec) {
    return <OriginalThumbnail templateId={templateId} accent={accent} />;
  }

  return <SpecThumbnail spec={spec} accent={accent} accent2={accent2} className={className} />;
}

function Lines({ count = 3, color = "#d1d5db", className = "" }: { count?: number; color?: string; className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-0.5 rounded-full" style={{ background: color, width: `${85 - i * 12}%` }} />
      ))}
    </div>
  );
}

function HeadingBar({ accent, label }: { accent: string; label: string }) {
  return (
    <div className="flex items-center gap-1 mb-1">
      <div className="h-1 w-6 rounded-full" style={{ background: accent }} />
      <span className="text-[5px] font-bold uppercase tracking-wide" style={{ color: accent }}>{label}</span>
    </div>
  );
}

function SpecThumbnail({ spec, accent, accent2, className }: { spec: TemplateSpec; accent: string; accent2?: string; className?: string }) {
  const archetype: VisualArchetype = spec.visualArchetype || "minimal-swiss";

  // 1. TIMELINE ARCHETYPE THUMBNAIL
  if (archetype === "timeline") {
    return (
      <div className={`h-full bg-white p-1.5 flex flex-col ${className}`}>
        <div className="space-y-0.5 mb-1 pb-1 border-b" style={{ borderColor: accent }}>
          <div className="h-1.5 w-1/2 rounded-full" style={{ background: accent }} />
          <div className="h-0.5 w-1/3 rounded-full bg-gray-300" />
        </div>
        <div className="flex-1 pl-2 border-l-2 space-y-1.5" style={{ borderColor: accent }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative">
              <div className="w-1.5 h-1.5 rounded-full absolute -left-[11px] top-0.5" style={{ background: accent }} />
              <div className="h-1 w-2/3 rounded-full" style={{ background: accent }} />
              <Lines count={2} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. CARD BLOCKS ARCHETYPE THUMBNAIL
  if (archetype === "card-blocks") {
    return (
      <div className={`h-full bg-slate-50 p-1.5 flex flex-col gap-1 ${className}`}>
        <div className="p-1 rounded bg-white border border-slate-200 shadow-2xs space-y-0.5">
          <div className="h-1.5 w-1/2 rounded-full" style={{ background: accent }} />
          <div className="h-0.5 w-1/3 rounded-full bg-slate-300" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="p-1 rounded bg-white border-l-2 shadow-2xs space-y-0.5" style={{ borderColor: accent }}>
            <div className="h-1 w-3/4 rounded-full" style={{ background: accent }} />
            <Lines count={2} />
          </div>
        ))}
      </div>
    );
  }

  // 3. EDITORIAL ARCHETYPE THUMBNAIL
  if (archetype === "editorial") {
    return (
      <div className={`h-full bg-[#FAF8F5] p-1 flex flex-col ${className}`}>
        <div className="border border-stone-300 p-1.5 h-full flex flex-col">
          <div className="text-center space-y-0.5 mb-1.5">
            <div className="h-1.5 w-2/3 rounded-full mx-auto" style={{ background: accent }} />
            <div className="h-0.5 w-1/3 rounded-full mx-auto bg-stone-300" />
          </div>
          <div className="text-center text-[4px] text-stone-400 mb-1">❖ ────── ❖</div>
          <div className="flex-1 space-y-1">
            <div className="flex gap-1">
              <div className="w-1/4 h-1 rounded-full bg-stone-300" />
              <div className="flex-1 space-y-0.5"><div className="h-1 w-3/4 rounded-full" style={{ background: accent }} /><Lines count={2} color="#e7e5e4" /></div>
            </div>
            <div className="flex gap-1">
              <div className="w-1/4 h-1 rounded-full bg-stone-300" />
              <div className="flex-1 space-y-0.5"><div className="h-1 w-3/4 rounded-full" style={{ background: accent }} /><Lines count={2} color="#e7e5e4" /></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. TECH TERMINAL ARCHETYPE THUMBNAIL
  if (archetype === "tech-terminal") {
    return (
      <div className={`h-full bg-slate-950 p-1 flex flex-col ${className}`}>
        <div className="bg-slate-900 border border-slate-800 rounded-t p-1 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
          <span className="w-1 h-1 rounded-full bg-amber-500 inline-block" />
          <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
        </div>
        <div className="bg-slate-900/90 border-x border-b border-slate-800 p-1 flex-1 space-y-1">
          <div className="h-1 w-1/2 rounded-full bg-emerald-400" />
          <div className="h-0.5 w-1/3 rounded-full bg-slate-500" />
          <div className="text-[4px] font-mono text-emerald-400 mt-1">// EXP</div>
          <Lines count={2} color="#475569" />
          <Lines count={2} color="#475569" />
        </div>
      </div>
    );
  }

  // 5. DARK EXECUTIVE ARCHETYPE THUMBNAIL
  if (archetype === "dark-executive") {
    return (
      <div className={`h-full bg-[#0f172a] p-1.5 flex flex-col space-y-1 ${className}`}>
        <div className="flex items-center gap-1 border-b pb-1" style={{ borderColor: accent }}>
          <div className="w-3.5 h-3.5 rounded-full border border-amber-400 bg-slate-800 shrink-0" />
          <div className="space-y-0.5 flex-1">
            <div className="h-1 w-3/4 rounded-full" style={{ background: accent }} />
            <div className="h-0.5 w-1/2 rounded-full bg-slate-500" />
          </div>
        </div>
        <div className="p-1 bg-slate-900 rounded border border-slate-800 space-y-0.5">
          <div className="h-1 w-2/3 rounded-full" style={{ background: accent }} />
          <Lines count={2} color="#475569" />
        </div>
        <div className="p-1 bg-slate-900 rounded border border-slate-800 space-y-0.5">
          <div className="h-1 w-2/3 rounded-full" style={{ background: accent }} />
          <Lines count={2} color="#475569" />
        </div>
      </div>
    );
  }

  // 6. BANNER GRADIENT ARCHETYPE THUMBNAIL
  if (archetype === "banner-gradient") {
    const bg = accent2 ? `linear-gradient(135deg, ${accent}, ${accent2})` : accent;
    return (
      <div className={`h-full bg-white flex flex-col ${className}`}>
        <div className="p-2 flex items-center gap-1.5" style={{ background: bg }}>
          <div className="w-4 h-4 rounded-full" style={{ background: "rgba(255,255,255,0.4)" }} />
          <div className="flex-1 space-y-0.5">
            <div className="h-1.5 w-3/4 rounded-full" style={{ background: "rgba(255,255,255,0.8)" }} />
            <div className="h-1 w-1/2 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />
          </div>
        </div>
        <div className="p-1.5 flex-1 space-y-1">
          <HeadingBar accent={accent} label="Experience" />
          <Lines count={3} />
          <HeadingBar accent={accent} label="Skills" />
          <Lines count={2} />
        </div>
      </div>
    );
  }

  // 7. SIDEBAR MODERN ARCHETYPE THUMBNAIL
  if (archetype === "sidebar-modern") {
    const sidebar = (
      <div className="w-1/3 p-1.5 flex flex-col gap-1" style={{ background: accent }}>
        <div className="w-5 h-5 rounded-full mx-auto mb-0.5" style={{ background: "rgba(255,255,255,0.3)" }} />
        <div className="h-1 rounded-full mx-auto w-3/4" style={{ background: "rgba(255,255,255,0.6)" }} />
        <div className="mt-1 space-y-0.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1 w-full rounded-sm" style={{ background: "rgba(255,255,255,0.25)" }} />
          ))}
        </div>
      </div>
    );
    const main = (
      <div className="flex-1 p-1.5 space-y-1">
        <HeadingBar accent={accent} label="Profile" />
        <Lines count={2} />
        <HeadingBar accent={accent} label="Experience" />
        <Lines count={3} />
      </div>
    );
    return (
      <div className={`flex h-full bg-white ${spec.layout === "sidebar-right" ? "flex-row-reverse" : "flex-row"} ${className}`}>
        {sidebar}
        {main}
      </div>
    );
  }

  // 8. MINIMAL SWISS ARCHETYPE THUMBNAIL (DEFAULT)
  return (
    <div className={`h-full bg-white p-1.5 flex flex-col ${className}`}>
      <div className="space-y-0.5 mb-1.5 pb-1 border-b-2" style={{ borderColor: accent }}>
        <div className="h-1.5 w-1/2 rounded-full" style={{ background: accent }} />
        <div className="h-1 w-1/3 rounded-full bg-gray-300" />
      </div>
      <div className="flex-1 space-y-1">
        <HeadingBar accent={accent} label="Profile" />
        <Lines count={2} />
        <HeadingBar accent={accent} label="Experience" />
        <Lines count={3} />
        <HeadingBar accent={accent} label="Education" />
        <Lines count={2} />
      </div>
    </div>
  );
}

function withAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(n, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

// Thumbnails for the 8 original hand-crafted templates
function OriginalThumbnail({ templateId, accent }: { templateId: TemplateId; accent: string }) {
  switch (templateId) {
    case "modern":
      return (
        <div className="flex h-full bg-white">
          <div className="w-1/3 p-1.5 space-y-1" style={{ background: accent }}>
            <div className="w-4 h-4 rounded-full mx-auto" style={{ background: "rgba(255,255,255,0.4)" }} />
            {[0, 1, 2].map((i) => <div key={i} className="h-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />)}
          </div>
          <div className="flex-1 p-1.5 space-y-1">
            <Lines count={2} />
            <Lines count={3} />
            <Lines count={2} />
          </div>
        </div>
      );
    case "minimal":
      return (
        <div className="h-full bg-white p-1.5 space-y-1">
          <div className="h-1 w-1/2 rounded-full bg-gray-800" />
          <div className="h-0.5 w-1/3 rounded-full bg-gray-400" />
          <Lines count={3} />
          <Lines count={3} />
          <Lines count={2} />
        </div>
      );
    case "creative":
      return (
        <div className="h-full bg-white flex flex-col">
          <div className="p-1.5 flex items-center gap-1" style={{ background: `linear-gradient(135deg, ${accent}, #5b21b6)` }}>
            <div className="w-3 h-3 rounded" style={{ background: "rgba(255,255,255,0.5)" }} />
            <div className="h-1 w-1/2 rounded-full" style={{ background: "rgba(255,255,255,0.8)" }} />
          </div>
          <div className="p-1.5 flex-1 space-y-1">
            <Lines count={2} />
            <Lines count={3} />
            <Lines count={2} />
          </div>
        </div>
      );
    case "classic":
      return (
        <div className="h-full bg-white p-1.5 flex flex-col">
          <div className="text-center space-y-0.5 mb-1">
            <div className="h-1 w-2/3 rounded-full mx-auto" style={{ background: accent }} />
            <div className="h-0.5 w-1/3 rounded-full mx-auto bg-gray-400" />
          </div>
          <div className="h-0.5 mb-1" style={{ background: accent }} />
          <div className="flex-1 space-y-1">
            <Lines count={2} />
            <Lines count={3} />
            <Lines count={2} />
          </div>
        </div>
      );
    case "executive":
      return (
        <div className="h-full bg-white p-1.5 space-y-1">
          <div className="flex justify-between border-b-2 pb-0.5" style={{ borderColor: accent }}>
            <div className="h-1 w-1/2 rounded-full" style={{ background: accent }} />
            <div className="h-0.5 w-1/4 rounded-full bg-gray-400" />
          </div>
          <Lines count={3} />
          <Lines count={3} />
          <Lines count={2} />
        </div>
      );
    case "tech":
      return (
        <div className="flex h-full bg-white">
          <div className="w-1/3 p-1.5 space-y-1 bg-slate-900">
            <div className="w-3 h-3 rounded mx-auto" style={{ background: accent }} />
            <div className="h-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
            <div className="h-0.5 w-2/3 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
          </div>
          <div className="flex-1 p-1.5 space-y-1">
            <Lines count={2} />
            <Lines count={3} />
            <Lines count={2} />
          </div>
        </div>
      );
    case "academic":
      return (
        <div className="h-full bg-white p-1.5 space-y-1">
          <div className="text-center h-1 w-2/3 rounded-full mx-auto" style={{ background: accent }} />
          <div className="h-px" style={{ background: accent }} />
          <div className="space-y-0.5">
            <div className="flex gap-1"><span className="text-[4px]" style={{ color: accent }}>01</span><Lines count={1} /></div>
            <div className="flex gap-1"><span className="text-[4px]" style={{ color: accent }}>02</span><Lines count={1} /></div>
            <div className="flex gap-1"><span className="text-[4px]" style={{ color: accent }}>03</span><Lines count={1} /></div>
          </div>
        </div>
      );
    case "compact":
      return (
        <div className="flex h-full bg-white">
          <div className="flex-1 p-1 space-y-0.5">
            <div className="h-1 w-2/3 rounded-full" style={{ background: accent }} />
            <Lines count={3} color="#d1d5db" />
            <Lines count={3} color="#d1d5db" />
          </div>
          <div className="w-1/4 p-1 space-y-0.5 border-l" style={{ borderColor: withAlpha(accent, 0.3) }}>
            <div className="h-0.5 w-full rounded-full bg-gray-300" />
            <div className="h-0.5 w-3/4 rounded-full bg-gray-300" />
          </div>
        </div>
      );
    default:
      return <div className="h-full bg-white" />;
  }
}
