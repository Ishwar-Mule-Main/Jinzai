"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { useResumeStore } from "@/lib/resume/store";
import { getPlanConfig, canCreateResume, remainingResumes } from "@/lib/resume/plans";
import { BrandMark } from "@/components/resume/brand-mark";
import { LogoutButton } from "@/components/resume/auth-dialogs";
import { PricingDialog } from "@/components/resume/pricing-dialog";
import { ImportResumeDialog } from "@/components/resume/import-resume-dialog";
import { SupportDialog } from "@/components/resume/support-dialog";
import { TemplateThumbnail } from "@/components/resume/template-thumbnail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Upload,
  Wand2,
  Crown,
  Search,
  LayoutGrid,
  List,
  Edit3,
  Copy,
  Share2,
  Trash2,
  Sparkles,
  Loader2,
  User,
  Clock,
  FolderOpen,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  FileText,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PublicFooter } from "@/components/resume/public-footer";

interface SavedResumeItem {
  id: string;
  title: string;
  template: string;
  accentColor: string;
  fontFamily: string;
  updatedAt: string;
}

/** Returns a human-friendly relative time: "just now", "2 hours ago", "3 days ago" */
function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading, refresh } = useCurrentUser();
  const [resumes, setResumes] = useState<SavedResumeItem[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadSample = useResumeStore((s) => s.loadSample);
  const clearAll = useResumeStore((s) => s.clearAll);
  const setData = useResumeStore((s) => s.setData);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);
  const setFontFamily = useResumeStore((s) => s.setFontFamily);
  const setView = useResumeStore((s) => s.setView);
  const setContactLocked = useResumeStore((s) => s.setContactLocked);

  const fetchResumes = useCallback(async () => {
    setLoadingResumes(true);
    try {
      const res = await fetch("/api/resumes");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setResumes(json.resumes || []);
    } catch {
      toast.error("Could not load your saved resumes. Please refresh.");
    } finally {
      setLoadingResumes(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const planConfig = user ? getPlanConfig(user.plan) : getPlanConfig("free");
  const canCreate = user ? canCreateResume(user.plan, user.resumeCount) : true;
  const remaining = user ? remainingResumes(user.plan, user.resumeCount) : 1;

  const handleCreateNew = () => {
    if (user && !canCreate) {
      toast.error("You've reached your resume limit. Upgrade your plan to create more.");
      return;
    }
    clearAll();
    setContactLocked(false);
    setTemplate("modern");
    setView("editor");
    router.push("/editor");
  };

  const handleLoadSample = () => {
    loadSample();
    setContactLocked(false);
    setView("editor");
    router.push("/editor");
  };

  const handleEditResume = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/resumes?id=${id}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.content) {
        try { setData(JSON.parse(data.content)); } catch { /* ignore */ }
      }
      setTemplate(data.template || "modern");
      if (data.accentColor) setAccentColor(data.accentColor);
      if (data.fontFamily) setFontFamily(data.fontFamily);
      setContactLocked(!!data.contactLocked);
      setView("editor");
      router.push("/editor");
    } catch {
      toast.error("Could not open this resume. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicate = async (item: SavedResumeItem) => {
    if (user && !canCreate) {
      toast.error("You've reached your resume limit. Upgrade to make more.");
      return;
    }
    setActionLoading(`dup-${item.id}`);
    try {
      const res = await fetch(`/api/resumes?id=${item.id}`);
      if (!res.ok) throw new Error("Failed");
      const orig = await res.json();
      const newTitle = `${orig.title} (Copy)`;
      const createRes = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, template: orig.template, accentColor: orig.accentColor, fontFamily: orig.fontFamily, content: orig.content }),
      });
      if (!createRes.ok) throw new Error("Failed");
      toast.success(`"${newTitle}" created as a copy!`);
      await fetchResumes();
      await refresh();
    } catch {
      toast.error("Could not duplicate this resume. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    setActionLoading(`del-${id}`);
    try {
      const res = await fetch(`/api/resumes?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Resume deleted.");
      await fetchResumes();
      await refresh();
    } catch {
      toast.error("Could not delete this resume. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleShareLink = (id: string) => {
    const url = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied! Send it to anyone to show your resume.");
  };

  const filteredResumes = resumes.filter(
    (r) => r.title.toLowerCase().includes(query.toLowerCase()) || r.template.toLowerCase().includes(query.toLowerCase())
  );

  const isFirstTime = !loadingResumes && resumes.length === 0;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-[#FF6200] selection:text-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-[#2E2E2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark showParent />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <SupportDialog />
            {user && (
              <PricingDialog
                currentPlan={user.plan}
                onSubscribed={refresh}
                trigger={
                  <Button size="sm" className="h-9 px-3 sm:px-4 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold gap-1.5 shadow-md shadow-[#FF6200]/20 text-xs">
                    <Crown className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{user.plan === "free" ? "Upgrade" : planConfig.name}</span>
                  </Button>
                }
              />
            )}
            {user && (
              <div className="hidden md:flex items-center gap-2 bg-[#141414] border border-[#2E2E2E] px-3 py-1.5 rounded-full text-xs">
                <User className="w-3.5 h-3.5 text-[#FF6200]" />
                <span className="text-white truncate max-w-[140px]">{user.email}</span>
              </div>
            )}
            <LogoutButton onLogout={refresh} />
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      {/* Extra bottom padding on mobile so content isn't hidden behind sticky bar */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10 pb-28 sm:pb-10">

        {/* ── Free Account Purchase Notice Banner ── */}
        {user?.plan === "free" && (
          <div className="rounded-2xl bg-gradient-to-r from-[#FF6200]/20 via-[#141414] to-[#141414] border-2 border-[#FF6200]/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6200]/20 border border-[#FF6200]/40 text-[#FF6200] text-xs font-bold">
                <Crown className="w-3.5 h-3.5" /> FREE ACCOUNT NOTICE
              </div>
              <h3 className="text-lg font-bold text-white">Purchase a Plan to Download PDF &amp; Unlock All Premium Features</h3>
              <p className="text-xs text-[#888898]">
                Free accounts can build and preview resumes. Activate a plan starting at just ₹99 to download high-precision ATS PDFs &amp; unlock 78 premium templates.
              </p>
            </div>
            <PricingDialog
              currentPlan="free"
              onSubscribed={refresh}
              trigger={
                <Button className="h-11 px-6 bg-[#FF6200] hover:bg-[#E55700] text-white font-bold rounded-full gap-2 shadow-lg shadow-[#FF6200]/30 shrink-0">
                  <Crown className="w-4 h-4" /> Purchase Plan &amp; Download PDF
                </Button>
              }
            />
          </div>
        )}

        {/* ── Welcome Banner ── */}
        <section className="relative rounded-3xl bg-[#141414] border border-[#2E2E2E] p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#FF6200]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <Badge className="bg-[#FF6200] text-white text-[10px] uppercase font-semibold">
              {planConfig.name}
            </Badge>
            <h1 className="font-bricolage text-2xl sm:text-4xl font-bold text-white leading-tight">
              Hey{user?.email ? `, ${user.email.split("@")[0]}` : ""}! 👋 Ready to build your resume?
            </h1>
            <p className="text-sm text-[#888898] max-w-lg">
              You have <strong className="text-white">{resumes.length} resume{resumes.length !== 1 ? "s" : ""}</strong> saved.
              {remaining !== Infinity && remaining > 0 && (
                <> You can create <strong className="text-[#FF6200]">{remaining} more</strong> on your current plan.</>
              )}
              {remaining === Infinity && (
                <> Your plan lets you create <strong className="text-[#FF6200]">unlimited</strong> resumes.</>
              )}
            </p>
          </div>

          {/* Prominent Go to Editor Button */}
          <Link href="/editor" className="relative z-10 shrink-0 w-full md:w-auto">
            <Button className="w-full md:w-auto h-12 px-8 bg-[#FF6200] hover:bg-[#E55700] text-white font-bold rounded-full shadow-xl shadow-[#FF6200]/30 hover:shadow-[#FF6200]/50 text-sm gap-2 transition-all">
              <Edit3 className="w-4 h-4" /> Go to Editor →
            </Button>
          </Link>
        </section>

        {/* ── How It Works (shown only when user has 0 resumes) ── */}
        {isFirstTime && (
          <section className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="font-bricolage text-xl sm:text-2xl font-bold text-white">Here's how it works — 3 simple steps</h2>
              <p className="text-sm text-[#888898]">No experience needed. Just fill in your details and download.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: "1", icon: "🎨", title: "Pick a Design", desc: "Choose from 70+ beautiful resume styles. Don't worry — you can change it anytime." },
                { step: "2", icon: "✏️", title: "Fill Your Details", desc: "Add your name, work experience, education, and skills. Our AI can even help write better descriptions." },
                { step: "3", icon: "📄", title: "Download & Apply", desc: "Download your resume as a PDF and start applying to jobs right away." },
              ].map((s) => (
                <div key={s.step} className="relative p-5 rounded-2xl bg-[#141414] border border-[#2E2E2E] flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FF6200] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {s.step}
                    </div>
                    <span className="text-2xl">{s.icon}</span>
                  </div>
                  <h3 className="font-bricolage font-bold text-white text-base">{s.title}</h3>
                  <p className="text-sm text-[#888898] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Action Cards ── */}
        <section className="space-y-3">
          <h2 className="font-bricolage text-lg sm:text-xl font-bold text-white">What would you like to do?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Card 1 — Start New */}
            <button
              onClick={handleCreateNew}
              className="text-left p-5 sm:p-6 bg-[#141414] border-2 border-[#FF6200]/40 hover:border-[#FF6200] rounded-2xl cursor-pointer transition-all duration-300 group hover:-translate-y-1 shadow-lg hover:shadow-[#FF6200]/10 focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF6200]/10 border border-[#FF6200]/30 group-hover:bg-[#FF6200] flex items-center justify-center text-[#FF6200] group-hover:text-white mb-4 transition-all">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-bricolage text-base sm:text-lg font-bold text-white mb-1">✏️ Start a New Resume</h3>
              <p className="text-sm text-[#888898]">Pick a design and fill in your details. Takes about 5 minutes.</p>
              <div className="mt-4 flex items-center gap-1 text-[#FF6200] text-sm font-semibold">
                Start now <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Card 2 — Upload Old Resume */}
            <div className="p-5 sm:p-6 bg-[#141414] border border-[#2E2E2E] hover:border-[#FF6200]/50 rounded-2xl transition-all duration-300 group hover:-translate-y-1 shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] group-hover:border-[#FF6200]/50 flex items-center justify-center text-[#FF6200] mb-4 transition-all">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="font-bricolage text-base sm:text-lg font-bold text-white mb-1">📄 Upload Your Old Resume</h3>
                <p className="text-sm text-[#888898] mb-4">
                  Already have a resume? Upload it (PDF, Word, or text) and our AI will read it and fill everything in for you automatically.
                </p>
              </div>
              <ImportResumeDialog trigger={
                <Button className="w-full h-10 rounded-xl bg-[#1A1A1A] hover:bg-[#FF6200] border border-[#2E2E2E] hover:border-[#FF6200] text-white text-sm font-semibold gap-2 transition-all">
                  <Sparkles className="w-4 h-4" /> Upload & Auto-Fill
                </Button>
              } />
            </div>

            {/* Card 3 — See Example */}
            <button
              onClick={handleLoadSample}
              className="text-left p-5 sm:p-6 bg-[#141414] border border-[#2E2E2E] hover:border-[#FF6200]/50 rounded-2xl cursor-pointer transition-all duration-300 group hover:-translate-y-1 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] group-hover:border-[#FF6200]/50 flex items-center justify-center text-[#FF6200] mb-4 transition-all">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="font-bricolage text-base sm:text-lg font-bold text-white mb-1">👀 See an Example</h3>
              <p className="text-sm text-[#888898]">
                Not sure where to start? Load a ready-made example resume and explore how everything works.
              </p>
              <div className="mt-4 flex items-center gap-1 text-[#888898] group-hover:text-[#FF6200] text-sm font-semibold transition-colors">
                Load example <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </section>

        {/* ── My Resumes ── */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-xl sm:text-2xl font-bold text-white">My Saved Resumes</h2>
              <p className="text-sm text-[#888898]">Click "Open & Edit" to continue working on a resume, or "Share" to send it to employers.</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888898]" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name..."
                  className="pl-9 h-9 text-sm bg-[#141414] border-[#2E2E2E] focus:border-[#FF6200] text-white rounded-full"
                />
              </div>
              {/* View toggle */}
              <div className="flex items-center bg-[#141414] border border-[#2E2E2E] p-1 rounded-full shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-full transition-colors ${viewMode === "grid" ? "bg-[#FF6200] text-white" : "text-[#888898] hover:text-white"}`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-full transition-colors ${viewMode === "list" ? "bg-[#FF6200] text-white" : "text-[#888898] hover:text-white"}`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loadingResumes ? (
            <div className="py-16 text-center text-[#888898]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#FF6200] mb-3" />
              <p className="text-sm">Loading your resumes…</p>
            </div>
          ) : filteredResumes.length === 0 ? (
            <Card className="p-10 sm:p-14 text-center bg-[#141414] border-[#2E2E2E] rounded-2xl space-y-4">
              <FolderOpen className="w-12 h-12 mx-auto text-[#888898]/40" />
              <h3 className="font-bricolage text-lg font-bold text-white">
                {query ? "No resumes match your search." : "You haven't created any resumes yet."}
              </h3>
              <p className="text-sm text-[#888898] max-w-sm mx-auto">
                {query
                  ? "Try a different search word, or clear the search to see all your resumes."
                  : "Click \"Start a New Resume\" above to create your first one. It only takes a few minutes!"}
              </p>
              {!query && (
                <Button
                  onClick={handleCreateNew}
                  className="h-11 px-7 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold gap-2 shadow-lg shadow-[#FF6200]/20"
                >
                  <Plus className="w-4 h-4" /> Create My First Resume
                </Button>
              )}
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResumes.map((r) => (
                <Card key={r.id} className="p-4 bg-[#141414] border-[#2E2E2E] hover:border-[#FF6200]/40 rounded-2xl transition-all duration-300 space-y-4 group">
                  {/* Thumbnail */}
                  <div className="aspect-[3/4] bg-[#0B0B0C] rounded-xl overflow-hidden relative border border-[#2E2E2E] group-hover:border-[#FF6200]/30 transition-colors">
                    <TemplateThumbnail templateId={r.template} className="w-full h-full object-cover" />
                  </div>

                  {/* Title + time */}
                  <div>
                    <h3 className="font-bricolage font-bold text-base text-white truncate">{r.title}</h3>
                    <p className="text-xs text-[#888898] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-[#FF6200]" /> Last edited {relativeTime(r.updatedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#2E2E2E] grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleEditResume(r.id)}
                      disabled={actionLoading === r.id}
                      className="h-9 rounded-xl bg-[#FF6200] hover:bg-[#E55700] text-white text-sm font-semibold gap-1.5"
                    >
                      {actionLoading === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Edit3 className="w-3.5 h-3.5" />}
                      Open & Edit
                    </Button>
                    <Button
                      onClick={() => handleShareLink(r.id)}
                      variant="outline"
                      className="h-9 rounded-xl border-[#2E2E2E] bg-[#1A1A1A] hover:bg-[#252525] text-white text-sm gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#FF6200]" /> Share
                    </Button>
                    <Button
                      onClick={() => handleDuplicate(r)}
                      disabled={!!actionLoading}
                      variant="outline"
                      className="h-9 rounded-xl border-[#2E2E2E] bg-[#1A1A1A] hover:bg-[#252525] text-white text-sm gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#888898]" /> Duplicate
                    </Button>
                    <Button
                      onClick={() => handleDelete(r.id, r.title)}
                      disabled={!!actionLoading}
                      variant="ghost"
                      className="h-9 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResumes.map((r) => (
                <Card key={r.id} className="p-4 bg-[#141414] border-[#2E2E2E] hover:border-[#FF6200]/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-[#0B0B0C] rounded-lg overflow-hidden border border-[#2E2E2E] shrink-0">
                      <TemplateThumbnail templateId={r.template} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bricolage font-bold text-base text-white">{r.title}</h3>
                      <p className="text-xs text-[#888898] mt-0.5">Last edited {relativeTime(r.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button onClick={() => handleEditResume(r.id)} size="sm" disabled={actionLoading === r.id} className="h-9 px-4 rounded-lg bg-[#FF6200] hover:bg-[#E55700] text-white text-sm font-semibold gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" /> Open & Edit
                    </Button>
                    <Button onClick={() => handleShareLink(r.id)} variant="outline" size="sm" className="h-9 px-3 rounded-lg border-[#2E2E2E] bg-[#1A1A1A] text-white text-sm gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-[#FF6200]" /> Share
                    </Button>
                    <Button onClick={() => handleDuplicate(r)} variant="outline" size="sm" disabled={!!actionLoading} className="h-9 px-3 rounded-lg border-[#2E2E2E] bg-[#1A1A1A] text-white text-sm gap-1.5">
                      <Copy className="w-3.5 h-3.5 text-[#888898]" /> Duplicate
                    </Button>
                    <Button onClick={() => handleDelete(r.id, r.title)} variant="ghost" size="sm" disabled={!!actionLoading} className="h-9 px-2 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ── Help Strip ── */}
        <section className="rounded-2xl border border-[#2E2E2E] bg-[#141414] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6200]/10 border border-[#FF6200]/20 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4 text-[#FF6200]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Need help? We're here for you.</p>
              <p className="text-xs text-[#888898] mt-0.5">
                Stuck or confused? Click the support button and we'll walk you through everything personally.
              </p>
            </div>
          </div>
          <SupportDialog />
        </section>

      </main>

      {/* ── Mobile Sticky Bottom Bar ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-[#2E2E2E] px-4 py-3 flex items-center gap-3">
        <button
          onClick={handleCreateNew}
          className="flex-1 h-12 rounded-2xl bg-[#FF6200] hover:bg-[#E55700] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF6200]/30 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> New Resume
        </button>
        <ImportResumeDialog trigger={
          <button className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#2E2E2E] text-[#FF6200] flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5" />
          </button>
        } />
        <SupportDialog />
      </div>

      <PublicFooter />
    </div>
  );
}
