"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { progressApi } from "@/lib/api";
import { useContinueWatching } from "@/store/continue-watching";

/** When signed in, merge the user's DB watch-progress into the local store. */
export function ProgressSync() {
  const { data: session } = useSession();
  const hydrate = useContinueWatching((s) => s.hydrate);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    progressApi
      .list()
      .then((rows) => {
        if (cancelled) return;
        hydrate(
          rows.map((r) => ({
            animeId: r.animeId,
            title: r.title,
            image: r.image ?? undefined,
            provider: r.provider ?? undefined,
            dub: r.dub,
            episodeId: r.episodeId,
            episodeNumber: r.episodeNumber,
            position: r.position,
            duration: r.duration,
            updatedAt: new Date(r.updatedAt).getTime(),
          })),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [session, hydrate]);

  return null;
}
