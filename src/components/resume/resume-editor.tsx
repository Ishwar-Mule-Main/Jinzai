"use client";

import { useRef, useState } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES, FONT_OPTIONS, FONT_SIZE_OPTIONS, ACCENT_PRESETS } from "@/lib/resume/types";
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
  Loader2,
  ImageIcon,
  User,
  AlignLeft,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Languages as LanguagesIcon,
  Layers,
  Lock,
  Wand2,
  LayoutGrid,
  Palette,
  Type,
  Check,
  FileText,
  SlidersHorizontal,
  FolderPlus,
} from "lucide-react";
import { toast } from "sonner";
import { SortableList, SortableItem } from "./sortable";
import { SkillSuggestions } from "./skill-suggestions";
import { TemplateCard } from "./template-card";

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
      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#2E2E2E] bg-[#141414] flex items-center justify-center shrink-0">
        {data.personalInfo.photo ? (
          <img src={data.personalInfo.photo} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-6 h-6 text-[#888898]" />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="h-8 text-xs border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] gap-1.5 rounded-full">
          <Upload className="w-3.5 h-3.5 text-[#FF6200]" /> Upload Photo
        </Button>
        {data.personalInfo.photo && (
          <Button type="button" variant="ghost" size="sm" onClick={() => updatePersonal({ photo: "" })} className="h-7 text-[11px] text-red-400 hover:text-red-300">
            <X className="w-3.5 h-3.5 mr-1" /> Remove
          </Button>
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
        <Button type="button" size="icon" variant="ghost" onClick={onUp} disabled={upDisabled} className="h-7 w-7 text-[#888898] hover:text-white">
          <ChevronUp className="w-3.5 h-3.5" />
        </Button>
      )}
      {onDown && (
        <Button type="button" size="icon" variant="ghost" onClick={onDown} disabled={downDisabled} className="h-7 w-7 text-[#888898] hover:text-white">
          <ChevronDown className="w-3.5 h-3.5" />
        </Button>
      )}
      <Button type="button" size="icon" variant="ghost" onClick={onRemove} className="h-7 w-7 text-red-400 hover:text-red-300">
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
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
    <div className="space-y-5">
      {/* 1. Template Design Picker */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#2E2E2E] space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-mono text-[#9A9AAB]">ACTIVE TEMPLATE DESIGN</Label>
          <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 text-[9px] font-mono">
            78 TEMPLATES
          </Badge>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D0D0D] border border-[#2E2E2E]">
          <div>
            <p className="text-xs font-bold text-white">{currentTemplateObj.name}</p>
            <p className="text-[10px] text-[#888898] font-mono">{currentTemplateObj.tags.join(" • ")}</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 px-3 text-xs bg-[#FF6200] hover:bg-[#E55700] text-white font-bold rounded-full gap-1.5 shadow-md shadow-[#FF6200]/20">
                <LayoutGrid className="w-3.5 h-3.5" /> Change Design
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl sm:max-w-5xl w-[95vw] bg-[#141414] border-[#2E2E2E] text-white max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-3xl">
              <DialogHeader>
                <DialogTitle className="font-bricolage text-xl font-bold text-white">Choose from 78 Master Templates</DialogTitle>
                <DialogDescription className="text-xs text-[#888898]">
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
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#2E2E2E] space-y-3">
        <Label className="text-xs font-mono text-[#9A9AAB]">ACCENT COLOR PALETTE</Label>
        <div className="flex flex-wrap items-center gap-2">
          {ACCENT_PRESETS.map((hex) => (
            <button
              key={hex}
              onClick={() => setAccentColor(hex)}
              className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                accentColor === hex ? "ring-2 ring-[#FF6200] ring-offset-2 ring-offset-[#141414] border-white scale-110" : "border-transparent opacity-80 hover:opacity-100"
              }`}
              style={{ backgroundColor: hex }}
            >
              {accentColor === hex && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
            </button>
          ))}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] font-mono text-[#888898]">Custom Hex:</span>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-8 h-8 rounded-xl border border-[#2E2E2E] bg-transparent cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Typography & Font Size Controls */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#2E2E2E] space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-mono text-[#9A9AAB] flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#FF6200]" /> FONT FAMILY SELECTION
          </Label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full h-10 bg-[#0D0D0D] border border-[#2E2E2E] rounded-xl text-xs text-white px-3 focus:border-[#FF6200] focus:outline-none"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id} className="bg-[#141414] text-white">
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-mono text-[#9A9AAB]">FONT SIZE SCALE ADJUSTMENT</Label>
          <div className="grid grid-cols-5 gap-1.5 bg-[#0D0D0D] p-1.5 rounded-xl border border-[#2E2E2E]">
            {FONT_SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFontSize(opt.id)}
                className={`h-8 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  fontSize === opt.id ? "bg-[#FF6200] text-white shadow-md shadow-[#FF6200]/20" : "text-[#888898] hover:text-white"
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
        <div className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300">
          <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>Contact details are locked on your active plan.</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-[#9A9AAB]">Full Name</Label>
          <Input
            value={p.fullName}
            onChange={(e) => updatePersonal({ fullName: e.target.value })}
            placeholder="John Doe"
            className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl focus-visible:ring-[#FF6200]"
          />
        </div>
        <div>
          <Label className="text-xs text-[#9A9AAB]">Job Title / Tagline</Label>
          <Input
            value={p.jobTitle}
            onChange={(e) => updatePersonal({ jobTitle: e.target.value })}
            placeholder="Senior Software Engineer"
            className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl focus-visible:ring-[#FF6200]"
          />
        </div>
        <div>
          <Label className="text-xs text-[#9A9AAB]">Email</Label>
          <Input
            value={p.email}
            disabled={contactLocked}
            onChange={(e) => updatePersonal({ email: e.target.value })}
            placeholder="john@example.com"
            className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl focus-visible:ring-[#FF6200]"
          />
        </div>
        <div>
          <Label className="text-xs text-[#9A9AAB]">Phone</Label>
          <Input
            value={p.phone}
            disabled={contactLocked}
            onChange={(e) => updatePersonal({ phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl focus-visible:ring-[#FF6200]"
          />
        </div>
        <div>
          <Label className="text-xs text-[#9A9AAB]">Location</Label>
          <Input
            value={p.location}
            onChange={(e) => updatePersonal({ location: e.target.value })}
            placeholder="Bengaluru, India"
            className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl focus-visible:ring-[#FF6200]"
          />
        </div>
        <div>
          <Label className="text-xs text-[#9A9AAB]">LinkedIn URL</Label>
          <Input
            value={p.linkedin}
            onChange={(e) => updatePersonal({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/johndoe"
            className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl focus-visible:ring-[#FF6200]"
          />
        </div>
        <div>
          <Label className="text-xs text-[#9A9AAB]">GitHub URL</Label>
          <Input
            value={p.github}
            onChange={(e) => updatePersonal({ github: e.target.value })}
            placeholder="github.com/johndoe"
            className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl focus-visible:ring-[#FF6200]"
          />
        </div>
        <div>
          <Label className="text-xs text-[#9A9AAB]">Portfolio Website</Label>
          <Input
            value={p.website}
            onChange={(e) => updatePersonal({ website: e.target.value })}
            placeholder="johndoe.dev"
            className="bg-[#0D0D0D] border-[#2E2E2E] text-white text-xs rounded-xl focus-visible:ring-[#FF6200]"
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
      <Textarea
        value={data.summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={5}
        placeholder="Brief 2-4 sentence overview of your background, core strengths, and career achievements..."
        className="bg-[#0D0D0D] border-[#2E2E2E] text-xs text-white focus-visible:ring-[#FF6200] rounded-xl p-3"
      />
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
      <SortableList
        items={data.experience}
        onChange={(next) => useResumeStore.getState().updateData((d) => ({ ...d, experience: next }))}
        renderItem={(exp, index) => (
          <SortableItem id={exp.id}>
            <div className="p-3.5 rounded-xl border border-[#2E2E2E] bg-[#0D0D0D] space-y-3">
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
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  placeholder="Company Name"
                  className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
                />
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                  placeholder="Job Title"
                  className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
                />
                <Input
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  placeholder="Start Date (e.g. 2022-01)"
                  className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
                />
                <Input
                  value={exp.endDate}
                  disabled={exp.current}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  placeholder="End Date (e.g. Present)"
                  className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={exp.current}
                  onCheckedChange={(c) => updateExperience(exp.id, { current: Boolean(c) })}
                  id={`curr-${exp.id}`}
                  className="border-[#FF6200] data-[state=checked]:bg-[#FF6200]"
                />
                <label htmlFor={`curr-${exp.id}`} className="text-xs text-[#9A9AAB]">
                  I currently work here
                </label>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#9A9AAB]">Key Achievements &amp; Bullet Points</Label>
                {exp.achievements.map((ach, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      value={ach}
                      onChange={(e) => {
                        const next = [...exp.achievements];
                        next[i] = e.target.value;
                        updateExperience(exp.id, { achievements: next });
                      }}
                      className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-400 hover:text-red-300 shrink-0"
                      onClick={() => {
                        const next = exp.achievements.filter((_, idx) => idx !== i);
                        updateExperience(exp.id, { achievements: next });
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateExperience(exp.id, { achievements: [...exp.achievements, ""] })}
                  className="h-8 text-xs border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] rounded-full gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF6200]" /> Add Bullet Point
                </Button>
              </div>
            </div>
          </SortableItem>
        )}
      />

      <Button
        type="button"
        variant="outline"
        onClick={addExperience}
        className="w-full h-10 text-xs border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] gap-1.5 rounded-full"
      >
        <Plus className="w-4 h-4 text-[#FF6200]" /> Add Work Experience
      </Button>
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
      {data.education.map((edu) => (
        <div key={edu.id} className="p-3.5 rounded-xl border border-[#2E2E2E] bg-[#0D0D0D] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-xs text-white truncate">
              {edu.degree || "Degree"} {edu.institution ? `@ ${edu.institution}` : ""}
            </span>
            <ItemActions onRemove={() => removeEducation(edu.id)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Input
              value={edu.institution}
              onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
              placeholder="University / Institution"
              className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
            />
            <Input
              value={edu.degree}
              onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
              placeholder="Degree (e.g. B.Tech)"
              className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
            />
            <Input
              value={edu.field}
              onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
              placeholder="Field of Study / Major"
              className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
            />
            <Input
              value={edu.gpa}
              onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
              placeholder="GPA / Percentage"
              className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
            />
            <Input
              value={edu.startDate}
              onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
              placeholder="Start Date (2018-08)"
              className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
            />
            <Input
              value={edu.endDate}
              onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
              placeholder="End Date (2022-05)"
              className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
        className="w-full h-10 text-xs border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] gap-1.5 rounded-full"
      >
        <Plus className="w-4 h-4 text-[#FF6200]" /> Add Education Entry
      </Button>
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
      {data.skills.map((cat) => (
        <div key={cat.id} className="p-3.5 rounded-xl border border-[#2E2E2E] bg-[#0D0D0D] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Input
              value={cat.category}
              onChange={(e) => updateSkillCategory(cat.id, { category: e.target.value })}
              placeholder="Category Name (e.g. Programming Languages)"
              className="bg-[#141414] border-[#2E2E2E] text-xs font-bold text-white rounded-xl"
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
              <Badge key={i} className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 text-xs gap-1 py-1 px-2.5">
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
              </Badge>
            ))}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addSkillCategory}
        className="w-full h-10 text-xs border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] gap-1.5 rounded-full"
      >
        <Plus className="w-4 h-4 text-[#FF6200]" /> Add Skill Category
      </Button>
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
      {data.projects.map((proj) => (
        <div key={proj.id} className="p-3.5 rounded-xl border border-[#2E2E2E] bg-[#0D0D0D] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-xs text-white truncate">{proj.name || "Project Title"}</span>
            <ItemActions onRemove={() => removeProject(proj.id)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Input
              value={proj.name}
              onChange={(e) => updateProject(proj.id, { name: e.target.value })}
              placeholder="Project Name"
              className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
            />
            <Input
              value={proj.link}
              onChange={(e) => updateProject(proj.id, { link: e.target.value })}
              placeholder="Project Link / GitHub"
              className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
            />
          </div>

          <Textarea
            value={proj.description}
            onChange={(e) => updateProject(proj.id, { description: e.target.value })}
            rows={3}
            placeholder="Project details & key features..."
            className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl p-2.5"
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addProject}
        className="w-full h-10 text-xs border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] gap-1.5 rounded-full"
      >
        <Plus className="w-4 h-4 text-[#FF6200]" /> Add Project Entry
      </Button>
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
      {data.certifications.map((cert) => (
        <div key={cert.id} className="p-3.5 rounded-xl border border-[#2E2E2E] bg-[#0D0D0D] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-xs text-white truncate">{cert.name || "Certification"}</span>
            <ItemActions onRemove={() => removeCertification(cert.id)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <Input
              value={cert.name}
              onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
              placeholder="Certification Name"
              className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
            />
            <Input
              value={cert.issuer}
              onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
              placeholder="Issuer (e.g. AWS)"
              className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
            />
            <Input
              value={cert.date}
              onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
              placeholder="Date (e.g. 2023-05)"
              className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addCertification}
        className="w-full h-10 text-xs border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] gap-1.5 rounded-full"
      >
        <Plus className="w-4 h-4 text-[#FF6200]" /> Add Certification Entry
      </Button>
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
      {data.languages.map((lang) => (
        <div key={lang.id} className="p-3 rounded-xl border border-[#2E2E2E] bg-[#0D0D0D] flex items-center gap-2">
          <Input
            value={lang.name}
            onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
            placeholder="Language (e.g. English)"
            className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
          />
          <Input
            value={lang.proficiency}
            onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value })}
            placeholder="Proficiency (e.g. Native / Fluent)"
            className="bg-[#141414] border-[#2E2E2E] text-xs text-white rounded-xl"
          />
          <ItemActions onRemove={() => removeLanguage(lang.id)} />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addLanguage}
        className="w-full h-10 text-xs border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] gap-1.5 rounded-full"
      >
        <Plus className="w-4 h-4 text-[#FF6200]" /> Add Language
      </Button>
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
      {data.customSections?.map((sec) => (
        <div key={sec.id} className="p-3.5 rounded-xl border border-[#2E2E2E] bg-[#0D0D0D] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Input
              value={sec.title}
              onChange={(e) => updateCustomSection(sec.id, { title: e.target.value })}
              placeholder="Custom Section Header (e.g. Publications / Volunteer / Awards)"
              className="bg-[#141414] border-[#2E2E2E] text-xs font-bold text-white rounded-xl"
            />
            <ItemActions onRemove={() => removeCustomSection(sec.id)} />
          </div>

          <div className="space-y-2">
            {sec.items?.map((item, i) => (
              <div key={item.id || i} className="p-2.5 rounded-xl bg-[#141414] border border-[#2E2E2E] space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const next = [...sec.items];
                      next[i] = { ...next[i], title: e.target.value };
                      updateCustomSection(sec.id, { items: next });
                    }}
                    placeholder="Item Title (e.g. Award Name / Publication)"
                    className="bg-[#0D0D0D] border-[#2E2E2E] text-xs text-white rounded-xl"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-red-400 hover:text-red-300 shrink-0"
                    onClick={() => {
                      const next = sec.items.filter((_, idx) => idx !== i);
                      updateCustomSection(sec.id, { items: next });
                    }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={item.subtitle || ""}
                    onChange={(e) => {
                      const next = [...sec.items];
                      next[i] = { ...next[i], subtitle: e.target.value };
                      updateCustomSection(sec.id, { items: next });
                    }}
                    placeholder="Subtitle / Publisher (Optional)"
                    className="bg-[#0D0D0D] border-[#2E2E2E] text-xs text-white rounded-xl"
                  />
                  <Input
                    value={item.date || ""}
                    onChange={(e) => {
                      const next = [...sec.items];
                      next[i] = { ...next[i], date: e.target.value };
                      updateCustomSection(sec.id, { items: next });
                    }}
                    placeholder="Date / Year (Optional)"
                    className="bg-[#0D0D0D] border-[#2E2E2E] text-xs text-white rounded-xl"
                  />
                </div>

                <Textarea
                  value={item.description || ""}
                  onChange={(e) => {
                    const next = [...sec.items];
                    next[i] = { ...next[i], description: e.target.value };
                    updateCustomSection(sec.id, { items: next });
                  }}
                  rows={2}
                  placeholder="Details, abstract, or bullet points..."
                  className="bg-[#0D0D0D] border-[#2E2E2E] text-xs text-white rounded-xl p-2.5 resize-none"
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newItem = { id: `item-${Date.now()}`, title: "", subtitle: "", date: "", description: "" };
                updateCustomSection(sec.id, { items: [...(sec.items || []), newItem] });
              }}
              className="h-8 text-xs border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] rounded-full gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF6200]" /> Add Custom Item
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addCustomSection}
        className="w-full h-10 text-xs border-[#2E2E2E] bg-[#141414] text-white hover:bg-[#1A1A1A] gap-1.5 rounded-full"
      >
        <Plus className="w-4 h-4 text-[#FF6200]" /> Add New Custom Section
      </Button>
    </div>
  );
}

// ---------- MAIN CONTAINER WITH TABS ----------
export function ResumeEditor() {
  const [editorTab, setEditorTab] = useState<"content" | "design">("content");

  return (
    <div className="space-y-4 text-left">
      
      {/* Top Tab Switcher: Content vs Design */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#141414] border border-[#2E2E2E] rounded-full text-xs font-semibold">
        <button
          onClick={() => setEditorTab("content")}
          className={`py-2 px-3 rounded-full flex items-center justify-center gap-2 transition-all ${
            editorTab === "content" ? "bg-[#FF6200] text-white shadow-md shadow-[#FF6200]/20 font-bold" : "text-[#888898] hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> 1. Resume Content
        </button>
        <button
          onClick={() => setEditorTab("design")}
          className={`py-2 px-3 rounded-full flex items-center justify-center gap-2 transition-all ${
            editorTab === "design" ? "bg-[#FF6200] text-white shadow-md shadow-[#FF6200]/20 font-bold" : "text-[#888898] hover:text-white"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> 2. Design &amp; Fonts
        </button>
      </div>

      {/* TAB 1: CONTENT EDITOR (9 FULL SECTIONS) */}
      {editorTab === "content" && (
        <Accordion type="multiple" defaultValue={["personal", "summary", "experience", "skills"]} className="space-y-3">
          <AccordionItem value="personal" className="border border-[#2E2E2E] bg-[#141414] rounded-2xl px-4 py-1">
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF6200]" /> Personal Information
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <PersonalInfoEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="summary" className="border border-[#2E2E2E] bg-[#141414] rounded-2xl px-4 py-1">
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-[#FF6200]" /> Professional Summary
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <SummaryEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="experience" className="border border-[#2E2E2E] bg-[#141414] rounded-2xl px-4 py-1">
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#FF6200]" /> Work Experience
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <ExperienceEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="education" className="border border-[#2E2E2E] bg-[#141414] rounded-2xl px-4 py-1">
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#FF6200]" /> Education &amp; Credentials
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <EducationEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="skills" className="border border-[#2E2E2E] bg-[#141414] rounded-2xl px-4 py-1">
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6200]" /> Technical &amp; Core Skills
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <SkillsEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="projects" className="border border-[#2E2E2E] bg-[#141414] rounded-2xl px-4 py-1">
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#FF6200]" /> Featured Projects
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <ProjectsEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="certifications" className="border border-[#2E2E2E] bg-[#141414] rounded-2xl px-4 py-1">
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FF6200]" /> Certifications &amp; Licenses
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <CertificationsEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="languages" className="border border-[#2E2E2E] bg-[#141414] rounded-2xl px-4 py-1">
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <LanguagesIcon className="w-4 h-4 text-[#FF6200]" /> Languages
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <LanguagesEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="custom" className="border border-[#2E2E2E] bg-[#141414] rounded-2xl px-4 py-1">
            <AccordionTrigger className="hover:no-underline text-xs font-bold text-white py-3">
              <span className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#FF6200]" /> Custom Sections (Volunteer, Awards, etc.)
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
