import type { ResumeData } from "./types";
import { uid } from "./sample-data";

// Multiple sample profiles for template thumbnails — each shows a different role
export interface SampleProfile {
  name: string;
  role: string;
  data: ResumeData;
}

const base: ResumeData = {
  personalInfo: { fullName: "", jobTitle: "", email: "", phone: "", location: "", website: "", linkedin: "", github: "", photo: "", tagline: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
};

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    name: "John Anderson",
    role: "Software Engineer",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "John Anderson", jobTitle: "Senior Software Engineer", email: "john@email.com", phone: "+1 555-0100", location: "San Francisco, CA", website: "john.dev", linkedin: "linkedin.com/in/johna", github: "github.com/johna", photo: "", tagline: "Building scalable systems that serve millions." },
      summary: "Senior Software Engineer with 8+ years building distributed systems in Go and Python. Shipped services handling 50M+ daily requests at 99.99% uptime.",
      experience: [
        { id: uid(), company: "Stripe", position: "Senior Engineer", location: "SF", startDate: "2020-06", endDate: "", current: true, description: "Payments backend team.", achievements: ["Reduced p99 latency by 85%", "Led migration to microservices"] },
        { id: uid(), company: "Airbnb", position: "Software Engineer", location: "SF", startDate: "2017-01", endDate: "2020-05", current: false, description: "Search infrastructure.", achievements: ["Built search indexing serving 200M listings"] },
      ],
      education: [{ id: uid(), institution: "Stanford University", degree: "B.S.", field: "Computer Science", startDate: "2012-09", endDate: "2016-06", gpa: "3.9", description: "" }],
      skills: [
        { id: uid(), category: "Languages", items: ["Go", "Python", "TypeScript", "Rust"] },
        { id: uid(), category: "Infrastructure", items: ["Kubernetes", "AWS", "PostgreSQL", "Redis"] },
      ],
      projects: [{ id: uid(), name: "go-rate-limiter", description: "Open-source distributed rate limiter (1.2k stars)", technologies: ["Go", "Redis"], link: "github.com/johna/go-rate-limiter", startDate: "2022-01", endDate: "" }],
      certifications: [{ id: uid(), name: "AWS Solutions Architect", issuer: "Amazon", date: "2022-03", expiryDate: "", credentialId: "" }],
      languages: [{ id: uid(), name: "English", proficiency: "Native" }],
      customSections: [],
    },
  },
  {
    name: "Sarah Chen",
    role: "Product Designer",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Sarah Chen", jobTitle: "Lead Product Designer", email: "sarah@email.com", phone: "+1 555-0200", location: "New York, NY", website: "sarah.design", linkedin: "linkedin.com/in/sarahc", github: "", photo: "", tagline: "Designing products people love." },
      summary: "Lead Product Designer with 7+ years crafting end-to-end experiences across fintech and SaaS. Partnering with engineering to ship delightful interfaces.",
      experience: [
        { id: uid(), company: "Figma", position: "Senior Designer", location: "NYC", startDate: "2021-03", endDate: "", current: true, description: "Design systems team.", achievements: ["Built component library used by 500+ engineers", "Improved design-to-code handoff by 60%"] },
        { id: uid(), company: "Asana", position: "Product Designer", location: "SF", startDate: "2018-06", endDate: "2021-02", current: false, description: "Mobile experience.", achievements: ["Redesigned mobile app, lifting CSAT to 4.8"] },
      ],
      education: [{ id: uid(), institution: "RISD", degree: "BFA", field: "Interaction Design", startDate: "2013-09", endDate: "2017-05", gpa: "3.8", description: "" }],
      skills: [
        { id: uid(), category: "Design", items: ["Figma", "Prototyping", "Design Systems", "User Research"] },
        { id: uid(), category: "Tools", items: ["Framer", "After Effects", "Maze"] },
      ],
      projects: [{ id: uid(), name: "Design System Library", description: "Open-sourced component library with 120+ accessible components", technologies: ["Figma", "React"], link: "sarah.design/library", startDate: "2022-06", endDate: "" }],
      certifications: [{ id: uid(), name: "NN/g UX Certification", issuer: "Nielsen Norman", date: "2021-04", expiryDate: "", credentialId: "" }],
      languages: [{ id: uid(), name: "English", proficiency: "Native" }, { id: uid(), name: "Mandarin", proficiency: "Conversational" }],
      customSections: [],
    },
  },
  {
    name: "Michael Rodriguez",
    role: "Product Manager",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Michael Rodriguez", jobTitle: "Senior Product Manager", email: "mike@email.com", phone: "+1 555-0300", location: "Austin, TX", website: "", linkedin: "linkedin.com/in/miker", github: "", photo: "", tagline: "Turning insights into shipped products." },
      summary: "Senior PM with 6+ years leading 0-to-1 products. Shipped features that increased activation by 45% and drove $8M ARR.",
      experience: [
        { id: uid(), company: "Notion", position: "Senior PM", location: "Austin", startDate: "2021-01", endDate: "", current: true, description: "Growth and activation.", achievements: ["Launched team workspaces, driving 45% activation increase", "Grew net retention from 108% to 122%"] },
        { id: uid(), company: "Slack", position: "Product Manager", location: "SF", startDate: "2018-06", endDate: "2020-12", current: false, description: "Messaging platform.", achievements: ["Shipped AI-powered search, reducing search time by 41%"] },
      ],
      education: [{ id: uid(), institution: "Wharton", degree: "MBA", field: "Strategy", startDate: "2014-09", endDate: "2016-05", gpa: "3.7", description: "" }],
      skills: [
        { id: uid(), category: "Product", items: ["Product Strategy", "Roadmapping", "A/B Testing", "User Research"] },
        { id: uid(), category: "Analytics", items: ["SQL", "Amplitude", "Mixpanel"] },
      ],
      projects: [],
      certifications: [{ id: uid(), name: "CSPO", issuer: "Scrum Alliance", date: "2019-08", expiryDate: "", credentialId: "" }],
      languages: [{ id: uid(), name: "English", proficiency: "Native" }, { id: uid(), name: "Spanish", proficiency: "Native" }],
      customSections: [],
    },
  },
  {
    name: "Priya Patel",
    role: "Data Scientist",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Priya Patel", jobTitle: "Data Scientist", email: "priya@email.com", phone: "+1 555-0400", location: "Seattle, WA", website: "", linkedin: "linkedin.com/in/priyap", github: "github.com/priyap", photo: "", tagline: "Turning data into decisions with ML." },
      summary: "Data Scientist with 5+ years building production ML models. Models I've shipped drive $12M+ in annual revenue and serve 20M+ users.",
      experience: [
        { id: uid(), company: "Amazon", position: "Data Scientist II", location: "Seattle", startDate: "2020-08", endDate: "", current: true, description: "Recommendation systems.", achievements: ["Built recommendation model increasing CTR by 23%", "Deployed BERT search relevance model, reducing zero-results by 67%"] },
        { id: uid(), company: "Netflix", position: "Data Scientist", location: "LA", startDate: "2018-07", endDate: "2020-07", current: false, description: "Content analytics.", achievements: ["Built churn prediction model with 85% accuracy"] },
      ],
      education: [{ id: uid(), institution: "MIT", degree: "B.S.", field: "Mathematics & CS", startDate: "2010-09", endDate: "2014-05", gpa: "3.9", description: "" }],
      skills: [
        { id: uid(), category: "ML/AI", items: ["Python", "PyTorch", "TensorFlow", "Scikit-learn"] },
        { id: uid(), category: "Data", items: ["SQL", "Spark", "BigQuery", "Pandas"] },
      ],
      projects: [{ id: uid(), name: "sentiment-api", description: "Multilingual sentiment analysis API serving 500 req/min", technologies: ["Python", "BERT", "AWS"], link: "github.com/priyap/sentiment", startDate: "2022-06", endDate: "" }],
      certifications: [{ id: uid(), name: "Google ML Engineer", issuer: "Google", date: "2023-02", expiryDate: "", credentialId: "" }],
      languages: [{ id: uid(), name: "English", proficiency: "Professional" }, { id: uid(), name: "Hindi", proficiency: "Native" }],
      customSections: [],
    },
  },
  {
    name: "Emily Johnson",
    role: "Marketing Manager",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Emily Johnson", jobTitle: "Marketing Manager", email: "emily@email.com", phone: "+1 555-0500", location: "Chicago, IL", website: "", linkedin: "linkedin.com/in/emilyj", github: "", photo: "", tagline: "Growth marketer obsessed with data." },
      summary: "Marketing Manager with 6+ years driving growth for B2B SaaS. Led campaigns that generated 50K+ qualified leads and grew organic traffic by 3x.",
      experience: [
        { id: uid(), company: "HubSpot", position: "Marketing Manager", location: "Chicago", startDate: "2021-03", endDate: "", current: true, description: "Growth marketing.", achievements: ["Grew organic traffic 3x in 12 months", "Managed $2M+ ad budget at 4.2x ROAS"] },
        { id: uid(), company: "Shopify", position: "Performance Marketing", location: "Toronto", startDate: "2018-08", endDate: "2021-02", current: false, description: "Paid acquisition.", achievements: ["Acquired 5M+ app installs at $18 CPI"] },
      ],
      education: [{ id: uid(), institution: "Kellogg", degree: "MBA", field: "Marketing", startDate: "2014-09", endDate: "2016-05", gpa: "3.7", description: "" }],
      skills: [
        { id: uid(), category: "Marketing", items: ["SEO", "Content Strategy", "Paid Acquisition", "Email Marketing"] },
        { id: uid(), category: "Analytics", items: ["Google Analytics", "HubSpot", "A/B Testing"] },
      ],
      projects: [],
      certifications: [{ id: uid(), name: "Google Ads Certified", issuer: "Google", date: "2022-06", expiryDate: "", credentialId: "" }],
      languages: [{ id: uid(), name: "English", proficiency: "Native" }],
      customSections: [],
    },
  },
];

export function getSampleProfile(index: number): ResumeData {
  return SAMPLE_PROFILES[index % SAMPLE_PROFILES.length].data;
}
