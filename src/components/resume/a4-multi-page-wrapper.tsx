"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { Layers, FileText } from "lucide-react";

interface A4MultiPageWrapperProps {
  children: ReactNode;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onContextMenu?: (e: React.MouseEvent) => void;
  onCopy?: (e: React.MouseEvent) => void;
}

export function A4MultiPageWrapper({
  children,
  containerRef,
  onContextMenu,
  onCopy,
}: A4MultiPageWrapperProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  // A4 Height in pixels (297mm at ~96 DPI = 1123px)
  const A4_HEIGHT_PX = 1123;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      const h = el.offsetHeight;
      const pages = Math.max(1, Math.ceil(h / A4_HEIGHT_PX));
      setPageCount(pages);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Page Count Badge Bar */}
      <div className="mb-4 print:hidden flex items-center justify-between gap-3 px-4 py-1.5 bg-[#141414] border border-[#2E2E2E] rounded-full text-xs font-mono text-[#888898] shadow-lg">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#FF6200]" />
          <span>Document Size: <strong className="text-white font-semibold">{pageCount} A4 {pageCount === 1 ? "Page" : "Pages"}</strong></span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-0.5 rounded-full border border-[#22C55E]/20">
          <FileText className="w-3 h-3" />
          <span>Clean Page Separation Active</span>
        </div>
      </div>

      {/* A4 Document Container with Auto-Break Protection */}
      <div
        ref={(node) => {
          contentRef.current = node;
          if (containerRef && "current" in containerRef) {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        className="bg-white shadow-2xl shadow-slate-900/30 print:shadow-none relative resume-protected transition-all duration-200 rounded-sm overflow-hidden text-slate-900"
        onContextMenu={onContextMenu}
        onCopy={onCopy}
        onDragStart={(e) => e.preventDefault()}
        style={{
          width: "210mm",
          minHeight: `${pageCount * 297}mm`,
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {children}

        {/* Visual Page Break Dividers for Preview */}
        {Array.from({ length: pageCount - 1 }).map((_, index) => {
          const pageNum = index + 2;
          const topMm = (index + 1) * 297;
          return (
            <div
              key={pageNum}
              className="absolute left-0 right-0 pointer-events-none print:hidden z-30 page-separator-bar"
              style={{ top: `${topMm}mm` }}
            >
              <div className="w-full border-t-2 border-dashed border-[#FF6200] relative flex items-center justify-between px-6 bg-[#0D0D0D]/90 py-1 backdrop-blur-sm shadow-md transform -translate-y-1/2">
                <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider">
                  Page Break Line
                </span>
                <span className="bg-[#FF6200] text-white px-3 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-md">
                  END OF PAGE {index + 1} • START OF PAGE {pageNum}
                </span>
                <span className="text-[10px] font-mono text-[#888898]">
                  210mm × 297mm A4
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
