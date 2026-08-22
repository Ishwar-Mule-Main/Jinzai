"use client";

import Link from "next/link";
import { BrandMark } from "./brand-mark";

const DE_LOGO_URL = "https://domainexpansion.in/Domain%20Expansion%20New%20Logo.png";

export function PublicFooter() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <BrandMark showParent className="mb-4" />
            <p className="text-xs text-[#888888] max-w-xs leading-relaxed">
              人材 — High-performance AI resume engine by Domain Expansion. 78 ATS-certified templates, AI bullet optimization, quality rating, and 1-click vector export.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-4">Product</p>
            <ul className="space-y-2.5">
              <li><Link href="/templates" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">Templates</Link></li>
              <li><Link href="/pricing" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">Pricing</Link></li>
              <li><Link href="/" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">AI Resume Builder</Link></li>
              <li><Link href="/" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">ATS Scanner</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company</p>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">Contact</Link></li>
              <li><Link href="/institutions" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">Institutions</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-4">Legal</p>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-xs text-[#888888] hover:text-[#faff69] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#2a2a2a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#888888] font-mono">Powered by</span>
            <img src={DE_LOGO_URL} alt="Domain Expansion" className="h-5 w-auto object-contain opacity-80" />
          </div>
          <p className="text-[11px] text-[#888888] font-mono">
            © {new Date().getFullYear()} Jinzai by Domain Expansion. Built for high performance.
          </p>
        </div>
      </div>
    </footer>
  );
}
