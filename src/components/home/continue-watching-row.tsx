"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { useContinueWatching, useRecentlyWatched } from "@/store/continue-watching";
import { useHydrated } from "@/lib/use-hydrated";

export function ContinueWatchingRow() {
  const items = useRecentlyWatched();
  const remove = useContinueWatching((s) => s.remove);
  const hydrated = useHydrated();

  // localStorage-backed store: avoid SSR/CSR hydration mismatch.
  if (!hydrated || items.length === 0) return null;

  return (
    <section className="py-3">
      <h2 className="mb-3 px-4 text-lg font-bold sm:px-6">Continue Watching</h2>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-background to-transparent sm:w-6" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-background to-transparent sm:w-10" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 sm:px-6">
        {items.map((item) => {
          const pct =
            item.duration > 0
              ? Math.min(100, Math.round((item.position / item.duration) * 100))
              : 0;
          const href = `/watch/${item.animeId}?ep=${encodeURIComponent(
            item.episodeId,
          )}&num=${item.episodeNumber}${
            item.provider ? `&provider=${encodeURIComponent(item.provider)}` : ""
          }${item.dub ? "&dub=1" : ""}`;
          const remaining =
            item.duration > 0
              ? Math.max(0, Math.round((item.duration - item.position) / 60))
              : null;
          return (
            <div key={item.animeId} className="group relative w-[220px] shrink-0">
              <Link href={href} className="block">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted ring-1 ring-border/50">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="220px"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                    <Play className="size-10 fill-white text-white" />
                  </div>
                  {item.dub && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-primary/90 px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      DUB
                    </span>
                  )}
                  {remaining !== null && (
                    <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {remaining}m left
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-white/25">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </Link>
              <button
                onClick={() => remove(item.animeId)}
                aria-label="Remove from Continue Watching"
                className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 opacity-0 transition group-hover:opacity-100"
              >
                <X className="size-3.5 text-white" />
              </button>
              <h3 className="mt-2 line-clamp-1 text-sm font-medium">{item.title}</h3>
              <p className="text-xs text-muted-foreground">Episode {item.episodeNumber}</p>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}
