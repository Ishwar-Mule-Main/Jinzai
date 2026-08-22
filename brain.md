# Jinzai (人材) — Project Brain

## Quick Reference

### Credentials
| Type | Email | Password | URL |
|------|-------|----------|-----|
| Admin | Ishwar.mule007@gmail.com | Ishwar@2513 | /admin |
| Demo User | ishwar@domainexpansion.in | DomainEx@26 | / (login) |

### API Keys
| Service | Key | Used For |
|---------|-----|----------|
| OpenRouter | sk-or-v1-YOUR_OPENROUTER_API_KEY | AI features (summary, bullets, rewrite, ATS, cover letter, skills, import) |
| Resend | re_YOUR_RESEND_API_KEY | Email OTP + welcome emails |
| Google OAuth | (needs setup) | Gmail login |

### Email
- OTP/Welcome emails sent from: `otpprocess@domainexpansion.in`
- Display name: `Jinzai <otpprocess@domainexpansion.in>`

### UPI Payment
- UPI ID: `domainexpansion@okaxis`
- QR Code: `/public/upi-qr-code.jpeg`
- Payment flow: Scan QR → Pay → Enter transaction ID → Verify → Activate

### Branding
- Name: Jinzai (人材) — Talent Hub
- Parent: DomainEx@26
- Logo: 人 kanji on teal background
- Favicon: `/public/favicon.svg`
- DE Logo URL: https://domainexpansion.in/Domain%20Expansion%20New%20Logo.png
- Copyright: "© 2025 Jinzai by Domain Expansion. All rights reserved. Made in India."

## Tech Stack
- Next.js 16 (App Router) + TypeScript 5
- Tailwind CSS 4 + shadcn/ui (New York)
- Prisma ORM (SQLite) 
- Zustand (persist) for client state
- NextAuth.js v4 for authentication
- OpenRouter API for AI (default: meta-llama/llama-3.3-70b-instruct)
- Resend API for emails
- Framer Motion for animations
- @dnd-kit for drag-and-drop
- bcryptjs for password hashing

## Architecture
- Single route `/` (SPA: dashboard → build choice → editor)
- `/admin` — Admin panel (secure login)
- `/templates` — Public templates gallery
- `/pricing` — Public pricing page
- `/about`, `/contact` — Public info pages
- `/privacy`, `/terms`, `/refund` — Legal pages
- `/share/[token]` — Public shared resume pages

## Database Models
- **User**: id, email, name, password, plan (free/trial_99/pro_499/business_1999), planExpiresAt
- **Resume**: id, title, slug, template, accentColor, fontFamily, content (JSON), isShared, shareToken, contactLocked, userId
- **SupportTicket**: id, userId, email, name, subject, message, status, reply

## Pricing Plans
| Plan | Price | Resumes | Export | Contact Lock | AI Rewrite |
|------|-------|---------|--------|--------------|------------|
| Free | ₹0 | 1 | ❌ | No | ❌ |
| Trial | ₹99 / 2 days | 1 | ✅ | Yes | ❌ |
| Pro | ₹499 / month | 5 | ✅ | Yes | ✅ |
| Business | ₹1,999 / month | Unlimited | ✅ | No | ✅ |

## Features (72 Templates)
- 8 original hand-crafted templates (Modern, Minimal, Creative, Classic, Executive, Tech, Academic, Compact)
- 44 parameterized templates (sidebar, banner, single, split-header layouts)
- 20 advanced premium templates (Aurora Pro, Midnight Executive, Corporate Elite, etc.)
- 2 free templates (Minimal, Classic) — rest are premium

## AI Features (7)
1. Summary generation
2. Achievement bullet generation
3. Bullet rewrite (impact enhancement)
4. Cover letter generation (3 tones)
5. ATS keyword matching
6. Resume quality score (8 categories)
7. Skill suggestions by job title
8. Resume import (PDF/DOCX/MD/TXT parsing)
9. Upload & Rewrite (AI agent with 20-year expert prompt)

## Authentication Methods
1. **Email + Password** — NextAuth credentials provider
2. **Google OAuth** — Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
   - Setup: https://console.cloud.google.com/ → Create OAuth 2.0 Client ID
   - Redirect URI: http://localhost:3000/api/auth/callback/google
3. **Email OTP** — 6-digit code sent via Resend from otpprocess@domainexpansion.in

## Design System
- ClickHouse Design System (DESIGN.md)
- Canvas: #0a0a0a (near-pure black canvas)
- Primary / Brand Voltage: #faff69 (electric yellow)
- Primary Active: #e6eb52, Disabled: #3a3a1f
- Surface Card: #1a1a1a
- Surface Soft: #121212, Surface Elevated: #242424
- Hairline: #2a2a2a, Hairline Strong: #3a3a3a
- Text: #ffffff (headlines/ink), #cccccc (body), #e6e6e6 (body-strong), #888888 (muted)
- Typography: Inter (700 display w/ negative letter-spacing -1 to -2.5px, 600 title/button, 400 body), JetBrains Mono for code blocks
- Rounded: 8px (md) buttons & inputs, 12px (lg) cards, pill for badges


## Google OAuth Setup Instructions
To enable "Login with Google":
1. Go to https://console.cloud.google.com/
2. Create or select a project
3. Navigate to APIs & Services → Credentials
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Set Application Type: Web Application
6. Add Authorized redirect URI:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret
8. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```
9. Restart the server

## GitHub
- Repository: https://github.com/Ishwar-Mule-Main/Jinzai.git
- Auto-push: After each feature completion, run `git add -A && git commit -m "description" && git push origin main`

## Environment Variables (.env)
```
DATABASE_URL=file:./db/custom.db
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://jinzai-ten.vercel.app
RESEND_API_KEY=re_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```
