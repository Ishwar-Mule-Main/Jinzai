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
    <header className="sticky top-0 z-50 bg-[#0D0D0D]/85 backdrop-blur-xl border-b border-[#2E2E2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
                className="px-3.5 py-2 text-sm text-[#888898] hover:text-white transition-colors font-medium rounded-full hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" className="gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-full shadow-lg shadow-[#FF6200]/20 transition-all">
                  Go to Dashboard →
                </Button>
              </Link>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={onLogin} className="gap-1.5 text-white/80 hover:text-white hover:bg-[#1A1A1A] rounded-full border border-[#2E2E2E] hover:border-[#FF6200]/50 transition-all">
                  <LogIn className="w-3.5 h-3.5" /> Log In
                </Button>
                <Button
                  size="sm"
                  onClick={onSignup}
                  className="gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-full shadow-lg shadow-[#FF6200]/20 hover:shadow-[#FF6200]/40 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white/90 hover:text-white focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-[#2E2E2E] bg-[#141414] px-2 rounded-b-xl my-1 shadow-2xl">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-sm text-[#888898] hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3 px-2 border-t border-[#2E2E2E]">
              <Button variant="outline" size="sm" onClick={() => { setMobileOpen(false); onLogin?.(); }} className="gap-1.5 w-full bg-transparent border-[#2E2E2E] text-white hover:bg-[#1A1A1A]">
                <LogIn className="w-4 h-4" /> Log In
              </Button>
              <Button size="sm" onClick={() => { setMobileOpen(false); onSignup?.(); }} className="gap-1.5 w-full bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold">
                <UserPlus className="w-4 h-4" /> Sign Up
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
