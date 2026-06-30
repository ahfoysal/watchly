"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Captions, Mic } from "lucide-react";
import type { AnimeCard } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { pickName, useTitleLang } from "@/store/title-lang";

export function ListRow({ anime, rank }: { anime: AnimeCard; rank?: number }) {
  const lang = useTitleLang((s) => s.lang);
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-secondary/60"
    >
      {rank !== undefined && (
        <span
          className="w-8 shrink-0 text-center text-3xl font-extrabold leading-none"
          style={
            rank <= 3
              ? { WebkitTextStroke: "1.5px var(--primary)", color: "transparent" }
              : { color: "var(--muted-foreground)" }
          }
        >
          {rank}
        </span>
      )}
      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
        {anime.image && (
          <Image src={anime.image} alt="" fill sizes="48px" className="object-cover" unoptimized />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary">
          {pickName(anime, lang)}
        </h4>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          {anime.totalEpisodes ? (
            <span className="flex items-center overflow-hidden rounded">
              <span className="flex items-center gap-0.5 bg-primary px-1 font-semibold text-primary-foreground">
                <Captions className="size-2.5" />
                {anime.totalEpisodes}
              </span>
              <span className="flex items-center gap-0.5 bg-amber-400 px-1 font-semibold text-black">
                <Mic className="size-2.5" />
                {anime.totalEpisodes}
              </span>
            </span>
          ) : null}
          {anime.type && <span>{anime.type}</span>}
        </div>
      </div>
    </Link>
  );
}

export function MiniColumn({
  title,
  queryKey,
  queryFn,
}: {
  title: string;
  queryKey: string[];
  queryFn: () => Promise<AnimeCard[]>;
}) {
  const { data, isLoading } = useQuery({ queryKey, queryFn });
  return (
    <div>
      <h3 className="mb-3 border-l-2 border-primary pl-2 text-sm font-bold uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-1">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-1.5">
                <Skeleton className="h-16 w-12 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))
          : data?.slice(0, 5).map((a) => <ListRow key={a.id} anime={a} />)}
      </div>
    </div>
  );
}
