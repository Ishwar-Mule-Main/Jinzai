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
    name: "Ishwar Mule",
    role: "Software Engineer",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Ishwar Mule", jobTitle: "Senior Software Engineer", email: "ishwar.mule@domainexpansion.in", phone: "+91 98765 43210", location: "Pune, Maharashtra", website: "ishwar.dev", linkedin: "linkedin.com/in/ishwarmule", github: "github.com/ishwarmule", photo: "", tagline: "Building scalable systems that serve millions." },
      summary: "Senior Software Engineer with 8+ years building distributed systems in Go, Python, and React. Shipped services handling 50M+ daily requests at 99.99% uptime. Passionate about clean architecture, observability, and mentoring teams.",
      experience: [
        { id: uid(), company: "Domain Expansion", position: "Senior Software Engineer", location: "Pune, IN", startDate: "2021-06", endDate: "", current: true, description: "Lead engineer for the core platform serving 10M+ users.", achievements: ["Redesigned the payment retry pipeline, reducing failed-payment rate by 34% and recovering ₹4.2Cr in monthly revenue.", "Built a Go-based idempotency layer handling 50K+ requests/sec with zero data loss.", "Reduced p99 latency from 800ms to 120ms by optimizing database queries and adding read replicas.", "Mentored 2 junior engineers; introduced code-review SLAs that cut review time by 40%."] },
        { id: uid(), company: "Razorpay", position: "Software Engineer II", location: "Bengaluru, IN", startDate: "2019-07", endDate: "2021-05", current: false, description: "Core payments backend team serving 10M+ merchants.", achievements: ["Built a real-time delivery allocation service in Python serving 2M+ daily orders across 500 cities.", "Improved delivery-assignment accuracy by 18% using a greedy optimization algorithm."] },
      ],
      education: [{ id: uid(), institution: "College of Engineering Pune", degree: "B.E.", field: "Computer Science", startDate: "2015-07", endDate: "2019-05", gpa: "8.8 / 10", description: "" }],
      skills: [
        { id: uid(), category: "Languages", items: ["Go", "Python", "TypeScript", "Java", "SQL"] },
        { id: uid(), category: "Backend", items: ["PostgreSQL", "Redis", "Kafka", "gRPC", "REST"] },
        { id: uid(), category: "Infra", items: ["AWS", "Docker", "Kubernetes", "Terraform", "Grafana"] },
      ],
      projects: [{ id: uid(), name: "go-rate-limiter", description: "Open-source distributed rate limiter for Go microservices, 1.2k GitHub stars.", technologies: ["Go", "Redis", "Kubernetes"], link: "github.com/ishwarmule/go-rate-limiter", startDate: "2022-01", endDate: "" }],
      certifications: [{ id: uid(), name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon", date: "2022-03", expiryDate: "", credentialId: "" }],
      languages: [{ id: uid(), name: "English", proficiency: "Professional" }, { id: uid(), name: "Hindi", proficiency: "Native" }, { id: uid(), name: "Marathi", proficiency: "Native" }],
      customSections: [],
    },
  },
  {
    name: "Ishwar Mule",
    role: "Product Designer",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Ishwar Mule", jobTitle: "Lead Product Designer", email: "ishwar.design@domainexpansion.in", phone: "+91 98765 43211", location: "Mumbai, Maharashtra", website: "ishwar.design", linkedin: "linkedin.com/in/ishwardesign", github: "", photo: "", tagline: "Designing products people love." },
      summary: "Lead Product Designer with 7+ years crafting end-to-end experiences across fintech, SaaS, and consumer mobile. Partnering with engineering to ship delightful interfaces that drive measurable outcomes.",
      experience: [
        { id: uid(), company: "Domain Expansion", position: "Lead Product Designer", location: "Mumbai, IN", startDate: "2021-06", endDate: "", current: true, description: "Lead designer for the product suite serving 10M+ users.", achievements: ["Redesigned onboarding flow, cutting time-to-first-action from 4 days to 38 minutes (94% reduction).", "Built the design system used by 40+ engineers across 6 product lines.", "Mentored 4 junior designers; introduced weekly design crits that raised design quality scores by 28%."] },
        { id: uid(), company: "Freshworks", position: "Product Designer", location: "Chennai, IN", startDate: "2018-02", endDate: "2021-05", current: false, description: "Owned the mobile experience for 60k+ support agents.", achievements: ["Shipped iOS dark mode and offline drafts, lifting mobile CSAT from 4.2 to 4.7.", "Drove research with 80+ agents in 6 countries; findings shaped the 2020 product roadmap."] },
      ],
      education: [{ id: uid(), institution: "National Institute of Design", degree: "M.Des", field: "Interaction Design", startDate: "2014-07", endDate: "2016-05", gpa: "8.7 / 10", description: "Thesis: 'Designing trust in digital payments'." }],
      skills: [
        { id: uid(), category: "Design", items: ["Product Design", "Design Systems", "Prototyping", "User Research", "Accessibility (WCAG)"] },
        { id: uid(), category: "Tools", items: ["Figma", "Framer", "Principle", "After Effects", "Maze"] },
        { id: uid(), category: "Code", items: ["HTML", "CSS", "React (read-only)", "TypeScript (basics)"] },
      ],
      projects: [{ id: uid(), name: "Design System Library", description: "Open-sourced component library with 120+ accessible components, theming tokens, and a docs site.", technologies: ["Figma", "React", "Storybook"], link: "ishwar.design/library", startDate: "2022-01", endDate: "" }],
      certifications: [{ id: uid(), name: "Nielsen Norman UX Certification", issuer: "NN/g", date: "2022-04", expiryDate: "", credentialId: "NN-2022-0481" }],
      languages: [{ id: uid(), name: "English", proficiency: "Professional" }, { id: uid(), name: "Hindi", proficiency: "Native" }, { id: uid(), name: "Marathi", proficiency: "Native" }],
      customSections: [],
    },
  },
  {
    name: "Ishwar Mule",
    role: "Product Manager",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Ishwar Mule", jobTitle: "Senior Product Manager", email: "ishwar.pm@domainexpansion.in", phone: "+91 98765 43212", location: "Bengaluru, Karnataka", website: "", linkedin: "linkedin.com/in/ishwarpm", github: "", photo: "", tagline: "Turning customer insights into shipped products." },
      summary: "Senior Product Manager with 6+ years leading 0-to-1 products and scaling growth at B2B SaaS companies. Shipped features that increased activation by 45% and drove ₹8M ARR. Strong at cross-functional alignment and data-driven prioritization.",
      experience: [
        { id: uid(), company: "Domain Expansion", position: "Senior Product Manager", location: "Bengaluru, IN", startDate: "2021-01", endDate: "", current: true, description: "Lead PM for the platform serving 25M+ users.", achievements: ["Launched team workspaces feature, driving a 45% increase in weekly active teams and ₹8M ARR impact.", "Prioritized and shipped 12 features based on usage analytics, improving net retention from 108% to 122%.", "Ran 30+ customer interviews per quarter; insights led to a redesigned onboarding flow with 32% higher completion."] },
        { id: uid(), company: "Freshworks", position: "Product Manager", location: "Bengaluru, IN", startDate: "2018-06", endDate: "2020-12", current: false, description: "Owned the messaging product for 50k+ businesses.", achievements: ["Shipped AI-powered intent detection, reducing average response time by 41% for customers.", "Grew monthly active users from 15k to 48k in 18 months through targeted feature launches."] },
      ],
      education: [
        { id: uid(), institution: "IIM Bangalore", degree: "MBA", field: "Strategy & Marketing", startDate: "2016-06", endDate: "2018-04", gpa: "3.8 / 4.0", description: "" },
        { id: uid(), institution: "COEP Pune", degree: "B.E.", field: "Computer Science", startDate: "2010-07", endDate: "2014-05", gpa: "8.9 / 10", description: "" },
      ],
      skills: [
        { id: uid(), category: "Product", items: ["Product Strategy", "Roadmapping", "User Research", "A/B Testing", "PRDs"] },
        { id: uid(), category: "Analytics", items: ["SQL", "Amplitude", "Mixpanel", "Google Analytics", "Tableau"] },
        { id: uid(), category: "Tools", items: ["Jira", "Figma", "Notion", "Miro", "Linear"] },
      ],
      projects: [],
      certifications: [{ id: uid(), name: "Certified Scrum Product Owner (CSPO)", issuer: "Scrum Alliance", date: "2019-08", expiryDate: "", credentialId: "" }],
      languages: [{ id: uid(), name: "English", proficiency: "Professional" }, { id: uid(), name: "Hindi", proficiency: "Native" }, { id: uid(), name: "Marathi", proficiency: "Native" }],
      customSections: [],
    },
  },
  {
    name: "Ishwar Mule",
    role: "Data Scientist",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Ishwar Mule", jobTitle: "Data Scientist", email: "ishwar.ds@domainexpansion.in", phone: "+91 98765 43213", location: "Hyderabad, Telangana", website: "", linkedin: "linkedin.com/in/ishwardata", github: "github.com/ishwardata", photo: "", tagline: "Turning data into decisions with ML." },
      summary: "Data Scientist with 5+ years building production ML models for fintech and e-commerce. Specialize in recommendation systems, NLP, and causal inference. Models I've shipped drive ₹12Cr+ in annual revenue and serve 20M+ users.",
      experience: [
        { id: uid(), company: "Domain Expansion", position: "Data Scientist II", location: "Hyderabad, IN", startDate: "2020-08", endDate: "", current: true, description: "Recommendation and personalization team for 400M+ users.", achievements: ["Built a real-time product recommendation model using collaborative filtering, increasing CTR by 23% and driving ₹8Cr incremental revenue.", "Deployed a BERT-based search relevance model, reducing zero-result-rate from 12% to 4%.", "Built an A/B testing framework adopted by 15+ product teams, standardizing experiment analysis."] },
        { id: uid(), company: "Flipkart", position: "Decision Scientist", location: "Bengaluru, IN", startDate: "2018-07", endDate: "2020-07", current: false, description: "Consulted for Fortune 500 retail and CPG clients.", achievements: ["Built a churn prediction model for a telecom client, identifying 85% of at-risk customers 60 days early.", "Automated weekly reporting pipelines in Python, saving 20+ hours per week for the analytics team."] },
      ],
      education: [{ id: uid(), institution: "IIT Kharagpur", degree: "B.Tech", field: "Mathematics & Computing", startDate: "2014-07", endDate: "2018-05", gpa: "9.1 / 10", description: "" }],
      skills: [
        { id: uid(), category: "ML/AI", items: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "Hugging Face"] },
        { id: uid(), category: "Data", items: ["SQL", "Spark", "Pandas", "BigQuery", "Snowflake"] },
        { id: uid(), category: "Methods", items: ["NLP", "Recommendation Systems", "Causal Inference", "A/B Testing", "MLOps"] },
      ],
      projects: [{ id: uid(), name: "sentiment-analyzer-api", description: "Production-ready multilingual sentiment analysis API serving 500 req/min, deployed on AWS Lambda.", technologies: ["Python", "FastAPI", "BERT", "AWS"], link: "github.com/ishwardata/sentiment-api", startDate: "2022-06", endDate: "" }],
      certifications: [{ id: uid(), name: "Google Professional ML Engineer", issuer: "Google", date: "2023-02", expiryDate: "", credentialId: "" }],
      languages: [{ id: uid(), name: "English", proficiency: "Professional" }, { id: uid(), name: "Hindi", proficiency: "Native" }, { id: uid(), name: "Marathi", proficiency: "Native" }],
      customSections: [],
    },
  },
  {
    name: "Ishwar Mule",
    role: "Marketing Manager",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Ishwar Mule", jobTitle: "Marketing Manager", email: "ishwar.mkt@domainexpansion.in", phone: "+91 98765 43214", location: "Delhi, NCR", website: "", linkedin: "linkedin.com/in/ishwarmkt", github: "", photo: "", tagline: "Growth marketer obsessed with data and storytelling." },
      summary: "Marketing Manager with 6+ years driving growth for B2B SaaS and D2C brands. Led campaigns that generated 50K+ qualified leads and grew organic traffic by 3x. Expert in content strategy, paid acquisition, and marketing analytics.",
      experience: [
        { id: uid(), company: "Domain Expansion", position: "Marketing Manager", location: "Delhi, IN", startDate: "2021-03", endDate: "", current: true, description: "Lead growth marketing for the platform serving 250k+ businesses.", achievements: ["Launched a content-led growth strategy that grew organic traffic by 3x (120k → 360k monthly visits) in 12 months.", "Managed ₹2Cr+ annual paid budget across Google, LinkedIn, and Meta, achieving a 4.2x ROAS.", "Built a lead-scoring model in HubSpot that increased sales-qualified leads by 38% while reducing cost-per-lead by 22%."] },
        { id: uid(), company: "Meesho", position: "Performance Marketing Specialist", location: "Bengaluru, IN", startDate: "2018-08", endDate: "2021-02", current: false, description: "Scaled user acquisition for India's #1 reselling app.", achievements: ["Managed ₹15Cr+ quarterly ad spend across Facebook and Google, acquiring 5M+ app installs at ₹18 CPI.", "Ran 200+ A/B tests on ad creatives, improving CTR by 45% and reducing CPA by 30%."] },
      ],
      education: [
        { id: uid(), institution: "ISB Hyderabad", degree: "MBA", field: "Marketing", startDate: "2016-06", endDate: "2018-05", gpa: "3.7 / 4.0", description: "" },
        { id: uid(), institution: "COEP Pune", degree: "B.E.", field: "Electronics", startDate: "2010-07", endDate: "2014-05", gpa: "8.5 / 10", description: "" },
      ],
      skills: [
        { id: uid(), category: "Marketing", items: ["Content Strategy", "SEO", "Paid Acquisition", "Email Marketing", "Brand"] },
        { id: uid(), category: "Analytics", items: ["Google Analytics", "HubSpot", "Mixpanel", "A/B Testing", "SQL"] },
        { id: uid(), category: "Tools", items: ["Figma", "Canva", "Mailchimp", "Google Ads", "Meta Ads"] },
      ],
      projects: [],
      certifications: [
        { id: uid(), name: "Google Ads Search Certification", issuer: "Google", date: "2022-06", expiryDate: "", credentialId: "" },
        { id: uid(), name: "HubSpot Inbound Marketing Certified", issuer: "HubSpot", date: "2021-09", expiryDate: "", credentialId: "" },
      ],
      languages: [{ id: uid(), name: "English", proficiency: "Professional" }, { id: uid(), name: "Hindi", proficiency: "Native" }, { id: uid(), name: "Marathi", proficiency: "Native" }],
      customSections: [],
    },
  },
];

export function getSampleProfile(index: number): ResumeData {
  return SAMPLE_PROFILES[index % SAMPLE_PROFILES.length].data;
}
