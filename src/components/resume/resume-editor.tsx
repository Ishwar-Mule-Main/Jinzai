"use client";

import { useRef } from "react";
import { useResumeStore } from "@/lib/resume/store";
import { TEMPLATES } from "@/lib/resume/types";
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
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SortableList, SortableItem } from "./sortable";
import { SkillSuggestions } from "./skill-suggestions";

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
      <div className="w-16 h-16 rounded-lg overflow-hidden border bg-muted flex items-center justify-center shrink-0">
        {data.personalInfo.photo ? (
          <img src={data.personalInfo.photo} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Photo
        </Button>
        {data.personalInfo.photo && (
          <Button type="button" variant="ghost" size="sm" onClick={() => updatePersonal({ photo: "" })}>
            <X className="w-3.5 h-3.5 mr-1.5" /> Remove
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
        <Button type="button" size="icon" variant="ghost" onClick={onUp} disabled={upDisabled} className="h-7 w-7">
          <ChevronUp className="w-3.5 h-3.5" />
        </Button>
      )}
      {onDown && (
        <Button type="button" size="icon" variant="ghost" onClick={onDown} disabled={downDisabled} className="h-7 w-7">
          <ChevronDown className="w-3.5 h-3.5" />
        </Button>
      )}
      <Button type="button" size="icon" variant="ghost" onClick={onRemove} className="h-7 w-7 text-destructive hover:text-destructive">
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

function StringListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" size="sm" variant="secondary" onClick={add}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add
        </Button>
      </div>
      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((it, i) => (
            <li key={i} className="flex items-start gap-2 group">
              <span className="text-xs text-muted-foreground mt-2">{i + 1}.</span>
              <Input
                value={it}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = e.target.value;
                  onChange(next);
                }}
                className="text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AISummaryButton() {
  const data = useResumeStore((s) => s.data);
  const setSummary = useResumeStore((s) => s.setSummary);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!data.personalInfo.fullName || !data.personalInfo.jobTitle) {
      toast.error("Add your name and job title first");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.personalInfo.fullName,
          jobTitle: data.personalInfo.jobTitle,
          experience: data.experience,
          skills: data.skills,
          tagline: data.personalInfo.tagline,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setSummary(json.summary);
      toast.success("Summary generated");
    } catch (err) {
      toast.error("Could not generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={generate} disabled={loading}>
      {loading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
      AI Generate
    </Button>
  );
}

function AIExperienceButton({ experienceId }: { experienceId: string }) {
  const data = useResumeStore((s) => s.data);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const [loading, setLoading] = useState(false);
  const exp = data.experience.find((e) => e.id === experienceId);

  const generate = async () => {
    if (!exp) return;
    if (!exp.position || !exp.company) {
      toast.error("Add position and company first");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: exp.position,
          company: exp.company,
          description: exp.description,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      updateExperience(experienceId, { achievements: json.bullets });
      toast.success("Achievements generated");
    } catch {
      toast.error("Could not generate achievements");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={generate} disabled={loading}>
      {loading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
      AI Generate
    </Button>
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
        <div className="flex items-center gap-2 p-2.5 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Contact details are locked on your plan. They cannot be changed once saved.</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Full Name *</Label>
          <Input value={p.fullName} onChange={(e) => updatePersonal({ fullName: e.target.value })} placeholder="Aanya Sharma" />
        </div>
        <div>
          <Label className="text-xs">Job Title *</Label>
          <Input value={p.jobTitle} onChange={(e) => updatePersonal({ jobTitle: e.target.value })} placeholder="Senior Product Designer" />
        </div>
        <div>
          <Label className="text-xs flex items-center gap-1">Email {contactLocked && <Lock className="w-2.5 h-2.5 text-amber-500" />}</Label>
          <Input value={p.email} disabled={contactLocked} onChange={(e) => updatePersonal({ email: e.target.value })} placeholder="you@email.com" className={contactLocked ? "opacity-60 cursor-not-allowed" : ""} />
        </div>
        <div>
          <Label className="text-xs flex items-center gap-1">Phone {contactLocked && <Lock className="w-2.5 h-2.5 text-amber-500" />}</Label>
          <Input value={p.phone} disabled={contactLocked} onChange={(e) => updatePersonal({ phone: e.target.value })} placeholder="+91 98765 43210" className={contactLocked ? "opacity-60 cursor-not-allowed" : ""} />
        </div>
        <div>
          <Label className="text-xs">Location</Label>
          <Input value={p.location} onChange={(e) => updatePersonal({ location: e.target.value })} placeholder="Bengaluru, IN" />
        </div>
        <div>
          <Label className="text-xs">Website</Label>
          <Input value={p.website} onChange={(e) => updatePersonal({ website: e.target.value })} placeholder="yoursite.com" />
        </div>
        <div>
          <Label className="text-xs">LinkedIn</Label>
          <Input value={p.linkedin} onChange={(e) => updatePersonal({ linkedin: e.target.value })} placeholder="linkedin.com/in/you" />
        </div>
        <div>
          <Label className="text-xs">GitHub</Label>
          <Input value={p.github} onChange={(e) => updatePersonal({ github: e.target.value })} placeholder="github.com/you" />
        </div>
      </div>
      <div>
        <Label className="text-xs">Tagline / Headline</Label>
        <Input value={p.tagline} onChange={(e) => updatePersonal({ tagline: e.target.value })} placeholder="Designing human-centered products that ship." />
      </div>
    </div>
  );
}

// ---------- Summary ----------

function SummaryEditor() {
  const summary = useResumeStore((s) => s.data.summary);
  const setSummary = useResumeStore((s) => s.setSummary);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Professional Summary</Label>
        <AISummaryButton />
      </div>
      <Textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="A results-driven professional with..."
        rows={5}
      />
      <p className="text-[11px] text-muted-foreground">{summary.length} characters · aim for 250-500 for impact</p>
    </div>
  );
}

// ---------- Experience ----------

function ExperienceEditor() {
  const experience = useResumeStore((s) => s.data.experience);
  const add = useResumeStore((s) => s.addExperience);
  const update = useResumeStore((s) => s.updateExperience);
  const remove = useResumeStore((s) => s.removeExperience);
  const reorderSection = useResumeStore((s) => s.reorderSection);

  return (
    <div className="space-y-3">
      {experience.length === 0 && (
        <p className="text-xs text-muted-foreground italic">No experience yet. Click below to add your first role.</p>
      )}
      <SortableList
        items={experience}
        onReorder={(oldIndex, newIndex) => reorderSection("experience", oldIndex, newIndex)}
        renderItem={(e) => (
          <SortableItem id={e.id}>
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem value={e.id} className="border rounded-lg px-3">
                <div className="flex items-center">
                  <AccordionTrigger className="hover:no-underline flex-1 text-left py-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{e.position || "New role"}{e.company ? ` · ${e.company}` : ""}</p>
                      <p className="text-xs text-muted-foreground">{e.startDate || "Start date"} → {e.current ? "Present" : e.endDate || "End date"}</p>
                    </div>
                  </AccordionTrigger>
                  <ItemActions onRemove={() => remove(e.id)} />
                </div>
            <AccordionContent className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Position</Label>
                  <Input value={e.position} onChange={(ev) => update(e.id, { position: ev.target.value })} placeholder="Senior Product Designer" />
                </div>
                <div>
                  <Label className="text-xs">Company</Label>
                  <Input value={e.company} onChange={(ev) => update(e.id, { company: ev.target.value })} placeholder="Razorpay" />
                </div>
                <div>
                  <Label className="text-xs">Location</Label>
                  <Input value={e.location} onChange={(ev) => update(e.id, { location: ev.target.value })} placeholder="Bengaluru, IN" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Start</Label>
                    <Input type="month" value={e.startDate} onChange={(ev) => update(e.id, { startDate: ev.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">End</Label>
                    <Input type="month" value={e.endDate} disabled={e.current} onChange={(ev) => update(e.id, { endDate: ev.target.value })} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id={`cur-${e.id}`} checked={e.current} onCheckedChange={(v) => update(e.id, { current: v === true, endDate: v ? "" : e.endDate })} />
                <Label htmlFor={`cur-${e.id}`} className="text-xs cursor-pointer">I currently work here</Label>
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea value={e.description} onChange={(ev) => update(e.id, { description: ev.target.value })} rows={2} placeholder="Brief overview of the role and team" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-xs">Key Achievements</Label>
                  <AIExperienceButton experienceId={e.id} />
                </div>
                <StringListEditor items={e.achievements} onChange={(next) => update(e.id, { achievements: next })} placeholder="Reduced onboarding time by 94%" />
              </div>
            </AccordionContent>
          </AccordionItem>
            </Accordion>
          </SortableItem>
        )}
      />
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Experience
      </Button>
    </div>
  );
}

// ---------- Education ----------

function EducationEditor() {
  const items = useResumeStore((s) => s.data.education);
  const add = useResumeStore((s) => s.addEducation);
  const update = useResumeStore((s) => s.updateEducation);
  const remove = useResumeStore((s) => s.removeEducation);
  const reorderSection = useResumeStore((s) => s.reorderSection);
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-xs text-muted-foreground italic">No education added yet.</p>}
      <SortableList
        items={items}
        onReorder={(oldIndex, newIndex) => reorderSection("education", oldIndex, newIndex)}
        renderItem={(ed) => (
          <SortableItem id={ed.id}>
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem value={ed.id} className="border rounded-lg px-3">
                <div className="flex items-center">
                  <AccordionTrigger className="hover:no-underline flex-1 text-left py-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ed.degree || "New degree"}{ed.field ? `, ${ed.field}` : ""}</p>
                      <p className="text-xs text-muted-foreground">{ed.institution || "Institution"}</p>
                    </div>
                  </AccordionTrigger>
                  <ItemActions onRemove={() => remove(ed.id)} />
                </div>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Degree</Label>
                      <Input value={ed.degree} onChange={(e) => update(ed.id, { degree: e.target.value })} placeholder="B.E" />
                    </div>
                    <div>
                      <Label className="text-xs">Field</Label>
                      <Input value={ed.field} onChange={(e) => update(ed.id, { field: e.target.value })} placeholder="Computer Science" />
                    </div>
                    <div>
                      <Label className="text-xs">Institution</Label>
                      <Input value={ed.institution} onChange={(e) => update(ed.id, { institution: e.target.value })} placeholder="Anna University" />
                    </div>
                    <div>
                      <Label className="text-xs">GPA / Score</Label>
                      <Input value={ed.gpa} onChange={(e) => update(ed.id, { gpa: e.target.value })} placeholder="8.9 / 10" />
                    </div>
                    <div>
                      <Label className="text-xs">Start</Label>
                      <Input type="month" value={ed.startDate} onChange={(e) => update(ed.id, { startDate: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">End</Label>
                      <Input type="month" value={ed.endDate} onChange={(e) => update(ed.id, { endDate: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Notes</Label>
                    <Textarea value={ed.description} onChange={(e) => update(ed.id, { description: e.target.value })} rows={2} placeholder="Thesis, honors, relevant coursework" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </SortableItem>
        )}
      />
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Education
      </Button>
    </div>
  );
}

// ---------- Skills ----------

function SkillsEditor() {
  const skills = useResumeStore((s) => s.data.skills);
  const add = useResumeStore((s) => s.addSkillCategory);
  const update = useResumeStore((s) => s.updateSkillCategory);
  const remove = useResumeStore((s) => s.removeSkillCategory);
  const reorderSection = useResumeStore((s) => s.reorderSection);
  return (
    <div className="space-y-3">
      {skills.length === 0 && <p className="text-xs text-muted-foreground italic">No skills added yet.</p>}
      <SortableList
        items={skills}
        onReorder={(oldIndex, newIndex) => reorderSection("skills", oldIndex, newIndex)}
        renderItem={(s) => (
          <SortableItem id={s.id}>
            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  value={s.category}
                  onChange={(e) => update(s.id, { category: e.target.value })}
                  className="font-medium text-sm"
                  placeholder="Category (e.g. Design Tools)"
                />
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(s.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <StringListEditor items={s.items} onChange={(next) => update(s.id, { items: next })} placeholder="Add a skill and press Enter" />
            </div>
          </SortableItem>
        )}
      />
      <div className="flex gap-2 flex-wrap">
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Skill Category
        </Button>
        <SkillSuggestions />
      </div>
    </div>
  );
}

// ---------- Projects ----------

function ProjectsEditor() {
  const items = useResumeStore((s) => s.data.projects);
  const add = useResumeStore((s) => s.addProject);
  const update = useResumeStore((s) => s.updateProject);
  const remove = useResumeStore((s) => s.removeProject);
  const reorderSection = useResumeStore((s) => s.reorderSection);
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-xs text-muted-foreground italic">No projects added yet.</p>}
      <SortableList
        items={items}
        onReorder={(oldIndex, newIndex) => reorderSection("projects", oldIndex, newIndex)}
        renderItem={(p) => (
          <SortableItem id={p.id}>
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem value={p.id} className="border rounded-lg px-3">
                <div className="flex items-center">
                  <AccordionTrigger className="hover:no-underline flex-1 text-left py-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name || "New project"}</p>
                      <p className="text-xs text-muted-foreground">{p.technologies.join(" · ") || "No technologies"}</p>
                    </div>
                  </AccordionTrigger>
                  <ItemActions onRemove={() => remove(p.id)} />
                </div>
                <AccordionContent className="space-y-3 pt-2">
                  <div>
                    <Label className="text-xs">Project Name</Label>
                    <Input value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} placeholder="Blade Design System" />
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea value={p.description} onChange={(e) => update(p.id, { description: e.target.value })} rows={2} placeholder="What does it do and what impact did it have?" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Link</Label>
                      <Input value={p.link} onChange={(e) => update(p.id, { link: e.target.value })} placeholder="github.com/you/project" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Start</Label>
                        <Input type="month" value={p.startDate} onChange={(e) => update(p.id, { startDate: e.target.value })} />
                      </div>
                      <div>
                        <Label className="text-xs">End</Label>
                        <Input type="month" value={p.endDate} onChange={(e) => update(p.id, { endDate: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Technologies</Label>
                    <StringListEditor items={p.technologies} onChange={(next) => update(p.id, { technologies: next })} placeholder="React, TypeScript..." />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </SortableItem>
        )}
      />
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Project
      </Button>
    </div>
  );
}

// ---------- Certifications ----------

function CertificationsEditor() {
  const items = useResumeStore((s) => s.data.certifications);
  const add = useResumeStore((s) => s.addCertification);
  const update = useResumeStore((s) => s.updateCertification);
  const remove = useResumeStore((s) => s.removeCertification);
  const reorderSection = useResumeStore((s) => s.reorderSection);
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-xs text-muted-foreground italic">No certifications added yet.</p>}
      <SortableList
        items={items}
        onReorder={(oldIndex, newIndex) => reorderSection("certifications", oldIndex, newIndex)}
        renderItem={(c) => (
          <SortableItem id={c.id}>
            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Input value={c.name} onChange={(e) => update(c.id, { name: e.target.value })} placeholder="Certification name" className="font-medium text-sm" />
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(c.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input value={c.issuer} onChange={(e) => update(c.id, { issuer: e.target.value })} placeholder="Issuing org" />
                <Input value={c.credentialId} onChange={(e) => update(c.id, { credentialId: e.target.value })} placeholder="Credential ID" />
                <Input type="month" value={c.date} onChange={(e) => update(c.id, { date: e.target.value })} />
                <Input type="month" value={c.expiryDate} onChange={(e) => update(c.id, { expiryDate: e.target.value })} placeholder="Expiry (optional)" />
              </div>
            </div>
          </SortableItem>
        )}
      />
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Certification
      </Button>
    </div>
  );
}

// ---------- Languages ----------

function LanguagesEditor() {
  const items = useResumeStore((s) => s.data.languages);
  const add = useResumeStore((s) => s.addLanguage);
  const update = useResumeStore((s) => s.updateLanguage);
  const remove = useResumeStore((s) => s.removeLanguage);
  const reorderSection = useResumeStore((s) => s.reorderSection);
  const levels = ["Basic", "Conversational", "Fluent", "Professional", "Native"];
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-xs text-muted-foreground italic">No languages added yet.</p>}
      <SortableList
        items={items}
        onReorder={(oldIndex, newIndex) => reorderSection("languages", oldIndex, newIndex)}
        renderItem={(l) => (
          <SortableItem id={l.id}>
            <div className="flex items-center gap-2">
              <Input value={l.name} onChange={(e) => update(l.id, { name: e.target.value })} placeholder="Language" className="flex-1" />
              <select
                value={l.proficiency}
                onChange={(e) => update(l.id, { proficiency: e.target.value })}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                {levels.map((lv) => (
                  <option key={lv} value={lv}>{lv}</option>
                ))}
              </select>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(l.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </SortableItem>
        )}
      />
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Language
      </Button>
    </div>
  );
}

// ---------- Custom Sections ----------

function CustomSectionsEditor() {
  const items = useResumeStore((s) => s.data.customSections);
  const add = useResumeStore((s) => s.addCustomSection);
  const update = useResumeStore((s) => s.updateCustomSection);
  const remove = useResumeStore((s) => s.removeCustomSection);
  const reorderSection = useResumeStore((s) => s.reorderSection);
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-xs text-muted-foreground italic">Add custom sections like "Awards", "Volunteer", "Interests".</p>}
      <SortableList
        items={items}
        onReorder={(oldIndex, newIndex) => reorderSection("customSections", oldIndex, newIndex)}
        renderItem={(s) => (
          <SortableItem id={s.id}>
            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Input value={s.title} onChange={(e) => update(s.id, { title: e.target.value })} placeholder="Section title (e.g. Awards)" className="font-medium text-sm" />
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(s.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <StringListEditor items={s.items} onChange={(next) => update(s.id, { items: next })} placeholder="Add an item and press Enter" />
            </div>
          </SortableItem>
        )}
      />
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Custom Section
      </Button>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, count }: { icon: React.ComponentType<{ className?: string }>; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="w-7 h-7 rounded-md bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
      </div>
      <span className="text-sm font-semibold">{title}</span>
      {count !== undefined && count > 0 && (
        <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1.5 min-w-4 justify-center">{count}</Badge>
      )}
    </div>
  );
}

export function ResumeEditor() {
  const data = useResumeStore((s) => s.data);
  return (
    <div className="space-y-1">
      <Accordion type="multiple" defaultValue={["personal"]} className="space-y-2">
        <AccordionItem value="personal" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <SectionHeader icon={User} title="Personal Info" />
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <PersonalInfoEditor />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="summary" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <SectionHeader icon={AlignLeft} title="Summary" count={data.summary.trim().length > 0 ? 1 : 0} />
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SummaryEditor />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="experience" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <SectionHeader icon={Briefcase} title="Experience" count={data.experience.length} />
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ExperienceEditor />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="education" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <SectionHeader icon={GraduationCap} title="Education" count={data.education.length} />
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <EducationEditor />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="skills" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <SectionHeader icon={Sparkles} title="Skills" count={data.skills.length} />
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SkillsEditor />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="projects" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <SectionHeader icon={FolderGit2} title="Projects" count={data.projects.length} />
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ProjectsEditor />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="certifications" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <SectionHeader icon={Award} title="Certifications" count={data.certifications.length} />
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <CertificationsEditor />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="languages" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <SectionHeader icon={Languages} title="Languages" count={data.languages.length} />
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <LanguagesEditor />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="custom" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <SectionHeader icon={Layers} title="Custom Sections" count={data.customSections.length} />
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <CustomSectionsEditor />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
