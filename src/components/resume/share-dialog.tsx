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
import { Share2, Copy, Check, Loader2, Link2, Link2Off, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function ShareDialog() {
  const savedId = useResumeStore((s) => s.savedId);
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
        <button className="h-9 px-3 gap-1.5 text-xs text-[#cccccc] hover:text-white bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] rounded-md font-semibold inline-flex items-center transition-colors">
          <Share2 className="w-3.5 h-3.5 text-[#faff69]" /> Share
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-[#1a1a1a] border border-[#2a2a2a] text-white p-6 rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white tracking-tight">
            <Share2 className="w-5 h-5 text-[#faff69]" /> Share Public Resume Link
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888888]">
            Generate a secure web link that recruiters or hiring managers can view.
          </DialogDescription>
        </DialogHeader>

        {!savedId ? (
          <div className="rounded-lg border border-[#2a2a2a] bg-[#121212] p-4 text-center">
            <p className="text-xs text-white mb-1 font-semibold">Save your resume first</p>
            <p className="text-[11px] text-[#888888]">You need to save your resume before generating a public link.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`rounded-xl border p-4 ${shared ? "border-[#faff69]/40 bg-[#121212]" : "border-[#2a2a2a] bg-[#121212]"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-md flex items-center justify-center ${shared ? "bg-[#242424] text-[#faff69]" : "bg-[#1a1a1a] text-[#888888]"}`}>
                  {shared ? <Link2 className="w-4 h-4" /> : <Link2Off className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">{shared ? "Link is Active" : "Sharing is Disabled"}</p>
                  <p className="text-[11px] text-[#888888]">
                    {shared ? "Anyone with the link can view your live resume." : "Generate a public link to share with recruiters."}
                  </p>
                </div>
              </div>
            </div>

            {/* Share URL */}
            {shared && shareUrl && (
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#888888]">Public Link URL</label>
                <div className="flex gap-2">
                  <input value={shareUrl} readOnly className="flex-1 h-9 px-3 text-xs font-mono bg-[#121212] border border-[#2a2a2a] text-white rounded-md outline-none" />
                  <button onClick={copy} className="h-9 px-3 bg-[#242424] hover:bg-[#3a3a3a] border border-[#2a2a2a] text-white rounded-md text-xs font-semibold shrink-0 inline-flex items-center gap-1.5 transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#faff69] hover:underline font-mono">
                  <ExternalLink className="w-3 h-3" /> Preview link in new tab
                </a>
              </div>
            )}

            {/* Toggle button */}
            <button
              onClick={toggle}
              disabled={loading}
              className={`w-full h-10 gap-1.5 rounded-md font-semibold text-xs transition-colors inline-flex items-center justify-center ${
                shared
                  ? "bg-[#121212] hover:bg-[#242424] border border-[#2a2a2a] text-white"
                  : "bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a]"
              }`}
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : shared ? (
                <>
                  <Link2Off className="w-3.5 h-3.5" /> Disable Public Link
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" /> Enable Public Link
                </>
              )}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
