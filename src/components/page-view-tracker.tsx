"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * Client-side page view tracker.
 * Fires a POST to /api/track on every route change (with a session ID in localStorage).
 *
 * Note: uses usePathname (safe for static prerender) and reads search params
 * from window.location inside the effect (avoids the useSearchParams Suspense
 * boundary requirement that breaks static generation of /404 and other pages).
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    // Don't track admin pages
    if (!pathname || pathname.startsWith("/admin")) return;

    // Get or create a session ID (persists in localStorage for 30 min)
    const SESSION_KEY = "jinzai-session-id";
    const SESSION_TS_KEY = "jinzai-session-ts";
    let sessionId = localStorage.getItem(SESSION_KEY);
    const lastTs = Number(localStorage.getItem(SESSION_TS_KEY) || 0);
    const now = Date.now();
    // New session if none or last activity > 30 min ago
    if (!sessionId || now - lastTs > 30 * 60 * 1000) {
      sessionId = `${now}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    localStorage.setItem(SESSION_TS_KEY, String(now));

    // Read search params from window.location (client-only, avoids useSearchParams Suspense requirement)
    const search = window.location.search;
    const fullPath = search ? `${pathname}${search}` : pathname;
    const referrer = document.referrer || null;
    const userId = (session?.user as { id?: string } | undefined)?.id || null;

    // Fire and forget — use sendBeacon for reliability, fallback to fetch
    const payload = JSON.stringify({ path: fullPath, referrer, sessionId, userId });
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/track", blob);
      } else {
        fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
      }
    } catch {
      // ignore tracking errors
    }
  }, [pathname, session]);

  return null;
}
