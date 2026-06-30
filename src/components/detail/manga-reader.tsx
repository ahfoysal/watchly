"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function MangaReader({ chapterId }: { chapterId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["manga-read", chapterId],
    queryFn: () => api.mangaRead(chapterId),
  });

  return (
    <div className="mx-auto max-w-3xl px-2 py-4">
      <Button
        variant="ghost"
        size="sm"
        className="mb-3 gap-1"
        nativeButton={false}
        render={<Link href="/" />}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      {isLoading ? (
        <div className="space-y-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="mx-auto h-[80vh] w-full" />
          ))}
        </div>
      ) : !data?.length ? (
        <p className="py-20 text-center text-muted-foreground">
          No pages available for this chapter.
        </p>
      ) : (
        <div className="flex flex-col items-center">
          <p className="mb-3 rounded-md bg-secondary/60 px-3 py-2 text-center text-xs text-muted-foreground">
            Pages are served by the source CDN. If they don’t appear, the provider
            is rate-limiting external access — try again later.
          </p>
          {data.map((src, i) => (
            // Manga pages have varied dimensions; a plain <img> is simplest.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`Page ${i + 1}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
