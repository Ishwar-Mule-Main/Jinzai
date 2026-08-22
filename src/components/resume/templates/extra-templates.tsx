"use client";

import type { ResumeData } from "@/lib/resume/types";
import {
  formatDateRange,
  getActiveSections,
  withAlpha,
  shade,
  contactItems,
  renderFormattedText,
  normalizeCustomItem,
  getSectionOrder,
  getSectionPlacement,
} from "@/lib/resume/template-helpers";
import { Avatar } from "./basic-templates";

// ---------- ACADEMIC template ----------

function AcademicTemplate({ data, accent }: { data: ResumeData; accent: string }) {
  const active = getActiveSections(data);
  const contacts = contactItems(data);
  const p = data.personalInfo;
  const order = getSectionOrder(data);

  let secNum = 1;
  const sectionNumber = (label: string) => (
    <h2 className="flex items-baseline gap-2.5 text-sm font-bold uppercase tracking-wider mb-3 break-words">
      <span className="text-xs font-mono shrink-0" style={{ color: accent }}>{String(secNum++).padStart(2, "0")}</span>
      <span style={{ color: shade(accent, -0.2) }} className="break-words">{label}</span>
      <span className="flex-1 h-px ml-2" style={{ background: withAlpha(accent, 0.3) }} />
    </h2>
  );

  const renderSectionByKey = (key: string) => {
    switch (key) {
      case "summary":
        if (!active.summary) return null;
        return (
          <section key="summary" className="mb-7 break-words [overflow-wrap:anywhere]">
            {sectionNumber("Research Statement")}
            <p className="text-sm text-gray-800 leading-relaxed text-justify break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
              {renderFormattedText(data.summary)}
            </p>
          </section>
        );

      case "experience":
        if (!active.experience) return null;
        return (
          <section key="experience" className="mb-7 break-words [overflow-wrap:anywhere]">
            {sectionNumber("Appointments & Experience")}
            <div className="space-y-4">
              {data.experience.map((e) => (
                <div key={e.id} className="grid grid-cols-[140px_1fr] gap-4 break-words [overflow-wrap:anywhere]">
                  <div className="text-xs text-gray-500 italic pt-0.5">{formatDateRange(e.startDate, e.endDate, e.current)}</div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm break-words">{e.position}</p>
                    <p className="text-sm italic break-words" style={{ color: accent }}>{e.company}{e.location ? `, ${e.location}` : ""}</p>
                    {e.description && (
                      <p className="text-sm text-gray-700 mt-1 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                        {renderFormattedText(e.description)}
                      </p>
                    )}
                    {e.achievements.length > 0 && (
                      <ul className="mt-1.5 space-y-1 text-sm text-gray-700">
                        {e.achievements.map((a, i) => (
                          <li key={i} className="flex gap-2 break-words [overflow-wrap:anywhere]">
                            <span style={{ color: accent }}>—</span>
                            <span className="break-words">{renderFormattedText(a)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case "education":
        if (!active.education) return null;
        return (
          <section key="education" className="mb-7 break-words [overflow-wrap:anywhere]">
            {sectionNumber("Education")}
            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id} className="grid grid-cols-[140px_1fr] gap-4 break-words [overflow-wrap:anywhere]">
                  <div className="text-xs text-gray-500 italic pt-0.5">{formatDateRange(ed.startDate, ed.endDate)}</div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm break-words">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</p>
                    <p className="text-sm italic break-words" style={{ color: accent }}>{ed.institution}</p>
                    {ed.gpa && <p className="text-xs text-gray-600 mt-0.5">GPA: {ed.gpa}</p>}
                    {ed.description && (
                      <p className="text-xs text-gray-600 mt-0.5 italic break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                        {renderFormattedText(ed.description)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case "projects":
        if (!active.projects) return null;
        return (
          <section key="projects" className="mb-7 break-words [overflow-wrap:anywhere]">
            {sectionNumber("Research & Projects")}
            <div className="space-y-3">
              {data.projects.map((pr) => (
                <div key={pr.id} className="break-words [overflow-wrap:anywhere]">
                  <p className="text-sm text-gray-900 break-words">
                    <span className="font-bold">{pr.name}</span>
                    {pr.link ? <span className="italic text-gray-600"> — {pr.link}</span> : null}
                    <span className="text-xs text-gray-500 italic"> ({formatDateRange(pr.startDate, pr.endDate)})</span>
                  </p>
                  {pr.description && (
                    <p className="text-sm text-gray-700 mt-0.5 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                      {renderFormattedText(pr.description)}
                    </p>
                  )}
                  {pr.technologies.length > 0 && (
                    <p className="text-xs text-gray-500 italic mt-0.5 break-words">Methods: {pr.technologies.join(", ")}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "skills":
        if (!active.skills) return null;
        return (
          <section key="skills" className="mb-7 break-words [overflow-wrap:anywhere]">
            {sectionNumber("Areas of Expertise")}
            <div className="space-y-2">
              {data.skills.map((s) => (
                <p key={s.id} className="text-sm text-gray-800 break-words">
                  <span className="font-bold">{s.category}:</span> {s.items.join(", ")}
                </p>
              ))}
            </div>
          </section>
        );

      case "certifications":
        if (!active.certifications) return null;
        return (
          <section key="certifications" className="mb-7 break-words [overflow-wrap:anywhere]">
            {sectionNumber("Honors & Certifications")}
            <ul className="space-y-1">
              {data.certifications.map((c) => (
                <li key={c.id} className="text-sm text-gray-800 break-words">
                  <span className="font-bold">{c.name}</span>{c.issuer ? `, ${c.issuer}` : ""}{c.date ? ` — ${c.date}` : ""}
                </li>
              ))}
            </ul>
          </section>
        );

      case "languages":
        if (!active.languages) return null;
        return (
          <section key="languages" className="mb-7 break-words [overflow-wrap:anywhere]">
            {sectionNumber("Languages")}
            <p className="text-sm text-gray-800 break-words">
              {data.languages.map((l) => `${l.name} (${l.proficiency})`).join("; ")}
            </p>
          </section>
        );

      case "custom":
        if (!active.customSections) return null;
        return (
          <div key="custom" className="space-y-7">
            {data.customSections.filter((s) => s.items && s.items.length > 0).map((s) => (
              <section key={s.id} className="mb-7 break-words [overflow-wrap:anywhere]">
                {sectionNumber(s.title)}
                <div className="space-y-3">
                  {s.items.map((rawIt, idx) => {
                    const it = normalizeCustomItem(rawIt);
                    return (
                      <div key={it.id || idx} className="grid grid-cols-[140px_1fr] gap-4 break-words [overflow-wrap:anywhere]">
                        <div className="text-xs text-gray-500 italic pt-0.5">{it.date || "—"}</div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm break-words">{renderFormattedText(it.title)}</p>
                          {it.subtitle && <p className="text-sm italic text-gray-600">{renderFormattedText(it.subtitle)}</p>}
                          {it.description && (
                            <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap leading-relaxed">
                              {renderFormattedText(it.description)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="px-14 py-12 min-h-full bg-white min-w-0" style={{ fontFamily: "'Merriweather', Georgia, serif" }}>
      {/* Header */}
      <header className="text-center mb-8 break-words">
        <h1 className="text-3xl font-bold tracking-wide break-words" style={{ color: shade(accent, -0.25) }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.jobTitle && (
          <p className="text-base italic mt-1 text-gray-700 break-words">{p.jobTitle}</p>
        )}
        {contacts.length > 0 && (
          <p className="text-xs text-gray-600 mt-3 leading-relaxed break-words">
            {contacts.map((c) => c.value).join("  ·  ")}
          </p>
        )}
        <div className="mt-5 mx-auto w-24 h-px" style={{ background: accent }} />
      </header>

      {order.map((key) => renderSectionByKey(key))}
    </div>
  );
}

export { AcademicTemplate };

// ---------- COMPACT template ----------

function CompactTemplate({ data, accent }: { data: ResumeData; accent: string }) {
  const active = getActiveSections(data);
  const contacts = contactItems(data);
  const p = data.personalInfo;
  const order = getSectionOrder(data);

  const isSidebar = (sec: string, defaultVal: boolean) => {
    const pl = getSectionPlacement(data, sec);
    if (pl === "sidebar" || pl === "left") return true;
    if (pl === "main" || pl === "right") return false;
    return defaultVal;
  };

  const defaultSidebar: Record<string, boolean> = {
    skills: true,
    languages: true,
    certifications: true,
    summary: false,
    experience: false,
    projects: false,
    education: false,
    custom: false,
  };

  const renderSection = (key: string, isSide: boolean) => {
    switch (key) {
      case "summary":
        if (!active.summary) return null;
        return (
          <section key="summary" className="mb-3.5 break-words [overflow-wrap:anywhere]">
            <p className="text-xs text-gray-700 leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
              {renderFormattedText(data.summary)}
            </p>
          </section>
        );

      case "experience":
        if (!active.experience) return null;
        return isSide ? (
          <section key="experience" className="break-words">
            <CompactHeading accent={accent} small>Experience</CompactHeading>
            <div className="space-y-2 text-xs">
              {data.experience.map((e) => (
                <div key={e.id} className="break-words">
                  <p className="font-bold text-gray-900 text-[11px]">{e.position}</p>
                  <p className="text-[10px] text-gray-600">{e.company}</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section key="experience" className="mb-3.5 break-words [overflow-wrap:anywhere]">
            <CompactHeading accent={accent}>Experience</CompactHeading>
            <div className="space-y-2.5">
              {data.experience.map((e) => (
                <div key={e.id} className="break-words [overflow-wrap:anywhere]">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 text-[13px] break-words">
                      {e.position}{e.company ? <span className="font-normal text-gray-600"> · {e.company}</span> : null}
                    </p>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                  </div>
                  {e.description && (
                    <p className="text-xs text-gray-700 mt-0.5 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                      {renderFormattedText(e.description)}
                    </p>
                  )}
                  {e.achievements.length > 0 && (
                    <ul className="mt-0.5 space-y-0.5 text-xs text-gray-700">
                      {e.achievements.map((a, i) => (
                        <li key={i} className="flex gap-1.5 break-words [overflow-wrap:anywhere]">
                          <span style={{ color: accent }}>▸</span>
                          <span className="break-words">{renderFormattedText(a)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "projects":
        if (!active.projects) return null;
        return isSide ? (
          <section key="projects" className="break-words">
            <CompactHeading accent={accent} small>Projects</CompactHeading>
            <div className="space-y-1.5 text-xs">
              {data.projects.map((pr) => (
                <div key={pr.id} className="break-words">
                  <p className="font-bold text-gray-900 text-[11px]">{pr.name}</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section key="projects" className="mb-3.5 break-words [overflow-wrap:anywhere]">
            <CompactHeading accent={accent}>Projects</CompactHeading>
            <div className="space-y-2">
              {data.projects.map((pr) => (
                <div key={pr.id} className="break-words [overflow-wrap:anywhere]">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 text-xs break-words">
                      {pr.name}{pr.link ? <span className="font-normal text-gray-500"> · {pr.link}</span> : null}
                    </p>
                    <span className="text-[10px] text-gray-500">{formatDateRange(pr.startDate, pr.endDate)}</span>
                  </div>
                  {pr.description && (
                    <p className="text-xs text-gray-700 mt-0.5 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                      {renderFormattedText(pr.description)}
                    </p>
                  )}
                  {pr.technologies.length > 0 && (
                    <p className="text-[10px] text-gray-500 mt-0.5 break-words">[{pr.technologies.join(", ")}]</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "education":
        if (!active.education) return null;
        return isSide ? (
          <section key="education" className="break-words">
            <CompactHeading accent={accent} small>Education</CompactHeading>
            <div className="space-y-1 text-xs">
              {data.education.map((ed) => (
                <div key={ed.id} className="break-words">
                  <p className="font-bold text-gray-900 text-[11px]">{ed.degree}</p>
                  <p className="text-[10px] text-gray-600">{ed.institution}</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section key="education" className="mb-3.5 break-words [overflow-wrap:anywhere]">
            <CompactHeading accent={accent}>Education</CompactHeading>
            <div className="space-y-1.5">
              {data.education.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between gap-2 flex-wrap break-words [overflow-wrap:anywhere]">
                  <div className="min-w-0">
                    <span className="font-bold text-gray-900 text-xs break-words">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</span>
                    <span className="text-gray-600 text-xs break-words"> — {ed.institution}{ed.gpa ? ` · ${ed.gpa}` : ""}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{formatDateRange(ed.startDate, ed.endDate)}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case "skills":
        if (!active.skills) return null;
        return (
          <section key="skills" className={isSide ? "break-words" : "mb-3.5 break-words [overflow-wrap:anywhere]"}>
            <CompactHeading accent={accent} small={isSide}>Skills</CompactHeading>
            <div className="space-y-1.5">
              {data.skills.map((s) => (
                <div key={s.id} className="break-words">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-gray-500">{s.category}</p>
                  <p className="text-[11px] text-gray-700 leading-snug break-words">{s.items.join(", ")}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case "languages":
        if (!active.languages) return null;
        return (
          <section key="languages" className={isSide ? "break-words" : "mb-3.5 break-words [overflow-wrap:anywhere]"}>
            <CompactHeading accent={accent} small={isSide}>Languages</CompactHeading>
            <ul className="space-y-0.5 text-[11px] text-gray-700">
              {data.languages.map((l) => (
                <li key={l.id} className="flex justify-between break-words">
                  <span>{l.name}</span>
                  <span className="text-gray-500">{l.proficiency}</span>
                </li>
              ))}
            </ul>
          </section>
        );

      case "certifications":
        if (!active.certifications) return null;
        return (
          <section key="certifications" className={isSide ? "break-words" : "mb-3.5 break-words [overflow-wrap:anywhere]"}>
            <CompactHeading accent={accent} small={isSide}>Certs</CompactHeading>
            <div className="space-y-1 text-[11px] text-gray-700">
              {data.certifications.map((c) => (
                <div key={c.id} className="break-words">
                  <p className="font-semibold text-gray-800 break-words">{c.name}</p>
                  <p className="text-gray-500 text-[10px]">{c.issuer}{c.date ? ` · ${c.date}` : ""}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case "custom":
        if (!active.customSections) return null;
        return (
          <div key="custom" className="space-y-3.5 mb-3.5">
            {data.customSections.filter((s) => s.items && s.items.length > 0).map((s) => (
              <section key={s.id} className="break-words [overflow-wrap:anywhere]">
                <CompactHeading accent={accent} small={isSide}>{s.title}</CompactHeading>
                <div className="space-y-1.5 text-xs text-gray-700">
                  {s.items.map((rawIt, i) => {
                    const it = normalizeCustomItem(rawIt);
                    return (
                      <div key={it.id || i} className="break-words">
                        <div className="flex justify-between items-baseline gap-1">
                          <span className="font-semibold text-gray-900">{renderFormattedText(it.title)}</span>
                          {it.date && <span className="text-[10px] text-gray-500">{it.date}</span>}
                        </div>
                        {it.subtitle && <p className="text-[11px] text-gray-500">{renderFormattedText(it.subtitle)}</p>}
                        {it.description && (
                          <p className="text-[11px] text-gray-600 mt-0.5 whitespace-pre-wrap leading-tight">
                            {renderFormattedText(it.description)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const hasSidebarSections = order.some((key) => isSidebar(key, defaultSidebar[key] ?? false) && active[key as keyof typeof active]);

  return (
    <div className="px-8 py-7 min-h-full bg-white min-w-0" style={{ fontSize: "12.5px", lineHeight: 1.4 }}>
      {/* Header — single line, dense */}
      <header className="mb-4 pb-2.5 border-b-2 break-words" style={{ borderColor: accent }}>
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight break-words" style={{ color: shade(accent, -0.2) }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && <p className="text-sm font-semibold break-words" style={{ color: accent }}>{p.jobTitle}</p>}
          </div>
          {contacts.length > 0 && (
            <div className="text-[10px] text-gray-600 text-right leading-snug break-words">
              {contacts.map((c, i) => (
                <span key={c.label}>
                  {c.value}{i < contacts.length - 1 && <span className="mx-1 text-gray-400">|</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Two-column dense layout for experience + side info */}
      <div className={`grid gap-5 ${hasSidebarSections ? "grid-cols-[1fr_180px]" : "grid-cols-1"}`}>
        <div className="min-w-0">
          {order.filter((key) => !isSidebar(key, defaultSidebar[key] ?? false)).map((key) => renderSection(key, false))}
        </div>

        {/* Side rail */}
        {hasSidebarSections && (
          <aside className="space-y-3 min-w-0">
            {order.filter((key) => isSidebar(key, defaultSidebar[key] ?? false)).map((key) => renderSection(key, true))}
          </aside>
        )}
      </div>
    </div>
  );
}

function CompactHeading({ accent, children, small }: { accent: string; children: React.ReactNode; small?: boolean }) {
  return (
    <h2
      className={`font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b ${small ? "text-[10px]" : "text-xs"}`}
      style={{ color: shade(accent, -0.15), borderColor: withAlpha(accent, 0.4) }}
    >
      {children}
    </h2>
  );
}

export { CompactTemplate };
