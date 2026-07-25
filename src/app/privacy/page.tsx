import type { Metadata } from "next";
import { LegalPageLayout } from "../legal-layout/legal-page-layout";

export const metadata: Metadata = {
  title: "Privacy Policy — ResumeForge | Domain Expansion",
  description: "Privacy Policy for ResumeForge by Domain Expansion. GDPR, CCPA, and IT Act 2000 compliant.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={new Date().toLocaleDateString("en-IN")}>
      <p className="text-sm text-muted-foreground">This Privacy Policy is governed by Domain Expansion, the parent company of ResumeForge.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">1. Information We Collect</h2>
      <p>We collect information you provide when you create an account, including your name, email address, and resume content. We also collect usage data such as templates used, features accessed, and device information.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>To provide and improve our resume building services</li>
        <li>To process payments and manage subscriptions</li>
        <li>To send important account notifications</li>
        <li>To personalize your experience and provide AI-powered features</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">3. Legal Basis for Processing (GDPR — EU/EEA Users)</h2>
      <p>Under the General Data Protection Regulation (GDPR), we process your personal data based on:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Consent:</strong> When you agree to receive marketing communications</li>
        <li><strong>Contract:</strong> To fulfill our service agreement with you</li>
        <li><strong>Legal obligation:</strong> To comply with applicable laws</li>
        <li><strong>Legitimate interest:</strong> To improve our services and prevent fraud</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">4. CCPA Rights (California, USA)</h2>
      <p>Under the California Consumer Privacy Act (CCPA), California residents have the right to:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Know what personal information is collected</li>
        <li>Request deletion of their personal information</li>
        <li>Opt-out of the sale of personal information (we do not sell your data)</li>
        <li>Non-discrimination for exercising privacy rights</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">5. IT Act 2000 & DPDP Act 2023 (India)</h2>
      <p>Under the Information Technology Act, 2000 and the Digital Personal Data Protection (DPDP) Act, 2023, we comply with Indian data protection regulations including:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Reasonable security practices and procedures (Section 43A)</li>
        <li>Consent-based data collection and processing</li>
        <li>Data localization requirements where applicable</li>
        <li>Right to access, correct, and erase personal data</li>
        <li>Grievance officer designation as required by IT Rules 2021</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">6. Data Security</h2>
      <p>We use industry-standard encryption (bcrypt hashing for passwords, HTTPS for data transmission) to protect your information. Your resume data is stored securely and is never shared with third parties without your consent.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">7. Contact Details Lock</h2>
      <p>Per our plan terms, contact details added to resumes on Trial (₹99) and Pro (₹499) plans are locked to prevent misuse. This ensures one plan is tied to one individual. Business plan users can create resumes for multiple people.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">8. Data Retention</h2>
      <p>We retain your data for as long as your account is active. You can request deletion of your account and all associated data at any time by contacting us. Data is deleted within 30 days of account closure.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">9. Your Rights</h2>
      <p>Depending on your jurisdiction, you have the right to:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Delete your personal data ("right to be forgotten")</li>
        <li>Restrict or object to processing</li>
        <li>Data portability</li>
        <li>Withdraw consent at any time</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">10. Cookies</h2>
      <p>We use essential cookies for authentication and session management. We do not use tracking cookies for advertising. AI processing may use third-party APIs (OpenRouter) which have their own privacy policies.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">11. International Data Transfers</h2>
      <p>Your data may be processed in countries other than your own (including India, USA, and EU). We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">12. Children's Privacy</h2>
      <p>ResumeForge is not intended for users under 16 years of age. We do not knowingly collect personal information from children under 16.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">13. Grievance Officer (India — IT Rules 2021)</h2>
      <p>For grievances related to personal data protection, contact our Grievance Officer:</p>
      <p>Email: admin@domainexpansion.in<br />Response time: Within 24-48 hours</p>

      <h2 className="text-lg font-bold mt-6 mb-2">14. Contact Us</h2>
      <p>For privacy concerns, email us at admin@domainexpansion.in</p>
    </LegalPageLayout>
  );
}
