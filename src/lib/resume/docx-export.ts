import type { ResumeData } from "./types";
import { formatDateRange } from "./sample-data";

// Generate a .doc file (Word-compatible HTML) from resume data
// This produces a single-file .doc that opens in Microsoft Word, Google Docs, etc.
export function resumeToDocHtml(data: ResumeData, accentColor: string): string {
  const p = data.personalInfo;
  const contacts = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean);

  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const sections: string[] = [];

  // Header
  sections.push(`
    <div style="border-bottom: 3px solid ${accentColor}; padding-bottom: 12px; margin-bottom: 20px;">
      <p style="font-size: 26pt; font-weight: bold; color: ${accentColor}; margin: 0; font-family: Georgia, serif;">${escapeHtml(p.fullName || "Your Name")}</p>
      ${p.jobTitle ? `<p style="font-size: 13pt; color: #555; margin: 2px 0 0; font-style: italic;">${escapeHtml(p.jobTitle)}</p>` : ""}
      ${p.tagline ? `<p style="font-size: 10pt; color: #777; margin: 4px 0 0; font-style: italic;">${escapeHtml(p.tagline)}</p>` : ""}
      ${contacts.length > 0 ? `<p style="font-size: 9pt; color: #666; margin: 6px 0 0;">${contacts.map(escapeHtml).join(" &nbsp;|&nbsp; ")}</p>` : ""}
    </div>
  `);

  // Summary
  if (data.summary.trim()) {
    sections.push(`
      <p style="font-size: 11pt; font-weight: bold; color: ${accentColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 16px 0 8px;">Profile</p>
      <p style="font-size: 10pt; line-height: 1.5; text-align: justify; margin: 0;">${escapeHtml(data.summary)}</p>
    `);
  }

  // Experience
  if (data.experience.length > 0) {
    const items = data.experience.map((e) => `
      <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between;">
          <p style="font-size: 11pt; font-weight: bold; margin: 0;">${escapeHtml(e.position)}${e.company ? `, <span style="font-style: italic; font-weight: normal;">${escapeHtml(e.company)}</span>` : ""}</p>
          <p style="font-size: 9pt; color: #777; font-style: italic; margin: 0;">${escapeHtml(formatDateRange(e.startDate, e.endDate, e.current))}</p>
        </div>
        ${e.location ? `<p style="font-size: 9pt; color: #777; margin: 1px 0 3px;">${escapeHtml(e.location)}</p>` : ""}
        ${e.description ? `<p style="font-size: 10pt; margin: 2px 0;">${escapeHtml(e.description)}</p>` : ""}
        ${e.achievements.length > 0 ? `<ul style="font-size: 10pt; margin: 4px 0 0; padding-left: 20px;">${e.achievements.map((a) => `<li style="margin-bottom: 2px;">${escapeHtml(a)}</li>`).join("")}</ul>` : ""}
      </div>
    `).join("");
    sections.push(`
      <p style="font-size: 11pt; font-weight: bold; color: ${accentColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 16px 0 8px;">Experience</p>
      ${items}
    `);
  }

  // Education
  if (data.education.length > 0) {
    const items = data.education.map((ed) => `
      <div style="margin-bottom: 6px;">
        <div style="display: flex; justify-content: space-between;">
          <p style="font-size: 10pt; font-weight: bold; margin: 0;">${escapeHtml(ed.degree)}${ed.field ? `, ${escapeHtml(ed.field)}` : ""}</p>
          <p style="font-size: 9pt; color: #777; font-style: italic; margin: 0;">${escapeHtml(formatDateRange(ed.startDate, ed.endDate))}</p>
        </div>
        <p style="font-size: 10pt; margin: 1px 0;">${escapeHtml(ed.institution)}${ed.gpa ? ` &mdash; GPA: ${escapeHtml(ed.gpa)}` : ""}</p>
        ${ed.description ? `<p style="font-size: 9pt; color: #666; margin: 1px 0;">${escapeHtml(ed.description)}</p>` : ""}
      </div>
    `).join("");
    sections.push(`
      <p style="font-size: 11pt; font-weight: bold; color: ${accentColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 16px 0 8px;">Education</p>
      ${items}
    `);
  }

  // Skills
  if (data.skills.length > 0) {
    const items = data.skills.map((s) => `
      <p style="font-size: 10pt; margin: 2px 0;"><strong>${escapeHtml(s.category)}:</strong> ${s.items.map(escapeHtml).join(", ")}</p>
    `).join("");
    sections.push(`
      <p style="font-size: 11pt; font-weight: bold; color: ${accentColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 16px 0 8px;">Skills</p>
      ${items}
    `);
  }

  // Projects
  if (data.projects.length > 0) {
    const items = data.projects.map((pr) => `
      <div style="margin-bottom: 6px;">
        <p style="font-size: 10pt; font-weight: bold; margin: 0;">${escapeHtml(pr.name)}${pr.link ? ` &mdash; <span style="font-weight: normal; color: #555;">${escapeHtml(pr.link)}</span>` : ""}</p>
        ${pr.description ? `<p style="font-size: 10pt; margin: 1px 0;">${escapeHtml(pr.description)}</p>` : ""}
        ${pr.technologies.length > 0 ? `<p style="font-size: 9pt; color: #777; margin: 1px 0; font-style: italic;">${pr.technologies.map(escapeHtml).join(", ")}</p>` : ""}
      </div>
    `).join("");
    sections.push(`
      <p style="font-size: 11pt; font-weight: bold; color: ${accentColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 16px 0 8px;">Projects</p>
      ${items}
    `);
  }

  // Certifications
  if (data.certifications.length > 0) {
    const items = data.certifications.map((c) => `
      <p style="font-size: 10pt; margin: 2px 0;"><strong>${escapeHtml(c.name)}</strong>${c.issuer ? `, ${escapeHtml(c.issuer)}` : ""}${c.date ? ` &mdash; ${escapeHtml(c.date)}` : ""}</p>
    `).join("");
    sections.push(`
      <p style="font-size: 11pt; font-weight: bold; color: ${accentColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 16px 0 8px;">Certifications</p>
      ${items}
    `);
  }

  // Languages
  if (data.languages.length > 0) {
    sections.push(`
      <p style="font-size: 11pt; font-weight: bold; color: ${accentColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 16px 0 8px;">Languages</p>
      <p style="font-size: 10pt; margin: 0;">${data.languages.map((l) => `${escapeHtml(l.name)} (${escapeHtml(l.proficiency)})`).join(" &middot; ")}</p>
    `);
  }

  // Custom sections
  for (const cs of data.customSections.filter((s) => s.items.length > 0)) {
    sections.push(`
      <p style="font-size: 11pt; font-weight: bold; color: ${accentColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 16px 0 8px;">${escapeHtml(cs.title)}</p>
      <ul style="font-size: 10pt; margin: 0; padding-left: 20px;">${cs.items.map((it) => `<li style="margin-bottom: 2px;">${escapeHtml(it)}</li>`).join("")}</ul>
    `);
  }

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${escapeHtml(p.fullName || "Resume")}</title>
<!--[if gte mso 9]><xml>
<w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument>
</xml><![endif]-->
<style>
@page { size: Letter; margin: 0.75in; }
body { font-family: Calibri, Arial, sans-serif; color: #222; font-size: 10pt; line-height: 1.4; }
</style>
</head>
<body>
${sections.join("\n")}
</body>
</html>`;

  return html;
}

export function downloadDocx(data: ResumeData, accentColor: string, filename?: string) {
  const html = resumeToDocHtml(data, accentColor);
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const name = (filename || data.personalInfo.fullName || "resume").replace(/\s+/g, "-").toLowerCase();
  a.download = `${name}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}
