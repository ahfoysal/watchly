"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Captions,
  Mic,
  MonitorPlay,
} from "lucide-react";
import dynamic from "next/dynamic";
import { api, proxied, progressApi } from "@/lib/api";
import type { AnimeCard, VideoSource } from "@/lib/types";
import { EpisodeList } from "@/components/watch/episode-list";
import { MediaCard } from "@/components/media/media-card";
import { ReviewsSection } from "@/components/detail/reviews-section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Code-split: Vidstack + hls.js are heavy and only needed on the watch page.
const VideoPlayer = dynamic(
  () => import("@/components/player/video-player").then((m) => m.VideoPlayer),
  {
    ssr: false,
    loading: () => <Skeleton className="aspect-video w-full rounded-xl" />,
  },
);
import { useContinueWatching } from "@/store/continue-watching";
import { usePlayerPrefs } from "@/store/player-prefs";
import { useAudioPref } from "@/store/audio-pref";

interface Props {
  id: string;
  ep: string;
  num: number;
  provider?: string;
  dub: boolean;
}

function pickSource(sources: VideoSource[]): VideoSource | undefined {
  if (!sources.length) return undefined;
  // Prefer the highest numeric resolution for the best-looking demo.
  const numeric = sources
    .map((s) => ({ s, n: parseInt(s.quality ?? "", 10) }))
    .filter((x) => !Number.isNaN(x.n))
    .sort((a, b) => b.n - a.n);
  if (numeric.length) return numeric[0].s;
  return sources.find((s) => /default|auto/i.test(s.quality ?? "")) ?? sources[0];
}

function buildHref(
  id: string,
  epId: string,
  epNum: number,
  provider?: string,
  dub?: boolean,
): string {
  let href = `/watch/${id}?ep=${encodeURIComponent(epId)}&num=${epNum}`;
  if (provider) href += `&provider=${encodeURIComponent(provider)}`;
  if (dub) href += `&dub=1`;
  return href;
}

