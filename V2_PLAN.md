# AnimeFlix V2 — Roadmap

> Goal: turn V1 (a faithful Aniwave-style UI clone running on fragile, on-demand
> scrapers with no accounts) into a reliable, personalized, multi-platform
> universal streaming + reading app.

## Where V1 stands

Strong: Aniwave-grade UI, Next 16 / React 19 / Tailwind v4, anime works end-to-end
(AniList metadata + provider scraping + HLS player), continue-watching, sub/dub,
skip-intro, multi-provider, quality menu, episode titles, schedule, A–Z, live search,
EN/JP, categories (Anime/Movies/Manga), rich detail pages.

Honest weaknesses (these are what V2 fixes):
1. **Content is fragile** — everything depends on scrapers/CDNs that go down (movie
   providers 520/522, manga CDN Cloudflare-blocked). When a source blips, the page is empty.
2. **No accounts / no persistence** — continue-watching is localStorage only; nothing syncs.
3. **No caching** — every request re-scrapes / re-queries; slow and hammers providers.
4. **Thin discovery** — no personalization, no real recommendations, no filters/genre pages.
5. **No engineering safety net** — no tests, monitoring, SEO, PWA, or mobile.

## The 5 V2 pillars

> Note: **No login/signup in V2.** The app stays account-free; personalization is
> local (localStorage/IndexedDB), not server accounts.

### Pillar 1 — Bulletproof content layer  ⭐ (the big unlock)
The single highest-impact change. Move scraping/proxying off serverless and make content
*stay available*.
- **Redis cache** (Docker locally / Upstash in prod): cache AniList/TMDB metadata + browse/search
  with TTLs, so a provider outage doesn't break the page. ✅ **Done** (see "Shipped" below).
- **Dedicated API/worker service** (Node on Railway/Fly) running the Consumet library +
  self-hosted `api.consumet.org`. Long-running, can rotate IP/UA, not bound by serverless limits.
- Extend caching to *resolved* stream sources with stale-while-revalidate.
- **Resilient proxy**: m3u8 rewriting (have) + Cloudflare-challenge solving (FlareSolverr /
  headless solver) + referer/UA rotation + segment & image caching → fixes movie streams and
  manga page images.
- **Provider health + failover**: cron health-checks, automatic provider ranking, hot-swap via
  config; surface status in an admin view.

### Pillar 2 — Local personalization (no accounts)
- Keep everything account-free. History, watchlist, and progress live in **localStorage /
  IndexedDB** (continue-watching already does).
- **Local "Because you watched…"**: derive recommendations from local history using AniList
  tags/genres — no server, no login.
- Optional later: export/import profile as a file so users can move data between devices manually.

### Pillar 3 — Pro-grade player & reader
- **Player**: auto-play next, **auto** skip intro/outro, watched markers, remembered
  audio/quality/subtitle prefs per user, PiP/theater, full keyboard control, multi-subtitle +
  styling, Cast/AirPlay, **Watch Together** (synced rooms over WebSocket), offline download (PWA).
- **Manga reader**: paged + webtoon modes, image preloading, zoom, keyboard nav, per-chapter
  progress, working image proxy.

### Pillar 4 — Discovery & content depth
- **Working Movies & TV** via the self-hosted provider (seasons/episodes) + rich TMDB detail
  (cast, trailers, recommendations).
- **Genre pages, advanced filters** (year/season/status/format/sort), seasonal charts, Top 100,
  trending algorithm, schedule **reminders**.
- **Universal search** across all types with filters; reviews/comments.

### Pillar 5 — Engineering, performance & reach
- **Performance**: edge/ISR caching of metadata pages, image optimization, prefetch, RSC streaming.
- **Quality**: Vitest unit tests + Playwright e2e, GitHub Actions CI/CD, Sentry error monitoring,
  PostHog analytics, structured logging.
- **SEO**: SSR metadata, sitemaps, OG images, schema.org.
- **PWA**: installable, offline watchlist, push notifications.
- **Mobile**: Expo/React Native app sharing the V2 API.
- **A11y + i18n.**

## Architecture shift

| | V1 | V2 |
|---|---|---|
| Scraping | Next route handlers, on-demand | Dedicated Node service + self-hosted Consumet |
| Caching | none | **Redis (Docker/Upstash)** ✅ + edge/ISR + segment/image cache |
| State | localStorage | localStorage / IndexedDB (no accounts) |
| Proxy | basic m3u8/CORS | + Cloudflare solver, caching, rotation |
| Deploy | Vercel only | **Docker Compose (web + redis)** ✅ → Vercel/Railway/Fly + Upstash |
| Clients | web | web + PWA + mobile (Expo) |

Why split the backend: scrapers need a long-running, IP-rotating, cacheable environment —
serverless route handlers are the wrong place once reliability matters. (No database — the app
stays account-free.)

## Phased delivery

- **Phase 0 — Reliability foundation:** Redis cache + Docker ✅ **shipped**; next: self-host
  Consumet in a dedicated service, cache resolved sources, add health-checks/failover.
  *Outcome: content stays up.*
- **Phase 1 — Player & reader pro:** autoplay-next, auto-skip, local prefs, watch-together, manga
  reader + image proxy fix.
- **Phase 2 — Discovery:** local recs, genre + filter pages, working Movies/TV, schedule reminders.
- **Phase 3 — Platform:** PWA + push, tests + CI + Sentry/analytics + SEO, Expo mobile app.

## Shipped (this pass)

- **Redis cache** (`src/lib/cache.ts`) wrapping all metadata/browse/search/detail calls with
  per-type TTLs (30m lists, 15m search, 1h detail) and **graceful degradation** (works with no
  Redis). Measured: trending `4.96s → 0.008s` on cache hit.
- **Docker**: `docker-compose.yml` (web + redis) + multi-stage `Dockerfile` (Next standalone) +
  `.dockerignore`. Run: `docker compose up -d redis` (or full stack `docker compose up`).

## Success metrics
- Content availability (% of detail/watch pages that load real content) → target 99%+.
- p95 page load + time-to-first-frame for playback.
- Returning-user rate, watchlist adds, avg session length.
- Test coverage + zero unhandled errors in Sentry.

## Quick wins next (low effort, high signal)
1. ~~Redis cache in front of metadata~~ ✅ done.
2. Auto-play next + auto skip-intro (data already wired) — Phase 1 seed.
3. Cache resolved stream sources (short TTL) so playback survives provider blips.
4. CI (typecheck/lint/build) + Sentry — cheap insurance.
