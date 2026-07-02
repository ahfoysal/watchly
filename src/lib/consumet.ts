import "server-only";
import { ANIME, META } from "@consumet/extensions";
import { cached, TTL } from "@/lib/cache";
import type { RawEpisode, RawMedia, RawTitle } from "@/lib/provider-types";
import type {
  AnimeCard,
  AnimeDetail,
  Episode,
  WatchSources,
} from "@/lib/types";

/**
 * Self-hosted Consumet data layer.
 *
 * Strategy (see README): AniList provides reliable metadata (trending /
 * popular / search / info), while episode lists + streaming sources require a
 * scraping provider that frequently breaks. We therefore keep a *chain* of
 * providers and fall through to the next one when scraping fails. The chain is
 * env-configurable via CONSUMET_PROVIDERS.
 */

const DEFAULT_CHAIN = ["AnimeUnity", "AnimeSaturn", "Hianime"] as const;

export const PROVIDER_CHAIN: string[] =
  process.env.CONSUMET_PROVIDERS?.split(",")
    .map((p) => p.trim())
    .filter(Boolean) ?? [...DEFAULT_CHAIN];

type AnilistClient = InstanceType<typeof META.Anilist>;

const anilistCache = new Map<string, AnilistClient>();

function anilist(provider: string): AnilistClient {
  let client = anilistCache.get(provider);
  if (!client) {
    const Ctor = (ANIME as Record<string, new () => object>)[provider];
    if (!Ctor) throw new Error(`Unknown Consumet provider: ${provider}`);
    client = new META.Anilist(new Ctor() as never);
    anilistCache.set(provider, client);
  }
  return client;
}

// AniList metadata is provider-independent — any chain entry works.
function meta(): AnilistClient {
  return anilist(PROVIDER_CHAIN[0]);
}

// ---------- normalizers ----------

function pickTitle(t: string | RawTitle | undefined): string {
  if (!t) return "Untitled";
  if (typeof t === "string") return t;
  return t.english || t.romaji || t.userPreferred || t.native || "Untitled";
}

function stripHtml(s?: string): string | undefined {
  return s ? s.replace(/<[^>]*>/g, "").trim() : undefined;
}

function toCard(r: RawMedia): AnimeCard {
  const title = r.title;
  return {
    id: String(r.id),
    title: pickTitle(title),
    titleRomaji:
      typeof title === "object" ? title.romaji || title.native : undefined,
    image: r.image ?? r.coverImage,
    cover: r.cover,
    rating: typeof r.rating === "number" ? r.rating : undefined,
    type: r.type,
    releaseDate: r.releaseDate ? String(r.releaseDate) : undefined,
    status: r.status,
    description: stripHtml(r.description),
    genres: Array.isArray(r.genres) ? r.genres : undefined,
    color: r.color ?? undefined,
    totalEpisodes: typeof r.totalEpisodes === "number" ? r.totalEpisodes : undefined,
  };
}

function toEpisode(e: RawEpisode, i: number): Episode {
  return {
    id: String(e.id),
    number: typeof e.number === "number" ? e.number : i + 1,
    title: e.title || undefined,
    image: e.image || undefined,
    description: e.description || undefined,
  };
}

// ---------- episode titles (Jikan / MyAnimeList) ----------

// Providers return null episode titles, so we enrich from Jikan by MAL id.
// Cache per (malId, page) since switching server/audio re-fetches info.
const titleCache = new Map<string, Map<number, string>>();
const JIKAN_MAX_PAGES = 3; // bound latency for very long series (e.g. One Piece)

async function fetchTitlePage(malId: string, page: number): Promise<Map<number, string>> {
  const key = `${malId}:${page}`;
  const cached = titleCache.get(key);
  if (cached) return cached;

  const map = new Map<number, string>();
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime/${malId}/episodes?page=${page}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (res.ok) {
      const data = await res.json();
      for (const e of data.data ?? []) {
        if (e?.mal_id && e?.title) map.set(Number(e.mal_id), String(e.title));
      }
    }
  } catch {
    // ignore — fall back to "Episode N"
  }
  titleCache.set(key, map);
  return map;
}

async function enrichEpisodeTitles(malId: string, episodes: Episode[]): Promise<void> {
  const pages = Math.min(Math.ceil(episodes.length / 100), JIKAN_MAX_PAGES);
  const merged = new Map<number, string>();
  const maps = await Promise.all(
    Array.from({ length: pages }, (_, i) => fetchTitlePage(malId, i + 1)),
  );
  for (const m of maps) m.forEach((v, k) => merged.set(k, v));
  if (merged.size) {
    for (const ep of episodes) {
      const t = merged.get(ep.number);
      if (t) ep.title = t;
    }
  }
}

