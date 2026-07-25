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
import { Mail, Loader2, Sparkles, Copy, Download, Target, FileSearch, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
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
                    <Download className="w-3 h-3" /> Download
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
