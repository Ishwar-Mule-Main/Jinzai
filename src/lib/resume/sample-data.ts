import type { ResumeData } from "./types";

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emptyResume: ResumeData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    photo: "",
    tagline: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
};

export const sampleResume: ResumeData = {
  personalInfo: {
    fullName: "Aanya Sharma",
    jobTitle: "Senior Product Designer",
    email: "aanya.sharma@email.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    website: "aanya.design",
    linkedin: "linkedin.com/in/aanyasharma",
    github: "github.com/aanyasharma",
    photo: "",
    tagline: "Designing human-centered products that ship.",
  },
  summary:
    "Senior Product Designer with 7+ years crafting end-to-end experiences across fintech, SaaS, and consumer mobile. I partner closely with engineering and product to turn ambiguous problems into measurable outcomes — increasing activation, reducing churn, and shipping delightful interfaces.",
  experience: [
    {
      id: uid(),
      company: "Razorpay",
      position: "Senior Product Designer",
      location: "Bengaluru, IN",
      startDate: "2021-06",
      endDate: "",
      current: true,
      description:
        "Lead designer for the merchant onboarding suite serving 10M+ businesses.",
      achievements: [
        "Redesigned onboarding flow, cutting time-to-first-payment from 4 days to 38 minutes (94% reduction).",
        "Built the Razorpay design system 'Blade' used by 40+ engineers across 6 product lines.",
        "Mentored 4 junior designers; introduced weekly design crits that raised design quality scores by 28%.",
      ],
    },
    {
      id: uid(),
      company: "Freshworks",
      position: "Product Designer",
      location: "Chennai, IN",
      startDate: "2018-02",
      endDate: "2021-05",
      current: false,
      description:
        "Owned the Freshdesk mobile experience for 60k+ support agents.",
      achievements: [
        "Shipped iOS dark mode and offline drafts, lifting mobile CSAT from 4.2 to 4.7.",
        "Drove research with 80+ agents in 6 countries; findings shaped the 2020 product roadmap.",
      ],
    },
    {
      id: uid(),
      company: "Zoho",
      position: "UI Designer",
      location: "Chennai, IN",
      startDate: "2016-07",
      endDate: "2018-01",
      current: false,
      description: "Designed modules for Zoho CRM and Zoho Desk.",
      achievements: [
        "Created 600+ component variants adopted across 5 Zoho apps.",
        "Reduced customer-reported UI defects by 41% via a visual QA checklist.",
      ],
    },
  ],
  education: [
    {
      id: uid(),
      institution: "National Institute of Design",
      degree: "M.Des",
      field: "Interaction Design",
      startDate: "2014-07",
      endDate: "2016-05",
      gpa: "8.7 / 10",
      description: "Thesis: 'Designing trust in digital payments'.",
    },
    {
      id: uid(),
      institution: "Anna University",
      degree: "B.E",
      field: "Computer Science",
      startDate: "2010-07",
      endDate: "2014-05",
      gpa: "8.9 / 10",
      description: "",
    },
  ],
  skills: [
    {
      id: uid(),
      category: "Design",
      items: ["Product Design", "Design Systems", "Prototyping", "User Research", "Accessibility (WCAG)"],
    },
    {
      id: uid(),
      category: "Tools",
      items: ["Figma", "Framer", "Principle", "After Effects", "Maze"],
    },
    {
      id: uid(),
      category: "Code",
      items: ["HTML", "CSS", "React (read-only)", "TypeScript (basics)"],
    },
  ],
  projects: [
    {
      id: uid(),
      name: "Blade Design System",
      description:
        "Open-sourced Razorpay's design system with 120+ accessible components, theming tokens, and a docs site.",
      technologies: ["Figma", "React", "Storybook"],
      link: "blade.razorpay.com",
      startDate: "2022-01",
      endDate: "",
    },
    {
      id: uid(),
      name: "PayLater Onboarding",
      description:
        "Reimagined credit-line activation for SMBs; drove a 3.2x lift in activation and a 19% drop in support tickets.",
      technologies: ["Figma", "Maze"],
      link: "",
      startDate: "2023-03",
      endDate: "2023-08",
    },
  ],
  certifications: [
    {
      id: uid(),
      name: "Nielsen Norman UX Certification",
      issuer: "NN/g",
      date: "2022-04",
      expiryDate: "",
      credentialId: "NN-2022-0481",
    },
    {
      id: uid(),
      name: "Interaction Design Foundation Member",
      issuer: "IxDF",
      date: "2020-01",
      expiryDate: "",
      credentialId: "",
    },
  ],
  languages: [
    { id: uid(), name: "English", proficiency: "Professional" },
    { id: uid(), name: "Hindi", proficiency: "Native" },
    { id: uid(), name: "Tamil", proficiency: "Conversational" },
  ],
  customSections: [],
};

