"use client";

import type { ResumeData } from "@/lib/resume/types";
import { formatDateRange, getActiveSections, withAlpha, shade, initials, contactItems } from "@/lib/resume/template-helpers";
import { Avatar, MainSection } from "./basic-templates";

// ---------- CREATIVE template ----------

function CreativeTemplate({ data, accent }: { data: ResumeData; accent: string }) {
  const active = getActiveSections(data);
  const contacts = contactItems(data);
  const name = data.personalInfo.fullName || "Your Name";

  return (
    <div className="min-h-full bg-white">
      {/* Banner header */}
      <header
        className="relative px-10 py-9 text-white overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent} 0%, ${shade(accent, -0.25)} 100%)` }}
      >
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full opacity-20" style={{ background: "#fff" }} />
        <div className="absolute right-24 -bottom-12 w-28 h-28 rounded-full opacity-10" style={{ background: "#fff" }} />
        <div className="relative flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/40 shadow-lg shrink-0">
            <Avatar data={data} accent={accent} template="creative" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none">{name}</h1>
            <p className="text-xl font-light mt-1.5 text-white/90">{data.personalInfo.jobTitle || "Your Title"}</p>
            {data.personalInfo.tagline && (
              <p className="text-sm text-white/80 mt-2 italic">"{data.personalInfo.tagline}"</p>
            )}
          </div>
        </div>
        {contacts.length > 0 && (
          <div className="relative flex flex-wrap gap-x-5 gap-y-1.5 mt-5 text-xs text-white/90">
            {contacts.map((c) => (
              <span key={c.label} className="flex items-center gap-1">
                <span className="opacity-60">{c.label}:</span>
                <span>{c.value}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="px-10 py-8 grid grid-cols-[1fr_280px] gap-8">
        {/* Main */}
        <div>
          {active.summary && (
            <CreativeSection title="About" accent={accent} marker>
              <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
            </CreativeSection>
          )}

          {active.experience && (
            <CreativeSection title="Experience" accent={accent} marker>
              <div className="space-y-5">
                {data.experience.map((e) => (
                  <div key={e.id} className="relative pl-4 border-l-2" style={{ borderColor: withAlpha(accent, 0.3) }}>
                    <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full" style={{ background: accent }} />
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-base">{e.position}</h3>
                      <span className="text-xs text-gray-500">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: accent }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                    {e.description && <p className="text-sm text-gray-700 mt-1.5">{e.description}</p>}
                    {e.achievements.length > 0 && (
                      <ul className="mt-1.5 space-y-1 text-sm text-gray-700">
                        {e.achievements.map((a, i) => (
                          <li key={i} className="flex gap-2">
                            <span style={{ color: accent }}>▸</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </CreativeSection>
          )}

          {active.projects && (
            <CreativeSection title="Projects" accent={accent} marker>
              <div className="grid grid-cols-1 gap-4">
                {data.projects.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl" style={{ background: withAlpha(accent, 0.06) }}>
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <h3 className="font-bold text-gray-900">{p.name}</h3>
                      <span className="text-xs text-gray-500">{formatDateRange(p.startDate, p.endDate)}</span>
                    </div>
                    {p.description && <p className="text-sm text-gray-700 mt-1">{p.description}</p>}
                    {p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.technologies.map((t, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: accent, color: "#fff" }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CreativeSection>
          )}

          {active.education && (
            <CreativeSection title="Education" accent={accent} marker>
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id}>
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-sm">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</h3>
                      <span className="text-xs text-gray-500">{formatDateRange(ed.startDate, ed.endDate)}</span>
                    </div>
                    <p className="text-sm" style={{ color: accent }}>{ed.institution}{ed.gpa ? ` · GPA ${ed.gpa}` : ""}</p>
                    {ed.description && <p className="text-xs text-gray-600 mt-0.5">{ed.description}</p>}
                  </div>
                ))}
              </div>
            </CreativeSection>
          )}
        </div>

        {/* Side */}
        <aside className="space-y-6">
          {active.skills && (
            <CreativeSection title="Skills" accent={accent}>
              <div className="space-y-3">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <p className="text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">{s.category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.items.map((it, i) => (
                        <span key={i} className="text-[11px] px-2 py-1 rounded font-medium text-gray-700" style={{ background: withAlpha(accent, 0.12) }}>
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CreativeSection>
          )}

          {active.languages && (
            <CreativeSection title="Languages" accent={accent}>
              <ul className="space-y-2">
                {data.languages.map((l) => (
                  <li key={l.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{l.name}</span>
                      <span className="text-gray-500">{l.proficiency}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: l.proficiency === "Native" ? "100%" : l.proficiency === "Professional" ? "85%" : l.proficiency === "Fluent" ? "75%" : "55%",
                          background: accent,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </CreativeSection>
          )}

          {active.certifications && (
            <CreativeSection title="Certs" accent={accent}>
              <div className="space-y-2.5">
                {data.certifications.map((c) => (
                  <div key={c.id} className="text-xs">
                    <p className="font-semibold text-gray-800">{c.name}</p>
                    <p className="text-gray-500">{c.issuer}{c.date ? ` · ${c.date}` : ""}</p>
                  </div>
                ))}
              </div>
            </CreativeSection>
          )}

          {data.customSections.filter((s) => s.items.length > 0).map((s) => (
            <CreativeSection key={s.id} title={s.title} accent={accent}>
              <ul className="space-y-1 text-xs text-gray-700">
                {s.items.map((it, i) => (
                  <li key={i}>• {it}</li>
                ))}
              </ul>
            </CreativeSection>
          ))}
        </aside>
      </div>
    </div>
  );
}

function CreativeSection({ title, accent, marker, children }: { title: string; accent: string; marker?: boolean; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wide mb-3" style={{ color: shade(accent, -0.1) }}>
        {marker && <span className="inline-block w-6 h-1.5 rounded-full" style={{ background: accent }} />}
        {title}
      </h2>
      {children}
    </section>
  );
}

export { CreativeTemplate };

// ---------- CLASSIC template ----------

function ClassicTemplate({ data, accent }: { data: ResumeData; accent: string }) {
  const active = getActiveSections(data);
  const contacts = contactItems(data);
  return (
    <div className="p-12 min-h-full bg-white" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-wide" style={{ color: shade(accent, -0.2) }}>
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <p className="text-base mt-1 italic text-gray-700">{data.personalInfo.jobTitle || "Your Title"}</p>
        {contacts.length > 0 && (
          <p className="text-xs text-gray-600 mt-2">
            {contacts.map((c) => c.value).join("  |  ")}
          </p>
        )}
        <div className="mt-4 border-t-2 border-b-2 py-1" style={{ borderColor: accent }}>
          <div className="h-0.5" style={{ background: accent }} />
        </div>
      </header>

      {active.summary && (
        <ClassicSection title="Professional Summary" accent={accent}>
          <p className="text-sm text-gray-800 leading-relaxed text-justify">{data.summary}</p>
        </ClassicSection>
      )}

      {active.experience && (
        <ClassicSection title="Work Experience" accent={accent}>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-base">{e.position}, <span className="italic">{e.company}</span></h3>
                  <span className="text-xs text-gray-600 italic">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                </div>
                {e.location && <p className="text-xs text-gray-600 italic mb-1">{e.location}</p>}
                {e.description && <p className="text-sm text-gray-800 mb-1">{e.description}</p>}
                {e.achievements.length > 0 && (
                  <ul className="list-disc pl-5 space-y-0.5 text-sm text-gray-800">
                    {e.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </ClassicSection>
      )}

      {active.education && (
        <ClassicSection title="Education" accent={accent}>
          <div className="space-y-2">
            {data.education.map((ed) => (
              <div key={ed.id}>
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-sm">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</h3>
                  <span className="text-xs text-gray-600 italic">{formatDateRange(ed.startDate, ed.endDate)}</span>
                </div>
                <p className="text-sm text-gray-800 italic">{ed.institution}{ed.gpa ? ` — GPA: ${ed.gpa}` : ""}</p>
                {ed.description && <p className="text-xs text-gray-700 mt-0.5">{ed.description}</p>}
              </div>
            ))}
          </div>
        </ClassicSection>
      )}

      {active.skills && (
        <ClassicSection title="Skills" accent={accent}>
          <div className="space-y-1.5">
            {data.skills.map((s) => (
              <p key={s.id} className="text-sm text-gray-800">
                <span className="font-bold">{s.category}:</span> {s.items.join(", ")}
              </p>
            ))}
          </div>
        </ClassicSection>
      )}

      {active.projects && (
        <ClassicSection title="Selected Projects" accent={accent}>
          <div className="space-y-2.5">
            {data.projects.map((p) => (
              <div key={p.id}>
                <h3 className="font-bold text-gray-900 text-sm">{p.name}{p.link ? ` (${p.link})` : ""}</h3>
                {p.description && <p className="text-sm text-gray-800">{p.description}</p>}
                {p.technologies.length > 0 && (
                  <p className="text-xs text-gray-600 italic">{p.technologies.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </ClassicSection>
      )}

      {active.certifications && (
        <ClassicSection title="Certifications" accent={accent}>
          <div className="space-y-1">
            {data.certifications.map((c) => (
              <p key={c.id} className="text-sm text-gray-800">
                <span className="font-bold">{c.name}</span>{c.issuer ? `, ${c.issuer}` : ""}{c.date ? ` — ${c.date}` : ""}
              </p>
            ))}
          </div>
        </ClassicSection>
      )}

      {active.languages && (
        <ClassicSection title="Languages" accent={accent}>
          <p className="text-sm text-gray-800">
            {data.languages.map((l) => `${l.name} (${l.proficiency})`).join("; ")}
          </p>
        </ClassicSection>
      )}

      {data.customSections.filter((s) => s.items.length > 0).map((s) => (
        <ClassicSection key={s.id} title={s.title} accent={accent}>
          <ul className="list-disc pl-5 space-y-0.5 text-sm text-gray-800">
            {s.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </ClassicSection>
      ))}
    </div>
  );
}

function ClassicSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-center text-sm font-bold uppercase tracking-widest mb-3" style={{ color: shade(accent, -0.15) }}>
        — {title} —
      </h2>
      <div className="h-px mb-3" style={{ background: withAlpha(accent, 0.4) }} />
      {children}
    </section>
  );
}

export { ClassicTemplate };

// ---------- EXECUTIVE template ----------

function ExecutiveTemplate({ data, accent }: { data: ResumeData; accent: string }) {
  const active = getActiveSections(data);
  const contacts = contactItems(data);
  return (
    <div className="p-12 min-h-full bg-white" style={{ fontFamily: "'Playfair Display', 'Garamond', serif" }}>
      <header className="flex items-center justify-between gap-6 mb-2 pb-5 border-b-2" style={{ borderColor: accent }}>
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: shade(accent, -0.25) }}>
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-lg italic mt-1 text-gray-600" style={{ fontFamily: "Georgia, serif" }}>
            {data.personalInfo.jobTitle || "Your Title"}
          </p>
        </div>
        {data.personalInfo.photo && (
          <div className="w-24 h-28 overflow-hidden shrink-0" style={{ border: `2px solid ${accent}` }}>
            <Avatar data={data} accent={accent} template="executive" />
          </div>
        )}
      </header>
      {contacts.length > 0 && (
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600 mb-7 -mt-2" style={{ fontFamily: "Georgia, serif" }}>
          {contacts.map((c) => (
            <span key={c.label}>{c.value}</span>
          ))}
        </div>
      )}

      {active.summary && (
        <ExecSection title="Executive Summary" accent={accent}>
          <p className="text-sm text-gray-800 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>{data.summary}</p>
        </ExecSection>
      )}

      {active.experience && (
        <ExecSection title="Professional Experience" accent={accent}>
          <div className="space-y-5">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-base">{e.company}</h3>
                  <span className="text-xs text-gray-600 italic" style={{ fontFamily: "Georgia, serif" }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                </div>
                <p className="text-sm italic mb-1" style={{ color: accent, fontFamily: "Georgia, serif" }}>{e.position}{e.location ? ` · ${e.location}` : ""}</p>
                {e.description && <p className="text-sm text-gray-800 mb-1" style={{ fontFamily: "Georgia, serif" }}>{e.description}</p>}
                {e.achievements.length > 0 && (
                  <ul className="space-y-1 text-sm text-gray-800 mt-1" style={{ fontFamily: "Georgia, serif" }}>
                    {e.achievements.map((a, i) => (
                      <li key={i} className="flex gap-2">
                        <span style={{ color: accent }}>◆</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </ExecSection>
      )}

      {active.education && (
        <ExecSection title="Education" accent={accent}>
          <div className="space-y-2">
            {data.education.map((ed) => (
              <div key={ed.id} className="flex items-baseline justify-between gap-3 flex-wrap">
                <div>
                  <span className="font-bold text-gray-900 text-sm" style={{ fontFamily: "Georgia, serif" }}>{ed.degree}{ed.field ? `, ${ed.field}` : ""}</span>
                  <span className="text-sm text-gray-700 italic" style={{ fontFamily: "Georgia, serif" }}> — {ed.institution}</span>
                </div>
                <span className="text-xs text-gray-600 italic" style={{ fontFamily: "Georgia, serif" }}>{formatDateRange(ed.startDate, ed.endDate)}{ed.gpa ? ` · GPA ${ed.gpa}` : ""}</span>
              </div>
            ))}
          </div>
        </ExecSection>
      )}

      {active.skills && (
        <ExecSection title="Core Competencies" accent={accent}>
          <div className="space-y-1.5">
            {data.skills.map((s) => (
              <p key={s.id} className="text-sm text-gray-800" style={{ fontFamily: "Georgia, serif" }}>
                <span className="font-bold">{s.category}:</span> {s.items.join(", ")}
              </p>
            ))}
          </div>
        </ExecSection>
      )}

      {active.projects && (
        <ExecSection title="Notable Projects" accent={accent}>
          <div className="space-y-2.5">
            {data.projects.map((p) => (
              <div key={p.id}>
                <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: "Georgia, serif" }}>{p.name}{p.link ? ` · ${p.link}` : ""}</h3>
                {p.description && <p className="text-sm text-gray-800" style={{ fontFamily: "Georgia, serif" }}>{p.description}</p>}
              </div>
            ))}
          </div>
        </ExecSection>
      )}

      {active.certifications && (
        <ExecSection title="Certifications" accent={accent}>
          <ul className="space-y-1">
            {data.certifications.map((c) => (
              <li key={c.id} className="text-sm text-gray-800" style={{ fontFamily: "Georgia, serif" }}>
                <span className="font-bold">{c.name}</span>{c.issuer ? `, ${c.issuer}` : ""}{c.date ? ` — ${c.date}` : ""}
              </li>
            ))}
          </ul>
        </ExecSection>
      )}

      {active.languages && (
        <ExecSection title="Languages" accent={accent}>
          <p className="text-sm text-gray-800" style={{ fontFamily: "Georgia, serif" }}>
            {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}
          </p>
        </ExecSection>
      )}

      {data.customSections.filter((s) => s.items.length > 0).map((s) => (
        <ExecSection key={s.id} title={s.title} accent={accent}>
          <ul className="space-y-1 text-sm text-gray-800" style={{ fontFamily: "Georgia, serif" }}>
            {s.items.map((it, i) => (
              <li key={i}>• {it}</li>
            ))}
          </ul>
        </ExecSection>
      ))}
    </div>
  );
}

function ExecSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-[0.25em] mb-2 pb-1 border-b" style={{ color: shade(accent, -0.15), borderColor: withAlpha(accent, 0.5) }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export { ExecutiveTemplate };

// ---------- TECH template ----------

function TechTemplate({ data, accent }: { data: ResumeData; accent: string }) {
  const active = getActiveSections(data);
  const contacts = contactItems(data);
  const dark = "#0f172a";
  return (
    <div className="flex min-h-full bg-white" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {/* Sidebar */}
      <aside className="w-[32%] p-6 text-gray-300" style={{ background: dark }}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-lg overflow-hidden border-2 mb-3" style={{ borderColor: accent }}>
            <Avatar data={data} accent={accent} template="tech" />
          </div>
          <code className="text-xs text-slate-500">{"// profile"}</code>
        </div>

        {contacts.length > 0 && (
          <TechSide title="contact" accent={accent}>
            <ul className="space-y-1.5 text-xs">
              {contacts.map((c) => (
                <li key={c.label} className="break-all">
                  <span style={{ color: accent }}>{">"}</span> <span className="text-slate-400">{c.label}:</span>{" "}
                  <span className="text-slate-200">{c.value}</span>
                </li>
              ))}
            </ul>
          </TechSide>
        )}

        {active.skills && (
          <TechSide title="skills" accent={accent}>
            <div className="space-y-3">
              {data.skills.map((s) => (
                <div key={s.id}>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{"// "}{s.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {s.items.map((it, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: withAlpha(accent, 0.18), color: accent }}>
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TechSide>
        )}

        {active.languages && (
          <TechSide title="languages" accent={accent}>
            <ul className="space-y-1 text-xs">
              {data.languages.map((l) => (
                <li key={l.id}>
                  <span style={{ color: accent }}>{">"}</span> <span className="text-slate-200">{l.name}</span>
                  <span className="text-slate-500">{" // "}{l.proficiency}</span>
                </li>
              ))}
            </ul>
          </TechSide>
        )}

        {active.certifications && (
          <TechSide title="certs" accent={accent}>
            <div className="space-y-2 text-xs">
              {data.certifications.map((c) => (
                <div key={c.id}>
                  <p className="text-slate-200">{c.name}</p>
                  <p className="text-slate-500 text-[10px]">{c.issuer}{c.date ? ` · ${c.date}` : ""}</p>
                </div>
              ))}
            </div>
          </TechSide>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 p-7 text-slate-800">
        <header className="mb-6 pb-4 border-b-2 border-dashed" style={{ borderColor: withAlpha(accent, 0.4) }}>
          <code className="text-xs text-slate-400 block mb-1">{"const developer = {"}</code>
          <h1 className="text-3xl font-bold tracking-tight ml-4" style={{ color: dark }}>
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-base ml-4" style={{ color: accent }}>
            <span className="text-slate-400">role:</span> {`"${data.personalInfo.jobTitle || "Your Title"}",`}
          </p>
          {data.personalInfo.tagline && (
            <p className="text-xs ml-4 text-slate-500 italic">{"// "}{data.personalInfo.tagline}</p>
          )}
          <code className="text-xs text-slate-400 block mt-1">{"}"}</code>
        </header>

        {active.summary && (
          <TechMain title="about" accent={accent}>
            <p className="text-sm text-slate-700 leading-relaxed ml-4">{data.summary}</p>
          </TechMain>
        )}

        {active.experience && (
          <TechMain title="experience" accent={accent}>
            <div className="space-y-5 ml-4">
              {data.experience.map((e, idx) => (
                <div key={e.id}>
                  <code className="text-xs text-slate-400">{"// "}job_{idx + 1}</code>
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm">
                      <span style={{ color: accent }}>position:</span> "{e.position}"
                    </h3>
                    <span className="text-[10px] text-slate-500">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                  </div>
                  <p className="text-xs" style={{ color: accent }}>
                    <span className="text-slate-400">company:</span> "{e.company}"{e.location ? `, "${e.location}"` : ""}
                  </p>
                  {e.description && <p className="text-sm text-slate-700 mt-1">{e.description}</p>}
                  {e.achievements.length > 0 && (
                    <ul className="mt-1.5 space-y-1 text-sm text-slate-700">
                      {e.achievements.map((a, i) => (
                        <li key={i} className="flex gap-2">
                          <span style={{ color: accent }}>+</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </TechMain>
        )}

        {active.projects && (
          <TechMain title="projects" accent={accent}>
            <div className="space-y-4 ml-4">
              {data.projects.map((p) => (
                <div key={p.id} className="p-3 rounded border-l-2" style={{ borderColor: accent, background: withAlpha(accent, 0.04) }}>
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm">{p.name}{p.link ? ` · ${p.link}` : ""}</h3>
                    <span className="text-[10px] text-slate-500">{formatDateRange(p.startDate, p.endDate)}</span>
                  </div>
                  {p.description && <p className="text-sm text-slate-700 mt-1">{p.description}</p>}
                  {p.technologies.length > 0 && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      <span style={{ color: accent }}>stack:</span> [{p.technologies.join(", ")}]
                    </p>
                  )}
                </div>
              ))}
            </div>
          </TechMain>
        )}

        {active.education && (
          <TechMain title="education" accent={accent}>
            <div className="space-y-2 ml-4">
              {data.education.map((ed) => (
                <div key={ed.id}>
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {ed.degree}{ed.field ? `, ${ed.field}` : ""}
                    </h3>
                    <span className="text-[10px] text-slate-500">{formatDateRange(ed.startDate, ed.endDate)}</span>
                  </div>
                  <p className="text-xs" style={{ color: accent }}>{ed.institution}{ed.gpa ? ` · GPA ${ed.gpa}` : ""}</p>
                </div>
              ))}
            </div>
          </TechMain>
        )}

        {data.customSections.filter((s) => s.items.length > 0).map((s) => (
          <TechMain key={s.id} title={s.title.toLowerCase().replace(/\s+/g, "_")} accent={accent}>
            <ul className="space-y-1 text-sm text-slate-700 ml-4">
              {s.items.map((it, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: accent }}>-</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </TechMain>
        ))}
      </main>
    </div>
  );
}

function TechMain({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-bold mb-3">
        <span style={{ color: accent }}>##</span> <span className="text-slate-800">{title}</span>
      </h2>
      {children}
    </section>
  );
}

function TechSide({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="text-xs font-bold mb-2.5 pb-1 border-b border-slate-700">
        <span style={{ color: accent }}>$</span> <span className="text-slate-300">{title}</span>
      </h2>
      {children}
    </section>
  );
}

export { TechTemplate };
