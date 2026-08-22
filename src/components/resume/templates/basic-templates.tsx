"use client";

import type { ResumeData, TemplateId } from "@/lib/resume/types";
import {
  formatDateRange,
  getActiveSections,
  withAlpha,
  shade,
  initials,
  getFontClass,
  contactItems,
  renderFormattedText,
  normalizeCustomItem,
  getSectionOrder,
  getSectionPlacement,
} from "@/lib/resume/template-helpers";

export interface RenderProps {
  data: ResumeData;
  accent: string;
  font: string;
  fontSize?: string; // xs, s, m, l, xl
  template: TemplateId;
}

// ---------- Shared atoms ----------

function Avatar({ data, accent, template }: { data: ResumeData; accent: string; template: TemplateId }) {
  const photo = data.personalInfo.photo;
  if (photo) {
    return (
      <img
        src={photo}
        alt={data.personalInfo.fullName}
        className="object-cover"
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center w-full h-full font-semibold"
      style={{
        background: withAlpha(accent, 0.12),
        color: accent,
        fontSize: template === "creative" ? "2.2rem" : "1.4rem",
      }}
    >
      {initials(data.personalInfo.fullName) || "?"}
    </div>
  );
}

// ---------- MODERN template ----------

function ModernTemplate({ data, accent }: { data: ResumeData; accent: string }) {
  const active = getActiveSections(data);
  const contacts = contactItems(data);
  const order = getSectionOrder(data);

  // Check which sections are in sidebar vs main
  const isSidebar = (sec: string, defaultInSide: boolean) => {
    const placement = getSectionPlacement(data, sec, defaultInSide ? "sidebar" : "main");
    return placement === "sidebar" || placement === "left";
  };

  const sideSkills = active.skills && isSidebar("skills", true);
  const sideLanguages = active.languages && isSidebar("languages", true);
  const sideCertifications = active.certifications && isSidebar("certifications", true);
  const sideEducation = active.education && isSidebar("education", false);
  const sideCustom = active.customSections && isSidebar("custom", false);

  const sideHas = sideSkills || sideLanguages || sideCertifications || sideEducation || sideCustom || contacts.length > 0;

  // Render individual sections
  const renderSectionByKey = (key: string) => {
    switch (key) {
      case "summary":
        if (!active.summary) return null;
        return (
          <MainSection key="summary" title="Profile" accent={accent}>
            <p className="text-sm text-gray-700 leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
              {renderFormattedText(data.summary)}
            </p>
          </MainSection>
        );

      case "experience":
        if (!active.experience) return null;
        return (
          <MainSection key="experience" title="Experience" accent={accent}>
            <div className="space-y-5">
              {data.experience.map((e) => (
                <div key={e.id} className="break-words [overflow-wrap:anywhere]">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-base break-words">
                      {e.position}{e.company ? `, ${e.company}` : ""}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDateRange(e.startDate, e.endDate, e.current)}
                    </span>
                  </div>
                  {e.location && <p className="text-xs text-gray-500 mb-1.5 break-words">{e.location}</p>}
                  {e.description && (
                    <p className="text-sm text-gray-700 mb-1.5 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                      {renderFormattedText(e.description)}
                    </p>
                  )}
                  {e.achievements.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 marker:text-gray-400">
                      {e.achievements.map((a, i) => (
                        <li key={i} className="break-words [overflow-wrap:anywhere]">
                          {renderFormattedText(a)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        );

      case "projects":
        if (!active.projects) return null;
        return (
          <MainSection key="projects" title="Projects" accent={accent}>
            <div className="space-y-4">
              {data.projects.map((p) => (
                <div key={p.id} className="break-words [overflow-wrap:anywhere]">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-sm break-words">
                      {p.name}{p.link ? ` · ${p.link}` : ""}
                    </h3>
                    <span className="text-xs text-gray-500">{formatDateRange(p.startDate, p.endDate)}</span>
                  </div>
                  {p.description && (
                    <p className="text-sm text-gray-700 mt-1 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                      {renderFormattedText(p.description)}
                    </p>
                  )}
                  {p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {p.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-1.5 py-0.5 rounded text-gray-600 break-words"
                          style={{ background: withAlpha(accent, 0.1) }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        );

      case "education":
        if (!active.education || isSidebar("education", false)) return null;
        return (
          <MainSection key="education" title="Education" accent={accent}>
            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id} className="break-words [overflow-wrap:anywhere]">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-sm break-words">
                      {ed.degree}{ed.field ? `, ${ed.field}` : ""}
                    </h3>
                    <span className="text-xs text-gray-500">{formatDateRange(ed.startDate, ed.endDate)}</span>
                  </div>
                  <p className="text-sm text-gray-700 break-words">{ed.institution}</p>
                  {ed.gpa && <p className="text-xs text-gray-500">GPA: {ed.gpa}</p>}
                  {ed.description && (
                    <p className="text-xs text-gray-600 mt-1 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                      {renderFormattedText(ed.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        );

      case "skills":
        if (!active.skills || isSidebar("skills", true)) return null;
        return (
          <MainSection key="skills" title="Skills" accent={accent}>
            <div className="space-y-3">
              {data.skills.map((s) => (
                <div key={s.id} className="break-words">
                  <p className="text-xs uppercase tracking-wider text-gray-700 font-bold mb-1">{s.category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map((it, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-800 break-words">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </MainSection>
        );

      case "certifications":
        if (!active.certifications || isSidebar("certifications", true)) return null;
        return (
          <MainSection key="certifications" title="Certifications" accent={accent}>
            <div className="space-y-2">
              {data.certifications.map((c) => (
                <div key={c.id} className="text-sm break-words">
                  <span className="font-semibold text-gray-900">{c.name}</span>
                  {c.issuer && <span className="text-gray-500"> — {c.issuer}{c.date ? `, ${c.date}` : ""}</span>}
                </div>
              ))}
            </div>
          </MainSection>
        );

      case "languages":
        if (!active.languages || isSidebar("languages", true)) return null;
        return (
          <MainSection key="languages" title="Languages" accent={accent}>
            <p className="text-sm text-gray-700 break-words">
              {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(" · ")}
            </p>
          </MainSection>
        );

      case "custom":
        if (!active.customSections || isSidebar("custom", false)) return null;
        return (
          <div key="custom" className="space-y-6">
            {data.customSections.filter((s) => s.items && s.items.length > 0).map((s) => (
              <MainSection key={s.id} title={s.title} accent={accent}>
                <div className="space-y-3">
                  {s.items.map((rawIt, i) => {
                    const it = normalizeCustomItem(rawIt);
                    return (
                      <div key={it.id || i} className="break-words [overflow-wrap:anywhere]">
                        <div className="flex items-baseline justify-between gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-sm">{renderFormattedText(it.title)}</h3>
                          {it.date && <span className="text-xs text-gray-500">{it.date}</span>}
                        </div>
                        {it.subtitle && (
                          <p className="text-xs text-gray-600 font-medium">{renderFormattedText(it.subtitle)}</p>
                        )}
                        {it.description && (
                          <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">
                            {renderFormattedText(it.description)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </MainSection>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-full" style={{ background: "#fff" }}>
      {/* Sidebar */}
      {sideHas && (
        <aside
          className="w-[34%] p-7 text-white break-words [overflow-wrap:anywhere]"
          style={{ background: accent, color: "#fff" }}
        >
          <div className="flex flex-col items-center mb-7">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-4 mb-4 shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.4)" }}
            >
              <Avatar data={data} accent={accent} template="modern" />
            </div>
            {data.personalInfo.tagline && (
              <p className="text-sm text-white/85 text-center italic break-words">{data.personalInfo.tagline}</p>
            )}
          </div>

          {contacts.length > 0 && (
            <Section title="Contact" accent="light">
              <ul className="space-y-2 text-sm">
                {contacts.map((c) => (
                  <li key={c.label} className="break-words [overflow-wrap:anywhere]">
                    <span className="block text-[10px] uppercase tracking-wider text-white/60">{c.label}</span>
                    <span className="text-white/95">{c.value}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {sideSkills && (
            <Section title="Skills" accent="light">
              <div className="space-y-3">
                {data.skills.map((s) => (
                  <div key={s.id} className="break-words">
                    <p className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-1.5">{s.category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.items.map((it, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded break-words"
                          style={{ background: "rgba(255,255,255,0.18)" }}
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {sideLanguages && (
            <Section title="Languages" accent="light">
              <ul className="space-y-1.5 text-sm">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between gap-2 break-words">
                    <span>{l.name}</span>
                    <span className="text-white/70 text-xs">{l.proficiency}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {sideCertifications && (
            <Section title="Certifications" accent="light">
              <div className="space-y-2.5 text-sm">
                {data.certifications.map((c) => (
                  <div key={c.id} className="break-words">
                    <p className="font-semibold text-white/95">{c.name}</p>
                    {c.issuer && <p className="text-white/75 text-xs">{c.issuer}{c.date ? ` · ${c.date}` : ""}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {sideEducation && (
            <Section title="Education" accent="light">
              <div className="space-y-2.5 text-sm">
                {data.education.map((ed) => (
                  <div key={ed.id} className="break-words">
                    <p className="font-semibold text-white/95">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</p>
                    <p className="text-white/75 text-xs">{ed.institution}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {sideCustom && (
            <div className="space-y-4">
              {data.customSections.filter((s) => s.items && s.items.length > 0).map((s) => (
                <Section key={s.id} title={s.title} accent="light">
                  <div className="space-y-2 text-xs">
                    {s.items.map((rawIt, i) => {
                      const it = normalizeCustomItem(rawIt);
                      return (
                        <div key={it.id || i} className="break-words">
                          <p className="font-semibold text-white/95">{renderFormattedText(it.title)}</p>
                          {it.subtitle && <p className="text-white/75 text-[11px]">{renderFormattedText(it.subtitle)}</p>}
                        </div>
                      );
                    })}
                  </div>
                </Section>
              ))}
            </div>
          )}
        </aside>
      )}

      {/* Main Column */}
      <main className="flex-1 p-8 min-w-0">
        <header className="mb-6 break-words">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900" style={{ color: shade(accent, -0.15) }}>
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-lg font-medium mt-1" style={{ color: accent }}>
            {data.personalInfo.jobTitle || "Your Title"}
          </p>
        </header>

        {order.map((key) => renderSectionByKey(key))}
      </main>
    </div>
  );
}

function MainSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 break-words [overflow-wrap:anywhere]">
      <h2
        className="text-sm font-bold uppercase tracking-widest mb-3 pb-1.5 border-b-2"
        style={{ color: shade(accent, -0.1), borderColor: accent }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Section({ title, accent, children }: { title: string; accent: "light" | "dark"; children: React.ReactNode }) {
  return (
    <section className="mb-6 break-words [overflow-wrap:anywhere]">
      <h2
        className="text-xs font-bold uppercase tracking-widest mb-3 pb-1.5 border-b"
        style={{ borderColor: accent === "light" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export { ModernTemplate, MainSection, Section, Avatar };

// ---------- MINIMAL template ----------

function MinimalTemplate({ data, accent }: { data: ResumeData; accent: string }) {
  const active = getActiveSections(data);
  const contacts = contactItems(data);
  const order = getSectionOrder(data);

  const renderSectionByKey = (key: string) => {
    switch (key) {
      case "summary":
        if (!active.summary) return null;
        return (
          <MinSection key="summary" title="Profile" accent={accent}>
            <p className="text-sm text-gray-700 leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
              {renderFormattedText(data.summary)}
            </p>
          </MinSection>
        );

      case "experience":
        if (!active.experience) return null;
        return (
          <MinSection key="experience" title="Experience" accent={accent}>
            <div className="space-y-6">
              {data.experience.map((e) => (
                <div key={e.id} className="grid grid-cols-[140px_1fr] gap-5 break-words [overflow-wrap:anywhere]">
                  <div className="text-xs text-gray-400 pt-0.5">{formatDateRange(e.startDate, e.endDate, e.current)}</div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 break-words">{e.position}</h3>
                    <p className="text-sm text-gray-500 break-words">{[e.company, e.location].filter(Boolean).join(" · ")}</p>
                    {e.description && (
                      <p className="text-sm text-gray-700 mt-1.5 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
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
          </MinSection>
        );

      case "education":
        if (!active.education) return null;
        return (
          <MinSection key="education" title="Education" accent={accent}>
            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id} className="grid grid-cols-[140px_1fr] gap-5 break-words [overflow-wrap:anywhere]">
                  <div className="text-xs text-gray-400 pt-0.5">{formatDateRange(ed.startDate, ed.endDate)}</div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 break-words">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</h3>
                    <p className="text-sm text-gray-500 break-words">{ed.institution}{ed.gpa ? ` · GPA ${ed.gpa}` : ""}</p>
                    {ed.description && (
                      <p className="text-xs text-gray-600 mt-1 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                        {renderFormattedText(ed.description)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </MinSection>
        );

      case "projects":
        if (!active.projects) return null;
        return (
          <MinSection key="projects" title="Projects" accent={accent}>
            <div className="space-y-4">
              {data.projects.map((p) => (
                <div key={p.id} className="grid grid-cols-[140px_1fr] gap-5 break-words [overflow-wrap:anywhere]">
                  <div className="text-xs text-gray-400 pt-0.5">{formatDateRange(p.startDate, p.endDate)}</div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 break-words">{p.name}{p.link ? ` · ${p.link}` : ""}</h3>
                    {p.description && (
                      <p className="text-sm text-gray-700 mt-1 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                        {renderFormattedText(p.description)}
                      </p>
                    )}
                    {p.technologies.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1 break-words">{p.technologies.join(" · ")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </MinSection>
        );

      case "skills":
        if (!active.skills) return null;
        return (
          <MinSection key="skills" title="Skills" accent={accent}>
            <div className="space-y-2">
              {data.skills.map((s) => (
                <div key={s.id} className="grid grid-cols-[140px_1fr] gap-5 break-words [overflow-wrap:anywhere]">
                  <div className="text-xs text-gray-400 pt-0.5 uppercase tracking-wider">{s.category}</div>
                  <p className="text-sm text-gray-700 break-words">{s.items.join(" · ")}</p>
                </div>
              ))}
            </div>
          </MinSection>
        );

      case "certifications":
        if (!active.certifications) return null;
        return (
          <MinSection key="certifications" title="Certifications" accent={accent}>
            <div className="space-y-1.5">
              {data.certifications.map((c) => (
                <div key={c.id} className="text-sm break-words">
                  <span className="font-medium text-gray-900">{c.name}</span>
                  <span className="text-gray-500"> — {c.issuer}{c.date ? `, ${c.date}` : ""}</span>
                </div>
              ))}
            </div>
          </MinSection>
        );

      case "languages":
        if (!active.languages) return null;
        return (
          <MinSection key="languages" title="Languages" accent={accent}>
            <p className="text-sm text-gray-700 break-words">
              {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(" · ")}
            </p>
          </MinSection>
        );

      case "custom":
        if (!active.customSections) return null;
        return (
          <div key="custom" className="space-y-8">
            {data.customSections.filter((s) => s.items && s.items.length > 0).map((s) => (
              <MinSection key={s.id} title={s.title} accent={accent}>
                <div className="space-y-4">
                  {s.items.map((rawIt, i) => {
                    const it = normalizeCustomItem(rawIt);
                    return (
                      <div key={it.id || i} className="grid grid-cols-[140px_1fr] gap-5 break-words [overflow-wrap:anywhere]">
                        <div className="text-xs text-gray-400 pt-0.5">{it.date || "—"}</div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 break-words">{renderFormattedText(it.title)}</h3>
                          {it.subtitle && <p className="text-sm text-gray-500 break-words">{renderFormattedText(it.subtitle)}</p>}
                          {it.description && (
                            <p className="text-sm text-gray-700 mt-1 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                              {renderFormattedText(it.description)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </MinSection>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-12 min-h-full bg-white min-w-0" style={{ color: "#111827" }}>
      <header className="mb-10 break-words">
        <h1 className="text-4xl font-light tracking-tight break-words">{data.personalInfo.fullName || "Your Name"}</h1>
        <p className="text-lg text-gray-500 mt-1 font-light break-words">{data.personalInfo.jobTitle || "Your Title"}</p>
        {data.personalInfo.tagline && (
          <p className="text-sm text-gray-400 mt-2 italic break-words">{data.personalInfo.tagline}</p>
        )}
        {contacts.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-xs text-gray-500">
            {contacts.map((c) => (
              <span key={c.label} className="break-words">{c.value}</span>
            ))}
          </div>
        )}
        <div className="mt-5 h-px" style={{ background: withAlpha(accent, 0.4) }} />
      </header>

      {order.map((key) => renderSectionByKey(key))}
    </div>
  );
}

function MinSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 break-words [overflow-wrap:anywhere]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: accent }}>{title}</h2>
      {children}
    </section>
  );
}

export { MinimalTemplate };
