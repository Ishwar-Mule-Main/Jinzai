import type { ResumeData } from "./types";
import { uid } from "./sample-data";

// Multiple sample profiles for template thumbnails — each shows a different role
export interface SampleProfile {
  name: string;
  role: string;
  data: ResumeData;
}

const PHOTO = "/ishwar-photo.png";

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
      personalInfo: { fullName: "Ishwar Mule", jobTitle: "Founder & CEO · Senior Software Engineer", email: "ishwar.mule@domainexpansion.in", phone: "+91 98765 43210", location: "Pune, Maharashtra", website: "domainexpansion.in", linkedin: "linkedin.com/in/ishwarmule", github: "github.com/ishwarmule", photo: PHOTO, tagline: "Building scalable systems at Domain Expansion." },
      summary: "Founder & CEO of Domain Expansion. 8+ years building distributed systems in Go, Python, and React. Shipped services handling 50M+ daily requests at 99.99% uptime.",
      experience: [
        { id: uid(), company: "Domain Expansion", position: "Founder & CEO", location: "Pune, IN", startDate: "2021-06", endDate: "", current: true, description: "Leading product, engineering, and growth.", achievements: ["Redesigned payment retry pipeline, reducing failed payments by 34% and recovering ₹4.2Cr monthly.", "Built Go-based idempotency layer handling 50K+ req/sec with zero data loss.", "Reduced p99 latency from 800ms to 120ms via query optimization and read replicas."] },
        { id: uid(), company: "Razorpay", position: "Software Engineer II", location: "Bengaluru, IN", startDate: "2019-07", endDate: "2021-05", current: false, description: "Core payments backend.", achievements: ["Built real-time allocation service serving 2M+ daily orders across 500 cities.", "Improved delivery-assignment accuracy by 18% using greedy optimization."] },
      ],
      education: [{ id: uid(), institution: "College of Engineering Pune", degree: "B.E.", field: "Computer Science", startDate: "2015-07", endDate: "2019-05", gpa: "8.8 / 10", description: "" }],
      skills: [
        { id: uid(), category: "Languages", items: ["Go", "Python", "TypeScript", "Java", "SQL"] },
        { id: uid(), category: "Backend", items: ["PostgreSQL", "Redis", "Kafka", "gRPC"] },
        { id: uid(), category: "Infra", items: ["AWS", "Docker", "Kubernetes", "Terraform"] },
      ],
      projects: [{ id: uid(), name: "go-rate-limiter", description: "Open-source distributed rate limiter, 1.2k GitHub stars.", technologies: ["Go", "Redis", "K8s"], link: "github.com/ishwarmule/go-rate-limiter", startDate: "2022-01", endDate: "" }],
      certifications: [{ id: uid(), name: "AWS Solutions Architect Associate", issuer: "Amazon", date: "2022-03", expiryDate: "", credentialId: "" }],
      languages: [{ id: uid(), name: "English", proficiency: "Professional" }, { id: uid(), name: "Hindi", proficiency: "Native" }, { id: uid(), name: "Marathi", proficiency: "Native" }],
      customSections: [],
    },
  },
  {
    name: "Ishwar Mule",
    role: "Product Designer",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Ishwar Mule", jobTitle: "Founder & CEO · Lead Product Designer", email: "ishwar.design@domainexpansion.in", phone: "+91 98765 43211", location: "Mumbai, Maharashtra", website: "domainexpansion.in", linkedin: "linkedin.com/in/ishwardesign", github: "", photo: PHOTO, tagline: "Designing products people love." },
      summary: "Founder & CEO of Domain Expansion. Lead Product Designer with 7+ years crafting end-to-end experiences across fintech, SaaS, and consumer mobile.",
      experience: [
        { id: uid(), company: "Domain Expansion", position: "Founder & Lead Designer", location: "Mumbai, IN", startDate: "2021-06", endDate: "", current: true, description: "Leading design and product vision.", achievements: ["Redesigned onboarding, cutting time-to-first-action by 94%.", "Built design system used by 40+ engineers across 6 product lines.", "Mentored 4 designers; raised design quality scores by 28%."] },
        { id: uid(), company: "Freshworks", position: "Product Designer", location: "Chennai, IN", startDate: "2018-02", endDate: "2021-05", current: false, description: "Mobile experience for 60k+ agents.", achievements: ["Shipped iOS dark mode, lifting CSAT from 4.2 to 4.7.", "Drove research with 80+ agents in 6 countries."] },
      ],
      education: [{ id: uid(), institution: "National Institute of Design", degree: "M.Des", field: "Interaction Design", startDate: "2014-07", endDate: "2016-05", gpa: "8.7 / 10", description: "" }],
      skills: [
        { id: uid(), category: "Design", items: ["Product Design", "Design Systems", "Prototyping", "User Research"] },
        { id: uid(), category: "Tools", items: ["Figma", "Framer", "After Effects", "Maze"] },
        { id: uid(), category: "Code", items: ["HTML", "CSS", "React", "TypeScript"] },
      ],
      projects: [{ id: uid(), name: "Design System Library", description: "120+ accessible components with theming tokens.", technologies: ["Figma", "React", "Storybook"], link: "domainexpansion.in/library", startDate: "2022-01", endDate: "" }],
      certifications: [{ id: uid(), name: "NN/g UX Certification", issuer: "Nielsen Norman", date: "2022-04", expiryDate: "", credentialId: "" }],
      languages: [{ id: uid(), name: "English", proficiency: "Professional" }, { id: uid(), name: "Hindi", proficiency: "Native" }, { id: uid(), name: "Marathi", proficiency: "Native" }],
      customSections: [],
    },
  },
  {
    name: "Ishwar Mule",
    role: "Product Manager",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Ishwar Mule", jobTitle: "Founder & CEO · Senior Product Manager", email: "ishwar.pm@domainexpansion.in", phone: "+91 98765 43212", location: "Bengaluru, Karnataka", website: "domainexpansion.in", linkedin: "linkedin.com/in/ishwarpm", github: "", photo: PHOTO, tagline: "Turning insights into shipped products." },
      summary: "Founder & CEO of Domain Expansion. Senior PM with 6+ years leading 0-to-1 products. Shipped features that increased activation by 45% and drove ₹8M ARR.",
      experience: [
        { id: uid(), company: "Domain Expansion", position: "Founder & Senior PM", location: "Bengaluru, IN", startDate: "2021-01", endDate: "", current: true, description: "Leading product strategy and execution.", achievements: ["Launched team workspaces, driving 45% activation increase and ₹8M ARR.", "Shipped 12 features improving net retention from 108% to 122%.", "Ran 30+ customer interviews per quarter."] },
        { id: uid(), company: "Freshworks", position: "Product Manager", location: "Bengaluru, IN", startDate: "2018-06", endDate: "2020-12", current: false, description: "Messaging product for 50k+ businesses.", achievements: ["Shipped AI-powered intent detection, reducing response time by 41%.", "Grew MAU from 15k to 48k in 18 months."] },
      ],
      education: [
        { id: uid(), institution: "IIM Bangalore", degree: "MBA", field: "Strategy & Marketing", startDate: "2016-06", endDate: "2018-04", gpa: "3.8 / 4.0", description: "" },
        { id: uid(), institution: "COEP Pune", degree: "B.E.", field: "Computer Science", startDate: "2010-07", endDate: "2014-05", gpa: "8.9 / 10", description: "" },
      ],
      skills: [
        { id: uid(), category: "Product", items: ["Product Strategy", "Roadmapping", "A/B Testing", "User Research"] },
        { id: uid(), category: "Analytics", items: ["SQL", "Amplitude", "Mixpanel", "Tableau"] },
        { id: uid(), category: "Tools", items: ["Jira", "Figma", "Notion", "Miro"] },
      ],
      projects: [],
      certifications: [{ id: uid(), name: "CSPO", issuer: "Scrum Alliance", date: "2019-08", expiryDate: "", credentialId: "" }],
      languages: [{ id: uid(), name: "English", proficiency: "Professional" }, { id: uid(), name: "Hindi", proficiency: "Native" }, { id: uid(), name: "Marathi", proficiency: "Native" }],
      customSections: [],
    },
  },
  {
    name: "Ishwar Mule",
    role: "Data Scientist",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Ishwar Mule", jobTitle: "Founder & CEO · Data Scientist", email: "ishwar.ds@domainexpansion.in", phone: "+91 98765 43213", location: "Hyderabad, Telangana", website: "domainexpansion.in", linkedin: "linkedin.com/in/ishwardata", github: "github.com/ishwardata", photo: PHOTO, tagline: "Turning data into decisions with ML." },
      summary: "Founder & CEO of Domain Expansion. Data Scientist with 5+ years building production ML models. Models shipped drive ₹12Cr+ annual revenue and serve 20M+ users.",
      experience: [
        { id: uid(), company: "Domain Expansion", position: "Founder & Data Scientist", location: "Hyderabad, IN", startDate: "2020-08", endDate: "", current: true, description: "ML and personalization lead.", achievements: ["Built recommendation model increasing CTR by 23%, driving ₹8Cr revenue.", "Deployed BERT search relevance model, reducing zero-results from 12% to 4%.", "Built A/B testing framework adopted by 15+ teams."] },
        { id: uid(), company: "Flipkart", position: "Decision Scientist", location: "Bengaluru, IN", startDate: "2018-07", endDate: "2020-07", current: false, description: "Retail and CPG analytics.", achievements: ["Built churn prediction model with 85% accuracy, 60 days early.", "Automated reporting pipelines, saving 20+ hours weekly."] },
      ],
      education: [{ id: uid(), institution: "IIT Kharagpur", degree: "B.Tech", field: "Mathematics & Computing", startDate: "2014-07", endDate: "2018-05", gpa: "9.1 / 10", description: "" }],
      skills: [
        { id: uid(), category: "ML/AI", items: ["Python", "PyTorch", "TensorFlow", "Scikit-learn"] },
        { id: uid(), category: "Data", items: ["SQL", "Spark", "BigQuery", "Pandas"] },
        { id: uid(), category: "Methods", items: ["NLP", "Recommendations", "A/B Testing", "MLOps"] },
      ],
      projects: [{ id: uid(), name: "sentiment-analyzer-api", description: "Multilingual sentiment API serving 500 req/min.", technologies: ["Python", "BERT", "AWS"], link: "github.com/ishwardata/sentiment-api", startDate: "2022-06", endDate: "" }],
      certifications: [{ id: uid(), name: "Google ML Engineer", issuer: "Google", date: "2023-02", expiryDate: "", credentialId: "" }],
      languages: [{ id: uid(), name: "English", proficiency: "Professional" }, { id: uid(), name: "Hindi", proficiency: "Native" }, { id: uid(), name: "Marathi", proficiency: "Native" }],
      customSections: [],
    },
  },
  {
    name: "Ishwar Mule",
    role: "Marketing Manager",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: { fullName: "Ishwar Mule", jobTitle: "Founder & CEO · Marketing Manager", email: "ishwar.mkt@domainexpansion.in", phone: "+91 98765 43214", location: "Delhi, NCR", website: "domainexpansion.in", linkedin: "linkedin.com/in/ishwarmkt", github: "", photo: PHOTO, tagline: "Growth marketer obsessed with data." },
      summary: "Founder & CEO of Domain Expansion. Marketing Manager with 6+ years driving growth for B2B SaaS. Led campaigns generating 50K+ leads and 3x organic traffic growth.",
      experience: [
        { id: uid(), company: "Domain Expansion", position: "Founder & Marketing Lead", location: "Delhi, IN", startDate: "2021-03", endDate: "", current: true, description: "Leading growth and marketing.", achievements: ["Grew organic traffic 3x in 12 months via content strategy.", "Managed ₹2Cr+ ad budget at 4.2x ROAS.", "Built lead-scoring model increasing SQLs by 38%."] },
        { id: uid(), company: "Meesho", position: "Performance Marketing", location: "Bengaluru, IN", startDate: "2018-08", endDate: "2021-02", current: false, description: "User acquisition for India's #1 reselling app.", achievements: ["Managed ₹15Cr+ quarterly spend, acquiring 5M+ installs at ₹18 CPI.", "Ran 200+ A/B tests, improving CTR by 45%."] },
      ],
      education: [
        { id: uid(), institution: "ISB Hyderabad", degree: "MBA", field: "Marketing", startDate: "2016-06", endDate: "2018-05", gpa: "3.7 / 4.0", description: "" },
        { id: uid(), institution: "COEP Pune", degree: "B.E.", field: "Electronics", startDate: "2010-07", endDate: "2014-05", gpa: "8.5 / 10", description: "" },
      ],
      skills: [
        { id: uid(), category: "Marketing", items: ["SEO", "Content Strategy", "Paid Acquisition", "Email Marketing"] },
        { id: uid(), category: "Analytics", items: ["Google Analytics", "HubSpot", "A/B Testing", "SQL"] },
        { id: uid(), category: "Tools", items: ["Figma", "Canva", "Google Ads", "Meta Ads"] },
      ],
      projects: [],
      certifications: [
        { id: uid(), name: "Google Ads Certified", issuer: "Google", date: "2022-06", expiryDate: "", credentialId: "" },
        { id: uid(), name: "HubSpot Inbound Certified", issuer: "HubSpot", date: "2021-09", expiryDate: "", credentialId: "" },
      ],
      languages: [{ id: uid(), name: "English", proficiency: "Professional" }, { id: uid(), name: "Hindi", proficiency: "Native" }, { id: uid(), name: "Marathi", proficiency: "Native" }],
      customSections: [],
    },
  },
];

export function getSampleProfile(index: number): ResumeData {
  return SAMPLE_PROFILES[index % SAMPLE_PROFILES.length].data;
}
