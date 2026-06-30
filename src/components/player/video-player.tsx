"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import {
  MediaPlayer,
  MediaProvider,
  Track,
  useMediaRemote,
  type MediaPlayerInstance,
  type MediaTimeUpdateEventDetail,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { useEffect, useRef, useState } from "react";
import { SkipForward, X } from "lucide-react";
import type { Subtitle, TimeRange } from "@/lib/types";
import { usePlayerPrefs } from "@/store/player-prefs";

interface Props {
  src: string;
  title: string;
  poster?: string;
  subtitles?: Subtitle[];
  startTime?: number;
  intro?: TimeRange;
  outro?: TimeRange;
  onProgress?: (position: number, duration: number) => void;
  onPlay?: () => void;
  onEnded?: () => void;
}

// When the provider doesn't supply intro markers, assume a typical ~90s opening.
const FALLBACK_INTRO: TimeRange = { start: 5, end: 90 };

export function VideoPlayer({
  src,
  title,
  poster,
  subtitles = [],
  startTime = 0,
  intro,
  outro,
  onProgress,
  onPlay,
  onEnded,
}: Props) {
  const player = useRef<MediaPlayerInstance>(null);
  const remote = useMediaRemote(player);
  const lastSaved = useRef(0);
  const introSkipped = useRef(false);
  const [time, setTime] = useState(0);
  const autoplayNext = usePlayerPrefs((s) => s.autoplayNext);
  const autoSkipIntro = usePlayerPrefs((s) => s.autoSkipIntro);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Next-episode countdown: tick down then advance; cancellable.
  useEffect(() => {
    if (countdown === null) return;
    const t = setTimeout(() => {
      if (countdown <= 1) {
        onEnded?.();
        setCountdown(null);
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [countdown, onEnded]);

  const effectiveIntro = intro ?? FALLBACK_INTRO;

  function handleTimeUpdate(detail: MediaTimeUpdateEventDetail) {
    const t = detail.currentTime;
    // Update display state only when the whole-second changes.
    setTime((prev) => (Math.floor(prev) === Math.floor(t) ? prev : t));

    // Auto-skip the opening once, if enabled.
    if (
      autoSkipIntro &&
      !introSkipped.current &&
      t >= effectiveIntro.start &&
      t < effectiveIntro.end
    ) {
      introSkipped.current = true;
      remote.seek(effectiveIntro.end);
    }

    const duration = player.current?.duration ?? 0;
    if (onProgress && t - lastSaved.current > 5) {
      lastSaved.current = t;
      onProgress(t, duration);
    }
  }

  const showSkipIntro = time >= effectiveIntro.start && time < effectiveIntro.end;
  const showSkipOutro = !!outro && time >= outro.start && time < outro.end;

  return (
    <div className="relative">
      <MediaPlayer
        ref={player}
        className="aspect-video w-full overflow-hidden rounded-xl ring-1 ring-border/50"
        title={title}
        src={{ src, type: "application/x-mpegurl" }}
        poster={poster}
        crossOrigin
        playsInline
        autoPlay
        currentTime={startTime}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => onPlay?.()}
        onPause={() => {
          const v = player.current;
          if (v && onProgress) onProgress(v.currentTime, v.duration ?? 0);
        }}
        onEnded={() => {
          if (autoplayNext && onEnded) setCountdown(8);
        }}
      >
        <MediaProvider>
          {subtitles.map((s, i) => (
            <Track
              key={`${s.lang}-${i}`}
              src={s.url}
              kind="subtitles"
              label={s.lang}
              language={s.lang}
              default={s.lang.toLowerCase().includes("english")}
            />
          ))}
        </MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>

      {showSkipIntro && (
        <button
          onClick={() => remote.seek(effectiveIntro.end)}
          className="absolute bottom-20 right-4 z-50 flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-semibold text-black shadow-lg transition hover:bg-white"
        >
          <SkipForward className="size-4" />
          Skip Intro
        </button>
      )}
      {showSkipOutro && countdown === null && (
        <button
          onClick={() => (onEnded ? onEnded() : remote.seek(outro!.end))}
          className="absolute bottom-20 right-4 z-50 flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-semibold text-black shadow-lg transition hover:bg-white"
        >
          <SkipForward className="size-4" />
          {onEnded ? "Next Episode" : "Skip Outro"}
        </button>
      )}

      {countdown !== null && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/75 text-center">
          <p className="text-lg font-semibold text-white">
            Next episode in {countdown}s
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setCountdown(null);
                onEnded?.();
              }}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <SkipForward className="size-4" />
              Play Now
            </button>
            <button
              onClick={() => setCountdown(null)}
              className="flex items-center gap-2 rounded-md bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              <X className="size-4" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