// ---------- metadata (reliable) ----------

export async function getTrending(perPage = 24): Promise<AnimeCard[]> {
  return cached(`anime:trending:${perPage}`, TTL.list, async () => {
    const res = await meta().fetchTrendingAnime(1, perPage);
    return (res.results ?? []).map(toCard);
  });
}

export async function getPopular(perPage = 24): Promise<AnimeCard[]> {
  return cached(`anime:popular:${perPage}`, TTL.list, async () => {
    const res = await meta().fetchPopularAnime(1, perPage);
    return (res.results ?? []).map(toCard);
  });
}

/**
 * Pre-resolve detail info for the most-visited titles so the first click is
 * warm (the cold scrape happens off the critical path). Meant to be hit by a
 * cron via /api/warm. Low concurrency to avoid hammering the providers.
 */
export async function warmAnimeInfo(limit = 10): Promise<number> {
  const [t, p] = await Promise.all([
    getTrending(24).catch(() => [] as AnimeCard[]),
    getPopular(24).catch(() => [] as AnimeCard[]),
  ]);
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const a of [...t, ...p]) {
    if (seen.has(a.id)) continue;
    seen.add(a.id);
    ids.push(a.id);
    if (ids.length >= limit) break;
  }
  let cursor = 0;
  let warmed = 0;
  const worker = async () => {
    while (cursor < ids.length) {
      const id = ids[cursor++];
      try {
        await getAnimeInfo(id);
        warmed++;
      } catch {
        // skip titles that fail to resolve
      }
    }
  };
  await Promise.all([worker(), worker()]); // concurrency = 2
  return warmed;
}

/**
 * Lightweight metadata for SEO (title/description/images) — AniList only, so it
 * skips the slow provider episode scrape. Used by generateMetadata.
 */
export async function getAnimeMeta(id: string): Promise<{
  title: string;
  description?: string;
  image?: string;
  cover?: string;
}> {
  return cached(`anime:meta:${id}`, TTL.info, async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const base: any = await meta().fetchAnilistInfoById(id);
    return {
      title: pickTitle(base?.title) || "Anime",
      description:
        typeof base?.description === "string"
          ? base.description.replace(/<[^>]*>/g, "").trim()
          : undefined,
      image: base?.image,
      cover: base?.cover,
    };
  });
}

export async function searchAnime(query: string, perPage = 28): Promise<AnimeCard[]> {
  return cached(`anime:search:${query.toLowerCase()}:${perPage}`, TTL.search, async () => {
    const res = await meta().search(query, 1, perPage);
    return (res.results ?? []).map(toCard);
  });
}

const BROWSE_SORTS: Record<string, string> = {
  az: "TITLE_ROMAJI",
  za: "TITLE_ROMAJI_DESC",
  popular: "POPULARITY_DESC",
  score: "SCORE_DESC",
  trending: "TRENDING_DESC",
  newest: "START_DATE_DESC",
};

export async function browse(
  sort = "az",
  page = 1,
  genre?: string,
  status?: string,
  perPage = 30,
): Promise<{ items: AnimeCard[]; hasNextPage: boolean }> {
  const key = `anime:browse:${sort}:${page}:${genre ?? ""}:${status ?? ""}:${perPage}`;
  return cached(key, TTL.list, async () => {
    const sortVal = BROWSE_SORTS[sort] ?? "TITLE_ROMAJI";
    const res = await meta().advancedSearch(
      undefined,
      "ANIME",
      page,
      perPage,
      undefined,
      [sortVal],
      genre ? [genre] : undefined,
      undefined,
      undefined,
      status,
    );
    return {
      items: (res.results ?? []).map(toCard),
      hasNextPage: !!res.hasNextPage,
    };
  });
}

export async function getByGenre(genre: string, perPage = 24): Promise<AnimeCard[]> {
  return cached(`anime:genre:${genre}:${perPage}`, TTL.list, () => getByGenreLive(genre, perPage));
}

async function getByGenreLive(genre: string, perPage: number): Promise<AnimeCard[]> {
  const res = await meta().advancedSearch(
    undefined,
    "ANIME",
    1,
    perPage,
    undefined,
    ["POPULARITY_DESC"],
    [genre],
  );
  return (res.results ?? []).map(toCard);
}

// ---------- airing schedule (AniList GraphQL, grouped by weekday) ----------

export interface ScheduleItem {
  id: string;
  title: string;
  image?: string;
  episode: number;
  airingAt: number; // unix seconds
  type?: string;
  rating?: number;
}

const ANILIST_GQL = "https://graphql.anilist.co";

