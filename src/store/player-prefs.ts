"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  autoplayNext: boolean;
  autoSkipIntro: boolean;
  setAutoplayNext: (v: boolean) => void;
  setAutoSkipIntro: (v: boolean) => void;
}

export const usePlayerPrefs = create<State>()(
  persist(
    (set) => ({
      autoplayNext: true,
      autoSkipIntro: false,
      setAutoplayNext: (autoplayNext) => set({ autoplayNext }),
      setAutoSkipIntro: (autoSkipIntro) => set({ autoSkipIntro }),
    }),
    { name: "animeflix:player-prefs" },
  ),
);
