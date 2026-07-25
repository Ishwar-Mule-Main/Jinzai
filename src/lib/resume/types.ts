// Core resume data types shared across editor and templates

import { NEW_TEMPLATE_SPECS, type TemplateSpec } from "./template-specs";

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photo: string; // data URL or empty
  tagline: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate: string;
  credentialId: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  customSections: CustomSection[];
}

export type TemplateId =
  | "modern"
  | "minimal"
  | "creative"
  | "classic"
  | "executive"
  | "tech"
  | "academic"
  | "compact"
  // 44 parameterized templates
  | "azure-sidebar"
  | "crimson-edge"
  | "forest-left"
  | "slate-pro"
  | "rose-narrow"
  | "indigo-night"
  | "amber-bar"
  | "ocean-side"
  | "plum-deep"
  | "steel-gray"
  | "berry-side"
  | "sage-soft"
  | "sunset-banner"
  | "ocean-banner"
  | "midnight-banner"
  | "coral-split"
  | "mint-header"
  | "maroon-banner"
  | "gold-split"
  | "forest-banner"
  | "fuchsia-banner"
  | "charcoal-split"
  | "pure-white"
  | "editorial"
  | "typewriter"
  | "newsletter"
  | "resume-card"
  | "elegant-gray"
  | "classic-pro"
  | "warm-sand"
  | "cool-ice"
  | "bold-black"
  | "chronos"
  | "steps"
  | "dotted-timeline"
  | "vertebra"
  | "marker-pro"
  | "path"
  | "ribbon"
  | "stamp"
  | "bold-stripes"
  | "color-blocks"
  | "hex-accent"
  | "postcard";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  hasPhoto: boolean;
  layout: "single" | "two-column" | "sidebar";
  tags: string[];
  accentDefault: string;
  fontDefault: string;
  preview: {
    header: "centered" | "left" | "sidebar" | "banner";
    style: string;
  };
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description:
      "Two-column layout with a colored sidebar for skills and contact. Photo optional. Balanced and ATS-friendly.",
    hasPhoto: true,
    layout: "two-column",
    tags: ["ATS-friendly", "Two-column", "Photo"],
    accentDefault: "#0f766e",
    fontDefault: "inter",
    preview: { header: "sidebar", style: "Teal sidebar with rounded photo" },
  },
  {
    id: "minimal",
    name: "Minimal",
    description:
      "Single column, generous whitespace, refined typography. No photo. Best for clean, content-first resumes.",
    hasPhoto: false,
    layout: "single",
    tags: ["ATS-friendly", "Single-column", "Minimalist"],
    accentDefault: "#1f2937",
    fontDefault: "inter",
    preview: { header: "left", style: "Thin rules, lots of whitespace" },
  },
  {
    id: "creative",
    name: "Creative",
    description:
      "Bold banner header with photo, colored section markers, and playful accent. Stands out for creative roles.",
    hasPhoto: true,
    layout: "two-column",
    tags: ["Creative", "Two-column", "Photo", "Bold"],
    accentDefault: "#7c3aed",
    fontDefault: "poppins",
    preview: { header: "banner", style: "Purple banner, big initials" },
  },
  {
    id: "classic",
    name: "Classic",
    description:
      "Traditional single-column with serif fonts and centered header. Maximum ATS compatibility. No photo.",
    hasPhoto: false,
    layout: "single",
    tags: ["ATS-friendly", "Single-column", "Serif", "Traditional"],
    accentDefault: "#1e3a5f",
    fontDefault: "merriweather",
    preview: { header: "centered", style: "Centered serif name, rules" },
  },
  {
    id: "executive",
    name: "Executive",
    description:
      "Elegant serif typography with a refined header, optional photo, and accent rules. Suited for senior roles.",
    hasPhoto: true,
    layout: "single",
    tags: ["Executive", "Serif", "Photo", "Elegant"],
    accentDefault: "#92400e",
    fontDefault: "playfair",
    preview: { header: "left", style: "Playfair serif, amber accent" },
  },
  {
    id: "tech",
    name: "Tech / Developer",
    description:
      "Developer-focused with a left sidebar (photo, links, skills), monospace accents, and GitHub prominence.",
    hasPhoto: true,
    layout: "sidebar",
    tags: ["Tech", "Sidebar", "Photo", "Developer"],
    accentDefault: "#0ea5e9",
    fontDefault: "jetbrains",
    preview: { header: "sidebar", style: "Dark sidebar, mono headings" },
  },
  {
    id: "academic",
    name: "Academic / CV",
    description:
      "Publications-first layout for researchers and academics. Numbered sections, serif type, ample margins. No photo.",
    hasPhoto: false,
    layout: "single",
    tags: ["Academic", "CV", "Serif", "Publications"],
    accentDefault: "#1e3a5f",
    fontDefault: "merriweather",
    preview: { header: "centered", style: "Numbered sections, serif, navy" },
  },
  {
    id: "compact",
    name: "Compact",
    description:
      "Dense single-column layout that fits more content per page. Ideal for experienced professionals who need to fit a lot.",
    hasPhoto: false,
    layout: "single",
    tags: ["Dense", "Single-column", "ATS-friendly", "Space-saving"],
    accentDefault: "#be123c",
    fontDefault: "inter",
    preview: { header: "left", style: "Tight spacing, rose accent" },
  },
  // 44 parameterized templates (metadata derived from specs)
  ...NEW_TEMPLATE_SPECS.map((s: TemplateSpec) => ({
    id: s.id as TemplateId,
    name: s.name,
    description: s.description,
    hasPhoto: s.hasPhoto,
    layout: (s.layout === "sidebar-left" || s.layout === "sidebar-right" ? "sidebar" : "single") as "single" | "two-column" | "sidebar",
    tags: s.tags,
    accentDefault: s.accent,
    fontDefault: s.font,
    preview: { header: "left" as const, style: s.headingStyle },
  })),
];

export const FONT_OPTIONS = [
  { id: "inter", label: "Inter (Sans)", className: "font-sans" },
  { id: "poppins", label: "Poppins (Sans)", className: "font-[Poppins]" },
  { id: "merriweather", label: "Merriweather (Serif)", className: "font-[Merriweather]" },
  { id: "playfair", label: "Playfair Display (Serif)", className: "font-[Playfair_Display]" },
  { id: "jetbrains", label: "JetBrains Mono (Mono)", className: "font-mono" },
];

export const ACCENT_PRESETS = [
  "#0f766e", // teal
  "#1f2937", // slate
  "#7c3aed", // violet
  "#1e3a5f", // navy
  "#92400e", // amber
  "#0ea5e9", // sky
  "#dc2626", // red
  "#db2777", // pink
  "#059669", // emerald
  "#475569", // gray
];
