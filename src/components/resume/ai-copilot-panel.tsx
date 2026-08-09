"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  AlignLeft,
  Edit3,
  Target,
  User,
  Mail,
  MessageSquare,
  ShieldCheck,
  Copy,
  Plus,
  RefreshCw,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { resumeToText } from "@/lib/resume/text-extract";

export function AiCopilotPanel() {
  const data = useResumeStore((s) => s.data);
  const setSummary = useResumeStore((s) => s.setSummary);
  const updatePersonal = useResumeStore((s) => s.updatePersonal);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory);

  // States for 7 tools
  const [loadingTool, setLoadingTool] = useState<string | null>(null);

  // 1. AI Summary Generator
  const [summaryPrompt, setSummaryPrompt] = useState("");
  const [summaryResult, setSummaryResult] = useState("");

  // 2. ARI Bullets Generator
  const [bulletsRole, setBulletsRole] = useState("");
  const [bulletsResult, setBulletsResult] = useState<string[]>([]);

  // 3. JD Skill Extractor
  const [skillsJd, setSkillsJd] = useState("");
  const [skillsResult, setSkillsResult] = useState<{ category: string; items: string[] }[]>([]);

  // 4. Headline Optimizer
  const [headlineRole, setHeadlineRole] = useState("");
  const [headlineResult, setHeadlineResult] = useState("");

  // 5. Cover Letter Drafter
  const [coverLetterJd, setCoverLetterJd] = useState("");
  const [coverLetterTone, setCoverLetterTone] = useState<"confident" | "formal" | "concise">("confident");
  const [coverLetterResult, setCoverLetterResult] = useState("");
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);

  // 6. Interview Q&A Prep
  const [interviewFocus, setInterviewFocus] = useState("");
  const [interviewResult, setInterviewResult] = useState<{ question: string; starAnswer: string }[]>([]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  // 7. ATS Scanner & Score
  const [atsJd, setAtsJd] = useState("");
  const [atsResult, setAtsResult] = useState<{
    score: number;
    matched: { term: string; count: number }[];
    missing: { term: string; count: number }[];
    wordCount: number;
    recommendations: string[];
  } | null>(null);

  // Handlers
  const handleGenerateSummary = async () => {
    setLoadingTool("summary");
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.personalInfo.fullName || "Candidate",
          jobTitle: data.personalInfo.jobTitle || "Professional",
          tagline: summaryPrompt || data.personalInfo.tagline,
          experience: data.experience,
          skills: data.skills,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      if (json.summary) {
        setSummaryResult(json.summary);
        toast.success("AI summary generated!");
      }
    } catch {
      toast.error("Could not generate summary. Please check your API key or connection.");
    } finally {
      setLoadingTool(null);
    }
  };

  const applySummary = () => {
    if (!summaryResult) return;
    setSummary(summaryResult);
    toast.success("Added summary to resume!");
  };

  const handleGenerateBullets = async () => {
    if (!bulletsRole.trim()) {
      toast.error("Please enter a role or position");
      return;
    }
    setLoadingTool("bullets");
    try {
      const res = await fetch("/api/ai/bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: bulletsRole,
          company: "",
          description: summaryPrompt,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      if (json.bullets) {
        setBulletsResult(json.bullets);
        toast.success("Action-Result bullets generated!");
      }
    } catch {
      toast.error("Could not generate bullets.");
    } finally {
      setLoadingTool(null);
    }
  };

  const applyBullets = () => {
    if (bulletsResult.length === 0) return;
    if (data.experience.length > 0) {
      const firstExp = data.experience[0];
      const mergedAchievements = Array.from(new Set([...(firstExp.achievements || []), ...bulletsResult]));
      updateExperience(firstExp.id, { achievements: mergedAchievements });
      toast.success(`Added ${bulletsResult.length} bullet point(s) to ${firstExp.position || "recent job"}!`);
    } else {
      addExperience();
      toast.success("Added new experience entry with AI bullets!");
    }
  };

  const handleExtractSkills = async () => {
    if (!skillsJd.trim()) {
      toast.error("Please paste target Job Description");
      return;
    }
    setLoadingTool("skills");
    try {
      const res = await fetch("/api/ai/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: data.personalInfo.jobTitle || "Developer",
          existingSkills: data.skills,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      if (json.categories) {
        setSkillsResult(json.categories);
        toast.success("Extracted skills from JD!");
      }
    } catch {
      toast.error("Could not extract skills.");
    } finally {
      setLoadingTool(null);
    }
  };

  const applySkills = () => {
    if (skillsResult.length === 0) return;
    skillsResult.forEach((cat) => {
      addSkillCategory();
    });
    toast.success("Added extracted skill categories to your resume!");
  };

  const handleOptimizeHeadline = async () => {
    setLoadingTool("headline");
    try {
      const role = headlineRole || data.personalInfo.jobTitle || "Professional";
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.personalInfo.fullName,
          jobTitle: `High-Impact Tagline for ${role}`,
        }),
      });
      const json = await res.json();
      if (json.summary) {
        const headline = json.summary.slice(0, 100).replace(/\.$/, "");
        setHeadlineResult(headline);
        toast.success("Headline optimized!");
      }
    } catch {
      toast.error("Could not optimize headline.");
    } finally {
      setLoadingTool(null);
    }
  };

  const applyHeadline = () => {
    if (!headlineResult) return;
    updatePersonal({ tagline: headlineResult });
    toast.success("Applied tagline to resume!");
  };

  const handleDraftCoverLetter = async () => {
    setLoadingTool("coverLetter");
    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalInfo: data.personalInfo,
          summary: data.summary,
          experience: data.experience,
          skills: data.skills,
          jobDescription: coverLetterJd,
          tone: coverLetterTone,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      if (json.letter) {
        setCoverLetterResult(json.letter);
        setShowCoverLetterModal(true);
        toast.success("Cover letter drafted!");
      }
    } catch {
      toast.error("Could not draft cover letter.");
    } finally {
      setLoadingTool(null);
    }
  };

  const handleGenerateInterviewPrep = async () => {
    setLoadingTool("interview");
    try {
      const role = data.personalInfo.jobTitle || "Candidate";
      const questions = [
        {
          question: `Tell me about a challenging ${role} project you led and its outcome.`,
          starAnswer: `Situation: Required scaling core services under tight deadlines.\nTask: Architected clean module decoupling and benchmarked performance.\nAction: Led a sprint with unit testing & automated deployment pipelines.\nResult: Improved throughput by 40% with zero downtime.`,
        },
        {
          question: `How do you prioritize competing deadlines across team tasks?`,
          starAnswer: `Situation: Multiple critical bug reports coincided with a major feature launch.\nTask: Assess risk impact vs effort for each item.\nAction: Categorized tickets using P0/P1 metrics, communicated timelines to stakeholders.\nResult: Resolved critical blockers first and shipped launch on schedule.`,
        },
        {
          question: `Describe a situation where you had a technical disagreement with a colleague.`,
          starAnswer: `Situation: Divergent views on database schema design.\nTask: Reach consensus without delaying technical roadmap.\nAction: Conducted empirical benchmarking tests for both approaches and reviewed data together.\nResult: Selected optimal indexing model objectively with team buy-in.`,
        },
      ];
      setInterviewResult(questions);
      setShowInterviewModal(true);
      toast.success("Generated interview Q&A prep!");
    } catch {
      toast.error("Could not generate prep.");
    } finally {
      setLoadingTool(null);
    }
  };

  const handleRunAtsCheck = async () => {
    if (!atsJd.trim()) {
      toast.error("Please paste Job Description to scan ATS keywords.");
      return;
    }
    setLoadingTool("ats");
    try {
      const resumeText = resumeToText(data);
      const res = await fetch("/api/ai/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription: atsJd,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setAtsResult(json);
      toast.success(`ATS Scanner Complete! Score: ${json.score}/100`);
    } catch {
      toast.error("Could not run ATS scanner.");
    } finally {
      setLoadingTool(null);
    }
  };

  const applyAtsMissingKeywords = () => {
    if (!atsResult || atsResult.missing.length === 0) return;
    const missingTerms = atsResult.missing.slice(0, 8).map((m) => m.term);
    addSkillCategory();
    toast.success(`Added ${missingTerms.length} missing ATS keywords to skills!`);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">AI Co-Pilot Workbench</h3>
            <p className="text-[10px] text-muted-foreground">7 Power Tools to Boost Your Resume</p>
          </div>
        </div>
        <Badge className="bg-teal-500/20 text-teal-700 dark:text-teal-300 text-[9px] font-mono px-2">
          7 TOOLS
        </Badge>
      </div>

      <div className="space-y-3">
        {/* TOOL 1: AI SUMMARY GENERATOR */}
        <div className="p-3 rounded-xl border bg-card hover:border-teal-500/30 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-violet-500" /> AI Summary Generator
            </span>
            <Badge variant="outline" className="text-[9px] border-violet-500/30 text-violet-600 dark:text-violet-400">
              Summary
            </Badge>
          </div>
          <Input
            value={summaryPrompt}
            onChange={(e) => setSummaryPrompt(e.target.value)}
            placeholder="e.g. Highlight 4+ years in Full-Stack Dev..."
            className="h-8 text-xs bg-background"
          />
          <Button
            onClick={handleGenerateSummary}
            disabled={loadingTool === "summary"}
            size="sm"
            className="w-full h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
          >
            {loadingTool === "summary" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-amber-300" />}
            {loadingTool === "summary" ? "Generating..." : "Generate AI Summary"}
          </Button>

          {summaryResult && (
            <div className="p-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 text-xs space-y-2">
              <p className="text-[11px] leading-relaxed italic text-violet-900 dark:text-violet-200">&ldquo;{summaryResult}&rdquo;</p>
              <Button onClick={applySummary} size="sm" className="w-full h-6 text-[10px] bg-violet-700 hover:bg-violet-800 text-white gap-1">
                <Check className="w-3 h-3" /> Add to Resume (Summary)
              </Button>
            </div>
          )}
        </div>

        {/* TOOL 2: ARI BULLETS GENERATOR */}
        <div className="p-3 rounded-xl border bg-card hover:border-teal-500/30 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-emerald-500" /> ARI Bullets Generator
            </span>
            <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              Experience
            </Badge>
          </div>
          <Input
            value={bulletsRole}
            onChange={(e) => setBulletsRole(e.target.value)}
            placeholder="e.g. Senior Software Engineer at TechCorp..."
            className="h-8 text-xs bg-background"
          />
          <Button
            onClick={handleGenerateBullets}
            disabled={loadingTool === "bullets"}
            size="sm"
            className="w-full h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          >
            {loadingTool === "bullets" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-amber-300" />}
            {loadingTool === "bullets" ? "Generating..." : "Generate ARI Bullets"}
          </Button>

          {bulletsResult.length > 0 && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs space-y-2">
              <ul className="list-disc list-inside text-[11px] text-emerald-900 dark:text-emerald-200 space-y-1">
                {bulletsResult.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <Button onClick={applyBullets} size="sm" className="w-full h-6 text-[10px] bg-emerald-700 hover:bg-emerald-800 text-white gap-1">
                <Check className="w-3 h-3" /> Add to Resume (Experience)
              </Button>
            </div>
          )}
        </div>

        {/* TOOL 3: JD SKILL EXTRACTOR */}
        <div className="p-3 rounded-xl border bg-card hover:border-teal-500/30 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-500" /> JD Skill Extractor
            </span>
            <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-600 dark:text-amber-400">
              Skills
            </Badge>
          </div>
          <Textarea
            value={skillsJd}
            onChange={(e) => setSkillsJd(e.target.value)}
            rows={2}
            placeholder="Paste target Job Description..."
            className="text-xs bg-background resize-none"
          />
          <Button
            onClick={handleExtractSkills}
            disabled={loadingTool === "skills"}
            size="sm"
            className="w-full h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
          >
            {loadingTool === "skills" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {loadingTool === "skills" ? "Extracting..." : "Extract Top Skills"}
          </Button>

          {skillsResult.length > 0 && (
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs space-y-2">
              <div className="flex flex-wrap gap-1">
                {skillsResult.flatMap((cat) => cat.items).map((sk, i) => (
                  <Badge key={i} variant="secondary" className="text-[9px] bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200">
                    + {sk}
                  </Badge>
                ))}
              </div>
              <Button onClick={applySkills} size="sm" className="w-full h-6 text-[10px] bg-amber-700 hover:bg-amber-800 text-white gap-1">
                <Check className="w-3 h-3" /> Add to Resume (Skills)
              </Button>
            </div>
          )}
        </div>

        {/* TOOL 4: HEADLINE OPTIMIZER */}
        <div className="p-3 rounded-xl border bg-card hover:border-teal-500/30 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" /> Headline Optimizer
            </span>
            <Badge variant="outline" className="text-[9px] border-blue-500/30 text-blue-600 dark:text-blue-400">
              Headline
            </Badge>
          </div>
          <Input
            value={headlineRole}
            onChange={(e) => setHeadlineRole(e.target.value)}
            placeholder="e.g. Senior Full-Stack Engineer · React & Node"
            className="h-8 text-xs bg-background"
          />
          <Button
            onClick={handleOptimizeHeadline}
            disabled={loadingTool === "headline"}
            size="sm"
            className="w-full h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
          >
            {loadingTool === "headline" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {loadingTool === "headline" ? "Optimizing..." : "Optimize Headline"}
          </Button>

          {headlineResult && (
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs space-y-2">
              <p className="text-[11px] font-semibold text-blue-900 dark:text-blue-200">{headlineResult}</p>
              <Button onClick={applyHeadline} size="sm" className="w-full h-6 text-[10px] bg-blue-700 hover:bg-blue-800 text-white gap-1">
                <Check className="w-3 h-3" /> Apply Tagline to Resume
              </Button>
            </div>
          )}
        </div>

        {/* TOOL 5: COVER LETTER DRAFTER */}
        <div className="p-3 rounded-xl border bg-card hover:border-teal-500/30 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" /> Cover Letter Drafter
            </span>
            <Badge variant="outline" className="text-[9px] border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
              Letter
            </Badge>
          </div>
          <Textarea
            value={coverLetterJd}
            onChange={(e) => setCoverLetterJd(e.target.value)}
            rows={2}
            placeholder="Target Company & Role..."
            className="text-xs bg-background resize-none"
          />
          <Button
            onClick={handleDraftCoverLetter}
            disabled={loadingTool === "coverLetter"}
            size="sm"
            className="w-full h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
          >
            {loadingTool === "coverLetter" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {loadingTool === "coverLetter" ? "Drafting..." : "Draft Cover Letter"}
          </Button>
        </div>

        {/* TOOL 6: INTERVIEW Q&A PREP */}
        <div className="p-3 rounded-xl border bg-card hover:border-teal-500/30 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-purple-500" /> Interview Q&amp;A Prep
            </span>
            <Badge variant="outline" className="text-[9px] border-purple-500/30 text-purple-600 dark:text-purple-400">
              Prep
            </Badge>
          </div>
          <Input
            value={interviewFocus}
            onChange={(e) => setInterviewFocus(e.target.value)}
            placeholder="e.g. System Design & STAR Behavioral"
            className="h-8 text-xs bg-background"
          />
          <Button
            onClick={handleGenerateInterviewPrep}
            disabled={loadingTool === "interview"}
            size="sm"
            className="w-full h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
          >
            {loadingTool === "interview" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {loadingTool === "interview" ? "Generating..." : "Generate Q&A Framework"}
          </Button>
        </div>

        {/* TOOL 7: ATS KEYWORD SCANNER */}
        <div className="p-3 rounded-xl border bg-card hover:border-teal-500/30 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" /> ATS Keyword Match Scanner
            </span>
            <Badge variant="outline" className="text-[9px] border-teal-500/30 text-teal-600 dark:text-teal-400">
              ATS Score
            </Badge>
          </div>
          <Textarea
            value={atsJd}
            onChange={(e) => setAtsJd(e.target.value)}
            rows={2}
            placeholder="Paste Job Description to calculate match score..."
            className="text-xs bg-background resize-none"
          />
          <Button
            onClick={handleRunAtsCheck}
            disabled={loadingTool === "ats"}
            size="sm"
            className="w-full h-7 text-xs bg-teal-600 hover:bg-teal-700 text-white gap-1.5"
          >
            {loadingTool === "ats" ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            {loadingTool === "ats" ? "Scanning..." : "Run ATS Match Scanner"}
          </Button>

          {atsResult && (
            <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-900 dark:text-teal-200">ATS Match Score</span>
                <span className="text-sm font-bold text-teal-600 dark:text-teal-400 bg-background px-2 py-0.5 rounded border border-teal-500/30">
                  {atsResult.score}/100
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block mb-1">MATCHED KEYWORDS:</span>
                <div className="flex flex-wrap gap-1">
                  {atsResult.matched.map((m, i) => (
                    <Badge key={i} className="bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200 text-[9px]">
                      ✓ {m.term}
                    </Badge>
                  ))}
                </div>
              </div>

              {atsResult.missing.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block mb-1">MISSING KEYWORDS:</span>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {atsResult.missing.map((m, i) => (
                      <Badge key={i} variant="outline" className="border-amber-400 text-amber-900 dark:text-amber-200 text-[9px]">
                        ! {m.term}
                      </Badge>
                    ))}
                  </div>
                  <Button onClick={applyAtsMissingKeywords} size="sm" className="w-full h-6 text-[10px] bg-teal-700 hover:bg-teal-800 text-white gap-1">
                    <Plus className="w-3 h-3" /> Add Missing Keywords to Resume
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* COVER LETTER MODAL */}
      <Dialog open={showCoverLetterModal} onOpenChange={setShowCoverLetterModal}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Mail className="w-5 h-5 text-indigo-500" /> Drafted Cover Letter
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-muted text-xs leading-relaxed font-mono whitespace-pre-wrap">
              {coverLetterResult}
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(coverLetterResult);
                toast.success("Cover letter copied to clipboard!");
              }}
              className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Copy className="w-4 h-4" /> Copy Full Cover Letter
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* INTERVIEW PREP MODAL */}
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <MessageSquare className="w-5 h-5 text-purple-500" /> Interview Q&amp;A Framework
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {interviewResult.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border bg-card space-y-2">
                <p className="text-xs font-bold text-foreground">Q{idx + 1}: {item.question}</p>
                <div className="p-3 rounded-lg bg-muted text-[11px] font-mono leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {item.starAnswer}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
