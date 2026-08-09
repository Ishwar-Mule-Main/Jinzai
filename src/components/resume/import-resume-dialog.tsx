"use client";

import { useState, useRef } from "react";
import { useResumeStore } from "@/lib/resume/store";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Upload,
  Loader2,
  FileText,
  Sparkles,
  CheckCircle2,
  X,
  FileUp,
  Merge,
  Layers,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  ArrowRight,
  Plus,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import type { ResumeData } from "@/lib/resume/types";

interface ImportResumeDialogProps {
  trigger?: React.ReactNode;
}

export function ImportResumeDialog({ trigger }: ImportResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "scanning" | "results">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"pdf" | "text">("pdf");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState<ResumeData | null>(null);

  // Selected sections for selective field merging
  const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>({
    personalInfo: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
  });

  // Apply mode: "replace" = create new/overwrite, "merge" = append/add to current
  const [applyMode, setApplyMode] = useState<"replace" | "merge">("merge");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const setData = useResumeStore((s) => s.setData);
  const mergeData = useResumeStore((s) => s.mergeData);
  const setContactLocked = useResumeStore((s) => s.setContactLocked);
  const setView = useResumeStore((s) => s.setView);

  const resetState = () => {
    setStep("upload");
    setFiles([]);
    setText("");
    setLoading(false);
    setScannedData(null);
    setSelectedSections({
      personalInfo: true,
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      languages: true,
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(resetState, 300);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const addedFiles = Array.from(e.dataTransfer.files).filter((f) => {
        const name = f.name.toLowerCase();
        return name.endsWith(".pdf") || name.endsWith(".docx") || name.endsWith(".txt") || name.endsWith(".json");
      });
      if (addedFiles.length === 0) {
        toast.error("Please drop valid PDF, DOCX, TXT, or JSON resume files.");
        return;
      }
      setFiles((prev) => [...prev, ...addedFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const addedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...addedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startAIScan = async () => {
    if (tab === "pdf" && files.length === 0) {
      toast.error("Please select or drop at least one PDF or resume file.");
      return;
    }
    if (tab === "text" && text.trim().length < 20) {
      toast.error("Please provide valid resume text to parse.");
      return;
    }

    setLoading(true);
    setStep("scanning");

    try {
      let res: Response;

      if (tab === "pdf" && files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append("file", f));

        res = await fetch("/api/ai/import-resume", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/ai/import-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }

      if (!res.ok) throw new Error("Failed to process resume file");

      const json = await res.json();
      if (json.data) {
        setScannedData(json.data);
        setStep("results");
        toast.success("AI scan complete! Select which data to apply to your resume.");
      } else {
        throw new Error(json.error || "No data returned from AI scanner");
      }
    } catch (err) {
      console.error("AI scanning error:", err);
      toast.error((err as Error).message || "Could not parse resume file. Please try pasting raw text.");
      setStep("upload");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (key: string) => {
    setSelectedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSelectAll = (select: boolean) => {
    setSelectedSections({
      personalInfo: select,
      summary: select,
      experience: select,
      education: select,
      skills: select,
      projects: select,
      certifications: select,
      languages: select,
    });
  };

  const applyScannedData = () => {
    if (!scannedData) return;

    const activeSections = Object.keys(selectedSections).filter((key) => selectedSections[key]);

    if (activeSections.length === 0) {
      toast.error("Please select at least one section to import.");
      return;
    }

    if (applyMode === "replace") {
      // Overwrite current data completely
      setData(scannedData);
      toast.success("Resume created from scanned PDF data!");
    } else {
      // Merge selected sections into existing resume
      mergeData(scannedData, activeSections);
      toast.success(`Merged ${activeSections.length} section(s) into your current resume!`);
    }

    setContactLocked(false);
    setView("editor");
    handleOpenChange(false);
  };

  const selectedCount = Object.values(selectedSections).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="outline" size="sm" className="gap-1.5 border-[#FF6200]/30 text-[#FF6200] hover:bg-[#FF6200]/10 rounded-full">
            <Upload className="w-3.5 h-3.5 text-[#FF6200]" /> Upload &amp; Scan PDF
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl sm:max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto bg-[#141414] text-white border-[#2E2E2E] p-6 sm:p-8 shadow-2xl rounded-3xl selection:bg-[#FF6200] selection:text-white">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bricolage font-bold text-white">
            <div className="p-2 rounded-xl bg-[#FF6200]/10 border border-[#FF6200]/30">
              <Sparkles className="w-5 h-5 text-[#FF6200]" />
            </div>
            Upload Resume &amp; AI Auto-Fill
          </DialogTitle>
          <DialogDescription className="text-xs text-[#9A9AAB]">
            Upload your old PDF or DOCX resume. AI will scan, parse, and auto-populate all editor fields automatically.
          </DialogDescription>
        </DialogHeader>

        {/* Step Wizard Indicator */}
        <div className="flex items-center justify-between my-2 p-3 rounded-2xl bg-[#0D0D0D] border border-[#2E2E2E] text-xs">
          <div className={`flex items-center gap-2 font-medium ${step === "upload" ? "text-[#FF6200] font-bold" : "text-[#888898]"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === "upload" ? "bg-[#FF6200] text-white font-bold" : "bg-[#1A1A1A] text-white border border-[#2E2E2E]"}`}>1</span>
            Upload Resume
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#444444]" />
          <div className={`flex items-center gap-2 font-medium ${step === "scanning" ? "text-[#FF6200] font-bold" : "text-[#888898]"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === "scanning" ? "bg-[#FF6200] text-white font-bold" : "bg-[#1A1A1A] text-white border border-[#2E2E2E]"}`}>2</span>
            AI Extraction
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#444444]" />
          <div className={`flex items-center gap-2 font-medium ${step === "results" ? "text-[#FF6200] font-bold" : "text-[#888898]"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === "results" ? "bg-[#FF6200] text-white font-bold" : "bg-[#1A1A1A] text-white border border-[#2E2E2E]"}`}>3</span>
            Merge &amp; Save
          </div>
        </div>

        {/* STEP 1: UPLOAD */}
        {step === "upload" && (
          <div className="space-y-4 pt-1">
            {/* Mode selector tab */}
            <div className="flex items-center gap-2 p-1.5 bg-[#0D0D0D] border border-[#2E2E2E] rounded-full text-xs">
              <button
                type="button"
                onClick={() => setTab("pdf")}
                className={`flex-1 py-2 px-4 rounded-full flex items-center justify-center gap-2 font-medium transition-all ${
                  tab === "pdf" ? "bg-[#FF6200] text-white font-bold shadow-md shadow-[#FF6200]/20" : "text-[#9A9AAB] hover:text-white"
                }`}
              >
                <FileUp className="w-4 h-4" /> Upload PDF / DOCX File
              </button>
              <button
                type="button"
                onClick={() => setTab("text")}
                className={`flex-1 py-2 px-4 rounded-full flex items-center justify-center gap-2 font-medium transition-all ${
                  tab === "text" ? "bg-[#FF6200] text-white font-bold shadow-md shadow-[#FF6200]/20" : "text-[#9A9AAB] hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" /> Paste Raw Resume Text
              </button>
            </div>

            {tab === "pdf" ? (
              <div className="space-y-3">
                {/* Drag and Drop Zone matching DE Design System */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? "border-[#FF6200] bg-[#FF6200]/10 scale-[1.01]"
                      : "border-[#2E2E2E] hover:border-[#FF6200]/60 bg-[#0D0D0D] hover:bg-[#1A1A1A]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,.json,.txt,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="w-14 h-14 rounded-2xl bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-center justify-center mx-auto mb-3 text-[#FF6200]">
                    <Upload className="w-7 h-7 animate-pulse" />
                  </div>

                  <p className="font-bricolage text-base font-bold text-white mb-1">
                    Drag &amp; drop your existing resume files here
                  </p>
                  <p className="text-xs text-[#888898] mb-4">
                    Supports <strong className="text-white">.PDF</strong>, .DOCX, .TXT, and .JSON files
                  </p>

                  <Button type="button" variant="outline" size="sm" className="h-9 px-5 text-xs rounded-full border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] hover:border-[#FF6200]/50 gap-2">
                    <Plus className="w-4 h-4 text-[#FF6200]" /> Choose File from Device
                  </Button>
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-[#9A9AAB] flex items-center justify-between font-mono">
                      <span>Selected Files ({files.length})</span>
                      <button type="button" onClick={() => setFiles([])} className="text-[11px] text-red-400 hover:underline">
                        Clear all
                      </button>
                    </Label>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D0D0D] border border-[#2E2E2E] text-xs">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-[#FF6200] shrink-0" />
                            <span className="truncate font-medium text-white">{file.name}</span>
                            <span className="text-[10px] text-[#888898] shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button type="button" onClick={() => removeFile(idx)} className="text-[#888898] hover:text-red-400 p-1">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-xs text-[#9A9AAB] font-mono">Paste Raw Resume Content</Label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  placeholder="Paste work history, bullet points, skills, education, contact information..."
                  className="bg-[#0D0D0D] border-[#2E2E2E] text-xs font-mono text-white placeholder:text-[#555566] focus-visible:ring-[#FF6200] rounded-xl p-3"
                />
                <p className="text-[10px] text-[#888898] font-mono">{text.length} characters entered</p>
              </div>
            )}

            {/* AI Scan Trigger Button */}
            <Button
              onClick={startAIScan}
              disabled={loading || (tab === "pdf" && files.length === 0) || (tab === "text" && text.trim().length < 20)}
              className="w-full h-12 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-bold text-sm gap-2 shadow-xl shadow-[#FF6200]/30 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Scan &amp; Auto-Fill Resume with AI
            </Button>
          </div>
        )}

        {/* STEP 2: SCANNING ANIMATION */}
        {step === "scanning" && (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-[#FF6200]/20 border-t-[#FF6200] animate-spin" />
              <div className="absolute inset-2 rounded-full bg-[#FF6200]/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#FF6200] animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-bricolage text-lg font-bold text-white">AI Scanner is Processing Your File</h3>
              <p className="text-xs text-[#888898]">Extracting structure, work history, education, skills, and projects...</p>
            </div>

            <div className="max-w-xs mx-auto space-y-2 text-left text-xs bg-[#0D0D0D] p-4 rounded-2xl border border-[#2E2E2E]">
              <div className="flex items-center gap-2 text-[#FF6200]">
                <CheckCircle2 className="w-4 h-4" /> Vector text layer extracted
              </div>
              <div className="flex items-center gap-2 text-[#FF6200]">
                <CheckCircle2 className="w-4 h-4" /> Structuring work history &amp; dates
              </div>
              <div className="flex items-center gap-2 text-[#FF6200] animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" /> Mapping section fields to editor
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE RESULTS & SELECTIVE FIELD MERGE */}
        {step === "results" && scannedData && (
          <div className="space-y-4 pt-1">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-[#FF6200]/10 border border-[#FF6200]/30 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#FF6200] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bricolage text-sm font-bold text-white">AI Scan Complete!</h4>
                <p className="text-xs text-[#888898] leading-relaxed">
                  Select which sections to add. You can merge them into your existing resume or create a fresh resume.
                </p>
              </div>
            </div>

            {/* Mode selection toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setApplyMode("merge")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  applyMode === "merge"
                    ? "bg-[#FF6200]/10 border-[#FF6200] text-white shadow-lg shadow-[#FF6200]/10"
                    : "bg-[#0D0D0D] border-[#2E2E2E] text-[#888898] hover:border-[#FF6200]/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bricolage text-sm font-bold text-white flex items-center gap-2">
                    <Merge className="w-4 h-4 text-[#FF6200]" /> Merge into Current Resume
                  </span>
                  {applyMode === "merge" && <Badge className="bg-[#FF6200] text-white text-[9px] font-mono px-2 py-0.5">Active</Badge>}
                </div>
                <p className="text-xs text-[#888898]">Append missing experience, skills &amp; fields into current profile.</p>
              </button>

              <button
                type="button"
                onClick={() => setApplyMode("replace")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  applyMode === "replace"
                    ? "bg-[#FF6200]/10 border-[#FF6200] text-white shadow-lg shadow-[#FF6200]/10"
                    : "bg-[#0D0D0D] border-[#2E2E2E] text-[#888898] hover:border-[#FF6200]/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bricolage text-sm font-bold text-white flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#FF6200]" /> Create New / Overwrite
                  </span>
                  {applyMode === "replace" && <Badge className="bg-[#FF6200] text-white text-[9px] font-mono px-2 py-0.5">Active</Badge>}
                </div>
                <p className="text-xs text-[#888898]">Replace all current fields with fresh scanned resume structure.</p>
              </button>
            </div>

            {/* Quick selection bar */}
            <div className="flex items-center justify-between text-xs text-[#888898] border-b border-[#2E2E2E] pb-2">
              <span className="font-mono">Select sections to import:</span>
              <div className="flex items-center gap-3 text-xs font-mono">
                <button type="button" onClick={() => toggleSelectAll(true)} className="text-[#FF6200] hover:underline">
                  Select All
                </button>
                <span>•</span>
                <button type="button" onClick={() => toggleSelectAll(false)} className="text-[#888898] hover:underline">
                  Deselect All
                </button>
              </div>
            </div>

            {/* Scanned Sections List */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {/* 1. Personal Info */}
              {scannedData.personalInfo && (
                <div className={`p-3.5 rounded-xl border transition-all ${selectedSections.personalInfo ? "bg-[#1A1A1A] border-[#FF6200]/40" : "bg-[#0D0D0D] border-[#2E2E2E] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.personalInfo}
                      onCheckedChange={() => toggleSection("personalInfo")}
                      className="mt-0.5 border-[#FF6200] data-[state=checked]:bg-[#FF6200] data-[state=checked]:text-white"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#FF6200]" /> Personal Information
                        </span>
                        <Badge variant="outline" className="text-[9px] border-[#2E2E2E] text-[#9A9AAB]">
                          {scannedData.personalInfo.fullName || "Detected"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10px] text-[#9A9AAB]">
                        {scannedData.personalInfo.jobTitle && <span className="px-2 py-0.5 rounded-full bg-[#141414] border border-[#2E2E2E]">{scannedData.personalInfo.jobTitle}</span>}
                        {scannedData.personalInfo.email && <span className="px-2 py-0.5 rounded-full bg-[#141414] border border-[#2E2E2E]">{scannedData.personalInfo.email}</span>}
                        {scannedData.personalInfo.phone && <span className="px-2 py-0.5 rounded-full bg-[#141414] border border-[#2E2E2E]">{scannedData.personalInfo.phone}</span>}
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {/* 2. Professional Summary */}
              {scannedData.summary && (
                <div className={`p-3.5 rounded-xl border transition-all ${selectedSections.summary ? "bg-[#1A1A1A] border-[#FF6200]/40" : "bg-[#0D0D0D] border-[#2E2E2E] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.summary}
                      onCheckedChange={() => toggleSection("summary")}
                      className="mt-0.5 border-[#FF6200] data-[state=checked]:bg-[#FF6200] data-[state=checked]:text-white"
                    />
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#FF6200]" /> Professional Summary
                      </span>
                      <p className="text-[11px] text-[#9A9AAB] line-clamp-2 italic">&ldquo;{scannedData.summary}&rdquo;</p>
                    </div>
                  </label>
                </div>
              )}

              {/* 3. Work Experience */}
              {scannedData.experience && scannedData.experience.length > 0 && (
                <div className={`p-3.5 rounded-xl border transition-all ${selectedSections.experience ? "bg-[#1A1A1A] border-[#FF6200]/40" : "bg-[#0D0D0D] border-[#2E2E2E] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.experience}
                      onCheckedChange={() => toggleSection("experience")}
                      className="mt-0.5 border-[#FF6200] data-[state=checked]:bg-[#FF6200] data-[state=checked]:text-white"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-[#FF6200]" /> Work Experience
                        </span>
                        <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 text-[9px] px-2">{scannedData.experience.length} jobs found</Badge>
                      </div>
                      <div className="space-y-1">
                        {scannedData.experience.slice(0, 3).map((exp, i) => (
                          <div key={i} className="text-[11px] text-[#9A9AAB] flex items-center justify-between">
                            <span className="font-medium text-white truncate max-w-[240px]">
                              {exp.position} @ {exp.company}
                            </span>
                            <span className="text-[10px] text-[#888898] font-mono">
                              {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {/* 4. Education */}
              {scannedData.education && scannedData.education.length > 0 && (
                <div className={`p-3.5 rounded-xl border transition-all ${selectedSections.education ? "bg-[#1A1A1A] border-[#FF6200]/40" : "bg-[#0D0D0D] border-[#2E2E2E] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.education}
                      onCheckedChange={() => toggleSection("education")}
                      className="mt-0.5 border-[#FF6200] data-[state=checked]:bg-[#FF6200] data-[state=checked]:text-white"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-[#FF6200]" /> Education
                        </span>
                        <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 text-[9px] px-2">{scannedData.education.length} degree(s)</Badge>
                      </div>
                      <div className="space-y-1">
                        {scannedData.education.map((ed, i) => (
                          <div key={i} className="text-[11px] text-[#9A9AAB]">
                            {ed.degree} in {ed.field} — <span className="text-white">{ed.institution}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {/* 5. Skills */}
              {scannedData.skills && scannedData.skills.length > 0 && (
                <div className={`p-3.5 rounded-xl border transition-all ${selectedSections.skills ? "bg-[#1A1A1A] border-[#FF6200]/40" : "bg-[#0D0D0D] border-[#2E2E2E] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.skills}
                      onCheckedChange={() => toggleSection("skills")}
                      className="mt-0.5 border-[#FF6200] data-[state=checked]:bg-[#FF6200] data-[state=checked]:text-white"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-[#FF6200]" /> Skills &amp; Tech Stack
                        </span>
                        <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 text-[9px] px-2">
                          {scannedData.skills.reduce((acc, s) => acc + (s.items?.length || 0), 0)} items
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {scannedData.skills.flatMap((s) => s.items || []).slice(0, 10).map((item, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-[#141414] border border-[#2E2E2E] text-[10px] text-white">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {/* 6. Projects */}
              {scannedData.projects && scannedData.projects.length > 0 && (
                <div className={`p-3.5 rounded-xl border transition-all ${selectedSections.projects ? "bg-[#1A1A1A] border-[#FF6200]/40" : "bg-[#0D0D0D] border-[#2E2E2E] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.projects}
                      onCheckedChange={() => toggleSection("projects")}
                      className="mt-0.5 border-[#FF6200] data-[state=checked]:bg-[#FF6200] data-[state=checked]:text-white"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <FolderGit2 className="w-3.5 h-3.5 text-[#FF6200]" /> Projects
                        </span>
                        <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 text-[9px] px-2">{scannedData.projects.length} project(s)</Badge>
                      </div>
                      <div className="space-y-1">
                        {scannedData.projects.map((pr, i) => (
                          <div key={i} className="text-[11px] text-[#9A9AAB]">
                            <span className="text-white font-medium">{pr.name}</span> — {pr.description?.slice(0, 80)}...
                          </div>
                        ))}
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {/* 7. Certifications & Languages */}
              {((scannedData.certifications && scannedData.certifications.length > 0) || (scannedData.languages && scannedData.languages.length > 0)) && (
                <div className={`p-3.5 rounded-xl border transition-all ${selectedSections.certifications ? "bg-[#1A1A1A] border-[#FF6200]/40" : "bg-[#0D0D0D] border-[#2E2E2E] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.certifications}
                      onCheckedChange={() => {
                        toggleSection("certifications");
                        toggleSection("languages");
                      }}
                      className="mt-0.5 border-[#FF6200] data-[state=checked]:bg-[#FF6200] data-[state=checked]:text-white"
                    />
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#FF6200]" /> Certifications &amp; Languages
                      </span>
                      <div className="flex flex-wrap gap-1 text-[10px] text-[#9A9AAB]">
                        {scannedData.certifications?.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-[#141414] border border-[#2E2E2E]">
                            🏆 {c.name} ({c.issuer})
                          </span>
                        ))}
                        {scannedData.languages?.map((l, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-[#141414] border border-[#2E2E2E]">
                            🌐 {l.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-3 border-t border-[#2E2E2E]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("upload")}
                className="h-11 px-5 border-[#2E2E2E] bg-[#0D0D0D] text-white hover:bg-[#1A1A1A] text-xs gap-2 rounded-full"
              >
                <RefreshCw className="w-4 h-4 text-[#888898]" /> Rescan File
              </Button>

              <Button
                onClick={applyScannedData}
                disabled={selectedCount === 0}
                className="flex-1 h-11 bg-[#FF6200] hover:bg-[#E55700] text-white font-bold text-xs gap-2 shadow-xl shadow-[#FF6200]/30 rounded-full transition-all"
              >
                {applyMode === "replace" ? (
                  <>
                    <RefreshCw className="w-4 h-4" /> Create New Resume from PDF ({selectedCount} sections)
                  </>
                ) : (
                  <>
                    <Merge className="w-4 h-4" /> Add &amp; Merge {selectedCount} Section(s) into Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
