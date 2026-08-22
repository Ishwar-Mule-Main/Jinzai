"use client";

import { useState } from "react";
import { Sparkles, Loader2, Plus, Check, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SuggestedCategory {
  category: string;
  items: string[];
}

interface SkillSuggestionsProps {
  category?: string;
  existing?: string[];
  onSelect?: (skill: string) => void;
}

// Preset popular suggestions mapped by category keywords
const POPULAR_SKILLS: Record<string, string[]> = {
  programming: ["TypeScript", "JavaScript", "Python", "Go", "Java", "C++", "Rust", "SQL", "HTML5/CSS3", "GraphQL"],
  frontend: ["React", "Next.js", "Vue.js", "Tailwind CSS", "Redux", "Zustand", "Webpack", "Vite", "Responsive Design"],
  backend: ["Node.js", "Express", "NestJS", "FastAPI", "Django", "PostgreSQL", "MongoDB", "Redis", "Kafka", "REST APIs"],
  cloud: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Google Cloud", "Azure", "GitHub Actions", "Nginx", "Linux"],
  tools: ["Git", "GitHub", "Jira", "Postman", "Figma", "VS Code", "DataDog", "Sentry", "Linux CLI"],
  soft: ["Cross-functional Leadership", "Agile & Scrum", "System Architecture", "Technical Documentation", "Problem Solving"],
};

export function SkillSuggestions({ category, existing = [], onSelect }: SkillSuggestionsProps) {
  const [open, setOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedCategory[]>([]);
  const [addedSkills, setAddedSkills] = useState<Set<string>>(new Set());

  // Inline Quick Suggestion Pills (if category is provided)
  if (category && onSelect) {
    const catLower = category.toLowerCase();
    let matchedKey = Object.keys(POPULAR_SKILLS).find((k) => catLower.includes(k));
    if (!matchedKey) {
      if (catLower.includes("language") || catLower.includes("code") || catLower.includes("dev")) matchedKey = "programming";
      else if (catLower.includes("framework") || catLower.includes("library") || catLower.includes("ui")) matchedKey = "frontend";
      else if (catLower.includes("database") || catLower.includes("server") || catLower.includes("api")) matchedKey = "backend";
      else if (catLower.includes("devops") || catLower.includes("infra")) matchedKey = "cloud";
      else matchedKey = "programming";
    }

    const availablePills = (POPULAR_SKILLS[matchedKey] || []).filter((s) => !existing.includes(s)).slice(0, 6);

    if (availablePills.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-1 pt-1.5">
        <span className="text-[10px] text-[#888888] font-mono mr-1">Suggestions:</span>
        {availablePills.map((pill) => (
          <button
            key={pill}
            type="button"
            onClick={() => onSelect(pill)}
            className="px-2 py-0.5 rounded bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] hover:border-[#faff69] text-[10px] font-mono text-[#cccccc] hover:text-[#faff69] transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-2.5 h-2.5" /> {pill}
          </button>
        ))}
      </div>
    );
  }

  // Full Dialog Mode
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
        body: JSON.stringify({ jobTitle }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setSuggestions(json.categories || []);
      toast.success(`Generated skills for ${jobTitle}`);
    } catch {
      toast.error("Could not generate suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="h-8 px-3 text-xs bg-[#1a1a1a] hover:bg-[#242424] text-white border border-[#2a2a2a] rounded-md font-semibold gap-1.5 inline-flex items-center transition-colors">
          <Lightbulb className="w-3.5 h-3.5 text-[#faff69]" /> Suggest Skills
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 rounded-xl selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white tracking-tight">
            <Sparkles className="w-5 h-5 text-[#faff69]" /> AI Skill Suggestions
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888888]">
            Enter your target job role to generate comprehensive skill taxonomy suggestions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Staff Software Engineer / Data Scientist"
              onKeyDown={(e) => {
                if (e.key === "Enter") generate();
              }}
              className="flex-1 bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-xs text-white rounded-md h-10 px-3 outline-none"
            />
            <button
              onClick={generate}
              disabled={loading}
              className="h-10 px-4 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs rounded-md gap-1.5 inline-flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Analyzing…" : "Suggest"}
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#faff69]" />
              <p className="text-xs text-[#888888] font-mono">Analyzing role and generating skill matches…</p>
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <div className="space-y-3">
              {suggestions.map((cat) => (
                <div key={cat.category} className="rounded-xl border border-[#2a2a2a] p-3.5 bg-[#121212] space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#faff69]" />
                      {cat.category}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((skill) => {
                      const added = addedSkills.has(`${cat.category}::${skill}`);
                      return (
                        <button
                          key={skill}
                          onClick={() => {
                            onSelect?.(skill);
                            setAddedSkills((prev) => new Set(prev).add(`${cat.category}::${skill}`));
                            toast.success(`Added "${skill}"`);
                          }}
                          disabled={added}
                          className={`text-xs px-2.5 py-1 rounded-md border font-mono transition-colors flex items-center gap-1 ${
                            added
                              ? "bg-[#242424] border-[#2a2a2a] text-[#888888]"
                              : "bg-[#1a1a1a] hover:bg-[#242424] border-[#2a2a2a] hover:border-[#faff69] text-white"
                          }`}
                        >
                          {added ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Plus className="w-3 h-3 text-[#faff69]" />}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
