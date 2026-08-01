"use client";

import { FileText } from "lucide-react";

export function BrandMark({ className = "", showParent = false }: { className?: string; showParent?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6200] to-[#FF8C42] flex items-center justify-center shadow-lg shadow-[#FF6200]/20 shrink-0 border border-white/10">
        <span className="text-white font-bold text-sm">人</span>
      </div>
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1">
          <span className="font-bricolage font-bold text-lg tracking-tight text-white">Jinzai</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6200] inline-block animate-pulse"></span>
        </div>
        {showParent && (
          <span className="text-[9px] text-[#888898] font-mono tracking-wider">
            domain.expansion · 人材
          </span>
        )}
      </div>
    </div>
  );
}

export function DomainExpansionLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="https://domainexpansion.in/Domain%20Expansion%20New%20Logo.png"
        alt="Domain Expansion"
        className="w-8 h-8 object-contain shrink-0"
      />
      <div className="flex flex-col leading-tight">
        <span className="font-bricolage font-bold text-sm tracking-tight text-white">domain.expansion</span>
        <span className="text-[9px] text-[#888898] font-mono">Parent Company</span>
      </div>
    </div>
  );
}
