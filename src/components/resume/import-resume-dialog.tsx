"use client";

import { useState, useRef } from "react";
import { useResumeStore } from "@/lib/resume/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Upload,
  Loader2,
  FileText,
  Sparkles,
  CheckCircle2,
  X,
  Merge,
  Layers,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
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
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSection = (sec: string) => {
    setSelectedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const toggleSelectAll = (val: boolean) => {
    const next: Record<string, boolean> = {};
    Object.keys(selectedSections).forEach((k) => { next[k] = val; });
    setSelectedSections(next);
  };

  const startAIScan = async () => {
    setLoading(true);
    setStep("scanning");

    try {
      let rawParsedText = text;

      if (tab === "pdf" && files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append("files", f));

        const uploadRes = await fetch("/api/parse-resume-file", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          if (uploadJson.extractedText) {
            rawParsedText = uploadJson.extractedText;
          }
        }
      }

      const res = await fetch("/api/ai/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawParsedText }),
      });

      if (!res.ok) throw new Error("Failed to parse with AI");

      const json = await res.json();
      if (json.data) {
        setScannedData(json.data);
        setStep("results");
        toast.success("Resume successfully scanned and parsed!");
      } else {
        throw new Error("No data returned");
      }
    } catch {
      toast.error("Auto-scanning failed. Please paste text directly or retry.");
      setStep("upload");
    } finally {
      setLoading(false);
    }
  };

  const applyScannedData = () => {
    if (!scannedData) return;

    const filtered: Partial<ResumeData> = {};
    if (selectedSections.personalInfo) filtered.personalInfo = scannedData.personalInfo;
    if (selectedSections.summary) filtered.summary = scannedData.summary;
    if (selectedSections.experience) filtered.experience = scannedData.experience;
    if (selectedSections.education) filtered.education = scannedData.education;
    if (selectedSections.skills) filtered.skills = scannedData.skills;
    if (selectedSections.projects) filtered.projects = scannedData.projects;
    if (selectedSections.certifications) filtered.certifications = scannedData.certifications;
    if (selectedSections.languages) filtered.languages = scannedData.languages;

    if (applyMode === "replace") {
      const merged = { ...useResumeStore.getState().data, ...filtered };
      setData(merged);
      toast.success("Created new resume from scanned file!");
    } else {
      mergeData(filtered);
      toast.success("Merged selected sections into your current resume!");
    }

    setContactLocked(false);
    setView("editor");
    setOpen(false);
  };

  const selectedCount = Object.values(selectedSections).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="inline-block cursor-pointer w-full">
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="h-10 px-4 rounded-md border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] text-xs font-semibold gap-2 inline-flex items-center transition-colors"
        >
          <Upload className="w-4 h-4 text-[#faff69]" />
          <span>Upload &amp; Auto-Parse</span>
        </button>
      )}

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 sm:p-8 rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold text-white tracking-tight">
            <div className="w-8 h-8 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69]">
              <Sparkles className="w-4 h-4" />
            </div>
            AI Resume Auto-Parser &amp; Importer
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888888]">
            Upload an existing resume (PDF, Word, TXT, JSON) to auto-populate all sections.
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: UPLOAD OR PASTE */}
        {step === "upload" && (
          <div className="space-y-5 pt-2">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#121212] border border-[#2a2a2a] rounded-md text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTab("pdf")}
                className={`py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-all ${
                  tab === "pdf" ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "text-[#888888] hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Upload File (PDF / DOCX)
              </button>
              <button
                type="button"
                onClick={() => setTab("text")}
                className={`py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-all ${
                  tab === "text" ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "text-[#888888] hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Paste Raw Text
              </button>
            </div>

            {tab === "pdf" ? (
              <div className="space-y-3">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? "border-[#faff69] bg-[#242424]"
                      : "border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#121212]"
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

                  <div className="w-12 h-12 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-3 text-[#faff69]">
                    <Upload className="w-6 h-6" />
                  </div>

                  <p className="text-sm font-bold text-white mb-1">
                    Drag &amp; drop your existing resume files here
                  </p>
                  <p className="text-xs text-[#888888] mb-4 font-mono">
                    Supports <strong className="text-white">.PDF</strong>, .DOCX, .TXT, and .JSON files
                  </p>

                  <button type="button" className="h-9 px-4 text-xs rounded-md border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] gap-2 inline-flex items-center font-semibold transition-colors">
                    <Plus className="w-4 h-4 text-[#faff69]" /> Choose File
                  </button>
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-[#888888] flex items-center justify-between font-mono">
                      <span>Selected Files ({files.length})</span>
                      <button type="button" onClick={() => setFiles([])} className="text-[11px] text-red-400 hover:underline">
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-md bg-[#121212] border border-[#2a2a2a] text-xs">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-[#faff69] shrink-0" />
                            <span className="truncate font-medium text-white">{file.name}</span>
                            <span className="text-[10px] text-[#888888] shrink-0 font-mono">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button type="button" onClick={() => removeFile(idx)} className="text-[#888888] hover:text-red-400 p-1">
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
                <label className="text-xs text-[#888888] font-mono">Paste Raw Resume Content</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  placeholder="Paste work history, bullet points, skills, education, contact information..."
                  className="w-full bg-[#121212] border border-[#2a2a2a] text-xs font-mono text-white placeholder:text-[#555566] focus:border-[#faff69] rounded-md p-3 outline-none resize-none"
                />
                <p className="text-[10px] text-[#888888] font-mono">{text.length} characters entered</p>
              </div>
            )}

            {/* AI Scan Trigger Button */}
            <button
              onClick={startAIScan}
              disabled={loading || (tab === "pdf" && files.length === 0) || (tab === "text" && text.trim().length < 20)}
              className="w-full h-11 rounded-md bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs gap-2 inline-flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" /> Scan &amp; Auto-Fill with AI
            </button>
          </div>
        )}

        {/* STEP 2: SCANNING ANIMATION */}
        {step === "scanning" && (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-14 h-14 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-[#faff69]/20 border-t-[#faff69] animate-spin" />
              <div className="absolute inset-2 rounded-full bg-[#242424] flex items-center justify-center text-[#faff69]">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white tracking-tight">AI Parser is Processing File</h3>
              <p className="text-xs text-[#888888]">Extracting structure, history, education, skills, and projects...</p>
            </div>

            <div className="max-w-xs mx-auto space-y-2 text-left text-xs bg-[#121212] p-4 rounded-xl border border-[#2a2a2a] font-mono">
              <div className="flex items-center gap-2 text-[#faff69]">
                <CheckCircle2 className="w-4 h-4" /> Vector text layer extracted
              </div>
              <div className="flex items-center gap-2 text-[#faff69]">
                <CheckCircle2 className="w-4 h-4" /> Structuring work history &amp; dates
              </div>
              <div className="flex items-center gap-2 text-[#faff69] animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" /> Mapping section fields to editor
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RESULTS */}
        {step === "results" && scannedData && (
          <div className="space-y-4 pt-1">
            <div className="p-4 rounded-xl bg-[#121212] border border-[#2a2a2a] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#faff69] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">AI Scan Complete!</h4>
                <p className="text-xs text-[#888888] leading-relaxed">
                  Select which sections to add. You can merge them into your existing resume or create a fresh resume.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setApplyMode("merge")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  applyMode === "merge"
                    ? "bg-[#242424] border-[#faff69] text-white"
                    : "bg-[#121212] border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Merge className="w-4 h-4 text-[#faff69]" /> Merge into Current
                  </span>
                  {applyMode === "merge" && <span className="bg-[#faff69] text-[#0a0a0a] text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">Active</span>}
                </div>
                <p className="text-[11px] text-[#888888]">Append missing experience, skills &amp; fields into current draft.</p>
              </button>

              <button
                type="button"
                onClick={() => setApplyMode("replace")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  applyMode === "replace"
                    ? "bg-[#242424] border-[#faff69] text-white"
                    : "bg-[#121212] border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#faff69]" /> Create New / Overwrite
                  </span>
                  {applyMode === "replace" && <span className="bg-[#faff69] text-[#0a0a0a] text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">Active</span>}
                </div>
                <p className="text-[11px] text-[#888888]">Replace all current fields with fresh scanned resume content.</p>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-[#888888] border-b border-[#2a2a2a] pb-2">
              <span className="font-mono">Select sections to import:</span>
              <div className="flex items-center gap-3 text-xs font-mono">
                <button type="button" onClick={() => toggleSelectAll(true)} className="text-[#faff69] hover:underline">
                  Select All
                </button>
                <span>•</span>
                <button type="button" onClick={() => toggleSelectAll(false)} className="text-[#888888] hover:underline">
                  Deselect All
                </button>
              </div>
            </div>

            {/* Scanned Sections List */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {scannedData.personalInfo && (
                <div className={`p-3.5 rounded-xl border transition-all ${selectedSections.personalInfo ? "bg-[#121212] border-[#faff69]/40" : "bg-[#121212] border-[#2a2a2a] opacity-50"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.personalInfo}
                      onCheckedChange={() => toggleSection("personalInfo")}
                      className="mt-0.5 border-[#faff69] data-[state=checked]:bg-[#faff69] data-[state=checked]:text-[#0a0a0a]"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#faff69]" /> Personal Information
                        </span>
                        <span className="text-[9px] font-mono text-[#888888]">
                          {scannedData.personalInfo.fullName || "Detected"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10px] text-[#888888]">
                        {scannedData.personalInfo.jobTitle && <span className="px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a]">{scannedData.personalInfo.jobTitle}</span>}
                        {scannedData.personalInfo.email && <span className="px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a]">{scannedData.personalInfo.email}</span>}
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {scannedData.summary && (
                <div className={`p-3.5 rounded-xl border transition-all ${selectedSections.summary ? "bg-[#121212] border-[#faff69]/40" : "bg-[#121212] border-[#2a2a2a] opacity-50"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.summary}
                      onCheckedChange={() => toggleSection("summary")}
                      className="mt-0.5 border-[#faff69] data-[state=checked]:bg-[#faff69] data-[state=checked]:text-[#0a0a0a]"
                    />
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#faff69]" /> Professional Summary
                      </span>
                      <p className="text-[11px] text-[#cccccc] line-clamp-2 italic">&ldquo;{scannedData.summary}&rdquo;</p>
                    </div>
                  </label>
                </div>
              )}

              {scannedData.experience && scannedData.experience.length > 0 && (
                <div className={`p-3.5 rounded-xl border transition-all ${selectedSections.experience ? "bg-[#121212] border-[#faff69]/40" : "bg-[#121212] border-[#2a2a2a] opacity-50"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.experience}
                      onCheckedChange={() => toggleSection("experience")}
                      className="mt-0.5 border-[#faff69] data-[state=checked]:bg-[#faff69] data-[state=checked]:text-[#0a0a0a]"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-[#faff69]" /> Work Experience
                        </span>
                        <span className="text-[9px] font-mono text-[#faff69]">{scannedData.experience.length} roles found</span>
                      </div>
                      <div className="space-y-1">
                        {scannedData.experience.slice(0, 3).map((exp, i) => (
                          <div key={i} className="text-[11px] text-[#cccccc] flex items-center justify-between">
                            <span className="font-medium text-white truncate max-w-[240px]">
                              {exp.position} @ {exp.company}
                            </span>
                            <span className="text-[10px] text-[#888888] font-mono">
                              {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {scannedData.skills && scannedData.skills.length > 0 && (
                <div className={`p-3.5 rounded-xl border transition-all ${selectedSections.skills ? "bg-[#121212] border-[#faff69]/40" : "bg-[#121212] border-[#2a2a2a] opacity-50"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={!!selectedSections.skills}
                      onCheckedChange={() => toggleSection("skills")}
                      className="mt-0.5 border-[#faff69] data-[state=checked]:bg-[#faff69] data-[state=checked]:text-[#0a0a0a]"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-[#faff69]" /> Skills &amp; Tech Stack
                        </span>
                        <span className="text-[9px] font-mono text-[#faff69]">
                          {scannedData.skills.reduce((acc, s) => acc + (s.items?.length || 0), 0)} items
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {scannedData.skills.flatMap((s) => s.items || []).slice(0, 10).map((item, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[10px] text-white font-mono">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-3 border-t border-[#2a2a2a]">
              <button
                type="button"
                onClick={() => setStep("upload")}
                className="h-10 px-4 border border-[#2a2a2a] bg-[#121212] text-white hover:bg-[#242424] text-xs gap-2 rounded-md font-semibold inline-flex items-center transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#888888]" /> Rescan
              </button>

              <button
                onClick={applyScannedData}
                disabled={selectedCount === 0}
                className="flex-1 h-10 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs gap-2 rounded-md transition-colors inline-flex items-center justify-center disabled:opacity-50"
              >
                {applyMode === "replace" ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" /> Create New Resume from PDF ({selectedCount} sections)
                  </>
                ) : (
                  <>
                    <Merge className="w-3.5 h-3.5" /> Add &amp; Merge {selectedCount} Section(s)
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
