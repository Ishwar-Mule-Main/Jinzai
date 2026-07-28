"use client";

import { useState, useRef } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Sparkles, FileText, Loader2, Lock, FileUp, Wand2, PenLine, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { isPaidPlan } from "@/lib/resume/plans";

interface BuildChoiceProps {
  user: { plan: string; email: string } | null;
  onChooseEditor: () => void;
}

export function BuildChoice({ user, onChooseEditor }: BuildChoiceProps) {
  const setData = useResumeStore((s) => s.setData);
  const setContactLocked = useResumeStore((s) => s.setContactLocked);
  const [loading, setLoading] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const canRewrite = user && (user.plan === "pro_499" || user.plan === "business_1999");

  const readFile = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(f);
    });
  };

  const handleUploadEdit = async () => {
    if (!file) {
      toast.error("Please choose a file first");
      return;
    }
    setLoading("edit");
    try {
      const text = await readFile(file);
      const res = await fetch("/api/ai/import-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      if (json.data) {
        setData(json.data);
        setContactLocked(false);
        onChooseEditor();
        toast.success("Resume imported! Review and edit the parsed content.");
      }
    } catch {
      toast.error("Could not import resume. Try pasting text manually.");
    } finally {
      setLoading(null);
    }
  };

  const handleUploadRewrite = async () => {
    if (!canRewrite) {
      toast.error("Upload & Rewrite is available on Pro (₹499) and Business (₹1,999) plans");
      return;
    }
    if (!file) {
      toast.error("Please choose a file first");
      return;
    }
    setLoading("rewrite");
    try {
      const text = await readFile(file);
      const res = await fetch("/api/ai/upload-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      if (json.data) {
        setData(json.data);
        setContactLocked(false);
        onChooseEditor();
        toast.success("Resume rewritten by AI! Review the enhanced content.");
      }
    } catch {
      toast.error("Could not rewrite resume. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleScratch = () => {
    setData(JSON.parse(JSON.stringify({
      personalInfo: { fullName: "", jobTitle: "", email: "", phone: "", location: "", website: "", linkedin: "", github: "", photo: "", tagline: "" },
      summary: "", experience: [], education: [], skills: [], projects: [], certifications: [], languages: [], customSections: [],
    })));
    setContactLocked(false);
    onChooseEditor();
    toast.success("Starting fresh! Fill in your details to build a standout resume.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            How would you like to build your resume?
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Choose the option that works best for you. You can always switch later.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Upload & Edit */}
          <Card className="p-6 rounded-2xl border-border/50 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center mb-4">
              <FileUp className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="font-bold text-lg mb-2">Upload & Edit</h2>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
              Already have a resume? Simply upload it to instantly pull your data into our professional templates. You can refine and polish the details later.
            </p>
            <div className="space-y-2">
              <label className="block">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,.md,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown,text/plain"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-3 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors"
                >
                  {file ? (
                    <p className="text-xs font-medium text-teal-600">{file.name}</p>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-[10px] text-muted-foreground">Click to choose file</p>
                      <p className="text-[9px] text-muted-foreground/60 mt-0.5">PDF, DOCX, MD, TXT</p>
                    </>
                  )}
                </div>
              </label>
              <Button
                onClick={handleUploadEdit}
                disabled={loading === "edit" || !file}
                className="w-full gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                size="sm"
              >
                {loading === "edit" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
                {loading === "edit" ? "Importing..." : "Upload & Edit"}
              </Button>
            </div>
          </Card>

          {/* Upload & Rewrite */}
          <Card className={`p-6 rounded-2xl border-2 ${canRewrite ? "border-teal-500/50 hover:shadow-lg" : "border-border/50 opacity-75"} transition-all hover:-translate-y-1 flex flex-col relative`}>
            {!canRewrite && (
              <div className="absolute -top-2.5 right-3">
                <Badge className="bg-amber-500 text-white border-0 gap-0.5 text-[9px] shadow-sm">
                  <Lock className="w-2.5 h-2.5" /> PRO
                </Badge>
              </div>
            )}
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center mb-4">
              <Wand2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="font-bold text-lg mb-2">Upload & Rewrite</h2>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
              Upload your current resume and let our AI rewrite your experience for maximum impact. We'll fix grammar, optimize keywords, and boost your professional tone automatically.
            </p>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="file"
                  accept=".pdf,.docx,.md,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown,text/plain"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-3 text-center cursor-pointer hover:border-violet-500 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 transition-colors"
                >
                  {file ? (
                    <p className="text-xs font-medium text-violet-600">{file.name}</p>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-[10px] text-muted-foreground">Click to choose file</p>
                      <p className="text-[9px] text-muted-foreground/60 mt-0.5">PDF, DOCX, MD, TXT</p>
                    </>
                  )}
                </div>
              </label>
              <Button
                onClick={handleUploadRewrite}
                disabled={loading === "rewrite" || !file || !canRewrite}
                variant={canRewrite ? "default" : "outline"}
                className="w-full gap-1.5"
                size="sm"
              >
                {loading === "rewrite" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {loading === "rewrite" ? "AI Rewriting..." : canRewrite ? "Upload & Rewrite" : "Upgrade to Unlock"}
              </Button>
              {!canRewrite && (
                <p className="text-[9px] text-amber-600 text-center">Available on Pro (₹499) & Business (₹1,999)</p>
              )}
            </div>
          </Card>

          {/* Build from Scratch */}
          <Card className="p-6 rounded-2xl border-border/50 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mb-4">
              <PenLine className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="font-bold text-lg mb-2">Build from Scratch</h2>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
              Starting from zero? Use our expert-guided builder with pre-written job-specific examples to create a standout resume that gets noticed by recruiters.
            </p>
            <Button
              onClick={handleScratch}
              disabled={loading !== null}
              variant="outline"
              className="w-full gap-1.5"
              size="sm"
            >
              <PenLine className="w-3.5 h-3.5" />
              Start Building
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Card>
        </div>

        {/* Web Profile teaser */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white text-center">
          <h3 className="font-bold text-lg mb-2">🌍 Your resume becomes a web profile</h3>
          <p className="text-sm text-white/80 max-w-md mx-auto">
            When you export your resume, Jinzai automatically creates a shareable web profile page that recruiters can find and browse. Advanced resume users get a fully customizable landing page.
          </p>
          <Badge className="mt-3 bg-white/20 text-white border-0">Coming Soon — Job Seeker Hub</Badge>
        </div>
      </div>
    </div>
  );
}
