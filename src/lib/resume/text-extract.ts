import type { ResumeData } from "./types";

// Convert resume data into a single plain-text string for ATS matching / AI context
export function resumeToText(data: ResumeData): string {
  const parts: string[] = [];
  const p = data.personalInfo;
  parts.push(`${p.fullName} — ${p.jobTitle}`);
  if (p.tagline) parts.push(p.tagline);
  const contacts = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean);
  if (contacts.length) parts.push(contacts.join(" | "));

  if (data.summary) parts.push(`\nSUMMARY\n${data.summary}`);

  if (data.experience.length) {
    parts.push("\nEXPERIENCE");
    for (const e of data.experience) {
      parts.push(`${e.position} — ${e.company}${e.location ? `, ${e.location}` : ""}`);
      if (e.description) parts.push(e.description);
      for (const a of e.achievements) parts.push(`- ${a}`);
    }
  }

  if (data.education.length) {
    parts.push("\nEDUCATION");
    for (const ed of data.education) {
      parts.push(`${ed.degree}${ed.field ? `, ${ed.field}` : ""} — ${ed.institution}${ed.gpa ? ` (GPA ${ed.gpa})` : ""}`);
      if (ed.description) parts.push(ed.description);
    }
  }

  if (data.skills.length) {
    parts.push("\nSKILLS");
    for (const s of data.skills) {
      parts.push(`${s.category}: ${s.items.join(", ")}`);
    }
  }

  if (data.projects.length) {
    parts.push("\nPROJECTS");
    for (const pr of data.projects) {
      parts.push(`${pr.name}${pr.link ? ` (${pr.link})` : ""}`);
      if (pr.description) parts.push(pr.description);
      if (pr.technologies.length) parts.push(`Tech: ${pr.technologies.join(", ")}`);
    }
  }

  if (data.certifications.length) {
    parts.push("\nCERTIFICATIONS");
    for (const c of data.certifications) {
      parts.push(`${c.name} — ${c.issuer}${c.date ? ` (${c.date})` : ""}`);
    }
  }

  if (data.languages.length) {
    parts.push(`\nLANGUAGES: ${data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}`);
  }

  for (const cs of data.customSections) {
    if (cs.items.length) {
      parts.push(`\n${cs.title.toUpperCase()}`);
      for (const it of cs.items) parts.push(`- ${it}`);
    }
  }

  return parts.join("\n");
}
