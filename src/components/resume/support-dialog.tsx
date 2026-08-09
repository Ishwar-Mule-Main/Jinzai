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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { HeadphonesIcon, Loader2, Send, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
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
        <Button variant="ghost" size="sm" className="gap-1.5 text-[#9A9AAB] hover:text-white hover:bg-[#1A1A1A]">
          <HeadphonesIcon className="w-3.5 h-3.5 text-[#FF6200]" /> <span className="hidden sm:inline">Support &amp; Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-[#141414] text-white border-[#2E2E2E] p-6 sm:p-7 shadow-2xl rounded-3xl selection:bg-[#FF6200] selection:text-white">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2.5 font-bricolage text-xl font-bold text-white">
            <div className="p-2 rounded-xl bg-[#FF6200]/10 border border-[#FF6200]/30">
              <HeadphonesIcon className="w-5 h-5 text-[#FF6200]" />
            </div>
            Customer Support &amp; Help Desk
          </DialogTitle>
          <DialogDescription className="text-xs text-[#9A9AAB]">
            Have a question, technical issue, or feedback? Send us a message and our support team will respond to your account.
          </DialogDescription>
        </DialogHeader>

        {/* Previous tickets */}
        {tickets.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-mono text-[#9A9AAB] flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-[#FF6200]" /> Your Support Tickets ({tickets.length})
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {tickets.map((t) => (
                <div key={t.id} className="rounded-2xl border border-[#2E2E2E] bg-[#0D0D0D] p-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white truncate">{t.subject}</p>
                    <Badge className={`text-[9px] font-mono border-0 ${
                      t.status === "open" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
                      t.status === "replied" ? "bg-[#FF6200]/10 text-[#FF6200] border border-[#FF6200]/30" :
                      "bg-[#1A1A1A] text-[#888898] border border-[#2E2E2E]"
                    }`}>{t.status.toUpperCase()}</Badge>
                  </div>
                  <p className="text-[11px] text-[#9A9AAB] line-clamp-2">{t.message}</p>
                  {t.reply && (
                    <div className="mt-1.5 p-2 rounded-xl bg-[#FF6200]/10 border border-[#FF6200]/20 text-[11px] text-white">
                      <span className="font-bold text-[#FF6200]">Official Support Reply:</span> {t.reply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New ticket form */}
        <div className="space-y-3.5 border-t border-[#2E2E2E] pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-mono text-[#9A9AAB]">Email Address</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@domain.com"
                className="h-10 text-xs bg-[#0D0D0D] border-[#2E2E2E] text-white focus-visible:ring-[#FF6200] rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-mono text-[#9A9AAB]">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-10 text-xs bg-[#0D0D0D] border-[#2E2E2E] text-white focus-visible:ring-[#FF6200] rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-mono text-[#9A9AAB]">Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your question or issue"
              className="h-10 text-xs bg-[#0D0D0D] border-[#2E2E2E] text-white focus-visible:ring-[#FF6200] rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-mono text-[#9A9AAB]">Detailed Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Provide details about your query, billing, or technical issue..."
              className="text-xs bg-[#0D0D0D] border-[#2E2E2E] text-white focus-visible:ring-[#FF6200] rounded-xl p-3"
            />
          </div>

          <Button
            onClick={submit}
            disabled={loading}
            className="w-full h-11 bg-[#FF6200] hover:bg-[#E55700] text-white font-bold text-xs gap-2 rounded-full shadow-xl shadow-[#FF6200]/30 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit Support Ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
