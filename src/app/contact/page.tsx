import type { Metadata } from "next";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";

export const metadata: Metadata = {
  title: "Contact Us — Jinzai | Domain Expansion",
  description: "Contact Jinzai (人材) for support, questions, or feedback. Powered by Domain Expansion.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f5f1ec] flex flex-col">
      <PublicNav />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-12 w-full">
        <p className="text-sm font-medium text-[#626260] mb-2">Get in touch</p>
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#111111] mb-6" style={{ letterSpacing: "-1.4px" }}>
          Contact Us
        </h1>

        <div className="bg-white rounded-xl border border-[#d3cec6]/60 p-8 mb-6">
          <h2 className="font-semibold text-lg text-[#111111] mb-4">We're here to help</h2>
          <div className="space-y-3 text-sm text-[#626260]">
            <p><strong className="text-[#111111]">Email:</strong> admin@domainexpansion.in</p>
            <p><strong className="text-[#111111]">Hours:</strong> Monday–Friday, 9 AM – 6 PM IST</p>
            <p><strong className="text-[#111111]">Response Time:</strong> Within 24-48 hours</p>
          </div>
          <div className="mt-6 p-4 bg-[#f5f1ec] rounded-lg">
            <p className="text-xs text-[#7b7b78]">
              For technical support, billing questions, or feature requests, please use the Support button in the app's navigation bar or email us directly.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#d3cec6]/60 p-8">
          <h2 className="font-semibold text-lg text-[#111111] mb-4">Company</h2>
          <div className="text-sm text-[#626260] space-y-1">
            <p>Domain Expansion</p>
            <p>Bengaluru, Karnataka, India</p>
            <p>Website: domainexpansion.in</p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#d3cec6]/60">
            <h3 className="font-medium text-sm text-[#111111] mb-2">Grievance Officer (India — IT Rules 2021)</h3>
            <p className="text-xs text-[#7b7b78]">Email: admin@domainexpansion.in · Response time: Within 24-48 hours</p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
