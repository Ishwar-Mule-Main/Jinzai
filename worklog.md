# ResumeForge — Resume/CV Builder Platform — Worklog

## Project Overview
A platform where candidates can create and generate resumes/CVs from multiple pre-made templates. Templates auto-optimize layout based on content. Each template has a distinct design — some with photo option, some without.

## Tech Stack
- Next.js 16 (App Router) + TypeScript 5
- Tailwind CSS 4 + shadcn/ui (New York)
- Prisma ORM (SQLite) for persistence
- z-ai-web-dev-sdk for AI features (LLM summary, bullets, cover letters)
- Zustand (persist) for client state, undo/redo
- Print-to-PDF for export (browser print with A4 CSS)

## Architecture
- Single route `/` (SPA with views: dashboard, editor)
- API routes: `/api/resumes` (CRUD + GET single by ?id=), `/api/ai/summary`, `/api/ai/bullets`, `/api/ai/cover-letter`, `/api/ai/ats`
- 6 distinct resume templates: Modern, Minimal, Creative, Classic, Executive, Tech
- Resume data model (JSON) with sections: personalInfo, summary, experience, education, skills, projects, certifications, languages, customSections
- Templates auto-adapt: hide empty sections (getActiveSections), single/two-column based on content

## Files Created / Modified
- `prisma/schema.prisma` — Resume model
- `src/lib/resume/types.ts` — ResumeData types + TEMPLATES metadata + font/accent presets
- `src/lib/resume/sample-data.ts` — empty/sample resume, date utils, completion calc
- `src/lib/resume/store.ts` — Zustand store with persist + undo/redo + all section CRUD
- `src/lib/resume/template-helpers.ts` — color, font, contact helpers
- `src/lib/resume/text-extract.ts` — resumeToText() for ATS/AI context extraction
- `src/components/resume/templates/basic-templates.tsx` — Modern + Minimal + shared atoms
- `src/components/resume/templates/extended-templates.tsx` — Creative + Classic + Executive + Tech
- `src/components/resume/resume-renderer.tsx` — template selector + font wrapper
- `src/components/resume/resume-editor.tsx` — full multi-section editor form with AI buttons
- `src/components/resume/resume-app.tsx` — Dashboard (template gallery) + EditorView (split pane)
- `src/components/resume/ai-dialogs.tsx` — CoverLetterDialog + AtsDialog components
- `src/components/resume/saved-resumes.tsx` — SavedResumesDialog + ImportExportJson components
- `src/app/page.tsx` — hydration guard + ResumeApp
- `src/app/layout.tsx` — 7 Google fonts
- `src/app/globals.css` — font utilities + print CSS (A4) + custom scrollbars
- `src/app/api/resumes/route.ts` — GET (list + single by ?id=), POST, PUT, DELETE
- `src/app/api/ai/summary/route.ts` — LLM summary generator
- `src/app/api/ai/bullets/route.ts` — LLM achievement bullet generator
- `src/app/api/ai/cover-letter/route.ts` — LLM cover letter generator (3 tones)
- `src/app/api/ai/ats/route.ts` — ATS keyword match analysis (deterministic, no LLM)

---
Task ID: 1 (initial)
Agent: Main (orchestrator)
Task: Initialize project, build 6 templates, editor, API, AI features, export

Stage Summary:
- All 6 templates render distinctly and auto-hide empty sections
- AI summary and bullet generation working via z-ai-web-dev-sdk
- Print export produces clean A4 PDF with only the resume visible
- Lint passes with 0 errors; dev server runs on port 3000

---
Task ID: 2 (cron review round 1)
Agent: Main (orchestrator) — webDevReview cron
Task: QA testing, styling polish, new features

Work Log:
- Read worklog, started dev server, performed QA with agent-browser
- Confirmed dashboard + editor load with 0 console errors
- VLM analysis of dashboard: identified actionable improvements (card shadows, spacing, icon circles, tag pills, hero polish)
- Created 3 new API routes:
  - `/api/ai/cover-letter` — LLM cover letter generator with 3 tones (confident, formal, concise), tailors to job description
  - `/api/ai/ats` — ATS keyword match analysis (deterministic, no LLM): score, matched/missing keywords, recommendations
  - Enhanced `/api/resumes` GET to support `?id=` for single resume fetch
