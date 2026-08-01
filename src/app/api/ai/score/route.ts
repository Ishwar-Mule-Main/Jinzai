import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Holistic resume quality scoring — deterministic, no LLM
// Returns a 0-100 score + category breakdown + recommendations

const ACTION_VERBS = new Set([
  "led","built","shipped","drove","reduced","launched","created","designed","developed","implemented",
  "managed","owned","spearheaded","architected","optimized","improved","increased","decreased","delivered",
  "established","introduced","mentored","trained","hired","negotiated","secured","won","grew","scaled",
  "automated","streamlined","migrated","refactored","transformed","orchestrated","championed","pioneered",
  "achieved","exceeded","generated","saved","cut","boosted","accelerated","modernized","standardized",
  "founded","co-founded","coordinated","facilitated","analyzed","researched","prototyped","deployed",
]);

interface ResumeDataLite {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  experience: Array<{
    position: string;
    company: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{ degree: string; institution: string }>;
  skills: Array<{ category: string; items: string[] }>;
  projects: Array<{ name: string; description: string; technologies: string[] }>;
  certifications: unknown[];
  languages: unknown[];
}

function countQuantified(achievements: string[]): number {
  // Match numbers, percentages, currency, multipliers (3x, $2M, 94%, 10K+)
  const re = /(\$?\d+(?:[,.]\d+)*\s*(?:%|k|m|b|x|x|users?|customers?|people|hours?|days?|weeks?|months?|years?)?|\d+(?:\.\d+)?x)/i;
  return achievements.filter((a) => re.test(a)).length;
}

function countActionVerbs(achievements: string[]): number {
  return achievements.filter((a) => {
    const firstWord = (a.trim().split(/\s+/)[0] || "").toLowerCase().replace(/[^a-z]/g, "");
    return ACTION_VERBS.has(firstWord);
  }).length;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ResumeDataLite;
    const p = body.personalInfo || ({} as ResumeDataLite["personalInfo"]);
    const exp = body.experience || [];
    const allAchievements = exp.flatMap((e) => e.achievements || []);

    const categories: { name: string; score: number; max: number; detail: string }[] = [];

    // 1. Contact completeness (15 pts)
    const contactFields = [p.fullName, p.jobTitle, p.email, p.phone, p.location];
    const contactOptional = [p.website, p.linkedin, p.github].filter(Boolean);
    const contactFilled = contactFields.filter(Boolean).length;
    const contactScore = Math.round((contactFilled / contactFields.length) * 12) + Math.min(3, contactOptional.length);
    categories.push({
      name: "Contact info",
      score: Math.min(15, contactScore),
      max: 15,
      detail: `${contactFilled}/${contactFields.length} required + ${contactOptional.length} optional links`,
    });

    // 2. Summary (15 pts)
    let summaryScore = 0;
    const summaryLen = (body.summary || "").trim().length;
    if (summaryLen > 30) summaryScore += 5;
    if (summaryLen > 150) summaryScore += 5;
    if (summaryLen > 300) summaryScore += 3;
    if (summaryLen > 600) summaryScore -= 2; // too long penalty
    if (summaryLen === 0) summaryScore = 0;
    categories.push({
      name: "Professional summary",
      score: Math.max(0, Math.min(15, summaryScore)),
      max: 15,
      detail: summaryLen === 0 ? "No summary" : `${summaryLen} chars (ideal 150–500)`,
    });

    // 3. Experience depth (20 pts)
    let expScore = 0;
    if (exp.length >= 1) expScore += 6;
    if (exp.length >= 2) expScore += 4;
    if (exp.length >= 3) expScore += 3;
    if (exp.length >= 5) expScore += 2;
    const withCompany = exp.filter((e) => e.company).length;
    expScore += Math.min(5, withCompany);
    categories.push({
      name: "Experience depth",
      score: Math.min(20, expScore),
      max: 20,
      detail: `${exp.length} role${exp.length === 1 ? "" : "s"}, ${withCompany} with company name`,
    });

    // 4. Achievement quality (20 pts) — quantification + action verbs
    const totalBullets = allAchievements.length;
    const quantified = countQuantified(allAchievements);
    const withVerbs = countActionVerbs(allAchievements);
    let achScore = 0;
    if (totalBullets >= 1) achScore += 4;
    if (totalBullets >= 4) achScore += 4;
    if (totalBullets >= 8) achScore += 3;
    achScore += Math.min(5, Math.round((quantified / Math.max(1, totalBullets)) * 5));
    achScore += Math.min(4, Math.round((withVerbs / Math.max(1, totalBullets)) * 4));
    categories.push({
      name: "Achievement quality",
      score: Math.min(20, achScore),
      max: 20,
      detail: `${totalBullets} bullets · ${quantified} quantified · ${withVerbs} start with action verb`,
    });

    // 5. Skills (10 pts)
    const skillItems = (body.skills || []).flatMap((s) => s.items);
    let skillScore = 0;
    if ((body.skills || []).length >= 1) skillScore += 3;
    if (skillItems.length >= 5) skillScore += 3;
    if (skillItems.length >= 10) skillScore += 2;
    if ((body.skills || []).length >= 2) skillScore += 2; // categorized
    categories.push({
      name: "Skills",
      score: Math.min(10, skillScore),
      max: 10,
      detail: `${(body.skills || []).length} categor${(body.skills || []).length === 1 ? "y" : "ies"}, ${skillItems.length} skills`,
    });

    // 6. Education (5 pts)
    const eduScore = (body.education || []).length >= 1 ? 5 : 0;
    categories.push({
      name: "Education",
      score: eduScore,
      max: 5,
      detail: `${(body.education || []).length} entr${(body.education || []).length === 1 ? "y" : "ies"}`,
    });

    // 7. Projects (10 pts)
    let projScore = 0;
    const projects = body.projects || [];
    if (projects.length >= 1) projScore += 4;
    if (projects.length >= 2) projScore += 3;
    const withTech = projects.filter((pr) => (pr.technologies || []).length > 0).length;
    projScore += Math.min(3, withTech);
    categories.push({
      name: "Projects",
      score: Math.min(10, projScore),
      max: 10,
      detail: `${projects.length} project${projects.length === 1 ? "" : "s"}, ${withTech} with tech stack`,
    });

    // 8. Extras (5 pts) — certs + languages
    const extras = (body.certifications?.length || 0) + (body.languages?.length || 0);
    const extrasScore = Math.min(5, extras * 2);
    categories.push({
      name: "Certifications & languages",
      score: extrasScore,
      max: 5,
      detail: `${body.certifications?.length || 0} certs, ${body.languages?.length || 0} languages`,
    });

    const total = categories.reduce((s, c) => s + c.score, 0);

    // Grade
    const grade =
      total >= 85 ? "A" : total >= 70 ? "B" : total >= 55 ? "C" : total >= 40 ? "D" : "F";

    // Recommendations
    const recommendations: string[] = [];
    for (const c of categories) {
      if (c.score / c.max < 0.6) {
        if (c.name === "Professional summary") recommendations.push("Add a professional summary of 150–500 characters that highlights your role, years, and impact.");
        else if (c.name === "Achievement quality") recommendations.push("Quantify more achievements with metrics (%, $, x) and start each bullet with a strong action verb.");
        else if (c.name === "Experience depth") recommendations.push("Add more roles with company names to show career progression.");
        else if (c.name === "Skills") recommendations.push("Add 10+ skills grouped into 2+ categories for better ATS coverage.");
        else if (c.name === "Projects") recommendations.push("Add 1–2 projects with their tech stack to demonstrate hands-on work.");
        else if (c.name === "Contact info") recommendations.push("Complete all contact fields (name, title, email, phone, location) + add LinkedIn/GitHub.");
        else if (c.name === "Education") recommendations.push("Add at least one education entry.");
        else if (c.name === "Certifications & languages") recommendations.push("Add relevant certifications and languages to round out your profile.");
      }
    }
    if (allAchievements.length > 0 && quantified / allAchievements.length < 0.4) {
      recommendations.push("Only " + Math.round((quantified / allAchievements.length) * 100) + "% of your achievements have numbers. Aim for 60%+.");
    }
    if (recommendations.length === 0) recommendations.push("Excellent resume! Keep tailoring your summary and keywords to each job application.");

    return NextResponse.json({
      score: total,
      grade,
      categories,
      recommendations,
      stats: {
        totalBullets,
        quantifiedBullets: quantified,
        actionVerbBullets: withVerbs,
        skillCount: skillItems.length,
        experienceCount: exp.length,
        projectCount: (body.projects || []).length,
      },
    });
  } catch (e) {
    console.error("Resume score error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
