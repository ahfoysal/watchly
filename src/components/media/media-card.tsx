"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Captions, EyeOff, Mic, Play } from "lucide-react";
import type { AnimeCard } from "@/lib/types";
import { api } from "@/lib/api";
import { pickName, useTitleLang } from "@/store/title-lang";
import { hiddenKey, useHidden } from "@/store/hidden";

// Mirrors Aniwave's `.ani.poster` card: poster with a bottom meta bar
// (sub/episode pill on the left, type on the right) and the title underneath.
function hrefFor(a: AnimeCard): string {
  if (a.kind === "manga") return `/manga/${a.id}`;
  if (a.kind === "movie" || a.kind === "tv") {
    const p = new URLSearchParams({ type: a.kind, t: a.title });
    if (a.image) p.set("img", a.image);
    return `/movie/${a.id}?${p.toString()}`;
  }
  return `/anime/${a.id}`;
}

export function MediaCard({ anime }: { anime: AnimeCard }) {
  const lang = useTitleLang((s) => s.lang);
  const key = hiddenKey(anime.kind, anime.id);
  const isHidden = useHidden((s) => !!s.ids[key]);
  const hide = useHidden((s) => s.hide);
  const name = pickName(anime, lang);
  const router = useRouter();
  const qc = useQueryClient();
  const href = hrefFor(anime);

  // Warm the route + the (slow) detail fetch on hover, so a click feels
  // instant. staleTime bounds this to one prefetch per card per 5 min.
  function prefetch() {
    router.prefetch(href);
    const isAnime = !anime.kind || anime.kind === "anime";
    if (isAnime) {
      qc.prefetchQuery({
        queryKey: ["info", anime.id],
        queryFn: () => api.info(anime.id),
        staleTime: 5 * 60 * 1000,
      });
    }
  }

  if (isHidden) return null;

  return (
    <Link
      href={href}
      onMouseEnter={prefetch}
      onFocus={prefetch}
      className="group block w-full transition-transform duration-300 ease-out hover:-translate-y-1.5"
      title={name}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border/40 transition duration-300 group-hover:ring-primary/60 group-hover:glow">
        {anime.image ? (
          <Image
            src={anime.image}
            alt={name}
            fill
            sizes="(max-width: 640px) 40vw, 180px"
            className="object-cover transition duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center p-2 text-center text-xs text-muted-foreground">
            {name}
          </div>
        )}

        {/* hover play */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <Play className="size-5 fill-current" />
          </span>
        </div>

        {/* not interested */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            hide(key);
          }}
          aria-label="Not interested"
          title="Not interested"
          className="absolute left-1.5 top-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur transition hover:bg-black/90 group-hover:opacity-100"
        >
          <EyeOff className="size-3.5" />
        </button>

        {/* bottom meta bar */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/90 via-black/30 to-transparent px-1.5 pb-1.5 pt-7">
          <div className="flex items-center gap-0.5">
            {anime.totalEpisodes ? (
              <>
                <span className="flex items-center gap-0.5 rounded-l-[3px] bg-primary px-1 py-px text-[10px] font-bold leading-none text-primary-foreground">
                  <Captions className="size-2.5" />
                  {anime.totalEpisodes}
                </span>
                <span className="flex items-center gap-0.5 rounded-r-[3px] bg-amber-400 px-1 py-px text-[10px] font-bold leading-none text-black">
                  <Mic className="size-2.5" />
                  {anime.totalEpisodes}
                </span>
              </>
            ) : null}
          </div>
          {anime.type && (
            <span className="text-[10px] font-bold uppercase text-white/90">
              {anime.type}
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-1.5 line-clamp-1 text-sm font-semibold text-foreground/90 transition group-hover:text-primary">
        {name}
      </h3>
    </Link>
  );
}
