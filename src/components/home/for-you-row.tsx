"use client";

import { api } from "@/lib/api";
import { useRecentlyWatched } from "@/store/continue-watching";
import { useHydrated } from "@/lib/use-hydrated";
import { MediaCarousel } from "@/components/media/media-carousel";

/**
 * Transparent recommendations: "Because you watched X" rows seeded from the
 * user's most recent local history, using AniList's per-title recommendations.
 * Hidden titles are filtered automatically by MediaCard.
 */
export function ForYouRow() {
  const hydrated = useHydrated();
  const history = useRecentlyWatched();

  if (!hydrated || history.length === 0) return null;

  const seeds = history.slice(0, 2);

  return (
    <>
      {seeds.map((s, i) => (
        <MediaCarousel
          key={s.animeId}
          index={i}
          title={`Because you watched ${s.title}`}
          queryKey={["for-you", s.animeId]}
          queryFn={() =>
            api
              .info(s.animeId)
              .then((d) =>
                (d.recommendations ?? []).filter((r) => r.id !== s.animeId),
              )
          }
        />
      ))}
    </>
  );
}