- Created `src/lib/resume/text-extract.ts` — resumeToText() flattens resume data to plain text for ATS/AI
- Created `src/components/resume/ai-dialogs.tsx`:
  - CoverLetterDialog: job description input, tone selector, generate, copy, download .txt
  - AtsDialog: job description input, analyze, score card with progress bar, matched (green) + missing (outline) keyword badges, recommendations
- Created `src/components/resume/saved-resumes.tsx`:
  - SavedResumesDialog: lists saved resumes with thumbnail, template name, time-ago, load/delete
  - ImportExportJson: export resume as .json backup, import .json to restore
- Rewrote `src/components/resume/resume-app.tsx` with major styling polish:
  - Added sticky top nav bar with BrandMark logo on dashboard
  - Hero: larger 6xl headline, gradient text, stats row (6 templates, 9 sections, 100% free)
  - Template cards: rounded-2xl, hover shadow-xl + translate-y, photo badge, bottom gradient overlay, tag pills
  - Features strip: 4 cards with colored icon circles (teal, amber, violet, sky)
  - Trust banner: 3-column with icons (ATS-friendly, real-time, PDF/JSON export)
  - Footer with brand mark
  - Editor toolbar: gradient Export PDF button, divider, all new feature buttons
  - Design tab: rounded-xl cards, completion % display, Backup & Restore section with Import/Export JSON
- Improved ATS algorithm (v2):
  - Phrase-segment splitting to avoid cross-clause bigram noise
  - Known-skills whitelist (200+ tech/design terms)
  - Bigrams only kept if known skill or count >= 2
  - Smart recommendations based on score + word count
- Fixed ATS route.ts parse error (missing closing paren on .split())
- Fixed SaveLoadBar typo (escaped quote)

Verification Results:
- ESLint: 0 errors
- Dev server: HTTP 200 on port 3000
- ATS API (curl): returns 75% match score with clean matched/missing keywords — no bigram noise
- Cover Letter API (curl): generates professional tailored 3-paragraph letter referencing specific achievements
- agent-browser: dashboard renders with 0 errors, "My Resumes" button in nav, editor toolbar shows Template/Cover Letter/ATS Check/Export PDF buttons
- VLM dashboard rating: 8.5/10 ("modern and premium", "crisp typography", "professional color palette")
- VLM editor rating: 9/10 ("clean professional toolbar", "high fidelity live preview", "effective split-pane")

Stage Summary:
- 4 new features shipped: AI Cover Letter, ATS Keyword Match, Saved Resumes manager, Import/Export JSON
- Dashboard + editor restyled with premium polish (gradients, shadows, icon circles, tag pills)
- ATS algorithm is smart and deterministic (no LLM cost, instant results)
- All APIs verified working via direct curl testing
- VLM confirms 8.5-9/10 visual quality

## Current Status: STABLE, POLISHED & FEATURE-RICH
ResumeForge now has 6 templates, 4 AI features (summary, bullets, cover letter, ATS match), saved resumes management, JSON backup/restore, and premium styling.

## Unresolved Issues / Risks
- Dev server process dies between bash sessions (environment limitation); cron job restarts as needed
- agent-browser `find text` / `find role` locators are flaky in this environment (clicks sometimes fail despite elements existing); ref-based clicks work better but refs change on re-render
- Input field placeholder text truncation in form (cosmetic, shadcn/ui default behavior; actual values display correctly)
- Photo placeholder circle in preview could use a subtle icon (minor)

## Priority Recommendations for Next Phase
1. Add drag-and-drop section reordering (currently only experience has up/down buttons)
2. Add a "Duplicate resume" action in the Saved Resumes dialog
3. Add more templates (e.g. Academic, Creative Portfolio, Infographic)
4. Add real-time spelling/grammar check in summary and experience fields
5. Add resume sharing via public link (generate a shareable read-only URL)
6. Add cover letter PDF export (currently only .txt)
7. Mobile-responsive editor improvements (currently optimized for desktop split-pane)
