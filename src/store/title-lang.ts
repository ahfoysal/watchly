"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Lang = "en" | "jp";

interface State {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const useTitleLang = create<State>()(
  persist(
    (set) => ({ lang: "en", setLang: (lang) => set({ lang }) }),
    { name: "watchly:title-lang" },
  ),
);

/** Pick the display title for the current language preference. */
export function pickName(
  a: { title: string; titleRomaji?: string },
  lang: Lang,
): string {
  return lang === "jp" ? a.titleRomaji || a.title : a.title;
}
