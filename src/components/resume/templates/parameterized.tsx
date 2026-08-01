"use client";

import type { ResumeData } from "@/lib/resume/types";
import type { TemplateSpec, VisualArchetype } from "@/lib/resume/template-specs";
import { formatDateRange, getActiveSections, withAlpha, shade, initials, contactItems } from "@/lib/resume/template-helpers";

const fontClassMap: Record<string, string> = {
  inter: "font-sans",
  poppins: "font-[Poppins]",
  merriweather: "font-[Merriweather]",
  playfair: "font-[Playfair_Display]",
  jetbrains: "font-mono",
  montserrat: "font-[Montserrat]",
  roboto: "font-[Roboto]",
  lora: "font-[Lora]",
  "dm-sans": "font-[DM_Sans]",
  "space-grotesk": "font-[Space_Grotesk]",
  "plus-jakarta": "font-[Plus_Jakarta_Sans]",
  manrope: "font-[Manrope]",
  "work-sans": "font-[Work_Sans]",
  "source-sans": "font-[Source_Sans_Pro]",
  "crimson-text": "font-[Crimson_Text]",
};

function getFontClass(id: string) {
  return fontClassMap[id] || "font-sans";
}

interface Density {
  fontSize: string;
  headingSize: string;
  nameSize: string;
  pad: string;
  sectionGap: string;
  itemGap: string;
}

const DENSITIES: Record<TemplateSpec["density"], Density> = {
  compact: { fontSize: "12px", headingSize: "11px", nameSize: "22px", pad: "p-5", sectionGap: "mb-3.5", itemGap: "space-y-2" },
  normal: { fontSize: "13.5px", headingSize: "12px", nameSize: "26px", pad: "p-7", sectionGap: "mb-5", itemGap: "space-y-3" },
  spacious: { fontSize: "14.5px", headingSize: "13px", nameSize: "30px", pad: "p-10", sectionGap: "mb-6.5", itemGap: "space-y-3.5" },
};

function Avatar({ data, accent, size = "w-20 h-20" }: { data: ResumeData; accent: string; size?: string }) {
  const photo = data.personalInfo.photo;
  if (photo) {
    return <img src={photo} alt={data.personalInfo.fullName} className={`${size} object-cover rounded-full shadow-md`} />;
  }
  return (
    <div className={`${size} rounded-full flex items-center justify-center font-bold shadow-md`} style={{ background: withAlpha(accent, 0.2), color: accent, fontSize: "1.2rem" }}>
      {initials(data.personalInfo.fullName) || "?"}
    </div>
  );
}

function Bullet({ style, accent }: { style: TemplateSpec["bulletStyle"]; accent: string }) {
  const map: Record<TemplateSpec["bulletStyle"], string> = {
    dot: "•",
    dash: "—",
    arrow: "▸",
    diamond: "◆",
    check: "✓",
    none: "",
  };
  const ch = map[style];
  if (!ch) return null;
  return <span style={{ color: accent }} className="shrink-0 mr-1.5 font-bold">{ch}</span>;
}

function Bullets({ items, spec }: { items: string[]; spec: TemplateSpec }) {
  if (items.length === 0) return null;
  return (
    <ul className={`mt-1.5 ${spec.density === "compact" ? "space-y-0.5" : "space-y-1"}`}>
      {items.map((a, i) => (
        <li key={i} className="flex gap-0.5" style={{ fontSize: DENSITIES[spec.density].fontSize }}>
          {spec.bulletStyle !== "none" && <Bullet style={spec.bulletStyle} accent={spec.accent} />}
          <span className="text-gray-700 leading-snug">{a}</span>
        </li>
      ))}
    </ul>
  );
}