export async function getSchedule(): Promise<Record<number, ScheduleItem[]>> {
  return cached("anime:schedule", TTL.schedule, getScheduleLive);
}

async function getScheduleLive(): Promise<Record<number, ScheduleItem[]>> {
  const now = Math.floor(Date.now() / 1000);
  const start = now - 24 * 3600;
  const end = now + 7 * 24 * 3600;
  const query = `query($start:Int,$end:Int,$page:Int){Page(page:$page,perPage:50){pageInfo{hasNextPage}airingSchedules(airingAt_greater:$start,airingAt_lesser:$end,sort:TIME){airingAt episode media{id title{romaji english}coverImage{large}format averageScore isAdult}}}}`;
  const byDay: Record<number, ScheduleItem[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  try {
    let page = 1;
    for (let guard = 0; guard < 6; guard++) {
      const res = await fetch(ANILIST_GQL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query, variables: { start, end, page } }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) break;
      const j = await res.json();
      const sched = j?.data?.Page?.airingSchedules ?? [];
      for (const s of sched) {
        const m = s.media;
        if (!m || m.isAdult) continue;
        const day = new Date(s.airingAt * 1000).getDay();
        byDay[day].push({
          id: String(m.id),
          title: m.title?.english || m.title?.romaji || "Untitled",
          image: m.coverImage?.large,
          episode: s.episode,
          airingAt: s.airingAt,
          type: m.format,
          rating: m.averageScore ?? undefined,
        });
      }
      if (!j?.data?.Page?.pageInfo?.hasNextPage) break;
      page++;
    }
  } catch {
    // schedule unavailable — return whatever we have
  }
  return byDay;
}

// ---------- info + episodes (scraped, with fallback) ----------

/** The list of providers exposed to the UI for manual switching. */
export function getProviders(): string[] {
  return PROVIDER_CHAIN;
}

// Providers whose fetchAnimeInfo paginates episodes, keyed by per-page size.
// Only these run the paging loop; providers that return the full list in one
// call (AnimeSaturn, Hianime, …) are untouched. Add an entry here to extend.
const PAGINATED_PROVIDERS: Record<string, number> = { AnimeUnity: 120 };

