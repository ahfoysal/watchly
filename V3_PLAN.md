# AnimeFlix V3 — "Fix what the big players get wrong"

> V1 = faithful Aniwave-style clone. V2 = reliable, personalized, account-backed platform
> (Redis, Postgres/Prisma, auth, watchlist, sync, PWA, CI, Sentry).
> **V3 = beat the incumbents on the things users actually complain about.**

This plan maps common, widely-reported limitations of Netflix / Disney+ / Crunchyroll to concrete
features we build. We already have an edge they don't: **one app for anime + movies + TV + manga**.

## Competitor gap → our fix

| Pain point (Netflix / Disney+ / Crunchyroll) | AnimeFlix V3 fix |
|---|---|
| **Opaque recommendations**, "nothing to watch" paralysis | Transparent recs ("Recommended because you watched X"), manual tuning: **More like this / Less like this / Never show**; "Pick for me" roulette; mood & time filters ("under 25 min", "finish this weekend") |
| **Forced autoplay video previews** you can't disable | Off by default; a single toggle. No dark patterns anywhere |
| **Fragmented catalog** across services & media types | One **universal search + library** across anime/movies/TV/manga with typo tolerance & filters; cross-links ("read the manga", "watch the anime") |
| **Weak player**: no speed control, single subtitle track, poor sub styling | Playback speed, **dual subtitles (language-learner mode)**, subtitle font/size/bg styling, audio normalization, thumbnail seek previews, frame step |
| **Inconsistent skip intro/recap**, no auto | Auto/manual **skip intro, recap, and outro**; "next episode" countdown you can cancel; remembered per-show prefs (we have auto-skip/autoplay — extend) |
| **Cluttered "Continue Watching"** you can't curate | One-tap remove, **mark watched/unwatched**, an "Up Next" queue, watch **stats & history** with export |
| **Watch parties paywalled / limited** | **Watch Together** free: synced rooms + chat + reactions |
| **Reviews removed / no community** | Ratings, reviews, public **lists**, follow users, activity feed |
| **No web downloads / weak offline** | PWA **offline downloads** + low-data mode (we have offline shell — extend to media) |
| **Account lock-in, no data control** | One-click **export/delete my data**; import/export watchlist & history |
| **Accessibility & language gaps** | Full a11y (keyboard, screen-reader, captions-always), **RTL + multi-language UI**, EN/JP titles (have) |
| **Rigid, un-customizable home** | **Customizable home**: reorder/hide rows & categories, density (compact/cozy), pin favorites |
| **No new-episode alerts on web** | Follow shows → **web push + email + calendar (.ics) export** for the schedule |

## UI improvements (V3)
- **Command palette (⌘K / Ctrl-K)** — jump to any title, action, or setting; keyboard-first.
- **Customizable home** — drag to reorder rows, hide categories, choose density.
- **Profiles** — multiple taste profiles + optional kids profile with content filtering.
- **Hover/skeleton polish, instant navigation** (RSC streaming + prefetch), low-data image mode.
- **Detail page**: trailers, relations/seasons rail, "where the manga continues", character pages.
- **Settings hub** — player defaults, subtitle styling, autoplay, theme, language, data controls.

## Function improvements (V3)
- **Recommendation engine** — content-based (AniList tags/genres) + behavioral (your history),
  with explicit feedback loops; all local-or-account, fully transparent.
- **Follow + notifications** — new episodes of followed shows via web push / email; `.ics` calendar.
- **Watch Together** — WebSocket sync rooms, chat, emoji reactions, host controls.
- **Reviews & lists** — rate, review, build & share curated lists; follow other users.
- **Stats** — watch time, genres breakdown, streaks; export history (JSON/CSV).
- **Bulletproof content** (carry over from V2 Phase 0) — dedicated Consumet service, source caching,
  Cloudflare-aware proxy, provider health/failover so movie/manga *content* stays up.

## Architecture additions
- **WebSocket service** (watch-together, live notifications) — small Node/Socket.IO service.
- **Web push** (VAPID) + a notifications worker (cron checking followed shows vs the schedule).
- **Search**: typo-tolerant index (Postgres trigram or Meilisearch) over cached metadata.
- **Recommendations**: a scoring module (tags/genres similarity + interaction weights), cached in Redis.
- Everything stays **web-first** (no native app); PWA covers mobile/offline.

## Phased delivery
- **V3.0 — Player & discovery (highest user impact):** speed, dual subs + styling, skip recap/outro,
  next-episode countdown; transparent recs with more/less/never; mood & time filters; command palette.
- **V3.1 — Continue-watching & profiles:** curate/remove, mark watched, Up Next queue, multiple
  profiles, customizable home, settings hub, data export/delete.
- **V3.2 — Social & live:** reviews/ratings/lists/follow, Watch Together, activity feed.
- **V3.3 — Notifications & search:** follow + web push/email + `.ics`; typo-tolerant universal search.
- **V3.4 — Content reliability:** dedicated Consumet service + source caching + provider failover
  (the one infra piece that makes movie/manga playback resilient).

## Guiding principles
1. **No dark patterns** — nothing auto-plays/auto-charges/hides controls; defaults respect the user.
2. **Transparent & user-controlled** — every recommendation is explainable and tunable.
3. **Universal** — anime, movies, TV, manga in one place; the incumbents can't match this.
4. **Web-first & open** — installable PWA, exportable data, no lock-in.

## Success metrics
- Discovery: % sessions that start playback within 60s (beat "nothing to watch").
- Engagement: returning users, follows, watch-together sessions, reviews written.
- Reliability: content availability %, p95 TTFF.
- Trust: data-export usage, zero dark-pattern complaints.
