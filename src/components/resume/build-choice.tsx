"use client";

import { useState, useRef } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Sparkles, FileText, Loader2, Lock, FileUp, Wand2, PenLine, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { isPaidPlan } from "@/lib/resume/plans";

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

  const canRewrite = user && (user.plan === "pro_499" || user.plan === "business_1999");

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
      toast.error("Upload & Rewrite is available on Pro (₹499) and Business (₹1,999) plans");
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
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6200]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <Badge className="bg-[#FF6200]/10 text-[#FF6200] border border-[#FF6200]/20 mb-3 px-3 py-1 text-xs font-mono">
            人材 · BUILD MODE
          </Badge>
          <h1 className="font-bricolage text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
            How would you like to build your <span className="text-gradient-orange">resume</span>?
          </h1>
          <p className="text-[#888898] text-sm sm:text-base max-w-xl mx-auto">
            Choose the option that fits your current starting point. You can customize every detail in our editor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upload & Edit */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#2E2E2E] hover:border-[#FF6200]/50 hover:shadow-xl hover:shadow-[#FF6200]/10 transition-all duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center mb-5 group-hover:border-[#FF6200]/50 transition-colors">
              <FileUp className="w-6 h-6 text-[#FF6200]" />
            </div>
            <h2 className="font-bricolage font-bold text-xl mb-2 text-white">Upload & Edit</h2>
            <p className="text-xs text-[#888898] leading-relaxed mb-6 flex-1">
              Already have a resume? Simply upload it to instantly pull your data into our 72 professional templates.
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
                  className="border-2 border-dashed border-[#2E2E2E] rounded-xl p-3.5 text-center cursor-pointer hover:border-[#FF6200] hover:bg-[#FF6200]/5 transition-colors"
                >
                  {file ? (
                    <p className="text-xs font-medium text-[#FF6200] truncate">{file.name}</p>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mx-auto mb-1 text-[#888898]" />
                      <p className="text-xs text-[#888898] font-medium">Click to select file</p>
                      <p className="text-[9px] text-[#888898]/70 mt-0.5 font-mono">PDF, DOCX, MD, TXT</p>
                    </>
                  )}
                </div>
              </label>
              <Button
                onClick={handleUploadEdit}
                disabled={loading === "edit" || !file}
                className="w-full gap-2 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-xl shadow-lg shadow-[#FF6200]/20"
                size="sm"
              >
                {loading === "edit" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                {loading === "edit" ? "Importing..." : "Upload & Edit"}
              </Button>
            </div>
          </div>

          {/* Upload & Rewrite */}
          <div className={`p-6 rounded-2xl bg-[#141414] border ${canRewrite ? "border-[#FF6200]/40" : "border-[#2E2E2E] opacity-80"} hover:border-[#FF6200] hover:shadow-xl hover:shadow-[#FF6200]/10 transition-all duration-300 flex flex-col relative group`}>
            {!canRewrite && (
              <div className="absolute -top-3 right-4">
                <Badge className="bg-[#FF6200] text-white border-0 gap-1 text-[9px] font-mono px-2.5 py-0.5 shadow-md">
                  <Lock className="w-2.5 h-2.5" /> PRO PLAN
                </Badge>
              </div>
            )}
            <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center mb-5 group-hover:border-[#FF6200]/50 transition-colors">
              <Wand2 className="w-6 h-6 text-[#FF6200]" />
            </div>
            <h2 className="font-bricolage font-bold text-xl mb-2 text-white">Upload & Rewrite</h2>
            <p className="text-xs text-[#888898] leading-relaxed mb-6 flex-1">
              Upload your current resume and let our AI agent rewrite your bullet points for maximum ATS & executive impact.
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
                  className="border-2 border-dashed border-[#2E2E2E] rounded-xl p-3.5 text-center cursor-pointer hover:border-[#FF6200] hover:bg-[#FF6200]/5 transition-colors"
                >
                  {file ? (
                    <p className="text-xs font-medium text-[#FF6200] truncate">{file.name}</p>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mx-auto mb-1 text-[#888898]" />
                      <p className="text-xs text-[#888898] font-medium">Click to select file</p>
                      <p className="text-[9px] text-[#888898]/70 mt-0.5 font-mono">PDF, DOCX, MD, TXT</p>
                    </>
                  )}
                </div>
              </label>
              <Button
                onClick={handleUploadRewrite}
                disabled={loading === "rewrite" || !file || !canRewrite}
                className="w-full gap-2 bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold rounded-xl shadow-lg shadow-[#FF6200]/20 disabled:opacity-50"
                size="sm"
              >
                {loading === "rewrite" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading === "rewrite" ? "AI Rewriting..." : canRewrite ? "Upload & AI Rewrite" : "Upgrade to Unlock"}
              </Button>
              {!canRewrite && (
                <p className="text-[9px] text-[#FF6200]/90 text-center font-mono">Available on Pro (₹499) & Business (₹1,999)</p>
              )}
            </div>
          </div>

          {/* Build from Scratch */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#2E2E2E] hover:border-[#FF6200]/50 hover:shadow-xl hover:shadow-[#FF6200]/10 transition-all duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center mb-5 group-hover:border-[#FF6200]/50 transition-colors">
              <PenLine className="w-6 h-6 text-[#FF6200]" />
            </div>
            <h2 className="font-bricolage font-bold text-xl mb-2 text-white">Build from Scratch</h2>
            <p className="text-xs text-[#888898] leading-relaxed mb-6 flex-1">
              Starting from zero? Use our guided editor with AI bullet suggestions and role presets to build a standout CV.
            </p>
            <Button
              onClick={handleScratch}
              disabled={loading !== null}
              variant="outline"
              className="w-full gap-2 border-[#2E2E2E] text-white hover:bg-[#FF6200] hover:border-[#FF6200] hover:text-white transition-all rounded-xl mt-auto"
              size="sm"
            >
              <PenLine className="w-4 h-4" />
              Start Building
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
          </div>
        </div>

        {/* Web Profile teaser */}
        <div className="mt-12 rounded-2xl bg-[#141414] border border-[#2E2E2E] p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6200]/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="font-bricolage font-bold text-xl mb-2 text-white">🌍 Your resume becomes an interactive web profile</h3>
          <p className="text-xs text-[#888898] max-w-lg mx-auto leading-relaxed">
            When you export your resume, Jinzai automatically generates a public web link recruiter page that can be shared anywhere.
          </p>
          <Badge className="mt-4 bg-[#FF6200]/10 text-[#FF6200] border border-[#FF6200]/30 font-mono text-[10px]">Job Seeker Hub Integrated</Badge>
        </div>
      </div>
    </div>
  );
}