type PagingProvider = {
  fetchAnimeInfo: (
    id: string,
    page?: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<{ totalPages?: number; episodes?: RawEpisode[] } & Record<string, any>>;
};

/**
 * If the resolving provider paginates episodes, fetch every page (dynamically,
 * a whole page at a time — not episode-by-episode) and return the full list.
 * Returns the original episodes unchanged for non-paginating providers.
 */
async function expandPaginatedEpisodes(
  provider: string,
  episodes: Episode[],
): Promise<Episode[]> {
  const perPage = PAGINATED_PROVIDERS[provider];
  if (!perPage || episodes.length < perPage || !episodes[0]) return episodes;
  try {
    const providerId = String(episodes[0].id).split("/")[0];
    const Ctor = (ANIME as Record<string, new () => PagingProvider>)[provider];
    if (!Ctor) return episodes;
    const direct = new Ctor();

    const first = await direct.fetchAnimeInfo(providerId, 1);
    const totalPages = Math.min(Number(first?.totalPages) || 1, 60);
    if (totalPages <= 1) return episodes;

    const parts: Episode[][] = [(first.episodes ?? []).map(toEpisode)];
    const rest: number[] = [];
    for (let p = 2; p <= totalPages; p++) rest.push(p);

    // Fetch remaining pages concurrently (bounded) instead of one-by-one.
    const CONCURRENCY = 6;
    for (let i = 0; i < rest.length; i += CONCURRENCY) {
      const batch = rest.slice(i, i + CONCURRENCY);
      const settled = await Promise.all(
        batch.map((p) =>
          direct
            .fetchAnimeInfo(providerId, p)
            .then((r) => (r.episodes ?? []).map(toEpisode))
            .catch(() => [] as Episode[]),
        ),
      );
      parts.push(...settled);
    }
    const all = parts.flat();
    return all.length > episodes.length ? all : episodes;
  } catch {
    return episodes; // keep page-1 episodes on failure
  }
}

export async function getAnimeInfo(
  id: string,
  forceProvider?: string,
  dub = false,
): Promise<AnimeDetail> {
  return cached(
    `anime:info:${id}:${forceProvider ?? "auto"}:${dub ? "dub" : "sub"}`,
    TTL.info,
    () => getAnimeInfoLive(id, forceProvider, dub),
  );
}

async function getAnimeInfoLive(
  id: string,
  forceProvider?: string,
  dub = false,
): Promise<AnimeDetail> {
  let episodes: Episode[] = [];
  let provider: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let base: any;

  // If a specific provider is requested, only try that one; otherwise walk the
  // chain. fetchAnimeInfo returns AniList metadata *and* maps episodes via the
  // provider in one call — but throws entirely if the provider scrape fails.
  const chain =
    forceProvider && PROVIDER_CHAIN.includes(forceProvider)
      ? [forceProvider]
      : PROVIDER_CHAIN;
  for (const name of chain) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const info: any = await anilist(name).fetchAnimeInfo(id, dub);
      if (info?.episodes?.length) {
        base = info;
        episodes = info.episodes.map(toEpisode);
        provider = name;
        break;
      }
      base ??= info; // keep metadata even if this provider had no episodes
    } catch {
      // try next provider
    }
  }

  // Some providers paginate episodes; fetch the remaining pages. Chain-safe:
  // only runs for the provider that actually resolved this title.
  if (provider) episodes = await expandPaginatedEpisodes(provider, episodes);

  // All providers failed to scrape — fall back to AniList metadata only.
  if (!base) {
    base = await meta().fetchAnilistInfoById(id);
  }

  // Providers give numbered-only episodes; enrich with real titles from MAL.
  // Jikan is rate-limited and slow for long series, so cap it: past the budget
  // we return episodes with numbers (titles fill in on the next cached load)
  // instead of blocking the whole info response on title lookups.
  if (base?.malId && episodes.length) {
    await Promise.race([
      enrichEpisodeTitles(String(base.malId), episodes),
      new Promise((r) => setTimeout(r, 4000)),
    ]);
  }

  return {
    ...toCard(base),
    description: base.description?.replace(/<[^>]*>/g, "") ?? undefined,
    genres: base.genres ?? [],
    totalEpisodes: base.totalEpisodes ?? (episodes.length || undefined),
    duration: base.duration ?? undefined,
    season: base.season ?? undefined,
    year: base.startDate?.year ?? undefined,
    studios: base.studios ?? [],
    popularity: base.popularity ?? undefined,
    japaneseTitle:
      typeof base.title === "object" ? base.title?.native : undefined,
    synonyms: Array.isArray(base.synonyms) ? base.synonyms : [],
    color: base.color ?? undefined,
    trailer: base.trailer ? { id: base.trailer.id, site: base.trailer.site } : null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    characters: (base.characters ?? []).slice(0, 12).map((c: any) => ({
      id: String(c.id),
      name: c.name?.full || c.name?.userPreferred || "Unknown",
      role: c.role,
      image: c.image,
      voiceActor: c.voiceActors?.[0]?.name?.full,
    })),
    recommendations: (base.recommendations ?? []).slice(0, 12).map(toCard),
    relations: (base.relations ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((r: any) => /ANIME|MANGA/i.test(r.type || ""))
      .slice(0, 12)
      .map(toCard),
    provider,
    episodes,
  };
}

// ---------- streaming sources (scraped, with fallback) ----------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSources(res: any): WatchSources {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sources: (res.sources ?? []).map((s: any) => ({
      url: s.url,
      quality: s.quality,
      isM3U8: s.isM3U8 ?? s.url?.includes(".m3u8"),
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subtitles: (res.subtitles ?? []).map((t: any) => ({
      url: t.url,
      lang: t.lang ?? "Unknown",
    })),
    headers: res.headers,
    intro:
      res.intro && res.intro.end > 0
        ? { start: res.intro.start ?? 0, end: res.intro.end }
        : undefined,
    outro:
      res.outro && res.outro.end > 0
        ? { start: res.outro.start, end: res.outro.end }
        : undefined,
  };
}

export async function getEpisodeSources(
  episodeId: string,
  provider?: string,
): Promise<WatchSources> {
  // Prefer the dedicated Consumet service (long-running, proxy/Cloudflare-aware)
  // when configured; fall back to in-process scraping if it's unreachable.
  const serviceUrl = process.env.CONSUMET_API_URL;
  if (serviceUrl) {
    try {
      const u = new URL(`${serviceUrl}/anime/sources`);
      u.searchParams.set("ep", episodeId);
      if (provider) u.searchParams.set("provider", provider);
      const r = await fetch(u, { signal: AbortSignal.timeout(15000) });
      if (r.ok) {
        const data = await r.json();
        if (data?.sources?.length) return normalizeSources(data);
      }
    } catch {
      // service down — fall through to in-process
    }
  }

  const chain = provider
    ? [provider, ...PROVIDER_CHAIN.filter((p) => p !== provider)]
    : PROVIDER_CHAIN;

  let lastError: unknown;
  for (const name of chain) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await anilist(name).fetchEpisodeSources(episodeId);
      if (res?.sources?.length) return normalizeSources(res);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("No streaming source available");
}
