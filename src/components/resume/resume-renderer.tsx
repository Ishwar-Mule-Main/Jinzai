"use client";

import type { RenderProps } from "./templates/basic-templates";
import { ModernTemplate } from "./templates/basic-templates";
import { MinimalTemplate } from "./templates/basic-templates";
import { CreativeTemplate, ClassicTemplate, ExecutiveTemplate, TechTemplate } from "./templates/extended-templates";
import { AcademicTemplate, CompactTemplate } from "./templates/extra-templates";
import { ParameterizedTemplate } from "./templates/parameterized";
import { SPEC_MAP } from "@/lib/resume/template-specs";
import { getFontClass } from "@/lib/resume/template-helpers";

const ORIGINAL_IDS = new Set(["modern", "minimal", "creative", "classic", "executive", "tech", "academic", "compact"]);

export function ResumeRenderer({ data, accent, font, template }: RenderProps) {
  const fontClass = getFontClass(font);
  const common = { data, accent };

  const render = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate {...common} />;
      case "minimal":
        return <MinimalTemplate {...common} />;
      case "creative":
        return <CreativeTemplate {...common} />;
      case "classic":
        return <ClassicTemplate {...common} />;
      case "executive":
        return <ExecutiveTemplate {...common} />;
      case "tech":
        return <TechTemplate {...common} />;
      case "academic":
        return <AcademicTemplate {...common} />;
      case "compact":
        return <CompactTemplate {...common} />;
      default:
        // Parameterized templates
        if (!ORIGINAL_IDS.has(template) && SPEC_MAP[template]) {
          return <ParameterizedTemplate data={data} spec={SPEC_MAP[template]} />;
        }
        return <ModernTemplate {...common} />;
    }
  };

  return (
    <div className={`resume-page ${fontClass}`} style={{ minHeight: "100%" }}>
      {render()}
    </div>
  );
}
