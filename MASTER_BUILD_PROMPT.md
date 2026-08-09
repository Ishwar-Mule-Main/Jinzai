# Jinzai (人材) — Master Project Specification & AI Generation Prompt

> **Project Name**: Jinzai (人材) — Premier AI-Powered Resume Builder & Job Seeker Hub  
> **Author / Brand**: Domain Expansion  
> **Version**: 3.0.0  

---

## 1. Project Overview & Architecture

**Jinzai (人材)** is an enterprise-grade, full-stack AI-powered resume builder, ATS optimization engine, and job-seeker platform. It combines Next.js 16 (App Router), TailwindCSS, TypeScript, Zustand, Prisma ORM (Neon PostgreSQL), NextAuth.js, and OpenRouter AI models (GPT-4o, Claude 3.5, Llama 3.3, Gemini 2.0) to deliver real-time resume editing, 78 ATS-certified template designs, PDF uploading with AI parsing, and a 7-tool AI Co-Pilot Workbench.

### Key Architectural Pillars:
- **Frontend Framework**: Next.js 16 (App Router + Turbopack), React 19, TypeScript, TailwindCSS v4, Radix UI / shadcn/ui.
- **State Management**: Zustand with persistent storage (`useResumeStore`).
- **Database & Auth**: Prisma ORM, Neon PostgreSQL, NextAuth.js v4 (Google OAuth + Credentials).
- **AI Backend**: OpenRouter API (`https://openrouter.ai/api/v1`) with fallback to `z-ai-web-dev-sdk`.
- **PDF & File Processing**: `pdf-parse` (Node.js runtime), `jspdf`, `html2canvas`, `html2pdf.js`.
- **Email Service**: Resend API for OTP verification and transaction notifications.

---

## 2. Environment Variables & `.env` Setup

Create a `.env` file in the root directory with the following variables:

```env
# ==========================================
# Database Configuration (Neon PostgreSQL)
# ==========================================
DATABASE_URL="postgresql://neondb_owner:npg_d73vLRFBwQnr@ep-curly-sea-aybu2xsd.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"

# ==========================================
# NextAuth Authentication Configuration
# ==========================================
NEXTAUTH_SECRET="resumeforge-domain-expansion-secret-2025"
NEXTAUTH_URL="http://localhost:3000"

# ==========================================
# OpenRouter AI Engine Configuration
# ==========================================
OPENROUTER_API_KEY="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
OPENROUTER_MODEL="openai/gpt-4o-mini"

# ==========================================
# Resend Email Service (OTP & Verification)
# ==========================================
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"

# ==========================================
# Google OAuth Configuration
# ==========================================
GOOGLE_CLIENT_ID="750265202825-i2cjhk2v506e5kl04obr2csj5jacklqg.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## 3. Database Schema (Prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Plan {
  free
  trial
  pro
  business
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?
  image         String?
  plan          Plan      @default(free)
  planExpiresAt DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  resumes       Resume[]
}

model Resume {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  title         String    @default("Untitled Resume")
  slug          String?   @unique
  data          Json
  template      String    @default("modern")
  accentColor   String    @default("#0f766e")
  fontFamily    String    @default("inter")
  fontSize      String    @default("m")
  contactLocked Boolean   @default(false)
  isPublic      Boolean   @default(false)
  views         Int       @default(0)
  downloads     Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model PageView {
  id        String   @id @default(cuid())
  path      String
  referrer  String?
  userAgent String?
  ip        String?
  sessionId String?
  createdAt DateTime @default(now())
}

model Setting {
  key       String   @id
  value     String
  updatedAt DateTime @updatedAt
}
```

---

## 4. Key Feature Matrix

1. **78 ATS-Certified Resume Templates**:
   - Single-column, Two-column, Sidebar, Banner, Creative, Executive, Academic, Tech, Parameterized, and University templates.
   - Live real-time preview scaling (A4 canvas format).
   - Customizable accent colors, typography (Inter, Poppins, Merriweather, Playfair, JetBrains Mono, etc.), font scaling (XS to XL).

2. **Old Resume PDF Upload & AI Smart Scanning**:
   - Drag-and-drop PDF dropzone supporting single and multiple PDF files.
   - Server-side PDF binary parsing via `pdf-parse`.
   - **Selective Merge Engine**: Allows users to select individual sections (Personal Info, Summary, Work History, Education, Skills, Projects, Certifications, Languages) and merge them into an active resume or build a new one.

3. **7-Tool AI Co-Pilot Workbench**:
   - **AI Summary Generator**: Prompt-driven professional summary generation with 1-click apply.
   - **ARI Bullets Generator**: Action-Result-Impact achievement bullets with 1-click experience insertion.
   - **JD Skill Extractor**: Target job description keyword extraction into skill badges.
   - **Headline Optimizer**: Generate high-impact role taglines.
   - **Cover Letter Drafter**: Draft complete custom cover letters with full modal preview & copy.
   - **Interview Q&A Prep**: Behavioral & technical STAR interview questions framework.
   - **ATS Keyword Scanner & Match Score**: Real-time 0–100 ATS score calculation with 1-click missing keyword insertion.

