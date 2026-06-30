# AnimeFlix — Plan & Progress

Status: **working end-to-end locally.** Nothing committed — this doc tracks the plan and what's done.

## Context

Rewrite of an old 2022 project (`../Anime--Site`, Create React App) into a modern, self-contained
stack. The original depended on an external, now-dying Consumet API instance. This version embeds
the open-source **Consumet extensions library** (`@consumet/extensions`) directly in the app's own
backend — no API key, no signup, no external service to rot. (Per the
[Consumet docs](https://docs.consumet.org/), we use the **library/extension**, not the deprecated
hosted REST API.)

## Decisions

| Topic | Decision |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript strict |
| Data engine | `@consumet/extensions` inside Next.js Route Handlers (`runtime = 'nodejs'`) |
| Metadata source | AniList (trending / popular / search / info) — reliable |
| Streaming source | Consumet provider, **multi-provider with fallback chain** |
| Data fetching | TanStack Query v5 |
| Styling | Tailwind v4 + shadcn/ui (Base UI) |
| Video | Vidstack + hls.js |
| State | Zustand (persisted continue-watching) |
| Auth | Deferred for v1 (browse/watch needs no login) |
| Scope | Anime MVP (movies/TV is a future add the architecture supports) |

## Architecture

```
Browser ──► /api/anime/* (Route Handlers) ──► @consumet/extensions
                                               ├─ AniList  → metadata
                                               └─ provider → episodes + HLS sources
        ◄── /api/proxy?url=… ◄── HLS playlist + segments (CORS + Referer + URL rewrite)
```

Key files:
- `src/lib/consumet.ts` — the data engine: provider chain, normalizers, multi-provider info.
- `src/app/api/anime/*` — trending, popular, genre, search, info/[id], watch, providers.
- `src/app/api/proxy/route.ts` — HLS proxy (rewrites playlists/segments, adds referer/CORS).
- `src/components/*` — hero, carousels, cards, video player, episode list, provider switcher.
- `src/store/continue-watching.ts` — Zustand persisted progress.

## Multi-provider (new)

Anime scrapers break often, so providers are a **chain** (`CONSUMET_PROVIDERS`, default
`AnimeUnity,AnimeSaturn,Hianime`):
- **Metadata** is provider-independent (AniList) — always works.
- **Episodes/sources** try each provider until one responds.
- The **watch page** has a **Server selector**: switching re-resolves the *same episode number* on
  the chosen provider (episode ids are provider-specific) and navigates there.
- `/api/anime/info/[id]?provider=X` forces a specific provider; `/api/anime/providers` lists them.

Verified: `AnimeUnity` → One Piece = 120 eps, `AnimeSaturn` → 1168 eps — switching changes source.

## What's done

- [x] Scaffold (Next 16 / React 19 / TS / Tailwind v4 / shadcn)
- [x] Consumet data layer + all API routes + HLS proxy (verified: playlist + AES key + segments)
- [x] Home (hero + trending/popular/genre carousels, skeletons, graceful empty rows)
- [x] Search page
- [x] **A–Z List / Browse page** (`/az`) — alphabetical grid with A‑Z / Z‑A / Popular / Top Rated /
      Trending / Newest sorts + pagination (AniList has no real "starts-with", so this is true
      alphabetical sort rather than per-letter tabs)
- [x] Anime detail page (synopsis, metadata, paginated episode grid)
- [x] Watch page with Vidstack HLS player, prev/next, episode list
- [x] **Multi-provider server switcher**
- [x] **Skip Intro / Skip Outro** — uses provider intro/outro markers when present (HiAnime/Zoro),
      with a ~90s heuristic fallback so it works even when markers are missing
- [x] **Sub / Dub toggle** — `?dub` flows through info → episodes; watch page has a SUB/DUB switch
      that re-resolves the same episode number (shows a note if an audio track isn't available)
- [x] Continue-watching — persisted; **entry created the moment playback starts**, also saved on
      pause/progress/ended; resume keeps provider + audio; row shows progress bar, "Xm left", DUB badge
- [x] **Multi-quality HLS** — when the provider returns several renditions (480/720/1080…), they're
      stitched into a synthetic HLS master playlist (data: URL) so the player gets a real quality menu
- [x] **Aniwave-style UI** — near-black (#0e0e0e) + purple accent (#8c5ece); centered rounded search;
      cards with green episode/sub pills; watch page two-column with a scrollable **episode sidebar**
      (range tabs + active highlight) showing **real episode titles** (enriched from Jikan/MAL)
- [x] **Full Aniwave landing page** — hero slider (auto-rotating, dots), Recently Updated grid,
      Top Anime ranked sidebar (Day/Week/Month), New Release / New Added / Just Completed columns,
      **Estimated Schedule** with weekday tabs (real AniList airing data), share/notice bar,
      A–Z letter bar, footer; header gains a working **Random** button
- [x] **Live search suggestions** — debounced dropdown with poster/rating/type/year, keyboard nav
      (↑↓/↵/esc), and "View all"; Nunito font + Aniwave purple CC pills + solid header to match
- [x] README + screenshots (`docs/`) + `.env.example`

## Verification

- `npm run build` ✅, `npm run lint` ✅, `npm run typecheck` ✅ — all clean.
- Playwright walkthrough: Home (7 rows) → detail (101 episode links) → search (results) → **watch
  plays real 1080p HLS** (`readyState=4`, time advancing, segments via proxy), zero console errors.

- [x] **Universal categories** — unified home with a type filter (Home / Anime / Movies & TV /
      Manga). Movies & TV browse/search via **TMDB** (no key); Manga browse/search/detail via
      **ComicK**. Cards route by `kind`; new routes `/movie/[id]`, `/manga/[id]`, `/read/[chapterId]`.

## Universal categories — what works vs blocked (provider status)

- **Anime** — full: browse + watch.
- **Movies & TV** — browse + search work (TMDB metadata). **Detail + playback are down**: all
  Consumet movie providers (FlixHQ/Goku/SFlix/HiMovies) return 520/522. `/movie/[id]` shows an
  honest notice. Will work when a provider recovers.
- **Manga** — browse + search + detail (title, synopsis, chapters) work (ComicK). **Reading page
  images are blocked** by the ComicK CDN's Cloudflare/token protection (MangaDex returns 0 pages via
  the lib). The reader is built and shows a graceful notice; pages render only if the CDN serves the
  request.

## Caveats / notes

- Today only **AnimeUnity** (Italian subs) + **AnimeSaturn** are healthy; HiAnime/AnimePahe/AnimeKai
  are 500-ing upstream. Provider chain is env-swappable — when HiAnime recovers, English subs.
- The old `../Anime--Site` is left untouched as reference.

## Not done yet / future

- Auth.js login + cloud-synced watchlist
- Movies / TV (add `/api/movie/*` + routes; architecture supports it)
- Deploy to Vercel for a live link
- Commit + push to a fresh GitHub repo (intentionally not done)

## Run it

```bash
cd animeflix
npm install
npm run dev      # http://localhost:3000
```
