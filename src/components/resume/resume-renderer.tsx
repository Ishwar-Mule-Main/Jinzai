"use client";

import type { RenderProps } from "./templates/basic-templates";
import { ModernTemplate } from "./templates/basic-templates";
import { MinimalTemplate } from "./templates/basic-templates";
import { CreativeTemplate, ClassicTemplate, ExecutiveTemplate, TechTemplate } from "./templates/extended-templates";
import { getFontClass } from "@/lib/resume/template-helpers";

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
      default:
        return <ModernTemplate {...common} />;
    }
  };

  return (
    <div className={`resume-page ${fontClass}`} style={{ minHeight: "100%" }}>
      {render()}
    </div>
  );
}
