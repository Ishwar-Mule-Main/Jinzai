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
}

export function useCurrentUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const json = await res.json();
        setUser(json.user);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "loading") return;
    refresh();
  }, [status, refresh]);

  return { user, loading, refresh, isAuthenticated: !!session?.user };
}
