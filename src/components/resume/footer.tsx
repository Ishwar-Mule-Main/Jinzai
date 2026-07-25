"use client";

import Link from "next/link";
import { BrandMark, DomainExpansionLogo } from "./brand-mark";

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

        {/* Parent company banner */}
        <div className="border-t border-b py-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold mb-1">A product of</p>
              <DomainExpansionLogo />
            </div>
          </div>
          <div className="text-center sm:text-right text-[11px] text-muted-foreground">
            <p>Domain Expansion</p>
            <p>admin@domainexpansion.in · Bengaluru, India</p>
          </div>
        </div>

        {/* Pricing summary */}
        <div className="pt-2 mb-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Free — ₹0</span>
            <span className="text-border">|</span>
            <span>Trial — ₹99 / 2 days</span>
            <span className="text-border">|</span>
            <span>Pro — ₹499 / month</span>
            <span className="text-border">|</span>
            <span>Business — ₹1,999 / month</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} ResumeForge by Domain Expansion. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
