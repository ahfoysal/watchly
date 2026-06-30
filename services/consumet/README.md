# AnimeFlix — Consumet Service

A standalone, long-running provider service. It isolates the fragile scraping
(episode sources, manga pages) from the web app so it can run somewhere that
allows long-lived processes (Railway / Fly / a VPS) — not serverless.

## Why
- Scrapers need a warm, long-running process; route handlers don't fit.
- This is the place to add **Cloudflare-challenge solving** (FlareSolverr),
  **proxy / User-Agent rotation**, and **provider failover** — in one spot.
- The web app calls it over HTTP (`CONSUMET_API_URL`) and falls back to its
  in-process Consumet if the service is unset/unreachable.

## Endpoints
- `GET /health` → `{ ok, providers }`
- `GET /anime/sources?ep=<episodeId>&provider=<name>` → resolved `{ sources, subtitles, intro, outro }` (provider failover, 3-min cache)
- `GET /manga/pages?chapterId=<id>` → page image URLs (10-min cache)

## Run
```bash
# local
cd services/consumet && npm install && npm start   # :4000

# docker
docker compose up -d consumet
```
Then set in the web app's env: `CONSUMET_API_URL=http://localhost:4000`
(or `http://consumet:4000` inside Docker Compose).

## Hardening (production)
- Put a rotating proxy in front (set provider HTTP(S) proxy envs / a proxy pool).
- Add **FlareSolverr** as a sidecar for Cloudflare-gated CDNs (movie providers,
  ComicK images) and point the scraper's requests through it.
- Scale/restart independently of the web app.
