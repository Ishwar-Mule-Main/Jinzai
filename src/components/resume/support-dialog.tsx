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
import { HeadphonesIcon, Loader2, Send, CheckCircle2, MessageSquare } from "lucide-react";
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
      toast.error("Fill in all fields");
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
      toast.success("Message sent! We'll reply soon.");
      setSubject("");
      setMessage("");
      loadTickets();
    } catch {
      toast.error("Could not send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <HeadphonesIcon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Support</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeadphonesIcon className="w-5 h-5 text-teal-600" /> Customer Support
          </DialogTitle>
          <DialogDescription>
            Have a question, issue, or feedback? Send us a message and we'll reply to your account.
          </DialogDescription>
        </DialogHeader>

        {/* Previous tickets */}
        {tickets.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Your conversations
            </p>
            {tickets.map((t) => (
              <div key={t.id} className="rounded-lg border p-2.5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-xs font-medium truncate">{t.subject}</p>
                  <Badge className={`text-[8px] border-0 ${
                    t.status === "open" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" :
                    t.status === "replied" ? "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300" :
                    "bg-muted text-muted-foreground"
                  }`}>{t.status}</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{t.message}</p>
                {t.reply && (
                  <div className="mt-1.5 p-1.5 rounded bg-teal-50 dark:bg-teal-950/30 text-[10px] text-teal-800 dark:text-teal-200">
                    <span className="font-semibold">Reply:</span> {t.reply}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* New ticket form */}
        <div className="space-y-3 border-t pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" className="h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-8 text-sm" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief subject" className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Message</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Describe your issue or question..." className="text-sm" />
          </div>
          <Button onClick={submit} disabled={loading} className="w-full gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