// ── ARCHETYPE 1: TIMELINE & PATHWAY RENDERER ──
function TimelineLayout({ data, spec }: { data: ResumeData; spec: TemplateSpec }) {
  const active = getActiveSections(data);
  const accent = spec.accent;
  const contacts = contactItems(data);
  const p = data.personalInfo;
  const fontClass = getFontClass(spec.font);

  return (
    <div className={`min-h-full bg-white p-8 ${fontClass}`}>
      {/* Header with Timeline Accent Header */}
      <header className="mb-8 pb-4 border-b-2" style={{ borderColor: accent }}>
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: shade(accent, -0.25) }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && <p className="text-base font-medium mt-0.5 text-gray-700">{p.jobTitle}</p>}
          </div>
          {contacts.length > 0 && (
            <div className="text-xs text-gray-600 text-right space-y-0.5 font-mono">
              {contacts.map((c) => (
                <p key={c.label}><span className="text-[#FF6200] font-bold">{c.label}:</span> {c.value}</p>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {active.summary && (
        <section className="mb-6 p-4 rounded-xl" style={{ background: withAlpha(accent, 0.06), borderLeft: `4px solid ${accent}` }}>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>Profile Overview</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Experience as a Real Vertical Timeline */}
      {active.experience && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4 pb-1 border-b" style={{ color: shade(accent, -0.2), borderColor: withAlpha(accent, 0.3) }}>
            ⏱ Career Pathway & Experience
          </h2>
          <div className="relative pl-6 space-y-6 border-l-2" style={{ borderColor: withAlpha(accent, 0.3) }}>
            {data.experience.map((e, idx) => (
              <div key={e.id} className="relative">
                {/* Timeline node icon */}
                <div
                  className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md"
                  style={{ background: accent }}
                >
                  {idx + 1}
                </div>
                <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-base">{e.position}</h3>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full text-white font-medium" style={{ background: accent }}>
                    {formatDateRange(e.startDate, e.endDate, e.current)}
                  </span>
                </div>
                <p className="text-xs font-semibold mb-1" style={{ color: shade(accent, -0.1) }}>
                  {e.company}{e.location ? ` · ${e.location}` : ""}
                </p>
                {e.description && <p className="text-xs text-gray-700 mb-2 leading-relaxed">{e.description}</p>}
                <Bullets items={e.achievements} spec={spec} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Grid */}
      {active.skills && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: shade(accent, -0.2), borderColor: withAlpha(accent, 0.3) }}>
            Technical Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.skills.map((s) => (
              <div key={s.id} className="p-3 rounded-lg border" style={{ borderColor: withAlpha(accent, 0.25), background: withAlpha(accent, 0.03) }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: accent }}>{s.category}</p>
                <div className="flex flex-wrap gap-1">
                  {s.items.map((it, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-md font-medium text-gray-800 bg-white border border-gray-200 shadow-2xs">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {active.education && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: shade(accent, -0.2), borderColor: withAlpha(accent, 0.3) }}>
            Education & Degrees
          </h2>
          <div className="space-y-3">
            {data.education.map((ed) => (
              <div key={ed.id} className="flex justify-between items-baseline flex-wrap gap-2">
                <div>
                  <p className="font-bold text-sm text-gray-900">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</p>
                  <p className="text-xs font-medium" style={{ color: accent }}>{ed.institution}{ed.gpa ? ` · GPA ${ed.gpa}` : ""}</p>
                </div>
                <span className="text-xs text-gray-500 font-mono">{formatDateRange(ed.startDate, ed.endDate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── ARCHETYPE 2: CARD BLOCKS RENDERER ──
function CardBlocksLayout({ data, spec }: { data: ResumeData; spec: TemplateSpec }) {
  const active = getActiveSections(data);
  const accent = spec.accent;
  const contacts = contactItems(data);
  const p = data.personalInfo;
  const fontClass = getFontClass(spec.font);

  return (
    <div className={`min-h-full bg-slate-50/60 p-8 ${fontClass}`}>
      {/* Header Card */}
      <header className="mb-6 p-6 rounded-2xl bg-white border shadow-sm" style={{ borderColor: withAlpha(accent, 0.3), borderTop: `5px solid ${accent}` }}>
        <div className="flex items-center gap-5 flex-wrap">
          {spec.hasPhoto && <Avatar data={data} accent={accent} size="w-20 h-20" />}
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{p.fullName || "Your Name"}</h1>
            {p.jobTitle && <p className="text-base font-semibold mt-0.5" style={{ color: accent }}>{p.jobTitle}</p>}
            {contacts.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-600">
                {contacts.map((c) => (
                  <span key={c.label} className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{c.value}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Summary Card */}
      {active.summary && (
        <div className="mb-5 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">About Me</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Experience Block Cards */}
      {active.experience && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Professional Experience</h2>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div
                key={e.id}
                className="p-5 rounded-xl bg-white border shadow-sm transition-all hover:shadow-md"
                style={{ borderColor: withAlpha(accent, 0.25), borderLeft: `4px solid ${accent}` }}
              >
                <div className="flex justify-between items-baseline flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 text-base">{e.position}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: withAlpha(accent, 0.12), color: accent }}>
                    {formatDateRange(e.startDate, e.endDate, e.current)}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600 mb-2">{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                {e.description && <p className="text-xs text-slate-700 mb-2 leading-relaxed">{e.description}</p>}
                <Bullets items={e.achievements} spec={spec} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Cards */}
      {active.projects && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Key Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.projects.map((pr) => (
              <div key={pr.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{pr.name}</h3>
                  {pr.description && <p className="text-xs text-slate-600 mb-3">{pr.description}</p>}
                </div>
                {pr.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                    {pr.technologies.map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md font-medium text-white" style={{ background: accent }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {active.skills && (
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-400">Skills & Tools</h2>
            <div className="space-y-2.5">
              {data.skills.map((s) => (
                <div key={s.id}>
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">{s.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {s.items.map((it, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active.education && (
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-400">Education</h2>
            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id}>
                  <p className="font-bold text-sm text-slate-900">{ed.degree}</p>
                  <p className="text-xs text-slate-600">{ed.institution}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{formatDateRange(ed.startDate, ed.endDate)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ARCHETYPE 3: EDITORIAL & MAGAZINE RENDERER ──
function EditorialLayout({ data, spec }: { data: ResumeData; spec: TemplateSpec }) {
  const active = getActiveSections(data);
  const accent = spec.accent;
  const contacts = contactItems(data);
  const p = data.personalInfo;
  const fontClass = getFontClass(spec.font);

  return (
    <div className={`min-h-full bg-[#FAF8F5] p-10 text-stone-900 ${fontClass}`}>
      {/* Editorial Frame Border */}
      <div className="border-4 border-double border-stone-300 p-8 min-h-full">
        {/* Header */}
        <header className="text-center mb-8 pb-6 border-b border-stone-300">
          <h1 className="text-4xl font-serif tracking-tight text-stone-900 mb-1">
            {p.fullName || "Your Name"}
          </h1>
          {p.jobTitle && <p className="text-lg italic font-serif text-stone-600 mb-3">{p.jobTitle}</p>}
          {contacts.length > 0 && (
            <p className="text-xs font-serif text-stone-500 tracking-wide uppercase">
              {contacts.map((c) => c.value).join("  ❖  ")}
            </p>
          )}
        </header>

        {/* Summary Blockquote */}
        {active.summary && (
          <blockquote className="mb-8 px-6 py-4 italic font-serif text-sm text-stone-700 bg-stone-100/60 border-l-2 border-stone-400 text-center leading-relaxed">
            "{data.summary}"
          </blockquote>
        )}

        {/* Experience - Split Date Left, Content Right */}
        {active.experience && (
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-center mb-6 pb-1 border-b border-stone-300">
              ❖   Professional Record   ❖
            </h2>
            <div className="space-y-6">
              {data.experience.map((e) => (
                <div key={e.id} className="grid grid-cols-[130px_1fr] gap-5">
                  <div className="text-xs font-serif italic text-stone-500 pt-0.5 text-right">
                    {formatDateRange(e.startDate, e.endDate, e.current)}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900">{e.position}</h3>
                    <p className="text-xs font-serif italic text-stone-600 mb-2">{e.company}{e.location ? `, ${e.location}` : ""}</p>
                    {e.description && <p className="text-xs text-stone-700 mb-2 leading-relaxed">{e.description}</p>}
                    <Bullets items={e.achievements} spec={spec} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Skills Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-stone-300 pt-6">
          {active.education && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4 text-stone-600">Education</h2>
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id}>
                    <p className="font-serif font-bold text-sm text-stone-900">{ed.degree}</p>
                    <p className="text-xs font-serif italic text-stone-600">{ed.institution}</p>
                    <p className="text-[11px] text-stone-400">{formatDateRange(ed.startDate, ed.endDate)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active.skills && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4 text-stone-600">Competencies</h2>
              <div className="space-y-3">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <p className="text-xs font-serif font-bold text-stone-700 mb-1">{s.category}</p>
                    <p className="text-xs text-stone-600 font-serif leading-relaxed">{s.items.join(" · ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ARCHETYPE 4: TECH & TERMINAL RENDERER ──
function TechTerminalLayout({ data, spec }: { data: ResumeData; spec: TemplateSpec }) {
  const active = getActiveSections(data);
  const accent = spec.accent;
  const contacts = contactItems(data);
  const p = data.personalInfo;

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 p-7 font-mono">
      {/* Terminal Window Top Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-t-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="text-xs text-slate-400 ml-2">jinzai-terminal v3.0</span>
        </div>
        <span className="text-[10px] text-emerald-400">● LIVE</span>
      </div>

      {/* Terminal Content Body */}
      <div className="bg-slate-900/80 border-x border-b border-slate-800 rounded-b-xl p-6 space-y-6">
        {/* Header */}
        <header className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-emerald-400 tracking-tight">
            &gt; {p.fullName || "Your Name"}<span className="animate-pulse">_</span>
          </h1>
          {p.jobTitle && <p className="text-sm text-slate-300 mt-1">// {p.jobTitle}</p>}
          {contacts.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-400">
              {contacts.map((c) => (
                <span key={c.label} className="bg-slate-800 px-2 py-0.5 rounded text-emerald-300 border border-slate-700">
                  {c.label.toLowerCase()}: {c.value}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Summary */}
        {active.summary && (
          <section className="bg-slate-950/60 p-4 rounded border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="text-slate-500">/* SUMMARY */</span>
            <p className="mt-1">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {active.experience && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">// [ SECTION: EXPERIENCE ]</h2>
            <div className="space-y-4">
              {data.experience.map((e) => (
                <div key={e.id} className="pl-3 border-l-2 border-emerald-500/50 space-y-1">
                  <div className="flex justify-between items-baseline text-xs flex-wrap gap-2">
                    <span className="font-bold text-slate-100">{e.position} @ {e.company}</span>
                    <span className="text-slate-400 text-[11px]">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                  </div>
                  {e.description && <p className="text-xs text-slate-400">{e.description}</p>}
                  {e.achievements.length > 0 && (
                    <ul className="text-xs text-slate-300 space-y-1 mt-1">
                      {e.achievements.map((a, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-emerald-400">&gt;</span>
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

        {/* Skills Code Blocks */}
        {active.skills && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">// [ SECTION: TECH STACK ]</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.skills.map((s) => (
                <div key={s.id} className="bg-slate-950 p-3 rounded border border-slate-800">
                  <p className="text-xs font-bold text-amber-400 mb-1.5">$ {s.category.toLowerCase()}</p>
                  <div className="flex flex-wrap gap-1">
                    {s.items.map((it, i) => (
                      <span key={i} className="text-[11px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-slate-700">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {active.education && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">// [ SECTION: EDUCATION ]</h2>
            {data.education.map((ed) => (
              <div key={ed.id} className="text-xs text-slate-300 flex justify-between flex-wrap gap-2">
                <span>{ed.degree} — {ed.institution}</span>
                <span className="text-slate-500">{formatDateRange(ed.startDate, ed.endDate)}</span>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

// ── ARCHETYPE 5: DARK EXECUTIVE RENDERER ──
function DarkExecutiveLayout({ data, spec }: { data: ResumeData; spec: TemplateSpec }) {
  const active = getActiveSections(data);
  const accent = spec.accent || "#d4af37";
  const contacts = contactItems(data);
  const p = data.personalInfo;
  const fontClass = getFontClass(spec.font);

  return (
    <div className={`min-h-full bg-[#0f172a] text-slate-100 p-8 ${fontClass}`}>
      {/* Header */}
      <header className="mb-8 pb-6 border-b" style={{ borderColor: withAlpha(accent, 0.4) }}>
        <div className="flex items-center gap-6 flex-wrap">
          {spec.hasPhoto && (
            <div className="w-22 h-22 rounded-full overflow-hidden border-2 p-1 shrink-0" style={{ borderColor: accent }}>
              <Avatar data={data} accent={accent} size="w-full h-full" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">{p.fullName || "Your Name"}</h1>
            {p.jobTitle && <p className="text-base font-medium" style={{ color: accent }}>{p.jobTitle}</p>}
            {contacts.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-300">
                {contacts.map((c) => (
                  <span key={c.label} className="flex items-center gap-1">
                    <span style={{ color: accent }}>◆</span> {c.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {active.summary && (
        <section className="mb-7 p-5 rounded-xl bg-slate-900 border" style={{ borderColor: withAlpha(accent, 0.3) }}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Executive Summary</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {active.experience && (
        <section className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4 pb-1 border-b" style={{ color: accent, borderColor: withAlpha(accent, 0.3) }}>
            Executive Track Record
          </h2>
          <div className="space-y-5">
            {data.experience.map((e) => (
              <div key={e.id} className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex justify-between items-baseline flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-white text-base">{e.position}</h3>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded" style={{ background: withAlpha(accent, 0.15), color: accent }}>
                    {formatDateRange(e.startDate, e.endDate, e.current)}
                  </span>
                </div>
                <p className="text-xs font-semibold mb-2 text-slate-400">{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                {e.description && <p className="text-xs text-slate-300 mb-2 leading-relaxed">{e.description}</p>}
                <Bullets items={e.achievements} spec={spec} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {active.skills && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Core Leadership Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.skills.map((s) => (
              <div key={s.id} className="p-3 rounded bg-slate-900 border border-slate-800">
                <p className="text-xs font-bold text-slate-300 mb-1">{s.category}</p>
                <div className="flex flex-wrap gap-1">
                  {s.items.map((it, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded text-white" style={{ background: withAlpha(accent, 0.2) }}>
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {active.education && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Education</h2>
          <div className="space-y-2">
            {data.education.map((ed) => (
              <div key={ed.id} className="flex justify-between items-baseline text-xs text-slate-300">
                <span className="font-bold text-white">{ed.degree} — {ed.institution}</span>
                <span className="text-slate-400">{formatDateRange(ed.startDate, ed.endDate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── ARCHETYPE 6: BANNER GRADIENT RENDERER ──
function BannerGradientLayout({ data, spec }: { data: ResumeData; spec: TemplateSpec }) {
  const active = getActiveSections(data);
  const accent = spec.accent;
  const accent2 = spec.accent2 || shade(accent, 0.3);
  const contacts = contactItems(data);
  const p = data.personalInfo;
  const fontClass = getFontClass(spec.font);

  const bgGradient = `linear-gradient(135deg, ${accent} 0%, ${accent2} 100%)`;

  return (
    <div className={`min-h-full bg-white ${fontClass}`}>
      {/* Eye-Popping Hero Banner Header */}
      <header className="px-8 py-8 text-white shadow-md mb-6" style={{ background: bgGradient }}>
        <div className="flex items-center gap-6 flex-wrap">
          {spec.hasPhoto && <Avatar data={data} accent={accent} size="w-24 h-24" />}
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight leading-none text-white">{p.fullName || "Your Name"}</h1>
            {p.jobTitle && <p className="text-lg font-light mt-1.5 text-white/90">{p.jobTitle}</p>}
            {p.tagline && <p className="text-xs text-white/80 mt-1 italic">"{p.tagline}"</p>}
          </div>
        </div>
        {contacts.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-xs text-white/90 pt-3 border-t border-white/20">
            {contacts.map((c) => (
              <span key={c.label}>{c.value}</span>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="px-8 pb-8 space-y-6">
        {active.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Profile</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {active.experience && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>
              Work Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((e) => (
                <div key={e.id}>
                  <div className="flex justify-between items-baseline flex-wrap gap-2">
                    <h3 className="font-bold text-gray-900 text-base">{e.position}</h3>
                    <span className="text-xs font-medium text-gray-500">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                  </div>
                  <p className="text-xs font-semibold mb-1" style={{ color: accent }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                  {e.description && <p className="text-xs text-gray-700 mb-1.5">{e.description}</p>}
                  <Bullets items={e.achievements} spec={spec} />
                </div>
              ))}
            </div>
          </section>
        )}

        {active.skills && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Skills & Capabilities</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.flatMap((s) => s.items).map((sk, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full font-semibold text-white shadow-2xs" style={{ background: bgGradient }}>
                  {sk}
                </span>
              ))}
            </div>
          </section>
        )}

        {active.education && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Education</h2>
            <div className="space-y-2">
              {data.education.map((ed) => (
                <div key={ed.id} className="flex justify-between items-baseline flex-wrap text-xs text-gray-800">
                  <span className="font-bold">{ed.degree} — {ed.institution}</span>
                  <span className="text-gray-500">{formatDateRange(ed.startDate, ed.endDate)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ── ARCHETYPE 7: SIDEBAR MODERN RENDERER ──
function SidebarModernLayout({ data, spec }: { data: ResumeData; spec: TemplateSpec }) {
  const active = getActiveSections(data);
  const accent = spec.accent;
  const contacts = contactItems(data);
  const p = data.personalInfo;
  const fontClass = getFontClass(spec.font);

  const sidebar = (
    <aside className="w-[33%] p-6 text-white min-h-full" style={{ background: accent }}>
      <div className="text-center mb-6">
        {spec.hasPhoto && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/40 mx-auto mb-3">
            <Avatar data={data} accent={accent} size="w-full h-full" />
          </div>
        )}
        <h1 className="text-xl font-extrabold text-white leading-tight">{p.fullName || "Your Name"}</h1>
        {p.jobTitle && <p className="text-xs text-white/85 mt-1 font-medium">{p.jobTitle}</p>}
      </div>

      <div className="space-y-5 text-xs text-white/90">
        {contacts.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2 border-b border-white/20 pb-1">Contact</p>
            <ul className="space-y-1.5">
              {contacts.map((c) => (
                <li key={c.label} className="break-words">
                  <span className="block text-[9px] uppercase text-white/60">{c.label}</span>
                  <span>{c.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {active.skills && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2 border-b border-white/20 pb-1">Skills</p>
            <div className="space-y-2">
              {data.skills.map((s) => (
                <div key={s.id}>
                  <p className="text-[10px] font-semibold text-white/80 mb-1">{s.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {s.items.map((it, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-medium">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active.languages && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2 border-b border-white/20 pb-1">Languages</p>
            {data.languages.map((l) => (
              <p key={l.id} className="text-xs">{l.name} ({l.proficiency})</p>
            ))}
          </div>
        )}
      </div>
    </aside>
  );

  const main = (
    <main className="flex-1 p-7 bg-white space-y-6">
      {active.summary && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>About Me</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {active.experience && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>
            Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <h3 className="font-bold text-gray-900 text-base">{e.position}</h3>
                  <span className="text-xs text-gray-500 font-medium">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                </div>
                <p className="text-xs font-semibold mb-1" style={{ color: accent }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                {e.description && <p className="text-xs text-gray-700 mb-1.5">{e.description}</p>}
                <Bullets items={e.achievements} spec={spec} />
              </div>
            ))}
          </div>
        </section>
      )}

      {active.education && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((ed) => (
              <div key={ed.id}>
                <p className="font-bold text-sm text-gray-900">{ed.degree}</p>
                <p className="text-xs text-gray-600">{ed.institution} ({formatDateRange(ed.startDate, ed.endDate)})</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );

  return (
    <div className={`flex min-h-full bg-white ${fontClass}`}>
      {spec.layout === "sidebar-right" ? <>{main}{sidebar}</> : <>{sidebar}{main}</>}
    </div>
  );
}

// ── ARCHETYPE 8: MINIMAL SWISS RENDERER ──
function MinimalSwissLayout({ data, spec }: { data: ResumeData; spec: TemplateSpec }) {
  const active = getActiveSections(data);
  const accent = spec.accent || "#0f172a";
  const contacts = contactItems(data);
  const p = data.personalInfo;
  const fontClass = getFontClass(spec.font);

  return (
    <div className={`min-h-full bg-white p-8 ${fontClass}`}>
      {/* Header */}
      <header className="flex justify-between items-end pb-4 border-b-2 border-slate-900 mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">{p.fullName || "Your Name"}</h1>
          {p.jobTitle && <p className="text-sm font-semibold text-slate-600 mt-0.5 uppercase tracking-wider">{p.jobTitle}</p>}
        </div>
        {contacts.length > 0 && (
          <div className="text-xs text-slate-600 text-right space-y-0.5 font-mono">
            {contacts.map((c) => (
              <p key={c.label}>{c.value}</p>
            ))}
          </div>
        )}
      </header>

      {/* Main sections with bold Swiss grid styling */}
      <div className="space-y-6">
        {active.summary && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-2 pb-0.5 border-b border-slate-200">
              Profile Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">{data.summary}</p>
          </section>
        )}

        {active.experience && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-3 pb-0.5 border-b border-slate-200">
              Work Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((e) => (
                <div key={e.id}>
                  <div className="flex justify-between items-baseline flex-wrap gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{e.position}</h3>
                    <span className="text-xs font-mono text-slate-500">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">{e.company}{e.location ? `, ${e.location}` : ""}</p>
                  {e.description && <p className="text-xs text-slate-700 mb-1">{e.description}</p>}
                  <Bullets items={e.achievements} spec={spec} />
                </div>
              ))}
            </div>
          </section>
        )}

        {active.skills && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-2 pb-0.5 border-b border-slate-200">
              Technical Skills
            </h2>
            <div className="space-y-1.5">
              {data.skills.map((s) => (
                <div key={s.id} className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900">{s.category}:</span> {s.items.join(", ")}
                </div>
              ))}
            </div>
          </section>
        )}

        {active.education && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-2 pb-0.5 border-b border-slate-200">
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((ed) => (
                <div key={ed.id} className="flex justify-between items-baseline flex-wrap text-xs text-slate-800">
                  <span className="font-bold text-slate-900">{ed.degree} — {ed.institution}</span>
                  <span className="text-slate-500 font-mono">{formatDateRange(ed.startDate, ed.endDate)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ── MAIN PARAMETERIZED TEMPLATE SWITCHER ──
export function ParameterizedTemplate({ data, spec }: { data: ResumeData; spec: TemplateSpec }) {
  const archetype: VisualArchetype = spec.visualArchetype || "minimal-swiss";

  switch (archetype) {
    case "timeline":
      return <TimelineLayout data={data} spec={spec} />;
    case "card-blocks":
      return <CardBlocksLayout data={data} spec={spec} />;
    case "editorial":
      return <EditorialLayout data={data} spec={spec} />;
    case "tech-terminal":
      return <TechTerminalLayout data={data} spec={spec} />;
    case "dark-executive":
      return <DarkExecutiveLayout data={data} spec={spec} />;
    case "banner-gradient":
      return <BannerGradientLayout data={data} spec={spec} />;
    case "sidebar-modern":
      return <SidebarModernLayout data={data} spec={spec} />;
    case "minimal-swiss":
    default:
      return <MinimalSwissLayout data={data} spec={spec} />;
  }
}
