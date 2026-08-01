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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, Sparkles, Copy, Download, Target, FileSearch, CheckCircle2, XCircle, TrendingUp, Gauge, Award, FileText } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// ---------- Cover Letter Generator ----------

export function CoverLetterDialog() {
  const data = useResumeStore((s) => s.data);
  const [open, setOpen] = useState(false);
  const [jd, setJd] = useState("");
  const [tone, setTone] = useState<"confident" | "formal" | "concise">("confident");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
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
    const name = data.personalInfo.fullName || "Cover Letter";
    const jobTitle = data.personalInfo.jobTitle || "";
    const contact = [
      data.personalInfo.email,
      data.personalInfo.phone,
      data.personalInfo.location,
      data.personalInfo.linkedin,
    ].filter(Boolean).join(" · ");

    // Open a new window with a print-styled cover letter and auto-trigger print
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) {
      toast.error("Pop-up blocked. Allow pop-ups to download PDF.");
      return;
    }
    const paragraphs = letter
      .split(/\n\n+/)
      .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
      .join("");
    win.document.write(`<!DOCTYPE html><html><head><title>${name} — Cover Letter</title>
      <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; }
        body { font-family: Georgia, 'Times New Roman', serif; color: #1f2937; margin: 0; padding: 48px 64px; line-height: 1.7; font-size: 13px; }
        .header { border-bottom: 2px solid #0f766e; padding-bottom: 16px; margin-bottom: 28px; }
        .name { font-size: 22px; font-weight: bold; color: #0f766e; margin: 0; }
        .title { font-size: 13px; color: #6b7280; margin: 2px 0 0; font-style: italic; }
        .contact { font-size: 11px; color: #6b7280; margin: 6px 0 0; }
        p { margin: 0 0 14px; text-align: justify; }
        .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; text-align: center; }
        @media print { body { padding: 0; } }
      </style></head><body>
      <div class="header">
        <p class="name">${name}</p>
        ${jobTitle ? `<p class="title">${jobTitle}</p>` : ""}
        ${contact ? `<p class="contact">${contact}</p>` : ""}
      </div>
      ${paragraphs}
      <div class="footer">Generated with Jinzai</div>
      </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Mail className="w-3.5 h-3.5" /> Cover Letter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Cover Letter</DialogTitle>
          <DialogDescription>Generate a tailored cover letter from your resume content.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Job description (optional but recommended)</Label>
            <Textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={4}
              placeholder="Paste the job description to tailor the letter…"
            />
          </div>
          <div>
            <Label className="text-xs">Tone</Label>
            <div className="flex gap-2">
              {(["confident", "formal", "concise"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-md text-xs border transition-all capitalize ${
                    tone === t ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300" : "border-border hover:bg-muted/50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={generate} disabled={loading} className="w-full gap-1.5">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Generating…" : "Generate Cover Letter"}
          </Button>
          {letter && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Result</Label>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="ghost" onClick={copy} className="h-7 gap-1.5 text-xs">
                    <Copy className="w-3 h-3" /> Copy
                  </Button>
                  <Button size="sm" variant="ghost" onClick={download} className="h-7 gap-1.5 text-xs">
                    <Download className="w-3 h-3" /> .txt
                  </Button>
                  <Button size="sm" variant="ghost" onClick={downloadPdf} className="h-7 gap-1.5 text-xs">
                    <FileText className="w-3 h-3" /> PDF
                  </Button>
                </div>
              </div>
              <Textarea value={letter} readOnly rows={12} className="text-sm leading-relaxed" />
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
  const data = useResumeStore((s) => s.data);
  const [open, setOpen] = useState(false);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AtsResult | null>(null);

  const analyze = async () => {
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
    s >= 75 ? "text-emerald-600 dark:text-emerald-400" : s >= 50 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Target className="w-3.5 h-3.5" /> ATS Check
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ATS Keyword Match</DialogTitle>
          <DialogDescription>
            Paste a job description to see how well your resume matches its keywords. Higher match = better ATS pass rate.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Job description</Label>
            <Textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={5}
              placeholder="Paste the full job description here…"
            />
          </div>
          <Button onClick={analyze} disabled={loading} className="w-full gap-1.5">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
            {loading ? "Analyzing…" : "Analyze Match"}
          </Button>

          {result && (
            <div className="space-y-4">
              {/* Score card */}
              <div className="rounded-xl border p-4 bg-gradient-to-br from-muted/40 to-background">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${scoreColor(result.score)} bg-background border`}>
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Match score</p>
                      <p className={`text-2xl font-bold ${scoreColor(result.score)}`}>{result.score}%</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground space-y-0.5">
                    <p>{result.wordCount} resume words</p>
                    <p>{result.jobKeywordCount} job keywords</p>
                    <p>{result.matched.length} matched · {result.missing.length} missing</p>
                  </div>
                </div>
                <Progress value={result.score} className="h-2" />
              </div>

              {/* Matched */}
              {result.matched.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Matched keywords
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched.map((k) => (
                      <Badge key={k.term} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-0 font-normal">
                        {k.term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing */}
              {result.missing.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" /> Missing keywords (add where truthful)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing.map((k) => (
                      <Badge key={k.term} variant="outline" className="font-normal text-muted-foreground">
                        {k.term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="rounded-lg border p-3 bg-muted/30">
                <p className="text-xs font-semibold mb-2">Recommendations</p>
                <ul className="space-y-1.5">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-teal-600 shrink-0">→</span>
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
  const data = useResumeStore((s) => s.data);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const analyze = async () => {
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

  // Auto-analyze on open
  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (v && !result && !loading) {
      setTimeout(analyze, 100);
    }
  };

  const gradeColor = (g: string) =>
    g === "A" ? "from-emerald-500 to-teal-500" :
    g === "B" ? "from-teal-500 to-cyan-500" :
    g === "C" ? "from-amber-500 to-yellow-500" :
    g === "D" ? "from-orange-500 to-red-500" :
    "from-rose-500 to-red-600";

  const catColor = (ratio: number) =>
    ratio >= 0.8 ? "bg-emerald-500" :
    ratio >= 0.6 ? "bg-teal-500" :
    ratio >= 0.4 ? "bg-amber-500" :
    "bg-rose-500";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Gauge className="w-3.5 h-3.5" /> Resume Score
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600" /> Resume Quality Score
          </DialogTitle>
          <DialogDescription>
            A holistic analysis of your resume across 8 dimensions — quantified impact, action verbs, completeness, and more.
          </DialogDescription>
        </DialogHeader>

        {loading && !result && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            <p className="text-sm text-muted-foreground">Analyzing your resume…</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Score hero */}
            <div className="rounded-2xl border p-5 bg-gradient-to-br from-muted/40 to-background text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${gradeColor(result.grade)} text-white shadow-lg mb-3`}>
                <span className="text-3xl font-bold">{result.grade}</span>
              </div>
              <p className="text-4xl font-bold mb-1">
                {result.score}<span className="text-xl text-muted-foreground">/100</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {result.score >= 85 ? "Excellent — ready to send" :
                 result.score >= 70 ? "Good — minor improvements suggested" :
                 result.score >= 55 ? "Fair — several areas to strengthen" :
                 "Needs work — review recommendations below"}
              </p>
            </div>

            {/* Category breakdown */}
            <div className="space-y-2.5">
              {result.categories.map((c) => {
                const ratio = c.score / c.max;
                return (
                  <div key={c.name} className="rounded-lg border p-3">
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <p className="text-sm font-semibold">{c.name}</p>
                      <p className="text-sm font-mono">
                        <span className={ratio >= 0.6 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>{c.score}</span>
                        <span className="text-muted-foreground">/{c.max}</span>
                      </p>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-1.5">
                      <div className={`h-full rounded-full transition-all ${catColor(ratio)}`} style={{ width: `${ratio * 100}%` }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground">{c.detail}</p>
                  </div>
                );
              })}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border p-2.5 text-center">
                <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{result.stats.quantifiedBullets}/{result.stats.totalBullets}</p>
                <p className="text-[10px] text-muted-foreground">Quantified bullets</p>
              </div>
              <div className="rounded-lg border p-2.5 text-center">
                <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{result.stats.actionVerbBullets}/{result.stats.totalBullets}</p>
                <p className="text-[10px] text-muted-foreground">Action verbs</p>
              </div>
              <div className="rounded-lg border p-2.5 text-center">
                <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{result.stats.skillCount}</p>
                <p className="text-[10px] text-muted-foreground">Total skills</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-xl border p-4 bg-gradient-to-br from-amber-50 to-background dark:from-amber-950/20">
              <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Recommendations
              </p>
              <ul className="space-y-1.5">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="text-xs text-foreground/80 flex gap-2">
                    <span className="text-amber-600 shrink-0">→</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button onClick={analyze} disabled={loading} variant="outline" className="w-full gap-1.5">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Gauge className="w-3.5 h-3.5" />}
              Re-analyze
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
