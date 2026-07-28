"use client";

import Link from "next/link";
import { BrandMark } from "./brand-mark";

const DE_LOGO_URL = "https://domainexpansion.in/Domain%20Expansion%20New%20Logo.png";

export function PublicFooter() {
  return (
    <footer className="bg-[#f5f1ec] border-t border-[#d3cec6]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2">
            <BrandMark showParent className="mb-3" />
            <p className="text-xs text-[#7b7b78] max-w-xs leading-relaxed">
              人材 — Talent Hub. Build a resume that gets you hired. 72 templates, AI-powered writing, ATS optimization, and web profiles.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-[#111111] mb-3">Product</p>
            <ul className="space-y-2">
              <li><Link href="/templates" className="text-xs text-[#626260] hover:text-[#111111] transition-colors">Templates</Link></li>
              <li><Link href="/pricing" className="text-xs text-[#626260] hover:text-[#111111] transition-colors">Pricing</Link></li>
              <li><Link href="/" className="text-xs text-[#626260] hover:text-[#111111] transition-colors">AI Resume Builder</Link></li>
              <li><Link href="/" className="text-xs text-[#626260] hover:text-[#111111] transition-colors">Job Seeker Hub</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-[#111111] mb-3">Company</p>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-xs text-[#626260] hover:text-[#111111] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-xs text-[#626260] hover:text-[#111111] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-[#111111] mb-3">Legal</p>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-xs text-[#626260] hover:text-[#111111] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs text-[#626260] hover:text-[#111111] transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-xs text-[#626260] hover:text-[#111111] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#d3cec6]/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#7b7b78] font-medium">A product of</span>
            <img src={DE_LOGO_URL} alt="Domain Expansion" className="h-5 w-auto object-contain" />
          </div>
          <p className="text-[10px] text-[#7b7b78]">
            © {new Date().getFullYear()} Jinzai by Domain Expansion. All rights reserved. Made in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
