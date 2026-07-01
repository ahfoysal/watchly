"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Captions, ChevronLeft, ChevronRight, Info, Mic, Play, Star } from "lucide-react";
import { api } from "@/lib/api";
import { pickName, useTitleLang } from "@/store/title-lang";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSlider() {
  const lang = useTitleLang((s) => s.lang);
  const { data } = useQuery({ queryKey: ["trending"], queryFn: api.trending });
  const slides = (data ?? []).filter((a) => a.cover).slice(0, 8);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) {
    return <Skeleton className="h-[52vh] min-h-[360px] w-full rounded-none" />;
  }

  const s = slides[Math.min(i, slides.length - 1)];

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="relative mx-auto h-[56vh] min-h-[400px] max-w-[1500px]">
        {/* contained banner art on the right */}
        <div className="absolute inset-y-0 right-0 w-full overflow-hidden lg:w-[64%]">
          {s.cover && (
            <Image
              key={s.id}
              src={s.cover}
              alt={pickName(s, lang)}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent lg:via-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div
          key={s.id}
          className="animate-rise relative z-10 flex h-full max-w-xl flex-col justify-center px-4 sm:px-6"
        >
          <h1 className="line-clamp-2 bg-gradient-to-br from-white to-white/70 bg-clip-text text-3xl font-extrabold leading-tight text-transparent drop-shadow sm:text-5xl">
            {pickName(s, lang)}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {typeof s.rating === "number" && s.rating > 0 && (
              <span className="flex items-center gap-1 font-semibold text-yellow-400">
                <Star className="size-3.5 fill-yellow-400" />
                {(s.rating / 10).toFixed(1)}
              </span>
            )}
            {s.type && (
              <span className="rounded bg-white/15 px-1.5 py-0.5 font-semibold">
                {s.type}
              </span>
            )}
            {s.totalEpisodes ? (
              <span className="flex items-center overflow-hidden rounded">
                <span className="flex items-center gap-1 bg-primary px-1.5 py-0.5 font-bold text-primary-foreground">
                  <Captions className="size-3" />
                  {s.totalEpisodes}
                </span>
                <span className="flex items-center gap-1 bg-amber-400 px-1.5 py-0.5 font-bold text-black">
                  <Mic className="size-3" />
                  {s.totalEpisodes}
                </span>
              </span>
            ) : null}
          </div>

          {s.description && (
            <p className="mt-4 line-clamp-3 text-sm text-foreground/75">
              {s.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <Button
              size="lg"
              className="gap-2 rounded-full"
              nativeButton={false}
              render={<Link href={`/anime/${s.id}`} />}
            >
              <Play className="size-5 fill-current" />
              Play Now
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="size-11 rounded-full p-0"
              nativeButton={false}
              render={<Link href={`/anime/${s.id}`} aria-label="More info" />}
            >
              <Info className="size-5" />
            </Button>
          </div>

          <div className="mt-6 flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-6 bg-primary" : "w-3 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setI((p) => (p - 1 + slides.length) % slides.length)}
        aria-label="Previous"
        className="absolute right-14 bottom-6 z-10 hidden size-10 items-center justify-center rounded-full bg-card/70 text-foreground backdrop-blur transition hover:bg-card sm:flex"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={() => setI((p) => (p + 1) % slides.length)}
        aria-label="Next"
        className="absolute right-3 bottom-6 z-10 hidden size-10 items-center justify-center rounded-full bg-card/70 text-foreground backdrop-blur transition hover:bg-card sm:flex"
      >
        <ChevronRight className="size-5" />
      </button>
    </section>
  );
}
