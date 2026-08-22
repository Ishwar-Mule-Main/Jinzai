"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HeadphonesIcon, Loader2, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  reply: string | null;
  createdAt: string;
}

export function SupportDialog() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (open && session?.user) {
      setEmail((session.user as { email?: string }).email || "");
      setName((session.user as { name?: string }).name || "");
      loadTickets();
    }
  }, [open, session]);

  const loadTickets = async () => {
    try {
      const res = await fetch("/api/support");
      if (res.ok) {
        const json = await res.json();
        setTickets(json.tickets || []);
      }
    } catch {
      // ignore
    }
  };

  const submit = async () => {
    if (!email || !subject || !message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, subject, message }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Support ticket submitted! Our team will respond shortly.");
      setSubject("");
      setMessage("");
      loadTickets();
    } catch {
      toast.error("Could not send support ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-9 px-3 gap-1.5 text-xs text-[#888888] hover:text-white bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] rounded-md font-semibold inline-flex items-center transition-colors">
          <HeadphonesIcon className="w-3.5 h-3.5 text-[#faff69]" /> <span className="hidden sm:inline">Support</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-[#1a1a1a] text-white border-[#2a2a2a] p-6 sm:p-7 rounded-xl font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold text-white tracking-tight">
            <div className="w-8 h-8 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69]">
              <HeadphonesIcon className="w-4 h-4" />
            </div>
            Support Desk &amp; Inquiries
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888888]">
            Have a question, technical issue, or feedback? Send us a ticket and our team will respond directly.
          </DialogDescription>
        </DialogHeader>

        {/* Previous tickets */}
        {tickets.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-mono text-[#888888] flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-[#faff69]" /> Your Tickets ({tickets.length})
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {tickets.map((t) => (
                <div key={t.id} className="rounded-lg border border-[#2a2a2a] bg-[#121212] p-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white truncate">{t.subject}</p>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                      t.status === "open" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                      t.status === "replied" ? "bg-[#faff69]/10 text-[#faff69] border-[#faff69]/30" :
                      "bg-[#242424] text-[#888888] border-[#2a2a2a]"
                    }`}>{t.status.toUpperCase()}</span>
                  </div>
                  <p className="text-[11px] text-[#888888] line-clamp-2">{t.message}</p>
                  {t.reply && (
                    <div className="mt-1.5 p-2 rounded-md bg-[#242424] border border-[#2a2a2a] text-[11px] text-[#cccccc]">
                      <span className="font-bold text-[#faff69]">Support Reply:</span> {t.reply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New ticket form */}
        <div className="space-y-3.5 border-t border-[#2a2a2a] pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-[#888888]">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@domain.com"
                className="w-full h-9 text-xs bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#faff69] rounded-md px-3 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-[#888888]">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-9 text-xs bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#faff69] rounded-md px-3 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[#888888]">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your question or issue"
              className="w-full h-9 text-xs bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#faff69] rounded-md px-3 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[#888888]">Detailed Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Provide details about your query, billing, or technical issue..."
              className="w-full text-xs bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#faff69] rounded-md p-3 outline-none resize-none"
            />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full h-10 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-xs gap-2 rounded-md transition-colors inline-flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit Support Ticket
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