export function formatDateRange(start: string, end: string, current?: boolean) {
  if (!start && !end) return "";
  const fmt = (s: string) => {
    if (!s) return "";
    const [y, m] = s.split("-");
    if (!y) return s;
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const mi = m ? parseInt(m, 10) - 1 : -1;
    return mi >= 0 ? `${monthNames[mi]} ${y}` : y;
  };
  const s = fmt(start);
  const e = current ? "Present" : fmt(end) || "Present";
  if (!s) return e;
  if (!end && !current) return s;
  return `${s} — ${e}`;
}

// Compute which sections have content — templates use this to hide empty sections
export function getActiveSections(data: ResumeData) {
  return {
    summary: data.summary.trim().length > 0,
    experience: data.experience.length > 0,
    education: data.education.length > 0,
    skills: data.skills.length > 0,
    projects: data.projects.length > 0,
    certifications: data.certifications.length > 0,
    languages: data.languages.length > 0,
    customSections: data.customSections.filter((s) => s.items.length > 0).length > 0,
    contact:
      data.personalInfo.email ||
      data.personalInfo.phone ||
      data.personalInfo.location ||
      data.personalInfo.website ||
      data.personalInfo.linkedin ||
      data.personalInfo.github,
  };
}

export function getCompletion(data: ResumeData): number {
  const checks = [
    data.personalInfo.fullName.trim().length > 0,
    data.personalInfo.jobTitle.trim().length > 0,
    data.personalInfo.email.trim().length > 0,
    data.personalInfo.phone.trim().length > 0,
    data.summary.trim().length > 30,
    data.experience.length > 0,
    data.experience.some((e) => e.achievements.length > 0),
    data.education.length > 0,
    data.skills.length > 0,
    data.skills.some((s) => s.items.length >= 3),
    data.projects.length > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

export function ensureResumeIds(data: Partial<ResumeData>): ResumeData {
  if (!data || typeof data !== "object") {
    return JSON.parse(JSON.stringify(emptyResume));
  }

  const defaults = JSON.parse(JSON.stringify(emptyResume));
  const merged: ResumeData = {
    ...defaults,
    ...data,
    personalInfo: {
      ...defaults.personalInfo,
      ...(data.personalInfo || {}),
    },
    summary: typeof data.summary === "string" ? data.summary : "",
    experience: Array.isArray(data.experience)
      ? data.experience.map((item) => ({
          id: item.id || uid(),
          company: item.company || "",
          position: item.position || "",
          location: item.location || "",
          startDate: item.startDate || "",
          endDate: item.endDate || "",
          current: !!item.current,
          description: item.description || "",
          achievements: Array.isArray(item.achievements) ? item.achievements : [],
        }))
      : [],
    education: Array.isArray(data.education)
      ? data.education.map((item) => ({
          id: item.id || uid(),
          institution: item.institution || "",
          degree: item.degree || "",
          field: item.field || "",
          startDate: item.startDate || "",
          endDate: item.endDate || "",
          gpa: item.gpa || "",
          description: item.description || "",
        }))
      : [],
    skills: Array.isArray(data.skills)
      ? data.skills.map((item) => ({
          id: item.id || uid(),
          category: item.category || "General Skills",
          items: Array.isArray(item.items) ? item.items : [],
        }))
      : [],
    projects: Array.isArray(data.projects)
      ? data.projects.map((item) => ({
          id: item.id || uid(),
          name: item.name || "",
          description: item.description || "",
          technologies: Array.isArray(item.technologies) ? item.technologies : [],
          link: item.link || "",
        }))
      : [],
    certifications: Array.isArray(data.certifications)
      ? data.certifications.map((item) => ({
          id: item.id || uid(),
          name: item.name || "",
          issuer: item.issuer || "",
          date: item.date || "",
        }))
      : [],
    languages: Array.isArray(data.languages)
      ? data.languages.map((item) => ({
          id: item.id || uid(),
          name: item.name || "",
          proficiency: item.proficiency || "",
        }))
      : [],
    customSections: Array.isArray(data.customSections)
      ? data.customSections.map((sec) => ({
          id: sec.id || uid(),
          title: sec.title || "Custom Section",
          items: Array.isArray(sec.items)
            ? sec.items.map((it) => ({
                id: it.id || uid(),
                title: it.title || "",
                subtitle: it.subtitle || "",
                date: it.date || "",
                description: it.description || "",
              }))
            : [],
        }))
      : [],
  };

  return merged;
}
