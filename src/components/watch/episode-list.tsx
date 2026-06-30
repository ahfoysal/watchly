"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import type { AnimeDetail, Episode } from "@/lib/types";

const CHUNK = 100;

export function EpisodeList({
  anime,
  currentEpisodeId,
  dub = false,
  variant = "grid",
}: {
  anime: AnimeDetail;
  currentEpisodeId?: string;
  dub?: boolean;
  variant?: "grid" | "list";
}) {
  const ranges = useMemo(() => {
    const out: { label: string; eps: Episode[] }[] = [];
    for (let i = 0; i < anime.episodes.length; i += CHUNK) {
      const slice = anime.episodes.slice(i, i + CHUNK);
      out.push({
        label: `${slice[0].number}-${slice[slice.length - 1].number}`,
        eps: slice,
      });
    }
    return out;
  }, [anime.episodes]);

  // Default to the range containing the current episode.
  const initialRange = useMemo(() => {
    const idx = anime.episodes.findIndex((e) => e.id === currentEpisodeId);
    return idx >= 0 ? Math.floor(idx / CHUNK) : 0;
  }, [anime.episodes, currentEpisodeId]);
  const [range, setRange] = useState(initialRange);

  if (!anime.episodes.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
        No streaming source currently provides episodes for this title. Try another
        server or check back later.
      </div>
    );
  }

  const href = (ep: Episode) =>
    `/watch/${anime.id}?ep=${encodeURIComponent(ep.id)}&num=${ep.number}${
      anime.provider ? `&provider=${encodeURIComponent(anime.provider)}` : ""
    }${dub ? "&dub=1" : ""}`;

  const RangeTabs =
    ranges.length > 1 ? (
      <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
        {ranges.map((r, i) => (
          <button
            key={r.label}
            onClick={() => setRange(i)}
            className={`shrink-0 rounded-md px-3 py-1.5 text-sm transition ${
              i === range
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    ) : null;

  if (variant === "list") {
    return (
      <div className="flex h-full flex-col">
        {RangeTabs}
        <div className="no-scrollbar flex-1 space-y-1 overflow-y-auto pr-1">
          {ranges[range].eps.map((ep) => {
            const active = ep.id === currentEpisodeId;
            return (
              <Link
                key={ep.id}
                href={href(ep)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                    : "hover:bg-secondary/70"
                }`}
              >
                <span className="w-8 shrink-0 font-semibold tabular-nums">
                  {ep.number}
                </span>
                <span className="line-clamp-1 flex-1 text-foreground/80">
                  {ep.title || `Episode ${ep.number}`}
                </span>
                {active && <Play className="size-4 shrink-0 fill-current" />}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      {RangeTabs}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
        {ranges[range].eps.map((ep) => {
          const active = ep.id === currentEpisodeId;
          return (
            <Link
              key={ep.id}
              href={href(ep)}
              title={ep.title || `Episode ${ep.number}`}
              className={`flex h-11 items-center justify-center rounded-md text-sm font-medium transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-primary/80 hover:text-primary-foreground"
              }`}
            >
              {ep.number}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
