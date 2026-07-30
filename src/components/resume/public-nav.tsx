"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "./brand-mark";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, UserPlus } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function PublicNav({ onLogin, onSignup }: { onLogin?: () => void; onSignup?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#f5f1ec] border-b border-[#d3cec6]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/">
            <BrandMark showParent />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-[#626260] hover:text-[#111111] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onLogin} className="gap-1.5 text-[#626260] hover:text-[#111111]">
              <LogIn className="w-3.5 h-3.5" /> Log In
            </Button>
            <Button
              size="sm"
              onClick={onSignup}
              className="gap-1.5 bg-[#111111] text-white hover:bg-[#000000] rounded-md"
            >
              <UserPlus className="w-3.5 h-3.5" /> Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#111111]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden py-3 space-y-1 border-t border-[#d3cec6]/60">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm text-[#626260] hover:text-[#111111] hover:bg-white/50 rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2 px-3">
              <Button variant="outline" size="sm" onClick={onLogin} className="gap-1.5 flex-1">
                <LogIn className="w-3.5 h-3.5" /> Log In
              </Button>
              <Button size="sm" onClick={onSignup} className="gap-1.5 flex-1 bg-[#111111] text-white">
                <UserPlus className="w-3.5 h-3.5" /> Sign Up
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
