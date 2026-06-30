"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { MediaCard } from "@/components/media/media-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const SORTS = [
  { key: "az", label: "A–Z" },
  { key: "za", label: "Z–A" },
  { key: "popular", label: "Popular" },
  { key: "score", label: "Top Rated" },
  { key: "trending", label: "Trending" },
  { key: "newest", label: "Newest" },
];

export function BrowseView() {
  const router = useRouter();
  const params = useSearchParams();
  const sort = params.get("sort") ?? "az";
  const page = parseInt(params.get("page") ?? "1", 10) || 1;
  const genre = params.get("genre") ?? undefined;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["browse", sort, page, genre ?? ""],
    queryFn: () => api.browse(sort, page, genre ? { genre } : undefined),
    placeholderData: (prev) => prev,
  });

  function go(next: { sort?: string; page?: number }) {
    const s = next.sort ?? sort;
    const p = next.page ?? page;
    const g = genre ? `&genre=${encodeURIComponent(genre)}` : "";
    router.push(`/az?sort=${s}&page=${p}${g}`);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-5 text-2xl font-bold">
        {genre ? `${genre} Anime` : "A–Z List"}
      </h1>

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {SORTS.map((s) => (
          <button
            key={s.key}
            onClick={() => go({ sort: s.key, page: 1 })}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              s.key === sort
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Grid>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>
          ))}
        </Grid>
      ) : !data?.items.length ? (
        <p className="py-24 text-center text-muted-foreground">Nothing to show.</p>
      ) : (
        <div className={isFetching ? "opacity-60 transition" : ""}>
          <Grid>
            {data.items.map((anime) => (
              <MediaCard key={anime.id} anime={anime} />
            ))}
          </Grid>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1 || isFetching}
          onClick={() => go({ page: page - 1 })}
          className="gap-1"
        >
          <ChevronLeft className="size-4" />
          Prev
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button
          variant="secondary"
          size="sm"
          disabled={!data?.hasNextPage || isFetching}
          onClick={() => go({ page: page + 1 })}
          className="gap-1"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {children}
    </div>
  );
}
