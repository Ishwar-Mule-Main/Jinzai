"use client";

import Link from "next/link";
import { BrandMark } from "./brand-mark";

const DE_LOGO_URL = "https://domainexpansion.in/Domain%20Expansion%20New%20Logo.png";

export function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#0a0a0a] mt-12 font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <BrandMark showParent className="mb-3" />
            <p className="text-xs text-[#888888] max-w-xs leading-relaxed">
              Engineering high-density ATS resumes. 78 layout engines, AI optimization, and zero-loss vector export.
            </p>
          </div>

          {/* Legal links */}
          <div>
            <p className="text-xs font-mono font-bold mb-3 text-white">LEGAL</p>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-mono font-bold mb-3 text-white">COMPANY</p>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Parent company bar */}
      <div className="bg-[#0a0a0a] border-t border-[#2a2a2a] py-6 flex flex-col items-center justify-center gap-3">
        <p className="text-xs text-[#888888] font-mono tracking-wide">A product of</p>
        <img
          src={DE_LOGO_URL}
          alt="Domain Expansion"
          className="h-9 w-auto object-contain brightness-90"
        />
        <p className="text-[10px] text-[#888888] font-mono tracking-widest uppercase mt-1">Made in India</p>
      </div>
    </footer>
  );
}
