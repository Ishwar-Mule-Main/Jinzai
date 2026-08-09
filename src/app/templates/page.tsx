"use client";

import { useState, useEffect } from "react";
import type { Metadata } from "next";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { TEMPLATES } from "@/lib/resume/types";
import { TemplateCard } from "@/components/resume/template-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
          <p className="text-xs font-mono text-[#FF6200] mb-2 uppercase tracking-widest">78 professional designs</p>
          <h1 className="font-bricolage text-4xl sm:text-6xl font-bold tracking-tight text-white mb-3">
            Resume <span className="text-gradient-orange">Templates</span>
          </h1>
          <p className="text-[#888898] max-w-xl mx-auto text-sm sm:text-base">
            Browse all 78 templates. Each auto-adapts to your content. Free templates for everyone, premium designs for paid plans.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mounted && filtered.map((t, idx) => (
            <TemplateCard key={t.id} id={t} index={idx} />
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
