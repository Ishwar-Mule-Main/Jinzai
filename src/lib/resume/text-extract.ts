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

export async function extractTextFromFile(file: File): Promise<{ text?: string; json?: any }> {
  const name = file.name.toLowerCase();

  // 1. JSON resume file
  if (name.endsWith(".json")) {
    const raw = await file.text();
    try {
      const parsed = JSON.parse(raw);
      const targetData = parsed.data || parsed;
      if (targetData.personalInfo || targetData.experience || targetData.education) {
        return { json: targetData };
      }
    } catch {
      // Fallthrough if not valid JSON
    }
    return { text: raw };
  }

  // 2. Plain text or Markdown file
  if (name.endsWith(".txt") || name.endsWith(".md") || file.type.startsWith("text/")) {
    const raw = await file.text();
    return { text: raw };
  }

  // 3. Binary PDF or DOCX file text extraction
  try {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const rawString = decoder.decode(arrayBuffer);

    // If DOCX XML content is present (contains <w:t> tags)
    if (rawString.includes("<w:t") || rawString.includes("w:p")) {
      const wtMatches = rawString.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
      if (wtMatches && wtMatches.length > 0) {
        const docxText = wtMatches
          .map((tag) => tag.replace(/<[^>]+>/g, "").trim())
          .filter(Boolean)
          .join(" ");
        if (docxText.length >= 20) {
          return { text: docxText };
        }
      }
    }

    // Extract PDF text blocks or printable text sequences
    const matches = rawString.match(/[\x20-\x7E\xA0-\xFF]{3,}/g);
    if (matches && matches.length > 0) {
      const cleaned = matches
        .map((line) => line.trim())
        .filter((line) => {
          if (/^[\/\\%><#]/.test(line)) return false;
          if (/^(obj|endobj|stream|endstream|xref|trailer|startxref|Font|Page|Type|MediaBox|Filter|FlateDecode)/i.test(line)) return false;
          // Filter out binary pdf string noise
          if (/^[0-9a-fA-F]{16,}$/.test(line)) return false;
          return line.length > 2;
        })
        .join("\n");

      if (cleaned.length >= 20) {
        return { text: cleaned };
      }
    }

    const fallback = rawString.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ").replace(/\s+/g, " ");
    return { text: fallback };
  } catch {
    const raw = await file.text();
    return { text: raw };
  }
}
