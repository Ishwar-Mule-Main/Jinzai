"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResumeData, TemplateId } from "./types";
import { emptyResume, sampleResume, uid, ensureResumeIds } from "./sample-data";
import { SPEC_MAP } from "./template-specs";

interface ResumeState {
  // current editing data
  data: ResumeData;
  template: TemplateId;
  accentColor: string;
  fontFamily: string;
  fontSize: string; // xs, s, m, l, xl
  title: string;
  savedId: string | null;
  contactLocked: boolean; // once contact details added on paid plan, locked
  // view
  view: "dashboard" | "editor";
  // history for undo/redo
  past: ResumeData[];
  future: ResumeData[];

  setView: (v: "dashboard" | "editor") => void;
  setTemplate: (t: TemplateId) => void;
  setAccentColor: (c: string) => void;
  setFontFamily: (f: string) => void;
  setFontSize: (s: string) => void;
  setTitle: (t: string) => void;
  setSavedId: (id: string | null) => void;
  setContactLocked: (v: boolean) => void;

  loadSample: () => void;
  clearAll: () => void;
  setData: (d: ResumeData) => void;
  mergeData: (d: Partial<ResumeData>, sectionsToMerge?: string[]) => void;
  updateData: (updater: (d: ResumeData) => ResumeData) => void;
  updatePersonal: (patch: Partial<ResumeData["personalInfo"]>) => void;
  setSummary: (s: string) => void;

  // section ops
  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<ResumeData["experience"][0]>) => void;
  removeExperience: (id: string) => void;
  moveExperience: (id: string, dir: -1 | 1) => void;

  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<ResumeData["education"][0]>) => void;
  removeEducation: (id: string) => void;

  addSkillCategory: () => void;
  updateSkillCategory: (id: string, patch: Partial<ResumeData["skills"][0]>) => void;
  removeSkillCategory: (id: string) => void;

  addProject: () => void;
  updateProject: (id: string, patch: Partial<ResumeData["projects"][0]>) => void;
  removeProject: (id: string) => void;

  addCertification: () => void;
  updateCertification: (id: string, patch: Partial<ResumeData["certifications"][0]>) => void;
  removeCertification: (id: string) => void;

  addLanguage: () => void;
  updateLanguage: (id: string, patch: Partial<ResumeData["languages"][0]>) => void;
  removeLanguage: (id: string) => void;

  addCustomSection: () => void;
  updateCustomSection: (id: string, patch: Partial<ResumeData["customSections"][0]>) => void;
  removeCustomSection: (id: string) => void;

  // Section Ordering & Placement across Preview Layout
  moveSectionOrder: (sectionKey: string, dir: -1 | 1) => void;
  setSectionPlacement: (sectionKey: string, placement: "sidebar" | "main" | "left" | "right") => void;
  reorderSectionList: (newOrder: string[]) => void;

  // Generic reordering via drag-and-drop
  reorderSection: (section: keyof ResumeData, oldIndex: number, newIndex: number) => void;

  undo: () => void;
  redo: () => void;
}

