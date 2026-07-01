"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Audio = "sub" | "dub";

interface State {
  audio: Audio;
  setAudio: (a: Audio) => void;
}

/**
 * Global SUB/DUB preference, chosen from the header and persisted. It seeds the
 * default audio track when opening any episode: episode links and the detail
 * "Play" button append `&dub=1` when this is set to "dub".
 */
export const useAudioPref = create<State>()(
  persist(
    (set) => ({ audio: "sub", setAudio: (audio) => set({ audio }) }),
    { name: "watchly:audio-pref" },
  ),
);
