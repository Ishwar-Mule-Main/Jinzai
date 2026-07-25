"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES, ACCENT_PRESETS, FONT_OPTIONS } from "@/lib/resume/types";
import { ResumeRenderer } from "./resume-renderer";
import { ResumeEditor } from "./resume-editor";
import { sampleResume } from "@/lib/resume/sample-data";
import { getCompletion } from "@/lib/resume/sample-data";
import { CoverLetterDialog, AtsDialog, ResumeScoreDialog } from "./ai-dialogs";
import { SavedResumesDialog, ImportExportJson } from "./saved-resumes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText,
  Sparkles,
  Download,
  Save,
  Undo2,
  Redo2,
  ArrowLeft,
  Eye,
  Settings2,
  Wand2,
  Check,
  ShieldCheck,
  Zap,
  LayoutGrid,
  FolderOpen,
  Mail,
  Target,
  ImageIcon,
  Gauge,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ---------- Brand logo ----------

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
        <FileText className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <span className="font-bold text-lg tracking-tight">
        Resume<span className="text-teal-600 dark:text-teal-400">Forge</span>
      </span>
    </div>
  );
}

// ---------- Dashboard ----------

function TemplateCard({ id }: { id: (typeof TEMPLATES)[number] }) {
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const loadSample = useResumeStore((s) => s.loadSample);
  const setView = useResumeStore((s) => s.setView);

  const useTemplate = () => {
    setTemplate(id.id);
    setView("editor");
  };

  const previewWithSample = () => {
    setTemplate(id.id);
    loadSample();
    setView("editor");
  };

  return (
    <Card className="overflow-hidden group hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 hover:-translate-y-1.5 border-border/50 rounded-2xl">
      <div className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden relative border-b border-border/40">
        <div className="origin-top-left scale-[0.42] sm:scale-[0.5] w-[800px] absolute top-0 left-0 pointer-events-none">
          <ResumeRenderer data={sampleResume} accent={id.accentDefault} font={id.fontDefault} template={id.id} />
        </div>
        {/* Always-visible subtle gradient at bottom for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/80 to-transparent dark:from-slate-950/80 pointer-events-none" />
        {/* Hover actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-5 gap-2">
          <Button size="sm" onClick={useTemplate} className="h-8 gap-1.5 shadow-lg">
            <FileText className="w-3.5 h-3.5" /> Use Template
          </Button>
          <Button size="sm" variant="secondary" onClick={previewWithSample} className="h-8 gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5" /> Sample
          </Button>
        </div>
        {/* Photo badge */}
        {id.hasPhoto && (
          <div className="absolute top-2.5 right-2.5">
            <Badge className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border-0 gap-1 text-[9px] shadow-sm">
              <ImageIcon className="w-2.5 h-2.5" /> Photo
            </Badge>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-base mb-1.5">{id.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{id.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {id.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-teal-600 to-emerald-600 bg-clip-text text-transparent">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function Dashboard() {
  const loadSample = useResumeStore((s) => s.loadSample);
  const clearAll = useResumeStore((s) => s.clearAll);
  const setView = useResumeStore((s) => s.setView);
  const setTemplate = useResumeStore((s) => s.setTemplate);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-2">
            <SavedResumesDialog />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 gap-1.5 py-1 px-3 rounded-full">
            <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" /> AI-powered resume builder
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-[1.05]">
            Build a resume that
            <br />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 bg-clip-text text-transparent">
              gets you hired
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Pick from six professionally designed templates, fill in your details, and watch your resume adapt
            in real time. AI summaries, ATS keyword matching, cover letters, and one-click PDF export.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-12">
          <StatCard value="8" label="Templates" />
          <StatCard value="9" label="Sections" />
          <StatCard value="100%" label="Free" />
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <Button onClick={() => { loadSample(); }} size="lg" className="gap-2 h-12 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg shadow-teal-600/20">
            <Wand2 className="w-4 h-4" /> Try with sample data
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 h-12 px-6"
            onClick={() => { clearAll(); setTemplate("modern"); setView("editor"); }}
          >
            <FileText className="w-4 h-4" /> Start from scratch
          </Button>
        </div>

        {/* Template gallery */}
        <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Choose a template</h2>
            <p className="text-sm text-muted-foreground">Each template auto-adapts — empty sections hide automatically, layouts rebalance to your content.</p>
          </div>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
            <LayoutGrid className="w-3.5 h-3.5" /> {TEMPLATES.length} designs
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} id={t} />
          ))}
        </div>

        {/* Features strip */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Everything you need to land the interview</h2>
            <p className="text-sm text-muted-foreground">AI writing assistance, ATS optimization, and beautiful templates — all in one place.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "AI summaries & bullets", desc: "Generate a professional summary and achievement bullets tuned to your role in one click.", icon: Sparkles, color: "teal" },
              { title: "Resume quality score", desc: "Get an instant A–F grade across 8 dimensions — quantification, action verbs, completeness, and more.", icon: Gauge, color: "emerald" },
              { title: "ATS keyword match", desc: "Paste a job description to see your match score and the exact keywords you're missing.", icon: Target, color: "amber" },
              { title: "AI cover letters", desc: "Tailor a cover letter to any role using your resume content — confident, formal, or concise.", icon: Mail, color: "violet" },
            ].map((f) => (
              <Card key={f.title} className="p-5 rounded-2xl border-border/50 hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                  f.color === "teal" ? "bg-teal-50 dark:bg-teal-950/40" :
                  f.color === "emerald" ? "bg-emerald-50 dark:bg-emerald-950/40" :
                  f.color === "amber" ? "bg-amber-50 dark:bg-amber-950/40" :
                  f.color === "violet" ? "bg-violet-50 dark:bg-violet-950/40" :
                  "bg-sky-50 dark:bg-sky-950/40"
                }`}>
                  <f.icon className={`w-5 h-5 ${
                    f.color === "teal" ? "text-teal-600 dark:text-teal-400" :
                    f.color === "emerald" ? "text-emerald-600 dark:text-emerald-400" :
                    f.color === "amber" ? "text-amber-600 dark:text-amber-400" :
                    f.color === "violet" ? "text-violet-600 dark:text-violet-400" :
                    "text-sky-600 dark:text-sky-400"
                  }`} />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust banner */}
        <div className="mt-16 rounded-2xl border bg-gradient-to-br from-muted/40 to-background p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold">ATS-friendly</p>
                <p className="text-xs text-muted-foreground">Clean structure recruiters' tools can parse.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Zap className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Real-time preview</p>
                <p className="text-xs text-muted-foreground">See edits reflected instantly, no refresh.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Download className="w-5 h-5 text-violet-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold">PDF & JSON export</p>
                <p className="text-xs text-muted-foreground">Print to PDF or back up your data as JSON.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between flex-wrap gap-2">
          <BrandMark className="scale-90" />
          <p className="text-xs text-muted-foreground">Built with Next.js, Tailwind & z-ai-web-dev-sdk.</p>
        </div>
      </footer>
    </div>
  );
}

// ---------- Editor view ----------

function TemplateSwitcher() {
  const template = useResumeStore((s) => s.template);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <LayoutGrid className="w-3.5 h-3.5" /> Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Switch Template</DialogTitle>
          <DialogDescription>Pick a design — your content stays the same, only the layout changes.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTemplate(t.id); }}
              className={`text-left rounded-xl border-2 overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${
                template === t.id ? "border-teal-500 ring-2 ring-teal-500/20" : "border-border"
              }`}
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden relative">
                <div className="origin-top-left scale-[0.32] w-[800px] absolute top-0 left-0 pointer-events-none">
                  <ResumeRenderer data={sampleResume} accent={t.accentDefault} font={t.fontDefault} template={t.id} />
                </div>
                {template === t.id && (
                  <div className="absolute top-1.5 right-1.5 bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold">{t.name}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CustomizePanel() {
  const accent = useResumeStore((s) => s.accentColor);
  const setAccent = useResumeStore((s) => s.setAccentColor);
  const font = useResumeStore((s) => s.fontFamily);
  const setFont = useResumeStore((s) => s.setFontFamily);
  const template = useResumeStore((s) => s.template);
  const tpl = TEMPLATES.find((t) => t.id === template);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium mb-2">Accent color</p>
        <div className="flex flex-wrap gap-2 items-center">
          {ACCENT_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                accent === c ? "border-foreground scale-110 shadow-sm" : "border-transparent hover:scale-110"
              }`}
              style={{ background: c }}
              aria-label={`Select ${c}`}
            />
          ))}
          <label className="relative w-7 h-7 rounded-full overflow-hidden border border-input cursor-pointer flex items-center justify-center bg-gradient-to-br from-pink-500 via-yellow-500 to-teal-500" title="Custom color">
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium mb-2">Font family</p>
        <div className="grid grid-cols-1 gap-1.5">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFont(f.id)}
              className={`text-left px-3 py-2 rounded-md border text-sm transition-all ${
                font === f.id ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300" : "border-border hover:bg-muted/50"
              } ${f.className}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {tpl && !tpl.hasPhoto && (
        <p className="text-[11px] text-muted-foreground italic">
          The {tpl.name} template does not include a photo slot.
        </p>
      )}
    </div>
  );
}

function SaveLoadBar() {
  const data = useResumeStore((s) => s.data);
  const template = useResumeStore((s) => s.template);
  const accent = useResumeStore((s) => s.accentColor);
  const font = useResumeStore((s) => s.fontFamily);
  const title = useResumeStore((s) => s.title);
  const setTitle = useResumeStore((s) => s.setTitle);
  const savedId = useResumeStore((s) => s.savedId);
  const setSavedId = useResumeStore((s) => s.setSavedId);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        id: savedId,
        title,
        template,
        accentColor: accent,
        fontFamily: font,
        content: JSON.stringify(data),
      };
      const res = await fetch("/api/resumes", {
        method: savedId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setSavedId(json.id);
      toast.success(savedId ? "Resume updated" : "Resume saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-44 h-9 text-sm"
        placeholder="Resume title"
      />
      <Button size="sm" variant="outline" onClick={save} disabled={saving} className="gap-1.5">
        <Save className="w-3.5 h-3.5" /> {saving ? "Saving…" : savedId ? "Saved" : "Save"}
      </Button>
    </div>
  );
}

function EditorView() {
  const data = useResumeStore((s) => s.data);
  const template = useResumeStore((s) => s.template);
  const accent = useResumeStore((s) => s.accentColor);
  const font = useResumeStore((s) => s.fontFamily);
  const setView = useResumeStore((s) => s.setView);
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const past = useResumeStore((s) => s.past);
  const future = useResumeStore((s) => s.future);
  const completion = getCompletion(data);

  const print = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top toolbar */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 sticky top-0 z-30 print:hidden">
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setView("dashboard")} className="gap-1.5">
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Templates</span>
            </Button>
            <div className="hidden sm:flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={past.length === 0} title="Undo">
                <Undo2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={future.length === 0} title="Redo">
                <Redo2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <SaveLoadBar />
            <div className="hidden md:block h-5 w-px bg-border mx-0.5" />
            <TemplateSwitcher />
            <ResumeScoreDialog />
            <CoverLetterDialog />
            <AtsDialog />
            <Button size="sm" onClick={print} className="gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </Button>
          </div>
        </div>
        {/* progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </header>

      {/* Main split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] print:block">
        {/* Editor pane */}
        <div className="border-r bg-muted/20 print:hidden overflow-y-auto max-h-[calc(100vh-113px)] lg:max-h-[calc(100vh-113px)]">
          <Tabs defaultValue="content" className="w-full">
            <div className="px-4 pt-3 sticky top-0 bg-muted/20 backdrop-blur z-10 pb-2">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="content" className="text-xs gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Content
                </TabsTrigger>
                <TabsTrigger value="design" className="text-xs gap-1.5">
                  <Settings2 className="w-3.5 h-3.5" /> Design
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="content" className="p-4 mt-0">
              <ResumeEditor />
            </TabsContent>
            <TabsContent value="design" className="p-4 mt-0 space-y-4">
              <div className="rounded-xl border p-4 bg-card">
                <p className="text-xs font-semibold mb-3 flex items-center gap-1.5">
                  <Settings2 className="w-3.5 h-3.5" /> Customize
                </p>
                <CustomizePanel />
              </div>
              <div className="rounded-xl border p-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold">Completion</p>
                  <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{completion}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all" style={{ width: `${completion}%` }} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">Fill all key sections to reach 100% and maximize your chances.</p>
              </div>
              <div className="rounded-xl border p-4 bg-card">
                <p className="text-xs font-semibold mb-3">Backup & Restore</p>
                <ImportExportJson />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview pane */}
        <div className="bg-slate-200/60 dark:bg-slate-900/60 overflow-y-auto max-h-[calc(100vh-113px)] print:max-h-none print:overflow-visible print:bg-white">
          <div className="p-4 sm:p-8 flex justify-center print:p-0">
            <div
              className="bg-white shadow-2xl shadow-slate-400/30 print:shadow-none print:w-auto"
              style={{
                width: "210mm",
                minHeight: "297mm",
              }}
            >
              <ResumeRenderer data={data} accent={accent} font={font} template={template} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResumeApp() {
  const view = useResumeStore((s) => s.view);
  return view === "dashboard" ? <Dashboard /> : <EditorView />;
}
