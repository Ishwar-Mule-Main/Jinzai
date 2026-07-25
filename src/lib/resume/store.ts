"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResumeData, TemplateId } from "./types";
import { emptyResume, sampleResume, uid } from "./sample-data";

interface ResumeState {
  // current editing data
  data: ResumeData;
  template: TemplateId;
  accentColor: string;
  fontFamily: string;
  title: string;
  savedId: string | null;
  // view
  view: "dashboard" | "editor";
  // history for undo/redo
  past: ResumeData[];
  future: ResumeData[];

  setView: (v: "dashboard" | "editor") => void;
  setTemplate: (t: TemplateId) => void;
  setAccentColor: (c: string) => void;
  setFontFamily: (f: string) => void;
  setTitle: (t: string) => void;
  setSavedId: (id: string | null) => void;

  loadSample: () => void;
  clearAll: () => void;
  setData: (d: ResumeData) => void;
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
      title: "Untitled Resume",
      savedId: null,
      view: "dashboard",
      past: [],
      future: [],

      setView: (v) => set({ view: v }),
      setTemplate: (t) => {
        const tplDefaults: Record<TemplateId, { accent: string; font: string }> = {
          modern: { accent: "#0f766e", font: "inter" },
          minimal: { accent: "#1f2937", font: "inter" },
          creative: { accent: "#7c3aed", font: "poppins" },
          classic: { accent: "#1e3a5f", font: "merriweather" },
          executive: { accent: "#92400e", font: "playfair" },
          tech: { accent: "#0ea5e9", font: "jetbrains" },
          academic: { accent: "#1e3a5f", font: "merriweather" },
          compact: { accent: "#be123c", font: "inter" },
        };
        const def = tplDefaults[t];
        set({ template: t, accentColor: def.accent, fontFamily: def.font });
      },
      setAccentColor: (c) => set({ accentColor: c }),
      setFontFamily: (f) => set({ fontFamily: f }),
      setTitle: (t) => set({ title: t }),
      setSavedId: (id) => set({ savedId: id }),

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
      setData: (d) => pushHistory(set, get, d),
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

      reorderSection: (section, oldIndex, newIndex) => {
        const next = structuredClone(get().data);
        const arr = next[section];
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
        title: s.title,
        savedId: s.savedId,
        view: s.view,
      }),
    }
  )
);
