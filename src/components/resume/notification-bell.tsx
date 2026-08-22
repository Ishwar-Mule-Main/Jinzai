"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, CheckCircle2, MessageSquare, Clock } from "lucide-react";

interface Notification {
  id: string;
  subject: string;
  message: string;
  reply?: string;
  status: string;
  createdAt: string;
}

export function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.length;

  useEffect(() => {
    if (!session?.user) return;
    let mounted = true;
    const doLoad = async () => {
      try {
        const res = await fetch("/api/support");
        if (res.ok && mounted) {
          const json = await res.json();
          const tickets = json.tickets || [];
          const withReplies = tickets.filter((t: Notification) => t.reply && t.status === "replied");
          setNotifications(withReplies);
        }
      } catch {
        // ignore
      }
    };
    doLoad();
    const interval = setInterval(doLoad, 30000);
    return () => { mounted = false; clearInterval(interval); };
  }, [session]);

  const markAsRead = () => {
    setOpen(false);
  };

  if (!session?.user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative h-9 w-9 rounded-md bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] text-[#cccccc] hover:text-white flex items-center justify-center transition-colors" title="Notifications">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#faff69] text-[#0a0a0a] text-[8px] flex items-center justify-center font-bold font-mono">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-[#1a1a1a] border-[#2a2a2a] text-white rounded-xl font-sans" align="end">
        <div className="border-b border-[#2a2a2a] px-4 py-3 flex items-center justify-between">
          <p className="text-xs font-bold flex items-center gap-1.5 text-white">
            <Bell className="w-3.5 h-3.5 text-[#faff69]" /> Notifications
          </p>
          {unreadCount > 0 && (
            <span className="text-[9px] font-mono font-bold bg-[#faff69] text-[#0a0a0a] px-2 py-0.5 rounded-full">{unreadCount} new</span>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 px-4">
              <Bell className="w-6 h-6 mx-auto mb-2 text-[#888888]/40" />
              <p className="text-xs text-[#888888]">No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="border-b border-[#2a2a2a] last:border-0 p-3 hover:bg-[#242424] transition-colors">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-[#faff69]">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{n.subject}</p>
                    <div className="mt-1 p-1.5 rounded bg-[#121212] border border-[#2a2a2a] text-[10px] text-[#cccccc]">
                      <span className="font-semibold text-[#faff69]">Support:</span> {n.reply}
                    </div>
                    <p className="text-[9px] text-[#888888] font-mono mt-1 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {unreadCount > 0 && (
          <div className="border-t border-[#2a2a2a] p-2">
            <button onClick={markAsRead} className="w-full py-1.5 text-xs text-[#888888] hover:text-white hover:bg-[#242424] rounded-md gap-1.5 inline-flex items-center justify-center font-semibold transition-colors">
              <CheckCircle2 className="w-3 h-3" /> Mark all as read
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
