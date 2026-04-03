import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, _password: string) => void;
  signup: (name: string, email: string, _password: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, "name" | "email" | "avatar">>) => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
}

// Simple helper to store/retrieve profile image in IndexedDB
const DB_NAME = "adstacker-profile";
const STORE_NAME = "images";

function openProfileDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveProfileImage(dataUrl: string): Promise<void> {
  const db = await openProfileDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(dataUrl, "avatar");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadProfileImage(): Promise<string | null> {
  const db = await openProfileDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get("avatar");
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      login: (email: string) => {
        set({
          isLoggedIn: true,
          user: {
            id: "user-1",
            name: email.split("@")[0],
            email,
            plan: "pro",
            createdAt: new Date().toISOString(),
          },
        });
      },
      signup: (name: string, email: string) => {
        set({
          isLoggedIn: true,
          user: {
            id: "user-1",
            name,
            email,
            plan: "free",
            createdAt: new Date().toISOString(),
          },
        });
      },
      logout: () => {
        set({ isLoggedIn: false, user: null });
      },
      updateProfile: (updates) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, ...updates } });
      },
      changePassword: (_currentPassword: string, _newPassword: string) => {
        // Demo: always succeeds. In production, validate current password server-side.
        return { success: true };
      },
    }),
    { name: "adstacker-auth" }
  )
);
