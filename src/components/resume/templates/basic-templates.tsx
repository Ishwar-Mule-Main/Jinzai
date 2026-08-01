"use client";

import type { ResumeData, TemplateId } from "@/lib/resume/types";
import { formatDateRange, getActiveSections, withAlpha, shade, initials, getFontClass, contactItems } from "@/lib/resume/template-helpers";

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
  const sideHas = active.skills || active.languages || active.certifications || contacts.length > 0;

  return (
    <div className="flex min-h-full" style={{ background: "#fff" }}>
      {/* Sidebar */}
      {sideHas && (
        <aside
          className="w-[34%] p-7 text-white"
          style={{ background: accent, color: "#fff" }}
        >
          <div className="flex flex-col items-center mb-7">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-4 mb-4"
              style={{ borderColor: "rgba(255,255,255,0.4)" }}
            >
              <Avatar data={data} accent={accent} template="modern" />
            </div>
            {data.personalInfo.tagline && (
              <p className="text-sm text-white/85 text-center italic">{data.personalInfo.tagline}</p>
            )}
          </div>

          {contacts.length > 0 && (
            <Section title="Contact" accent="light">
              <ul className="space-y-2 text-sm">
                {contacts.map((c) => (
                  <li key={c.label} className="break-words">
                    <span className="block text-[10px] uppercase tracking-wider text-white/60">{c.label}</span>
                    <span className="text-white/95">{c.value}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {active.skills && (
            <Section title="Skills" accent="light">
              <div className="space-y-3">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <p className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-1.5">{s.category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.items.map((it, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded"
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

          {active.languages && (
            <Section title="Languages" accent="light">
              <ul className="space-y-1.5 text-sm">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between gap-2">
                    <span>{l.name}</span>
                    <span className="text-white/70 text-xs">{l.proficiency}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {active.certifications && (
            <Section title="Certifications" accent="light">
              <div className="space-y-2.5 text-sm">
                {data.certifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-semibold text-white/95">{c.name}</p>
                    {c.issuer && <p className="text-white/75 text-xs">{c.issuer}{c.date ? ` · ${c.date}` : ""}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </aside>
      )}

      {/* Main */}
      <main className="flex-1 p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900" style={{ color: shade(accent, -0.15) }}>
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-lg font-medium mt-1" style={{ color: accent }}>
            {data.personalInfo.jobTitle || "Your Title"}
          </p>
        </header>

        {active.summary && (
          <MainSection title="Profile" accent={accent}>
            <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
          </MainSection>
        )}

        {active.experience && (
          <MainSection title="Experience" accent={accent}>
            <div className="space-y-5">
              {data.experience.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-base">{e.position}{e.company ? `, ${e.company}` : ""}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                  </div>
                  {e.location && <p className="text-xs text-gray-500 mb-1.5">{e.location}</p>}
                  {e.description && <p className="text-sm text-gray-700 mb-1.5">{e.description}</p>}
                  {e.achievements.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 marker:text-gray-400">
                      {e.achievements.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {active.projects && (
          <MainSection title="Projects" accent={accent}>
            <div className="space-y-4">
              {data.projects.map((p) => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-sm">{p.name}{p.link ? ` · ${p.link}` : ""}</h3>
                    <span className="text-xs text-gray-500">{formatDateRange(p.startDate, p.endDate)}</span>
                  </div>
                  {p.description && <p className="text-sm text-gray-700 mt-1">{p.description}</p>}
                  {p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {p.technologies.map((t, i) => (
                        <span key={i} className="text-[11px] px-1.5 py-0.5 rounded text-gray-600" style={{ background: withAlpha(accent, 0.1) }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {active.education && (
          <MainSection title="Education" accent={accent}>
            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id}>
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {ed.degree}{ed.field ? `, ${ed.field}` : ""}
                    </h3>
                    <span className="text-xs text-gray-500">{formatDateRange(ed.startDate, ed.endDate)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{ed.institution}</p>
                  {ed.gpa && <p className="text-xs text-gray-500">GPA: {ed.gpa}</p>}
                  {ed.description && <p className="text-xs text-gray-600 mt-1">{ed.description}</p>}
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {active.customSections && (
          <>
            {data.customSections.filter((s) => s.items.length > 0).map((s) => (
              <MainSection key={s.id} title={s.title} accent={accent}>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {s.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </MainSection>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

function MainSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
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
    <section className="mb-6">
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
  return (
    <div className="p-12 min-h-full bg-white" style={{ color: "#111827" }}>
      <header className="mb-10">
        <h1 className="text-4xl font-light tracking-tight">{data.personalInfo.fullName || "Your Name"}</h1>
        <p className="text-lg text-gray-500 mt-1 font-light">{data.personalInfo.jobTitle || "Your Title"}</p>
        {data.personalInfo.tagline && (
          <p className="text-sm text-gray-400 mt-2 italic">{data.personalInfo.tagline}</p>
        )}
        {contacts.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-xs text-gray-500">
            {contacts.map((c) => (
              <span key={c.label}>{c.value}</span>
            ))}
          </div>
        )}
        <div className="mt-5 h-px" style={{ background: withAlpha(accent, 0.4) }} />
      </header>

      {active.summary && (
        <MinSection title="Profile" accent={accent}>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </MinSection>
      )}

      {active.experience && (
        <MinSection title="Experience" accent={accent}>
          <div className="space-y-6">
            {data.experience.map((e) => (
              <div key={e.id} className="grid grid-cols-[140px_1fr] gap-5">
                <div className="text-xs text-gray-400 pt-0.5">{formatDateRange(e.startDate, e.endDate, e.current)}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{e.position}</h3>
                  <p className="text-sm text-gray-500">{[e.company, e.location].filter(Boolean).join(" · ")}</p>
                  {e.description && <p className="text-sm text-gray-700 mt-1.5">{e.description}</p>}
                  {e.achievements.length > 0 && (
                    <ul className="mt-1.5 space-y-1 text-sm text-gray-700">
                      {e.achievements.map((a, i) => (
                        <li key={i} className="flex gap-2">
                          <span style={{ color: accent }}>—</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </MinSection>
      )}

      {active.education && (
        <MinSection title="Education" accent={accent}>
          <div className="space-y-3">
            {data.education.map((ed) => (
              <div key={ed.id} className="grid grid-cols-[140px_1fr] gap-5">
                <div className="text-xs text-gray-400 pt-0.5">{formatDateRange(ed.startDate, ed.endDate)}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</h3>
                  <p className="text-sm text-gray-500">{ed.institution}{ed.gpa ? ` · GPA ${ed.gpa}` : ""}</p>
                  {ed.description && <p className="text-xs text-gray-600 mt-1">{ed.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </MinSection>
      )}

      {active.projects && (
        <MinSection title="Projects" accent={accent}>
          <div className="space-y-4">
            {data.projects.map((p) => (
              <div key={p.id} className="grid grid-cols-[140px_1fr] gap-5">
                <div className="text-xs text-gray-400 pt-0.5">{formatDateRange(p.startDate, p.endDate)}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{p.name}{p.link ? ` · ${p.link}` : ""}</h3>
                  {p.description && <p className="text-sm text-gray-700 mt-1">{p.description}</p>}
                  {p.technologies.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{p.technologies.join(" · ")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </MinSection>
      )}

      {active.skills && (
        <MinSection title="Skills" accent={accent}>
          <div className="space-y-2">
            {data.skills.map((s) => (
              <div key={s.id} className="grid grid-cols-[140px_1fr] gap-5">
                <div className="text-xs text-gray-400 pt-0.5 uppercase tracking-wider">{s.category}</div>
                <p className="text-sm text-gray-700">{s.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </MinSection>
      )}

      {active.certifications && (
        <MinSection title="Certifications" accent={accent}>
          <div className="space-y-1.5">
            {data.certifications.map((c) => (
              <div key={c.id} className="text-sm">
                <span className="font-medium text-gray-900">{c.name}</span>
                <span className="text-gray-500"> — {c.issuer}{c.date ? `, ${c.date}` : ""}</span>
              </div>
            ))}
          </div>
        </MinSection>
      )}

      {active.languages && (
        <MinSection title="Languages" accent={accent}>
          <p className="text-sm text-gray-700">
            {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(" · ")}
          </p>
        </MinSection>
      )}

      {data.customSections.filter((s) => s.items.length > 0).map((s) => (
        <MinSection key={s.id} title={s.title} accent={accent}>
          <ul className="space-y-1 text-sm text-gray-700">
            {s.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </MinSection>
      ))}
    </div>
  );
}

function MinSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: accent }}>{title}</h2>
      {children}
    </section>
  );
}

export { MinimalTemplate };

// Continue with other templates in part 2
