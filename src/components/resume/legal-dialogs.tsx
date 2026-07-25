"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export type LegalPage = "privacy" | "terms" | "refund" | "contact" | "about" | null;

const LEGAL_CONTENT: Record<Exclude<LegalPage, null>, { title: string; body: React.ReactNode }> = {
  privacy: {
    title: "Privacy Policy",
    body: (
      <>
        <p className="mb-3">Last updated: {new Date().toLocaleDateString("en-IN")}</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">1. Information We Collect</h3>
        <p className="mb-3">We collect information you provide when you create an account, including your name, email address, and resume content. We also collect usage data such as templates used and features accessed.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">2. How We Use Your Information</h3>
        <p className="mb-3">Your information is used to provide and improve our resume building services, process payments, send important account notifications, and personalize your experience.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">3. Data Security</h3>
        <p className="mb-3">We use industry-standard encryption (bcrypt hashing for passwords, HTTPS for data transmission) to protect your information. Your resume data is stored securely and is never shared with third parties without your consent.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">4. Contact Details Lock</h3>
        <p className="mb-3">Per our plan terms, contact details added to resumes on Trial (₹99) and Pro (₹499) plans are locked to prevent misuse. This ensures one plan is tied to one individual. Business plan users can create resumes for multiple people.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">5. Data Retention</h3>
        <p className="mb-3">We retain your data for as long as your account is active. You can request deletion of your account and all associated data at any time by contacting us.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">6. Your Rights</h3>
        <p className="mb-3">You have the right to access, correct, or delete your personal data. You can export your resume data as JSON at any time from the editor.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">7. Contact Us</h3>
        <p>For privacy concerns, email us at privacy@resumeforge.app</p>
      </>
    ),
  },
  terms: {
    title: "Terms of Service",
    body: (
      <>
        <p className="mb-3">Last updated: {new Date().toLocaleDateString("en-IN")}</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">1. Acceptance of Terms</h3>
        <p className="mb-3">By using ResumeForge, you agree to these terms. If you do not agree, please do not use our services.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">2. Plan Tiers & Limits</h3>
        <ul className="list-disc pl-5 space-y-1 mb-3 text-sm">
          <li><strong>Free:</strong> Browse templates, create 1 resume, no export.</li>
          <li><strong>Trial (₹99, 2 days):</strong> 1 resume, export enabled, contact details locked once added. Contact details cannot be changed or deleted after being entered.</li>
          <li><strong>Pro (₹499/month):</strong> Up to 5 resumes, export enabled, contact details locked per resume. Each resume's contact details cannot be changed once set.</li>
          <li><strong>Business (₹1,999/month):</strong> Unlimited resumes, full features, no contact lock — suitable for creating resumes for multiple people.</li>
        </ul>
        <h3 className="font-semibold text-sm mb-2 mt-4">3. Contact Details Policy</h3>
        <p className="mb-3">On Trial and Pro plans, once you add contact details (email/phone) to a resume, they are permanently locked. This prevents sharing a single plan across multiple individuals. To create resumes with different contact details, upgrade to the Business plan.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">4. Acceptable Use</h3>
        <p className="mb-3">You agree not to misuse the service, including but not limited to: creating fake resumes, sharing account credentials, or using the service for fraudulent purposes.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">5. Intellectual Property</h3>
        <p className="mb-3">All templates, designs, and code are property of ResumeForge. You own the content you create using our tools.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">6. Plan Changes & Cancellation</h3>
        <p className="mb-3">You can change or cancel your plan at any time. The Trial plan expires after 2 days. Monthly plans can be cancelled to prevent renewal.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">7. Limitation of Liability</h3>
        <p>ResumeForge is not liable for any job application outcomes. Our tools are provided "as is" without guarantees of employment.</p>
      </>
    ),
  },
  refund: {
    title: "Refund Policy",
    body: (
      <>
        <p className="mb-3">Last updated: {new Date().toLocaleDateString("en-IN")}</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">1. Trial Plan (₹99)</h3>
        <p className="mb-3">The ₹99 trial plan is valid for 2 days. Due to the short duration and immediate access to premium features, trial payments are non-refundable once activated.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">2. Monthly Plans (₹499 / ₹1,999)</h3>
        <p className="mb-3">Monthly subscriptions can be cancelled at any time to prevent the next billing cycle. Refunds for the current billing period are available within 7 days of payment if the service has not been significantly used (fewer than 3 resume exports).</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">3. How to Request a Refund</h3>
        <p className="mb-3">To request a refund, email us at refunds@resumeforge.app with your account email and reason for the request. Refunds are processed within 5-7 business days.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">4. Plan Downgrade</h3>
        <p>Upon cancellation, your plan remains active until the end of the current billing period, after which it downgrades to the Free plan. Your resumes remain accessible but export is disabled.</p>
      </>
    ),
  },
  contact: {
    title: "Contact Us",
    body: (
      <>
        <h3 className="font-semibold text-sm mb-2">Get in Touch</h3>
        <p className="mb-3">We're here to help with any questions about ResumeForge.</p>
        <div className="space-y-2 text-sm">
          <p><strong>Email:</strong> support@resumeforge.app</p>
          <p><strong>Refunds:</strong> refunds@resumeforge.app</p>
          <p><strong>Privacy:</strong> privacy@resumeforge.app</p>
          <p><strong>Hours:</strong> Monday–Friday, 9 AM – 6 PM IST</p>
        </div>
        <h3 className="font-semibold text-sm mb-2 mt-4">Demo Account</h3>
        <p className="text-sm">Try our demo account: <strong>ishwar@domainexpansion.in</strong> / <strong>Domain Expansion</strong></p>
      </>
    ),
  },
  about: {
    title: "About ResumeForge",
    body: (
      <>
        <p className="mb-3">ResumeForge is a free-to-start resume builder platform offering 52 professionally designed templates that auto-adapt to your content. Our AI-powered tools help you write better summaries, generate achievement bullets, match ATS keywords, and create tailored cover letters.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">Our Mission</h3>
        <p className="mb-3">We believe everyone deserves a professional resume. Our platform makes it easy to create beautiful, ATS-friendly resumes that get you noticed by recruiters.</p>
        <h3 className="font-semibold text-sm mb-2 mt-4">Built With</h3>
        <p className="text-sm">Next.js 16, TypeScript, Tailwind CSS, Prisma, and z-ai-web-dev-sdk for AI features.</p>
      </>
    ),
  },
};

export function LegalDialog({ page, onClose }: { page: LegalPage; onClose: () => void }) {
  if (!page) return null;
  const content = LEGAL_CONTENT[page];
  if (!content) return null;

  return (
    <Dialog open={!!page} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>
            Please read this document carefully.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="text-sm text-foreground/80 leading-relaxed">
            {content.body}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export { LEGAL_CONTENT };
