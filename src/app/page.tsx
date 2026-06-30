"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AnimeCard } from "@/lib/types";
import { HeroSlider } from "@/components/home/hero-slider";
import { TopAnime } from "@/components/home/top-anime";
import { MiniColumn } from "@/components/home/mini-list";
import { ScheduleSection } from "@/components/home/schedule";
import { NoticeBar } from "@/components/home/notice-bar";
import { AzBar } from "@/components/home/az-bar";
import { ContinueWatchingRow } from "@/components/home/continue-watching-row";
import { ForYouRow } from "@/components/home/for-you-row";
import { MediaCard } from "@/components/media/media-card";
import { Skeleton } from "@/components/ui/skeleton";

const RU_TABS: { key: string; label: string; fn: () => Promise<AnimeCard[]> }[] = [
  { key: "all", label: "All", fn: () => api.trending() },
  { key: "popular", label: "Popular", fn: () => api.browse("popular", 1, { perPage: 15 }).then((r) => r.items) },
  { key: "newest", label: "Newest", fn: () => api.browse("newest", 1, { perPage: 15 }).then((r) => r.items) },
  { key: "top", label: "Top Rated", fn: () => api.browse("score", 1, { perPage: 15 }).then((r) => r.items) },
  { key: "random", label: "Random", fn: () => api.trending().then((r) => [...r].sort(() => Math.random() - 0.5)) },
];

function RecentlyUpdated() {
  const [tab, setTab] = useState("all");
  const active = RU_TABS.find((t) => t.key === tab)!;
  const { data, isLoading } = useQuery({
    queryKey: ["recent-grid", tab],
    queryFn: active.fn,
  });
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">Recently Updated</h2>
        <div className="no-scrollbar flex gap-1 overflow-x-auto text-sm">
          {RU_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-md px-2.5 py-1 font-medium transition ${
                t.key === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: 15 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </div>
            ))
          : data?.slice(0, 15).map((a) => <MediaCard key={a.id} anime={a} />)}
      </div>
    </div>
  );
}

function CatalogGrid({
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
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {!isLoading && !data?.length ? (
        <p className="py-16 text-center text-muted-foreground">
          Nothing available right now — the provider may be offline. Try again later.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {isLoading
            ? Array.from({ length: 18 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                </div>
              ))
            : data?.map((a) => <MediaCard key={`${a.kind}-${a.id}`} anime={a} />)}
        </div>
      )}
    </div>
  );
}

const KINDS = [
  { key: "all", label: "Home" },
  { key: "anime", label: "Anime" },
  { key: "movies", label: "Movies & TV" },
  { key: "manga", label: "Manga" },
];

export default function HomePage() {
  const [kind, setKind] = useState("all");
  const isAnimeView = kind === "all" || kind === "anime";

  return (
    <div className="pb-6">
      <HeroSlider />
      <div className="mx-auto max-w-7xl">
        <ContinueWatchingRow />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <NoticeBar />
        </div>

        {/* Universal category filter */}
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto border-b border-border/50">
          {KINDS.map((k) => (
            <button
              key={k.key}
              onClick={() => setKind(k.key)}
              className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                k.key === kind
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        {isAnimeView ? (
          <>
            <ForYouRow />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <RecentlyUpdated />
              <TopAnime />
            </div>

            <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              <MiniColumn
                title="New Release"
                queryKey={["mini", "new-release"]}
                queryFn={() =>
                  api.browse("newest", 1, { status: "RELEASING", perPage: 5 }).then((r) => r.items)
                }
              />
              <MiniColumn
                title="New Added"
                queryKey={["mini", "new-added"]}
                queryFn={() => api.browse("newest", 1, { perPage: 5 }).then((r) => r.items)}
              />
              <MiniColumn
                title="Just Completed"
                queryKey={["mini", "completed"]}
                queryFn={() =>
                  api.browse("popular", 1, { status: "FINISHED", perPage: 5 }).then((r) => r.items)
                }
              />
            </div>
          </>
        ) : kind === "movies" ? (
          <CatalogGrid
            title="Trending Movies & TV"
            queryKey={["movie-trending"]}
            queryFn={api.movieTrending}
          />
        ) : (
          <CatalogGrid
            title="Popular Manga"
            queryKey={["manga-popular"]}
            queryFn={api.mangaPopular}
          />
        )}
      </div>

      {isAnimeView && <ScheduleSection />}
      <AzBar />
    </div>
  );
}
