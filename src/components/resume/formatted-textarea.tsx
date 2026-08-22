"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Sparkles,
  X,
  Type,
} from "lucide-react";

interface FormattedTextareaProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  minHeight?: string;
  label?: string;
  showBulletButton?: boolean;
}

export function FormattedTextarea({
  value,
  onChange,
  placeholder = "Write content here...",
  rows = 3,
  className = "",
  minHeight = "72px",
  label,
  showBulletButton = true,
}: FormattedTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const applyFormatting = (prefix: string, suffix: string = prefix, defaultText = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    let selected = currentVal.substring(start, end);
    let replacement = "";
    let newCursorPos = start;

    if (selected.length > 0) {
      // If already wrapped with prefix/suffix, unwrap it (toggle off)
      if (selected.startsWith(prefix) && selected.endsWith(suffix) && selected.length >= prefix.length + suffix.length) {
        replacement = selected.slice(prefix.length, selected.length - suffix.length);
        newCursorPos = start + replacement.length;
      } else {
        replacement = `${prefix}${selected}${suffix}`;
        newCursorPos = start + replacement.length;
      }
    } else {
      replacement = `${prefix}${defaultText}${suffix}`;
      newCursorPos = start + prefix.length;
    }

    const nextVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    onChange(nextVal);

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        selected.length > 0 ? start : newCursorPos,
        selected.length > 0 ? start + replacement.length : newCursorPos + defaultText.length
      );
    }, 10);
  };

  const insertBullet = (bulletStr = "• ") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const currentVal = textarea.value;

    // If starting on a new line or start of text
    const prevChar = start > 0 ? currentVal[start - 1] : "\n";
    const insertion = prevChar === "\n" || start === 0 ? bulletStr : `\n${bulletStr}`;

    const nextVal = currentVal.substring(0, start) + insertion + currentVal.substring(start);
    onChange(nextVal);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + insertion.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 10);
  };

  return (
    <div className={`w-full rounded-md border transition-all ${
      isFocused ? "border-[#faff69] ring-1 ring-[#faff69]/30" : "border-[#2a2a2a]"
    } bg-[#121212] overflow-hidden`}>
      {/* Formatting Toolbar */}
      <div className="flex items-center justify-between px-2 py-1 bg-[#1a1a1a] border-b border-[#2a2a2a] text-[#888888]">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => applyFormatting("**", "**", "bold text")}
            className="h-6 w-6 rounded flex items-center justify-center hover:bg-[#242424] hover:text-white transition-colors"
            title="Bold (**text**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting("*", "*", "italic text")}
            className="h-6 w-6 rounded flex items-center justify-center hover:bg-[#242424] hover:text-white transition-colors"
            title="Italic (*text*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting("<u>", "</u>", "underlined text")}
            className="h-6 w-6 rounded flex items-center justify-center hover:bg-[#242424] hover:text-white transition-colors"
            title="Underline (<u>text</u>)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3.5 bg-[#2a2a2a] mx-1" />

          {showBulletButton && (
            <button
              type="button"
              onClick={() => insertBullet("• ")}
              className="h-6 w-6 rounded flex items-center justify-center hover:bg-[#242424] hover:text-[#faff69] transition-colors"
              title="Insert Bullet (•)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => insertBullet("1. ")}
            className="h-6 w-6 rounded flex items-center justify-center hover:bg-[#242424] hover:text-[#faff69] transition-colors"
            title="Insert Numbered List (1.)"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormatting("[+", "%]", "35")}
            className="h-6 px-1.5 rounded flex items-center gap-1 text-[10px] font-mono hover:bg-[#242424] hover:text-[#faff69] transition-colors"
            title="Add Metric ([+35%])"
          >
            <Sparkles className="w-3 h-3 text-[#faff69]" />
            <span>Metric</span>
          </button>
        </div>

        {label && (
          <span className="text-[10px] font-mono text-[#666666] uppercase pr-1">
            {label}
          </span>
        )}
      </div>

      {/* Textarea with wrapping */}
      <textarea
        ref={textareaRef}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={rows}
        placeholder={placeholder}
        style={{ minHeight }}
        className={`w-full bg-transparent text-xs text-white p-2.5 outline-none resize-y leading-relaxed break-words whitespace-pre-wrap ${className}`}
      />
    </div>
  );
}
