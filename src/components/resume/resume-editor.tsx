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
  Languages,
  Layers,
  Lock,
  Wand2,
  LayoutGrid,
  Palette,
  Type,
  Check,
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
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#2E2E2E] bg-[#141414] flex items-center justify-center shrink-0">
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

function DesignControlsSection() {
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
    <div className="p-4 rounded-2xl bg-[#141414] border border-[#2E2E2E] space-y-4 mb-4">
      <div className="flex items-center justify-between border-b border-[#2E2E2E] pb-3">
        <span className="font-bricolage text-sm font-bold text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#FF6200]" /> Design, Colors &amp; Typography
        </span>
        <Badge className="bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/30 text-[9px] font-mono">
          78 TEMPLATES
        </Badge>
      </div>

      {/* 1. Change Design Button + Modal */}
      <div className="space-y-1.5">
        <Label className="text-xs font-mono text-[#9A9AAB]">ACTIVE TEMPLATE DESIGN</Label>
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D0D0D] border border-[#2E2E2E]">
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

      {/* 2. Pick Accent Color */}
      <div className="space-y-1.5">
        <Label className="text-xs font-mono text-[#9A9AAB]">ACCENT COLOR PALETTE</Label>
        <div className="flex flex-wrap items-center gap-2">
          {ACCENT_PRESETS.slice(0, 10).map((hex) => (
            <button
              key={hex}
              onClick={() => setAccentColor(hex)}
              className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                accentColor === hex ? "ring-2 ring-[#FF6200] ring-offset-2 ring-offset-[#141414] border-white" : "border-transparent opacity-80 hover:opacity-100"
              }`}
              style={{ backgroundColor: hex }}
            >
              {accentColor === hex && <Check className="w-3 h-3 text-white drop-shadow" />}
            </button>
          ))}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] font-mono text-[#888898]">Hex:</span>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-7 h-7 rounded-lg border border-[#2E2E2E] bg-transparent cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Font Family & Font Size Controls */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="space-y-1.5">
          <Label className="text-xs font-mono text-[#9A9AAB] flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-[#FF6200]" /> FONT FAMILY
          </Label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full h-9 bg-[#0D0D0D] border border-[#2E2E2E] rounded-xl text-xs text-white px-2.5 focus:border-[#FF6200] focus:outline-none"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id} className="bg-[#141414] text-white">
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-mono text-[#9A9AAB]">FONT SIZE SCALE</Label>
          <div className="grid grid-cols-5 gap-1 bg-[#0D0D0D] p-1 rounded-xl border border-[#2E2E2E]">
            {FONT_SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFontSize(opt.id)}
                className={`h-7 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  fontSize === opt.id ? "bg-[#FF6200] text-white shadow-sm" : "text-[#888898] hover:text-white"
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

// ---------- Personal Info ----------

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
          <Label className="text-xs text-[#9A9AAB]">Job Title / Headline</Label>
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

// ---------- Summary ----------

function SummaryEditor() {
  const data = useResumeStore((s) => s.data);
  const setSummary = useResumeStore((s) => s.setSummary);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-[#9A9AAB]">Professional Summary</Label>
      </div>
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

// ---------- Experience ----------

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
                  placeholder="Company"
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
                <Label className="text-xs text-[#9A9AAB]">Key Accomplishments &amp; Bullets</Label>
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

// ---------- Main ResumeEditor Accordion Container ----------

export function ResumeEditor() {
  return (
    <div className="space-y-4 text-left">
      {/* Design, Colors & Typography Top Block */}
      <DesignControlsSection />

      {/* Accordion Sections for Content Editing */}
      <Accordion type="multiple" defaultValue={["personal", "summary", "experience"]} className="space-y-3">
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
      </Accordion>
    </div>
  );
}
