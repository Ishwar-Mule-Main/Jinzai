import type { Metadata } from "next";
import { LegalPageLayout } from "../legal-layout/legal-page-layout";

export const metadata: Metadata = {
  title: "Contact Us — ResumeForge | Domain Expansion",
  description: "Contact Domain Expansion for support, questions, or feedback about ResumeForge.",
};

export default function ContactPage() {
  return (
    <LegalPageLayout title="Contact Us" lastUpdated={new Date().toLocaleDateString("en-IN")}>
      <p>We're here to help with any questions about ResumeForge. Reach out to our team at Domain Expansion.</p>

      <div className="rounded-lg border p-6 bg-muted/30 mt-4">
        <h2 className="text-lg font-bold mb-3">Get in Touch</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Email:</strong> admin@domainexpansion.in</p>
          <p><strong>Hours:</strong> Monday–Friday, 9 AM – 6 PM IST</p>
          <p><strong>Response Time:</strong> Within 24-48 hours</p>
        </div>
      </div>

      <h2 className="text-lg font-bold mt-6 mb-2">Company</h2>
      <p>Domain Expansion<br />
      Bengaluru, Karnataka, India<br />
      Website: domainexpansion.in</p>

      <h2 className="text-lg font-bold mt-6 mb-2">Demo Account</h2>
      <p>Try our demo account: <strong>ishwar@domainexpansion.in</strong> / <strong>Domain Expansion</strong></p>

      <h2 className="text-lg font-bold mt-6 mb-2">Support</h2>
      <p>For technical support, billing questions, or feature requests, please use the Support button in the app's navigation bar or email us directly. Our support team is available during business hours.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">Grievance Officer (India — IT Rules 2021)</h2>
      <p>For grievances related to content or data protection under the IT Rules 2021:</p>
      <p>Email: admin@domainexpansion.in<br />Response time: Within 24-48 hours</p>
    </LegalPageLayout>
  );
}
