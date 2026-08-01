"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { useResumeStore } from "@/lib/resume/store";
import { getPlanConfig, canCreateResume, remainingResumes, isPaidPlan } from "@/lib/resume/plans";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { BrandMark } from "@/components/resume/brand-mark";
import { LogoutButton } from "@/components/resume/auth-dialogs";
import { PricingDialog } from "@/components/resume/pricing-dialog";
import { ImportResumeDialog } from "@/components/resume/import-resume-dialog";
import { RoleExamplesDialog } from "@/components/resume/role-examples-dialog";
import { SupportDialog } from "@/components/resume/support-dialog";
import { TemplateThumbnail } from "@/components/resume/template-thumbnail";
import { downloadPdfDirectly } from "@/lib/resume/pdf-export";
import { TEMPLATES } from "@/lib/resume/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Plus,
  Upload,
  FileText,
  Wand2,
  Crown,
  Search,
  LayoutGrid,
  List,
  Edit3,
  Download,
  Copy,
  Share2,
  Trash2,
  Sparkles,
  Target,
  Gauge,
  Mail,
  ShieldCheck,
  Zap,
  ExternalLink,
  Loader2,
  User,
  Clock,
  ChevronRight,
  FolderOpen,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

interface SavedResumeItem {
  id: string;
  title: string;
  template: string;
  accentColor: string;
  fontFamily: string;
  updatedAt: string;
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