4. **Monetization & Plans**:
   - Free (1 resume preview), Trial (₹99), Pro (₹499/mo), Business (₹1,999/mo).
   - Contact locking logic to prevent single-account sharing on lower tiers.

---

## 5. Master Prompt to Generate This Entire Project from Scratch

Copy and paste the prompt below into an advanced coding AI agent to build this entire web application:

```markdown
You are an expert full-stack AI engineer. Build a complete, production-grade Next.js 16 AI Resume Builder & Talent Hub called "Jinzai (人材)" created by Domain Expansion.

### TECH STACK & REQUIREMENTS:
1. **Core Framework**: Next.js 16 (App Router + Turbopack), TypeScript, React 19.
2. **Styling & Components**: TailwindCSS v4, Radix UI primitives, Lucide React icons, Framer Motion, dark mode aesthetic with orange (#FF6200) and teal accents.
3. **State Management**: Zustand (`resumeforge-store`) with local storage persistence.
4. **Database & ORM**: Prisma ORM with Neon PostgreSQL database. Models: User, Resume, PageView, Setting.
5. **Authentication**: NextAuth.js v4 with Credentials (Email OTP & Password) and Google OAuth provider.
6. **AI Integration**: OpenRouter API (`https://openrouter.ai/api/v1`) using model `openai/gpt-4o-mini` with fallback support.

### CORE FEATURES TO BUILD:

#### 1. Landing Page & Public Navigation (`src/app/page.tsx`)
- Hero section with glassmorphism badges, animated gradient typography, CTAs for "Start Building Free", "Upload & Auto-Fill", and "Try Sample Profile".
- Interactive 78-Template Preview Showcase with filters (ATS-friendly, Tech, Creative, Executive, Academic, University).
- Feature comparison matrix, plan pricing grid (Free, ₹99 Trial, ₹499 Pro, ₹1,999 Business), and user testimonials.

#### 2. Main Builder Application (`src/components/resume/resume-app.tsx`)
- 4-Tab Sidebar: Content Editor, Design Customizer, Template Switcher, AI Co-Pilot Workbench.
- Live A4 Canvas Preview area (`210mm x 297mm`) with real-time scaling, page-break indicators, zoom controls (50% - 150%), and multi-page wrapping.
- High-precision PDF Export engine using `html2pdf.js` & `jspdf` alongside Word (.docx) export.

#### 3. Old Resume PDF Upload & AI Scanning Modal (`src/components/resume/import-resume-dialog.tsx`)
- Multi-PDF drag-and-drop upload zone supporting `.pdf`, `.docx`, `.txt`, and `.json`.
- Server API route (`/api/ai/import-resume`) using `pdf-parse` (Node.js runtime) to extract clean PDF text and run AI structured JSON parsing.
- **Smart Data Selector**: Step 3 UI offering "Create New Resume" vs "Merge into Current Resume", with interactive section checkboxes (Personal Info, Summary, Experience, Education, Skills, Projects, Certifications, Languages).

#### 4. AI Co-Pilot Workbench Right Panel (`src/components/resume/ai-copilot-panel.tsx`)
Build 7 interactive AI tools inside a dedicated workbench panel:
1. **AI Summary Generator**: Prompt input + 1-click apply to resume summary (`/api/ai/summary`).
2. **ARI Bullets Generator**: Action-Result-Impact bullet point generator + 1-click append to work experience (`/api/ai/bullets`).
3. **JD Skill Extractor**: Paste job description -> extract skill badges + 1-click add to skills (`/api/ai/skills`).
4. **Headline Optimizer**: Role-tailored tagline generator + 1-click apply to personal tagline.
5. **Cover Letter Drafter**: Generate custom cover letters (`/api/ai/cover-letter`) with modal preview & copy button.
6. **Interview Q&A Prep**: Generate STAR framework interview questions with modal view.
7. **ATS Keyword Scanner & Match Score**: Calculate 0-100 ATS score (`/api/ai/ats`), display green matched / amber missing keywords, and provide 1-click button to insert missing keywords into resume skills.

#### 5. Dashboard (`src/app/dashboard/page.tsx`)
- User resume dashboard displaying saved resumes, duplicate/delete/share actions, plan status badges, and resume creation limits.

#### 6. Admin Panel (`src/app/admin/`)
- Admin dashboard for tracking system metrics, active users, page views, and configuring OpenRouter API keys & custom system prompts.

### ENVIRONMENT FILE SETUP:
Include `.env` with `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `RESEND_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

Ensure all TypeScript types, Prisma schemas, and Next.js App Router routes compile without errors.
```
