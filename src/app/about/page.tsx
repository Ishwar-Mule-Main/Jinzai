import type { Metadata } from "next";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";

export const metadata: Metadata = {
  title: "About Us — Jinzai | Domain Expansion",
  description: "About Jinzai (人材) — a premier AI-powered resume builder and job seeker hub by Domain Expansion.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5f1ec] flex flex-col">
      <PublicNav />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <p className="text-sm font-medium text-[#626260] mb-2">人材 — Talent Hub</p>
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#111111] mb-6" style={{ letterSpacing: "-1.4px" }}>
          About Jinzai
        </h1>

        <div className="space-y-6 text-base text-[#626260] leading-relaxed">
          <p>
            <strong className="text-[#111111]">Jinzai</strong> (人材) — meaning "Talent" or "Human Resources" in Japanese — is a premier AI-powered resume builder and job seeker hub. A product of <strong className="text-[#111111]">Domain Expansion</strong>, we build tools that empower individuals to present their professional best.
          </p>

          <p>
            Our platform offers 72 professionally designed templates, 7 AI-powered features, and a comprehensive job seeker hub where recruiters can discover talent. We believe everyone deserves a professional resume, and our AI tools make it effortless to create one.
          </p>

          <div className="bg-white rounded-xl border border-[#d3cec6]/60 p-6">
            <h2 className="font-semibold text-lg text-[#111111] mb-3">Our Mission</h2>
            <p>
              To democratize access to professional resume building and job seeking tools. We combine cutting-edge AI with beautiful design to help job seekers present their best selves and connect with opportunities.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#d3cec6]/60 p-6">
            <h2 className="font-semibold text-lg text-[#111111] mb-3">What We Offer</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><span className="text-[#111111] font-bold">•</span> 72 resume templates (free + premium)</li>
              <li className="flex items-start gap-2"><span className="text-[#111111] font-bold">•</span> AI resume writing (summary, bullets, rewrite, cover letters)</li>
              <li className="flex items-start gap-2"><span className="text-[#111111] font-bold">•</span> ATS keyword matching and resume quality scoring</li>
              <li className="flex items-start gap-2"><span className="text-[#111111] font-bold">•</span> Resume import from PDF, DOCX, MD, TXT</li>
              <li className="flex items-start gap-2"><span className="text-[#111111] font-bold">•</span> Web profile pages for job seekers</li>
              <li className="flex items-start gap-2"><span className="text-[#111111] font-bold">•</span> Export to PDF and DOCX</li>
              <li className="flex items-start gap-2"><span className="text-[#111111] font-bold">•</span> 15 professional fonts and 5 font sizes</li>
            </ul>
          </div>

          <div className="bg-[#ebe7e1] rounded-xl p-6">
            <h2 className="font-semibold text-lg text-[#111111] mb-3">Domain Expansion</h2>
            <p className="text-sm">
              Domain Expansion is the parent company of Jinzai. Based in Bengaluru, India, we are committed to building innovative products that solve real problems for job seekers and professionals worldwide.
            </p>
            <div className="mt-3 text-xs text-[#7b7b78]">
              <p>Domain Expansion</p>
              <p>Bengaluru, Karnataka, India</p>
              <p>Email: admin@domainexpansion.in</p>
              <p>Website: domainexpansion.in</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#d3cec6]/60 p-6">
            <h2 className="font-semibold text-lg text-[#111111] mb-3">Technology</h2>
            <p className="text-sm">Built with Next.js 16, TypeScript, Tailwind CSS, Prisma, OpenRouter API (Claude 3.7 Sonnet), and Framer Motion.</p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
