import "server-only";
import { MANGA, META } from "@consumet/extensions";
import { cached, TTL } from "@/lib/cache";
import type { RawMedia, RawTitle } from "@/lib/provider-types";
import type { AnimeCard, MangaChapter, MangaDetail } from "@/lib/types";

/**
 * Non-anime catalogs: Movies/TV via TMDB metadata, Manga via WeebCentral.
 * Both normalize into the shared AnimeCard shape (with `kind`) so the existing
 * card/grid components can render them.
 */

const tmdb = new META.TMDB();
// WeebCentral is the most reliable manga provider for actual page rendering:
// its search/info/pages all work and its CDN serves images through our image
// proxy (ComicK's CDN is hard Cloudflare-gated and a header-replay proxy can't
// fetch it). Provider images require a Referer, so every image URL we hand to
// the client is wrapped via `proxyImg` to flow through /api/image.
const manga = new MANGA.WeebCentral();

/** Route a provider image URL through our same-origin proxy (adds Referer/UA). */
function proxyImg(url: string | undefined, ref?: string): string | undefined {
  if (!url) return url;
  if (url.startsWith("/")) return url; // already proxied / local
  const u = new URL("/api/image", "http://x");
  u.searchParams.set("url", url);
  if (ref) u.searchParams.set("ref", ref);
  return u.pathname + "?" + u.searchParams.toString();
}

// ---------- Movies / TV (TMDB) ----------

function titleOf(t: string | RawTitle | undefined): string {
  if (!t) return "Untitled";
  if (typeof t === "string") return t;
  return t.english || t.romaji || t.userPreferred || t.native || "Untitled";
}

function movieToCard(r: RawMedia): AnimeCard {
  const kind = /tv/i.test(r.type || "") ? "tv" : "movie";
  return {
    id: String(r.id),
    title: titleOf(r.title),
    image: r.image,
    cover: r.cover,
    // TMDB rating is 0-10; normalize to 0-100 like AniList scores.
    rating: typeof r.rating === "number" ? Math.round(r.rating * 10) : undefined,
    type: kind === "tv" ? "TV" : "MOVIE",
    releaseDate: r.releaseDate ? String(r.releaseDate) : undefined,
    kind,
  };
}

export async function getMoviesTrending(): Promise<AnimeCard[]> {
  return cached("movie:trending", TTL.list, async () => {
    const r = await tmdb.fetchTrending("all", "week", 1);
    return ((r.results ?? []) as unknown as RawMedia[]).map(movieToCard);
  });
}

export async function searchMovies(q: string): Promise<AnimeCard[]> {
  return cached(`movie:search:${q.toLowerCase()}`, TTL.search, async () => {
    const r = await tmdb.search(q);
    return ((r.results ?? []) as unknown as RawMedia[]).map(movieToCard);
  });
}

// ---------- Manga (WeebCentral) ----------

function mangaToCard(r: RawMedia): AnimeCard {
  return {
    id: String(r.id),
    title: titleOf(r.title),
    image: proxyImg(r.image),
    type: "MANGA",
    kind: "manga",
    status: r.status,
  };
}

export async function getMangaPopular(): Promise<AnimeCard[]> {
  return cached("manga:popular", TTL.list, getMangaPopularLive);
}

async function getMangaPopularLive(): Promise<AnimeCard[]> {
  // WeebCentral has no trending endpoint, so we seed-search popular keywords
  // and merge the unique results into a browse feed.
  const seeds = ["one", "demon", "dragon", "hero", "god"];
  const seen = new Set<string>();
  const out: AnimeCard[] = [];
  const batches = await Promise.all(
    seeds.map((s) =>
      manga
        .search(s)
        .then((r) => (r.results ?? []) as unknown as RawMedia[])
        .catch(() => [] as RawMedia[]),
    ),
  );
  for (const batch of batches) {
    for (const r of batch) {
      const card = mangaToCard(r);
      if (!seen.has(card.id)) {
        seen.add(card.id);
        out.push(card);
      }
    }
  }
  return out.slice(0, 30);
}

export async function searchManga(q: string): Promise<AnimeCard[]> {
  return cached(`manga:search:${q.toLowerCase()}`, TTL.search, async () => {
    const r = await manga.search(q);
    return ((r.results ?? []) as unknown as RawMedia[]).map(mangaToCard);
  });
}

export async function getMangaInfo(id: string): Promise<MangaDetail> {
  return cached(`manga:info:${id}`, TTL.info, () => getMangaInfoLive(id));
}

async function getMangaInfoLive(id: string): Promise<MangaDetail> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const info: any = await manga.fetchMangaInfo(id);
  const seenCh = new Set<string>();
  const chapters: MangaChapter[] = (info.chapters ?? [])
    // ComicK serves many languages / scan groups — keep English, one per number.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((c: any) => {
      if (c.lang && c.lang !== "en" && c.lang !== "gb") return false;
      const num = String(c.chapterNumber ?? c.chapter ?? c.id);
      if (seenCh.has(num)) return false;
      seenCh.add(num);
      return true;
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((c: any) => {
      const num = c.chapterNumber ?? c.chapter;
      return {
        id: String(c.id),
        title: num ? `Chapter ${num}` : c.title || "Chapter",
        chapter: num,
        volume: c.volumeNumber ?? c.volume,
      };
    });
  return {
    id: String(info.id ?? id),
    title: titleOf(info.title),
    image: proxyImg(info.image),
    description:
      typeof info.description === "string"
        ? info.description.replace(/<[^>]*>/g, "").trim()
        : undefined,
    genres: Array.isArray(info.genres) ? info.genres : [],
    status: info.status,
    chapters,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pageUrls(pages: any[]): string[] {
  return (pages ?? [])
    .map((p) => {
      const url = p.img || p.page || p.url;
      if (!url) return undefined;
      // Pages carry the Referer the CDN demands (e.g. https://weebcentral.com).
      const ref =
        typeof p.headerForImage === "string"
          ? p.headerForImage
          : p.headerForImage?.Referer;
      return proxyImg(url, ref);
    })
    .filter((u): u is string => Boolean(u));
}

export async function getMangaPages(chapterId: string): Promise<string[]> {
  const serviceUrl = process.env.CONSUMET_API_URL;
  if (serviceUrl) {
    try {
      const u = new URL(`${serviceUrl}/manga/pages`);
      u.searchParams.set("chapterId", chapterId);
      const r = await fetch(u, { signal: AbortSignal.timeout(15000) });
      if (r.ok) return pageUrls(await r.json());
    } catch {
      // service down — fall through to in-process
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pages: any[] = await manga.fetchChapterPages(chapterId);
  return pageUrls(pages);
}
