"use client";

import { FileText } from "lucide-react";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
        <FileText className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <span className="font-bold text-lg tracking-tight">
        Resume<span className="text-teal-600 dark:text-teal-400">Forge</span>
      </span>
    </div>
  );
}
