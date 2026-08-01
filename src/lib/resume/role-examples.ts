import type { ResumeData } from "./types";
import { uid } from "./sample-data";

// Pre-filled resume examples for common roles — helps users get started quickly
export interface RoleExample {
  id: string;
  label: string;
  icon: string; // emoji
  description: string;
  data: ResumeData;
}

const base: ResumeData = {
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

export const ROLE_EXAMPLES: RoleExample[] = [
  {
    id: "software-engineer",
    label: "Software Engineer",
    icon: "💻",
    description: "Full-stack developer with backend focus",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: {
        fullName: "Arjun Mehta",
        jobTitle: "Software Engineer II",
        email: "",
        phone: "",
        location: "Bengaluru, IN",
        website: "",
        linkedin: "linkedin.com/in/arjunmehta",
        github: "github.com/arjunmehta",
        photo: "",
        tagline: "Building scalable systems that serve millions.",
      },
      summary:
        "Software Engineer with 4+ years building distributed backend systems in Go and Python. Shipped services handling 50M+ daily requests at 99.99% uptime. Passionate about observability, performance, and clean APIs.",
      experience: [
        {
          id: uid(), company: "Razorpay", position: "Software Engineer II", location: "Bengaluru, IN",
          startDate: "2021-06", endDate: "", current: true,
          description: "Core payments backend team serving 10M+ merchants.",
          achievements: [
            "Redesigned the payment retry pipeline, reducing failed-payment rate by 34% and recovering ₹4.2Cr in monthly revenue.",
            "Built a Go-based idempotency layer handling 50K+ requests/sec with zero data loss.",
            "Reduced p99 latency from 800ms to 120ms by optimizing database queries and adding read replicas.",
            "Mentored 2 junior engineers; introduced code-review SLAs that cut review time by 40%.",
          ],
        },
        {
          id: uid(), company: "Swiggy", position: "Software Engineer I", location: "Bengaluru, IN",
          startDate: "2019-07", endDate: "2021-05", current: false,
          description: "Order fulfillment and delivery allocation systems.",
          achievements: [
            "Built a real-time delivery allocation service in Python serving 2M+ daily orders across 500 cities.",
            "Improved delivery-assignment accuracy by 18% using a greedy optimization algorithm.",
          ],
        },
      ],
      education: [
        {
          id: uid(), institution: "IIT Bombay", degree: "B.Tech", field: "Computer Science",
          startDate: "2015-07", endDate: "2019-05", gpa: "8.8 / 10", description: "",
        },
      ],
      skills: [
        { id: uid(), category: "Languages", items: ["Go", "Python", "TypeScript", "Java", "SQL"] },
        { id: uid(), category: "Backend", items: ["PostgreSQL", "Redis", "Kafka", "gRPC", "REST"] },
        { id: uid(), category: "Infra", items: ["AWS", "Docker", "Kubernetes", "Terraform", "Grafana"] },
      ],
      projects: [
        {
          id: uid(), name: "go-rate-limiter", description: "Open-source distributed rate limiter for Go microservices, 1.2k GitHub stars.",
          technologies: ["Go", "Redis", "Kubernetes"], link: "github.com/arjunmehta/go-rate-limiter",
          startDate: "2022-01", endDate: "",
        },
      ],
      certifications: [
        { id: uid(), name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon", date: "2022-03", expiryDate: "", credentialId: "" },
      ],
      languages: [
        { id: uid(), name: "English", proficiency: "Professional" },
        { id: uid(), name: "Hindi", proficiency: "Native" },
      ],
      customSections: [],
    },
  },
  {
    id: "product-designer",
    label: "Product Designer",
    icon: "🎨",
    description: "UX/UI designer with systems thinking",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: {
        fullName: "Aanya Sharma",
        jobTitle: "Senior Product Designer",
        email: "",
        phone: "",
        location: "Bengaluru, IN",
        website: "aanya.design",
        linkedin: "linkedin.com/in/aanyasharma",
        github: "",
        photo: "",
        tagline: "Designing human-centered products that ship.",
      },
      summary:
        "Senior Product Designer with 7+ years crafting end-to-end experiences across fintech, SaaS, and consumer mobile. I partner closely with engineering and product to turn ambiguous problems into measurable outcomes — increasing activation, reducing churn, and shipping delightful interfaces.",
      experience: [
        {
          id: uid(), company: "Razorpay", position: "Senior Product Designer", location: "Bengaluru, IN",
          startDate: "2021-06", endDate: "", current: true,
          description: "Lead designer for the merchant onboarding suite serving 10M+ businesses.",
          achievements: [
            "Redesigned onboarding flow, cutting time-to-first-payment from 4 days to 38 minutes (94% reduction).",
            "Built the Razorpay design system 'Blade' used by 40+ engineers across 6 product lines.",
            "Mentored 4 junior designers; introduced weekly design crits that raised design quality scores by 28%.",
          ],
        },
        {
          id: uid(), company: "Freshworks", position: "Product Designer", location: "Chennai, IN",
          startDate: "2018-02", endDate: "2021-05", current: false,
          description: "Owned the Freshdesk mobile experience for 60k+ support agents.",
          achievements: [
            "Shipped iOS dark mode and offline drafts, lifting mobile CSAT from 4.2 to 4.7.",
            "Drove research with 80+ agents in 6 countries; findings shaped the 2020 product roadmap.",
          ],
        },
      ],
      education: [
        {
          id: uid(), institution: "National Institute of Design", degree: "M.Des", field: "Interaction Design",
          startDate: "2014-07", endDate: "2016-05", gpa: "8.7 / 10", description: "Thesis: 'Designing trust in digital payments'.",
        },
      ],
      skills: [
        { id: uid(), category: "Design", items: ["Product Design", "Design Systems", "Prototyping", "User Research", "Accessibility (WCAG)"] },
        { id: uid(), category: "Tools", items: ["Figma", "Framer", "Principle", "After Effects", "Maze"] },
        { id: uid(), category: "Code", items: ["HTML", "CSS", "React (read-only)", "TypeScript (basics)"] },
      ],
      projects: [
        {
          id: uid(), name: "Blade Design System", description: "Open-sourced Razorpay's design system with 120+ accessible components, theming tokens, and a docs site.",
          technologies: ["Figma", "React", "Storybook"], link: "blade.razorpay.com",
          startDate: "2022-01", endDate: "",
        },
      ],
      certifications: [
        { id: uid(), name: "Nielsen Norman UX Certification", issuer: "NN/g", date: "2022-04", expiryDate: "", credentialId: "NN-2022-0481" },
      ],
      languages: [
        { id: uid(), name: "English", proficiency: "Professional" },
        { id: uid(), name: "Hindi", proficiency: "Native" },
      ],
      customSections: [],
    },
  },
  {
    id: "product-manager",
    label: "Product Manager",
    icon: "📊",
    description: "PM with growth and platform experience",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: {
        fullName: "Priya Iyer",
        jobTitle: "Senior Product Manager",
        email: "",
        phone: "",
        location: "Bengaluru, IN",
        website: "",
        linkedin: "linkedin.com/in/priyaiyer",
        github: "",
        photo: "",
        tagline: "Turning customer insights into shipped products.",
      },
      summary:
        "Senior Product Manager with 6+ years leading 0-to-1 products and scaling growth at B2B SaaS companies. Shipped features that increased activation by 45% and drove $8M ARR. Strong at cross-functional alignment, data-driven prioritization, and owning outcomes end-to-end.",
      experience: [
        {
          id: uid(), company: "Postman", position: "Senior Product Manager", location: "Bengaluru, IN",
          startDate: "2021-01", endDate: "", current: true,
          description: "Lead PM for the API collaboration platform serving 25M+ developers.",
          achievements: [
            "Launched team workspaces feature, driving a 45% increase in weekly active teams and $8M ARR impact.",
            "Prioritized and shipped 12 features based on usage analytics, improving net retention from 108% to 122%.",
            "Ran 30+ customer interviews per quarter; insights led to a redesigned onboarding flow with 32% higher completion.",
          ],
        },
        {
          id: uid(), company: "Freshworks", position: "Product Manager", location: "Bengaluru, IN",
          startDate: "2018-06", endDate: "2020-12", current: false,
          description: "Owned the Freshchat messaging product for 50k+ businesses.",
          achievements: [
            "Shipped AI-powered intent detection, reducing average response time by 41% for customers.",
            "Grew monthly active users from 15k to 48k in 18 months through targeted feature launches.",
          ],
        },
      ],
      education: [
        {
          id: uid(), institution: "IIM Bangalore", degree: "MBA", field: "Strategy & Marketing",
          startDate: "2016-06", endDate: "2018-04", gpa: "3.8 / 4.0", description: "",
        },
        {
          id: uid(), institution: "BITS Pilani", degree: "B.E", field: "Computer Science",
          startDate: "2010-07", endDate: "2014-05", gpa: "8.9 / 10", description: "",
        },
      ],
      skills: [
        { id: uid(), category: "Product", items: ["Product Strategy", "Roadmapping", "User Research", "A/B Testing", "PRDs"] },
        { id: uid(), category: "Analytics", items: ["SQL", "Amplitude", "Mixpanel", "Google Analytics", "Tableau"] },
        { id: uid(), category: "Tools", items: ["Jira", "Figma", "Notion", "Miro", "Linear"] },
      ],
      projects: [],
      certifications: [
        { id: uid(), name: "Certified Scrum Product Owner (CSPO)", issuer: "Scrum Alliance", date: "2019-08", expiryDate: "", credentialId: "" },
      ],
      languages: [
        { id: uid(), name: "English", proficiency: "Professional" },
        { id: uid(), name: "Tamil", proficiency: "Native" },
      ],
      customSections: [],
    },
  },
  {
    id: "data-scientist",
    label: "Data Scientist",
    icon: "📈",
    description: "ML engineer with production experience",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: {
        fullName: "Rohan Gupta",
        jobTitle: "Data Scientist",
        email: "",
        phone: "",
        location: "Bengaluru, IN",
        website: "",
        linkedin: "linkedin.com/in/rohangupta",
        github: "github.com/rohangupta",
        photo: "",
        tagline: "Turning data into decisions with ML.",
      },
      summary:
        "Data Scientist with 5+ years building production ML models for fintech and e-commerce. Specialize in recommendation systems, NLP, and causal inference. Models I've shipped drive ₹12Cr+ in annual revenue and serve 20M+ users.",
      experience: [
        {
          id: uid(), company: "Flipkart", position: "Data Scientist II", location: "Bengaluru, IN",
          startDate: "2020-08", endDate: "", current: true,
          description: "Recommendation and personalization team for 400M+ users.",
          achievements: [
            "Built a real-time product recommendation model using collaborative filtering, increasing CTR by 23% and driving ₹8Cr incremental revenue.",
            "Deployed a BERT-based search relevance model, reducing zero-result-rate from 12% to 4%.",
            "Built an A/B testing framework adopted by 15+ product teams, standardizing experiment analysis.",
          ],
        },
        {
          id: uid(), company: "Mu Sigma", position: "Decision Scientist", location: "Bengaluru, IN",
          startDate: "2018-07", endDate: "2020-07", current: false,
          description: "Consulted for Fortune 500 retail and CPG clients.",
          achievements: [
            "Built a churn prediction model for a telecom client, identifying 85% of at-risk customers 60 days early.",
            "Automated weekly reporting pipelines in Python, saving 20+ hours per week for the analytics team.",
          ],
        },
      ],
      education: [
        {
          id: uid(), institution: "IIT Kharagpur", degree: "B.Tech", field: "Mathematics & Computing",
          startDate: "2014-07", endDate: "2018-05", gpa: "9.1 / 10", description: "",
        },
      ],
      skills: [
        { id: uid(), category: "ML/AI", items: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "Hugging Face"] },
        { id: uid(), category: "Data", items: ["SQL", "Spark", "Pandas", "BigQuery", "Snowflake"] },
        { id: uid(), category: "Methods", items: ["NLP", "Recommendation Systems", "Causal Inference", "A/B Testing", "MLOps"] },
      ],
      projects: [
        {
          id: uid(), name: "sentiment-analyzer-api", description: "Production-ready multilingual sentiment analysis API serving 500 req/min, deployed on AWS Lambda.",
          technologies: ["Python", "FastAPI", "BERT", "AWS"], link: "github.com/rohangupta/sentiment-api",
          startDate: "2022-06", endDate: "",
        },
      ],
      certifications: [
        { id: uid(), name: "Google Professional ML Engineer", issuer: "Google", date: "2023-02", expiryDate: "", credentialId: "" },
      ],
      languages: [
        { id: uid(), name: "English", proficiency: "Professional" },
        { id: uid(), name: "Hindi", proficiency: "Native" },
      ],
      customSections: [],
    },
  },
  {
    id: "marketing-manager",
    label: "Marketing Manager",
    icon: "🚀",
    description: "Growth marketing with content and paid expertise",
    data: {
      ...JSON.parse(JSON.stringify(base)),
      personalInfo: {
        fullName: "Sneha Reddy",
        jobTitle: "Marketing Manager",
        email: "",
        phone: "",
        location: "Hyderabad, IN",
        website: "",
        linkedin: "linkedin.com/in/snehareddy",
        github: "",
        photo: "",
        tagline: "Growth marketer obsessed with data and storytelling.",
      },
      summary:
        "Marketing Manager with 6+ years driving growth for B2B SaaS and D2C brands. Led campaigns that generated 50K+ qualified leads and grew organic traffic by 3x. Expert in content strategy, paid acquisition, and marketing analytics.",
      experience: [
        {
          id: uid(), company: "Zoho", position: "Marketing Manager", location: "Chennai, IN",
          startDate: "2021-03", endDate: "", current: true,
          description: "Lead growth marketing for Zoho CRM serving 250k+ businesses.",
          achievements: [
            "Launched a content-led growth strategy that grew organic traffic by 3x (120k → 360k monthly visits) in 12 months.",
            "Managed ₹2Cr+ annual paid budget across Google, LinkedIn, and Meta, achieving a 4.2x ROAS.",
            "Built a lead-scoring model in HubSpot that increased sales-qualified leads by 38% while reducing cost-per-lead by 22%.",
          ],
        },
        {
          id: uid(), company: "Meesho", position: "Performance Marketing Specialist", location: "Bengaluru, IN",
          startDate: "2018-08", endDate: "2021-02", current: false,
          description: "Scaled user acquisition for India's #1 reselling app.",
          achievements: [
            "Managed ₹15Cr+ quarterly ad spend across Facebook and Google, acquiring 5M+ app installs at ₹18 CPI.",
            "Ran 200+ A/B tests on ad creatives, improving CTR by 45% and reducing CPA by 30%.",
          ],
        },
      ],
      education: [
        {
          id: uid(), institution: "ISB Hyderabad", degree: "MBA", field: "Marketing",
          startDate: "2016-06", endDate: "2018-05", gpa: "3.7 / 4.0", description: "",
        },
        {
          id: uid(), institution: "NIT Warangal", degree: "B.Tech", field: "Electronics",
          startDate: "2010-07", endDate: "2014-05", gpa: "8.5 / 10", description: "",
        },
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
      languages: [
        { id: uid(), name: "English", proficiency: "Professional" },
        { id: uid(), name: "Telugu", proficiency: "Native" },
        { id: uid(), name: "Hindi", proficiency: "Conversational" },
      ],
      customSections: [],
    },
  },
];

export function getRoleExample(id: string): ResumeData | null {
  const example = ROLE_EXAMPLES.find((r) => r.id === id);
  if (!example) return null;
  // Deep clone to avoid mutation
  return JSON.parse(JSON.stringify(example.data));
}
