"use client";

import { ResumeApp } from "@/components/resume/resume-app";
import { useResumeStore } from "@/lib/resume/store";
import { useEffect, useState } from "react";

export default function Home() {
  // Zustand persist hydrates from localStorage on the client only.
  // We subscribe to hydration so the first paint matches SSR (default state).
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const markHydrated = () => setHydrated(true);
    const unsub = useResumeStore.persist.onFinishHydration(markHydrated);
    // Defer the synchronous check so setState is not called directly in the effect body
    if (useResumeStore.persist.hasHydrated()) {
      const id = setTimeout(markHydrated, 0);
      return () => {
        clearTimeout(id);
        unsub();
      };
    }
    return () => unsub();
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-sm">Loading ResumeForge…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ResumeApp />
    </div>
  );
}
