import type { Metadata } from "next";
import { LegalPageLayout } from "../legal-layout/legal-page-layout";

export const metadata: Metadata = {
  title: "Terms of Service — ResumeForge | Domain Expansion",
  description: "Terms of Service for ResumeForge by Domain Expansion.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated={new Date().toLocaleDateString("en-IN")}>
      <p className="text-sm text-muted-foreground">These terms are governed by Domain Expansion, the parent company of ResumeForge.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">1. Acceptance of Terms</h2>
      <p>By using ResumeForge, a product of Domain Expansion, you agree to these Terms of Service. If you do not agree, please do not use our services.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">2. Plan Tiers & Limits</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Free:</strong> Browse templates, create 1 resume, no export.</li>
        <li><strong>Trial (₹99, 2 days):</strong> 1 resume, export enabled, contact details locked once added. Contact details cannot be changed or deleted after being entered.</li>
        <li><strong>Pro (₹499/month):</strong> Up to 5 resumes, export enabled, contact details locked per resume. Each resume's contact details cannot be changed once set.</li>
        <li><strong>Business (₹1,999/month):</strong> Unlimited resumes, full features, no contact lock — suitable for creating resumes for multiple people.</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">3. Contact Details Policy</h2>
      <p>On Trial and Pro plans, once you add contact details (email/phone) to a resume, they are permanently locked. This prevents sharing a single plan across multiple individuals. To create resumes with different contact details, upgrade to the Business plan.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">4. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Create fake or misleading resumes</li>
        <li>Share account credentials with others</li>
        <li>Use the service for fraudulent purposes</li>
        <li>Attempt to bypass plan restrictions or content protection</li>
        <li>Scrape, copy, or redistribute template designs</li>
        <li>Use automated tools to access the service without authorization</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">5. Intellectual Property</h2>
      <p>All templates, designs, code, and content are the property of Domain Expansion. You own the content you create using our tools. You may not copy, modify, or redistribute our templates without written permission.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">6. Plan Changes & Cancellation</h2>
      <p>You can change or cancel your plan at any time. The Trial plan expires after 2 days. Monthly plans can be cancelled to prevent renewal. Upon cancellation, your plan remains active until the end of the current billing period.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">7. Content Protection</h2>
      <p>Resume content is protected — right-click, copy, and save-as-image are disabled on the resume preview area. This protects both your content and our template designs.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">8. AI-Generated Content</h2>
      <p>AI features are powered by OpenRouter API. AI-generated content (summaries, bullets, cover letters) should be reviewed by you before use. Domain Expansion is not responsible for the accuracy of AI-generated content.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">9. Limitation of Liability</h2>
      <p>Domain Expansion and ResumeForge are not liable for any job application outcomes, loss of data, or business interruption. Our tools are provided "as is" without guarantees of employment or specific results. Maximum liability is limited to the amount paid in the preceding 3 months.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">10. Governing Law & Jurisdiction</h2>
      <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India. For international users, local consumer protection laws may apply where they provide greater protection.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">11. Changes to Terms</h2>
      <p>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms. Material changes will be notified via email.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">12. Contact</h2>
      <p>For questions about these terms, email admin@domainexpansion.in</p>
    </LegalPageLayout>
  );
}
