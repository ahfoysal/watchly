# AnimeFlix

A self-hosted streaming web app for anime, manga, and movie/TV metadata. It pulls catalog
and source data from the open-source [Consumet](https://github.com/consumet/consumet.org)
scraper library (embedded directly in the backend — no external API key), and serves a
full streaming UI with accounts, watchlists, progress sync, reviews, and lists.

## Tech stack

| Area | Technology |
|------|------------|
| Framework | Next.js 16 (App Router, Server Components, Route Handlers, Turbopack) |
| Language | TypeScript (strict) |
| UI library | React 19 |
| Styling | Tailwind CSS v4, `tw-animate-css` |
| Components | shadcn/ui on Base UI primitives, `class-variance-authority`, `clsx`, `tailwind-merge` |
| Icons | lucide-react |
| Data fetching / cache (client) | TanStack Query v5 |
| Client state | Zustand (with `persist`) |
| Data source | `@consumet/extensions` (AniList, AnimeUnity, AnimeSaturn, TMDB, WeebCentral) |
| Video player | Vidstack (`@vidstack/react`) + hls.js |
| Carousels | Embla |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Auth | Better Auth (email/password + optional Google OAuth) |
| Server cache | Redis (ioredis) |
| Error monitoring | Sentry |
| Containers | Docker / Docker Compose |
| Tooling | ESLint 9, Prisma CLI |

## Features

### Anime
- Home page with hero slider, trending, popular, genre rows, weekly schedule, and an A–Z index.
- Search with a debounced command palette (`Cmd/Ctrl + K`) and a dedicated results page.
- Detail page: synopsis, metadata, genres, episode list, and recommendations.
- Watch page with the Vidstack HLS player, episode navigation, and next-episode.
- Sub/dub toggle and multiple streaming providers with automatic failover.
- Full episode lists for providers that paginate (e.g. AnimeUnity's 120-per-page cap is paged through).
- Episode titles enriched from MyAnimeList (Jikan).

### Manga
- Search, detail pages, and chapter lists (via WeebCentral).
- In-app chapter reader.
- An image proxy (`/api/image`) that replays the CDN's required `Referer`/`User-Agent`
  so page scans and covers load in the browser, with an SSRF guard and image caching.

### Movies / TV
- Browse and search movie/TV metadata via TMDB.

### Accounts & social
- Email/password sign-up and login (Better Auth), optional Google OAuth.
- Watchlist saved per account.
- Watch progress synced to the database (continue-watching row on the home page).
- Reviews and star ratings per title.
- User-created public lists and following other users.

### Personalization & UX
- "Continue watching" and "Because you watched" recommendation rows.
- "Not interested" hiding of titles.
- Settings page for preferences.
- Page transitions and staggered row animations.
- Responsive layout with a mobile bottom navigation bar.
- Loading skeletons and graceful empty/error states when a provider is down.

## Architecture

- **Data layer** — `src/lib/consumet.ts` and `src/lib/catalog.ts` wrap `@consumet/extensions`
  in `server-only` modules. All catalog/info/search calls run through Route Handlers under
  `src/app/api/`.
- **Caching** — server responses are cached in Redis (`src/lib/cache.ts`) with per-type TTLs;
  the client layer caches with TanStack Query. Redis is optional and degrades gracefully.
- **Streaming proxy** — `/api/proxy` proxies HLS playlists and rewrites nested URLs to handle
  CORS and `Referer` requirements. `/api/image` does the same for manga images.
- **Auth & data** — Better Auth with the Prisma adapter; PostgreSQL via Prisma. Models:
  `User`, `Session`, `Account`, `Verification`, `WatchlistItem`, `Progress`, `Review`,
  `List`, `ListItem`, `Follow`.
- **Resilience** — providers are env-configurable with failover chains, since scraper sources
  break or rate-limit; failed sources return typed empty states instead of crashing.

## Project structure

```
src/
  app/            App Router pages + API route handlers
  components/     Feature-grouped UI (layout, home, media, detail, watch, player, browse, auth, system)
  lib/            Data layer (consumet, catalog), cache, prisma, auth, api client, types
prisma/           Prisma schema
services/         Standalone Consumet microservice (optional)
docker-compose.yml
```

## Getting started

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env   # set DATABASE_URL, REDIS_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL

# 3. Start Postgres + Redis (or point env at your own)
docker compose up -d postgres redis

# 4. Apply the database schema
npm run db:push

# 5. Run
npm run dev          # http://localhost:3000
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run db:push` | Push the Prisma schema to the database |

## Environment variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string (optional; caching degrades gracefully) |
| `BETTER_AUTH_SECRET` | Better Auth signing secret |
| `BETTER_AUTH_URL` | App base URL |
| `CONSUMET_PROVIDERS` | Ordered anime provider failover chain |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google OAuth |
| `CONSUMET_API_URL` | Optional standalone Consumet service URL |
