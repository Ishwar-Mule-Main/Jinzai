"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check, Loader2, Link2, Link2Off, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function ShareDialog() {
  const savedId = useResumeStore((s) => s.savedId);
  const title = useResumeStore((s) => s.title);
  const [open, setOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && savedId) {
      checkStatus();
    }
  }, [open, savedId]);

  const checkStatus = async () => {
    try {
      const res = await fetch(`/api/resumes/share?id=${savedId}`);
      if (res.ok) {
        const json = await res.json();
        setShared(json.shared);
        if (json.url) {
          setShareUrl(`${window.location.origin}${json.url}`);
        } else {
          setShareUrl("");
        }
      }
    } catch {}
  };

  const toggle = async () => {
    if (!savedId) {
      toast.error("Save your resume first before sharing");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/resumes/share?id=${savedId}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setShared(json.shared);
      if (json.url) {
        setShareUrl(`${window.location.origin}${json.url}`);
        toast.success("Share link enabled");
      } else {
        setShareUrl("");
        toast.success("Sharing disabled");
      }
    } catch {
      toast.error("Could not toggle sharing");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Share2 className="w-3.5 h-3.5" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-teal-600" /> Share Resume
          </DialogTitle>
          <DialogDescription>
            Generate a public read-only link that anyone can view and download as PDF.
          </DialogDescription>
        </DialogHeader>

        {!savedId ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-4 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-1">Save your resume first</p>
            <p className="text-xs text-muted-foreground">You need to save before you can share a public link.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status badge */}
            <div className={`rounded-xl border p-4 ${shared ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900" : "border-muted bg-muted/30"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${shared ? "bg-emerald-500" : "bg-muted-foreground/30"}`}>
                  {shared ? <Link2 className="w-5 h-5 text-white" /> : <Link2Off className="w-5 h-5 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{shared ? "Link is active" : "Sharing is off"}</p>
                  <p className="text-xs text-muted-foreground">
                    {shared ? "Anyone with the link can view your resume." : "Generate a link to share your resume."}
                  </p>
                </div>
              </div>
            </div>

            {/* Share URL */}
            {shared && shareUrl && (
              <div className="space-y-2">
                <label className="text-xs font-medium">Public link</label>
                <div className="flex gap-2">
                  <Input value={shareUrl} readOnly className="text-xs font-mono" />
                  <Button size="sm" variant="outline" onClick={copy} className="shrink-0 gap-1.5">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline">
                  <ExternalLink className="w-3 h-3" /> Open in new tab
                </a>
              </div>
            )}

            {/* Toggle button */}
            <Button
              onClick={toggle}
              disabled={loading}
              variant={shared ? "outline" : "default"}
              className={`w-full gap-1.5 ${!shared ? "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700" : ""}`}
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : shared ? (
                <Link2Off className="w-3.5 h-3.5" />
              ) : (
                <Link2 className="w-3.5 h-3.5" />
              )}
              {loading ? "Updating…" : shared ? "Disable sharing" : "Enable sharing"}
            </Button>

            {shared && (
              <p className="text-[11px] text-muted-foreground text-center">
                Changes to your saved resume automatically update the shared link.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
