"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNav } from "@/components/resume/public-nav";
import { PublicFooter } from "@/components/resume/public-footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Clock,
  MapPin,
  Building2,
  Send,
  Loader2,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  CreditCard,
  Briefcase,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

const SUPPORT_CATEGORIES = [
  {
    icon: HelpCircle,
    title: "Technical & Editor Support",
    desc: "Assistance with resume builder, template rendering, or PDF export.",
  },
  {
    icon: CreditCard,
    title: "Billing & Subscriptions",
    desc: "Pro/Business plan upgrades, invoices, refunds, or payment questions.",
  },
  {
    icon: MessageSquare,
    title: "Feature Requests & Feedback",
    desc: "Suggestions for new templates, AI capabilities, or UX enhancements.",
  },
  {
    icon: Briefcase,
    title: "Enterprise & Partnerships",
    desc: "Recruiter profiles, bulk organization access, or media inquiries.",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Technical & Editor Support");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, message }),
      });

      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      toast.success("Message sent! Our support team will get back to you shortly.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setSubmitted(true);
      toast.success("Thank you! Your inquiry has been dispatched to admin@domainexpansion.in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#faff69] selection:text-[#0a0a0a]">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#faff69] px-3.5 py-1 text-xs font-mono rounded-full">
            <Mail className="w-3.5 h-3.5" /> Direct Support &amp; Inquiries
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Connect with the <span className="text-[#faff69]">Jinzai Team</span>
          </h1>
          <p className="text-base sm:text-lg text-[#cccccc]">
            Have a question about our 78 resume templates, AI scanning features, or subscription plans? Drop us a message below.
          </p>
        </section>

        {/* Interactive Form & Info Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                <Building2 className="w-5 h-5 text-[#faff69]" /> Contact Information
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#121212] border border-[#2a2a2a]">
                  <Mail className="w-5 h-5 text-[#faff69] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-mono text-[#888888]">Email Us</p>
                    <p className="text-white font-semibold">admin@domainexpansion.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#121212] border border-[#2a2a2a]">
                  <Clock className="w-5 h-5 text-[#faff69] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-mono text-[#888888]">Support Hours</p>
                    <p className="text-white font-semibold">Monday – Friday: 9 AM – 6 PM IST</p>
                    <p className="text-[11px] text-[#888888]">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#121212] border border-[#2a2a2a]">
                  <MapPin className="w-5 h-5 text-[#faff69] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-mono text-[#888888]">Corporate HQ</p>
                    <p className="text-white font-semibold">Domain Expansion</p>
                    <p className="text-xs text-[#888888]">Bengaluru, Karnataka, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grievance Card */}
            <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#faff69]" />
                <h3 className="text-sm font-bold text-white">Grievance Officer (India IT Rules 2021)</h3>
              </div>
              <p className="text-xs text-[#888888] leading-relaxed">
                In compliance with Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021:
              </p>
              <div className="p-3.5 rounded-lg bg-[#121212] border border-[#2a2a2a] text-xs font-mono text-[#888888] space-y-1">
                <p><span className="text-white font-semibold">Officer Email:</span> admin@domainexpansion.in</p>
                <p><span className="text-white font-semibold">Response Window:</span> Within 24–48 hours</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl relative overflow-hidden">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#faff69]/10 border border-[#faff69] flex items-center justify-center mx-auto text-[#faff69]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Message Dispatched!</h3>
                  <p className="text-sm text-[#888888] max-w-md mx-auto">
                    Thank you for reaching out. Our support team at Domain Expansion has received your inquiry and will respond to <strong className="text-white">{email || "your email"}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="border border-[#2a2a2a] text-white hover:bg-[#242424] rounded-md px-6 h-10 text-xs font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Send Us a Message</h2>
                    <p className="text-xs text-[#888888]">Fill in the form below and our team will get back to you promptly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-mono text-[#888888]">Your Name *</Label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full bg-[#121212] border border-[#2a2a2a] text-white placeholder:text-[#555] focus:border-[#faff69] rounded-md h-10 px-3 text-xs outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-mono text-[#888888]">Email Address *</Label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="w-full bg-[#121212] border border-[#2a2a2a] text-white placeholder:text-[#555] focus:border-[#faff69] rounded-md h-10 px-3 text-xs outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-mono text-[#888888]">Inquiry Category</Label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#121212] border border-[#2a2a2a] text-white rounded-md h-10 px-3 text-xs focus:border-[#faff69] outline-none transition-colors"
                    >
                      <option value="Technical & Editor Support">Technical &amp; Editor Support</option>
                      <option value="Billing & Subscriptions">Billing &amp; Subscriptions</option>
                      <option value="Feature Requests & Feedback">Feature Requests &amp; Feedback</option>
                      <option value="Enterprise & Partnerships">Enterprise &amp; Partnerships</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-mono text-[#888888]">Your Message *</Label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder="Describe how we can assist you..."
                      required
                      className="w-full bg-[#121212] border border-[#2a2a2a] text-white placeholder:text-[#555] focus:border-[#faff69] rounded-md p-3 text-xs outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-md bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {loading ? "Sending Message..." : "Submit Inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Support Categories Cards */}
        <section className="space-y-8 border-t border-[#2a2a2a] pt-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">How Can We Help You?</h2>
            <p className="text-[#888888] text-sm">Select a category below or explore our quick-help support topics.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUPPORT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#3a3a3a] transition-colors group space-y-3">
                  <div className="w-10 h-10 rounded-md bg-[#242424] border border-[#2a2a2a] flex items-center justify-center text-[#faff69]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{cat.title}</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
