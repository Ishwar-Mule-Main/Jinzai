"use client";

import { useState, useEffect } from "react";
import type { Metadata } from "next";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { TEMPLATES } from "@/lib/resume/types";
import { TemplateThumbnail } from "@/components/resume/template-thumbnail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Crown, ImageIcon, FileText } from "lucide-react";

const CATEGORIES = ["All", "Sidebar", "Banner", "Single", "Serif", "Minimal", "ATS", "Photo", "Numbered", "Creative", "Premium"] as const;

export default function TemplatesPage() {
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const filtered = TEMPLATES.filter((t) => {
    const matchesFilter = filter === "All" || t.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())) || (filter === "Premium" && t.premium);
    const matchesQuery = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-mono text-[#FF6200] mb-2 uppercase tracking-widest">72 professional designs</p>
          <h1 className="font-bricolage text-4xl sm:text-6xl font-bold tracking-tight text-white mb-3">
            Resume <span className="text-gradient-orange">Templates</span>
          </h1>
          <p className="text-[#888898] max-w-xl mx-auto text-sm sm:text-base">
            Browse all 72 templates. Each auto-adapts to your content. Free templates for everyone, premium designs for paid plans.
          </p>
        </div>

        {/* Search + filters */}
        <div className="mb-8 space-y-3">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888898]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates by name or tag..."
              className="pl-10 h-10 text-xs bg-[#141414] border-[#2E2E2E] focus:border-[#FF6200] text-white rounded-xl"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all ${
                  filter === cat
                    ? "bg-[#FF6200] text-white border-[#FF6200] font-semibold shadow-md shadow-[#FF6200]/20"
                    : "bg-[#141414] text-[#888898] border-[#2E2E2E] hover:border-[#FF6200]/50 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-center text-xs font-mono text-[#888898]">{filtered.length} templates available</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mounted && filtered.map((t) => (
            <div key={t.id} className="bg-[#141414] rounded-2xl border border-[#2E2E2E] hover:border-[#FF6200]/50 overflow-hidden hover:shadow-2xl hover:shadow-[#FF6200]/10 transition-all duration-300 hover:-translate-y-1 group">
              <div className="bg-white overflow-hidden relative border-b border-[#2E2E2E]" style={{ height: "300px" }}>
                <TemplateThumbnail templateId={t.id} className="w-full h-full" />
                <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end z-10">
                  {t.premium && (
                    <Badge className="bg-[#FF6200] text-white border-0 gap-1 text-[8px] font-mono shadow-md px-2 py-0.5">
                      <Crown className="w-2.5 h-2.5" /> PRO
                    </Badge>
                  )}
                  {t.hasPhoto && (
                    <Badge className="bg-black/80 text-white border border-white/10 gap-1 text-[9px] font-mono backdrop-blur">
                      <ImageIcon className="w-2.5 h-2.5" /> Photo
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bricolage font-bold text-base text-white mb-1">{t.name}</h3>
                <p className="text-xs text-[#888898] line-clamp-2 mb-3 leading-relaxed">{t.description}</p>
                <div className="flex flex-wrap gap-1">
                  {t.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] text-[#888898]">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
