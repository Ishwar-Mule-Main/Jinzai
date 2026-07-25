"use client";

import { useState } from "react";
import { LegalDialog, type LegalPage } from "./legal-dialogs";
import { BrandMark } from "./brand-mark";
import { FileText, Shield, RotateCcw, Mail, Info } from "lucide-react";

export function Footer() {
  const [legalPage, setLegalPage] = useState<LegalPage>(null);

  const links: { label: string; page: LegalPage; icon: typeof Shield }[] = [
    { label: "Privacy Policy", page: "privacy", icon: Shield },
    { label: "Terms of Service", page: "terms", icon: FileText },
    { label: "Refund Policy", page: "refund", icon: RotateCcw },
    { label: "About Us", page: "about", icon: Info },
    { label: "Contact", page: "contact", icon: Mail },
  ];

  return (
    <footer className="border-t bg-muted/20 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Brand */}
          <div className="md:col-span-2">
            <BrandMark className="scale-90 mb-2" />
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Build a resume that gets you hired. 52 templates, AI-powered writing, ATS optimization, and one-click export.
            </p>
          </div>

          {/* Legal links */}
          <div>
            <p className="text-xs font-semibold mb-2 text-foreground">Legal</p>
            <ul className="space-y-1.5">
              {links.slice(0, 3).map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => setLegalPage(link.page)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <link.icon className="w-3 h-3" /> {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-semibold mb-2 text-foreground">Company</p>
            <ul className="space-y-1.5">
              {links.slice(3).map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => setLegalPage(link.page)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <link.icon className="w-3 h-3" /> {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing summary */}
        <div className="border-t pt-4 mb-4">
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
          © {new Date().getFullYear()} ResumeForge. All rights reserved. Built with Next.js, Tailwind & z-ai-web-dev-sdk.
        </div>
      </div>

      <LegalDialog page={legalPage} onClose={() => setLegalPage(null)} />
    </footer>
  );
}
