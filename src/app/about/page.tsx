import type { Metadata } from "next";
import { LegalPageLayout } from "../legal-layout/legal-page-layout";

export const metadata: Metadata = {
  title: "About Us — Jinzai | Domain Expansion",
  description: "About Jinzai and Domain Expansion — our mission, company, and technology.",
};

export default function AboutPage() {
  return (
    <LegalPageLayout title="About Jinzai" lastUpdated={new Date().toLocaleDateString("en-IN")}>
      <p>Jinzai is a product of <strong>Domain Expansion</strong>, a technology company based in Bengaluru, India. We build tools that empower individuals to present their professional best.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">Our Mission</h2>
      <p>We believe everyone deserves a professional resume. Our platform makes it easy to create beautiful, ATS-friendly resumes that get you noticed by recruiters. With 52 templates, AI-powered writing tools, and one-click export, Jinzai is the complete resume building solution.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">What We Offer</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>52 Professional Templates</strong> — including free and premium designs for every industry</li>
        <li><strong>7 AI-Powered Features</strong> — summary generation, achievement bullets, bullet rewriting, cover letters, ATS keyword matching, resume quality scoring, and skill suggestions</li>
        <li><strong>15 Professional Fonts</strong> — 5 free and 10 premium Google Fonts</li>
        <li><strong>Resume Import</strong> — paste your old resume and AI parses it automatically</li>
        <li><strong>Multi-page Support</strong> — resumes auto-paginate for longer content</li>
        <li><strong>Content Protection</strong> — your resume is protected from copying</li>
        <li><strong>Flexible Pricing</strong> — Free, Trial (₹99), Pro (₹499), and Business (₹1,999) plans</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">Domain Expansion</h2>
      <p>Domain Expansion is the parent company of Jinzai. We are committed to building innovative products that solve real problems for job seekers and professionals worldwide.</p>

      <div className="rounded-lg border p-4 bg-muted/30 mt-4">
        <p className="text-xs font-semibold mb-1">Company Details</p>
        <p className="text-xs text-muted-foreground">
          Domain Expansion<br />
          Bengaluru, Karnataka, India<br />
          Email: admin@domainexpansion.in<br />
          Website: domainexpansion.in<br />
          Founded: 2025
        </p>
      </div>

      <h2 className="text-lg font-bold mt-6 mb-2">Technology</h2>
      <p>Jinzai is built with modern technology:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Next.js 16 with App Router and TypeScript</li>
        <li>Tailwind CSS 4 with shadcn/ui component library</li>
        <li>Prisma ORM with SQLite database</li>
        <li>OpenRouter API for AI features (configurable model selection)</li>
        <li>NextAuth.js for secure authentication</li>
        <li>Zustand for state management</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">Contact</h2>
      <p>Have questions? We'd love to hear from you.</p>
      <p>Email: admin@domainexpansion.in</p>
    </LegalPageLayout>
  );
}
