"use client";

import Link from "next/link";
import { BrandMark } from "./brand-mark";

const DE_LOGO_URL = "https://domainexpansion.in/Domain%20Expansion%20New%20Logo.png";

export function PublicFooter() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#2E2E2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2">
            <BrandMark showParent className="mb-3" />
            <p className="text-xs text-[#888898] max-w-xs leading-relaxed">
              人材 — Talent Hub by Domain Expansion. Build high-conversion resumes that get you hired. 78 templates, AI-powered writing, ATS optimization, and web profiles.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-white mb-3">Product</p>
            <ul className="space-y-2">
              <li><Link href="/templates" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">Templates</Link></li>
              <li><Link href="/pricing" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">Pricing</Link></li>
              <li><Link href="/" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">AI Resume Builder</Link></li>
              <li><Link href="/" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">Job Seeker Hub</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-white mb-3">Company</p>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-white mb-3">Legal</p>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-xs text-[#888898] hover:text-[#FF6200] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#2E2E2E] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#888898] font-mono">A product of</span>
            <img src={DE_LOGO_URL} alt="Domain Expansion" className="h-5 w-auto object-contain" />
          </div>
          <p className="text-[10px] text-[#888898] font-mono">
            © {new Date().getFullYear()} Jinzai by Domain Expansion. All rights reserved. Made in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
