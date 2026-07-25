import type { ResumeData } from "./types";
import { formatDateRange, getActiveSections } from "./sample-data";

export { formatDateRange, getActiveSections };

// Hook to convert hex to rgb
export function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(n, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function shade(hex: string, percent: number) {
  const { r, g, b } = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const nr = Math.round((t - r) * p) + r;
  const ng = Math.round((t - g) * p) + g;
  const nb = Math.round((t - b) * p) + b;
  return `rgb(${nr}, ${ng}, ${nb})`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export const fontClassMap: Record<string, string> = {
  inter: "font-sans",
  poppins: "font-[Poppins]",
  merriweather: "font-[Merriweather]",
  playfair: "font-[Playfair_Display]",
  jetbrains: "font-mono",
};

export function getFontClass(id: string) {
  return fontClassMap[id] || "font-sans";
}

export function contactItems(data: ResumeData) {
  const p = data.personalInfo;
  const items: { label: string; value: string; icon?: string }[] = [];
  if (p.email) items.push({ label: "Email", value: p.email, icon: "mail" });
  if (p.phone) items.push({ label: "Phone", value: p.phone, icon: "phone" });
  if (p.location) items.push({ label: "Location", value: p.location, icon: "map" });
  if (p.website) items.push({ label: "Website", value: p.website, icon: "globe" });
  if (p.linkedin) items.push({ label: "LinkedIn", value: p.linkedin, icon: "linkedin" });
  if (p.github) items.push({ label: "GitHub", value: p.github, icon: "github" });
  return items;
}
