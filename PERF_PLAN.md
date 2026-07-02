# Performance Plan — kill the cold-scrape wait

The only slow path in Watchly is the **cold `/api/anime/info` scrape (~12–15s)**; every
cached read is ~10ms. This track removes the wait from the critical path.

## Done

- **Stale-while-revalidate cache** (`src/lib/cache.ts`)
  Entries are wrapped `{ __swr, v, f }`. Fresh for the TTL, then served **stale**
  for up to 2 days while a **background refresh** runs (de-duped per key to avoid
  scrape stampedes). Legacy unwrapped entries are served + refreshed too.
  Result: cold 12.3s → **warm 0.01s**; a stale repeat visit is instant and self-heals.

- **Hover prefetch** (`src/components/media/media-card.tsx`)
  Hovering/focusing a card warms the Next route + the detail query
  (`staleTime` bounds it to one prefetch per card / 5 min). A click then feels instant.

- **Cache warming** (`warmAnimeInfo` in `src/lib/consumet.ts`, `GET /api/warm`)
  Pre-resolves detail info for the top trending/popular titles (concurrency 2).
  Meant for a cron every ~20 min. Optional `WARM_SECRET` guard (`?secret=`).

## Remaining (next)

- **Persist resolved info to Postgres** so the cache survives Redis/server restarts
  (Redis is ephemeral). A `CachedInfo` table keyed by id+provider+audio, read-through
  before scraping.
- **Cron wiring** for `/api/warm` (platform cron or a small scheduler) in the deploy.
- **Prefetch on the watch page** for the next episode's sources.
- Measure with the schedule/browse endpoints under load; tune TTLs.
