"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WatchlistButton } from "@/components/system/watchlist-button";

export function MangaDetail({ id }: { id: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["manga-info", id],
    queryFn: () => api.mangaInfo(id),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          <Skeleton className="mx-auto aspect-[2/3] w-44 rounded-lg sm:mx-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground">
        <p>Couldn’t load this manga.</p>
        <Button variant="secondary" nativeButton={false} render={<Link href="/" />}>
          Back home
        </Button>
      </div>
    );
  }

  const firstChapter = data.chapters[data.chapters.length - 1];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative mx-auto aspect-[2/3] w-44 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/60 sm:mx-0">
          {data.image && (
            <Image src={data.image} alt={data.title} fill className="object-cover" unoptimized />
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-extrabold sm:text-3xl">{data.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">MANGA</Badge>
            {data.status && <span>{data.status}</span>}
            <span>{data.chapters.length} chapters</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.genres?.slice(0, 8).map((g) => (
              <Badge key={g} variant="secondary">
                {g}
              </Badge>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {firstChapter && (
              <Button
                className="gap-2"
                nativeButton={false}
                render={<Link href={`/read/${encodeURIComponent(firstChapter.id)}`} />}
              >
                <BookOpen className="size-4" />
                Read First Chapter
              </Button>
            )}
            <WatchlistButton mediaId={data.id} kind="manga" title={data.title} image={data.image} />
          </div>
          {data.description && (
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-foreground/80">
              {data.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold">Chapters</h2>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {data.chapters.map((c) => (
            <Link
              key={c.id}
              href={`/read/${encodeURIComponent(c.id)}`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-secondary/70"
            >
              <BookOpen className="size-4 shrink-0 text-muted-foreground" />
              <span className="line-clamp-1">{c.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
