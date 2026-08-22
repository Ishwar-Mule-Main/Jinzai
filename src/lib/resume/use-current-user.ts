"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  planExpiresAt: string | null;
  resumeCount: number;
  role?: string;
  organization?: { name?: string } | null;
}

export function useCurrentUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = useCallback(async () => {
    // Force a re-check by incrementing trigger
    setRefreshTrigger((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const doFetch = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) {
            setUser(json.user);
          }
        } else {
          if (!cancelled) setUser(null);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // Always fetch /api/me on mount, session change, or refresh trigger
    if (status !== "loading") {
      doFetch();
    }

    return () => { cancelled = true; };
  }, [status, session, refreshTrigger]);

  return { user, loading, refresh, isAuthenticated: !!session?.user };
}
