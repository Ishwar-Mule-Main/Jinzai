"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/support");
      if (res.ok) {
        const json = await res.json();
        const tickets = json.tickets || [];
        // Only show tickets with replies as notifications
        const withReplies = tickets.filter((t: Notification) => t.reply && t.status === "replied");
        setNotifications(withReplies);
      }
    } catch {
      // ignore
    }
  };

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
    // In production, mark notifications as read via API
    // For now, just close the popover
    setOpen(false);
  };

  if (!session?.user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9" title="Notifications">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" /> Notifications
          </p>
          {unreadCount > 0 && (
            <Badge className="text-[9px] bg-red-500 text-white border-0">{unreadCount} new</Badge>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 px-4">
              <Bell className="w-6 h-6 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="border-b last:border-0 p-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{n.subject}</p>
                    <div className="mt-1 p-1.5 rounded bg-teal-50 dark:bg-teal-950/30 text-[10px] text-teal-800 dark:text-teal-200">
                      <span className="font-semibold">Admin reply:</span> {n.reply}
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {unreadCount > 0 && (
          <div className="border-t p-2">
            <Button size="sm" variant="ghost" onClick={markAsRead} className="w-full text-xs gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> Mark all as read
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
