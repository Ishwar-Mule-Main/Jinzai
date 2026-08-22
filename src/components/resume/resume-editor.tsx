"use client";

import { useRef, useState, useEffect } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES, FONT_OPTIONS, FONT_SIZE_OPTIONS, ACCENT_PRESETS, type WorkExperience } from "@/lib/resume/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Upload,
  X,
  Sparkles,
  ImageIcon,
  User,
  AlignLeft,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Languages as LanguagesIcon,
  Lock,
  LayoutGrid,
  Type,
  Check,
  FileText,
  SlidersHorizontal,
  FolderPlus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { SortableList, SortableItem } from "./sortable";
import { SkillSuggestions } from "./skill-suggestions";
import { TemplateCard } from "./template-card";
import { FormattedTextarea } from "./formatted-textarea";
import { normalizeCustomItem } from "@/lib/resume/template-helpers";

function PhotoUploader() {
  const data = useResumeStore((s) => s.data);
  const updatePersonal = useResumeStore((s) => s.updatePersonal);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large (max 2MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updatePersonal({ photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#2a2a2a] bg-[#121212] flex items-center justify-center shrink-0">
        {data.personalInfo.photo ? (
          <img src={data.personalInfo.photo} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-6 h-6 text-[#888888]" />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <button type="button" onClick={() => fileRef.current?.click()} className="h-8 px-3 text-xs border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] gap-1.5 rounded-md inline-flex items-center font-semibold transition-colors">
          <Upload className="w-3.5 h-3.5 text-[#faff69]" /> Upload Photo
        </button>
        {data.personalInfo.photo && (
          <button type="button" onClick={() => updatePersonal({ photo: "" })} className="h-7 text-[11px] text-[#ef4444] hover:underline inline-flex items-center">
            <X className="w-3.5 h-3.5 mr-1" /> Remove
          </button>
        )}
      </div>
    </div>
  );
}

function ItemActions({ onRemove, onUp, onDown, upDisabled, downDisabled }: {
  onRemove: () => void;
  onUp?: () => void;
  onDown?: () => void;
  upDisabled?: boolean;
  downDisabled?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {onUp && (
        <button type="button" onClick={onUp} disabled={upDisabled} className="h-7 w-7 flex items-center justify-center text-[#888888] hover:text-white disabled:opacity-30">
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      )}
      {onDown && (
        <button type="button" onClick={onDown} disabled={downDisabled} className="h-7 w-7 flex items-center justify-center text-[#888888] hover:text-white disabled:opacity-30">
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}
      <button type="button" onClick={onRemove} className="h-7 w-7 flex items-center justify-center text-[#ef4444] hover:text-red-300">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ---------- DESIGN TAB CONTROLS ----------

function DesignTabContent() {
  const template = useResumeStore((s) => s.template);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const accentColor = useResumeStore((s) => s.accentColor);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);
  const fontFamily = useResumeStore((s) => s.fontFamily);
  const setFontFamily = useResumeStore((s) => s.setFontFamily);
  const fontSize = useResumeStore((s) => s.fontSize);
  const setFontSize = useResumeStore((s) => s.setFontSize);

  const currentTemplateObj = TEMPLATES.find((t) => t.id === template) || TEMPLATES[0];

  return (
    <div className="space-y-4">
      {/* 1. Template Design Picker */}
      <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-mono text-[#888888]">ACTIVE TEMPLATE DESIGN</Label>
          <span className="bg-[#242424] text-[#faff69] border border-[#2a2a2a] text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
            78 TEMPLATES
          </span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#121212] border border-[#2a2a2a]">
          <div>
            <p className="text-xs font-bold text-white">{currentTemplateObj.name}</p>
            <p className="text-[10px] text-[#888888] font-mono">{currentTemplateObj.tags.join(" • ")}</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button className="h-8 px-3 text-xs bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] font-semibold rounded-md gap-1.5 inline-flex items-center transition-colors">
                <LayoutGrid className="w-3.5 h-3.5" /> Change Design
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl sm:max-w-5xl w-[95vw] bg-[#1a1a1a] border-[#2a2a2a] text-white max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white tracking-tight">Choose from 78 Master Layouts</DialogTitle>
                <DialogDescription className="text-xs text-[#888888]">
                  Select any design layout — your resume content stays 100% intact with instant real-time adaptation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
                {TEMPLATES.map((t, idx) => (
                  <TemplateCard key={t.id} id={t} index={idx} onSelect={() => setTemplate(t.id)} />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 2. Color Palette & Custom Hex Picker */}
      <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-3">
        <Label className="text-xs font-mono text-[#888888]">ACCENT COLOR PALETTE</Label>
        <div className="flex flex-wrap items-center gap-2">
          {ACCENT_PRESETS.map((hex) => (
            <button
              key={hex}
              onClick={() => setAccentColor(hex)}
              className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                accentColor === hex ? "ring-2 ring-[#faff69] ring-offset-2 ring-offset-[#1a1a1a] border-white scale-110" : "border-transparent opacity-80 hover:opacity-100"
              }`}
              style={{ backgroundColor: hex }}
            >
              {accentColor === hex && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
            </button>
          ))}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] font-mono text-[#888888]">Custom Hex:</span>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-8 h-8 rounded-md border border-[#2a2a2a] bg-transparent cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Typography & Font Size Controls */}
      <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-mono text-[#888888] flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#faff69]" /> FONT FAMILY SELECTION
          </Label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full h-10 bg-[#121212] border border-[#2a2a2a] rounded-md text-xs text-white px-3 focus:border-[#faff69] focus:outline-none"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id} className="bg-[#1a1a1a] text-white">
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-mono text-[#888888]">FONT SIZE SCALE</Label>
          <div className="grid grid-cols-5 gap-1.5 bg-[#121212] p-1.5 rounded-md border border-[#2a2a2a]">
            {FONT_SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFontSize(opt.id)}
                className={`h-8 rounded text-[10px] font-bold uppercase transition-all ${
                  fontSize === opt.id ? "bg-[#faff69] text-[#0a0a0a]" : "text-[#888888] hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- SECTION POSITION / ORDER CONTROLS ----------
function SectionPositionControls({
  sectionKey,
  allowColumnPlacement = true,
}: {
  sectionKey: string;
  allowColumnPlacement?: boolean;
}) {
  const data = useResumeStore((s) => s.data);
  const moveSectionOrder = useResumeStore((s) => s.moveSectionOrder);
  const setSectionPlacement = useResumeStore((s) => s.setSectionPlacement);

  const currentPlacement = data.sectionPlacements?.[sectionKey] || "main";

  return (
    <div
      className="flex items-center justify-between gap-2 px-2.5 py-1.5 mb-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-xs select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#888888] uppercase tracking-wider">
        <span>Position &amp; Order:</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Reorder Shift Up/Down buttons - Icons only */}
        <div className="flex items-center gap-0.5 bg-[#121212] border border-[#2a2a2a] rounded p-0.5" title="Move section Up / Down in preview sequence">
          <button
            type="button"
            onClick={() => {
              moveSectionOrder(sectionKey, -1);
              toast.info("Shifted section upward in preview layout");
            }}
            className="w-6 h-6 rounded flex items-center justify-center text-[#888888] hover:text-[#faff69] hover:bg-[#242424] transition-colors"
            title="Shift Up / Top"
            aria-label="Shift Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              moveSectionOrder(sectionKey, 1);
              toast.info("Shifted section downward in preview layout");
            }}
            className="w-6 h-6 rounded flex items-center justify-center text-[#888888] hover:text-[#faff69] hover:bg-[#242424] transition-colors"
            title="Shift Down / Bottom"
            aria-label="Shift Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sidebar vs Main column toggle buttons - Icons only */}
        {allowColumnPlacement && (
          <div className="flex items-center gap-0.5 bg-[#121212] border border-[#2a2a2a] rounded p-0.5" title="Shift section to Left (Sidebar) vs Right (Main) column">
            <button
              type="button"
              onClick={() => {
                setSectionPlacement(sectionKey, "sidebar");
                toast.info("Shifted section to Left Sidebar column");
              }}
              className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                currentPlacement === "sidebar" || currentPlacement === "left"
                  ? "bg-[#faff69] text-[#0a0a0a] shadow-xs"
                  : "text-[#888888] hover:text-white hover:bg-[#242424]"
              }`}
              title="Shift to Left Column (Sidebar)"
              aria-label="Shift to Left Column"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSectionPlacement(sectionKey, "main");
                toast.info("Shifted section to Right / Main column");
              }}
              className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                currentPlacement === "main" || currentPlacement === "right"
                  ? "bg-[#faff69] text-[#0a0a0a] shadow-xs"
                  : "text-[#888888] hover:text-white hover:bg-[#242424]"
              }`}
              title="Shift to Right Column (Main)"
              aria-label="Shift to Right Column"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- SECTION 1: PERSONAL INFO ----------
function PersonalInfoEditor() {
  const data = useResumeStore((s) => s.data);
  const updatePersonal = useResumeStore((s) => s.updatePersonal);
  const contactLocked = useResumeStore((s) => s.contactLocked);
  const template = useResumeStore((s) => s.template);
  const tpl = TEMPLATES.find((t) => t.id === template);
  const p = data.personalInfo;

  return (
    <div className="space-y-4">
      {tpl?.hasPhoto && <PhotoUploader />}
      {contactLocked && (
        <div className="flex items-center gap-2 p-2.5 rounded-md border border-[#faff69]/30 bg-[#1a1a1a] text-xs text-[#faff69]">
          <Lock className="w-3.5 h-3.5 shrink-0 text-[#faff69]" />
          <span>Contact details are locked on your active plan.</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-[#888888]">Full Name</Label>
          <input
            value={p.fullName}
            onChange={(e) => updatePersonal({ fullName: e.target.value })}
            placeholder="John Doe"
            className="w-full bg-[#121212] border border-[#2a2a2a] text-white text-xs rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
          />
        </div>
        <div>
          <Label className="text-xs text-[#888888]">Job Title / Tagline</Label>
          <input
            value={p.jobTitle}
            onChange={(e) => updatePersonal({ jobTitle: e.target.value })}
            placeholder="Senior Software Engineer"
            className="w-full bg-[#121212] border border-[#2a2a2a] text-white text-xs rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
          />
        </div>
        <div>
          <Label className="text-xs text-[#888888]">Email</Label>
          <input
            value={p.email}
            disabled={contactLocked}
            onChange={(e) => updatePersonal({ email: e.target.value })}
            placeholder="john@example.com"
            className="w-full bg-[#121212] border border-[#2a2a2a] text-white text-xs rounded-md h-9 px-3 outline-none focus:border-[#faff69] disabled:opacity-50"
          />
        </div>
        <div>
          <Label className="text-xs text-[#888888]">Phone</Label>
          <input
            value={p.phone}
            disabled={contactLocked}
            onChange={(e) => updatePersonal({ phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full bg-[#121212] border border-[#2a2a2a] text-white text-xs rounded-md h-9 px-3 outline-none focus:border-[#faff69] disabled:opacity-50"
          />
        </div>
        <div>
          <Label className="text-xs text-[#888888]">Location</Label>
          <input
            value={p.location}
            onChange={(e) => updatePersonal({ location: e.target.value })}
            placeholder="Bengaluru, India"
            className="w-full bg-[#121212] border border-[#2a2a2a] text-white text-xs rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
          />
        </div>
        <div>
          <Label className="text-xs text-[#888888]">LinkedIn URL</Label>
          <input
            value={p.linkedin}
            onChange={(e) => updatePersonal({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/johndoe"
            className="w-full bg-[#121212] border border-[#2a2a2a] text-white text-xs rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
          />
        </div>
        <div>
          <Label className="text-xs text-[#888888]">GitHub URL</Label>
          <input
            value={p.github}
            onChange={(e) => updatePersonal({ github: e.target.value })}
            placeholder="github.com/johndoe"
            className="w-full bg-[#121212] border border-[#2a2a2a] text-white text-xs rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
          />
        </div>
        <div>
          <Label className="text-xs text-[#888888]">Portfolio Website</Label>
          <input
            value={p.website}
            onChange={(e) => updatePersonal({ website: e.target.value })}
            placeholder="johndoe.dev"
            className="w-full bg-[#121212] border border-[#2a2a2a] text-white text-xs rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
          />
        </div>
      </div>
    </div>
  );
}

// ---------- SECTION 2: SUMMARY ----------
function SummaryEditor() {
  const data = useResumeStore((s) => s.data);
  const setSummary = useResumeStore((s) => s.setSummary);

  return (
    <div className="space-y-3">
      <SectionPositionControls sectionKey="summary" allowColumnPlacement={true} />
      <div className="space-y-1.5">
        <Label className="text-xs text-[#888888]">Professional Summary (Supports Bold, Italic &amp; Metrics)</Label>
        <FormattedTextarea
          value={data.summary}
          onChange={setSummary}
          rows={4}
          placeholder="Brief 2-4 sentence overview of your background, core strengths, and career achievements..."
          label="Summary"
        />
      </div>
    </div>
  );
}

// ---------- SECTION 3: WORK EXPERIENCE ----------
function ExperienceEditor() {
  const data = useResumeStore((s) => s.data);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);
  const moveExperience = useResumeStore((s) => s.moveExperience);

  return (
    <div className="space-y-4">
      <SectionPositionControls sectionKey="experience" allowColumnPlacement={true} />
      <SortableList<WorkExperience>
        items={data.experience}
        onChange={(next) => useResumeStore.getState().updateData((d) => ({ ...d, experience: next }))}
        renderItem={(exp: WorkExperience, index: number) => (
          <SortableItem id={exp.id}>
            <div className="p-3.5 rounded-lg border border-[#2a2a2a] bg-[#121212] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-white truncate">
                  {exp.position || "Position"} {exp.company ? `@ ${exp.company}` : ""}
                </span>
                <ItemActions
                  onRemove={() => removeExperience(exp.id)}
                  onUp={() => moveExperience(exp.id, -1)}
                  onDown={() => moveExperience(exp.id, 1)}
                  upDisabled={index === 0}
                  downDisabled={index === data.experience.length - 1}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  placeholder="Company Name"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
                />
                <input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                  placeholder="Job Title"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
                />
                <input
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  placeholder="Start Date (e.g. 2022-01)"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
                />
                <input
                  value={exp.endDate}
                  disabled={exp.current}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  placeholder="End Date (e.g. Present)"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69] disabled:opacity-50"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={exp.current}
                  onCheckedChange={(c) => updateExperience(exp.id, { current: Boolean(c) })}
                  id={`curr-${exp.id}`}
                  className="border-[#faff69] data-[state=checked]:bg-[#faff69] data-[state=checked]:text-[#0a0a0a]"
                />
                <label htmlFor={`curr-${exp.id}`} className="text-xs text-[#888888]">
                  I currently work here
                </label>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#888888]">Role Overview / Description</Label>
                <FormattedTextarea
                  value={exp.description || ""}
                  onChange={(v) => updateExperience(exp.id, { description: v })}
                  placeholder="Overview of your core responsibilities and team scope..."
                  rows={2}
                  label="Role Overview"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[#888888]">Key Achievements &amp; Bullet Points (Bold key metrics!)</Label>
                {exp.achievements.map((ach, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <FormattedTextarea
                        value={ach}
                        onChange={(v) => {
                          const next = [...exp.achievements];
                          next[i] = v;
                          updateExperience(exp.id, { achievements: next });
                        }}
                        placeholder="Action verb + quantified metric + outcome..."
                        rows={2}
                        minHeight="54px"
                        label={`Bullet #${i + 1}`}
                      />
                    </div>
                    <button
                      type="button"
                      className="h-8 w-8 text-red-400 hover:text-red-300 shrink-0 flex items-center justify-center rounded hover:bg-[#1a1a1a] mt-1"
                      onClick={() => {
                        const next = exp.achievements.filter((_, idx) => idx !== i);
                        updateExperience(exp.id, { achievements: next });
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => updateExperience(exp.id, { achievements: [...exp.achievements, ""] })}
                  className="h-8 px-3 text-xs border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] rounded-md gap-1 inline-flex items-center font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#faff69]" /> Add Bullet Point
                </button>
              </div>
            </div>
          </SortableItem>
        )}
      />

      <button
        type="button"
        onClick={addExperience}
        className="w-full h-10 text-xs border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] gap-1.5 rounded-md inline-flex items-center justify-center font-semibold transition-colors"
      >
        <Plus className="w-4 h-4 text-[#faff69]" /> Add Work Experience
      </button>
    </div>
  );
}

// ---------- SECTION 4: EDUCATION ----------
function EducationEditor() {
  const data = useResumeStore((s) => s.data);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);

  return (
    <div className="space-y-4">
      <SectionPositionControls sectionKey="education" allowColumnPlacement={true} />
      {data.education.map((edu) => (
        <div key={edu.id} className="p-3.5 rounded-lg border border-[#2a2a2a] bg-[#121212] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-xs text-white truncate">
              {edu.degree || "Degree"} {edu.institution ? `@ ${edu.institution}` : ""}
            </span>
            <ItemActions onRemove={() => removeEducation(edu.id)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              value={edu.institution}
              onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
              placeholder="University / Institution"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
            <input
              value={edu.degree}
              onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
              placeholder="Degree (e.g. B.Tech)"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
            <input
              value={edu.field}
              onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
              placeholder="Field of Study / Major"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
            <input
              value={edu.gpa}
              onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
              placeholder="GPA / Percentage"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
            <input
              value={edu.startDate}
              onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
              placeholder="Start Date (2018-08)"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
            <input
              value={edu.endDate}
              onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
              placeholder="End Date (2022-05)"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-[#888888]">Education Details &amp; Honors</Label>
            <FormattedTextarea
              value={edu.description || ""}
              onChange={(v) => updateEducation(edu.id, { description: v })}
              placeholder="Academic achievements, thesis, coursework, or honors..."
              rows={2}
              label="Education Details"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="w-full h-10 text-xs border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] gap-1.5 rounded-md inline-flex items-center justify-center font-semibold transition-colors"
      >
        <Plus className="w-4 h-4 text-[#faff69]" /> Add Education Entry
      </button>
    </div>
  );
}

// ---------- SECTION 5: SKILLS ----------
function SkillsEditor() {
  const data = useResumeStore((s) => s.data);
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory);
  const updateSkillCategory = useResumeStore((s) => s.updateSkillCategory);
  const removeSkillCategory = useResumeStore((s) => s.removeSkillCategory);

  return (
    <div className="space-y-4">
      <SectionPositionControls sectionKey="skills" allowColumnPlacement={true} />
      {data.skills.map((cat) => (
        <div key={cat.id} className="p-3.5 rounded-lg border border-[#2a2a2a] bg-[#121212] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <input
              value={cat.category}
              onChange={(e) => updateSkillCategory(cat.id, { category: e.target.value })}
              placeholder="Category Name (e.g. Programming Languages)"
              className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-xs font-bold text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
            <ItemActions onRemove={() => removeSkillCategory(cat.id)} />
          </div>

          <SkillSuggestions
            category={cat.category}
            existing={cat.items}
            onSelect={(skill) => {
              if (!cat.items.includes(skill)) {
                updateSkillCategory(cat.id, { items: [...cat.items, skill] });
              }
            }}
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {cat.items.map((skill, i) => (
              <span key={i} className="bg-[#1a1a1a] text-[#faff69] border border-[#2a2a2a] text-xs gap-1 py-1 px-2.5 rounded-md inline-flex items-center font-mono">
                {skill}
                <button
                  type="button"
                  onClick={() => {
                    const next = cat.items.filter((_, idx) => idx !== i);
                    updateSkillCategory(cat.id, { items: next });
                  }}
                  className="hover:text-red-400 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSkillCategory}
        className="w-full h-10 text-xs border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] gap-1.5 rounded-md inline-flex items-center justify-center font-semibold transition-colors"
      >
        <Plus className="w-4 h-4 text-[#faff69]" /> Add Skill Category
      </button>
    </div>
  );
}

// ---------- SECTION 6: PROJECTS ----------
function ProjectsEditor() {
  const data = useResumeStore((s) => s.data);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);

  return (
    <div className="space-y-4">
      <SectionPositionControls sectionKey="projects" allowColumnPlacement={true} />
      {data.projects.map((proj) => (
        <div key={proj.id} className="p-3.5 rounded-lg border border-[#2a2a2a] bg-[#121212] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-xs text-white truncate">{proj.name || "Project Title"}</span>
            <ItemActions onRemove={() => removeProject(proj.id)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              value={proj.name}
              onChange={(e) => updateProject(proj.id, { name: e.target.value })}
              placeholder="Project Name"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
            <input
              value={proj.link}
              onChange={(e) => updateProject(proj.id, { link: e.target.value })}
              placeholder="Project Link / GitHub"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-[#888888]">Project Description &amp; Highlights</Label>
            <FormattedTextarea
              value={proj.description}
              onChange={(v) => updateProject(proj.id, { description: v })}
              rows={3}
              placeholder="Project details, key features, and quantified results..."
              label="Project Scope"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addProject}
        className="w-full h-10 text-xs border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] gap-1.5 rounded-md inline-flex items-center justify-center font-semibold transition-colors"
      >
        <Plus className="w-4 h-4 text-[#faff69]" /> Add Project Entry
      </button>
    </div>
  );
}

// ---------- SECTION 7: CERTIFICATIONS ----------
function CertificationsEditor() {
  const data = useResumeStore((s) => s.data);
  const addCertification = useResumeStore((s) => s.addCertification);
  const updateCertification = useResumeStore((s) => s.updateCertification);
  const removeCertification = useResumeStore((s) => s.removeCertification);

  return (
    <div className="space-y-4">
      <SectionPositionControls sectionKey="certifications" allowColumnPlacement={true} />
      {data.certifications.map((cert) => (
        <div key={cert.id} className="p-3.5 rounded-lg border border-[#2a2a2a] bg-[#121212] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-xs text-white truncate">{cert.name || "Certification"}</span>
            <ItemActions onRemove={() => removeCertification(cert.id)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              value={cert.name}
              onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
              placeholder="Certification Name"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
            <input
              value={cert.issuer}
              onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
              placeholder="Issuer (e.g. AWS)"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
            <input
              value={cert.date}
              onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
              placeholder="Date (e.g. 2023-05)"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addCertification}
        className="w-full h-10 text-xs border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] gap-1.5 rounded-md inline-flex items-center justify-center font-semibold transition-colors"
      >
        <Plus className="w-4 h-4 text-[#faff69]" /> Add Certification Entry
      </button>
    </div>
  );
}

// ---------- SECTION 8: LANGUAGES ----------
function LanguagesEditor() {
  const data = useResumeStore((s) => s.data);
  const addLanguage = useResumeStore((s) => s.addLanguage);
  const updateLanguage = useResumeStore((s) => s.updateLanguage);
  const removeLanguage = useResumeStore((s) => s.removeLanguage);

  return (
    <div className="space-y-4">
      <SectionPositionControls sectionKey="languages" allowColumnPlacement={true} />
      {data.languages.map((lang) => (
        <div key={lang.id} className="p-3 rounded-lg border border-[#2a2a2a] bg-[#121212] flex items-center gap-2">
          <input
            value={lang.name}
            onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
            placeholder="Language (e.g. English)"
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
          />
          <input
            value={lang.proficiency}
            onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value })}
            placeholder="Proficiency (e.g. Native / Fluent)"
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
          />
          <ItemActions onRemove={() => removeLanguage(lang.id)} />
        </div>
      ))}

      <button
        type="button"
        onClick={addLanguage}
        className="w-full h-10 text-xs border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] gap-1.5 rounded-md inline-flex items-center justify-center font-semibold transition-colors"
      >
        <Plus className="w-4 h-4 text-[#faff69]" /> Add Language
      </button>
    </div>
  );
}

// ---------- SECTION 9: CUSTOM SECTIONS ----------
function CustomSectionsEditor() {
  const data = useResumeStore((s) => s.data);
  const addCustomSection = useResumeStore((s) => s.addCustomSection);
  const updateCustomSection = useResumeStore((s) => s.updateCustomSection);
  const removeCustomSection = useResumeStore((s) => s.removeCustomSection);

  return (
    <div className="space-y-4">
      <SectionPositionControls sectionKey="custom" allowColumnPlacement={true} />

      {data.customSections?.map((sec) => (
        <div key={sec.id} className="p-3.5 rounded-lg border border-[#2a2a2a] bg-[#121212] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <input
              value={sec.title}
              onChange={(e) => updateCustomSection(sec.id, { title: e.target.value })}
              placeholder="Custom Section Header (e.g. Publications / Volunteer / Awards)"
              className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-xs font-bold text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
            />
            <ItemActions onRemove={() => removeCustomSection(sec.id)} />
          </div>

          <div className="space-y-3">
            {sec.items?.map((rawItem, i) => {
              const item = normalizeCustomItem(rawItem);
              return (
                <div key={item.id || i} className="p-3 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] space-y-2.5">
                  <div className="flex justify-between items-center gap-2">
                    <input
                      value={item.title}
                      onChange={(e) => {
                        const next = [...sec.items];
                        next[i] = { ...item, title: e.target.value };
                        updateCustomSection(sec.id, { items: next });
                      }}
                      placeholder="Item Title (e.g. Award Name / Publication Title)"
                      className="flex-1 bg-[#121212] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
                    />
                    <button
                      type="button"
                      className="h-7 w-7 text-red-400 hover:text-red-300 shrink-0 flex items-center justify-center rounded hover:bg-[#242424]"
                      onClick={() => {
                        const next = sec.items.filter((_, idx) => idx !== i);
                        updateCustomSection(sec.id, { items: next });
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      value={item.subtitle || ""}
                      onChange={(e) => {
                        const next = [...sec.items];
                        next[i] = { ...item, subtitle: e.target.value };
                        updateCustomSection(sec.id, { items: next });
                      }}
                      placeholder="Subtitle / Organization (Optional)"
                      className="w-full bg-[#121212] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
                    />
                    <input
                      value={item.date || ""}
                      onChange={(e) => {
                        const next = [...sec.items];
                        next[i] = { ...item, date: e.target.value };
                        updateCustomSection(sec.id, { items: next });
                      }}
                      placeholder="Date / Year (e.g. 2024)"
                      className="w-full bg-[#121212] border border-[#2a2a2a] text-xs text-white rounded-md h-9 px-3 outline-none focus:border-[#faff69]"
                    />
                  </div>

                  <FormattedTextarea
                    value={item.description || ""}
                    onChange={(v) => {
                      const next = [...sec.items];
                      next[i] = { ...item, description: v };
                      updateCustomSection(sec.id, { items: next });
                    }}
                    placeholder="Details, abstract, or bullet points..."
                    rows={2}
                    label="Description"
                  />
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => {
                const newItem = { id: `item-${Date.now()}`, title: "", subtitle: "", date: "", description: "" };
                updateCustomSection(sec.id, { items: [...(sec.items || []), newItem] });
              }}
              className="h-8 px-3 text-xs border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] rounded-md gap-1 inline-flex items-center font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#faff69]" /> Add Custom Item
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addCustomSection}
        className="w-full h-10 text-xs border border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#242424] gap-1.5 rounded-md inline-flex items-center justify-center font-semibold transition-colors"
      >
        <Plus className="w-4 h-4 text-[#faff69]" /> Add New Custom Section
      </button>
    </div>
  );
}

// ---------- MAIN CONTAINER WITH TABS ----------
export function ResumeEditor({
  activeSection,
  highlightedSection,
}: {
  activeSection?: string | null;
  highlightedSection?: string | null;
} = {}) {
  const [editorTab, setEditorTab] = useState<"content" | "design">("content");
  const [openSections, setOpenSections] = useState<string[]>([
    "personal",
    "summary",
    "experience",
    "skills",
  ]);

  // Expand section if activeSection changes
  useEffect(() => {
    if (activeSection) {
      setEditorTab("content");
      setOpenSections((prev) =>
        prev.includes(activeSection) ? prev : [...prev, activeSection]
      );
    }
  }, [activeSection]);

  const isSecHighlighted = (id: string) => highlightedSection === id;

  return (
    <div className="space-y-4 text-left">
      {/* Top Tab Switcher: Content vs Design */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-xs font-semibold">
        <button
          onClick={() => setEditorTab("content")}
          className={`py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-all ${
            editorTab === "content" ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "text-[#888888] hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> 1. Resume Content
        </button>
        <button
          onClick={() => setEditorTab("design")}
          className={`py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-all ${
            editorTab === "design" ? "bg-[#faff69] text-[#0a0a0a] font-bold" : "text-[#888888] hover:text-white"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> 2. Design &amp; Fonts
        </button>
      </div>

      {/* TAB 1: CONTENT EDITOR */}
      {editorTab === "content" && (
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="space-y-3"
        >
          <AccordionItem
            id="editor-section-personal"
            value="personal"
            className={`border bg-[#1a1a1a] rounded-xl px-4 py-1 transition-all duration-300 ${
              isSecHighlighted("personal")
                ? "border-[#faff69] ring-2 ring-[#faff69]/60 shadow-[0_0_20px_rgba(250,255,105,0.25)]"
                : "border-[#2a2a2a]"
            }`}
          >
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#faff69]" /> Personal Information
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <PersonalInfoEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            id="editor-section-summary"
            value="summary"
            className={`border bg-[#1a1a1a] rounded-xl px-4 py-1 transition-all duration-300 ${
              isSecHighlighted("summary")
                ? "border-[#faff69] ring-2 ring-[#faff69]/60 shadow-[0_0_20px_rgba(250,255,105,0.25)]"
                : "border-[#2a2a2a]"
            }`}
          >
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-[#faff69]" /> Professional Summary
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <SummaryEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            id="editor-section-experience"
            value="experience"
            className={`border bg-[#1a1a1a] rounded-xl px-4 py-1 transition-all duration-300 ${
              isSecHighlighted("experience")
                ? "border-[#faff69] ring-2 ring-[#faff69]/60 shadow-[0_0_20px_rgba(250,255,105,0.25)]"
                : "border-[#2a2a2a]"
            }`}
          >
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#faff69]" /> Work Experience
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <ExperienceEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            id="editor-section-education"
            value="education"
            className={`border bg-[#1a1a1a] rounded-xl px-4 py-1 transition-all duration-300 ${
              isSecHighlighted("education")
                ? "border-[#faff69] ring-2 ring-[#faff69]/60 shadow-[0_0_20px_rgba(250,255,105,0.25)]"
                : "border-[#2a2a2a]"
            }`}
          >
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#faff69]" /> Education &amp; Credentials
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <EducationEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            id="editor-section-skills"
            value="skills"
            className={`border bg-[#1a1a1a] rounded-xl px-4 py-1 transition-all duration-300 ${
              isSecHighlighted("skills")
                ? "border-[#faff69] ring-2 ring-[#faff69]/60 shadow-[0_0_20px_rgba(250,255,105,0.25)]"
                : "border-[#2a2a2a]"
            }`}
          >
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#faff69]" /> Technical &amp; Core Skills
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <SkillsEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            id="editor-section-projects"
            value="projects"
            className={`border bg-[#1a1a1a] rounded-xl px-4 py-1 transition-all duration-300 ${
              isSecHighlighted("projects")
                ? "border-[#faff69] ring-2 ring-[#faff69]/60 shadow-[0_0_20px_rgba(250,255,105,0.25)]"
                : "border-[#2a2a2a]"
            }`}
          >
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#faff69]" /> Featured Projects
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <ProjectsEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            id="editor-section-certifications"
            value="certifications"
            className={`border bg-[#1a1a1a] rounded-xl px-4 py-1 transition-all duration-300 ${
              isSecHighlighted("certifications")
                ? "border-[#faff69] ring-2 ring-[#faff69]/60 shadow-[0_0_20px_rgba(250,255,105,0.25)]"
                : "border-[#2a2a2a]"
            }`}
          >
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#faff69]" /> Certifications &amp; Licenses
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <CertificationsEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            id="editor-section-languages"
            value="languages"
            className={`border bg-[#1a1a1a] rounded-xl px-4 py-1 transition-all duration-300 ${
              isSecHighlighted("languages")
                ? "border-[#faff69] ring-2 ring-[#faff69]/60 shadow-[0_0_20px_rgba(250,255,105,0.25)]"
                : "border-[#2a2a2a]"
            }`}
          >
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <LanguagesIcon className="w-4 h-4 text-[#faff69]" /> Languages
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <LanguagesEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            id="editor-section-custom"
            value="custom"
            className={`border bg-[#1a1a1a] rounded-xl px-4 py-1 transition-all duration-300 ${
              isSecHighlighted("custom")
                ? "border-[#faff69] ring-2 ring-[#faff69]/60 shadow-[0_0_20px_rgba(250,255,105,0.25)]"
                : "border-[#2a2a2a]"
            }`}
          >
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#faff69]" /> Custom Sections (Volunteer, Awards, etc.)
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <CustomSectionsEditor />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* TAB 2: DESIGN & STYLING */}
      {editorTab === "design" && <DesignTabContent />}
    </div>
  );
}
