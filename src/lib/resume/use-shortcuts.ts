"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/lib/resume/store";

/**
 * Global keyboard shortcuts for the editor view.
 * - Ctrl/Cmd+Z       → undo
 * - Ctrl/Cmd+Shift+Z → redo  (also Ctrl+Y)
 * - Ctrl/Cmd+S       → save (triggers the save button click)
 * - Ctrl/Cmd+P       → export PDF (print)
 * - Esc              → back to dashboard (only when no dialog/input focused)
 */
export function useKeyboardShortcuts(opts: {
  onSave: () => void;
  onPrint: () => void;
  onBack: () => void;
  enabled?: boolean;
}) {
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const { onSave, onPrint, onBack, enabled = true } = opts;

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      // Undo / Redo — work even while typing
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }

      // Save — work even while typing
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
        return;
      }

      // Print — work even while typing
      if (mod && e.key.toLowerCase() === "p") {
        e.preventDefault();
        onPrint();
        return;
      }

      // Esc — only when not typing
      if (e.key === "Escape" && !isTyping) {
        onBack();
        return;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, onSave, onPrint, onBack, enabled]);
}
