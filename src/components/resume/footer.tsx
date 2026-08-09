"use client";

import Link from "next/link";
import { BrandMark } from "./brand-mark";

const DE_LOGO_URL = "https://domainexpansion.in/Domain%20Expansion%20New%20Logo.png";

export function Footer() {
  return (
    <footer className="border-t border-[#2E2E2E] bg-[#0D0D0D] mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <BrandMark showParent className="mb-3" />
            <p className="text-xs text-[#888898] max-w-xs leading-relaxed">
              Build a resume that gets you hired. 78 templates, AI-powered writing, ATS optimization, and one-click export.
            </p>
          </div>

          {/* Legal links */}
          <div>
            <p className="text-xs font-semibold mb-3 text-white">Legal</p>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-semibold mb-3 text-white">Company</p>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Parent company bar */}
      <div className="bg-[#0B0B0C] border-t border-[#2E2E2E] py-6 flex flex-col items-center justify-center gap-3">
        <p className="text-xs text-[#888898] font-mono tracking-wide">A product of</p>
        <img
          src={DE_LOGO_URL}
          alt="Domain Expansion"
          className="h-10 w-auto object-contain"
        />
        <p className="text-[10px] text-[#888898] font-mono tracking-widest uppercase mt-1">Made in India</p>
      </div>
    </footer>
  );
}
