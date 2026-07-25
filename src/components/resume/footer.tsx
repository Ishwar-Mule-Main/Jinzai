"use client";

import Link from "next/link";
import { BrandMark } from "./brand-mark";

const DE_LOGO_URL = "https://domainexpansion.in/Domain%20Expansion%20New%20Logo.png";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Brand */}
          <div className="md:col-span-2">
            <BrandMark showParent className="mb-2" />
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Build a resume that gets you hired. 52 templates, AI-powered writing, ATS optimization, and one-click export.
            </p>
          </div>

          {/* Legal links */}
          <div>
            <p className="text-xs font-semibold mb-2 text-foreground">Legal</p>
            <ul className="space-y-1.5">
              <li><Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-semibold mb-2 text-foreground">Company</p>
            <ul className="space-y-1.5">
              <li><Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Parent company bar */}
      <div className="bg-[#0d0d0d] py-6 flex flex-col items-center justify-center gap-3">
        <p className="text-xs text-white/60 font-medium tracking-wide">A product of</p>
        <img
          src={DE_LOGO_URL}
          alt="Domain Expansion"
          className="h-12 w-auto object-contain"
        />
        <p className="text-[11px] text-white/40 font-medium tracking-widest uppercase mt-1">Made in India</p>
      </div>
    </footer>
  );
}
