"use client";

import { useState, useEffect } from "react";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { TEMPLATES } from "@/lib/resume/types";
import { TemplateCard } from "@/components/resume/template-card";
import { Search } from "lucide-react";

const CATEGORIES = ["All", "ATS", "Sidebar", "Banner", "Single", "Serif", "Minimal", "Photo", "Numbered", "Creative", "Premium"] as const;

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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#faff69] px-3.5 py-1 rounded-full text-xs font-mono">
            78 ENGINEERED DESIGNS
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            ATS-Certified <span className="text-[#faff69]">Resume Layouts</span>
          </h1>
          <p className="text-[#cccccc] max-w-xl mx-auto text-base">
            Browse all 78 templates. Each auto-adapts to your structured experience. Free templates for all users, advanced engineering layouts for paid tiers.
          </p>
        </div>

        {/* Search + filters */}
        <div className="mb-12 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates by role or layout..."
              className="w-full pl-10 pr-4 h-10 text-xs bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md outline-none transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                  filter === cat
                    ? "bg-[#1a1a1a] text-white border-[#faff69]"
                    : "bg-[#1a1a1a]/60 text-[#888888] border-[#2a2a2a] hover:border-[#3a3a3a] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-center text-xs font-mono text-[#888888]">{filtered.length} templates available</p>
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