  // Fetch saved resumes from database
  const fetchResumes = useCallback(async () => {
    setLoadingResumes(true);
    try {
      const res = await fetch("/api/resumes");
      if (!res.ok) throw new Error("Failed to fetch resumes");
      const json = await res.json();
      setResumes(json.resumes || []);
    } catch {
      toast.error("Could not load saved resumes");
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

  // Actions
  const handleCreateNew = () => {
    if (user && !canCreate) {
      toast.error(`You've reached the resume limit for your ${planConfig.name} plan. Please upgrade.`);
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
      if (!res.ok) throw new Error("Failed to load resume");
      const data = await res.json();

      if (data.content) {
        try {
          const parsed = JSON.parse(data.content);
          setData(parsed);
        } catch {
          // ignore
        }
      }
      setTemplate(data.template || "modern");
      if (data.accentColor) setAccentColor(data.accentColor);
      if (data.fontFamily) setFontFamily(data.fontFamily);
      setContactLocked(!!data.contactLocked);
      setView("editor");
      router.push("/editor");
    } catch {
      toast.error("Could not open resume in editor");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicate = async (item: SavedResumeItem) => {
    if (user && !canCreate) {
      toast.error("Resume limit reached for your plan. Please upgrade.");
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
        body: JSON.stringify({
          title: newTitle,
          template: orig.template,
          accentColor: orig.accentColor,
          fontFamily: orig.fontFamily,
          content: orig.content,
        }),
      });

      if (!createRes.ok) throw new Error("Failed to create copy");
      toast.success(`Duplicated "${newTitle}"`);
      await fetchResumes();
      await refresh();
    } catch {
      toast.error("Failed to duplicate resume");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setActionLoading(`del-${id}`);
    try {
      const res = await fetch(`/api/resumes?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Resume deleted");
      await fetchResumes();
      await refresh();
    } catch {
      toast.error("Failed to delete resume");
    } finally {
      setActionLoading(null);
    }
  };

  const handleShareLink = (id: string) => {
    const url = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Public resume web link copied to clipboard!");
  };

  const filteredResumes = resumes.filter(
    (r) => r.title.toLowerCase().includes(query.toLowerCase()) || r.template.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-[#FF6200] selection:text-white">
      {/* Top SaaS Header */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-[#2E2E2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark showParent />
            <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 font-mono text-[10px] hidden sm:inline-flex">
              SaaS Application
            </Badge>
          </Link>

          <div className="flex items-center gap-3">
            <SupportDialog />
            {user && (
              <PricingDialog
                currentPlan={user.plan}
                onSubscribed={refresh}
                trigger={
                  <Button size="sm" className="h-9 px-3.5 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold gap-1.5 shadow-md shadow-[#FF6200]/20 text-xs">
                    <Crown className="w-3.5 h-3.5" /> {user.plan === "free" ? "Upgrade Plan" : planConfig.name}
                  </Button>
                }
              />
            )}
            {user && (
              <div className="hidden md:flex items-center gap-2 bg-[#141414] border border-[#2E2E2E] px-3 py-1 rounded-full text-xs font-mono">
                <User className="w-3.5 h-3.5 text-[#FF6200]" />
                <span className="text-white truncate max-w-[140px]">{user.email}</span>
              </div>
            )}
            <LogoutButton onLogout={refresh} />
          </div>
        </div>
      </header>

      {/* Main SaaS Dashboard Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* User SaaS Account Banner */}
        <section className="relative rounded-3xl bg-[#141414] border border-[#2E2E2E] p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6200]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-[#FF6200] text-white font-mono text-[10px] uppercase">
                  {planConfig.name} Plan
                </Badge>
                <span className="text-xs font-mono text-[#888898]">SaaS Control Center</span>
              </div>
              <h1 className="font-bricolage text-3xl sm:text-4xl font-bold text-white">
                Welcome Back, <span className="text-gradient-orange">{user?.email?.split("@")[0] || "Professional"}</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#888898]">
                Manage your saved resumes, scan new profiles with GPT-4o-mini, and export 100% vector ATS documents.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 bg-[#1A1A1A] border border-[#2E2E2E] p-4 rounded-2xl">
              <div className="text-center px-3 border-r border-[#2E2E2E]">
                <p className="font-bricolage text-2xl font-bold text-white">{resumes.length}</p>
                <p className="text-[10px] font-mono text-[#888898]">Resumes</p>
              </div>
              <div className="text-center px-3 border-r border-[#2E2E2E]">
                <p className="font-bricolage text-2xl font-bold text-[#FF6200]">
                  {remaining === Infinity ? "∞" : remaining}
                </p>
                <p className="text-[10px] font-mono text-[#888898]">Limit Left</p>
              </div>
              <div className="text-center px-3">
                <p className="font-bricolage text-2xl font-bold text-white">GPT-4o</p>
                <p className="text-[10px] font-mono text-[#888898]">AI Engine</p>
              </div>
            </div>
          </div>
        </section>

        {/* SaaS Action Bar */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            onClick={handleCreateNew}
            className="p-6 bg-[#141414] border-[#2E2E2E] hover:border-[#FF6200]/50 rounded-2xl cursor-pointer transition-all duration-300 group hover:-translate-y-1 shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF6200]/10 border border-[#FF6200]/30 group-hover:bg-[#FF6200] flex items-center justify-center text-[#FF6200] group-hover:text-white mb-4 transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-bricolage text-lg font-bold text-white mb-1">Create From Scratch</h3>
            <p className="text-xs text-[#888898]">Pick a template and build a custom vector ATS resume step-by-step.</p>
          </Card>

          <div className="p-6 bg-[#141414] border border-[#2E2E2E] hover:border-[#FF6200]/50 rounded-2xl transition-all duration-300 group hover:-translate-y-1 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] group-hover:border-[#FF6200]/50 flex items-center justify-center text-[#FF6200] mb-4 transition-all">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="font-bricolage text-lg font-bold text-white mb-1">Upload & AI Scan</h3>
              <p className="text-xs text-[#888898] mb-4">Upload PDF, DOCX, JSON, MD, or TXT. GPT-4o-mini parses all sections.</p>
            </div>
            <ImportResumeDialog trigger={
              <Button className="w-full h-9 rounded-xl bg-[#1A1A1A] hover:bg-[#FF6200] border border-[#2E2E2E] hover:border-[#FF6200] text-white text-xs font-semibold gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Launch AI Scanner
              </Button>
            } />
          </div>

          <Card
            onClick={handleLoadSample}
            className="p-6 bg-[#141414] border-[#2E2E2E] hover:border-[#FF6200]/50 rounded-2xl cursor-pointer transition-all duration-300 group hover:-translate-y-1 shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] group-hover:border-[#FF6200]/50 flex items-center justify-center text-[#FF6200] mb-4 transition-all">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="font-bricolage text-lg font-bold text-white mb-1">Interactive Sample</h3>
            <p className="text-xs text-[#888898]">Pre-populate full executive experience, skills, and projects instantly.</p>
          </Card>
        </section>

        {/* Resumes Management Workspace */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-2xl font-bold text-white">My Saved Resumes</h2>
              <p className="text-xs text-[#888898]">Manage, edit, duplicate, and export your professional resume documents.</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888898]" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search resumes..."
                  className="pl-9 h-9 text-xs bg-[#141414] border-[#2E2E2E] focus:border-[#FF6200] text-white rounded-full"
                />
              </div>

              {/* Grid / List view toggle */}
              <div className="flex items-center bg-[#141414] border border-[#2E2E2E] p-1 rounded-full">
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

          {/* Resumes Content */}
          {loadingResumes ? (
            <div className="py-16 text-center text-[#888898]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#FF6200] mb-2" />
              <p className="text-xs font-mono">Loading saved resumes...</p>
            </div>
          ) : filteredResumes.length === 0 ? (
            <Card className="p-12 text-center bg-[#141414] border-[#2E2E2E] rounded-2xl space-y-4">
              <FolderOpen className="w-12 h-12 mx-auto text-[#888898]/40" />
              <h3 className="font-bricolage text-lg font-bold text-white">No Resumes Found</h3>
              <p className="text-xs text-[#888898] max-w-sm mx-auto">
                {query ? "No saved resumes match your search query." : "You haven't created any saved resumes yet. Click 'Create From Scratch' to get started."}
              </p>
              {!query && (
                <Button onClick={handleCreateNew} className="h-9 px-6 rounded-full bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold text-xs gap-1.5">
                  <Plus className="w-4 h-4" /> Create First Resume
                </Button>
              )}
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((r) => (
                <Card key={r.id} className="p-5 bg-[#141414] border-[#2E2E2E] hover:border-[#FF6200]/40 rounded-2xl transition-all duration-300 space-y-4 group">
                  {/* Thumbnail & Badge */}
                  <div className="aspect-[3/4] bg-[#0B0B0C] rounded-xl overflow-hidden relative border border-[#2E2E2E] group-hover:border-[#FF6200]/30 transition-colors">
                    <TemplateThumbnail templateId={r.template} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-[#0D0D0D]/90 text-[#FF6200] border-[#2E2E2E] font-mono text-[9px] uppercase">
                        {r.template}
                      </Badge>
                    </div>
                  </div>

                  {/* Info & Title */}
                  <div>
                    <h3 className="font-bricolage font-bold text-base text-white truncate">{r.title}</h3>
                    <p className="text-[11px] font-mono text-[#888898] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-[#FF6200]" /> Updated {new Date(r.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions Grid */}
                  <div className="pt-2 border-t border-[#2E2E2E] grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleEditResume(r.id)}
                      disabled={actionLoading === r.id}
                      className="h-8 rounded-lg bg-[#FF6200] hover:bg-[#E55700] text-white text-xs font-semibold gap-1"
                    >
                      {actionLoading === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Edit3 className="w-3.5 h-3.5" />} Edit
                    </Button>
                    <Button
                      onClick={() => handleShareLink(r.id)}
                      variant="outline"
                      className="h-8 rounded-lg border-[#2E2E2E] bg-[#1A1A1A] hover:bg-[#252525] text-white text-xs gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#FF6200]" /> Share
                    </Button>
                    <Button
                      onClick={() => handleDuplicate(r)}
                      disabled={actionLoading === `dup-${r.id}`}
                      variant="outline"
                      className="h-8 rounded-lg border-[#2E2E2E] bg-[#1A1A1A] hover:bg-[#252525] text-white text-xs gap-1"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#888898]" /> Copy
                    </Button>
                    <Button
                      onClick={() => handleDelete(r.id, r.title)}
                      disabled={actionLoading === `del-${r.id}`}
                      variant="ghost"
                      className="h-8 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs gap-1"
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
                      <div className="flex items-center gap-2 text-xs text-[#888898] font-mono mt-0.5">
                        <Badge className="bg-[#1A1A1A] text-[#FF6200] border-[#2E2E2E] text-[9px] uppercase">{r.template}</Badge>
                        <span>•</span>
                        <span>Updated {new Date(r.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button onClick={() => handleEditResume(r.id)} size="sm" className="h-8 px-3 rounded-lg bg-[#FF6200] hover:bg-[#E55700] text-white text-xs font-semibold gap-1">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <Button onClick={() => handleShareLink(r.id)} variant="outline" size="sm" className="h-8 px-3 rounded-lg border-[#2E2E2E] bg-[#1A1A1A] text-white text-xs gap-1">
                      <Share2 className="w-3.5 h-3.5 text-[#FF6200]" /> Share
                    </Button>
                    <Button onClick={() => handleDuplicate(r)} variant="outline" size="sm" className="h-8 px-3 rounded-lg border-[#2E2E2E] bg-[#1A1A1A] text-white text-xs gap-1">
                      <Copy className="w-3.5 h-3.5 text-[#888898]" /> Copy
                    </Button>
                    <Button onClick={() => handleDelete(r.id, r.title)} variant="ghost" size="sm" className="h-8 px-2 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
