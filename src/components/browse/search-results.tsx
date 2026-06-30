"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SearchX } from "lucide-react";
import { api } from "@/lib/api";
import { MediaCard } from "@/components/media/media-card";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchResults() {
  const q = useSearchParams().get("q")?.trim() ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", q],
    queryFn: () => api.search(q),
    enabled: q.length > 0,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">
        {q ? (
          <>
            Results for <span className="text-primary">“{q}”</span>
          </>
        ) : (
          "Search"
        )}
      </h1>

      {isLoading ? (
        <Grid>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>
          ))}
        </Grid>
      ) : !q || isError || !data?.length ? (
        <EmptyState query={q} errored={isError} />
      ) : (
        <Grid>
          {data.map((anime) => (
            <MediaCard key={anime.id} anime={anime} />
          ))}
        </Grid>
      )}
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

function EmptyState({ query, errored }: { query: string; errored?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
      <SearchX className="mb-4 size-12" />
      <p className="text-lg">
        {!query
          ? "Type something to search for anime."
          : errored
            ? "Something went wrong. Try again."
            : `No results for “${query}”.`}
      </p>
    </div>
  );
}
