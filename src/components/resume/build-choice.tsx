"use client";

import { useState, useRef } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { Upload, Sparkles, Loader2, Lock, FileUp, Wand2, PenLine, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { extractTextFromFile } from "@/lib/resume/text-extract";

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

  const canRewrite = user && (user.plan === "pro_499" || user.plan === "business_1999" || user.plan === "pro_399" || user.plan === "business_999" || user.plan === "institution_4999");

  const handleUploadEdit = async () => {
    if (!file) {
      toast.error("Please choose a file first");
      return;
    }
    setLoading("edit");
    try {
      const extracted = await extractTextFromFile(file);

      if (extracted.json) {
        setData(extracted.json);
        setContactLocked(false);
        onChooseEditor();
        toast.success("Resume imported successfully from JSON!");
        return;
      }

      const text = extracted.text || "";
      if (text.trim().length < 20) {
        toast.error("Could not extract readable text from file. Try pasting text manually.");
        return;
      }

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
      toast.error("Upload & Rewrite is available on Pro and Business plans");
      return;
    }
    if (!file) {
      toast.error("Please choose a file first");
      return;
    }
    setLoading("rewrite");
    try {
      const extracted = await extractTextFromFile(file);

      if (extracted.json) {
        setData(extracted.json);
        setContactLocked(false);
        onChooseEditor();
        toast.success("Resume data loaded successfully!");
        return;
      }

      const text = extracted.text || "";
      if (text.trim().length < 20) {
        toast.error("Could not extract readable text from file.");
        return;
      }

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
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 relative overflow-hidden font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] text-xs font-mono text-[#888888] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#faff69]" />
            WORKSPACE · ONBOARDING
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
            Choose your <span className="text-[#faff69]">workflow</span>
          </h1>
          <p className="text-[#888888] text-sm sm:text-base max-w-xl mx-auto">
            Select an entry point below to begin tailoring your ATS resume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upload & Edit */}
          <div className="p-6 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center mb-5 text-[#faff69]">
              <FileUp className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-lg mb-2 text-white">Upload &amp; Edit</h2>
            <p className="text-xs text-[#888888] leading-relaxed mb-6 flex-1">
              Have an existing resume? Upload it to auto-populate the data directly into all 78 templates.
            </p>
            <div className="space-y-3">
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
                  className="border border-dashed border-[#2a2a2a] bg-[#121212] rounded-md p-3.5 text-center cursor-pointer hover:border-[#faff69] transition-colors"
                >
                  {file ? (
                    <p className="text-xs font-mono font-medium text-[#faff69] truncate">{file.name}</p>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mx-auto mb-1 text-[#888888]" />
                      <p className="text-xs text-[#cccccc] font-medium">Select file</p>
                      <p className="text-[9px] text-[#888888] mt-0.5 font-mono">PDF, DOCX, TXT</p>
                    </>
                  )}
                </div>
              </label>
              <button
                onClick={handleUploadEdit}
                disabled={loading === "edit" || !file}
                className="w-full h-10 gap-2 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md text-xs inline-flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {loading === "edit" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                {loading === "edit" ? "Importing..." : "Upload & Edit"}
              </button>
            </div>
          </div>

          {/* Upload & Rewrite */}
          <div className={`p-6 rounded-xl bg-[#1a1a1a] border ${canRewrite ? "border-[#faff69]/40" : "border-[#2a2a2a]"} transition-all flex flex-col relative group`}>
            {!canRewrite && (
              <div className="absolute -top-3 right-4">
                <span className="bg-[#242424] text-[#faff69] border border-[#2a2a2a] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> PRO PLAN
                </span>
              </div>
            )}
            <div className="w-12 h-12 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center mb-5 text-[#faff69]">
              <Wand2 className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-lg mb-2 text-white">Upload &amp; Rewrite</h2>
            <p className="text-xs text-[#888888] leading-relaxed mb-6 flex-1">
              Upload your current resume and let AI rewrite your bullet points for high-density ATS scoring.
            </p>
            <div className="space-y-3">
              <label className="block">
                <input
                  type="file"
                  accept=".pdf,.docx,.md,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown,text/plain"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border border-dashed border-[#2a2a2a] bg-[#121212] rounded-md p-3.5 text-center cursor-pointer hover:border-[#faff69] transition-colors"
                >
                  {file ? (
                    <p className="text-xs font-mono font-medium text-[#faff69] truncate">{file.name}</p>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mx-auto mb-1 text-[#888888]" />
                      <p className="text-xs text-[#cccccc] font-medium">Select file</p>
                      <p className="text-[9px] text-[#888888] mt-0.5 font-mono">PDF, DOCX, TXT</p>
                    </>
                  )}
                </div>
              </label>
              <button
                onClick={handleUploadRewrite}
                disabled={loading === "rewrite" || !file || !canRewrite}
                className="w-full h-10 gap-2 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md text-xs inline-flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {loading === "rewrite" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading === "rewrite" ? "AI Rewriting..." : canRewrite ? "Upload & Rewrite" : "Upgrade to Unlock"}
              </button>
              {!canRewrite && (
                <p className="text-[9px] text-[#888888] text-center font-mono">Available on Pro &amp; Business plans</p>
              )}
            </div>
          </div>

          {/* Build from Scratch */}
          <div className="p-6 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center mb-5 text-[#faff69]">
              <PenLine className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-lg mb-2 text-white">Start from Scratch</h2>
            <p className="text-xs text-[#888888] leading-relaxed mb-6 flex-1">
              Starting fresh? Use the form editor with real-time preview to build a clean CV from the ground up.
            </p>
            <button
              onClick={handleScratch}
              disabled={loading !== null}
              className="w-full h-10 gap-2 border border-[#2a2a2a] bg-[#121212] hover:bg-[#242424] text-white font-semibold rounded-md text-xs inline-flex items-center justify-center transition-colors mt-auto"
            >
              <PenLine className="w-4 h-4" />
              <span>Start Blank</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
