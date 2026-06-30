"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { api, proxied, progressApi } from "@/lib/api";
import type { VideoSource } from "@/lib/types";
import { EpisodeList } from "@/components/watch/episode-list";
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
    [switching, activeProvider, dub, queryClient, id, num, router],
  );

  const episodes = info.data?.episodes ?? [];
  const currentIndex = episodes.findIndex((e) => e.id === ep);
  const prevEp = currentIndex > 0 ? episodes[currentIndex - 1] : undefined;
  const nextEp =
    currentIndex >= 0 && currentIndex < episodes.length - 1
      ? episodes[currentIndex + 1]
      : undefined;

  const epHref = useCallback(
    (eId: string, eNum: number) => buildHref(id, eId, eNum, provider, dub),
    [id, provider, dub],
  );

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
        animeId: id,
        title,
        image,
        provider,
        dub,
        episodeId: ep,
        episodeNumber: num,
        position,
        duration,
      });
      // Persist to the account too (no-op / 401 when signed out).
      progressApi.save({
        animeId: id,
        title,
        image,
        provider,
        dub,
        episodeId: ep,
        episodeNumber: num,
        position,
        duration,
      });
    },
    [upsert, id, info.data?.title, info.data?.image, info.data?.cover, provider, dub, ep, num],
  );

  // Create the Continue Watching entry as soon as playback starts.
  const handlePlay = useCallback(
    () => handleProgress(startTime || 0, 0),
    [handleProgress, startTime],
  );

  const goNext = useCallback(() => {
    if (nextEp) router.push(epHref(nextEp.id, nextEp.number));
  }, [nextEp, router, epHref]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-3 gap-1"
        nativeButton={false}
        render={<Link href={`/anime/${id}`} />}
      >
        <ArrowLeft className="size-4" />
        {info.data?.title ?? "Back"}
      </Button>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Player column */}
        <div className="min-w-0">
          {sources.isLoading || info.isLoading ? (
            <Skeleton className="aspect-video w-full rounded-xl" />
          ) : sources.isError || !playSrc ? (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border text-center text-muted-foreground">
              <p className="text-lg">This episode’s streaming source is unavailable.</p>
              <p className="text-sm">
                Anime providers go down often — try another server or episode.
              </p>
            </div>
          ) : (
            <VideoPlayer
              key={`${ep}-${dub}`}
              src={playSrc}
              title={`${info.data?.title ?? "Episode"} — Episode ${num}`}
              poster={info.data?.cover}
              subtitles={sources.data?.subtitles}
              intro={sources.data?.intro}
              outro={sources.data?.outro}
              startTime={startTime}
              onProgress={handleProgress}
              onPlay={handlePlay}
              onEnded={goNext}
            />
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-bold sm:text-xl">
              {info.data?.title}{" "}
              <span className="text-muted-foreground">· Episode {num}</span>
            </h1>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={!prevEp}
                onClick={() => prevEp && router.push(epHref(prevEp.id, prevEp.number))}
                className="gap-1"
              >
                <ChevronLeft className="size-4" />
                Prev
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={!nextEp}
                onClick={goNext}
                className="gap-1"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Audio + server controls */}
          <div className="mt-4 flex flex-col gap-3 rounded-lg bg-card/60 p-3 ring-1 ring-border/50 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Audio:</span>
              <div className="inline-flex overflow-hidden rounded-md ring-1 ring-border">
                {[
                  { label: "SUB", val: false },
                  { label: "DUB", val: true },
                ].map(({ label, val }) => (
                  <button
                    key={label}
                    onClick={() => val !== dub && reresolve(label, undefined, val)}
                    disabled={!!switching}
                    className={`px-3 py-1.5 text-sm font-semibold transition disabled:opacity-60 ${
                      val === dub
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                    }`}
                  >
                    {label}
                    {switching === label ? " …" : ""}
                  </button>
                ))}
              </div>
            </div>

            {providersQ.data && providersQ.data.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Server:
                </span>
                {providersQ.data.map((p) => {
                  const active = p === activeProvider;
                  return (
                    <button
                      key={p}
                      onClick={() => !active && reresolve(p, p)}
                      disabled={!!switching}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-60 ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                      }`}
                    >
                      {p}
                      {switching === p ? " …" : ""}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <Toggle
                label="Autoplay"
                on={autoplayNext}
                onClick={() => setAutoplayNext(!autoplayNext)}
              />
              <Toggle
                label="Auto Skip"
                on={autoSkipIntro}
                onClick={() => setAutoSkipIntro(!autoSkipIntro)}
              />
            </div>
          </div>

          {note && <p className="mt-2 text-sm text-primary">{note}</p>}
        </div>

        {/* Episode sidebar */}
        {info.data && episodes.length > 0 && (
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="flex h-[420px] flex-col rounded-xl bg-card/60 p-3 ring-1 ring-border/50 lg:h-[calc(100vh-7rem)]">
              <h2 className="mb-3 px-1 text-base font-bold">
                Episodes{" "}
                <span className="font-normal text-muted-foreground">
                  ({episodes.length})
                </span>
              </h2>
              <EpisodeList
                anime={info.data}
                currentEpisodeId={ep}
                dub={dub}
                variant="list"
              />
            </div>
          </aside>
        )}
      </div>
    </div>
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
      className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-muted-foreground transition hover:text-foreground"
    >
      {label}
      <span
        className={`relative h-5 w-9 rounded-full transition ${on ? "bg-primary" : "bg-secondary"}`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}
