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
  Clock,
  FolderOpen,
  ArrowRight,
  HelpCircle,
  GraduationCap,
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
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
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

  const handleCreateNew = () => {
    if (user && !canCreateResume(user.plan, resumes.length)) {
      toast.error(`Your ${getPlanConfig(user.plan).name} plan allows up to ${getPlanConfig(user.plan).maxResumes} resume(s). Please upgrade!`);
      return;
    }
    clearAll();
    router.push("/editor");
  };

  const handleLoadSample = () => {
    loadSample();
    router.push("/editor");
  };

  const handleEditResume = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/resumes/${id}`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      const r = json.resume;
      setData(r.content);
      setTemplate(r.template as any);
      setAccentColor(r.accentColor);
      setFontFamily(r.fontFamily);
      setContactLocked(r.contactLocked);
      setView("editor");
      router.push("/editor");
    } catch {
      toast.error("Failed to load resume.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicate = async (r: SavedResumeItem) => {
    if (user && !canCreateResume(user.plan, resumes.length)) {
      toast.error(`Your plan limit reached. Upgrade to duplicate!`);
      return;
    }
    setActionLoading(r.id);
    try {
      const fetchRes = await fetch(`/api/resumes/${r.id}`);
      if (!fetchRes.ok) throw new Error("Failed");
      const { resume } = await fetchRes.json();

      const createRes = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${resume.title} (Copy)`,
          template: resume.template,
          accentColor: resume.accentColor,
          fontFamily: resume.fontFamily,
          content: resume.content,
        }),
      });
      if (!createRes.ok) throw new Error("Failed to copy");
      toast.success("Resume duplicated successfully!");
      fetchResumes();
    } catch {
      toast.error("Failed to duplicate resume.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Resume deleted.");
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Failed to delete resume.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleShareLink = (id: string) => {
    const shareUrl = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard!");
  };

  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );

  const planConfig = getPlanConfig(user?.plan || "free");
  const remaining = user ? remainingResumes(user.plan, resumes.length) : 0;
  const isFirstTime = !loadingResumes && resumes.length === 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/">
              <BrandMark showParent />
            </Link>
            <nav className="hidden md:flex items-center gap-5 text-sm">
              <Link href="/dashboard" className="text-[#faff69] font-medium border-b border-[#faff69] pb-0.5">
                Dashboard
              </Link>
              <Link href="/templates" className="text-[#cccccc] hover:text-[#faff69] transition-colors font-medium">
                Templates
              </Link>
              <Link href="/pricing" className="text-[#cccccc] hover:text-[#faff69] transition-colors font-medium">
                Pricing
              </Link>
              <Link href="/editor" className="text-[#cccccc] hover:text-[#faff69] transition-colors font-medium">
                Editor
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <PricingDialog
              currentPlan={user?.plan || "free"}
              onSubscribed={refresh}
              trigger={
                <button className="h-9 px-3.5 bg-[#1a1a1a] hover:bg-[#242424] text-white border border-[#2a2a2a] text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-[#faff69]" />
                  <span className="font-mono">{planConfig.name}</span>
                </button>
              }
            />

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* ── Free Plan Upgrade Banner ── */}
        {(!user || user.plan === "free") && (
          <div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#faff69] text-[#0a0a0a] text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase">
                  FREE PLAN ACTIVE
                </span>
                <span className="text-xs text-[#888888]">· Vector exports locked</span>
              </div>
              <p className="text-xs text-[#cccccc]">
                Free accounts can build and preview resumes. Upgrade starting at just ₹99 to download high-precision ATS PDFs &amp; unlock 78 premium layouts.
              </p>
            </div>
            <PricingDialog
              currentPlan="free"
              onSubscribed={refresh}
              trigger={
                <button className="h-10 px-5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs rounded-md transition-colors inline-flex items-center gap-1.5 shrink-0">
                  <Crown className="w-4 h-4" /> Upgrade Plan
                </button>
              }
            />
          </div>
        )}

        {/* ── Institutional Student Placement Cell Banner ── */}
        {user?.role === "student" && (
          <div className="rounded-xl bg-[#1a1a1a] border border-[#faff69] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69] shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#faff69] bg-[#242424] px-2 py-0.5 rounded-full uppercase font-bold">
                  CAMPUS PLACEMENT ROSTER
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {user.organization?.name || "College Placement Cell"} Portal
                </h4>
                <p className="text-xs text-[#888888]">
                  Full Pro features unlocked — 78 templates, vector PDF downloads &amp; AI ATS tools.
                </p>
              </div>
            </div>
            <Link href="/editor">
              <button className="h-9 px-5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 shrink-0">
                <Edit3 className="w-3.5 h-3.5" /> Launch AI Editor →
              </button>
            </Link>
          </div>
        )}

        {/* ── Welcome Banner ── */}
        <section className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="bg-[#242424] border border-[#2a2a2a] text-[#faff69] text-[10px] font-mono px-3 py-1 rounded-full uppercase font-semibold">
              {planConfig.name}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Welcome{user?.email ? `, ${user.email.split("@")[0]}` : ""} 👋
            </h1>
            <p className="text-sm text-[#cccccc] max-w-lg">
              You have <strong className="text-white">{resumes.length} resume{resumes.length !== 1 ? "s" : ""}</strong> saved.
              {remaining !== Infinity && remaining > 0 && (
                <> You can create <strong className="text-[#faff69]">{remaining} more</strong> on your current tier.</>
              )}
              {remaining === Infinity && (
                <> Your plan permits <strong className="text-[#faff69]">unlimited</strong> resumes.</>
              )}
            </p>
          </div>

          <Link href="/editor" className="shrink-0 w-full md:w-auto">
            <button className="w-full md:w-auto h-11 px-6 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-sm rounded-md transition-colors inline-flex items-center justify-center gap-2">
              <Edit3 className="w-4 h-4" /> Go to Editor →
            </button>
          </Link>
        </section>

        {/* ── Action Cards ── */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Card 1 — Start New */}
            <button
              onClick={handleCreateNew}
              className="text-left p-6 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#242424] border border-[#2a2a2a] group-hover:bg-[#faff69] group-hover:text-[#0a0a0a] flex items-center justify-center text-[#faff69] mb-4 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Start New Resume</h3>
              <p className="text-xs text-[#888888]">Pick an engineered layout and input your experience in minutes.</p>
              <div className="mt-4 flex items-center gap-1 text-[#faff69] text-xs font-semibold">
                Start now <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Card 2 — Upload Old Resume */}
            <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69] mb-4">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Upload &amp; Auto-Parse</h3>
                <p className="text-xs text-[#888888] mb-4">
                  Import an existing PDF, Word, or Markdown file to auto-populate all sections with AI parsing.
                </p>
              </div>
              <ImportResumeDialog trigger={
                <button className="w-full h-10 rounded-md bg-[#242424] hover:bg-[#3a3a3a] border border-[#2a2a2a] text-white text-xs font-semibold transition-colors inline-flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#faff69]" /> Upload File
                </button>
              } />
            </div>

            {/* Card 3 — See Example */}
            <button
              onClick={handleLoadSample}
              className="text-left p-6 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69] mb-4">
                <Wand2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Load Sample Profile</h3>
              <p className="text-xs text-[#888888]">
                Explore how engineered ATS templates and bullet point optimizers look with filled data.
              </p>
              <div className="mt-4 flex items-center gap-1 text-[#888888] group-hover:text-[#faff69] text-xs font-semibold transition-colors">
                Load sample <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </section>

        {/* ── My Resumes ── */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">My Saved Resumes</h2>
              <p className="text-xs text-[#888888]">Click "Open &amp; Edit" to resume drafting or "Share" for web profiles.</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title..."
                  className="w-full pl-9 pr-3 h-9 text-xs bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#faff69] text-white rounded-md outline-none transition-colors"
                />
              </div>
              {/* View toggle */}
              <div className="flex items-center bg-[#1a1a1a] border border-[#2a2a2a] p-0.5 rounded-md shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-[#242424] text-[#faff69]" : "text-[#888888] hover:text-white"}`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-[#242424] text-[#faff69]" : "text-[#888888] hover:text-white"}`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loadingResumes ? (
            <div className="py-16 text-center text-[#888888]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#faff69] mb-3" />
              <p className="text-sm">Loading your resumes…</p>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className="p-12 text-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl space-y-4">
              <FolderOpen className="w-12 h-12 mx-auto text-[#888888]/40" />
              <h3 className="text-base font-bold text-white">
                {query ? "No resumes match your query." : "No saved resumes yet."}
              </h3>
              <p className="text-xs text-[#888888] max-w-sm mx-auto">
                {query
                  ? "Try a different search term to find your saved resumes."
                  : "Click \"Start New Resume\" to generate your first ATS-compliant resume."}
              </p>
              {!query && (
                <button
                  onClick={handleCreateNew}
                  className="h-10 px-6 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create My First Resume
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((r) => (
                <div key={r.id} className="p-5 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl transition-all space-y-4 group">
                  {/* Thumbnail */}
                  <div className="aspect-[3/4] bg-[#121212] rounded-lg overflow-hidden relative border border-[#2a2a2a]">
                    <TemplateThumbnail templateId={r.template as any} className="w-full h-full object-cover" />
                  </div>

                  {/* Title + time */}
                  <div>
                    <h3 className="font-semibold text-sm text-white truncate">{r.title}</h3>
                    <p className="text-xs text-[#888888] flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5 text-[#faff69]" /> Edited {relativeTime(r.updatedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#2a2a2a] grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEditResume(r.id)}
                      disabled={actionLoading === r.id}
                      className="h-9 rounded-md bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      {actionLoading === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Edit3 className="w-3.5 h-3.5" />}
                      Open &amp; Edit
                    </button>
                    <button
                      onClick={() => handleShareLink(r.id)}
                      className="h-9 rounded-md border border-[#2a2a2a] bg-[#242424] hover:bg-[#3a3a3a] text-white text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#faff69]" /> Share
                    </button>
                    <button
                      onClick={() => handleDuplicate(r)}
                      disabled={!!actionLoading}
                      className="h-9 rounded-md border border-[#2a2a2a] bg-[#242424] hover:bg-[#3a3a3a] text-white text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#888888]" /> Duplicate
                    </button>
                    <button
                      onClick={() => handleDelete(r.id, r.title)}
                      disabled={!!actionLoading}
                      className="h-9 rounded-md border border-transparent hover:border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/10 text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResumes.map((r) => (
                <div key={r.id} className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-[#121212] rounded-md overflow-hidden border border-[#2a2a2a] shrink-0">
                      <TemplateThumbnail templateId={r.template as any} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">{r.title}</h3>
                      <p className="text-xs text-[#888888] mt-0.5">Edited {relativeTime(r.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => handleEditResume(r.id)} disabled={actionLoading === r.id} className="h-9 px-4 rounded-md bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-xs font-semibold transition-colors inline-flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" /> Open &amp; Edit
                    </button>
                    <button onClick={() => handleShareLink(r.id)} className="h-9 px-3 rounded-md border border-[#2a2a2a] bg-[#242424] hover:bg-[#3a3a3a] text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-[#faff69]" /> Share
                    </button>
                    <button onClick={() => handleDuplicate(r)} disabled={!!actionLoading} className="h-9 px-3 rounded-md border border-[#2a2a2a] bg-[#242424] hover:bg-[#3a3a3a] text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5">
                      <Copy className="w-3.5 h-3.5 text-[#888888]" /> Duplicate
                    </button>
                    <button onClick={() => handleDelete(r.id, r.title)} disabled={!!actionLoading} className="h-9 px-2 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-md transition-colors inline-flex items-center">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Help Strip ── */}
        <section className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#242424] border border-[#2a2a2a] flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4 text-[#faff69]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Need assistance with your resume?</p>
              <p className="text-xs text-[#888888] mt-0.5">
                Our support team and AI copilot are ready to assist you with layout, quantification, or export issues.
              </p>
            </div>
          </div>
          <SupportDialog />
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
