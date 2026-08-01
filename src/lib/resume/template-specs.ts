// Parameterized template specification — drives the ParameterizedTemplate engine
// Note: id is `string` here to avoid a circular import with types.ts (which imports these specs).

export type VisualArchetype =
  | "sidebar-modern"
  | "banner-gradient"
  | "timeline"
  | "editorial"
  | "card-blocks"
  | "tech-terminal"
  | "dark-executive"
  | "minimal-swiss";

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
  font: string;
  accent: string;
  accent2?: string;
  tags: string[];
  visualArchetype: VisualArchetype;
}

// 70 parameterized templates — each mapped to a visually distinct archetype layout.
export const NEW_TEMPLATE_SPECS: TemplateSpec[] = [
  // ---------- Sidebar family ----------
  {
    id: "azure-sidebar", name: "Azure Sidebar", description: "Sky-blue left sidebar with contact and skills. Clean and modern.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "underline", bulletStyle: "dot", colorTreatment: "solid-sidebar", density: "normal", font: "inter", accent: "#0ea5e9", tags: ["Sidebar", "Modern", "Photo"], visualArchetype: "sidebar-modern",
  },
  {
    id: "crimson-edge", name: "Crimson Edge", description: "Bold rose sidebar on the right. Energetic and distinctive.", hasPhoto: true,
    layout: "sidebar-right", headerStyle: "sidebar", headingStyle: "bar", bulletStyle: "arrow", colorTreatment: "solid-sidebar", density: "normal", font: "inter", accent: "#e11d48", tags: ["Sidebar", "Bold", "Photo"], visualArchetype: "sidebar-modern",
  },
  {
    id: "forest-left", name: "Forest Left", description: "Emerald sidebar with numbered serif sections. Natural and refined.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "numbered", bulletStyle: "dash", colorTreatment: "solid-sidebar", density: "spacious", font: "merriweather", accent: "#166534", tags: ["Sidebar", "Serif", "Photo"], visualArchetype: "sidebar-modern",
  },
  {
    id: "slate-pro", name: "Slate Pro", description: "Compact gray sidebar for a no-nonsense professional look.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "uppercase", bulletStyle: "dot", colorTreatment: "solid-sidebar", density: "compact", font: "inter", accent: "#475569", tags: ["Sidebar", "Compact", "ATS"], visualArchetype: "sidebar-modern",
  },
  {
    id: "rose-narrow", name: "Rose Narrow", description: "Slim pink sidebar with pill-style headings. Soft and friendly.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "pill", bulletStyle: "dot", colorTreatment: "solid-sidebar", density: "normal", font: "poppins", accent: "#db2777", tags: ["Sidebar", "Soft", "Photo"], visualArchetype: "sidebar-modern",
  },
  {
    id: "indigo-night", name: "Indigo Night", description: "Dark indigo sidebar with boxed headings. Deep and sophisticated.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "boxed", bulletStyle: "diamond", colorTreatment: "dark-sidebar", density: "normal", font: "inter", accent: "#4f46e5", tags: ["Sidebar", "Dark", "Photo"], visualArchetype: "dark-executive",
  },
  {
    id: "amber-bar", name: "Amber Bar", description: "Amber sidebar with bar-style section markers. Warm and structured.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "bar", bulletStyle: "dash", colorTreatment: "solid-sidebar", density: "normal", font: "poppins", accent: "#d97706", tags: ["Sidebar", "Warm", "Photo"], visualArchetype: "sidebar-modern",
  },
  {
    id: "ocean-side", name: "Ocean Side", description: "Cyan sidebar with underlined headings. Fresh and breezy.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "underline", bulletStyle: "dot", colorTreatment: "solid-sidebar", density: "normal", font: "inter", accent: "#0891b2", tags: ["Sidebar", "Fresh", "Photo"], visualArchetype: "sidebar-modern",
  },
  {
    id: "plum-deep", name: "Plum Deep", description: "Dark plum sidebar with numbered Playfair sections. Luxurious.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "numbered", bulletStyle: "diamond", colorTreatment: "dark-sidebar", density: "spacious", font: "playfair", accent: "#86198f", tags: ["Sidebar", "Dark", "Serif"], visualArchetype: "dark-executive",
  },
  {
    id: "steel-gray", name: "Steel Gray", description: "Right-side steel sidebar, compact and efficient.", hasPhoto: true,
    layout: "sidebar-right", headerStyle: "sidebar", headingStyle: "rule", bulletStyle: "dot", colorTreatment: "solid-sidebar", density: "compact", font: "inter", accent: "#64748b", tags: ["Sidebar", "Compact", "ATS"], visualArchetype: "sidebar-modern",
  },
  {
    id: "berry-side", name: "Berry Side", description: "Berry-purple sidebar with pill headings. Modern and vibrant.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "pill", bulletStyle: "check", colorTreatment: "solid-sidebar", density: "normal", font: "poppins", accent: "#be185d", tags: ["Sidebar", "Vibrant", "Photo"], visualArchetype: "sidebar-modern",
  },
  {
    id: "sage-soft", name: "Sage Soft", description: "Soft sage sidebar with serif headings. Calm and elegant.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "underline", bulletStyle: "dash", colorTreatment: "solid-sidebar", density: "spacious", font: "merriweather", accent: "#65a30d", tags: ["Sidebar", "Serif", "Calm"], visualArchetype: "sidebar-modern",
  },

  // ---------- Banner / split-header family ----------
  {
    id: "sunset-banner", name: "Sunset Banner", description: "Orange-to-pink gradient banner header. Eye-catching and creative.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "underline", bulletStyle: "arrow", colorTreatment: "gradient-header", density: "normal", font: "poppins", accent: "#ea580c", accent2: "#db2777", tags: ["Banner", "Gradient", "Photo"], visualArchetype: "banner-gradient",
  },
  {
    id: "ocean-banner", name: "Ocean Banner", description: "Blue-to-teal gradient banner. Fresh and professional.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "rule", bulletStyle: "dot", colorTreatment: "gradient-header", density: "normal", font: "inter", accent: "#2563eb", accent2: "#0891b2", tags: ["Banner", "Gradient", "Photo"], visualArchetype: "banner-gradient",
  },
  {
    id: "midnight-banner", name: "Midnight Banner", description: "Dark gradient banner with boxed headings. Bold and modern.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "boxed", bulletStyle: "diamond", colorTreatment: "gradient-header", density: "normal", font: "inter", accent: "#1e293b", accent2: "#0f172a", tags: ["Banner", "Dark", "Photo"], visualArchetype: "dark-executive",
  },
  {
    id: "coral-split", name: "Coral Split", description: "Coral split-header with name left, contact right. Balanced.", hasPhoto: false,
    layout: "split-header", headerStyle: "left", headingStyle: "bar", bulletStyle: "arrow", colorTreatment: "accent-rules", density: "normal", font: "poppins", accent: "#fb7185", tags: ["Split", "Modern", "ATS"], visualArchetype: "minimal-swiss",
  },
  {
    id: "mint-header", name: "Mint Header", description: "Mint-green banner with underlined sections. Clean and fresh.", hasPhoto: false,
    layout: "header-banner", headerStyle: "banner", headingStyle: "underline", bulletStyle: "dot", colorTreatment: "gradient-header", density: "normal", font: "inter", accent: "#10b981", accent2: "#34d399", tags: ["Banner", "Fresh", "ATS"], visualArchetype: "banner-gradient",
  },
  {
    id: "maroon-banner", name: "Maroon Banner", description: "Maroon banner with centered serif headings. Traditional and rich.", hasPhoto: false,
    layout: "header-banner", headerStyle: "banner", headingStyle: "centered", bulletStyle: "diamond", colorTreatment: "solid-sidebar", density: "spacious", font: "playfair", accent: "#7f1d1d", tags: ["Banner", "Serif", "Traditional"], visualArchetype: "editorial",
  },
  {
    id: "gold-split", name: "Gold Split", description: "Gold split-header with rule-style headings. Elegant and premium.", hasPhoto: false,
    layout: "split-header", headerStyle: "left", headingStyle: "rule", bulletStyle: "dash", colorTreatment: "accent-rules", density: "spacious", font: "merriweather", accent: "#b45309", tags: ["Split", "Serif", "Elegant"], visualArchetype: "minimal-swiss",
  },
  {
    id: "forest-banner", name: "Forest Banner", description: "Forest-green banner with pill headings. Natural and bold.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "pill", bulletStyle: "check", colorTreatment: "gradient-header", density: "normal", font: "inter", accent: "#166534", accent2: "#15803d", tags: ["Banner", "Green", "Photo"], visualArchetype: "banner-gradient",
  },
  {
    id: "fuchsia-banner", name: "Fuchsia Banner", description: "Fuchsia gradient banner with uppercase headings. Vibrant and creative.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "uppercase", bulletStyle: "arrow", colorTreatment: "gradient-header", density: "normal", font: "poppins", accent: "#c026d3", accent2: "#a21caf", tags: ["Banner", "Vibrant", "Photo"], visualArchetype: "card-blocks",
  },
  {
    id: "charcoal-split", name: "Charcoal Split", description: "Charcoal split-header with bar markers. Minimal and sharp.", hasPhoto: false,
    layout: "split-header", headerStyle: "left", headingStyle: "bar", bulletStyle: "dot", colorTreatment: "minimal", density: "compact", font: "inter", accent: "#1f2937", tags: ["Split", "Minimal", "ATS"], visualArchetype: "minimal-swiss",
  },

  // ---------- Single column / editorial family ----------
  {
    id: "pure-white", name: "Pure White", description: "No color — just black text and thin rules. Maximum ATS safety.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "rule", bulletStyle: "dash", colorTreatment: "minimal", density: "spacious", font: "inter", accent: "#1f2937", tags: ["Minimal", "ATS", "Single"], visualArchetype: "minimal-swiss",
  },
  {
    id: "editorial", name: "Editorial", description: "Large serif name, justified text, generous margins. Magazine-style.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "centered", bulletStyle: "none", colorTreatment: "accent-rules", density: "spacious", font: "merriweather", accent: "#1e3a5f", tags: ["Editorial", "Serif", "Elegant"], visualArchetype: "editorial",
  },
  {
    id: "typewriter", name: "Typewriter", description: "Monospace font with uppercase headings. Retro and distinctive.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "uppercase", bulletStyle: "dash", colorTreatment: "minimal", density: "normal", font: "jetbrains", accent: "#374151", tags: ["Mono", "Retro", "Single"], visualArchetype: "tech-terminal",
  },
  {
    id: "newsletter", name: "Newsletter", description: "Serif two-tone with rule dividers. Classic newsletter feel.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "rule", bulletStyle: "dot", colorTreatment: "two-tone", density: "normal", font: "merriweather", accent: "#7c2d12", accent2: "#1e3a5f", tags: ["Serif", "Classic", "Two-tone"], visualArchetype: "editorial",
  },
  {
    id: "resume-card", name: "Resume Card", description: "Centered Playfair card with bordered frame. Formal and elegant.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "centered", bulletStyle: "diamond", colorTreatment: "accent-rules", density: "spacious", font: "playfair", accent: "#92400e", tags: ["Card", "Serif", "Elegant"], visualArchetype: "editorial",
  },
  {
    id: "elegant-gray", name: "Elegant Gray", description: "Slate accents, spacious serif layout. Understated luxury.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "rule", bulletStyle: "dash", colorTreatment: "minimal", density: "spacious", font: "merriweather", accent: "#475569", tags: ["Minimal", "Serif", "Spacious"], visualArchetype: "editorial",
  },
  {
    id: "classic-pro", name: "Classic Pro", description: "Navy accent rules with centered serif header. Timeless.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "underline", bulletStyle: "dot", colorTreatment: "accent-rules", density: "normal", font: "merriweather", accent: "#1e3a5f", tags: ["Classic", "Serif", "ATS"], visualArchetype: "minimal-swiss",
  },
  {
    id: "warm-sand", name: "Warm Sand", description: "Stone accent with Poppins font. Warm and approachable.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "underline", bulletStyle: "dash", colorTreatment: "accent-rules", density: "normal", font: "poppins", accent: "#78716c", tags: ["Warm", "Modern", "Single"], visualArchetype: "minimal-swiss",
  },
  {
    id: "cool-ice", name: "Cool Ice", description: "Sky accent, spacious minimal layout. Cool and clean.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "rule", bulletStyle: "dot", colorTreatment: "minimal", density: "spacious", font: "inter", accent: "#0ea5e9", tags: ["Minimal", "Cool", "Spacious"], visualArchetype: "minimal-swiss",
  },
  {
    id: "bold-black", name: "Bold Black", description: "Charcoal uppercase headings. Strong and assertive.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "uppercase", bulletStyle: "arrow", colorTreatment: "accent-rules", density: "compact", font: "inter", accent: "#111827", tags: ["Bold", "Compact", "ATS"], visualArchetype: "minimal-swiss",
  },

  // ---------- Numbered / timeline family ----------
  {
    id: "chronos", name: "Chronos", description: "Navy numbered timeline with serif type. Chronological elegance.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "numbered", bulletStyle: "dash", colorTreatment: "accent-rules", density: "spacious", font: "merriweather", accent: "#1e3a5f", tags: ["Numbered", "Serif", "Timeline"], visualArchetype: "timeline",
  },
  {
    id: "steps", name: "Steps", description: "Teal step-numbered sections. Clear and structured.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "numbered", bulletStyle: "dot", colorTreatment: "accent-rules", density: "normal", font: "inter", accent: "#0f766e", tags: ["Numbered", "Modern", "Structured"], visualArchetype: "timeline",
  },
  {
    id: "dotted-timeline", name: "Dotted Timeline", description: "Rose dotted-border timeline for experience. Distinctive.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "bar", bulletStyle: "arrow", colorTreatment: "accent-rules", density: "normal", font: "inter", accent: "#e11d48", tags: ["Timeline", "Modern", "Creative"], visualArchetype: "timeline",
  },
  {
    id: "vertebra", name: "Vertebra", description: "Indigo vertical line with dot markers. Structured and modern.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "bar", bulletStyle: "dot", colorTreatment: "accent-rules", density: "normal", font: "inter", accent: "#4f46e5", tags: ["Timeline", "Modern", "Structured"], visualArchetype: "timeline",
  },
  {
    id: "marker-pro", name: "Marker Pro", description: "Amber numbered markers with Poppins. Friendly and clear.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "numbered", bulletStyle: "check", colorTreatment: "accent-rules", density: "normal", font: "poppins", accent: "#d97706", tags: ["Numbered", "Friendly", "Modern"], visualArchetype: "timeline",
  },
  {
    id: "path", name: "Path", description: "Emerald numbered path with dots. Growth-oriented and clean.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "numbered", bulletStyle: "dash", colorTreatment: "accent-rules", density: "normal", font: "inter", accent: "#059669", tags: ["Numbered", "Clean", "Modern"], visualArchetype: "timeline",
  },

  // ---------- Creative / boxed family ----------
  {
    id: "ribbon", name: "Ribbon", description: "Violet ribbon-style section headers. Playful and creative.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "boxed", bulletStyle: "arrow", colorTreatment: "accent-rules", density: "normal", font: "poppins", accent: "#7c3aed", tags: ["Creative", "Boxed", "Modern"], visualArchetype: "editorial",
  },
  {
    id: "stamp", name: "Stamp", description: "Brown boxed section stamps with serif type. Vintage and distinctive.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "boxed", bulletStyle: "diamond", colorTreatment: "accent-rules", density: "spacious", font: "merriweather", accent: "#92400e", tags: ["Boxed", "Vintage", "Serif"], visualArchetype: "editorial",
  },
  {
    id: "bold-stripes", name: "Bold Stripes", description: "Teal alternating section backgrounds. Bold and scannable.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "pill", bulletStyle: "dot", colorTreatment: "two-tone", density: "compact", font: "inter", accent: "#0f766e", accent2: "#ccfbf1", tags: ["Bold", "Stripes", "Modern"], visualArchetype: "card-blocks",
  },
  {
    id: "color-blocks", name: "Color Blocks", description: "Fuchsia colored category blocks. Vibrant and organized.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "pill", bulletStyle: "check", colorTreatment: "solid-sidebar", density: "normal", font: "poppins", accent: "#c026d3", tags: ["Sidebar", "Vibrant", "Photo"], visualArchetype: "card-blocks",
  },
  {
    id: "hex-accent", name: "Hex Accent", description: "Sky accent with bar markers. Tech-adjacent and clean.", hasPhoto: false,
    layout: "single", headerStyle: "left", headingStyle: "bar", bulletStyle: "arrow", colorTreatment: "accent-rules", density: "normal", font: "inter", accent: "#0284c7", tags: ["Modern", "Clean", "ATS"], visualArchetype: "tech-terminal",
  },
  {
    id: "postcard", name: "Postcard", description: "Coral bordered card style with Playfair. Charming and formal.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "centered", bulletStyle: "diamond", colorTreatment: "accent-rules", density: "spacious", font: "playfair", accent: "#fb7185", tags: ["Card", "Serif", "Elegant"], visualArchetype: "editorial",
  },

  // ---------- 20 Advanced Premium Templates ----------
  {
    id: "aurora-pro", name: "Aurora Pro", description: "Gradient sidebar with glassmorphism effect. Ultra-modern and premium.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "pill", bulletStyle: "arrow", colorTreatment: "gradient-header", density: "normal", font: "plus-jakarta", accent: "#6366f1", accent2: "#a855f7", tags: ["Premium", "Sidebar", "Gradient", "Photo"], visualArchetype: "banner-gradient",
  },
  {
    id: "midnight-exec", name: "Midnight Executive", description: "Dark sidebar with gold accents. Luxury executive design.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "bar", bulletStyle: "diamond", colorTreatment: "dark-sidebar", density: "spacious", font: "playfair", accent: "#d4af37", tags: ["Premium", "Dark", "Gold", "Executive"], visualArchetype: "dark-executive",
  },
  {
    id: "corporate-elite", name: "Corporate Elite", description: "Navy banner with boxed sections. Boardroom-ready corporate design.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "boxed", bulletStyle: "check", colorTreatment: "gradient-header", density: "normal", font: "montserrat", accent: "#1e3a8a", accent2: "#3b82f6", tags: ["Premium", "Corporate", "Banner", "Photo"], visualArchetype: "card-blocks",
  },
  {
    id: "sapphire-glow", name: "Sapphire Glow", description: "Sapphire-blue gradient header with glow effects. Tech-forward and bold.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "pill", bulletStyle: "arrow", colorTreatment: "gradient-header", density: "normal", font: "space-grotesk", accent: "#2563eb", accent2: "#06b6d4", tags: ["Premium", "Gradient", "Tech", "Photo"], visualArchetype: "banner-gradient",
  },
  {
    id: "ivory-tower", name: "Ivory Tower", description: "Academic-grade with Lora serif, numbered sections, and ivory background.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "numbered", bulletStyle: "dash", colorTreatment: "accent-rules", density: "spacious", font: "lora", accent: "#7c3aed", tags: ["Premium", "Academic", "Serif", "Numbered"], visualArchetype: "editorial",
  },
  {
    id: "crimson-impact", name: "Crimson Impact", description: "Bold crimson sidebar with white text. High-impact and assertive.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "uppercase", bulletStyle: "arrow", colorTreatment: "solid-sidebar", density: "compact", font: "montserrat", accent: "#dc2626", tags: ["Premium", "Sidebar", "Bold", "Photo"], visualArchetype: "dark-executive",
  },
  {
    id: "emerald-luxe", name: "Emerald Luxe", description: "Emerald green sidebar with Manrope font. Sophisticated and calm.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "underline", bulletStyle: "dot", colorTreatment: "solid-sidebar", density: "spacious", font: "manrope", accent: "#059669", tags: ["Premium", "Sidebar", "Green", "Photo"], visualArchetype: "card-blocks",
  },
  {
    id: "royal-purple", name: "Royal Purple", description: "Purple gradient banner with DM Sans. Creative and authoritative.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "bar", bulletStyle: "diamond", colorTreatment: "gradient-header", density: "normal", font: "dm-sans", accent: "#7c3aed", accent2: "#c026d3", tags: ["Premium", "Gradient", "Creative", "Photo"], visualArchetype: "banner-gradient",
  },
  {
    id: "steel-magnolia", name: "Steel Magnolia", description: "Steel-gray sidebar with rose accents. Understated elegance.", hasPhoto: true,
    layout: "sidebar-right", headerStyle: "sidebar", headingStyle: "rule", bulletStyle: "dash", colorTreatment: "solid-sidebar", density: "normal", font: "work-sans", accent: "#64748b", tags: ["Premium", "Sidebar", "Elegant", "Photo"], visualArchetype: "sidebar-modern",
  },
  {
    id: "sunset-blaze", name: "Sunset Blaze", description: "Orange-to-pink gradient banner with Poppins. Warm and energetic.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "pill", bulletStyle: "arrow", colorTreatment: "gradient-header", density: "normal", font: "poppins", accent: "#f97316", accent2: "#ec4899", tags: ["Premium", "Gradient", "Warm", "Photo"], visualArchetype: "banner-gradient",
  },
  {
    id: "monaco", name: "Monaco", description: "Minimal black-and-white with Source Sans. Swiss design inspiration.", hasPhoto: false,
    layout: "split-header", headerStyle: "left", headingStyle: "uppercase", bulletStyle: "dash", colorTreatment: "minimal", density: "compact", font: "source-sans", accent: "#0f172a", tags: ["Premium", "Minimal", "Swiss", "ATS"], visualArchetype: "minimal-swiss",
  },
  {
    id: "tokyo-night", name: "Tokyo Night", description: "Dark indigo sidebar with neon cyan accents. Cyberpunk-inspired.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "boxed", bulletStyle: "arrow", colorTreatment: "dark-sidebar", density: "normal", font: "space-grotesk", accent: "#06b6d4", tags: ["Premium", "Dark", "Neon", "Tech"], visualArchetype: "tech-terminal",
  },
  {
    id: "parisian", name: "Parisian", description: "Crimson Text serif with centered header. French editorial elegance.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "centered", bulletStyle: "none", colorTreatment: "accent-rules", density: "spacious", font: "crimson-text", accent: "#be123c", tags: ["Premium", "Editorial", "Serif", "Elegant"], visualArchetype: "editorial",
  },
  {
    id: "silicon-valley", name: "Silicon Valley", description: "Clean split-header with Roboto. Startup-friendly and modern.", hasPhoto: false,
    layout: "split-header", headerStyle: "left", headingStyle: "bar", bulletStyle: "dot", colorTreatment: "accent-rules", density: "normal", font: "roboto", accent: "#2563eb", tags: ["Premium", "Startup", "Modern", "ATS"], visualArchetype: "tech-terminal",
  },
  {
    id: "vienna", name: "Vienna", description: "Classical Lora serif with gold rules. European sophistication.", hasPhoto: false,
    layout: "single", headerStyle: "centered", headingStyle: "rule", bulletStyle: "diamond", colorTreatment: "accent-rules", density: "spacious", font: "lora", accent: "#b45309", tags: ["Premium", "Classical", "Serif", "Gold"], visualArchetype: "editorial",
  },
  {
    id: "mumbai-spice", name: "Mumbai Spice", description: "Vibrant orange sidebar with Montserrat. Bold and cultural.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "pill", bulletStyle: "check", colorTreatment: "solid-sidebar", density: "normal", font: "montserrat", accent: "#ea580c", tags: ["Premium", "Sidebar", "Vibrant", "Photo"], visualArchetype: "card-blocks",
  },
  {
    id: "nordic-frost", name: "Nordic Frost", description: "Ice-blue gradient banner with Work Sans. Clean and cool.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "underline", bulletStyle: "dot", colorTreatment: "gradient-header", density: "spacious", font: "work-sans", accent: "#0ea5e9", accent2: "#67e8f9", tags: ["Premium", "Gradient", "Cool", "Photo"], visualArchetype: "card-blocks",
  },
  {
    id: "sahara", name: "Sahara", description: "Warm amber sidebar with Crimson Text. Desert-inspired warmth.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "numbered", bulletStyle: "dash", colorTreatment: "solid-sidebar", density: "spacious", font: "crimson-text", accent: "#d97706", tags: ["Premium", "Sidebar", "Warm", "Serif"], visualArchetype: "card-blocks",
  },
  {
    id: "cyber-pulse", name: "Cyber Pulse", description: "Dark sidebar with electric green accents. Futuristic developer design.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "uppercase", bulletStyle: "arrow", colorTreatment: "dark-sidebar", density: "compact", font: "jetbrains", accent: "#22c55e", tags: ["Premium", "Dark", "Neon", "Developer"], visualArchetype: "tech-terminal",
  },
  {
    id: "bauhaus", name: "Bauhaus", description: "Primary color blocks with geometric headings. Design-school inspired.", hasPhoto: false,
    layout: "split-header", headerStyle: "left", headingStyle: "boxed", bulletStyle: "dot", colorTreatment: "two-tone", density: "normal", font: "space-grotesk", accent: "#dc2626", accent2: "#2563eb", tags: ["Premium", "Geometric", "Bold", "Creative"], visualArchetype: "card-blocks",
  },

  // ---------- 6 College / University-oriented templates ----------
  {
    id: "campus-navy", name: "Campus Navy", description: "Navy-blue sidebar with academic styling. Professional and scholarly.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "numbered", bulletStyle: "dot", colorTreatment: "solid-sidebar", density: "normal", font: "inter", accent: "#1e3a8a", tags: ["College", "Academic", "Photo"], visualArchetype: "sidebar-modern",
  },
  {
    id: "placement-maroon", name: "Placement Maroon", description: "Maroon sidebar with serif headings. Traditional university placement style.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "numbered", bulletStyle: "dash", colorTreatment: "solid-sidebar", density: "spacious", font: "merriweather", accent: "#7f1d1d", tags: ["College", "Placement", "Serif"], visualArchetype: "editorial",
  },
  {
    id: "scholar-emerald", name: "Scholar Emerald", description: "Emerald banner with academic numbering. Fresh and scholarly.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "numbered", bulletStyle: "check", colorTreatment: "gradient-header", density: "normal", font: "poppins", accent: "#065f46", tags: ["College", "Academic", "Banner"], visualArchetype: "banner-gradient",
  },
  {
    id: "grad-amber", name: "Graduate Amber", description: "Amber sidebar with bold section markers. Warm and professional for new graduates.", hasPhoto: true,
    layout: "sidebar-right", headerStyle: "sidebar", headingStyle: "bar", bulletStyle: "arrow", colorTreatment: "solid-sidebar", density: "compact", font: "inter", accent: "#b45309", tags: ["Graduate", "College", "Photo"], visualArchetype: "card-blocks",
  },
  {
    id: "uni-charcoal", name: "University Charcoal", description: "Charcoal sidebar with uppercase headings. Clean and institutional.", hasPhoto: true,
    layout: "sidebar-left", headerStyle: "sidebar", headingStyle: "uppercase", bulletStyle: "dot", colorTreatment: "dark-sidebar", density: "normal", font: "inter", accent: "#1f2937", tags: ["University", "Institutional", "ATS"], visualArchetype: "dark-executive",
  },
  {
    id: "campus-royal", name: "Campus Royal", description: "Royal purple banner with pill headings. Modern campus recruitment style.", hasPhoto: true,
    layout: "header-banner", headerStyle: "banner", headingStyle: "pill", bulletStyle: "diamond", colorTreatment: "gradient-header", density: "normal", font: "poppins", accent: "#6d28d9", accent2: "#4c1d95", tags: ["Campus", "Recruitment", "Modern"], visualArchetype: "banner-gradient",
  },
];

export const SPEC_MAP: Record<string, TemplateSpec> = Object.fromEntries(
  NEW_TEMPLATE_SPECS.map((s) => [s.id, s])
);
