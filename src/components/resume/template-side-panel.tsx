"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES } from "@/lib/resume/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PanelRightOpen, Search } from "lucide-react";
import { toast } from "sonner";
import { TemplateCard } from "./template-card";

const CATEGORIES = ["All", "Sidebar", "Banner", "Single", "Serif", "Minimal", "ATS", "Photo", "Numbered", "Creative"] as const;

export function TemplateSidePanel() {
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setView = useResumeStore((s) => s.setView);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = TEMPLATES.filter((t) => {
    const matchesFilter = filter === "All" || t.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())) || t.name.toLowerCase().includes(filter.toLowerCase());
    const matchesQuery = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const selectTemplate = (id: typeof TEMPLATES[number]["id"], name: string) => {
    setTemplate(id);
    toast.success(`Switched to ${name}`);
    setView("editor");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="h-9 px-3 gap-1.5 text-xs text-[#cccccc] hover:text-white bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] rounded-md font-semibold inline-flex items-center transition-colors">
          <PanelRightOpen className="w-3.5 h-3.5 text-[#faff69]" /> Templates
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[480px] sm:max-w-[480px] overflow-y-auto p-0 bg-[#0a0a0a] border-l border-[#2a2a2a] text-white font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <SheetHeader className="p-4 border-b border-[#2a2a2a] sticky top-0 bg-[#0a0a0a] z-10">
          <SheetTitle className="flex items-center gap-2 text-base font-bold text-white tracking-tight">
            <PanelRightOpen className="w-4 h-4 text-[#faff69]" /> Layout Engine Library
          </SheetTitle>
          <SheetDescription className="text-xs text-[#888888]">
            {TEMPLATES.length} architectural designs. Click any to immediately switch active layout.
          </SheetDescription>
        </SheetHeader>

        {/* Search + filters */}
        <div className="p-4 space-y-3 border-b border-[#2a2a2a] sticky top-[73px] bg-[#0a0a0a] z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-3 h-9 text-xs bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-colors ${
                  filter === cat
                    ? "bg-[#faff69] text-[#0a0a0a] font-bold"
                    : "bg-[#1a1a1a] text-[#888888] hover:text-white border border-[#2a2a2a]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#888888] font-mono">{filtered.length} layouts shown</p>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {filtered.map((t, idx) => (
            <TemplateCard
              key={t.id}
              id={t}
              index={idx}
              onSelect={() => selectTemplate(t.id, t.name)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
