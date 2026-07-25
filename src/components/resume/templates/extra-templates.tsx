"use client";

import type { ResumeData } from "@/lib/resume/types";
import { formatDateRange, getActiveSections, withAlpha, shade, contactItems } from "@/lib/resume/template-helpers";
import { Avatar } from "./basic-templates";

// ---------- ACADEMIC template ----------

function AcademicTemplate({ data, accent }: { data: ResumeData; accent: string }) {
  const active = getActiveSections(data);
  const contacts = contactItems(data);
  const p = data.personalInfo;

  const sectionNumber = (label: string, n: number) => (
    <h2 className="flex items-baseline gap-2.5 text-sm font-bold uppercase tracking-wider mb-3">
      <span className="text-xs font-mono" style={{ color: accent }}>{String(n).padStart(2, "0")}</span>
      <span style={{ color: shade(accent, -0.2) }}>{label}</span>
      <span className="flex-1 h-px ml-2" style={{ background: withAlpha(accent, 0.3) }} />
    </h2>
  );

  return (
    <div className="px-14 py-12 min-h-full bg-white" style={{ fontFamily: "'Merriweather', Georgia, serif" }}>
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-wide" style={{ color: shade(accent, -0.25) }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.jobTitle && (
          <p className="text-base italic mt-1 text-gray-700">{p.jobTitle}</p>
        )}
        {contacts.length > 0 && (
          <p className="text-xs text-gray-600 mt-3 leading-relaxed">
            {contacts.map((c) => c.value).join("  ·  ")}
          </p>
        )}
        <div className="mt-5 mx-auto w-24 h-px" style={{ background: accent }} />
      </header>

      {active.summary && (
        <section className="mb-7">
          {sectionNumber("Research Statement", 1)}
          <p className="text-sm text-gray-800 leading-relaxed text-justify">{data.summary}</p>
        </section>
      )}

      {active.experience && (
        <section className="mb-7">
          {sectionNumber("Appointments & Experience", 2)}
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id} className="grid grid-cols-[140px_1fr] gap-4">
                <div className="text-xs text-gray-500 italic pt-0.5">{formatDateRange(e.startDate, e.endDate, e.current)}</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{e.position}</p>
                  <p className="text-sm italic" style={{ color: accent }}>{e.institution || e.company}{e.location ? `, ${e.location}` : ""}</p>
                  {e.description && <p className="text-sm text-gray-700 mt-1">{e.description}</p>}
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
        </section>
      )}

      {active.education && (
        <section className="mb-7">
          {sectionNumber("Education", 3)}
          <div className="space-y-3">
            {data.education.map((ed) => (
              <div key={ed.id} className="grid grid-cols-[140px_1fr] gap-4">
                <div className="text-xs text-gray-500 italic pt-0.5">{formatDateRange(ed.startDate, ed.endDate)}</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</p>
                  <p className="text-sm italic" style={{ color: accent }}>{ed.institution}</p>
                  {ed.gpa && <p className="text-xs text-gray-600 mt-0.5">{ed.gpa}</p>}
                  {ed.description && <p className="text-xs text-gray-600 mt-0.5 italic">{ed.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {active.projects && (
        <section className="mb-7">
          {sectionNumber("Research & Projects", 4)}
          <div className="space-y-3">
            {data.projects.map((pr) => (
              <div key={pr.id}>
                <p className="text-sm text-gray-900">
                  <span className="font-bold">{pr.name}</span>
                  {pr.link ? <span className="italic text-gray-600"> — {pr.link}</span> : null}
                  <span className="text-xs text-gray-500 italic"> ({formatDateRange(pr.startDate, pr.endDate)})</span>
                </p>
                {pr.description && <p className="text-sm text-gray-700 mt-0.5">{pr.description}</p>}
                {pr.technologies.length > 0 && (
                  <p className="text-xs text-gray-500 italic mt-0.5">Methods: {pr.technologies.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {active.skills && (
        <section className="mb-7">
          {sectionNumber("Areas of Expertise", 5)}
          <div className="space-y-2">
            {data.skills.map((s) => (
              <p key={s.id} className="text-sm text-gray-800">
                <span className="font-bold">{s.category}:</span> {s.items.join(", ")}
              </p>
            ))}
          </div>
        </section>
      )}

      {active.certifications && (
        <section className="mb-7">
          {sectionNumber("Honors & Certifications", 6)}
          <ul className="space-y-1">
            {data.certifications.map((c) => (
              <li key={c.id} className="text-sm text-gray-800">
                <span className="font-bold">{c.name}</span>{c.issuer ? `, ${c.issuer}` : ""}{c.date ? ` — ${c.date}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {active.languages && (
        <section className="mb-7">
          {sectionNumber("Languages", 7)}
          <p className="text-sm text-gray-800">
            {data.languages.map((l) => `${l.name} (${l.proficiency})`).join("; ")}
          </p>
        </section>
      )}

      {data.customSections.filter((s) => s.items.length > 0).map((s, i) => (
        <section key={s.id} className="mb-7">
          {sectionNumber(s.title, 8 + i)}
          <ul className="space-y-1 text-sm text-gray-800">
            {s.items.map((it, idx) => (
              <li key={idx} className="flex gap-2">
                <span style={{ color: accent }}>—</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export { AcademicTemplate };

// ---------- COMPACT template ----------

function CompactTemplate({ data, accent }: { data: ResumeData; accent: string }) {
  const active = getActiveSections(data);
  const contacts = contactItems(data);
  const p = data.personalInfo;

  return (
    <div className="px-8 py-7 min-h-full bg-white" style={{ fontSize: "12.5px", lineHeight: 1.4 }}>
      {/* Header — single line, dense */}
      <header className="mb-4 pb-2.5 border-b-2" style={{ borderColor: accent }}>
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: shade(accent, -0.2) }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && <p className="text-sm font-semibold" style={{ color: accent }}>{p.jobTitle}</p>}
          </div>
          {contacts.length > 0 && (
            <div className="text-[10px] text-gray-600 text-right leading-snug">
              {contacts.map((c, i) => (
                <span key={c.label}>
                  {c.value}{i < contacts.length - 1 && <span className="mx-1 text-gray-400">|</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {active.summary && (
        <section className="mb-3.5">
          <p className="text-xs text-gray-700 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Two-column dense layout for experience + side info */}
      <div className={`grid gap-5 ${active.skills || active.languages || active.certifications ? "grid-cols-[1fr_180px]" : "grid-cols-1"}`}>
        <div>
          {active.experience && (
            <section className="mb-3.5">
              <CompactHeading accent={accent}>Experience</CompactHeading>
              <div className="space-y-2.5">
                {data.experience.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <p className="font-bold text-gray-900 text-[13px]">
                        {e.position}{e.company ? <span className="font-normal text-gray-600"> · {e.company}</span> : null}
                      </p>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                    </div>
                    {e.description && <p className="text-xs text-gray-700 mt-0.5">{e.description}</p>}
                    {e.achievements.length > 0 && (
                      <ul className="mt-0.5 space-y-0.5 text-xs text-gray-700">
                        {e.achievements.map((a, i) => (
                          <li key={i} className="flex gap-1.5">
                            <span style={{ color: accent }}>▸</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {active.projects && (
            <section className="mb-3.5">
              <CompactHeading accent={accent}>Projects</CompactHeading>
              <div className="space-y-2">
                {data.projects.map((pr) => (
                  <div key={pr.id}>
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <p className="font-bold text-gray-900 text-xs">
                        {pr.name}{pr.link ? <span className="font-normal text-gray-500"> · {pr.link}</span> : null}
                      </p>
                      <span className="text-[10px] text-gray-500">{formatDateRange(pr.startDate, pr.endDate)}</span>
                    </div>
                    {pr.description && <p className="text-xs text-gray-700 mt-0.5">{pr.description}</p>}
                    {pr.technologies.length > 0 && (
                      <p className="text-[10px] text-gray-500 mt-0.5">[{pr.technologies.join(", ")}]</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {active.education && (
            <section className="mb-3.5">
              <CompactHeading accent={accent}>Education</CompactHeading>
              <div className="space-y-1.5">
                {data.education.map((ed) => (
                  <div key={ed.id} className="flex items-baseline justify-between gap-2 flex-wrap">
                    <div>
                      <span className="font-bold text-gray-900 text-xs">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</span>
                      <span className="text-gray-600 text-xs"> — {ed.institution}{ed.gpa ? ` · ${ed.gpa}` : ""}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{formatDateRange(ed.startDate, ed.endDate)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.customSections.filter((s) => s.items.length > 0).map((s) => (
            <section key={s.id} className="mb-3.5">
              <CompactHeading accent={accent}>{s.title}</CompactHeading>
              <ul className="space-y-0.5 text-xs text-gray-700">
                {s.items.map((it, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span style={{ color: accent }}>▸</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Side rail */}
        {(active.skills || active.languages || active.certifications) && (
          <aside className="space-y-3">
            {active.skills && (
              <section>
                <CompactHeading accent={accent} small>Skills</CompactHeading>
                <div className="space-y-1.5">
                  {data.skills.map((s) => (
                    <div key={s.id}>
                      <p className="text-[10px] uppercase tracking-wide font-bold text-gray-500">{s.category}</p>
                      <p className="text-[11px] text-gray-700 leading-snug">{s.items.join(", ")}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {active.languages && (
              <section>
                <CompactHeading accent={accent} small>Languages</CompactHeading>
                <ul className="space-y-0.5 text-[11px] text-gray-700">
                  {data.languages.map((l) => (
                    <li key={l.id} className="flex justify-between">
                      <span>{l.name}</span>
                      <span className="text-gray-500">{l.proficiency}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {active.certifications && (
              <section>
                <CompactHeading accent={accent} small>Certs</CompactHeading>
                <div className="space-y-1 text-[11px] text-gray-700">
                  {data.certifications.map((c) => (
                    <div key={c.id}>
                      <p className="font-semibold text-gray-800">{c.name}</p>
                      <p className="text-gray-500 text-[10px]">{c.issuer}{c.date ? ` · ${c.date}` : ""}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
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
