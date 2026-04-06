import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { Project, WizardState, ProjectStyling, UploadedVideo } from "@/types";
import { demoProjects } from "@/data/demo-projects";

// IndexedDB storage adapter — saves all wizard/project state to IndexedDB
const DB_NAME = "adstacker-db";
const STORE_NAME = "state";

function getIDB(): StateStorage {
  const dbPromise = typeof indexedDB !== "undefined"
    ? new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
          if (!req.result.objectStoreNames.contains(STORE_NAME)) {
            req.result.createObjectStore(STORE_NAME);
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
    : null;

  return {
    getItem: async (name: string): Promise<string | null> => {
      if (!dbPromise) return localStorage.getItem(name);
      try {
        const db = await dbPromise;
        return new Promise((resolve) => {
          const tx = db.transaction(STORE_NAME, "readonly");
          const req = tx.objectStore(STORE_NAME).get(name);
          req.onsuccess = () => resolve(req.result ?? null);
          req.onerror = () => resolve(localStorage.getItem(name));
        });
      } catch {
        return localStorage.getItem(name);
      }
    },
    setItem: async (name: string, value: string): Promise<void> => {
      localStorage.setItem(name, value);
      if (!dbPromise) return;
      try {
        const db = await dbPromise;
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(value, name);
      } catch {}
    },
    removeItem: async (name: string): Promise<void> => {
      localStorage.removeItem(name);
      if (!dbPromise) return;
      try {
        const db = await dbPromise;
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(name);
      } catch {}
    },
  };
}

const defaultStyling: ProjectStyling = {
  hookStart: 0,
  hookDuration: 5,
  hookBodyStart: 0,
  hookBodyDuration: 5,
  hookBodyXPosition: "center",
  hookBodyYPosition: 30,
  ctaStart: 0,
  ctaDuration: 5,
  fontSize: 26,
  fontFamily: "Inter",
  textColor: "#FFFFFF",
  shadowEnabled: true,
  wordsPerLine: 4,
  hookXPosition: "center",
  ctaXPosition: "center",
  subtitleXPosition: "center",
  hookYPosition: 8,
  ctaYPosition: 88,
  subtitleYPosition: 70,
  subtitleFontColor: "#FFFFFF",
  subtitleShadowColor: "rgba(0,0,0,0.5)",
  subtitleShadowBlur: 4,
  subtitleBackgroundColor: "transparent",
};

const defaultWizardState: WizardState = {
  currentStep: 0,
  projectName: "",
  videos: [],
  hooks: [""],
  ctas: [""],
  selectedSubtitleStyles: [],
  hookTemplates: ["ht1"],
  ctaTemplates: ["ct1"],
  selectedLayoutTemplate: "lt1",
  styling: defaultStyling,
  hookColors: ["#FFFFFF"],
  hookFonts: ["Inter"],
  hookFontSizes: [28],
  ctaColors: ["#FFFFFF"],
  ctaFonts: ["Inter"],
  ctaFontSizes: [20],
  hookBoxColors: ["transparent"],
  hookOutlineColors: ["transparent"],
  hookOutlineWidths: [0],
  ctaBoxColors: ["transparent"],
  ctaOutlineColors: ["transparent"],
  ctaOutlineWidths: [0],
  hookBolds: [false],
  ctaBolds: [false],
  hookBodies: [""],
  hookBodyTemplates: ["ht1"],
  hookBodyColors: ["#FFFFFF"],
  hookBodyFonts: ["Inter"],
  hookBodyFontSizes: [22],
  hookBodyBolds: [false],
  hookBodyBoxColors: ["transparent"],
  hookBodyOutlineColors: ["transparent"],
  hookBodyOutlineWidths: [0],
  hookStarts: [0],
  hookEnds: [5],
  hookXPositions: ["center"],
  hookYPositions: [8],
  hookBodyStarts: [0],
  hookBodyEnds: [5],
  hookBodyXPositions: ["center"],
  hookBodyYPositions: [30],
  ctaStarts: [0],
  ctaEnds: [5],
  ctaXPositions: ["center"],
  ctaYPositions: [88],
};

interface ProjectState {
  projects: Project[];
  wizardState: WizardState;
  setWizardStep: (step: number) => void;
  updateWizardState: (updates: Partial<WizardState>) => void;
  resetWizard: () => void;
  createProject: (name: string) => string;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  getProject: (id: string) => Project | undefined;
}

function revokeVideoUrls(videos: UploadedVideo[]) {
  for (const v of videos) {
    if (v.objectUrl.startsWith("blob:")) {
      try { URL.revokeObjectURL(v.objectUrl); } catch {}
    }
    if (v.thumbnailUrl.startsWith("blob:")) {
      try { URL.revokeObjectURL(v.thumbnailUrl); } catch {}
    }
  }
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: demoProjects,
      wizardState: defaultWizardState,
      setWizardStep: (step: number) =>
        set((state) => ({
          wizardState: { ...state.wizardState, currentStep: step },
        })),
      updateWizardState: (updates: Partial<WizardState>) =>
        set((state) => ({
          wizardState: { ...state.wizardState, ...updates },
        })),
      resetWizard: () => {
        const state = get();
        revokeVideoUrls(state.wizardState.videos);
        set({ wizardState: defaultWizardState });
      },
      createProject: (name: string) => {
        const state = get();
        const w = state.wizardState;
        const filledHooks = w.hooks.filter((h) => h.trim());
        const filledBodies = w.hookBodies.filter((b) => b.trim());
        const filledCtas = w.ctas.filter((c) => c.trim());
        const totalVideos =
          w.videos.length *
          filledHooks.length *
          Math.max(filledBodies.length, 1) *
          filledCtas.length *
          w.selectedSubtitleStyles.length;
        const id = `proj-${Date.now()}`;
        const newProject: Project = {
          id,
          name,
          status: "pending",
          videos: w.videos.map((v) => ({
            id: v.id,
            name: v.name,
            url: v.objectUrl,
            thumbnail: v.thumbnailUrl,
            duration: v.duration,
          })),
          hooks: filledHooks,
          ctas: filledCtas,
          subtitleStyles: w.selectedSubtitleStyles,
          hookTemplates: w.hookTemplates.slice(0, filledHooks.length),
          ctaTemplates: w.ctaTemplates.slice(0, filledCtas.length),
          layoutTemplate: w.selectedLayoutTemplate,
          styling: w.styling,
          hookColors: w.hookColors.slice(0, filledHooks.length),
          hookFonts: w.hookFonts.slice(0, filledHooks.length),
          hookFontSizes: w.hookFontSizes.slice(0, filledHooks.length),
          ctaColors: w.ctaColors.slice(0, filledCtas.length),
          ctaFonts: w.ctaFonts.slice(0, filledCtas.length),
          ctaFontSizes: w.ctaFontSizes.slice(0, filledCtas.length),
          hookBoxColors: w.hookBoxColors.slice(0, filledHooks.length),
          hookOutlineColors: w.hookOutlineColors.slice(0, filledHooks.length),
          hookOutlineWidths: w.hookOutlineWidths.slice(0, filledHooks.length),
          ctaBoxColors: w.ctaBoxColors.slice(0, filledCtas.length),
          ctaOutlineColors: w.ctaOutlineColors.slice(0, filledCtas.length),
          ctaOutlineWidths: w.ctaOutlineWidths.slice(0, filledCtas.length),
          hookBolds: w.hookBolds.slice(0, filledHooks.length),
          ctaBolds: w.ctaBolds.slice(0, filledCtas.length),
          hookBodies: w.hookBodies.slice(0, Math.max(filledBodies.length, w.hookBodies.length)),
          hookBodyTemplates: w.hookBodyTemplates.slice(0, w.hookBodies.length),
          hookBodyColors: w.hookBodyColors.slice(0, w.hookBodies.length),
          hookBodyFonts: w.hookBodyFonts.slice(0, w.hookBodies.length),
          hookBodyFontSizes: w.hookBodyFontSizes.slice(0, w.hookBodies.length),
          hookBodyBolds: w.hookBodyBolds.slice(0, w.hookBodies.length),
          hookBodyBoxColors: w.hookBodyBoxColors.slice(0, w.hookBodies.length),
          hookBodyOutlineColors: w.hookBodyOutlineColors.slice(0, w.hookBodies.length),
          hookBodyOutlineWidths: w.hookBodyOutlineWidths.slice(0, w.hookBodies.length),
          hookStarts: w.hookStarts.slice(0, filledHooks.length),
          hookEnds: w.hookEnds.slice(0, filledHooks.length),
          hookXPositions: w.hookXPositions.slice(0, filledHooks.length),
          hookYPositions: w.hookYPositions.slice(0, filledHooks.length),
          hookBodyStarts: w.hookBodyStarts.slice(0, w.hookBodies.length),
          hookBodyEnds: w.hookBodyEnds.slice(0, w.hookBodies.length),
          hookBodyXPositions: w.hookBodyXPositions.slice(0, w.hookBodies.length),
          hookBodyYPositions: w.hookBodyYPositions.slice(0, w.hookBodies.length),
          ctaStarts: w.ctaStarts.slice(0, filledCtas.length),
          ctaEnds: w.ctaEnds.slice(0, filledCtas.length),
          ctaXPositions: w.ctaXPositions.slice(0, filledCtas.length),
          ctaYPositions: w.ctaYPositions.slice(0, filledCtas.length),
          generatedVideos: [],
          totalVideos,
          completedVideos: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: [newProject, ...state.projects],
          wizardState: defaultWizardState,
        }));
        return id;
      },
      deleteProject: (id: string) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      updateProject: (id: string, updates: Partial<Project>) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        })),
      getProject: (id: string) => get().projects.find((p) => p.id === id),
    }),
    {
      name: "adstacker-projects",
      version: 17,
      storage: createJSONStorage(() => getIDB()),
      migrate: (persisted: unknown, version: number) => {
        if (version < 17) {
          return {
            projects: demoProjects,
            wizardState: defaultWizardState,
          };
        }
        return persisted as ProjectState;
      },
    }
  )
);
