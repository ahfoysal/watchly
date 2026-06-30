"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AnimeCard } from "@/lib/types";
import { MediaCard } from "@/components/media/media-card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  title: string;
  queryKey: string[];
  queryFn: () => Promise<AnimeCard[]>;
  /** Row position, used to stagger the entrance animation. */
  index?: number;
}

export function MediaCarousel({ title, queryKey, queryFn, index = 0 }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useQuery({ queryKey, queryFn });

  function scroll(dir: 1 | -1) {
    scroller.current?.scrollBy({
      left: dir * scroller.current.clientWidth * 0.85,
      behavior: "smooth",
    });
  }

  // Graceful degradation: hide the whole row if it errored or came back empty.
  if (!isLoading && (isError || !data?.length)) return null;

  return (
    <section
      className="group/row animate-rise relative py-3"
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
    >
      <h2 className="mb-3 px-4 text-lg font-bold sm:px-6">{title}</h2>

      <div className="relative">
        {/* edge fades so cards don't hard-cut at the screen edge */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-background to-transparent sm:w-6" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-background to-transparent sm:w-10" />

        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="absolute left-0 top-0 z-20 hidden h-full w-12 items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 transition group-hover/row:opacity-100 sm:flex"
        >
          <ChevronLeft className="size-7" />
        </button>

        <div
          ref={scroller}
          className="no-scrollbar flex snap-x gap-3 overflow-x-auto scroll-smooth px-4 sm:px-6"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[120px] shrink-0 sm:w-[160px]">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                </div>
              ))
            : data!.map((anime) => (
                <div
                  key={anime.id}
                  className="w-[120px] shrink-0 snap-start sm:w-[160px]"
                >
                  <MediaCard anime={anime} />
                </div>
              ))}
        </div>

        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="absolute right-0 top-0 z-20 hidden h-full w-12 items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 transition group-hover/row:opacity-100 sm:flex"
        >
          <ChevronRight className="size-7" />
        </button>
      </div>
    </section>
  );
}
