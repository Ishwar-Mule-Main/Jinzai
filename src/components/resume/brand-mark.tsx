"use client";

import { FileText } from "lucide-react";

export function BrandMark({ className = "", showParent = false }: { className?: string; showParent?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm shrink-0">
        <FileText className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-lg tracking-tight">
          Resume<span className="text-teal-600 dark:text-teal-400">Forge</span>
        </span>
        {showParent && (
          <span className="text-[9px] text-muted-foreground font-medium tracking-wide">
            by Domain Expansion
          </span>
        )}
      </div>
    </div>
  );
}

export function DomainExpansionLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-sm shrink-0">
        <span className="text-white font-bold text-xs">DE</span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-sm tracking-tight">Domain Expansion</span>
        <span className="text-[8px] text-muted-foreground">Parent Company</span>
      </div>
    </div>
  );
}
