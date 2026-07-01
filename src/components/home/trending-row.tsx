"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { pickName, useTitleLang } from "@/store/title-lang";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Aniwatch-style "Trending" rail: a horizontal scroller of ranked vertical
 * poster cards, each with a large rank number written down its side.
 */
export function TrendingRow() {
  const lang = useTitleLang((s) => s.lang);
  const scroller = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: api.trending,
  });

  function scroll(dir: 1 | -1) {
    scroller.current?.scrollBy({
      left: dir * scroller.current.clientWidth * 0.85,
      behavior: "smooth",
    });
  }

  if (!isLoading && !data?.length) return null;

  return (
    <section className="group/row relative py-4">
      <div className="mb-3 flex items-center justify-between px-4 sm:px-6">
        <h2 className="text-xl font-bold">Trending</h2>
        <div className="hidden gap-1.5 sm:flex">
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="flex size-7 items-center justify-center rounded-md bg-secondary transition hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="flex size-7 items-center justify-center rounded-md bg-secondary transition hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth px-4 sm:px-6"
      >
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-[190px] w-[150px] shrink-0 rounded-lg" />
            ))
          : data!.slice(0, 12).map((a, i) => (
              <Link
                key={a.id}
                href={`/anime/${a.id}`}
                className="group/card flex shrink-0 flex-col"
              >
                {/* rank number (vertical) + poster share one bottom-aligned row */}
                <span className="flex items-end gap-1">
                  <span className="[writing-mode:vertical-lr] rotate-180 pb-1 text-2xl font-extrabold tabular-nums text-muted-foreground/70 transition group-hover/card:text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative block aspect-[2/3] w-[120px] overflow-hidden rounded-lg ring-1 ring-border/40 transition group-hover/card:ring-primary/60">
                    {a.image && (
                      <Image
                        src={a.image}
                        alt={pickName(a, lang)}
                        fill
                        sizes="120px"
                        className="object-cover transition duration-300 group-hover/card:scale-105"
                        unoptimized
                      />
                    )}
                  </span>
                </span>
                <span className="mt-1.5 line-clamp-2 block min-h-[2.5rem] w-[144px] pl-5 text-sm font-medium leading-tight text-foreground/90">
                  {pickName(a, lang)}
                </span>
              </Link>
            ))}
      </div>
    </section>
  );
}