export function WatchView({ id, ep, num, provider, dub }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const upsert = useContinueWatching((s) => s.upsert);
  const saved = useContinueWatching((s) => s.items[id]);
  const [switching, setSwitching] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const autoplayNext = usePlayerPrefs((s) => s.autoplayNext);
  const setAutoplayNext = usePlayerPrefs((s) => s.setAutoplayNext);
  const autoSkipIntro = usePlayerPrefs((s) => s.autoSkipIntro);
  const setAutoSkipIntro = usePlayerPrefs((s) => s.setAutoSkipIntro);
  const setAudio = useAudioPref((s) => s.setAudio);

  const info = useQuery({
    queryKey: ["info", id, provider, dub],
    queryFn: () => api.info(id, provider, dub),
  });
  const providersQ = useQuery({
    queryKey: ["providers"],
    queryFn: api.providers,
    staleTime: Infinity,
  });
  const sources = useQuery({
    queryKey: ["watch", ep, provider],
    queryFn: () => api.watch(ep, provider),
    retry: 1,
  });

  const activeProvider = provider ?? info.data?.provider;

  // Re-resolve the *same episode number* under a different provider or audio
  // track (episode ids are provider/audio-specific) and navigate there.
  const reresolve = useCallback(
    async (key: string, nextProvider?: string, nextDub?: boolean) => {
      if (switching) return;
      const p = nextProvider ?? activeProvider;
      const d = nextDub ?? dub;
      if (nextDub !== undefined) setAudio(nextDub ? "dub" : "sub"); // sync header default
      setSwitching(key);
      setNote(null);
      try {
        const data = await queryClient.fetchQuery({
          queryKey: ["info", id, p, d],
          queryFn: () => api.info(id, p, d),
        });
        const match =
          data.episodes.find((e) => e.number === num) ?? data.episodes[0];
        if (match) router.push(buildHref(id, match.id, match.number, p, d));
        else setNote(`“${key}” isn’t available for this title — try another.`);
      } catch {
        setNote(`“${key}” isn’t available right now — try another.`);
      } finally {
        setSwitching(null);
      }
    },
    [switching, activeProvider, dub, setAudio, queryClient, id, num, router],
  );

  const episodes = info.data?.episodes ?? [];
  const currentIndex = episodes.findIndex((e) => e.id === ep);
  const currentEp = currentIndex >= 0 ? episodes[currentIndex] : undefined;
  const prevEp = currentIndex > 0 ? episodes[currentIndex - 1] : undefined;
  const nextEp =
    currentIndex >= 0 && currentIndex < episodes.length - 1
      ? episodes[currentIndex + 1]
      : undefined;

  // If the provider returns multiple quality renditions, stitch them into a
  // synthetic HLS master playlist (a data: URL) so the player shows a real
  // quality menu instead of locking to a single resolution.
  const playSrc = useMemo(() => {
    const data = sources.data;
    if (!data?.sources?.length) return undefined;
    const ref = data.headers?.Referer;
    const variants = data.sources
      .map((s) => ({ s, n: parseInt(s.quality ?? "", 10) }))
      .filter((x) => !Number.isNaN(x.n))
      .sort((a, b) => a.n - b.n);

    if (variants.length >= 2 && typeof window !== "undefined") {
      const RES: Record<string, [number, number, number]> = {
        "2160": [3840, 2160, 12_000_000],
        "1080": [1920, 1080, 5_000_000],
        "720": [1280, 720, 3_000_000],
        "480": [854, 480, 1_200_000],
        "360": [640, 360, 700_000],
        "240": [426, 240, 400_000],
      };
      const origin = window.location.origin;
      const abs = (u: string) =>
        `${origin}/api/proxy?${new URLSearchParams(ref ? { url: u, ref } : { url: u })}`;
      let m = "#EXTM3U\n#EXT-X-VERSION:3\n";
      for (const { s, n } of variants) {
        const [w, h, bw] = RES[String(n)] ?? [1280, 720, 2_500_000];
        m += `#EXT-X-STREAM-INF:BANDWIDTH=${bw},RESOLUTION=${w}x${h},NAME="${s.quality}"\n${abs(s.url)}\n`;
      }
      return `data:application/vnd.apple.mpegurl;base64,${btoa(m)}`;
    }

    const single = pickSource(data.sources);
    return single ? proxied(single.url, ref) : undefined;
  }, [sources.data]);

  const startTime = saved?.episodeId === ep ? saved.position : 0;

  const handleProgress = useCallback(
    (position: number, duration: number) => {
      const title = info.data?.title ?? "Anime";
      const image = info.data?.image ?? info.data?.cover;
      upsert({
        animeId: id, title, image, provider, dub,
        episodeId: ep, episodeNumber: num, position, duration,
      });
      // Persist to the account too (no-op / 401 when signed out).
      progressApi.save({
        animeId: id, title, image, provider, dub,
        episodeId: ep, episodeNumber: num, position, duration,
      });
    },
    [upsert, id, info.data?.title, info.data?.image, info.data?.cover, provider, dub, ep, num],
  );

  const handlePlay = useCallback(
    () => handleProgress(startTime || 0, 0),
    [handleProgress, startTime],
  );

  const goNext = useCallback(() => {
    if (nextEp) router.push(buildHref(id, nextEp.id, nextEp.number, provider, dub));
  }, [nextEp, router, id, provider, dub]);

  const title = info.data?.title ?? "Loading…";
  const servers = providersQ.data ?? (activeProvider ? [activeProvider] : []);

  return (
    <div className="mx-auto max-w-[1500px] px-3 py-4 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="transition hover:text-primary">Home</Link>
        <span>•</span>
        <Link href={`/anime/${id}`} className="line-clamp-1 max-w-[45vw] transition hover:text-primary">
          {title}
        </Link>
        <span>•</span>
        <span className="text-foreground/80">Episode {num}</span>
      </nav>

      {/* 3-column: episodes · player · detail (hianime layout) */}
      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        {/* Player + servers — center column */}
        <div className="min-w-0 xl:order-2">
          {sources.isLoading || info.isLoading ? (
            <Skeleton className="aspect-video w-full rounded-xl" />
          ) : sources.isError || !playSrc ? (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-black/40 text-center text-muted-foreground">
              <MonitorPlay className="size-8 opacity-60" />
              <p className="text-lg">This episode’s streaming source is unavailable.</p>
              <p className="text-sm">Switch to another server below or try a different episode.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl bg-black shadow-xl shadow-black/40">
              <VideoPlayer
                key={`${ep}-${dub}`}
                src={playSrc}
                title={`${title} — Episode ${num}`}
                poster={info.data?.cover}
                subtitles={sources.data?.subtitles}
                intro={sources.data?.intro}
                outro={sources.data?.outro}
                startTime={startTime}
                onProgress={handleProgress}
                onPlay={handlePlay}
                onEnded={goNext}
              />
            </div>
          )}

          {/* Servers panel — hianime style */}
          <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-border/60">
            {/* watching bar */}
            <div className="flex flex-col gap-3 border-b border-border/60 bg-card/70 p-3 sm:flex-row sm:items-center">
              <div className="flex items-start gap-2 text-sm">
                <Play className="mt-0.5 size-4 shrink-0 fill-primary text-primary" />
                <p className="text-muted-foreground">
                  You are watching{" "}
                  <span className="font-semibold text-foreground">Episode {num}</span>
                  {currentEp?.title ? ` · ${currentEp.title}` : ""}.
                  <span className="hidden sm:inline"> If the current server doesn’t work, try another below.</span>
                </p>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <Button
                  variant="secondary" size="sm" className="gap-1"
                  disabled={!prevEp}
                  onClick={() => prevEp && router.push(buildHref(id, prevEp.id, prevEp.number, provider, dub))}
                >
                  <ChevronLeft className="size-4" /> Prev
                </Button>
                <Button
                  variant="secondary" size="sm" className="gap-1"
                  disabled={!nextEp} onClick={goNext}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            {/* SUB / DUB server rows */}
            <div className="divide-y divide-border/50 bg-background/40">
              <ServerRow
                label="SUB" icon={<Captions className="size-4" />}
                servers={servers} active={!dub} activeProvider={activeProvider}
                switching={switching}
                onPick={(p) => reresolve(`sub:${p}`, p, false)}
                switchKeyPrefix="sub"
              />
              <ServerRow
                label="DUB" icon={<Mic className="size-4" />}
                servers={servers} active={dub} activeProvider={activeProvider}
                switching={switching}
                onPick={(p) => reresolve(`dub:${p}`, p, true)}
                switchKeyPrefix="dub"
              />
            </div>

            {/* preferences */}
            <div className="flex flex-wrap items-center gap-4 border-t border-border/60 bg-card/70 px-3 py-2">
              <Toggle label="Auto Play" on={autoplayNext} onClick={() => setAutoplayNext(!autoplayNext)} />
              <Toggle label="Auto Skip Intro" on={autoSkipIntro} onClick={() => setAutoSkipIntro(!autoSkipIntro)} />
            </div>
          </div>

          {note && <p className="mt-2 text-sm text-primary">{note}</p>}
        </div>

        {/* Loading placeholders for the side columns (keeps the 3-col shape) */}
        {info.isLoading && (
          <>
            <aside className="xl:order-1">
              <div className="flex h-[420px] flex-col gap-2 rounded-xl bg-card/60 p-3 ring-1 ring-border/50 xl:h-[calc(100vh-96px)]">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-8 w-2/3 rounded-md" />
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-md" />
                ))}
              </div>
            </aside>
            <aside className="xl:order-3">
              <div className="space-y-3 rounded-xl bg-card/60 p-3 ring-1 ring-border/50">
                <div className="flex gap-3">
                  <Skeleton className="aspect-[2/3] w-24 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </aside>
          </>
        )}

        {/* Episodes — left column */}
        {info.data && episodes.length > 0 && (
          <aside className="xl:order-1 xl:sticky xl:top-[76px] xl:self-start">
            <div className="flex h-[420px] flex-col rounded-xl bg-card/60 p-3 ring-1 ring-border/50 xl:h-[calc(100vh-96px)]">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-base font-bold">List of episodes</h2>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {episodes.length}
                </span>
              </div>
              <EpisodeList anime={info.data} currentEpisodeId={ep} dub={dub} variant="list" />
            </div>
          </aside>
        )}

        {/* Anime detail — right column */}
        {info.data && (
          <aside className="xl:order-3 xl:sticky xl:top-[76px] xl:self-start">
            <div className="rounded-xl bg-card/60 p-3 ring-1 ring-border/50">
              <div className="flex gap-3">
                {info.data.image && (
                  <Link href={`/anime/${id}`} className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image src={info.data.image} alt={title} fill sizes="96px" className="object-cover" unoptimized />
                  </Link>
                )}
                <div className="min-w-0 flex-1">
                  <Link href={`/anime/${id}`} className="line-clamp-2 font-bold leading-tight transition hover:text-primary">
                    {title}
                  </Link>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                    {typeof info.data.rating === "number" && info.data.rating > 0 && (
                      <Pill>★ {(info.data.rating / 10).toFixed(1)}</Pill>
                    )}
                    {info.data.type && <Pill>{info.data.type}</Pill>}
                    {info.data.totalEpisodes && <Pill>{info.data.totalEpisodes} eps</Pill>}
                  </div>
                </div>
              </div>

              {info.data.description && (
                <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-muted-foreground">
                  {info.data.description}
                </p>
              )}

              <dl className="mt-3 space-y-1.5 text-xs">
                {info.data.status && <Fact k="Status" v={info.data.status} />}
                {(info.data.season || info.data.year) && (
                  <Fact k="Aired" v={[info.data.season, info.data.year].filter(Boolean).join(" ")} />
                )}
                {info.data.duration && <Fact k="Duration" v={`${info.data.duration} min`} />}
                {info.data.studios?.length ? <Fact k="Studios" v={info.data.studios.join(", ")} /> : null}
                {info.data.genres?.length ? <Fact k="Genres" v={info.data.genres.join(", ")} /> : null}
              </dl>

              <Button
                variant="secondary" size="sm" className="mt-3 w-full"
                nativeButton={false} render={<Link href={`/anime/${id}`} />}
              >
                View detail
              </Button>
            </div>
          </aside>
        )}
      </div>

      {/* Lower sections — related, recommendations, comments */}
      {info.data && (
        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-8">
            {info.data.relations && info.data.relations.length > 0 && (
              <MediaGrid title="Related" items={info.data.relations} />
            )}
            <section>
              <SectionHeading>Comments</SectionHeading>
              <ReviewsSection mediaId={id} kind="anime" />
            </section>
          </div>

          {/* Recommended rail */}
          {info.data.recommendations && info.data.recommendations.length > 0 && (
            <aside>
              <SectionHeading>Recommended for you</SectionHeading>
              <div className="grid grid-cols-3 gap-3 xl:grid-cols-2">
                {info.data.recommendations.slice(0, 12).map((a) => (
                  <MediaCard key={a.id} anime={a} />
                ))}
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
      <span className="h-5 w-1 rounded-full bg-primary" />
      {children}
    </h2>
  );
}

function MediaGrid({ title, items }: { title: string; items: AnimeCard[] }) {
  return (
    <section>
      <SectionHeading>{title}</SectionHeading>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {items.slice(0, 12).map((a) => (
          <MediaCard key={a.id} anime={a} />
        ))}
      </div>
    </section>
  );
}

function ServerRow({
  label,
  icon,
  servers,
  active,
  activeProvider,
  switching,
  onPick,
  switchKeyPrefix,
}: {
  label: string;
  icon: React.ReactNode;
  servers: string[];
  active: boolean;
  activeProvider?: string;
  switching: string | null;
  onPick: (provider: string) => void;
  switchKeyPrefix: string;
}) {
  return (
    <div className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center">
      <div
        className={`flex w-16 shrink-0 items-center gap-1.5 text-xs font-bold uppercase ${
          active ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {icon}
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {servers.map((p) => {
          const isActive = active && p === activeProvider;
          const busy = switching === `${switchKeyPrefix}:${p}`;
          return (
            <button
              key={p}
              onClick={() => !isActive && onPick(p)}
              disabled={!!switching}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-60 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/80 hover:text-primary-foreground"
              }`}
            >
              <MonitorPlay className="size-3.5" />
              {p}
              {busy ? " …" : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 font-semibold text-muted-foreground">{k}:</dt>
      <dd className="line-clamp-1 text-foreground/80">{v}</dd>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
      {children}
    </span>
  );
}

function Toggle({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
    >
      {label}
      <span className={`relative h-5 w-9 rounded-full transition ${on ? "bg-primary" : "bg-secondary"}`}>
        <span className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}