function pushHistory(set: (fn: (s: ResumeState) => Partial<ResumeState>) => void, get: () => ResumeState, next: ResumeData) {
  set((s) => ({
    past: [...s.past.slice(-29), s.data],
    future: [],
    data: next,
  }));
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      data: emptyResume,
      template: "modern",
      accentColor: "#0f766e",
      fontFamily: "inter",
      fontSize: "m",
      title: "Untitled Resume",
      savedId: null,
      contactLocked: false,
      view: "dashboard",
      past: [],
      future: [],

      setView: (v) => set({ view: v }),
      setTemplate: (t) => {
        set({ template: t });
      },
      setAccentColor: (c) => set({ accentColor: c }),
      setFontFamily: (f) => set({ fontFamily: f }),
      setFontSize: (s) => set({ fontSize: s }),
      setTitle: (t) => set({ title: t }),
      setSavedId: (id) => set({ savedId: id }),
      setContactLocked: (v) => set({ contactLocked: v }),

      loadSample: () => {
        const cloned: ResumeData = JSON.parse(JSON.stringify(sampleResume));
        pushHistory(set, get, cloned);
        set({ title: "Aanya Sharma — Sample", view: "editor" });
      },
      clearAll: () => {
        const cloned: ResumeData = JSON.parse(JSON.stringify(emptyResume));
        pushHistory(set, get, cloned);
        set({ savedId: null, title: "Untitled Resume" });
      },
      setData: (d) => pushHistory(set, get, ensureResumeIds(d)),
      mergeData: (scanned, sectionsToMerge) => {
        const current = structuredClone(get().data);
        const sections = sectionsToMerge || ["personalInfo", "summary", "experience", "education", "skills", "projects", "certifications", "languages", "customSections"];

        if (sections.includes("personalInfo") && scanned.personalInfo) {
          const p = scanned.personalInfo;
          current.personalInfo = {
            fullName: p.fullName || current.personalInfo.fullName,
            jobTitle: p.jobTitle || current.personalInfo.jobTitle,
            email: p.email || current.personalInfo.email,
            phone: p.phone || current.personalInfo.phone,
            location: p.location || current.personalInfo.location,
            website: p.website || current.personalInfo.website,
            linkedin: p.linkedin || current.personalInfo.linkedin,
            github: p.github || current.personalInfo.github,
            photo: p.photo || current.personalInfo.photo,
            tagline: p.tagline || current.personalInfo.tagline,
          };
        }

        if (sections.includes("summary") && scanned.summary) {
          current.summary = current.summary ? `${current.summary}\n\n${scanned.summary}` : scanned.summary;
        }

        if (sections.includes("experience") && Array.isArray(scanned.experience)) {
          for (const exp of scanned.experience) {
            if (exp.company || exp.position) {
              current.experience.push({
                ...exp,
                id: exp.id || uid(),
              });
            }
          }
        }

        if (sections.includes("education") && Array.isArray(scanned.education)) {
          for (const ed of scanned.education) {
            if (ed.institution || ed.degree) {
              current.education.push({
                ...ed,
                id: ed.id || uid(),
              });
            }
          }
        }

        if (sections.includes("skills") && Array.isArray(scanned.skills)) {
          for (const sk of scanned.skills) {
            if (sk.category && sk.items?.length) {
              const existingCat = current.skills.find((s) => s.category.toLowerCase() === sk.category.toLowerCase());
              if (existingCat) {
                existingCat.items = Array.from(new Set([...existingCat.items, ...sk.items]));
              } else {
                current.skills.push({
                  id: sk.id || uid(),
                  category: sk.category,
                  items: sk.items,
                });
              }
            }
          }
        }

        if (sections.includes("projects") && Array.isArray(scanned.projects)) {
          for (const pr of scanned.projects) {
            if (pr.name) {
              current.projects.push({
                ...pr,
                id: pr.id || uid(),
              });
            }
          }
        }

        if (sections.includes("certifications") && Array.isArray(scanned.certifications)) {
          for (const c of scanned.certifications) {
            if (c.name) {
              current.certifications.push({
                ...c,
                id: c.id || uid(),
              });
            }
          }
        }

        if (sections.includes("languages") && Array.isArray(scanned.languages)) {
          for (const l of scanned.languages) {
            if (l.name) {
              const exists = current.languages.some((existing) => existing.name.toLowerCase() === l.name.toLowerCase());
              if (!exists) {
                current.languages.push({
                  id: l.id || uid(),
                  name: l.name,
                  proficiency: l.proficiency || "Conversational",
                });
              }
            }
          }
        }

        if (sections.includes("customSections") && Array.isArray(scanned.customSections)) {
          for (const cs of scanned.customSections) {
            if (cs.title && cs.items?.length) {
              current.customSections.push({
                id: cs.id || uid(),
                title: cs.title,
                items: cs.items,
              });
            }
          }
        }

        pushHistory(set, get, ensureResumeIds(current));
      },
      updateData: (updater) => {
        const next = updater(structuredClone(get().data));
        pushHistory(set, get, next);
      },
      updatePersonal: (patch) => {
        const next = structuredClone(get().data);
        next.personalInfo = { ...next.personalInfo, ...patch };
        pushHistory(set, get, next);
      },
      setSummary: (s) => {
        const next = structuredClone(get().data);
        next.summary = s;
        pushHistory(set, get, next);
      },

      addExperience: () => {
        const next = structuredClone(get().data);
        next.experience.push({
          id: uid(),
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
          achievements: [],
        });
        pushHistory(set, get, next);
      },
      updateExperience: (id, patch) => {
        const next = structuredClone(get().data);
        const idx = next.experience.findIndex((e) => e.id === id);
        if (idx >= 0) next.experience[idx] = { ...next.experience[idx], ...patch };
        pushHistory(set, get, next);
      },
      removeExperience: (id) => {
        const next = structuredClone(get().data);
        next.experience = next.experience.filter((e) => e.id !== id);
        pushHistory(set, get, next);
      },
      moveExperience: (id, dir) => {
        const next = structuredClone(get().data);
        const idx = next.experience.findIndex((e) => e.id === id);
        const target = idx + dir;
        if (idx >= 0 && target >= 0 && target < next.experience.length) {
          [next.experience[idx], next.experience[target]] = [next.experience[target], next.experience[idx]];
        }
        pushHistory(set, get, next);
      },

      addEducation: () => {
        const next = structuredClone(get().data);
        next.education.push({
          id: uid(),
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          gpa: "",
          description: "",
        });
        pushHistory(set, get, next);
      },
      updateEducation: (id, patch) => {
        const next = structuredClone(get().data);
        const idx = next.education.findIndex((e) => e.id === id);
        if (idx >= 0) next.education[idx] = { ...next.education[idx], ...patch };
        pushHistory(set, get, next);
      },
      removeEducation: (id) => {
        const next = structuredClone(get().data);
        next.education = next.education.filter((e) => e.id !== id);
        pushHistory(set, get, next);
      },

      addSkillCategory: () => {
        const next = structuredClone(get().data);
        next.skills.push({ id: uid(), category: "New Category", items: [] });
        pushHistory(set, get, next);
      },
      updateSkillCategory: (id, patch) => {
        const next = structuredClone(get().data);
        const idx = next.skills.findIndex((s) => s.id === id);
        if (idx >= 0) next.skills[idx] = { ...next.skills[idx], ...patch };
        pushHistory(set, get, next);
      },
      removeSkillCategory: (id) => {
        const next = structuredClone(get().data);
        next.skills = next.skills.filter((s) => s.id !== id);
        pushHistory(set, get, next);
      },

      addProject: () => {
        const next = structuredClone(get().data);
        next.projects.push({
          id: uid(),
          name: "",
          description: "",
          technologies: [],
          link: "",
          startDate: "",
          endDate: "",
        });
        pushHistory(set, get, next);
      },
      updateProject: (id, patch) => {
        const next = structuredClone(get().data);
        const idx = next.projects.findIndex((p) => p.id === id);
        if (idx >= 0) next.projects[idx] = { ...next.projects[idx], ...patch };
        pushHistory(set, get, next);
      },
      removeProject: (id) => {
        const next = structuredClone(get().data);
        next.projects = next.projects.filter((p) => p.id !== id);
        pushHistory(set, get, next);
      },

      addCertification: () => {
        const next = structuredClone(get().data);
        next.certifications.push({
          id: uid(),
          name: "",
          issuer: "",
          date: "",
          expiryDate: "",
          credentialId: "",
        });
        pushHistory(set, get, next);
      },
      updateCertification: (id, patch) => {
        const next = structuredClone(get().data);
        const idx = next.certifications.findIndex((c) => c.id === id);
        if (idx >= 0) next.certifications[idx] = { ...next.certifications[idx], ...patch };
        pushHistory(set, get, next);
      },
      removeCertification: (id) => {
        const next = structuredClone(get().data);
        next.certifications = next.certifications.filter((c) => c.id !== id);
        pushHistory(set, get, next);
      },

      addLanguage: () => {
        const next = structuredClone(get().data);
        next.languages.push({ id: uid(), name: "", proficiency: "Conversational" });
        pushHistory(set, get, next);
      },
      updateLanguage: (id, patch) => {
        const next = structuredClone(get().data);
        const idx = next.languages.findIndex((l) => l.id === id);
        if (idx >= 0) next.languages[idx] = { ...next.languages[idx], ...patch };
        pushHistory(set, get, next);
      },
      removeLanguage: (id) => {
        const next = structuredClone(get().data);
        next.languages = next.languages.filter((l) => l.id !== id);
        pushHistory(set, get, next);
      },

      addCustomSection: () => {
        const next = structuredClone(get().data);
        next.customSections.push({ id: uid(), title: "New Section", items: [] });
        pushHistory(set, get, next);
      },
      updateCustomSection: (id, patch) => {
        const next = structuredClone(get().data);
        const idx = next.customSections.findIndex((s) => s.id === id);
        if (idx >= 0) next.customSections[idx] = { ...next.customSections[idx], ...patch };
        pushHistory(set, get, next);
      },
      removeCustomSection: (id) => {
        const next = structuredClone(get().data);
        next.customSections = next.customSections.filter((s) => s.id !== id);
        pushHistory(set, get, next);
      },

      moveSectionOrder: (sectionKey, dir) => {
        const next = structuredClone(get().data);
        const order = next.sectionOrder || [
          "personal",
          "summary",
          "experience",
          "education",
          "skills",
          "projects",
          "certifications",
          "languages",
          "custom",
        ];
        const idx = order.indexOf(sectionKey);
        const target = idx + dir;
        if (idx >= 0 && target >= 0 && target < order.length) {
          [order[idx], order[target]] = [order[target], order[idx]];
          next.sectionOrder = order;
          pushHistory(set, get, next);
        }
      },

      setSectionPlacement: (sectionKey, placement) => {
        const next = structuredClone(get().data);
        if (!next.sectionPlacements) next.sectionPlacements = {};
        next.sectionPlacements[sectionKey] = placement;
        pushHistory(set, get, next);
      },

      reorderSectionList: (newOrder) => {
        const next = structuredClone(get().data);
        next.sectionOrder = newOrder;
        pushHistory(set, get, next);
      },

      reorderSection: (section, oldIndex, newIndex) => {
        const next = structuredClone(get().data);
        const arr = next[section] as any;
        if (!Array.isArray(arr)) return;
        if (oldIndex < 0 || oldIndex >= arr.length || newIndex < 0 || newIndex >= arr.length) return;
        const [moved] = arr.splice(oldIndex, 1);
        arr.splice(newIndex, 0, moved);
        pushHistory(set, get, next);
      },

      undo: () => {
        const { past, data, future } = get();
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        set({
          past: past.slice(0, -1),
          future: [data, ...future].slice(0, 30),
          data: previous,
        });
      },
      redo: () => {
        const { future, data, past } = get();
        if (future.length === 0) return;
        const next = future[0];
        set({
          future: future.slice(1),
          past: [...past, data].slice(-30),
          data: next,
        });
      },
    }),
    {
      name: "resumeforge-store",
      partialize: (s) => ({
        data: s.data,
        template: s.template,
        accentColor: s.accentColor,
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        title: s.title,
        savedId: s.savedId,
        contactLocked: s.contactLocked,
        view: s.view,
      }),
    }
  )
);
