"use client";

import Link from "next/link";
import { BrandMark, DomainExpansionLogo } from "@/components/resume/brand-mark";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";

export function LegalPageLayout({ title, lastUpdated, children }: { title: string; lastUpdated: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <BrandMark />
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Jinzai
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-xs text-muted-foreground mb-8">Last updated: {lastUpdated}</p>
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed space-y-4">
          {children}
        </div>

        {/* Company info */}
        <div className="mt-12 border-t pt-6">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs font-semibold">Domain Expansion</p>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Domain Expansion</p>
            <p>Bengaluru, Karnataka, India</p>
            <p>Email: admin@domainexpansion.in</p>
            <p>Website: domainexpansion.in</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Jinzai by Domain Expansion. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
