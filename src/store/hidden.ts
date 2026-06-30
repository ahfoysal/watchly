"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  ids: Record<string, true>;
  hide: (key: string) => void;
  unhide: (key: string) => void;
  clear: () => void;
}

export const useHidden = create<State>()(
  persist(
    (set) => ({
      ids: {},
      hide: (key) => set((s) => ({ ids: { ...s.ids, [key]: true } })),
      unhide: (key) =>
        set((s) => {
          const ids = { ...s.ids };
          delete ids[key];
          return { ids };
        }),
      clear: () => set({ ids: {} }),
    }),
    { name: "animeflix:hidden" },
  ),
);

export function hiddenKey(kind: string | undefined, id: string): string {
  return `${kind ?? "anime"}:${id}`;
}
