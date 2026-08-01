"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { Layers } from "lucide-react";

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
    <div className="relative flex flex-col items-center">
      {/* Page Count Badge Bar */}
      <div className="mb-3 print:hidden flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#2E2E2E] rounded-full text-xs font-mono text-[#888898] shadow-md">
        <Layers className="w-3.5 h-3.5 text-[#FF6200]" />
        <span>Document Size: <strong className="text-white">{pageCount} A4 {pageCount === 1 ? "Page" : "Pages"}</strong></span>
      </div>

      {/* A4 Container */}
      <div
        ref={(node) => {
          contentRef.current = node;
          if (containerRef && "current" in containerRef) {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        className="bg-white shadow-2xl shadow-slate-900/20 dark:shadow-black/50 print:shadow-none print:w-auto relative resume-protected transition-all duration-200"
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

        {/* Visual A4 Page Break Lines & Page Number Badges for Preview */}
        {Array.from({ length: pageCount - 1 }).map((_, index) => {
          const pageNum = index + 2;
          const topMm = (index + 1) * 297;
          return (
            <div
              key={pageNum}
              className="absolute left-0 right-0 pointer-events-none print:hidden z-20 page-separator-bar"
              style={{ top: `${topMm}mm` }}
            >
              <div className="w-full border-t-2 border-dashed border-[#FF6200]/40 relative flex items-center justify-center">
                <span className="bg-[#141414] text-[#FF6200] border border-[#FF6200]/50 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-lg transform -translate-y-1/2">
                  PAGE {pageNum} OF {pageCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
