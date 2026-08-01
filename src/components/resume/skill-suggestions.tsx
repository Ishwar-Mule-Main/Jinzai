"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2, Plus, Check, X, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SuggestedCategory {
  category: string;
  items: string[];
}

export function SkillSuggestions() {
  const data = useResumeStore((s) => s.data);
  const updateSkillCategory = useResumeStore((s) => s.updateSkillCategory);
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory);
  const skills = useResumeStore((s) => s.data.skills);
  const [open, setOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState(data.personalInfo.jobTitle || "");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedCategory[]>([]);
  const [addedSkills, setAddedSkills] = useState<Set<string>>(new Set());

  const generate = async () => {
    if (jobTitle.trim().length < 2) {
      toast.error("Enter a job title first");
      return;
    }
    setLoading(true);
    setSuggestions([]);
    setAddedSkills(new Set());
    try {
      const res = await fetch("/api/ai/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, existingSkills: skills }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setSuggestions(json.categories || []);
      toast.success(`Suggested ${(json.categories || []).reduce((n: number, c: SuggestedCategory) => n + c.items.length, 0)} skills`);
    } catch {
      toast.error("Could not generate suggestions");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (category: string, skill: string) => {
    // Find existing category or create new one
    const existing = skills.find((s) => s.category.toLowerCase() === category.toLowerCase());
    if (existing) {
      if (existing.items.includes(skill)) {
        toast.info("Already in your skills");
        setAddedSkills((prev) => new Set(prev).add(`${category}::${skill}`));
        return;
      }
      updateSkillCategory(existing.id, { items: [...existing.items, skill] });
    } else {
      addSkillCategory();
      // Need to wait for the new category then update it — use a timeout
      setTimeout(() => {
        const store = useResumeStore.getState();
        const newest = store.data.skills[store.data.skills.length - 1];
        if (newest && !newest.items.includes(skill)) {
          updateSkillCategory(newest.id, { category, items: [skill] });
        }
      }, 50);
    }
    setAddedSkills((prev) => new Set(prev).add(`${category}::${skill}`));
  };

  const addCategory = (cat: SuggestedCategory) => {
    cat.items.forEach((skill) => addSkill(cat.category, skill));
    toast.success(`Added "${cat.category}" category`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-1.5">
          <Lightbulb className="w-3.5 h-3.5" /> Suggest Skills
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" /> AI Skill Suggestions
          </DialogTitle>
          <DialogDescription>
            Enter your target job title and get relevant skills you might be missing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Product Designer"
              onKeyDown={(e) => {
                if (e.key === "Enter") generate();
              }}
            />
            <Button onClick={generate} disabled={loading} className="gap-1.5 shrink-0 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Generating…" : "Suggest"}
            </Button>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              <p className="text-sm text-muted-foreground">Analyzing role and finding relevant skills…</p>
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <div className="space-y-4">
              {suggestions.map((cat) => {
                const allAdded = cat.items.every((s) => addedSkills.has(`${cat.category}::${s}`));
                return (
                  <div key={cat.category} className="rounded-xl border p-3 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        {cat.category}
                      </p>
                      <Button
                        size="sm"
                        variant={allAdded ? "ghost" : "outline"}
                        onClick={() => addCategory(cat)}
                        disabled={allAdded}
                        className="h-6 text-[10px] gap-1"
                      >
                        {allAdded ? <><Check className="w-3 h-3" /> Added</> : <><Plus className="w-3 h-3" /> Add all</>}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((skill) => {
                        const added = addedSkills.has(`${cat.category}::${skill}`);
                        return (
                          <button
                            key={skill}
                            onClick={() => addSkill(cat.category, skill)}
                            disabled={added}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
                              added
                                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300"
                                : "bg-background hover:bg-muted hover:border-teal-400 cursor-pointer"
                            }`}
                          >
                            {added ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-50" />}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <p className="text-[11px] text-muted-foreground text-center pt-1">
                Click any skill to add it to your resume, or "Add all" to add an entire category.
              </p>
            </div>
          )}

          {!loading && suggestions.length === 0 && (
            <div className="text-center py-10">
              <Lightbulb className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Enter your target job title above to get AI-powered skill suggestions.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
