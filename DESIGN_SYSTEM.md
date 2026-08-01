# 🎨 Domain Expansion — Master Design System (v3.0)
## Complete Specification for Public Website & Protected Admin Panel
**Version:** 3.0 | **Framework:** Next.js 16 (App Router) + Tailwind CSS v4 + Vanilla CSS  
**Brand Identity:** DE Dark-Premium System (Electric Orange `#FF6200` on Deep Near-Black `#0D0D0D`)  
**Maintained by:** Domain Expansion Engineering Team © 2026

---

## 1. Design Philosophy & Dual-Context Architecture

Domain Expansion uses a **Dark-First, High-Contrast, Motion-Driven** design language designed to convey technical precision, creative confidence, and premium agency execution.

### Dual Operating Contexts
1. **Public Marketing Website (`/`, `/about`, `/services/*`, `/case-studies/*`, `/techguild`)**:
   - **Canvas:** Deep near-black (`#0D0D0D`) with GPU-accelerated motion, vector preloaders, liquid-glass cards, and electric orange highlights (`#FF6200`).
   - **Objective:** Wow visitors in 5 seconds, surface social proof, explain core service pillars, and maximize conversion rates.
2. **Protected Admin Portal (`/admin/*`)**:
   - **Canvas:** High-utility, low-fatigue dark surface (`#141414` / `#0D0D0D`) with subtle borders (`#2E2E2E`), monospace telemetry grids, status pills, and interactive console drawers.
   - **Objective:** Maximize density, data scannability, real-time AI automation control, lead management, and campaign monitoring.

---

## 2. Color Palette & Design Tokens

### Core Color Palette

```css
/* Brand Signature Colors */
--de-orange:          #FF6200; /* Primary Brand Accent & Call-to-Action */
--de-orange-hover:    #E55700; /* Hover state for primary buttons */
--de-orange-light:    #FF8C42; /* Gradient secondary & light accents */
--de-orange-glow:     rgba(255, 98, 0, 0.20); /* Radial glow & hover aura */
--de-orange-soft:     #FFF0E6; /* Light theme callout background */

/* Dark Theme Canvas & Surfaces (Website & Admin) */
--de-dark:             #0D0D0D; /* Primary Page Background */
--de-dark-surface:     #141414; /* Card & Sidebar Surface */
--de-dark-card:        #1A1A1A; /* Elevated Card Fill */
--de-dark-elevated:    #222222; /* Hover Elevated Surface */
--de-dark-border:      #2E2E2E; /* Primary Surface Hairline Border */
--de-dark-border-soft: #252525; /* Subtle Divider Lines */

/* Light Theme Canvas (Blog & Article Detail Pages) */
--de-canvas:           #FFFFFF; /* Light Mode Canvas */
--de-surface:          #F8F8F8; /* Light Card Surface */
--de-surface-soft:     #F2F2F2; /* Light Input Fill */
--de-hairline:         #E5E5E5; /* Light Hairline Divider */

/* Typography Colors */
--de-ink:              #0D0D0D; /* Text on Light Canvas */
--de-on-dark:          #FFFFFF; /* High Contrast Text on Dark */
--de-on-dark-muted:    rgba(255, 255, 255, 0.70); /* Secondary Copy */
--de-on-dark-subtle:   rgba(255, 255, 255, 0.45); /* Muted Captions */
--de-steel:            #888898; /* Admin Labels & Muted Headers */
--de-slate:            #5A5A6A; /* Admin Fine Print & Disabled States */

/* TechGuild Sub-Brand Accent */
--tg-violet:           #6D28D9; /* TechGuild Primary Accent */
--tg-violet-light:     #8B5CF6; /* TechGuild Gradient Accent */

/* Semantic Status Tokens */
--de-success:          #22C55E; /* Status: REPLIED, Active, Valid */
--de-error:            #EF4444; /* Status: FAILED, Error, Blocked */
--de-warning:          #F59E0B; /* Status: GENERATING, Pending */
--de-info:             #3B82F6; /* Status: READY, Info, Neutral */
```

