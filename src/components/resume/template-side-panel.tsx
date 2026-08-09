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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PanelRightOpen, Search } from "lucide-react";
import { toast } from "sonner";
import { TemplateCard } from "./template-card";

const CATEGORIES = ["All", "Sidebar", "Banner", "Single", "Serif", "Minimal", "ATS", "Photo", "Numbered", "Creative"] as const;

export function TemplateSidePanel() {
  const template = useResumeStore((s) => s.template);
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
        <Button variant="outline" size="sm" className="gap-1.5">
          <PanelRightOpen className="w-3.5 h-3.5" /> Templates
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[480px] sm:max-w-[480px] overflow-y-auto p-0">
        <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
          <SheetTitle className="flex items-center gap-2">
            <PanelRightOpen className="w-5 h-5 text-teal-600" /> All Templates
          </SheetTitle>
          <SheetDescription>
            {TEMPLATES.length} distinct designs. Click any to start editing with that template.
          </SheetDescription>
        </SheetHeader>

        {/* Search + filters */}
        <div className="p-4 space-y-3 border-b sticky top-[88px] bg-background z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates..."
              className="pl-9 h-9 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-all ${
                  filter === cat
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">{filtered.length} templates shown</p>
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

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground px-4">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No templates match your search.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
