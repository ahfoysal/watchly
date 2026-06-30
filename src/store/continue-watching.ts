"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

export interface WatchProgress {
  animeId: string;
  title: string;
  image?: string;
  provider?: string;
  episodeId: string;
  episodeNumber: number;
  dub?: boolean;
  /** Playback position in seconds. */
  position: number;
  /** Total duration in seconds (0 if unknown). */
  duration: number;
  updatedAt: number;
}

interface State {
  items: Record<string, WatchProgress>;
  upsert: (p: Omit<WatchProgress, "updatedAt">) => void;
  remove: (animeId: string) => void;
  clearAll: () => void;
  get: (animeId: string) => WatchProgress | undefined;
  /** Merge server rows in, keeping the most recently updated per anime. */
  hydrate: (rows: WatchProgress[]) => void;
}

export const useContinueWatching = create<State>()(
  persist(
    (set, get) => ({
      items: {},
      upsert: (p) =>
        set((s) => ({
          items: { ...s.items, [p.animeId]: { ...p, updatedAt: Date.now() } },
        })),
      remove: (animeId) =>
        set((s) => {
          const items = { ...s.items };
          delete items[animeId];
          return { items };
        }),
      clearAll: () => set({ items: {} }),
      get: (animeId) => get().items[animeId],
      hydrate: (rows) =>
        set((s) => {
          const items = { ...s.items };
          for (const r of rows) {
            const existing = items[r.animeId];
            if (!existing || r.updatedAt > existing.updatedAt) items[r.animeId] = r;
          }
          return { items };
        }),
    }),
    { name: "animeflix:continue-watching" },
  ),
);

/** Most-recently-watched first. `useShallow` keeps the derived array stable. */
export function useRecentlyWatched(): WatchProgress[] {
  return useContinueWatching(
    useShallow((s) =>
      Object.values(s.items).sort((a, b) => b.updatedAt - a.updatedAt),
    ),
  );
}
