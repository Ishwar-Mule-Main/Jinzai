"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { Layers, FileText, MousePointerClick, ChevronRight } from "lucide-react";

interface A4MultiPageWrapperProps {
  children: ReactNode;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  zoom?: number;
  onContextMenu?: (e: React.MouseEvent) => void;
  onCopy?: (e: React.ClipboardEvent) => void;
  onSectionClick?: (section: string) => void;
  clickable?: boolean;
}

export function A4MultiPageWrapper({
  children,
  containerRef,
  zoom = 1,
  onContextMenu,
  onCopy,
  onSectionClick,
  clickable = true,
}: A4MultiPageWrapperProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [contentHeight, setContentHeight] = useState(1123);

  // A4 Height in pixels (297mm at ~96 DPI = 1123px, Width = 210mm = 794px)
  const A4_HEIGHT_PX = 1123;
  const A4_WIDTH_PX = 794;
  const PAGE_GAP_PX = 32; // gap between separated pages

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      const h = el.scrollHeight || el.offsetHeight;
      setContentHeight(h);
      const pages = Math.max(1, Math.ceil(h / A4_HEIGHT_PX));
      setPageCount(pages);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Handle section detection on click
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSectionClick) return;

    let target = e.target as HTMLElement | null;
    let detectedSection = "personal";

    while (target && target !== contentRef.current) {
      if (target.dataset?.section) {
        detectedSection = target.dataset.section;
        break;
      }

      const text = (target.textContent || "").toLowerCase();
      const className = (target.className || "").toString().toLowerCase();

      if (className.includes("skill") || text.includes("skills") || text.includes("technical skills") || text.includes("core skills")) {
        detectedSection = "skills";
        break;
      }
      if (className.includes("experience") || text.includes("experience") || text.includes("employment") || text.includes("work history")) {
        detectedSection = "experience";
        break;
      }
      if (className.includes("education") || text.includes("education") || text.includes("degree") || text.includes("university")) {
        detectedSection = "education";
        break;
      }
      if (className.includes("project") || text.includes("projects") || text.includes("featured projects")) {
        detectedSection = "projects";
        break;
      }
      if (className.includes("cert") || text.includes("certifications") || text.includes("certificate")) {
        detectedSection = "certifications";
        break;
      }
      if (className.includes("language") || text.includes("languages")) {
        detectedSection = "languages";
        break;
      }
      if (className.includes("summary") || text.includes("summary") || text.includes("profile") || text.includes("objective")) {
        detectedSection = "summary";
        break;
      }
      if (className.includes("header") || className.includes("contact") || className.includes("personal")) {
        detectedSection = "personal";
        break;
      }

      target = target.parentElement;
    }

    onSectionClick(detectedSection);
  };

  const totalCalculatedHeight = pageCount === 1
    ? A4_HEIGHT_PX
    : pageCount * A4_HEIGHT_PX + (pageCount - 1) * PAGE_GAP_PX;

  return (
    <div className="relative flex flex-col items-center select-text">
      {/* Top Page Count & Interactive Signal Badge Bar */}
      <div className="mb-3 print:hidden flex items-center justify-between gap-3 px-4 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-xs font-mono text-[#888888] shadow-lg shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#faff69]" />
          <span>Size: <strong className="text-white font-semibold">{pageCount} A4 {pageCount === 1 ? "Page" : "Pages"}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          {clickable && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#faff69] bg-[#242424] px-2 py-0.5 rounded-full border border-[#2a2a2a]">
              <MousePointerClick className="w-3 h-3" /> Click section to edit
            </span>
          )}
          <div className="flex items-center gap-1 text-[11px] text-[#22c55e] bg-[#242424] px-2.5 py-0.5 rounded-full border border-[#2a2a2a]">
            <FileText className="w-3 h-3" />
            <span>Standard A4 Margins</span>
          </div>
        </div>
      </div>

      {/* Scaling Viewport Container */}
      <div
        className="relative flex justify-center"
        style={{
          width: `${Math.round(A4_WIDTH_PX * zoom)}px`,
          height: `${Math.round(totalCalculatedHeight * zoom)}px`,
          transition: "width 0.15s ease-out, height 0.15s ease-out",
        }}
      >
        {/* Scaled A4 Document Container */}
        <div
          className="origin-top transition-transform duration-150 ease-out flex flex-col items-center"
          style={{
            transform: `scale(${zoom})`,
            width: "210mm",
            position: "absolute",
            top: 0,
            left: "50%",
            marginLeft: "-105mm",
          }}
        >
          {pageCount <= 1 ? (
            /* Single Page View */
            <div
              ref={(node) => {
                contentRef.current = node;
                if (containerRef && "current" in containerRef) {
                  (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                }
              }}
              onClick={handleContentClick}
              className={`bg-white shadow-2xl shadow-black/80 print:shadow-none relative resume-protected transition-all duration-200 rounded-sm overflow-hidden text-slate-900 border border-slate-200/80 ${
                clickable ? "cursor-pointer group hover:ring-2 hover:ring-[#faff69]/40" : ""
              }`}
              onContextMenu={onContextMenu}
              onCopy={onCopy}
              onDragStart={(e) => e.preventDefault()}
              style={{
                width: "210mm",
                minHeight: "297mm",
                position: "relative",
                boxSizing: "border-box",
              }}
            >
              {children}
            </div>
          ) : (
            /* Multi-Page Separate Pages View */
            <div className="flex flex-col items-center gap-8 w-[210mm]">
              {/* Master container reference for measurements & exports */}
              <div
                ref={(node) => {
                  contentRef.current = node;
                  if (containerRef && "current" in containerRef) {
                    (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                  }
                }}
                className="sr-only"
                style={{ width: "210mm" }}
              >
                {children}
              </div>

              {/* Discrete Separate A4 Page Cards */}
              {Array.from({ length: pageCount }).map((_, pageIdx) => {
                const pageNum = pageIdx + 1;
                const topMm = pageIdx * 297;

                return (
                  <div key={pageNum} className="flex flex-col items-center w-[210mm] relative">
                    {/* Separate Page Header Bar */}
                    <div className="w-full flex items-center justify-between px-4 py-1.5 mb-1.5 bg-[#141414] border border-[#2a2a2a] rounded-md text-[11px] font-mono text-[#888888] shadow-md print:hidden">
                      <span className="flex items-center gap-2 text-white font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#faff69]" />
                        Page {pageNum} of {pageCount}
                      </span>
                      <span className="text-[10px] text-[#888888] uppercase">
                        210mm × 297mm Standard A4
                      </span>
                    </div>

                    {/* Distinct A4 Page Sheet */}
                    <div
                      onClick={handleContentClick}
                      className={`bg-white shadow-2xl shadow-black/80 print:shadow-none relative resume-protected transition-all duration-200 rounded-sm overflow-hidden text-slate-900 border border-slate-200/80 ${
                        clickable ? "cursor-pointer group hover:ring-2 hover:ring-[#faff69]/40" : ""
                      }`}
                      onContextMenu={onContextMenu}
                      onCopy={onCopy}
                      onDragStart={(e) => e.preventDefault()}
                      style={{
                        width: "210mm",
                        height: "297mm",
                        position: "relative",
                        boxSizing: "border-box",
                      }}
                    >
                      {/* Inner Content Slice for this specific Page */}
                      <div
                        style={{
                          transform: `translateY(-${topMm}mm)`,
                          width: "210mm",
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      >
                        {children}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
