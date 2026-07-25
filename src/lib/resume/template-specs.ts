// Parameterized template specification — drives the ParameterizedTemplate engine
// Note: id is `string` here to avoid a circular import with types.ts (which imports these specs).
export interface TemplateSpec {
  id: string;
  name: string;
  description: string;
  hasPhoto: boolean;
  layout: "single" | "sidebar-left" | "sidebar-right" | "header-banner" | "split-header";
  headerStyle: "centered" | "left" | "banner" | "minimal" | "sidebar";
  headingStyle: "underline" | "rule" | "numbered" | "pill" | "bar" | "uppercase" | "centered" | "boxed";
  bulletStyle: "dot" | "dash" | "arrow" | "diamond" | "check" | "none";
  colorTreatment: "accent-rules" | "solid-sidebar" | "gradient-header" | "two-tone" | "minimal" | "dark-sidebar";
  density: "compact" | "normal" | "spacious";
  font: "inter" | "poppins" | "merriweather" | "playfair" | "jetbrains";
  accent: string;
  accent2?: string;
  tags: string[];
}

// 44 new parameterized templates — each visually distinct.
// Combined with the 8 hand-crafted templates, total = 52.
export const NEW_TEMPLATE_SPECS: TemplateSpec[] = [
  // ---------- Sidebar family ----------
  {
    id: "azure-sidebar", name: "Azure Sidebar", description: "Sky-blue left sidebar with contact and skills. Clean and modern.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "underline", bulletStyle: "dot", colorTreatment: "solid-sidebar", density: "normal", font: "inter", accent: "#0ea5e9", tags: ["Sidebar", "Modern", "Photo"],
  },
  {
    id: "crimson-edge", name: "Crimson Edge", description: "Bold rose sidebar on the right. Energetic and distinctive.", hasPhoto: true,
    layout: "sidebar-right", headerStyle: "sidebar", headingStyle: "bar", bulletStyle: "arrow", colorTreatment: "solid-sidebar", density: "normal", font: "inter", accent: "#e11d48", tags: ["Sidebar", "Bold", "Photo"],
  },
  {
    id: "forest-left", name: "Forest Left", description: "Emerald sidebar with numbered serif sections. Natural and refined.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "numbered", bulletStyle: "dash", colorTreatment: "solid-sidebar", density: "spacious", font: "merriweather", accent: "#166534", tags: ["Sidebar", "Serif", "Photo"],
  },
  {
    id: "slate-pro", name: "Slate Pro", description: "Compact gray sidebar for a no-nonsense professional look.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "uppercase", bulletStyle: "dot", colorTreatment: "solid-sidebar", density: "compact", font: "inter", accent: "#475569", tags: ["Sidebar", "Compact", "ATS"],
  },
  {
    id: "rose-narrow", name: "Rose Narrow", description: "Slim pink sidebar with pill-style headings. Soft and friendly.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "pill", bulletStyle: "dot", colorTreatment: "solid-sidebar", density: "normal", font: "poppins", accent: "#db2777", tags: ["Sidebar", "Soft", "Photo"],
  },
  {
    id: "indigo-night", name: "Indigo Night", description: "Dark indigo sidebar with boxed headings. Deep and sophisticated.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "boxed", bulletStyle: "diamond", colorTreatment: "dark-sidebar", density: "normal", font: "inter", accent: "#4f46e5", tags: ["Sidebar", "Dark", "Photo"],
  },
  {
    id: "amber-bar", name: "Amber Bar", description: "Amber sidebar with bar-style section markers. Warm and structured.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "bar", bulletStyle: "dash", colorTreatment: "solid-sidebar", density: "normal", font: "poppins", accent: "#d97706", tags: ["Sidebar", "Warm", "Photo"],
  },
  {
    id: "ocean-side", name: "Ocean Side", description: "Cyan sidebar with underlined headings. Fresh and breezy.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "underline", bulletStyle: "dot", colorTreatment: "solid-sidebar", density: "normal", font: "inter", accent: "#0891b2", tags: ["Sidebar", "Fresh", "Photo"],
  },
  {
    id: "plum-deep", name: "Plum Deep", description: "Dark plum sidebar with numbered Playfair sections. Luxurious.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "numbered", bulletStyle: "diamond", colorTreatment: "dark-sidebar", density: "spacious", font: "playfair", accent: "#86198f", tags: ["Sidebar", "Dark", "Serif"],
  },
  {
    id: "steel-gray", name: "Steel Gray", description: "Right-side steel sidebar, compact and efficient.", hasPhoto: true,
    layout: "sidebar-right", headerStyle: "sidebar", headingStyle: "rule", bulletStyle: "dot", colorTreatment: "solid-sidebar", density: "compact", font: "inter", accent: "#64748b", tags: ["Sidebar", "Compact", "ATS"],
  },
  {
    id: "berry-side", name: "Berry Side", description: "Berry-purple sidebar with pill headings. Modern and vibrant.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "pill", bulletStyle: "check", colorTreatment: "solid-sidebar", density: "normal", font: "poppins", accent: "#be185d", tags: ["Sidebar", "Vibrant", "Photo"],
  },
  {
    id: "sage-soft", name: "Sage Soft", description: "Soft sage sidebar with serif headings. Calm and elegant.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "underline", bulletStyle: "dash", colorTreatment: "solid-sidebar", density: "spacious", font: "merriweather", accent: "#65a30d", tags: ["Sidebar", "Serif", "Calm"],
  },

  // ---------- Banner / split-header family ----------
  {
    id: "sunset-banner", name: "Sunset Banner", description: "Orange-to-pink gradient banner header. Eye-catching and creative.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "underline", bulletStyle: "arrow", colorTreatment: "gradient-header", density: "normal", font: "poppins", accent: "#ea580c", accent2: "#db2777", tags: ["Banner", "Gradient", "Photo"],
  },
  {
    id: "ocean-banner", name: "Ocean Banner", description: "Blue-to-teal gradient banner. Fresh and professional.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "rule", bulletStyle: "dot", colorTreatment: "gradient-header", density: "normal", font: "inter", accent: "#2563eb", accent2: "#0891b2", tags: ["Banner", "Gradient", "Photo"],
  },
  {
    id: "midnight-banner", name: "Midnight Banner", description: "Dark gradient banner with boxed headings. Bold and modern.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "boxed", bulletStyle: "diamond", colorTreatment: "gradient-header", density: "normal", font: "inter", accent: "#1e293b", accent2: "#0f172a", tags: ["Banner", "Dark", "Photo"],
  },
  {
    id: "coral-split", name: "Coral Split", description: "Coral split-header with name left, contact right. Balanced.", hasPhoto: false,
    layout: "split-header", headerStyle: "left", headingStyle: "bar", bulletStyle: "arrow", colorTreatment: "accent-rules", density: "normal", font: "poppins", accent: "#fb7185", tags: ["Split", "Modern", "ATS"],
  },
  {
    id: "mint-header", name: "Mint Header", description: "Mint-green banner with underlined sections. Clean and fresh.", hasPhoto: false,
    layout: "header-banner", headerStyle: "banner", headingStyle: "underline", bulletStyle: "dot", colorTreatment: "gradient-header", density: "normal", font: "inter", accent: "#10b981", accent2: "#34d399", tags: ["Banner", "Fresh", "ATS"],
  },
  {
    id: "maroon-banner", name: "Maroon Banner", description: "Maroon banner with centered serif headings. Traditional and rich.", hasPhoto: false,
    layout: "header-banner", headerStyle: "banner", headingStyle: "centered", bulletStyle: "diamond", colorTreatment: "solid-sidebar", density: "spacious", font: "playfair", accent: "#7f1d1d", tags: ["Banner", "Serif", "Traditional"],
  },
  {
    id: "gold-split", name: "Gold Split", description: "Gold split-header with rule-style headings. Elegant and premium.", hasPhoto: false,
    layout: "split-header", headerStyle: "left", headingStyle: "rule", bulletStyle: "dash", colorTreatment: "accent-rules", density: "spacious", font: "merriweather", accent: "#b45309", tags: ["Split", "Serif", "Elegant"],
  },
  {
    id: "forest-banner", name: "Forest Banner", description: "Forest-green banner with pill headings. Natural and bold.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "pill", bulletStyle: "check", colorTreatment: "gradient-header", density: "normal", font: "inter", accent: "#166534", accent2: "#15803d", tags: ["Banner", "Green", "Photo"],
  },
  {
    id: "fuchsia-banner", name: "Fuchsia Banner", description: "Fuchsia gradient banner with uppercase headings. Vibrant and creative.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "uppercase", bulletStyle: "arrow", colorTreatment: "gradient-header", density: "normal", font: "poppins", accent: "#c026d3", accent2: "#a21caf", tags: ["Banner", "Vibrant", "Photo"],
  },
  {
    id: "charcoal-split", name: "Charcoal Split", description: "Charcoal split-header with bar markers. Minimal and sharp.", hasPhoto: false,
    layout: "split-header", headerStyle: "left", headingStyle: "bar", bulletStyle: "dot", colorTreatment: "minimal", density: "compact", font: "inter", accent: "#1f2937", tags: ["Split", "Minimal", "ATS"],
  },

  // ---------- Single column / editorial family ----------
  {
    id: "pure-white", name: "Pure White", description: "No color — just black text and thin rules. Maximum ATS safety.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "rule", bulletStyle: "dash", colorTreatment: "minimal", density: "spacious", font: "inter", accent: "#1f2937", tags: ["Minimal", "ATS", "Single"],
  },
  {
    id: "editorial", name: "Editorial", description: "Large serif name, justified text, generous margins. Magazine-style.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "centered", bulletStyle: "none", colorTreatment: "accent-rules", density: "spacious", font: "merriweather", accent: "#1e3a5f", tags: ["Editorial", "Serif", "Elegant"],
  },
  {
    id: "typewriter", name: "Typewriter", description: "Monospace font with uppercase headings. Retro and distinctive.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "uppercase", bulletStyle: "dash", colorTreatment: "minimal", density: "normal", font: "jetbrains", accent: "#374151", tags: ["Mono", "Retro", "Single"],
  },
  {
    id: "newsletter", name: "Newsletter", description: "Serif two-tone with rule dividers. Classic newsletter feel.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "rule", bulletStyle: "dot", colorTreatment: "two-tone", density: "normal", font: "merriweather", accent: "#7c2d12", accent2: "#1e3a5f", tags: ["Serif", "Classic", "Two-tone"],
  },
  {
    id: "resume-card", name: "Resume Card", description: "Centered Playfair card with bordered frame. Formal and elegant.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "centered", bulletStyle: "diamond", colorTreatment: "accent-rules", density: "spacious", font: "playfair", accent: "#92400e", tags: ["Card", "Serif", "Elegant"],
  },
  {
    id: "elegant-gray", name: "Elegant Gray", description: "Slate accents, spacious serif layout. Understated luxury.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "rule", bulletStyle: "dash", colorTreatment: "minimal", density: "spacious", font: "merriweather", accent: "#475569", tags: ["Minimal", "Serif", "Spacious"],
  },
  {
    id: "classic-pro", name: "Classic Pro", description: "Navy accent rules with centered serif header. Timeless.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "underline", bulletStyle: "dot", colorTreatment: "accent-rules", density: "normal", font: "merriweather", accent: "#1e3a5f", tags: ["Classic", "Serif", "ATS"],
  },
  {
    id: "warm-sand", name: "Warm Sand", description: "Stone accent with Poppins font. Warm and approachable.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "underline", bulletStyle: "dash", colorTreatment: "accent-rules", density: "normal", font: "poppins", accent: "#78716c", tags: ["Warm", "Modern", "Single"],
  },
  {
    id: "cool-ice", name: "Cool Ice", description: "Sky accent, spacious minimal layout. Cool and clean.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "rule", bulletStyle: "dot", colorTreatment: "minimal", density: "spacious", font: "inter", accent: "#0ea5e9", tags: ["Minimal", "Cool", "Spacious"],
  },
  {
    id: "bold-black", name: "Bold Black", description: "Charcoal uppercase headings. Strong and assertive.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "uppercase", bulletStyle: "arrow", colorTreatment: "accent-rules", density: "compact", font: "inter", accent: "#111827", tags: ["Bold", "Compact", "ATS"],
  },

  // ---------- Numbered / timeline family ----------
  {
    id: "chronos", name: "Chronos", description: "Navy numbered timeline with serif type. Chronological elegance.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "numbered", bulletStyle: "dash", colorTreatment: "accent-rules", density: "spacious", font: "merriweather", accent: "#1e3a5f", tags: ["Numbered", "Serif", "Timeline"],
  },
  {
    id: "steps", name: "Steps", description: "Teal step-numbered sections. Clear and structured.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "numbered", bulletStyle: "dot", colorTreatment: "accent-rules", density: "normal", font: "inter", accent: "#0f766e", tags: ["Numbered", "Modern", "Structured"],
  },
  {
    id: "dotted-timeline", name: "Dotted Timeline", description: "Rose dotted-border timeline for experience. Distinctive.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "bar", bulletStyle: "arrow", colorTreatment: "accent-rules", density: "normal", font: "inter", accent: "#e11d48", tags: ["Timeline", "Modern", "Creative"],
  },
  {
    id: "vertebra", name: "Vertebra", description: "Indigo vertical line with dot markers. Structured and modern.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "bar", bulletStyle: "dot", colorTreatment: "accent-rules", density: "normal", font: "inter", accent: "#4f46e5", tags: ["Timeline", "Modern", "Structured"],
  },
  {
    id: "marker-pro", name: "Marker Pro", description: "Amber numbered markers with Poppins. Friendly and clear.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "numbered", bulletStyle: "check", colorTreatment: "accent-rules", density: "normal", font: "poppins", accent: "#d97706", tags: ["Numbered", "Friendly", "Modern"],
  },
  {
    id: "path", name: "Path", description: "Emerald numbered path with dots. Growth-oriented and clean.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "numbered", bulletStyle: "dash", colorTreatment: "accent-rules", density: "normal", font: "inter", accent: "#059669", tags: ["Numbered", "Clean", "Modern"],
  },

  // ---------- Creative / boxed family ----------
  {
    id: "ribbon", name: "Ribbon", description: "Violet ribbon-style section headers. Playful and creative.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "boxed", bulletStyle: "arrow", colorTreatment: "accent-rules", density: "normal", font: "poppins", accent: "#7c3aed", tags: ["Creative", "Boxed", "Modern"],
  },
  {
    id: "stamp", name: "Stamp", description: "Brown boxed section stamps with serif type. Vintage and distinctive.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "boxed", bulletStyle: "diamond", colorTreatment: "accent-rules", density: "spacious", font: "merriweather", accent: "#92400e", tags: ["Boxed", "Vintage", "Serif"],
  },
  {
    id: "bold-stripes", name: "Bold Stripes", description: "Teal alternating section backgrounds. Bold and scannable.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "pill", bulletStyle: "dot", colorTreatment: "two-tone", density: "compact", font: "inter", accent: "#0f766e", accent2: "#ccfbf1", tags: ["Bold", "Stripes", "Modern"],
  },
  {
    id: "color-blocks", name: "Color Blocks", description: "Fuchsia colored category blocks. Vibrant and organized.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "pill", bulletStyle: "check", colorTreatment: "solid-sidebar", density: "normal", font: "poppins", accent: "#c026d3", tags: ["Sidebar", "Vibrant", "Photo"],
  },
  {
    id: "hex-accent", name: "Hex Accent", description: "Sky accent with bar markers. Tech-adjacent and clean.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "bar", bulletStyle: "arrow", colorTreatment: "accent-rules", density: "normal", font: "inter", accent: "#0284c7", tags: ["Modern", "Clean", "ATS"],
  },
  {
    id: "postcard", name: "Postcard", description: "Coral bordered card style with Playfair. Charming and formal.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "centered", bulletStyle: "diamond", colorTreatment: "accent-rules", density: "spacious", font: "playfair", accent: "#fb7185", tags: ["Card", "Serif", "Elegant"],
  },
];

export const SPEC_MAP: Record<string, TemplateSpec> = Object.fromEntries(
  NEW_TEMPLATE_SPECS.map((s) => [s.id, s])
);
