"use client";

import { useState } from "react";
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
import { Upload, Loader2, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function ImportResumeDialog() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const setData = useResumeStore((s) => s.setData);
  const setContactLocked = useResumeStore((s) => s.setContactLocked);
  const setView = useResumeStore((s) => s.setView);

  const importResume = async () => {
    if (text.trim().length < 50) {
      toast.error("Please paste at least 50 characters of your resume text");
      return;
    }
    setLoading(true);
    try {
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
        setView("editor");
        setOpen(false);
        setText("");
        toast.success("Resume imported! Review and edit the parsed content.");
      } else {
        throw new Error("No data returned");
      }
    } catch {
      toast.error("Could not import resume. Try pasting cleaner text.");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = () => setText(reader.result as string);
      reader.readAsText(file);
      toast.success("File loaded — review and click Import");
    } else {
      toast.error("Please paste your resume text directly (PDF parsing requires desktop software)");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Upload className="w-3.5 h-3.5" /> Import Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-teal-600" /> Import Your Old Resume
          </DialogTitle>
          <DialogDescription>
            Paste your existing resume text below and AI will automatically parse it into our structured format.
            All sections will be filled in for you to review and edit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-xs">Your resume text</Label>
              <label className="cursor-pointer">
                <input type="file" accept=".txt,text/plain" onChange={handleFile} className="hidden" />
                <Button size="sm" variant="ghost" className="h-6 text-xs gap-1">
                  <FileText className="w-3 h-3" /> Upload .txt file
                </Button>
              </label>
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              placeholder="Paste your entire resume text here... (name, contact, experience, education, skills, etc.)"
              className="text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground mt-1">{text.length} characters</p>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <p className="text-[11px] text-teal-800 dark:text-teal-200">
              AI will parse your text into structured sections: personal info, experience, education, skills, and more.
            </p>
          </div>

          <Button onClick={importResume} disabled={loading || text.trim().length < 50} className="w-full gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {loading ? "Parsing with AI..." : "Import Resume"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
