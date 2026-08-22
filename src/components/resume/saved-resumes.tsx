"use client";

import { useState, useEffect } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES, type ResumeData } from "@/lib/resume/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderOpen, Trash2, FileText, Loader2, Upload, Download, Clock, Copy } from "lucide-react";
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

export function SavedResumesDialog() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

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
      const res = await fetch("/api/resumes?id=" + r.id);
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

  const duplicate = async (r: SavedResume) => {
    setDuplicatingId(r.id);
    try {
      const res = await fetch("/api/resumes?id=" + r.id);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      const dupRes = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${r.title} (copy)`,
          template: r.template,
          accentColor: r.accentColor,
          fontFamily: r.fontFamily,
          content: json.content,
        }),
      });
      if (!dupRes.ok) throw new Error("Failed");
      toast.success("Resume duplicated");
      load();
    } catch {
      toast.error("Duplicate failed");
    } finally {
      setDuplicatingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-9 px-3 gap-1.5 text-xs text-[#cccccc] hover:text-white bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] rounded-md font-semibold inline-flex items-center transition-colors">
          <FolderOpen className="w-3.5 h-3.5 text-[#faff69]" /> My Resumes
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#faff69]" /> Saved Resumes
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888888]">Load, duplicate, or delete your saved draft resumes.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-[#faff69]" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#888888]">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#faff69]" />
            No saved resumes yet. Save one from the editor to view it here.
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((r) => {
              const tpl = TEMPLATES.find((t) => t.id === r.template);
              return (
                <li
                  key={r.id}
                  className="flex items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#121212] p-3 hover:border-[#3a3a3a] transition-colors group"
                >
                  <div className="w-8 h-10 rounded shrink-0 border border-[#2a2a2a]" style={{ background: r.accentColor }} />
                  <button onClick={() => openResume(r)} className="flex-1 text-left min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-[#faff69] transition-colors">{r.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#888888] font-mono mt-0.5">
                      <span>{tpl?.name || r.template}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeAgo(r.updatedAt)}
                      </span>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="h-8 w-8 rounded-md bg-[#1a1a1a] hover:bg-[#242424] text-[#cccccc] flex items-center justify-center transition-colors"
                      onClick={() => duplicate(r)}
                      disabled={duplicatingId === r.id}
                      title="Duplicate"
                    >
                      {duplicatingId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      className="h-8 w-8 rounded-md bg-[#1a1a1a] hover:bg-[#242424] text-red-400 hover:text-red-300 flex items-center justify-center transition-colors"
                      onClick={() => remove(r.id)}
                      disabled={deletingId === r.id}
                      title="Delete"
                    >
                      {deletingId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}

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
      <button onClick={exportJson} className="h-9 px-3 bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] text-[#cccccc] hover:text-white rounded-md text-xs font-semibold gap-1.5 inline-flex items-center transition-colors">
        <Download className="w-3.5 h-3.5 text-[#faff69]" /> Export JSON
      </button>
      <label>
        <input type="file" accept="application/json,.json" onChange={importJson} className="hidden" />
        <span className="h-9 px-3 bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] text-[#cccccc] hover:text-white rounded-md text-xs font-semibold gap-1.5 inline-flex items-center transition-colors cursor-pointer">
          <Upload className="w-3.5 h-3.5 text-[#faff69]" /> Import
        </span>
      </label>
    </div>
  );
}
