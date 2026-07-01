"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Captions, Mic, Play, Star } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EpisodeList } from "@/components/watch/episode-list";
import { WatchlistButton } from "@/components/system/watchlist-button";
import { AddToListMenu } from "@/components/system/add-to-list-menu";
import { ReviewsSection } from "@/components/detail/reviews-section";
import { useContinueWatching } from "@/store/continue-watching";
import { pickName, useTitleLang } from "@/store/title-lang";
import { useAudioPref } from "@/store/audio-pref";

export function AnimeDetail({ id }: { id: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["info", id],
    queryFn: () => api.info(id),
  });

  const progress = useContinueWatching((s) => s.items[id]);
  const lang = useTitleLang((s) => s.lang);
  const audio = useAudioPref((s) => s.audio);
  const dub = audio === "dub";
  // Fallback so the "Recommended" rail is never empty (some titles have none).
  const popular = useQuery({
    queryKey: ["popular"],
    queryFn: api.popular,
    staleTime: Infinity,
  });

  if (isLoading) return <DetailSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center text-muted-foreground">
        <p className="text-lg">Couldn’t load this title.</p>
        <Button variant="secondary" nativeButton={false} render={<Link href="/" />}>
          Back home
        </Button>
      </div>
    );
  }

  const name = pickName(data, lang);
  const firstEp = data.episodes[0];
  const resumeEp = progress
    ? data.episodes.find((e) => e.id === progress.episodeId)
    : undefined;
  const playEp = resumeEp ?? firstEp;
  const playHref = playEp
    ? `/watch/${id}?ep=${encodeURIComponent(playEp.id)}&num=${playEp.number}${
        data.provider ? `&provider=${encodeURIComponent(data.provider)}` : ""
      }${dub ? "&dub=1" : ""}`
    : undefined;

  const facts: [string, string | undefined][] = [
    ["Japanese", data.japaneseTitle],
    ["Type", data.type],
    ["Status", data.status],
    ["Aired", [data.season, data.year].filter(Boolean).join(" ") || undefined],
    ["Duration", data.duration ? `${data.duration} min` : undefined],
    ["Episodes", data.totalEpisodes ? String(data.totalEpisodes) : undefined],
    ["Studios", data.studios?.join(", ") || undefined],
    [
      "Score",
      typeof data.rating === "number" && data.rating > 0
        ? `${(data.rating / 10).toFixed(1)} / 10`
        : undefined,
    ],
  ];

  return (
    <div>
      {/* Banner */}
      <div className="relative h-[280px] w-full sm:h-[360px]">
        {data.cover ? (
          <Image src={data.cover} alt="" fill priority className="object-cover" unoptimized />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto -mt-44 max-w-[1500px] px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative mx-auto aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/60 sm:mx-0 sm:w-56">
            {data.image && (
              <Image src={data.image} alt={name} fill className="object-cover" unoptimized />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl">{name}</h1>
            {data.japaneseTitle && (
              <p className="mt-1 text-sm text-muted-foreground">{data.japaneseTitle}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {data.totalEpisodes ? (
                <span className="flex items-center overflow-hidden rounded">
                  <span className="flex items-center gap-1 bg-primary px-1.5 py-0.5 font-bold text-primary-foreground">
                    <Captions className="size-3" />
                    {data.totalEpisodes}
                  </span>
                  <span className="flex items-center gap-1 bg-amber-400 px-1.5 py-0.5 font-bold text-black">
                    <Mic className="size-3" />
                    {data.totalEpisodes}
                  </span>
                </span>
              ) : null}
              {typeof data.rating === "number" && data.rating > 0 && (
                <span className="flex items-center gap-1 font-semibold text-yellow-400">
                  <Star className="size-3.5 fill-yellow-400" />
                  {(data.rating / 10).toFixed(1)}
                </span>
              )}
              {data.type && <span className="rounded bg-white/10 px-1.5 py-0.5 font-semibold">{data.type}</span>}
              {data.duration ? <span className="text-foreground/70">{data.duration}m</span> : null}
              {data.year ? <span className="text-foreground/70">{data.year}</span> : null}
              {data.status && <span className="text-foreground/70">{data.status}</span>}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {data.genres?.map((g) => (
                <Badge key={g} variant="secondary">
                  {g}
                </Badge>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {playHref && (
                <Button size="lg" className="gap-2" nativeButton={false} render={<Link href={playHref} />}>
                  <Play className="size-5 fill-current" />
                  {resumeEp ? `Resume Episode ${resumeEp.number}` : "Watch Now"}
                </Button>
              )}
              <WatchlistButton mediaId={id} kind="anime" title={name} image={data.image} />
              <AddToListMenu mediaId={id} kind="anime" title={name} image={data.image} />
            </div>

            {data.description && (
              <p className="mt-5 line-clamp-4 max-w-3xl text-sm leading-relaxed text-foreground/80">
                {data.description}
              </p>
            )}
          </div>
        </div>

        {/* Body: details · main · recommended (aniwatch 3-column) */}
        <div className="mt-10 grid gap-8 pb-16 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          <aside className="h-fit rounded-xl bg-card/50 p-4 ring-1 ring-border/50 xl:order-1">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Details
            </h2>
            <dl className="space-y-2 text-sm">
              {facts
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <dt className="w-24 shrink-0 text-muted-foreground">{k}</dt>
                    <dd className="flex-1 font-medium">{v}</dd>
                  </div>
                ))}
            </dl>
          </aside>

          <div className="min-w-0 space-y-10 xl:order-2">
            <section>
              <SectionTitle>Episodes</SectionTitle>
              <EpisodeList anime={data} currentEpisodeId={progress?.episodeId} dub={dub} />
            </section>

            {data.characters && data.characters.length > 0 && (
              <section>
                <SectionTitle>Characters & Voice Actors</SectionTitle>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.characters.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 rounded-lg bg-card/50 p-2 ring-1 ring-border/40"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        {c.image && (
                          <Image src={c.image} alt={c.name} fill sizes="48px" className="object-cover" unoptimized />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-semibold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.role}</p>
                      </div>
                      {c.voiceActor && (
                        <p className="line-clamp-1 text-right text-xs text-muted-foreground">
                          {c.voiceActor}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionTitle>Comments</SectionTitle>
              <ReviewsSection mediaId={id} kind="anime" />
            </section>
          </div>

          {/* Recommended rail — right column. When Related is sparse (< 3),
              lead with the fuller Recommended list and drop Related below. */}
          <aside className="space-y-8 xl:order-3">
            {(() => {
              const relatedRail = data.relations && data.relations.length > 0 && (
                <RecoRail key="related" title="Related" items={data.relations} lang={lang} />
              );
              const recRail = (
                <RecoRail
                  key="rec"
                  title="Recommended for you"
                  items={
                    (data.recommendations && data.recommendations.length
                      ? data.recommendations
                      : popular.data ?? []
                    ).slice(0, 10)
                  }
                  lang={lang}
                />
              );
              const relatedSparse = !data.relations || data.relations.length < 3;
              return relatedSparse ? [recRail, relatedRail] : [relatedRail, recRail];
            })()}
          </aside>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
      <span className="h-5 w-1 rounded-full bg-primary" />
      {children}
    </h2>
  );
}

function RecoRail({
  title,
  items,
  lang,
}: {
  title: string;
  items: import("@/lib/types").AnimeCard[];
  lang: "en" | "jp";
}) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold">
        <span className="h-4 w-1 rounded-full bg-primary" />
        {title}
      </h2>
      <div className="divide-y divide-border/40">
        {items.map((a) => (
          <Link
            key={`${a.kind ?? "anime"}-${a.id}`}
            href={a.kind === "manga" ? `/manga/${a.id}` : `/anime/${a.id}`}
            className="group flex gap-3 py-2.5"
          >
            <div className="relative aspect-[2/3] w-12 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-border/40">
              {a.image && (
                <Image src={a.image} alt={pickName(a, lang)} fill sizes="48px" className="object-cover" unoptimized />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium leading-tight transition group-hover:text-primary">
                {pickName(a, lang)}
              </p>
              <p className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                {a.type && <span>{a.type}</span>}
                {typeof a.rating === "number" && a.rating > 0 && (
                  <span>· ★ {(a.rating / 10).toFixed(1)}</span>
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-[280px] w-full rounded-none sm:h-[360px]" />
      <div className="mx-auto -mt-44 flex max-w-[1500px] flex-col gap-6 px-4 sm:flex-row sm:px-6">
        <Skeleton className="mx-auto aspect-[2/3] w-40 shrink-0 rounded-lg sm:mx-0 sm:w-56" />
        <div className="flex-1 space-y-4 pt-44 sm:pt-44">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-24 w-full max-w-3xl" />
        </div>
      </div>
    </div>
  );
}
