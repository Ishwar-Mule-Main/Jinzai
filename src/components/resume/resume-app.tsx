"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES, ACCENT_PRESETS, FONT_OPTIONS } from "@/lib/resume/types";
import { ResumeRenderer } from "./resume-renderer";
import { ResumeEditor } from "./resume-editor";
import { sampleResume } from "@/lib/resume/sample-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCompletion } from "@/lib/resume/sample-data";
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
  Trash2,
  Wand2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/60">
      <div className="aspect-[3/4] bg-muted/30 overflow-hidden relative border-b">
        <div className="origin-top-left scale-[0.42] sm:scale-[0.5] w-[800px] absolute top-0 left-0 pointer-events-none">
          <ResumeRenderer data={sampleResume} accent={id.accentDefault} font={id.fontDefault} template={id.id} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2">
          <Button size="sm" onClick={useTemplate} className="h-8">
            <FileText className="w-3.5 h-3.5 mr-1.5" /> Use Template
          </Button>
          <Button size="sm" variant="secondary" onClick={previewWithSample} className="h-8">
            <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview with Sample
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-sm">{id.name}</h3>
          {id.hasPhoto && (
            <Badge variant="outline" className="text-[9px] py-0 px-1.5">Photo</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5 leading-relaxed">{id.description}</p>
        <div className="flex flex-wrap gap-1">
          {id.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-[9px] py-0 px-1.5 font-normal">{t}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

function Dashboard() {
  const loadSample = useResumeStore((s) => s.loadSample);
  const clearAll = useResumeStore((s) => s.clearAll);
  const setView = useResumeStore((s) => s.setView);
  const setTemplate = useResumeStore((s) => s.setTemplate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <Sparkles className="w-3 h-3" /> AI-powered resume builder
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Build a resume that <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">gets you hired</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base">
          Pick from six professionally designed templates, fill in your details, and watch your resume adapt
          in real time. Auto-optimize layout, AI summaries, and one-click print to PDF.
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <Button onClick={() => { loadSample(); }} size="lg" className="gap-2">
          <Wand2 className="w-4 h-4" /> Try with sample data
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={() => { clearAll(); setTemplate("modern"); setView("editor"); }}
        >
          <FileText className="w-4 h-4" /> Start from scratch
        </Button>
      </div>

      {/* Template gallery */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Choose a template</h2>
        <p className="text-sm text-muted-foreground">Each template auto-adapts: empty sections hide automatically, single or two-column layouts switch based on content.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEMPLATES.map((t) => (
          <TemplateCard key={t.id} id={t} />
        ))}
      </div>

      {/* Features strip */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "AI summaries & bullets", desc: "Generate a professional summary and achievement bullets tuned to your role in one click.", icon: Sparkles },
          { title: "6 distinct designs", desc: "Modern, Minimal, Creative, Classic, Executive, and Tech templates — each with its own personality.", icon: FileText },
          { title: "Auto-optimizing layout", desc: "Templates hide empty sections, switch between single and multi-column, and rebalance content density.", icon: Wand2 },
        ].map((f) => (
          <Card key={f.title} className="p-5">
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center mb-3">
              <f.icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </div>
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
          <FileText className="w-3.5 h-3.5" /> Template
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
              className={`text-left rounded-lg border-2 overflow-hidden transition-all hover:shadow-md ${
                template === t.id ? "border-teal-500 ring-2 ring-teal-500/20" : "border-border"
              }`}
            >
              <div className="aspect-[3/4] bg-muted/30 overflow-hidden relative">
                <div className="origin-top-left scale-[0.32] w-[800px] absolute top-0 left-0 pointer-events-none">
                  <ResumeRenderer data={sampleResume} accent={t.accentDefault} font={t.fontDefault} template={t.id} />
                </div>
                {template === t.id && (
                  <div className="absolute top-1.5 right-1.5 bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
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
        <div className="flex flex-wrap gap-1.5 items-center">
          {ACCENT_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                accent === c ? "border-foreground scale-110" : "border-transparent hover:scale-110"
              }`}
              style={{ background: c }}
              aria-label={`Select ${c}`}
            />
          ))}
          <label className="relative w-6 h-6 rounded-full overflow-hidden border border-input cursor-pointer flex items-center justify-center bg-gradient-to-br from-pink-500 via-yellow-500 to-teal-500">
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
                font === f.id ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30" : "border-border hover:bg-muted/50"
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
        <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : savedId ? "Saved" : "Save"}
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
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 print:hidden">
        <div className="flex items-center justify-between gap-2 px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setView("dashboard")} className="gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Templates
            </Button>
            <div className="hidden sm:flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={past.length === 0}>
                <Undo2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={future.length === 0}>
                <Redo2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <SaveLoadBar />
            <TemplateSwitcher />
            <Button size="sm" onClick={print} className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </Button>
          </div>
        </div>
        {/* progress bar */}
        <div className="h-0.5 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </header>

      {/* Main split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] print:block">
        {/* Editor pane */}
        <div className="border-r bg-muted/20 print:hidden overflow-y-auto max-h-[calc(100vh-105px)] lg:max-h-[calc(100vh-105px)]">
          <Tabs defaultValue="content" className="w-full">
            <div className="px-4 pt-3">
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
              <div className="rounded-lg border p-3 bg-card">
                <p className="text-xs font-semibold mb-3">Customize</p>
                <CustomizePanel />
              </div>
              <div className="rounded-lg border p-3 bg-card">
                <p className="text-xs font-semibold mb-2">Completion: {completion}%</p>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all" style={{ width: `${completion}%` }} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">Fill all key sections to reach 100% and maximize your chances.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview pane */}
        <div className="bg-slate-200/50 dark:bg-slate-900/50 overflow-y-auto max-h-[calc(100vh-105px)] print:max-h-none print:overflow-visible print:bg-white">
          <div className="p-6 flex justify-center print:p-0">
            <div
              className="bg-white shadow-2xl print:shadow-none print:w-auto"
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
