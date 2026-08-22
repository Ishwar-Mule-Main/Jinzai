"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { resumeToText } from "@/lib/resume/text-extract";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Mail, Loader2, Sparkles, Copy, Download, Target, FileSearch, CheckCircle2, XCircle, TrendingUp, Gauge, Award, FileText, Wand2, Plus, Check, ShieldCheck, Tag } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { hasAiAccess, hasAtsAccess } from "@/lib/resume/plans";

// ---------- Cover Letter Generator ----------

export function CoverLetterDialog() {
  const { user } = useCurrentUser();
  const aiAllowed = user ? hasAiAccess(user.plan) : false;
  const data = useResumeStore((s) => s.data);
  const [open, setOpen] = useState(false);
  const [jd, setJd] = useState("");
  const [tone, setTone] = useState<"confident" | "formal" | "concise">("confident");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!aiAllowed) {
      toast.error("AI tools require Pro or Business plan!");
      return;
    }
    setLoading(true);
    setLetter("");
    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalInfo: data.personalInfo,
          summary: data.summary,
          experience: data.experience,
          skills: data.skills,
          jobDescription: jd,
          tone,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setLetter(json.letter);
      toast.success("Cover letter generated");
    } catch {
      toast.error("Could not generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(letter);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.personalInfo.fullName || "cover"}-cover-letter.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) {
      toast.error("Pop-up blocked. Allow pop-ups to download PDF.");
      return;
    }
    const paragraphs = letter.split(/\n\n+/);
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.personalInfo.fullName || "Candidate"} - Cover Letter</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            h1 { font-size: 24px; margin-bottom: 4px; }
            .meta { color: #666; font-size: 13px; margin-bottom: 24px; }
            p { margin-bottom: 16px; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>${data.personalInfo.fullName || "Candidate Name"}</h1>
          <div class="meta">${data.personalInfo.jobTitle || ""}</div>
          ${paragraphs.map((p) => `<p>${p}</p>`).join("")}
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-9 px-3 gap-1.5 text-xs text-[#cccccc] hover:text-white bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] rounded-md font-semibold inline-flex items-center transition-colors">
          <Mail className="w-3.5 h-3.5 text-[#faff69]" /> Cover Letter
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white tracking-tight">
            <Mail className="w-5 h-5 text-[#faff69]" /> AI Cover Letter Generator
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888888]">
            Generate a targeted cover letter tailored to a specific job description.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-mono text-[#888888]">Target Job Description (Optional)</label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={4}
              className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-xs text-white rounded-md p-3 outline-none resize-none mt-1"
              placeholder="Paste the job description to tailor the letter…"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#888888]">Tone of Voice</label>
            <div className="flex gap-2 mt-1">
              {(["confident", "formal", "concise"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors capitalize ${
                    tone === t ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "bg-[#121212] border border-[#2a2a2a] text-[#888888] hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button onClick={generate} disabled={loading} className="w-full h-10 gap-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md text-xs inline-flex items-center justify-center transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Generating…" : "Generate Cover Letter"}
          </button>
          {letter && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-[#888888]">Draft Result</label>
                <div className="flex gap-1.5">
                  <button onClick={copy} className="h-7 px-2.5 rounded bg-[#121212] hover:bg-[#242424] border border-[#2a2a2a] text-xs text-white gap-1 inline-flex items-center transition-colors">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                  <button onClick={download} className="h-7 px-2.5 rounded bg-[#121212] hover:bg-[#242424] border border-[#2a2a2a] text-xs text-white gap-1 inline-flex items-center transition-colors">
                    <Download className="w-3 h-3" /> .txt
                  </button>
                  <button onClick={downloadPdf} className="h-7 px-2.5 rounded bg-[#121212] hover:bg-[#242424] border border-[#2a2a2a] text-xs text-white gap-1 inline-flex items-center transition-colors">
                    <FileText className="w-3 h-3" /> PDF
                  </button>
                </div>
              </div>
              <textarea value={letter} readOnly rows={12} className="w-full bg-[#121212] border border-[#2a2a2a] text-xs leading-relaxed text-[#cccccc] rounded-md p-3 outline-none resize-none" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- ATS Keyword Analysis ----------

interface AtsResult {
  score: number;
  matched: { term: string; count: number }[];
  missing: { term: string; count: number }[];
  wordCount: number;
  jobKeywordCount: number;
  recommendations: string[];
}

export function AtsDialog() {
  const { user } = useCurrentUser();
  const atsAllowed = user ? hasAtsAccess(user.plan) : false;
  const data = useResumeStore((s) => s.data);
  const [open, setOpen] = useState(false);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AtsResult | null>(null);

  const analyze = async () => {
    if (!atsAllowed) {
      toast.error("ATS Check requires Pro or Business plan!");
      return;
    }
    if (jd.trim().length < 50) {
      toast.error("Please paste a more complete job description");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const resumeText = resumeToText(data);
      const res = await fetch("/api/ai/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription: jd }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setResult(json);
    } catch {
      toast.error("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) =>
    s >= 75 ? "text-[#22c55e]" : s >= 50 ? "text-[#faff69]" : "text-[#ef4444]";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-9 px-3 gap-1.5 text-xs text-[#cccccc] hover:text-white bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] rounded-md font-semibold inline-flex items-center transition-colors">
          <Target className="w-3.5 h-3.5 text-[#faff69]" /> ATS Check
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white tracking-tight">
            <Target className="w-5 h-5 text-[#faff69]" /> ATS Keyword Match
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888888]">
            Paste a target job description to verify keyword density and ATS match rating.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-1">
          <div>
            <label className="text-xs font-mono text-[#888888]">Target Job Description</label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={5}
              placeholder="Paste the full job description here…"
              className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-xs text-white rounded-md p-3 outline-none resize-none mt-1"
            />
          </div>
          <button onClick={analyze} disabled={loading} className="w-full h-10 gap-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md text-xs inline-flex items-center justify-center transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
            {loading ? "Analyzing…" : "Analyze Match"}
          </button>

          {result && (
            <div className="space-y-4 pt-2">
              {/* Score card */}
              <div className="rounded-xl border border-[#2a2a2a] p-4 bg-[#121212]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${scoreColor(result.score)} bg-[#1a1a1a] border border-[#2a2a2a]`}>
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[#888888]">ATS MATCH SCORE</p>
                      <p className={`text-2xl font-bold font-mono ${scoreColor(result.score)}`}>{result.score}%</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-[#888888] font-mono space-y-0.5">
                    <p>{result.wordCount} words</p>
                    <p>{result.jobKeywordCount} job keywords</p>
                    <p>{result.matched.length} matched · {result.missing.length} missing</p>
                  </div>
                </div>
                <Progress value={result.score} className="h-1.5 bg-[#1a1a1a] [&>div]:bg-[#faff69]" />
              </div>

              {/* Matched */}
              {result.matched.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> Matched keywords
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched.map((k) => (
                      <span key={k.term} className="bg-[#121212] text-[#22c55e] border border-[#2a2a2a] text-xs font-mono px-2 py-0.5 rounded">
                        ✓ {k.term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing */}
              {result.missing.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-white">
                    <XCircle className="w-3.5 h-3.5 text-[#ef4444]" /> Missing keywords
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing.map((k) => (
                      <span key={k.term} className="bg-[#121212] text-[#888888] border border-[#2a2a2a] text-xs font-mono px-2 py-0.5 rounded">
                        {k.term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="rounded-xl border border-[#2a2a2a] p-3.5 bg-[#121212]">
                <p className="text-xs font-bold text-white mb-2">Recommendations</p>
                <ul className="space-y-1.5">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="text-xs text-[#cccccc] flex gap-2">
                      <span className="text-[#faff69] shrink-0 font-mono">→</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Resume Score (holistic quality analysis) ----------

interface ScoreCategory {
  name: string;
  score: number;
  max: number;
  detail: string;
}
interface ScoreResult {
  score: number;
  grade: string;
  categories: ScoreCategory[];
  recommendations: string[];
  stats: {
    totalBullets: number;
    quantifiedBullets: number;
    actionVerbBullets: number;
    skillCount: number;
    experienceCount: number;
    projectCount: number;
  };
}

export function ResumeScoreDialog() {
  const { user } = useCurrentUser();
  const atsAllowed = user ? hasAtsAccess(user.plan) : false;
  const data = useResumeStore((s) => s.data);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const analyze = async () => {
    if (!atsAllowed) {
      toast.error("Resume ATS Score requires Pro or Business plan!");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setResult(json);
    } catch {
      toast.error("Score analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (v && !result && !loading) {
      setTimeout(analyze, 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="h-9 px-3 gap-1.5 text-xs text-[#cccccc] hover:text-white bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] rounded-md font-semibold inline-flex items-center transition-colors">
          <Gauge className="w-3.5 h-3.5 text-[#faff69]" /> Resume Score
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white tracking-tight">
            <Award className="w-5 h-5 text-[#faff69]" /> Resume Quality Score
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888888]">
            Holistic quality benchmark evaluating quantified metrics, active verbs, and section completeness.
          </DialogDescription>
        </DialogHeader>

        {loading && !result && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#faff69]" />
            <p className="text-xs text-[#888888] font-mono">Analyzing resume quality…</p>
          </div>
        )}

        {result && (
          <div className="space-y-4 pt-1">
            {/* Score hero */}
            <div className="rounded-xl border border-[#2a2a2a] p-5 bg-[#121212] text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#242424] border border-[#2a2a2a] text-[#faff69] mb-3">
                <span className="text-2xl font-bold font-mono">{result.grade}</span>
              </div>
              <p className="text-3xl font-bold mb-1 font-mono text-white">
                {result.score}<span className="text-lg text-[#888888]">/100</span>
              </p>
              <p className="text-xs text-[#888888]">
                {result.score >= 85 ? "Excellent — verified for top-tier recruiter screening" :
                 result.score >= 70 ? "Good — minor enhancements recommended" :
                 "Needs work — review recommendations below"}
              </p>
            </div>

            {/* Category breakdown */}
            <div className="space-y-2">
              {result.categories.map((c) => {
                const ratio = c.score / c.max;
                return (
                  <div key={c.name} className="rounded-lg border border-[#2a2a2a] p-3 bg-[#121212]">
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <p className="text-xs font-semibold text-white">{c.name}</p>
                      <p className="text-xs font-mono">
                        <span className={ratio >= 0.6 ? "text-[#22c55e]" : "text-[#faff69]"}>{c.score}</span>
                        <span className="text-[#888888]">/{c.max}</span>
                      </p>
                    </div>
                    <div className="h-1 rounded-full bg-[#1a1a1a] overflow-hidden mb-1.5">
                      <div className={`h-full rounded-full ${ratio >= 0.6 ? "bg-[#22c55e]" : "bg-[#faff69]"}`} style={{ width: `${ratio * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-[#888888] font-mono">{c.detail}</p>
                  </div>
                );
              })}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-[#2a2a2a] p-2.5 text-center bg-[#121212]">
                <p className="text-base font-bold font-mono text-[#faff69]">{result.stats.quantifiedBullets}/{result.stats.totalBullets}</p>
                <p className="text-[10px] text-[#888888] font-mono">Quantified bullets</p>
              </div>
              <div className="rounded-lg border border-[#2a2a2a] p-2.5 text-center bg-[#121212]">
                <p className="text-base font-bold font-mono text-[#faff69]">{result.stats.actionVerbBullets}/{result.stats.totalBullets}</p>
                <p className="text-[10px] text-[#888888] font-mono">Action verbs</p>
              </div>
              <div className="rounded-lg border border-[#2a2a2a] p-2.5 text-center bg-[#121212]">
                <p className="text-base font-bold font-mono text-[#faff69]">{result.stats.skillCount}</p>
                <p className="text-[10px] text-[#888888] font-mono">Total skills</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-xl border border-[#2a2a2a] p-4 bg-[#121212]">
              <p className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#faff69]" /> AI Recommendations
              </p>
              <ul className="space-y-1.5">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="text-xs text-[#cccccc] flex gap-2">
                    <span className="text-[#faff69] shrink-0 font-mono">→</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={analyze} disabled={loading} className="w-full h-10 border border-[#2a2a2a] bg-[#121212] hover:bg-[#242424] text-white rounded-md text-xs font-semibold gap-1.5 inline-flex items-center justify-center transition-colors">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Gauge className="w-3.5 h-3.5 text-[#faff69]" />}
              Re-analyze
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------- Raw Material to ATS Optimizer Dialog ----------

export function RawOptimizerDialog() {
  const { user } = useCurrentUser();
  const aiAllowed = user ? hasAiAccess(user.plan) : false;
  const data = useResumeStore((s) => s.data);
  const setSummary = useResumeStore((s) => s.setSummary);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory);
  const updateSkillCategory = useResumeStore((s) => s.updateSkillCategory);

  const [open, setOpen] = useState(false);
  const [rawText, setRawText] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState<"quantified_impact" | "leadership" | "ats_optimized" | "concise">("quantified_impact");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    atsScore: number;
    optimizedSummary: string;
    optimizedBullets: string[];
    extractedKeywords: string[];
  } | null>(null);

  const optimize = async () => {
    if (!aiAllowed) {
      toast.error("AI Raw Optimizer requires Pro or Business plan!");
      return;
    }
    if (rawText.trim().length < 5) {
      toast.error("Please enter raw notes to optimize");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/raw-optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawContent: rawText,
          targetRole: role || data.personalInfo.jobTitle,
          tone,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setResult(json);
      toast.success("Optimized raw material into ATS content!");
    } catch {
      toast.error("Could not optimize raw notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-9 px-3 gap-1.5 text-xs text-[#cccccc] hover:text-white bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] rounded-md font-semibold inline-flex items-center transition-colors">
          <Wand2 className="w-3.5 h-3.5 text-[#faff69]" /> Raw to ATS
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white tracking-tight">
            <Wand2 className="w-5 h-5 text-[#faff69]" /> Raw Material to ATS Optimizer
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888888]">
            Paste messy notes or duty lists. AI converts them into high-impact, quantified resume bullets and keywords.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-mono text-[#888888]">Raw Content / Notes</label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={4}
              placeholder="e.g. built backend with nodejs and postgresql, improved query speed, deployed docker containers on AWS, led 3 junior devs..."
              className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-xs text-white rounded-md p-3 outline-none resize-none mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-[#888888]">Target Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-xs text-white rounded-md h-9 px-3 outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-[#888888]">Tone &amp; Style</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#faff69] text-xs text-white rounded-md h-9 px-2.5 outline-none mt-1"
              >
                <option value="quantified_impact">Quantified Impact (XYZ)</option>
                <option value="leadership">Leadership &amp; Strategy</option>
                <option value="ats_optimized">ATS Keyword Density</option>
                <option value="concise">Concise &amp; Direct</option>
              </select>
            </div>
          </div>

          <button
            onClick={optimize}
            disabled={loading || !rawText.trim()}
            className="w-full h-10 gap-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-bold rounded-md text-xs inline-flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {loading ? "Optimizing…" : "Transform to ATS Content"}
          </button>

          {result && (
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#121212] border border-[#2a2a2a]">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#22c55e]" /> ATS Rating
                </span>
                <span className="font-mono text-sm font-bold text-[#22c55e]">
                  {result.atsScore}%
                </span>
              </div>

              {result.optimizedSummary && (
                <div className="p-3 rounded-lg bg-[#121212] border border-[#2a2a2a] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Summary</span>
                    <button
                      onClick={() => {
                        setSummary(result.optimizedSummary);
                        toast.success("Applied to summary!");
                      }}
                      className="text-xs text-[#faff69] hover:underline font-semibold"
                    >
                      Apply to Summary
                    </button>
                  </div>
                  <p className="text-xs text-[#cccccc] italic leading-relaxed">
                    &ldquo;{result.optimizedSummary}&rdquo;
                  </p>
                </div>
              )}

              {result.optimizedBullets && result.optimizedBullets.length > 0 && (
                <div className="p-3 rounded-lg bg-[#121212] border border-[#2a2a2a] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Quantified Bullets</span>
                    <button
                      onClick={() => {
                        if (data.experience.length > 0) {
                          updateExperience(data.experience[0].id, {
                            achievements: [...(data.experience[0].achievements || []), ...result.optimizedBullets],
                          });
                          toast.success("Added bullets to current experience!");
                        }
                      }}
                      className="text-xs text-[#faff69] hover:underline font-semibold"
                    >
                      Add to Experience
                    </button>
                  </div>
                  <ul className="space-y-1 text-xs text-[#cccccc]">
                    {result.optimizedBullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#faff69] font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.extractedKeywords && result.extractedKeywords.length > 0 && (
                <div className="p-3 rounded-lg bg-[#121212] border border-[#2a2a2a] space-y-2">
                  <span className="text-xs font-semibold text-white">Extracted ATS Keywords</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.extractedKeywords.map((kw, i) => (
                      <span key={i} className="bg-[#1a1a1a] text-[#faff69] border border-[#2a2a2a] text-[10px] uppercase font-mono px-2 py-0.5 rounded">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
