"use client";

import { useState, useEffect } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES, type ResumeData } from "@/lib/resume/types";
import { emptyResume } from "@/lib/resume/sample-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Trash2, FileText, Loader2, Upload, Download, Clock } from "lucide-react";
import { toast } from "sonner";

interface SavedResume {
  id: string;
  title: string;
  slug: string;
  template: string;
  accentColor: string;
  fontFamily: string;
  createdAt: string;
  updatedAt: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ---------- Saved Resumes dialog ----------

export function SavedResumesDialog() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const setData = useResumeStore((s) => s.setData);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);
  const setFontFamily = useResumeStore((s) => s.setFontFamily);
  const setTitle = useResumeStore((s) => s.setTitle);
  const setSavedId = useResumeStore((s) => s.setSavedId);
  const setView = useResumeStore((s) => s.setView);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resumes");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setItems(json.resumes || []);
    } catch {
      toast.error("Could not load saved resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const openResume = async (r: SavedResume) => {
    try {
      const res = await fetch("/api/resumes/single?id=" + r.id);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      const parsed: ResumeData = JSON.parse(json.content);
      setData(parsed);
      setTemplate(r.template as never);
      setAccentColor(r.accentColor);
      setFontFamily(r.fontFamily);
      setTitle(r.title);
      setSavedId(r.id);
      setView("editor");
      setOpen(false);
      toast.success(`Loaded "${r.title}"`);
    } catch {
      toast.error("Could not open resume");
    }
  };

  const remove = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/resumes?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) => prev.filter((r) => r.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <FolderOpen className="w-3.5 h-3.5" /> My Resumes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Saved Resumes</DialogTitle>
          <DialogDescription>Load or delete resumes you've saved to this browser session.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-sm text-muted-foreground">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No saved resumes yet. Save one from the editor to see it here.
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((r) => {
              const tpl = TEMPLATES.find((t) => t.id === r.template);
              return (
                <li
                  key={r.id}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/40 transition-colors group"
                >
                  <div className="w-9 h-12 rounded shrink-0 border" style={{ background: r.accentColor }} />
                  <button onClick={() => openResume(r)} className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-teal-700 dark:group-hover:text-teal-300">{r.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span>{tpl?.name || r.template}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeAgo(r.updatedAt)}
                      </span>
                    </div>
                  </button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100"
                    onClick={() => remove(r.id)}
                    disabled={deletingId === r.id}
                  >
                    {deletingId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------- Import / Export JSON ----------

export function ImportExportJson() {
  const data = useResumeStore((s) => s.data);
  const template = useResumeStore((s) => s.template);
  const accent = useResumeStore((s) => s.accentColor);
  const font = useResumeStore((s) => s.fontFamily);
  const title = useResumeStore((s) => s.title);
  const setData = useResumeStore((s) => s.setData);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);
  const setFontFamily = useResumeStore((s) => s.setFontFamily);
  const setTitle = useResumeStore((s) => s.setTitle);
  const setSavedId = useResumeStore((s) => s.setSavedId);

  const exportJson = () => {
    const payload = {
      version: 1,
      title,
      template,
      accentColor: accent,
      fontFamily: font,
      data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(title || "resume").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Resume exported as JSON");
  };

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!parsed.data) throw new Error("Invalid format");
        setData(parsed.data);
        if (parsed.template) setTemplate(parsed.template);
        if (parsed.accentColor) setAccentColor(parsed.accentColor);
        if (parsed.fontFamily) setFontFamily(parsed.fontFamily);
        if (parsed.title) setTitle(parsed.title);
        setSavedId(null);
        toast.success(`Imported "${parsed.title || "resume"}"`);
      } catch {
        toast.error("Invalid resume JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={exportJson} className="gap-1.5">
        <Download className="w-3.5 h-3.5" /> Export JSON
      </Button>
      <label>
        <input type="file" accept="application/json,.json" onChange={importJson} className="hidden" />
        <Button variant="outline" size="sm" asChild className="gap-1.5 cursor-pointer">
          <span>
            <Upload className="w-3.5 h-3.5" /> Import
          </span>
        </Button>
      </label>
    </div>
  );
}
