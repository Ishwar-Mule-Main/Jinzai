import type { Metadata } from "next";
import { LegalPageLayout } from "../legal-layout/legal-page-layout";

export const metadata: Metadata = {
  title: "Refund Policy — ResumeForge | Domain Expansion",
  description: "Refund Policy for ResumeForge by Domain Expansion.",
};

export default function RefundPage() {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated={new Date().toLocaleDateString("en-IN")}>
      <p className="text-sm text-muted-foreground">This refund policy is governed by Domain Expansion, the parent company of ResumeForge.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">1. Trial Plan (₹99)</h2>
      <p>The ₹99 trial plan is valid for 2 days. Due to the short duration and immediate access to premium features, trial payments are non-refundable once activated. The trial automatically expires after 2 days with no further charges.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">2. Monthly Plans (₹499 / ₹1,999)</h2>
      <p>Monthly subscriptions can be cancelled at any time to prevent the next billing cycle. Refunds for the current billing period are available under the following conditions:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Within 7 days of payment if the service has not been significantly used (fewer than 3 resume exports)</li>
        <li>If there is a technical issue preventing you from using the service that we cannot resolve within 48 hours</li>
        <li>If you were charged in error or without authorization</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">3. How to Request a Refund</h2>
      <p>To request a refund, email us at admin@domainexpansion.in with:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Your account email</li>
        <li>The plan you purchased</li>
        <li>Reason for the refund request</li>
        <li>Date of purchase</li>
      </ul>
      <p>Refunds are processed within 5-7 business days to the original payment method.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">4. Non-Refundable Cases</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Trial plan (₹99) after activation</li>
        <li>Monthly plans after 7 days of payment with significant usage (3+ exports)</li>
        <li>Plans cancelled after the billing period has ended</li>
        <li>Refunds for partial month usage after 14 days</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">5. Plan Downgrade</h2>
      <p>Upon cancellation, your plan remains active until the end of the current billing period, after which it downgrades to the Free plan. Your resumes remain accessible but export is disabled on the Free plan.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">6. Chargeback Policy</h2>
      <p>We encourage you to contact us before initiating a chargeback with your bank or card provider. Unwarranted chargebacks may result in account suspension.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">7. Consumer Protection Rights</h2>
      <p>Nothing in this policy limits any statutory consumer rights you may have under applicable laws in your jurisdiction, including but not limited to the Consumer Protection Act, 2019 (India), FTC regulations (USA), and EU consumer protection directives.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">8. Contact</h2>
      <p>For refund requests, email admin@domainexpansion.in</p>
    </LegalPageLayout>
  );
}
