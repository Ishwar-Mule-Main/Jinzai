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
  Globe,
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
          <Button variant="outline" size="sm" className="gap-1.5 border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10">
            <Upload className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Upload &amp; Scan PDF
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl sm:max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto bg-[#121212] text-white border-[#2A2A2A] p-6 sm:p-8 shadow-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold text-white">
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
              <Sparkles className="w-5 h-5 text-teal-400" />
            </div>
            Upload Resume PDF &amp; AI Smart Scan
          </DialogTitle>
          <DialogDescription className="text-xs text-[#999999]">
            Upload your old PDF resume. AI will scan all text, structure sections, and let you add specific data wherever needed into your resume.
          </DialogDescription>
        </DialogHeader>

        {/* Step Wizard Indicator */}
        <div className="flex items-center justify-between my-2 p-2.5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-xs">
          <div className={`flex items-center gap-2 font-medium ${step === "upload" ? "text-teal-400 font-bold" : "text-[#777777]"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === "upload" ? "bg-teal-500 text-black font-bold" : "bg-[#282828] text-white"}`}>1</span>
            Upload PDF File
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#444444]" />
          <div className={`flex items-center gap-2 font-medium ${step === "scanning" ? "text-teal-400 font-bold" : "text-[#777777]"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === "scanning" ? "bg-teal-500 text-black font-bold" : "bg-[#282828] text-white"}`}>2</span>
            AI Text Extraction
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#444444]" />
          <div className={`flex items-center gap-2 font-medium ${step === "results" ? "text-teal-400 font-bold" : "text-[#777777]"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === "results" ? "bg-teal-500 text-black font-bold" : "bg-[#282828] text-white"}`}>3</span>
            Select &amp; Merge Data
          </div>
        </div>

        {/* STEP 1: UPLOAD */}
        {step === "upload" && (
          <div className="space-y-4 pt-1">
            {/* Mode selector tab */}
            <div className="flex items-center gap-2 p-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setTab("pdf")}
                className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-2 font-medium transition-all ${
                  tab === "pdf" ? "bg-teal-500 text-black font-semibold shadow-md" : "text-[#999999] hover:text-white"
                }`}
              >
                <FileUp className="w-3.5 h-3.5" /> Upload PDF / File
              </button>
              <button
                type="button"
                onClick={() => setTab("text")}
                className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-2 font-medium transition-all ${
                  tab === "text" ? "bg-teal-500 text-black font-semibold shadow-md" : "text-[#999999] hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Paste Raw Text
              </button>
            </div>

            {tab === "pdf" ? (
              <div className="space-y-3">
                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    dragActive
                      ? "border-teal-400 bg-teal-500/10 scale-[1.01]"
                      : "border-[#333333] hover:border-teal-500/50 bg-[#161616] hover:bg-[#1A1A1A]"
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

                  <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-3 text-teal-400">
                    <Upload className="w-6 h-6 animate-pulse" />
                  </div>

                  <p className="text-sm font-semibold text-white mb-1">
                    Drag &amp; drop your old resume PDF files here
                  </p>
                  <p className="text-xs text-[#888888] mb-3">
                    Supports <strong className="text-teal-400">.PDF</strong>, .DOCX, .TXT, and .JSON files (Upload single or multiple PDFs)
                  </p>

                  <Button type="button" variant="outline" size="sm" className="h-8 text-xs border-[#333333] bg-[#222222] text-white hover:bg-[#2A2A2A] gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-teal-400" /> Choose Files from Computer
                  </Button>
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-[#AAAAAA] flex items-center justify-between">
                      <span>Selected Files ({files.length})</span>
                      <button type="button" onClick={() => setFiles([])} className="text-[11px] text-red-400 hover:underline">
                        Clear all
                      </button>
                    </Label>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] text-xs">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                            <span className="truncate font-medium text-white">{file.name}</span>
                            <span className="text-[10px] text-[#777777] shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button type="button" onClick={() => removeFile(idx)} className="text-[#888888] hover:text-red-400 p-1">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-xs text-[#AAAAAA]">Paste Resume Text</Label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  placeholder="Paste work experience, skills, education, contact info from your old resume..."
                  className="bg-[#161616] border-[#333333] text-xs font-mono text-white placeholder:text-[#555555] focus-visible:ring-teal-500"
                />
                <p className="text-[10px] text-[#777777]">{text.length} characters entered</p>
              </div>
            )}

            {/* AI Scan Trigger Button */}
            <Button
              onClick={startAIScan}
              disabled={loading || (tab === "pdf" && files.length === 0) || (tab === "text" && text.trim().length < 20)}
              className="w-full h-11 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-black font-bold text-sm gap-2 shadow-lg shadow-teal-500/20"
            >
              <Sparkles className="w-4 h-4" /> Scan PDF &amp; Extract Data with AI
            </Button>
          </div>
        )}

        {/* STEP 2: SCANNING ANIMATION */}
        {step === "scanning" && (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
              <div className="absolute inset-2 rounded-full bg-teal-500/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-teal-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">AI Scanner is Reading Your PDF</h3>
              <p className="text-xs text-[#888888]">Extracting structure, work experience, education, skills, and certifications...</p>
            </div>

            <div className="max-w-xs mx-auto space-y-1.5 text-left text-xs bg-[#161616] p-3 rounded-lg border border-[#262626]">
              <div className="flex items-center gap-2 text-teal-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> PDF text layer parsed successfully
              </div>
              <div className="flex items-center gap-2 text-teal-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Categorizing work history &amp; dates
              </div>
              <div className="flex items-center gap-2 text-teal-400 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Structuring JSON response
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE RESULTS & SELECTIVE FIELD MERGE */}
        {step === "results" && scannedData && (
          <div className="space-y-4 pt-1">
            {/* Header info */}
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-teal-300">AI Scan Successful!</h4>
                <p className="text-[11px] text-teal-200/80">
                  Select which scanned sections you want to add. You can merge them into your current resume or build a new one.
                </p>
              </div>
            </div>

            {/* Mode selection toggle */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setApplyMode("merge")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  applyMode === "merge"
                    ? "bg-teal-500/10 border-teal-500 text-white shadow-lg shadow-teal-500/10"
                    : "bg-[#161616] border-[#2A2A2A] text-[#888888] hover:border-[#444444]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Merge className="w-3.5 h-3.5 text-teal-400" /> Merge into Current Resume
                  </span>
                  {applyMode === "merge" && <Badge className="bg-teal-500 text-black text-[9px] px-1.5 py-0">Active</Badge>}
                </div>
                <p className="text-[10px] text-[#888888]">Append missing experience, skills &amp; fields into existing resume.</p>
              </button>

              <button
                type="button"
                onClick={() => setApplyMode("replace")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  applyMode === "replace"
                    ? "bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                    : "bg-[#161616] border-[#2A2A2A] text-[#888888] hover:border-[#444444]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Create New / Overwrite
                  </span>
                  {applyMode === "replace" && <Badge className="bg-emerald-500 text-black text-[9px] px-1.5 py-0">Active</Badge>}
                </div>
                <p className="text-[10px] text-[#888888]">Replace all current data with fresh scanned PDF structure.</p>
              </button>
            </div>

            {/* Quick selection bar */}
            <div className="flex items-center justify-between text-xs text-[#999999]">
              <span>Check sections to add:</span>
              <div className="flex items-center gap-2 text-[11px]">
                <button type="button" onClick={() => toggleSelectAll(true)} className="text-teal-400 hover:underline">
                  Select All
                </button>
                <span>•</span>
                <button type="button" onClick={() => toggleSelectAll(false)} className="text-[#777777] hover:underline">
                  Deselect All
                </button>
              </div>
            </div>

            {/* Scanned Sections List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {/* 1. Personal Info */}
              {scannedData.personalInfo && (
                <div className={`p-3 rounded-lg border transition-all ${selectedSections.personalInfo ? "bg-[#1B1B1B] border-teal-500/40" : "bg-[#141414] border-[#242424] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.personalInfo}
                      onCheckedChange={() => toggleSection("personalInfo")}
                      className="mt-0.5 border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-black"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-teal-400" /> Personal Information
                        </span>
                        <Badge variant="outline" className="text-[9px] border-[#333333] text-[#AAAAAA]">
                          {scannedData.personalInfo.fullName || "Detected"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10px] text-[#999999]">
                        {scannedData.personalInfo.jobTitle && <span className="px-1.5 py-0.5 rounded bg-[#222222]">{scannedData.personalInfo.jobTitle}</span>}
                        {scannedData.personalInfo.email && <span className="px-1.5 py-0.5 rounded bg-[#222222]">{scannedData.personalInfo.email}</span>}
                        {scannedData.personalInfo.phone && <span className="px-1.5 py-0.5 rounded bg-[#222222]">{scannedData.personalInfo.phone}</span>}
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {/* 2. Professional Summary */}
              {scannedData.summary && (
                <div className={`p-3 rounded-lg border transition-all ${selectedSections.summary ? "bg-[#1B1B1B] border-teal-500/40" : "bg-[#141414] border-[#242424] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.summary}
                      onCheckedChange={() => toggleSection("summary")}
                      className="mt-0.5 border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-black"
                    />
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-teal-400" /> Professional Summary
                      </span>
                      <p className="text-[11px] text-[#888888] line-clamp-2 italic">&ldquo;{scannedData.summary}&rdquo;</p>
                    </div>
                  </label>
                </div>
              )}

              {/* 3. Work Experience */}
              {scannedData.experience && scannedData.experience.length > 0 && (
                <div className={`p-3 rounded-lg border transition-all ${selectedSections.experience ? "bg-[#1B1B1B] border-teal-500/40" : "bg-[#141414] border-[#242424] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.experience}
                      onCheckedChange={() => toggleSection("experience")}
                      className="mt-0.5 border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-black"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-teal-400" /> Work Experience
                        </span>
                        <Badge className="bg-teal-500/20 text-teal-300 text-[9px] px-1.5">{scannedData.experience.length} jobs found</Badge>
                      </div>
                      <div className="space-y-1">
                        {scannedData.experience.slice(0, 3).map((exp, i) => (
                          <div key={i} className="text-[11px] text-[#AAAAAA] flex items-center justify-between">
                            <span className="font-medium text-white truncate max-w-[240px]">
                              {exp.position} @ {exp.company}
                            </span>
                            <span className="text-[10px] text-[#666666]">
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
                <div className={`p-3 rounded-lg border transition-all ${selectedSections.education ? "bg-[#1B1B1B] border-teal-500/40" : "bg-[#141414] border-[#242424] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.education}
                      onCheckedChange={() => toggleSection("education")}
                      className="mt-0.5 border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-black"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-teal-400" /> Education
                        </span>
                        <Badge className="bg-teal-500/20 text-teal-300 text-[9px] px-1.5">{scannedData.education.length} degree(s)</Badge>
                      </div>
                      <div className="space-y-1">
                        {scannedData.education.map((ed, i) => (
                          <div key={i} className="text-[11px] text-[#AAAAAA]">
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
                <div className={`p-3 rounded-lg border transition-all ${selectedSections.skills ? "bg-[#1B1B1B] border-teal-500/40" : "bg-[#141414] border-[#242424] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.skills}
                      onCheckedChange={() => toggleSection("skills")}
                      className="mt-0.5 border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-black"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-teal-400" /> Skills &amp; Tech Stack
                        </span>
                        <Badge className="bg-teal-500/20 text-teal-300 text-[9px] px-1.5">
                          {scannedData.skills.reduce((acc, s) => acc + (s.items?.length || 0), 0)} items
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {scannedData.skills.flatMap((s) => s.items || []).slice(0, 10).map((item, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-[#252525] text-[10px] text-[#CCCCCC]">
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
                <div className={`p-3 rounded-lg border transition-all ${selectedSections.projects ? "bg-[#1B1B1B] border-teal-500/40" : "bg-[#141414] border-[#242424] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.projects}
                      onCheckedChange={() => toggleSection("projects")}
                      className="mt-0.5 border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-black"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <FolderGit2 className="w-3.5 h-3.5 text-teal-400" /> Projects
                        </span>
                        <Badge className="bg-teal-500/20 text-teal-300 text-[9px] px-1.5">{scannedData.projects.length} project(s)</Badge>
                      </div>
                      <div className="space-y-1">
                        {scannedData.projects.map((pr, i) => (
                          <div key={i} className="text-[11px] text-[#AAAAAA]">
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
                <div className={`p-3 rounded-lg border transition-all ${selectedSections.certifications ? "bg-[#1B1B1B] border-teal-500/40" : "bg-[#141414] border-[#242424] opacity-60"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.certifications}
                      onCheckedChange={() => {
                        toggleSection("certifications");
                        toggleSection("languages");
                      }}
                      className="mt-0.5 border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-black"
                    />
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-teal-400" /> Certifications &amp; Languages
                      </span>
                      <div className="flex flex-wrap gap-1 text-[10px] text-[#AAAAAA]">
                        {scannedData.certifications?.map((c, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-[#252525]">
                            🏆 {c.name} ({c.issuer})
                          </span>
                        ))}
                        {scannedData.languages?.map((l, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-[#252525]">
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
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("upload")}
                className="h-10 border-[#333333] bg-[#1A1A1A] text-white hover:bg-[#252525] text-xs gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#888888]" /> Rescan File
              </Button>

              <Button
                onClick={applyScannedData}
                disabled={selectedCount === 0}
                className="flex-1 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-black font-bold text-xs gap-2 shadow-lg shadow-teal-500/20"
              >
                {applyMode === "replace" ? (
                  <>
                    <RefreshCw className="w-4 h-4" /> Create New Resume with Scanned PDF ({selectedCount} sections)
                  </>
                ) : (
                  <>
                    <Merge className="w-4 h-4" /> Add &amp; Merge {selectedCount} Section(s) into Current Resume
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

