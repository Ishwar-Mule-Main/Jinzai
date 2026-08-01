# Jinzai (人材) — Complete Chat History & Development Log

## Project: Jinzai — AI Resume Builder & Job Seeker Hub
**Parent Company**: Domain Expansion
**Repository**: https://github.com/Ishwar-Mule-Main/Jinzai.git
**Owner**: Ishwar Mule (Ishwar.mule007@gmail.com)

---

## Phase 1: Initial Build (ResumeForge)
- Built Next.js 16 app with TypeScript, Tailwind CSS, shadcn/ui
- Created 6 resume templates (Modern, Minimal, Creative, Classic, Executive, Tech)
- Built multi-section editor (Personal Info, Summary, Experience, Education, Skills, Projects, Certifications, Languages, Custom Sections)
- Added AI summary + bullet generation via z-ai-web-dev-sdk
- Print-to-PDF export with A4 CSS
- Prisma ORM + SQLite database
- Zustand store with persist + undo/redo

## Phase 2: Cron Reviews (Rounds 1-10)
Each round added features and polish:
- **Round 1**: AI Cover Letter, ATS Keyword Match, Saved Resumes, Import/Export JSON
- **Round 2**: 2 new templates (Academic, Compact), AI Resume Score, Duplicate resume
- **Round 3**: Dark Mode, Public Link Sharing, Collapsible Editor Sidebar
- **Round 4**: Drag-and-drop reordering, Section count badges, Cover letter PDF export
- **Round 5**: Keyboard shortcuts, Template comparison view
- **Round 6**: AI Skill Suggestions, DOCX export, Mobile-responsive editor
- **Round 7**: AI Bullet Rewrite, Role-based examples, Onboarding tour
- **Round 8**: Font size scale (XS-S-M-L-XL), Clickable contact links, Free vs paid templates
- **Round 9**: Testimonials, FAQ, Stats banner, Final CTA
- **Round 10**: Notification bell, Zoom controls

## Phase 3: 52 Templates → 72 Templates
- Built parameterized template engine (TemplateSpec system)
- 44 parameterized templates (5 layouts × 8 heading styles × 6 bullet styles × 6 color treatments)
- Created fast CSS thumbnail component for gallery
- Added search + category filters (10 categories)
- Later added 20 advanced premium templates (Aurora Pro, Midnight Executive, etc.)
- Total: 72 templates (2 free, 70 premium)

## Phase 4: Authentication & Pricing
- NextAuth v4 with 3 providers: Credentials, Google (simulated), Email OTP
- 4-tier pricing: Free (₹0), Trial (₹99/2 days), Pro (₹499/mo), Business (₹1,999/mo)
- Plan enforcement: resume limits, export lock, contact lock
- Admin panel at /admin (Ishwar.mule007@gmail.com / Ishwar@2513)
- Support ticket system with admin replies + notification bell
- Content protection (no right-click/copy/drag on resume)

## Phase 5: OpenRouter API Integration
- All AI routes migrated to OpenRouter API
- Default model: meta-llama/llama-3.3-70b-instruct (Claude models region-restricted)
- Configurable via OPENROUTER_MODEL env var
- 9 AI features: summary, bullets, rewrite, cover letter, ATS, score, skills, import, upload-rewrite

## Phase 6: Rebrand to Jinzai (人材)
- All "ResumeForge" → "Jinzai" across 16+ files
- Brand mark with 人 kanji logo
- Tagline: "人材 · Talent Hub"
- Favicon: custom SVG
- Domain Expansion logo in footer
- "Made in India" in footer

## Phase 7: Legal Pages & Public Pages
- Converted legal pages from popups to proper routes: /privacy, /terms, /refund, /about, /contact
- Business-standard legal content with GDPR, CCPA, IT Act 2000, DPDP Act 2023 compliance
- Created /templates page (all 72 templates gallery)
- Created /pricing page (full pricing with FAQ)
- Public nav (Home, Templates, Pricing, About, Contact)
- Public footer with DE logo + copyright

## Phase 8: Intercom Design System
- Installed getdesign intercom design system (DESIGN.md)
- Applied cream canvas (#f5f1ec), charcoal ink (#111111), hairline borders
- All public pages use Intercom-inspired design
- Feature cards, pricing cards, FAQ rows, CTA banners

## Phase 9: Build Choice & Upload Rewrite
- After login: "How would you like to build your resume?" page
- 3 options: Upload & Edit, Upload & Rewrite (Pro+), Build from Scratch
- File import accepts PDF, DOCX, MD, TXT
- AI rewrite agent with 20-year expert resume writer prompt
- Upload & Rewrite gated behind Pro (₹499) and Business (₹1,999) plans

## Phase 10: UPI Payment System
- Payment via UPI only (QR code + UPI ID: domainexpansion@okaxis)
- Payment flow: Scan QR → Pay → Enter transaction ID → Verify → Activate
- All paid features gated behind payment verification
- QR code image from user upload

## Phase 11: Email System (Resend)
- Installed Resend SDK
- OTP emails sent from: otpprocess@domainexpansion.in
- Well-formatted HTML email templates (Jinzai branding, teal header, OTP code)
- Welcome email on signup
- Google OAuth setup instructions documented (needs GOOGLE_CLIENT_ID/SECRET)

## Phase 12: GitHub Push
- Repository: https://github.com/Ishwar-Mule-Main/Jinzai.git
- API keys scrubbed from git history for push protection
- .env added to .gitignore
- Auto-push after each feature

---

## Credentials Summary
- **Admin Panel**: /admin → Ishwar.mule007@gmail.com / Ishwar@2513
- **Demo User**: ishwar@domainexpansion.in / DomainEx@26 (Business plan)
- **OpenRouter API**: sk-or-v1-YOUR_OPENROUTER_API_KEY
- **Resend API**: re_YOUR_RESEND_API_KEY
- **UPI ID**: domainexpansion@okaxis
- **Email From**: otpprocess@domainexpansion.in

## Google OAuth Setup (Pending)
To enable real Google login:
1. https://console.cloud.google.com/ → Create OAuth 2.0 Client ID
2. Redirect URI: http://localhost:3000/api/auth/callback/google
3. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env
4. Restart server

## Remaining TODO
- [ ] Google OAuth (needs user to create Google Cloud credentials)
- [ ] Sidebar in editor with drafts/saved resumes/create new button
- [ ] Web profile pages for paid users (job seeker hub)
- [ ] Advanced resume web pages (₹299/download)
- [ ] PostgreSQL migration for Vercel deployment
- [ ] Framer Motion animations on homepage
