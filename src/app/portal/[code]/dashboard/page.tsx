"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap,
  Building2,
  Users,
  FileText,
  Upload,
  Plus,
  Copy,
  Loader2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Search,
  Download,
  ExternalLink,
  Edit3,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { LogoutButton } from "@/components/resume/auth-dialogs";

interface StudentRosterItem {
  id: string;
  email: string;
  name: string;
  studentId: string;
  createdAt: string;
  _count?: { resumes: number };
}

export default function InstitutionalDashboardPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();

  const [org, setOrg] = useState<any>(null);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [students, setStudents] = useState<StudentRosterItem[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [query, setQuery] = useState("");

  // Account Creation Form States
  const [creationMode, setCreationMode] = useState<"csv_upload" | "range" | "single">("csv_upload");
  const [creating, setCreating] = useState(false);

  // Single Form State
  const [singleStudentId, setSingleStudentId] = useState("");
  const [singleName, setSingleName] = useState("");
  const [singleEmail, setSingleEmail] = useState("");

  // Range State
  const [startRoll, setStartRoll] = useState("");
  const [endRoll, setEndRoll] = useState("");
  const [batchPrefix, setBatchPrefix] = useState("Student");

  // CSV State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvFileName, setCsvFileName] = useState("");
  const [csvParsedStudents, setCsvParsedStudents] = useState<{ studentId: string; name: string; email?: string }[]>([]);

  // Created Results
  const [lastCreatedResults, setLastCreatedResults] = useState<any[]>([]);

  // Fetch org & student roster
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const portalRes = await fetch(`/api/portal/${code}`);
        if (!portalRes.ok) throw new Error("Portal not found");
        const portalData = await portalRes.json();
        if (cancelled) return;
        setOrg(portalData.organization);

        // Fetch roster
        const rosterRes = await fetch(`/api/admin/organizations/${portalData.organization.id}/students`);
        if (rosterRes.ok) {
          const rosterData = await rosterRes.json();
          if (!cancelled) setStudents(rosterData.students || []);
        }
      } catch {
        toast.error("Could not load placement dashboard details.");
      } finally {
        if (!cancelled) {
          setLoadingOrg(false);
          setLoadingStudents(false);
        }
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [code]);

  // CSV File Handler
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;

      const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const parsed: { studentId: string; name: string; email?: string }[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Skip header if line contains 'student' or 'roll' or 'id'
        if (i === 0 && (line.toLowerCase().includes("roll") || line.toLowerCase().includes("id"))) {
          continue;
        }

        const parts = line.split(/[,;\t]/).map((p) => p.trim());
        const id = parts[0];
        const name = parts[1] || `Student ${id}`;
        const email = parts[2] || undefined;

        if (id) {
          parsed.push({ studentId: id, name, email });
        }
      }

      setCsvParsedStudents(parsed);
      toast.success(`Parsed ${parsed.length} student records from ${file.name}`);
    };
    reader.readAsText(file);
  };

  // Submit Account Creation
  const handleCreateStudents = async () => {
    if (!org) return;

    let payload: { students: { studentId: string; name: string; email?: string }[] } = { students: [] };

    if (creationMode === "csv_upload") {
      if (csvParsedStudents.length === 0) {
        toast.error("Please upload a CSV / Excel file with student roll numbers first");
        return;
      }
      payload.students = csvParsedStudents;
    } else if (creationMode === "range") {
      const s = parseInt(startRoll, 10);
      const e = parseInt(endRoll, 10);
      if (isNaN(s) || isNaN(e) || e < s) {
        toast.error("Please enter a valid Start and End Roll Number range");
        return;
      }
      for (let i = s; i <= e; i++) {
        payload.students.push({ studentId: String(i), name: `${batchPrefix} ${i}` });
      }
    } else if (creationMode === "single") {
      if (!singleStudentId) {
        toast.error("Student Roll No / ID is required");
        return;
      }
      payload.students = [{ studentId: singleStudentId, name: singleName || `Student ${singleStudentId}`, email: singleEmail || undefined }];
    }

    setCreating(true);
    try {
      const res = await fetch(`/api/admin/organizations/${org.id}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Creation failed");
      }

      const data = await res.json();
      setLastCreatedResults(data.students || []);
      toast.success(`Successfully issued login credentials for ${data.created || 0} students!`);

      // Refresh student roster
      const rosterRes = await fetch(`/api/admin/organizations/${org.id}/students`);
      if (rosterRes.ok) {
        const rosterData = await rosterRes.json();
        setStudents(rosterData.students || []);
      }

      // Reset input fields
      setCsvParsedStudents([]);
      setCsvFileName("");
      setStartRoll(""); setEndRoll("");
      setSingleStudentId(""); setSingleName(""); setSingleEmail("");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCreating(false);
    }
  };

  // Download Credentials CSV
  const downloadCredentialsCsv = () => {
    if (!org) return;
    const itemsToExport = lastCreatedResults.length > 0 ? lastCreatedResults : students;
    if (itemsToExport.length === 0) {
      toast.error("No student roster records to export");
      return;
    }

    const header = "Student Roll ID,Full Name,Student Login Email,Password,Portal Direct Link\n";
    const rows = itemsToExport
      .map((s) => {
        const pwd = s.password || `${s.studentId}${org.uniqueCode}`;
        const portalUrl = `${window.location.origin}/portal/${org.uniqueCode}`;
        return `"${s.studentId}","${s.name}","${s.email}","${pwd}","${portalUrl}"`;
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${org.name}_Student_Login_Roster.csv`;
    a.click();
  };

  const filteredStudents = students.filter(
    (s) => s.studentId.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase()) || s.email.toLowerCase().includes(query.toLowerCase())
  );

  if (loadingOrg || userLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans">
      
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-[#2E2E2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="font-bricolage font-bold text-sm sm:text-base text-white">{org?.name || "College Portal"}</h1>
              <p className="text-[10px] text-[#888898] font-mono">Institutional Placement Cell Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/portal/${code}`}>
              <Button size="sm" variant="outline" className="h-9 px-3 rounded-full border-[#2E2E2E] bg-[#141414] text-xs text-violet-300 gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> Portal View
              </Button>
            </Link>
            <Link href="/editor">
              <Button size="sm" className="h-9 px-4 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs gap-1.5 shadow-md">
                <Edit3 className="w-3.5 h-3.5" /> Open AI Editor
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Banner */}
        <section className="relative rounded-3xl bg-gradient-to-r from-violet-950/40 via-[#141414] to-[#141414] border-2 border-violet-600/40 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/50 border border-violet-700/50 text-violet-300 text-xs font-bold font-mono">
              <GraduationCap className="w-3.5 h-3.5 text-violet-400" /> INSTITUTIONAL PLACEMENT PORTAL
            </div>
            <h2 className="font-bricolage text-2xl sm:text-4xl font-extrabold text-white">
              {org?.name} Student Roster &amp; Credentials Portal
            </h2>
            <p className="text-xs sm:text-sm text-[#888898] max-w-xl">
              Portal Code: <strong className="text-violet-300 font-mono font-bold">{org?.uniqueCode}</strong> · Purchased Seats: <strong className="text-white font-mono">{org?.seats || 300}</strong>
            </p>
          </div>

          <Button
            onClick={downloadCredentialsCsv}
            className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full gap-2 shadow-lg shadow-emerald-600/20 shrink-0 text-xs"
          >
            <Download className="w-4 h-4" /> Download Complete Roster CSV
          </Button>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Purchased Seats", value: org?.seats || 300, icon: Building2, color: "violet" },
            { label: "Registered Student Accounts", value: students.length, icon: Users, color: "teal" },
            { label: "Available Remaining Seats", value: Math.max(0, (org?.seats || 300) - students.length), icon: CheckCircle2, color: "emerald" },
            { label: "Student Resumes Created", value: students.reduce((acc, s) => acc + (s._count?.resumes || 0), 0), icon: FileText, color: "amber" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="p-5 bg-[#141414] border-[#2E2E2E] rounded-2xl space-y-2">
                <div className="w-9 h-9 rounded-xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-violet-400" />
                </div>
                <p className="text-2xl font-extrabold font-mono text-white">{item.value}</p>
                <p className="text-xs text-[#888898] font-mono">{item.label}</p>
              </Card>
            );
          })}
        </section>

        {/* ── Bulk Account Creation Section ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bricolage text-xl font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-violet-400" /> Issue Bulk Student Login Credentials
            </h3>
          </div>

          <Card className="p-6 bg-[#141414] border-2 border-violet-600/30 rounded-3xl space-y-5">
            {/* Mode Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#0D0D0D] border border-[#2E2E2E] rounded-full text-xs font-semibold max-w-xl">
              <button
                onClick={() => setCreationMode("csv_upload")}
                className={`py-2 px-4 rounded-full flex items-center justify-center gap-1.5 transition-all ${
                  creationMode === "csv_upload" ? "bg-violet-600 text-white font-bold shadow-md" : "text-[#888898] hover:text-white"
                }`}
              >
                <Upload className="w-4 h-4" /> Upload CSV / Excel
              </button>
              <button
                onClick={() => setCreationMode("range")}
                className={`py-2 px-4 rounded-full flex items-center justify-center gap-1.5 transition-all ${
                  creationMode === "range" ? "bg-violet-600 text-white font-bold shadow-md" : "text-[#888898] hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4" /> Roll No Range
              </button>
              <button
                onClick={() => setCreationMode("single")}
                className={`py-2 px-4 rounded-full flex items-center justify-center gap-1.5 transition-all ${
                  creationMode === "single" ? "bg-violet-600 text-white font-bold shadow-md" : "text-[#888898] hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" /> Single Student
              </button>
            </div>

            {/* Mode 1: CSV / Excel Upload */}
            {creationMode === "csv_upload" && (
              <div className="space-y-4 pt-1">
                <div className="p-6 border-2 border-dashed border-violet-500/40 rounded-2xl bg-[#0D0D0D] text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Click or Drag &amp; Drop CSV / Excel File</p>
                    <p className="text-xs text-[#888898] mt-1 font-mono">Expected format: Student Roll ID, Full Name, Custom Email (Optional)</p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv,.txt,.xlsx"
                    onChange={handleCsvFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="h-10 px-6 rounded-full border-violet-500/40 bg-violet-950/20 text-violet-300 hover:bg-violet-900/40 text-xs font-bold gap-2"
                  >
                    <Upload className="w-4 h-4" /> {csvFileName ? `File Selected: ${csvFileName}` : "Select CSV / Excel File"}
                  </Button>
                </div>

                {csvParsedStudents.length > 0 && (
                  <div className="p-4 bg-violet-950/20 border border-violet-800/40 rounded-2xl flex items-center justify-between text-xs">
                    <span className="text-violet-300 font-mono font-bold">✅ Parsed {csvParsedStudents.length} student records from file</span>
                    <Button onClick={handleCreateStudents} disabled={creating} className="h-9 px-5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-full text-xs gap-1.5">
                      {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Issue Credentials for All {csvParsedStudents.length} Students
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Range */}
            {creationMode === "range" && (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    value={startRoll}
                    onChange={(e) => setStartRoll(e.target.value)}
                    placeholder="Start Roll No (e.g. 23001)"
                    type="number"
                    className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl h-11"
                  />
                  <Input
                    value={endRoll}
                    onChange={(e) => setEndRoll(e.target.value)}
                    placeholder="End Roll No (e.g. 23050)"
                    type="number"
                    className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl h-11"
                  />
                  <Input
                    value={batchPrefix}
                    onChange={(e) => setBatchPrefix(e.target.value)}
                    placeholder="Name Prefix (e.g. CS Batch)"
                    className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl h-11"
                  />
                </div>
                <Button onClick={handleCreateStudents} disabled={creating} className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-full text-xs gap-2">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Issue Bulk Accounts for Range
                </Button>
              </div>
            )}

            {/* Mode 3: Single Student */}
            {creationMode === "single" && (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    value={singleStudentId}
                    onChange={(e) => setSingleStudentId(e.target.value)}
                    placeholder="Student Roll No (e.g. 23001)"
                    className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl h-11"
                  />
                  <Input
                    value={singleName}
                    onChange={(e) => setSingleName(e.target.value)}
                    placeholder="Full Name (e.g. Rahul Sharma)"
                    className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl h-11"
                  />
                  <Input
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    placeholder="Custom Email (Optional)"
                    className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl h-11"
                  />
                </div>
                <Button onClick={handleCreateStudents} disabled={creating} className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-full text-xs gap-2">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Create Student Credential
                </Button>
              </div>
            )}
          </Card>
        </section>

        {/* ── Student Roster Table ── */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bricolage text-xl font-bold text-white">Registered Student Accounts ({students.length})</h3>
              <p className="text-xs text-[#888898]">Students log in at <code className="text-violet-300 font-mono">/portal/{org?.uniqueCode}</code> using their Roll ID and generated password.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888898]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search roll no or name..."
                className="pl-9 h-9 bg-[#141414] border-[#2E2E2E] text-white text-xs rounded-full"
              />
            </div>
          </div>

          <Card className="bg-[#141414] border-[#2E2E2E] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0D0D0D] border-b border-[#2E2E2E] text-[#888898] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Roll No / ID</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Login Email</th>
                    <th className="p-3.5">Generated Password</th>
                    <th className="p-3.5">Resumes</th>
                    <th className="p-3.5">Issued Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2E2E]/50">
                  {loadingStudents ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#888898]">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-violet-500 mb-2" />
                        Loading roster…
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#888898]">
                        No student credentials found. Use the section above to issue bulk accounts!
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-[#1A1A1A]">
                        <td className="p-3.5 font-bold font-mono text-violet-300">{s.studentId}</td>
                        <td className="p-3.5 text-white font-semibold">{s.name}</td>
                        <td className="p-3.5 text-[#888898] font-mono">{s.email}</td>
                        <td className="p-3.5 font-mono text-emerald-400 font-bold">{`${s.studentId}${org?.uniqueCode}`}</td>
                        <td className="p-3.5 font-mono text-white">{s._count?.resumes || 0}</td>
                        <td className="p-3.5 text-[#888898] text-[11px]">{new Date(s.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

      </main>

    </div>
  );
}