### Gradients & Effects

```css
/* Hero & Accent Gradients */
--de-grad-hero:    linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 60%, #2A1200 100%);
--de-grad-orange:  linear-gradient(135deg, #FF6200 0%, #FF8C42 100%);
--de-grad-glow:    radial-gradient(ellipse at center, rgba(255, 98, 0, 0.15) 0%, transparent 70%);
--tg-grad-violet:  linear-gradient(135deg, #FF6200 0%, #6D28D9 100%);
```

---

## 3. Typography & Type System

The type system is driven by **Bricolage Grotesque** (Display/Headings), **Inter** (Body/UI Copy), and **JetBrains Mono** (Technical tags, telemetry, code blocks, and Admin logs).

### Type Hierarchy Scale

| Token Class | Font Family | Size (Desktop / Mobile) | Line Height | Weight | Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text-hero` | Bricolage Grotesque | `80px` / `40px` | `1.05` | 700 | Homepage Main Hero Header |
| `text-display`| Bricolage Grotesque | `56px` / `32px` | `1.1` | 700 | Section Display Titles |
| `text-h1` | Bricolage Grotesque | `40px` / `28px` | `1.2` | 700 | Major Page Section Headers |
| `text-h2` | Bricolage Grotesque | `32px` / `24px` | `1.25` | 600 | Sub-section & Card Headers |
| `text-h3` | Bricolage Grotesque | `24px` / `20px` | `1.3` | 600 | Card Titles & FAQ Questions |
| `text-sub` | Inter | `18px` / `16px` | `1.5` | 500 | Hero Subtitles & Intro Paragraphs |
| `text-body` | Inter | `16px` / `15px` | `1.75` | 400 | Standard Body Copy & Prose |
| `text-body-sm`| Inter | `14px` / `13px` | `1.6` | 400 | Secondary Copy & Admin Tables |
| `text-caption`| JetBrains Mono / Inter | `12px` / `11px` | `1.5` | 500 | Meta Badges & Admin Labels |
| `text-micro` | JetBrains Mono | `10px` / `10px` | `1.4` | 400 | System Timestamps & Fine Print |

---

## 4. Public Website Design System

### A. Liquid Glass Effects (`.liquid-glass`)
Used for floating cards, hero elements, and featured items to create depth on dark canvas.

```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

### B. Orange Gradient Text (`.text-gradient-orange`)
```css
.text-gradient-orange {
  background: linear-gradient(135deg, #FF6200 0%, #FF8C42 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### C. Navigation Bar Specification
- **Top State:** Completely transparent background.
- **Scrolled State:** `rgba(13, 13, 13, 0.85)` background with `backdrop-filter: blur(20px)` and a `1px solid #2E2E2E` bottom hairline.
- **Brand Logo:** `domain.expansion` set in medium-bold display font with an electric orange dot (`#FF6200`).

---

## 5. Protected Admin Panel Design System (`/admin/*`)

The admin panel is optimized for high-density operations, real-time AI log viewing, campaign queue monitoring, and content management.

### A. Layout Structure
```text
+-----------------------------------------------------------------------------+
| SIDEBAR NAV (260px)   | TOP HEADER (Session info, status, active toggles)   |
| #141414, Border #2E2E2E| #0D0D0D, Border-b #2E2E2E                          |
|                       +-----------------------------------------------------|
| - Email Campaigns     | CONTENT CANVAS                                      |
| - Blog AI Agent       | #0D0D0D Padding 24px (p-6)                          |
| - Inbound Leads       |                                                     |
| - Waitlist Data       | - Stat Overview Cards (4 Grid)                      |
| - Portfolio Manager   | - Tab Navigation Bar                                |
|                       | - High-Density Data Tables / Terminal Console       |
+-----------------------------------------------------------------------------+
```

### B. Admin Status Pill System

