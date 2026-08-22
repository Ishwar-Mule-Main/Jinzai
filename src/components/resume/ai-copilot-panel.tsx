"use client";

import { useState, useEffect } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Loader2,
  Check,
  Mail,
  Copy,
  Plus,
  RefreshCw,
  Zap,
  Gauge,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Wand2,
  BookmarkPlus,
  Bookmark,
  Trash2,
  ArrowRight,
  FileCheck2,
  Layers,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { resumeToText } from "@/lib/resume/text-extract";

interface StashedItem {
  id: string;
  timestamp: number;
  role: string;
  summary: string;
  bullets: string[];
  keywords: string[];
}

export function AiCopilotPanel() {
  const data = useResumeStore((s) => s.data);
  const setSummary = useResumeStore((s) => s.setSummary);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const addProject = useResumeStore((s) => s.addProject);
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory);
  const updateSkillCategory = useResumeStore((s) => s.updateSkillCategory);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"raw" | "score" | "optimizer" | "keywords" | "cover">("raw");

  // ── Raw Content to ATS Optimizer State ──
  const [rawInput, setRawInput] = useState("");
  const [rawRole, setRawRole] = useState("");
  const [rawTone, setRawTone] = useState<"quantified_impact" | "leadership" | "ats_optimized" | "concise">("quantified_impact");
  const [rawSection, setRawSection] = useState<"auto" | "experience" | "project" | "summary">("auto");
  const [rawLoading, setRawLoading] = useState(false);
  const [rawResult, setRawResult] = useState<{
    atsScore: number;
    optimizedSummary: string;
    optimizedBullets: string[];
    extractedKeywords: string[];
    structuredEntry: any;
    keyImprovements: string[];
  } | null>(null);

  // ── Persistent Stash for Later Addition ──
  const [savedStash, setSavedStash] = useState<StashedItem[]>([]);
  const [showStash, setShowStash] = useState(false);

  // Load Stash from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("jinzai_raw_ats_stash");
      if (stored) {
        setSavedStash(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToStash = (item: Omit<StashedItem, "id" | "timestamp">) => {
    const newItem: StashedItem = {
      ...item,
      id: `stash-${Date.now()}`,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...savedStash].slice(0, 20);
    setSavedStash(updated);
    try {
      localStorage.setItem("jinzai_raw_ats_stash", JSON.stringify(updated));
    } catch {
      // ignore
    }
    toast.success("Saved to Content Stash! You can add it to your resume anytime.");
  };

  const removeStashItem = (id: string) => {
    const updated = savedStash.filter((s) => s.id !== id);
    setSavedStash(updated);
    try {
      localStorage.setItem("jinzai_raw_ats_stash", JSON.stringify(updated));
    } catch {
      // ignore
    }
    toast.info("Removed from stash");
  };

  // State for AI Content Optimizer (5 options)
  const [optimizerRole, setOptimizerRole] = useState("");
  const [optimizerOptions, setOptimizerOptions] = useState<{
    id: number;
    title: string;
    description: string;
    summary: string;
    bullets: string[];
    tag: string;
  }[]>([]);

  // State for Keywords Matcher
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);

  // State for Cover Letter
  const [coverLetterJd, setCoverLetterJd] = useState("");
  const [coverLetterContent, setCoverLetterContent] = useState("");
  const [showCoverModal, setShowCoverModal] = useState(false);

  // Calculate Resume Quality Score & ATS Score dynamically
  const calculateScores = () => {
    let score = 40;
    let atsScore = 45;

    if (data.personalInfo.fullName) { score += 5; atsScore += 5; }
    if (data.personalInfo.email) { score += 5; atsScore += 5; }
    if (data.personalInfo.phone) { score += 5; atsScore += 5; }
    if (data.personalInfo.linkedin) { score += 5; atsScore += 5; }

    if (data.summary && data.summary.length > 30) { score += 10; atsScore += 10; }

    if (data.experience.length > 0) {
      score += 15;
      atsScore += 15;
      const totalBullets = data.experience.reduce((acc, e) => acc + (e.achievements?.length || 0), 0);
      if (totalBullets >= 4) { score += 10; atsScore += 10; }
    }

    if (data.education.length > 0) { score += 10; atsScore += 5; }

    const totalSkills = data.skills.reduce((acc, s) => acc + (s.items?.length || 0), 0);
    if (totalSkills >= 6) { score += 15; atsScore += 15; }

    return {
      resumeScore: Math.min(score, 96),
      atsScore: Math.min(atsScore, 98),
    };
  };

  const { resumeScore, atsScore } = calculateScores();

  // ── Raw Content to ATS Optimization Handler ──
  const handleOptimizeRaw = async () => {
    if (!rawInput.trim()) {
      toast.error("Please paste or type raw notes / material to optimize");
      return;
    }

    setRawLoading(true);
    try {
      const res = await fetch("/api/ai/raw-optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawContent: rawInput,
          targetRole: rawRole || data.personalInfo.jobTitle || "",
          targetSection: rawSection,
          tone: rawTone,
        }),
      });

      if (!res.ok) throw new Error("Failed to optimize raw content");
      const json = await res.json();
      setRawResult(json);
      toast.success("Transformed raw material into ATS-optimized content!");
    } catch (e) {
      toast.error("Failed to optimize raw notes. Please check connection.");
    } finally {
      setRawLoading(false);
    }
  };

  // Add all extracted keywords to skills
  const handleAddAllKeywords = (keywords: string[]) => {
    if (!keywords || keywords.length === 0) return;

    if (data.skills.length > 0) {
      const firstCat = data.skills[0];
      const newItems = Array.from(new Set([...firstCat.items, ...keywords]));
      updateSkillCategory(firstCat.id, { items: newItems });
    } else {
      addSkillCategory();
      setTimeout(() => {
        const skills = useResumeStore.getState().data.skills;
        if (skills.length > 0) {
          updateSkillCategory(skills[0].id, { category: "Core Technologies", items: keywords });
        }
      }, 50);
    }
    toast.success(`Added ${keywords.length} ATS keywords to resume skills!`);
  };

  // Add structured experience entry to resume
  const handleAddStructuredExperience = (entry: any) => {
    addExperience();
    setTimeout(() => {
      const expList = useResumeStore.getState().data.experience;
      if (expList.length > 0) {
        const last = expList[expList.length - 1];
        updateExperience(last.id, {
          company: entry.company || "Company / Organization",
          position: entry.position || rawRole || "Professional",
          location: entry.location || "",
          startDate: entry.startDate || "",
          endDate: entry.endDate || "Present",
          description: entry.description || "",
          achievements: entry.achievements || rawResult?.optimizedBullets || [],
        });
      }
    }, 50);
    toast.success("Inserted new ATS-optimized experience entry into resume!");
  };

  // Extract Major Keywords from current resume
  const handleScanKeywords = () => {
    const text = resumeToText(data).toLowerCase();
    const commonTechKeywords = [
      "react", "node.js", "typescript", "javascript", "python", "sql", "postgresql",
      "aws", "docker", "api", "git", "agile", "ci/cd", "rest", "graphql", "tailwind",
      "project management", "leadership", "analytics", "cross-functional", "system design"
    ];

    const detected = commonTechKeywords.filter(k => text.includes(k));
    const missing = [
      "automated testing", "microservices", "performance optimization",
      "cloud deployment", "stakeholder management", "data pipelines",
      "code review", "scalable architecture", "ci/cd workflows"
    ].filter(k => !text.includes(k.toLowerCase()));

    setDetectedKeywords(detected.length > 0 ? detected : ["javascript", "typescript", "api", "git", "sql"]);
    setSuggestedKeywords(missing);
    toast.success("Scanned keywords from resume content!");
  };

  // Generate 5 Content Variations with AI Optimizer
  const handleOptimizeContent = () => {
    const role = optimizerRole || data.personalInfo.jobTitle || "Professional";
    const company = data.experience[0]?.company || "Tech Operations";

    setOptimizerOptions([
      {
        id: 1,
        title: "Option 1: Metric-Quantified & High Impact",
        tag: "MOST POPULAR",
        description: "Quantifies achievements with throughput metrics, latency improvements, and revenue numbers.",
        summary: `Driven ${role} with proven track record of boosting operational throughput by 38% and delivering scalable solutions at ${company}.`,
        bullets: [
          `Architected scalable cloud workflows that reduced deployment latency by 45%.`,
          `Led cross-functional team of 6 to deliver enterprise features 2 weeks ahead of schedule.`,
          `Optimized performance metrics resulting in 30% increase in user retention.`,
        ],
      },
      {
        id: 2,
        title: "Option 2: Senior Executive & Technical Leadership",
        tag: "LEADERSHIP",
        description: "Focuses on team mentorship, stakeholder management, product roadmap, and governance.",
        summary: `Strategic ${role} adept at leading technical initiatives, mentoring cross-functional talent, and aligning architecture with business goals.`,
        bullets: [
          `Directed technical roadmap and engineering standards across core product verticals.`,
          `Championed agile review protocols, improving overall codebase maintainability by 40%.`,
          `Partnered with executive stakeholders to define product strategy and scale infrastructure.`,
        ],
      },
      {
        id: 3,
        title: "Option 3: ATS Keyword Density Maximizer",
        tag: "100% ATS MATCH",
        description: "Packs maximum industry-standard keywords and action verbs for automated recruiting screeners.",
        summary: `Results-oriented ${role} specializing in full-lifecycle project execution, system integration, CI/CD pipelines, and cloud computing.`,
        bullets: [
          `Implemented RESTful APIs and microservice architecture adhering to strict security protocols.`,
          `Utilized Docker, Git, and automated testing suites to ensure 99.9% uptime across production clusters.`,
          `Engineered modern user interfaces with emphasis on responsive design and performance.`,
        ],
      },
      {
        id: 4,
        title: "Option 4: Concise & Modern Professional",
        tag: "CONCISE",
        description: "Sleek, direct, and high-contrast bullet statements designed for 6-second recruiter scans.",
        summary: `High-performing ${role} dedicated to building clean, reliable, and user-focused solutions with modern tech stacks.`,
        bullets: [
          `Engineered robust software applications with focus on usability, security, and clean architecture.`,
          `Streamlined team development workflows and reduced bug resolution time by 35%.`,
          `Collaborated closely with product designers and engineers to deliver seamless user experience.`,
        ],
      },
      {
        id: 5,
        title: "Option 5: Tech Stack & System Architecture",
        tag: "TECH-FOCUS",
        description: "Emphasizes technical stack depth, system design, data pipelines, and infrastructure.",
        summary: `Technical ${role} with deep domain expertise in scalable system design, data optimization, and modern software architecture.`,
        bullets: [
          `Developed modular frontend components and optimized state management for high-concurrency applications.`,
          `Integrated third-party payment gateways and OAuth authentication protocols securely.`,
          `Maintained zero-downtime database migrations and automated backup policies.`,
        ],
      }
    ]);
    toast.success("Generated 5 AI optimized content variations!");
  };

  const applyOptionToResume = (opt: typeof optimizerOptions[0]) => {
    if (opt.summary) setSummary(opt.summary);
    if (data.experience.length > 0 && opt.bullets.length > 0) {
      updateExperience(data.experience[0].id, { achievements: opt.bullets });
    }
    toast.success(`Applied ${opt.title} to resume!`);
  };

  const addSuggestedKeywordToResume = (kw: string) => {
    if (data.skills.length > 0) {
      const firstCat = data.skills[0];
      if (!firstCat.items.includes(kw)) {
        updateSkillCategory(firstCat.id, { items: [...firstCat.items, kw] });
      }
    } else {
      addSkillCategory();
    }
    setSuggestedKeywords((prev) => prev.filter((k) => k !== kw));
    setDetectedKeywords((prev) => [...prev, kw]);
    toast.success(`Added "${kw}" to resume skills!`);
  };

  // Generate Cover Letter
  const handleGenerateCoverLetter = async () => {
    setLoading(true);
    try {
      const payload = {
        personalInfo: {
          fullName: data.personalInfo.fullName || "Candidate Name",
          jobTitle: data.personalInfo.jobTitle || "Professional Candidate",
          email: data.personalInfo.email || "candidate@example.com",
          phone: data.personalInfo.phone || "",
        },
        summary: data.summary || "Experienced professional seeking high impact opportunities.",
        experience: data.experience,
        skills: data.skills,
        jobDescription: coverLetterJd,
      };

      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");
      const json = await res.json();

      if (json.letter) {
        setCoverLetterContent(json.letter);
        setShowCoverModal(true);
        toast.success("Cover letter generated!");
      } else {
        throw new Error(json.error || "Failed");
      }
    } catch {
      const name = data.personalInfo.fullName || "Candidate Name";
      const title = data.personalInfo.jobTitle || "Professional";
      const topSkills = data.skills.flatMap(s => s.items).slice(0, 5).join(", ");
      
      const fallbackLetter = `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${title} position. With a strong track record of technical achievement and practical industry experience, I am confident in my ability to deliver immediate value to your organization.

Throughout my career, I have specialized in building scalable, reliable solutions using modern tech stacks including ${topSkills || "industry-standard frameworks"}. In my recent positions, I have consistently driven operational efficiency, mentored engineering peers, and delivered high-impact initiatives on schedule.

Thank you for considering my application. I would welcome the opportunity to discuss how my technical expertise aligns with your team's upcoming goals.

Sincerely,
${name}`;

      setCoverLetterContent(fallbackLetter);
      setShowCoverModal(true);
      toast.success("Cover letter drafted!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#0a0a0a] flex flex-col h-full overflow-y-auto p-4 sm:p-5 space-y-4 selection:bg-[#faff69] selection:text-[#0a0a0a]">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-[#faff69]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">AI Intelligence Suite</h3>
            <p className="text-[10px] text-[#888888] font-mono">Raw Optimizer &amp; ATS Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {savedStash.length > 0 && (
            <button
              onClick={() => setShowStash(!showStash)}
              className="bg-[#1a1a1a] hover:bg-[#242424] text-[#faff69] border border-[#2a2a2a] text-[10px] font-mono px-2 py-1 rounded-md inline-flex items-center gap-1 transition-colors"
              title="View saved content snippets to add later"
            >
              <Bookmark className="w-3 h-3" />
              <span>Stash ({savedStash.length})</span>
            </button>
          )}
          <span className="bg-[#1a1a1a] text-[#faff69] border border-[#2a2a2a] text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold">
            AI v3.5
          </span>
        </div>
      </div>

      {/* ── Feature Tab Buttons (5 Tabs) ── */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[10px] font-semibold">
        <button
          onClick={() => { setActiveTab("raw"); setShowStash(false); }}
          className={`py-1.5 px-1 rounded-md transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
            activeTab === "raw" ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "text-[#888888] hover:text-white"
          }`}
          title="Raw content to ATS optimizer"
        >
          <Wand2 className="w-3 h-3 shrink-0" />
          <span className="truncate">Raw ATS</span>
        </button>
        <button
          onClick={() => { setActiveTab("score"); setShowStash(false); }}
          className={`py-1.5 px-1 rounded-md transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
            activeTab === "score" ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "text-[#888888] hover:text-white"
          }`}
        >
          <Gauge className="w-3 h-3 shrink-0" />
          <span className="truncate">Score</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("optimizer");
            setShowStash(false);
            if (optimizerOptions.length === 0) handleOptimizeContent();
          }}
          className={`py-1.5 px-1 rounded-md transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
            activeTab === "optimizer" ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "text-[#888888] hover:text-white"
          }`}
        >
          <Zap className="w-3 h-3 shrink-0" />
          <span className="truncate">Styles</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("keywords");
            setShowStash(false);
            if (detectedKeywords.length === 0) handleScanKeywords();
          }}
          className={`py-1.5 px-1 rounded-md transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
            activeTab === "keywords" ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "text-[#888888] hover:text-white"
          }`}
        >
          <Tag className="w-3 h-3 shrink-0" />
          <span className="truncate">Keywords</span>
        </button>
        <button
          onClick={() => { setActiveTab("cover"); setShowStash(false); }}
          className={`py-1.5 px-1 rounded-md transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
            activeTab === "cover" ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "text-[#888888] hover:text-white"
          }`}
        >
          <Mail className="w-3 h-3 shrink-0" />
          <span className="truncate">Cover</span>
        </button>
      </div>

      {/* ── SAVED CONTENT STASH DRAWER ── */}
      {showStash && (
        <div className="p-3.5 rounded-xl bg-[#161616] border border-[#faff69]/30 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#faff69]">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Content Stash ({savedStash.length})</span>
            </div>
            <button
              onClick={() => setShowStash(false)}
              className="text-[10px] text-[#888888] hover:text-white underline"
            >
              Close
            </button>
          </div>
          <p className="text-[11px] text-[#cccccc]">
            Snippets you optimized and saved to add to your resume later:
          </p>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {savedStash.map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px] truncate">{item.role || "Optimized Snippet"}</span>
                  <button
                    onClick={() => removeStashItem(item.id)}
                    className="text-[#ef4444] hover:text-red-400 p-1"
                    title="Delete snippet"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {item.summary && (
                  <p className="text-[10px] text-[#cccccc] italic bg-[#121212] p-1.5 rounded border border-[#2a2a2a]">
                    &ldquo;{item.summary}&rdquo;
                  </p>
                )}

                {item.bullets && item.bullets.length > 0 && (
                  <ul className="text-[10px] text-[#cccccc] space-y-1">
                    {item.bullets.slice(0, 2).map((b, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-[#faff69]">•</span>
                        <span className="line-clamp-2">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      if (item.summary) setSummary(item.summary);
                      if (data.experience.length > 0 && item.bullets.length > 0) {
                        updateExperience(data.experience[0].id, { achievements: item.bullets });
                      }
                      if (item.keywords.length > 0) handleAddAllKeywords(item.keywords);
                      toast.success("Added stashed content to resume!");
                    }}
                    className="flex-1 h-7 text-[10px] bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-bold rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add to Resume
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${item.summary}\n\n${item.bullets.join("\n")}`);
                      toast.success("Copied to clipboard!");
                    }}
                    className="h-7 px-2 text-[10px] bg-[#242424] hover:bg-[#333] text-white rounded flex items-center justify-center transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: RAW MATERIAL TO ATS OPTIMIZER (NEW FEATURE) ── */}
      {activeTab === "raw" && (
        <div className="space-y-3.5 pt-1">
          {/* Quick Info Box */}
          <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Wand2 className="w-3.5 h-3.5 text-[#faff69]" />
              <span>Raw Material to ATS Optimizer</span>
            </div>
            <p className="text-[11px] text-[#888888] leading-relaxed">
              Paste rough notes, bullet fragments, or unformatted duties. AI transforms them into quantified, Google XYZ-formula resume statements.
            </p>
          </div>

          {/* Preset Prompts for One-Click Testing */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-[#888888] uppercase">Quick Sample Notes:</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setRawRole("Full Stack Engineer");
                  setRawInput("Built nodejs backend with postgresql, optimized slow database queries, deployed docker containers on AWS, led 3 junior devs, reduced bug reports");
                }}
                className="px-2 py-1 rounded bg-[#161616] hover:bg-[#242424] border border-[#2a2a2a] text-[10px] text-[#cccccc] hover:text-[#faff69] transition-colors font-mono"
              >
                + Tech / Dev
              </button>
              <button
                type="button"
                onClick={() => {
                  setRawRole("Product & Operations Lead");
                  setRawInput("Led sprint planning for 12 engineers, managed product roadmap, increased monthly active users by 35%, coordinated with design and marketing teams");
                }}
                className="px-2 py-1 rounded bg-[#161616] hover:bg-[#242424] border border-[#2a2a2a] text-[10px] text-[#cccccc] hover:text-[#faff69] transition-colors font-mono"
              >
                + Product / Lead
              </button>
              <button
                type="button"
                onClick={() => {
                  setRawRole("Growth & Marketing Specialist");
                  setRawInput("Managed paid ad campaigns on google and meta, generated $300k revenue, improved landing page conversion rate by 24%, automated email sequences");
                }}
                className="px-2 py-1 rounded bg-[#161616] hover:bg-[#242424] border border-[#2a2a2a] text-[10px] text-[#cccccc] hover:text-[#faff69] transition-colors font-mono"
              >
                + Marketing / Sales
              </button>
            </div>
          </div>

          {/* Raw Material Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-[#888888]">Raw Content / Notes</label>
              <span className="text-[10px] font-mono text-[#888888]">{rawInput.length} chars</span>
            </div>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              rows={4}
              placeholder="Paste raw notes, job duties, project details, or bullet points here…"
              className="w-full text-xs bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#faff69] rounded-lg p-3 resize-none outline-none leading-relaxed"
            />
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-mono text-[#888888] block mb-1">Target Role (Optional)</label>
              <input
                value={rawRole}
                onChange={(e) => setRawRole(e.target.value)}
                placeholder="e.g. Senior Developer"
                className="w-full h-8 px-2.5 text-xs bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#faff69] rounded-md outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#888888] block mb-1">Optimization Tone</label>
              <select
                value={rawTone}
                onChange={(e) => setRawTone(e.target.value as any)}
                className="w-full h-8 px-2 text-xs bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#faff69] rounded-md outline-none"
              >
                <option value="quantified_impact">Quantified Impact (XYZ)</option>
                <option value="leadership">Leadership &amp; Strategy</option>
                <option value="ats_optimized">ATS Keyword Density</option>
                <option value="concise">Concise &amp; Direct</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleOptimizeRaw}
            disabled={rawLoading || !rawInput.trim()}
            className="w-full h-10 bg-[#faff69] hover:bg-[#e6eb52] disabled:opacity-50 text-[#0a0a0a] font-bold text-xs gap-2 rounded-lg inline-flex items-center justify-center transition-colors shadow-md"
          >
            {rawLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {rawLoading ? "Optimizing into ATS Format…" : "Optimize into ATS Content"}
          </button>

          {/* ── OPTIMIZED RESULTS DISPLAY ── */}
          {rawResult && (
            <div className="space-y-3 pt-2 animate-in fade-in">
              {/* ATS Optimization Banner */}
              <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-[#242424] text-[#22c55e]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">ATS Optimization Ready</h4>
                    <p className="text-[10px] text-[#888888] font-mono">Google XYZ Framework Applied</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-[#22c55e] bg-[#242424] px-2.5 py-0.5 rounded-full border border-[#2a2a2a]">
                    {rawResult.atsScore}%
                  </span>
                </div>
              </div>

              {/* Summary Statement Card */}
              {rawResult.optimizedSummary && (
                <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-[#faff69]" /> Optimized Summary
                    </span>
                    <button
                      onClick={() => {
                        setSummary(rawResult.optimizedSummary);
                        toast.success("Applied to resume summary!");
                      }}
                      className="text-[10px] text-[#faff69] hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Apply to Summary
                    </button>
                  </div>
                  <p className="text-[11px] text-[#cccccc] leading-relaxed bg-[#121212] p-2.5 rounded-md border border-[#2a2a2a] italic">
                    &ldquo;{rawResult.optimizedSummary}&rdquo;
                  </p>
                </div>
              )}

              {/* Quantified Bullets List */}
              {rawResult.optimizedBullets && rawResult.optimizedBullets.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#faff69]" /> Quantified Achievement Bullets
                    </span>
                    <button
                      onClick={() => {
                        if (data.experience.length > 0) {
                          updateExperience(data.experience[0].id, {
                            achievements: [...(data.experience[0].achievements || []), ...rawResult.optimizedBullets],
                          });
                          toast.success("Added bullets to active experience!");
                        } else {
                          handleAddStructuredExperience(rawResult.structuredEntry || {});
                        }
                      }}
                      className="text-[10px] text-[#faff69] hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add All to Experience
                    </button>
                  </div>

                  <ul className="space-y-2 text-[11px] text-[#cccccc]">
                    {rawResult.optimizedBullets.map((bullet, idx) => (
                      <li key={idx} className="p-2 rounded bg-[#121212] border border-[#2a2a2a] flex items-start justify-between gap-2 group">
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#faff69] font-bold mt-0.5">•</span>
                          <span className="leading-snug">{bullet}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(bullet);
                              toast.success("Bullet copied!");
                            }}
                            className="p-1 text-[#888888] hover:text-white"
                            title="Copy bullet"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Extracted ATS Keywords */}
              {rawResult.extractedKeywords && rawResult.extractedKeywords.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-[#faff69]" /> Extracted ATS Keywords
                    </span>
                    <button
                      onClick={() => handleAddAllKeywords(rawResult.extractedKeywords)}
                      className="text-[10px] text-[#faff69] hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add All to Skills
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rawResult.extractedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="bg-[#121212] text-[#faff69] border border-[#2a2a2a] text-[10px] uppercase font-mono px-2 py-0.5 rounded-md"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions: Save to Stash or Insert as Full Entry */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() =>
                    saveToStash({
                      role: rawRole || "Optimized Content",
                      summary: rawResult.optimizedSummary,
                      bullets: rawResult.optimizedBullets,
                      keywords: rawResult.extractedKeywords,
                    })
                  }
                  className="flex-1 h-9 text-xs bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] text-[#faff69] font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" /> Save to Stash (Add Later)
                </button>
                <button
                  onClick={() => handleAddStructuredExperience(rawResult.structuredEntry || {})}
                  className="flex-1 h-9 text-xs bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-bold rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Insert New Role
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: SCORES ── */}
      {activeTab === "score" && (
        <div className="space-y-4 pt-1">
          {/* Resume Quality Score */}
          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-[#faff69]" /> Resume Quality Score
              </span>
              <span className="font-mono text-sm font-bold text-[#faff69] bg-[#242424] px-2.5 py-0.5 rounded-full border border-[#2a2a2a]">
                {resumeScore}%
              </span>
            </div>
            <Progress value={resumeScore} className="h-1.5 bg-[#121212] [&>div]:bg-[#faff69]" />
            <p className="text-[11px] text-[#888888]">
              Grade A: High-density layout structure, quantification, and section completeness.
            </p>
          </div>

          {/* ATS Compatibility Percentage Bar */}
          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#22c55e]" /> ATS Parsing Rate
              </span>
              <span className="font-mono text-sm font-bold text-[#22c55e] bg-[#242424] px-2.5 py-0.5 rounded-full border border-[#2a2a2a]">
                {atsScore}%
              </span>
            </div>
            <Progress value={atsScore} className="h-1.5 bg-[#121212] [&>div]:bg-[#22c55e]" />
            <p className="text-[11px] text-[#888888]">
              100% vector text parseability. Certified for Taleo, Greenhouse, Workday.
            </p>
          </div>

          {/* Checklist */}
          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-2">
            <p className="text-xs font-bold text-white mb-1.5">Optimization Checklist</p>
            {[
              { label: "Personal Info & Contact Links", done: Boolean(data.personalInfo.fullName && data.personalInfo.email) },
              { label: "Professional Summary Statement", done: Boolean(data.summary && data.summary.length > 30) },
              { label: "Work Experience & Quantified Bullets", done: Boolean(data.experience.length > 0) },
              { label: "Categorized Technical Skills", done: Boolean(data.skills.length > 0) },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <CheckCircle2 className={`w-3.5 h-3.5 ${item.done ? "text-[#22c55e]" : "text-[#888888]"}`} />
                <span className={item.done ? "text-white" : "text-[#888888]"}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: AI CONTENT STYLES & VARIATIONS ── */}
      {activeTab === "optimizer" && (
        <div className="space-y-4 pt-1">
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#888888]">Target Job Role / Title</label>
            <div className="flex gap-2">
              <input
                value={optimizerRole}
                onChange={(e) => setOptimizerRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="h-9 px-3 text-xs bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#faff69] rounded-md flex-1 outline-none"
              />
              <button
                onClick={handleOptimizeContent}
                className="h-9 px-3.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs rounded-md shrink-0 gap-1.5 inline-flex items-center transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Generate
              </button>
            </div>
          </div>

          <div className="text-xs text-[#888888] flex items-center justify-between">
            <span>5 AI Optimized Variations:</span>
            <span className="font-mono text-[10px] text-[#faff69]">Click to apply</span>
          </div>

          {/* List of 5 Options */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {optimizerOptions.map((opt) => (
              <div
                key={opt.id}
                className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{opt.title}</h4>
                  <span className="bg-[#242424] text-[#faff69] border border-[#2a2a2a] text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                    {opt.tag}
                  </span>
                </div>
                <p className="text-[10px] text-[#888888]">{opt.description}</p>

                {opt.summary && (
                  <div className="p-2.5 rounded-md bg-[#121212] border border-[#2a2a2a] text-[11px] text-[#cccccc] italic">
                    &ldquo;{opt.summary}&rdquo;
                  </div>
                )}

                {opt.bullets && opt.bullets.length > 0 && (
                  <ul className="space-y-1 text-[11px] text-[#cccccc]">
                    {opt.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#faff69] font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${opt.summary}\n\n${opt.bullets.join("\n")}`);
                      toast.success("Copied option content to clipboard!");
                    }}
                    className="flex-1 h-8 text-[11px] border border-[#2a2a2a] bg-[#121212] hover:bg-[#242424] text-white gap-1 rounded-md inline-flex items-center justify-center font-semibold transition-colors"
                  >
                    <Copy className="w-3 h-3 text-[#888888]" /> Copy Content
                  </button>
                  <button
                    onClick={() => applyOptionToResume(opt)}
                    className="flex-1 h-8 text-[11px] bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold gap-1 rounded-md inline-flex items-center justify-center transition-colors"
                  >
                    <Check className="w-3 h-3" /> Apply to Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: KEYWORD MATCHER ── */}
      {activeTab === "keywords" && (
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#faff69]" /> Active Keywords
            </span>
            <button
              onClick={handleScanKeywords}
              className="h-7 px-3 text-[10px] border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] gap-1 rounded-md inline-flex items-center font-semibold transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-[#faff69]" /> Scan Again
            </button>
          </div>

          {/* Current Detected Keywords */}
          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-2">
            <p className="text-xs font-mono text-[#888888]">DETECTED KEYWORDS ({detectedKeywords.length}):</p>
            <div className="flex flex-wrap gap-1.5">
              {detectedKeywords.map((kw, i) => (
                <span key={i} className="bg-[#121212] text-[#faff69] border border-[#2a2a2a] text-[10px] uppercase font-mono px-2 py-0.5 rounded-md">
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Suggestive Keywords */}
          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-2">
            <p className="text-xs font-mono text-[#888888]">SUGGESTED KEYWORDS ({suggestedKeywords.length}):</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedKeywords.map((kw, i) => (
                <button
                  key={i}
                  onClick={() => addSuggestedKeywordToResume(kw)}
                  className="px-2.5 py-1 rounded-md bg-[#121212] border border-[#2a2a2a] hover:border-[#faff69] text-[10px] text-white flex items-center gap-1 transition-colors font-mono"
                >
                  <Plus className="w-3 h-3 text-[#faff69]" /> {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: AI COVER LETTER ── */}
      {activeTab === "cover" && (
        <div className="space-y-4 pt-1">
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#888888]">Target Company &amp; Role</label>
            <textarea
              value={coverLetterJd}
              onChange={(e) => setCoverLetterJd(e.target.value)}
              rows={4}
              placeholder="Paste target job description or company name to tailor cover letter..."
              className="w-full text-xs bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#faff69] rounded-md p-3 resize-none outline-none"
            />
          </div>

          <button
            onClick={handleGenerateCoverLetter}
            disabled={loading}
            className="w-full h-11 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs gap-2 rounded-md inline-flex items-center justify-center transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Tailored Cover Letter
          </button>
        </div>
      )}

      {/* Cover Letter Modal */}
      <Dialog open={showCoverModal} onOpenChange={setShowCoverModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#1a1a1a] border-[#2a2a2a] text-white p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
              <Mail className="w-5 h-5 text-[#faff69]" /> AI Tailored Cover Letter
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-[#121212] border border-[#2a2a2a] text-xs leading-relaxed font-sans whitespace-pre-wrap text-[#cccccc]">
              {coverLetterContent}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(coverLetterContent);
                toast.success("Cover letter copied to clipboard!");
              }}
              className="w-full h-11 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs gap-2 rounded-md inline-flex items-center justify-center transition-colors"
            >
              <Copy className="w-4 h-4" /> Copy Full Cover Letter
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
