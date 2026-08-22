"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "./brand-mark";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { useCurrentUser } from "@/lib/resume/use-current-user";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "Colleges & Institutions", href: "/institutions" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function PublicNav({ onLogin, onSignup }: { onLogin?: () => void; onSignup?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <BrandMark showParent />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#cccccc] hover:text-white transition-colors font-medium hover:text-[#faff69]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <button className="h-10 px-5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-sm font-semibold rounded-md transition-colors inline-flex items-center gap-1.5">
                  Dashboard →
                </button>
              </Link>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="h-10 px-4 text-sm font-medium text-[#cccccc] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
                <button
                  onClick={onSignup}
                  className="h-10 px-5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-sm font-semibold rounded-md transition-colors inline-flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" /> Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#cccccc] hover:text-white focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-[#2a2a2a] bg-[#121212] px-3 rounded-b-xl my-1 shadow-2xl">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm text-[#cccccc] hover:text-white hover:bg-[#1a1a1a] rounded-md transition-colors font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-[#2a2a2a]">
              <button
                onClick={() => { setMobileOpen(false); onLogin?.(); }}
                className="h-10 w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm font-semibold rounded-md inline-flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
              <button
                onClick={() => { setMobileOpen(false); onSignup?.(); }}
                className="h-10 w-full bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-sm font-semibold rounded-md inline-flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> Get Started
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