| Status Enum | Pill Background | Text Color | Border Color | Meaning |
| :--- | :--- | :--- | :--- | :--- |
| `PENDING` | `rgba(245, 158, 11, 0.1)` | `#F59E0B` | `rgba(245, 158, 11, 0.3)` | Prospect queued for pitch generation |
| `GENERATING`| `rgba(59, 130, 246, 0.1)` | `#3B82F6` | `rgba(59, 130, 246, 0.3)` | AI active on prospect |
| `READY` | `rgba(168, 85, 247, 0.1)` | `#A855F7` | `rgba(168, 85, 247, 0.3)` | Pitch draft generated & ready |
| `SENDING` | `rgba(255, 98, 0, 0.1)` | `#FF6200` | `rgba(255, 98, 0, 0.3)` | Outbound SMTP dispatch in progress |
| `SENT` | `rgba(34, 197, 94, 0.1)` | `#22C55E` | `rgba(34, 197, 94, 0.3)` | Outbound SMTP email delivered |
| `REPLIED` | `rgba(16, 185, 129, 0.2)` | `#10B981` | `rgba(16, 185, 129, 0.5)` | Inbound prospect reply captured via IMAP |
| `FAILED` | `rgba(239, 68, 68, 0.1)` | `#EF4444` | `rgba(239, 68, 68, 0.3)` | Error encountered (Quota, SMTP, or format) |
| `UNSUBSCRIBED`| `rgba(107, 114, 128, 0.1)`| `#9CA3AF` | `rgba(107, 114, 128, 0.3)`| Opted out via List-Unsubscribe header |

### C. Admin Terminal & Log Views
- **Font:** `JetBrains Mono` (`font-mono`, `text-xs`)
- **Background:** `#0B0B0C` with `1px solid #2E2E2E`
- **Output Padding:** `px-4 py-3`
- **Telemetry Colors:**
  - Success Logs: `#22C55E`
  - Warning Logs: `#F59E0B`
  - Failover Logs: `#FF8C42`
  - Error Logs: `#EF4444`

---

## 6. Component Specification Catalog

### 1. Primary Action Button (Brand Orange)
```html
<button className="bg-[#FF6200] hover:bg-[#E55700] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-[#FF6200]/20 hover:shadow-[#FF6200]/40 text-sm">
  Get Free Consultation
</button>
```

### 2. Secondary Ghost Button (Dark Surface)
```html
<button className="bg-transparent hover:bg-[#1A1A1A] text-white border border-[#2E2E2E] hover:border-[#FF6200] px-6 py-3 rounded-full transition-all duration-300 text-sm">
  View Portfolio
</button>
```

### 3. Admin Input Field
```html
<div className="flex flex-col gap-1.5">
  <label className="text-[11px] font-mono text-[#888898]">Sender Email Address:</label>
  <input
    type="email"
    className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-colors"
    placeholder="ishwar@domainexpansion.in"
  />
</div>
```

### 4. Admin Card Container
```html
<div className="p-6 bg-[#141414] border border-[#2E2E2E] rounded-xl flex flex-col gap-4">
  <!-- Header & Content -->
</div>
```

---

## 7. Responsive Breakpoints & Accessibility

### Breakpoints
- **Mobile Small (`default`):** `< 480px`
- **Mobile Large (`sm:`):** `480px`
- **Tablet (`md:`):** `768px`
- **Desktop Small (`lg:`):** `1024px`
- **Desktop Full (`xl:`):** `1280px`
- **Ultra-Wide (`2xl:`):** `1536px`

### Accessibility Standards (WCAG 2.1 AA)
- **Color Contrast:** Minimum 4.5:1 ratio for text content against dark canvas.
- **Focus Rings:** Mandatory `2px` electric orange focus ring (`0 0 0 2px #FF6200`) on interactive components.
- **Motion Controls:** Full compliance with `prefers-reduced-motion: reduce`. Animations collapse to instant state transitions when user motion reduction is active.

---

*Domain Expansion Master Design System Specifications © 2026*
