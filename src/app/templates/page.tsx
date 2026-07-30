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
    <div className="min-h-screen bg-[#f5f1ec] flex flex-col">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-[#626260] mb-2">72 professional designs</p>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#111111] mb-3" style={{ letterSpacing: "-1.4px" }}>
            Resume Templates
          </h1>
          <p className="text-[#626260] max-w-xl mx-auto text-base">
            Browse all 72 templates. Each auto-adapts to your content. Free templates for everyone, premium designs for paid plans.
          </p>
        </div>

        {/* Search + filters */}
        <div className="mb-8 space-y-3">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c9fa5]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates..."
              className="pl-9 h-10 text-sm bg-white border-[#d3cec6] rounded-md"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filter === cat
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white text-[#626260] border-[#d3cec6] hover:bg-[#ebe7e1]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-[#7b7b78]">{filtered.length} templates</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mounted && filtered.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-[#d3cec6]/60 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 group">
              <div className="bg-white overflow-hidden relative" style={{ height: "300px" }}>
                <TemplateThumbnail templateId={t.id} className="w-full h-full" />
                <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
                  {t.premium && (
                    <Badge className="bg-amber-500 text-white border-0 gap-0.5 text-[8px] shadow-sm">
                      <Crown className="w-2.5 h-2.5" /> PRO
                    </Badge>
                  )}
                  {t.hasPhoto && (
                    <Badge className="bg-white/90 text-slate-700 border-0 gap-1 text-[9px] shadow-sm">
                      <ImageIcon className="w-2.5 h-2.5" /> Photo
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-[#111111] mb-1">{t.name}</h3>
                <p className="text-[11px] text-[#7b7b78] line-clamp-2 mb-2 leading-relaxed">{t.description}</p>
                <div className="flex flex-wrap gap-1">
                  {t.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-[#f5f1ec] text-[#626260] font-medium">{tag}</span>
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
