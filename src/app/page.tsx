"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/resume/use-current-user";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    if (!loading) {
      // All users (logged in or not) land on dashboard which handles unauthenticated state
      router.replace("/dashboard");
    }
  }, [loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6200]" />
        <p className="text-[#888898] text-sm font-mono">Loading Jinzai…</p>
      </div>
    </div>
  );
}
