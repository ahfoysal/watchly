# Project Structure & Conventions

Organized for **reusability, scaling, code-splitting, and type safety**.

## Folders

```
src/
├─ app/                      # Routes only (App Router). Pages stay thin —
│  │                         #   parse params, render a feature component.
│  ├─ api/                   # Route handlers (anime, movie, manga, auth,
│  │                         #   watchlist, progress, proxy)
│  ├─ (pages)/               # anime/[id], movie/[id], manga/[id], watch/[id],
│  │                         #   read/[chapterId], az, search, my-list,
│  │                         #   settings, sign-in, sign-up
│  ├─ manifest.ts icon.tsx   # PWA
│  └─ global-error.tsx       # Sentry-wired root error boundary
│
├─ components/               # Grouped by feature (not one flat folder)
│  ├─ ui/                    # shadcn primitives (button, input, badge, skeleton)
│  ├─ layout/                # site-header, site-footer, providers
│  ├─ media/                 # media-card, media-carousel  (reused everywhere)
│  ├─ home/                  # hero-slider, top-anime, mini-list, schedule,
│  │                         #   notice-bar, az-bar, continue-watching-row
│  ├─ detail/               # anime-detail, manga-detail, manga-reader
│  ├─ watch/                 # watch-view, episode-list
│  ├─ player/                # video-player (Vidstack) — lazy-loaded
│  ├─ browse/                # browse-view, search-results, search-box,
│  │                         #   my-list, settings-view
│  ├─ auth/                  # auth-form
│  └─ system/                # command-palette, progress-sync, sw-register,
│                            #   watchlist-button  (cross-cutting)
│
├─ lib/                      # Framework-agnostic logic & data layer
│  ├─ consumet.ts catalog.ts # provider data layer (server-only)
│  ├─ cache.ts               # Redis cache wrapper (graceful degradation)
│  ├─ prisma.ts auth.ts      # DB + auth (server-only)
│  ├─ auth-client.ts session.ts
│  ├─ api.ts                 # typed client fetchers
│  ├─ types.ts               # shared domain types
│  ├─ provider-types.ts      # typed shapes for raw provider responses
│  └─ use-hydrated.ts utils.ts
│
└─ store/                    # Zustand stores (continue-watching, hidden,
                             #   player-prefs, title-lang)
```

## Conventions

### Reusability
- **Feature folders** keep related components together; shared building blocks
  live in `media/` and `ui/`. A page composes feature components — it never
  contains data logic.
- **One data layer** (`lib/consumet.ts`, `lib/catalog.ts`) normalizes every
  provider into the shared `AnimeCard` / `*Detail` types, so the same `MediaCard`
  renders anime, movies, TV, and manga.

### Scaling
- **Server/client boundary** is explicit: server-only modules import
  `"server-only"`; client modules are `"use client"`. DB/provider code never
  ships to the browser.
- **Caching** sits in front of every metadata call (`cached()` + TTLs), so more
  traffic doesn't mean more scraping.
- Route handlers are stateless; horizontal scaling needs only Redis + Postgres.

### Code splitting
- Heavy, route- or interaction-specific UI is lazy-loaded via `next/dynamic`:
  - `player/video-player` (Vidstack + hls.js) → loads only on the watch page.
  - `system/command-palette` → loads on first ⌘K, not on initial paint.
- The App Router already route-splits each page; dynamic imports trim the rest.

### Type safety
- `tsconfig` runs in **strict** mode; `npm run typecheck` (`tsc --noEmit`) gates CI.
- Loose provider payloads are typed via `lib/provider-types.ts` (`RawMedia`,
  `RawTitle`, `RawEpisode`) instead of `any`; the only casts are a single
  `as unknown as RawMedia[]` at each provider boundary, isolated to the data layer.
- Route params use Next's generated `PageProps<'/route'>` / `RouteContext<'/...'>`.

## Quality gates
```bash
npm run typecheck   # tsc --noEmit (strict)
npm run lint        # eslint (flat config)
npm run build       # production build
```
All three run in CI (`.github/workflows/ci.yml`).
