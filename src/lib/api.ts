import type {
  AnimeCard,
  AnimeDetail,
  MangaDetail,
  WatchSources,
} from "@/lib/types";

export interface BrowseResult {
  items: AnimeCard[];
  hasNextPage: boolean;
}

export interface ScheduleItem {
  id: string;
  title: string;
  image?: string;
  episode: number;
  airingAt: number;
  type?: string;
  rating?: number;
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  trending: () => getJSON<AnimeCard[]>("/api/anime/trending"),
  popular: () => getJSON<AnimeCard[]>("/api/anime/popular"),
  genre: (g: string) => getJSON<AnimeCard[]>(`/api/anime/genre?g=${encodeURIComponent(g)}`),
  search: (q: string) => getJSON<AnimeCard[]>(`/api/anime/search?q=${encodeURIComponent(q)}`),
  providers: () => getJSON<string[]>("/api/anime/providers"),
  browse: (
    sort: string,
    page: number,
    opts?: { genre?: string; status?: string; perPage?: number },
  ) => {
    const u = new URLSearchParams({ sort, page: String(page) });
    if (opts?.genre) u.set("genre", opts.genre);
    if (opts?.status) u.set("status", opts.status);
    if (opts?.perPage) u.set("perPage", String(opts.perPage));
    return getJSON<BrowseResult>(`/api/anime/browse?${u.toString()}`);
  },
  schedule: () => getJSON<Record<string, ScheduleItem[]>>("/api/anime/schedule"),

  // Movies / TV (TMDB metadata)
  movieTrending: () => getJSON<AnimeCard[]>("/api/movie/trending"),
  movieSearch: (q: string) => getJSON<AnimeCard[]>(`/api/movie/search?q=${encodeURIComponent(q)}`),

  // Manga (MangaDex)
  mangaPopular: () => getJSON<AnimeCard[]>("/api/manga/popular"),
  mangaSearch: (q: string) => getJSON<AnimeCard[]>(`/api/manga/search?q=${encodeURIComponent(q)}`),
  mangaInfo: (id: string) => getJSON<MangaDetail>(`/api/manga/info/${id}`),
  mangaRead: (chapterId: string) => getJSON<string[]>(`/api/manga/read/${encodeURIComponent(chapterId)}`),
  info: (id: string, provider?: string, dub?: boolean) => {
    const u = new URLSearchParams();
    if (provider) u.set("provider", provider);
    if (dub) u.set("dub", "1");
    const qs = u.toString();
    return getJSON<AnimeDetail>(`/api/anime/info/${id}${qs ? `?${qs}` : ""}`);
  },
  watch: (ep: string, provider?: string) =>
    getJSON<WatchSources>(
      `/api/anime/watch?ep=${encodeURIComponent(ep)}${
        provider ? `&provider=${encodeURIComponent(provider)}` : ""
      }`,
    ),
};

export interface ReviewSummary {
  average: number;
  count: number;
  mine: { rating: number; body: string | null } | null;
  reviews: {
    id: string;
    rating: number;
    body: string | null;
    createdAt: string;
    user: { name: string; image: string | null };
    isMine: boolean;
  }[];
}

export const reviews = {
  list: (mediaId: string, kind: string) =>
    getJSON<ReviewSummary>(`/api/reviews?mediaId=${encodeURIComponent(mediaId)}&kind=${kind}`),
  save: (mediaId: string, kind: string, rating: number, body: string) =>
    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaId, kind, rating, body }),
    }),
  remove: (mediaId: string, kind: string) =>
    fetch("/api/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaId, kind }),
    }),
};

export interface ListSummary {
  id: string;
  name: string;
  isPublic: boolean;
  count: number;
  covers: string[];
}
export interface ListDetail {
  id: string;
  name: string;
  isPublic: boolean;
  isOwner: boolean;
  owner: { id: string; name: string };
  items: { mediaId: string; kind: string; title: string; image?: string | null }[];
}

export const lists = {
  mine: () => getJSON<ListSummary[]>("/api/lists"),
  create: (name: string, isPublic = true) =>
    fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, isPublic }),
    }),
  get: (id: string) => getJSON<ListDetail>(`/api/lists/${id}`),
  remove: (id: string) => fetch(`/api/lists/${id}`, { method: "DELETE" }),
  addItem: (
    id: string,
    item: { mediaId: string; kind: string; title: string; image?: string },
  ) =>
    fetch(`/api/lists/${id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    }),
  removeItem: (id: string, mediaId: string, kind: string) =>
    fetch(`/api/lists/${id}/items`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaId, kind }),
    }),
};

export interface FollowState {
  followers: number;
  following: number;
  isFollowing: boolean;
}
export const follow = {
  state: (userId: string) => getJSON<FollowState>(`/api/follow?userId=${userId}`),
  add: (userId: string) =>
    fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }),
  remove: (userId: string) =>
    fetch("/api/follow", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }),
};

export interface WatchlistItem {
  id: string;
  mediaId: string;
  kind: string;
  title: string;
  image?: string | null;
}

export const watchlist = {
  list: () => getJSON<WatchlistItem[]>("/api/watchlist"),
  add: (item: { mediaId: string; kind: string; title: string; image?: string }) =>
    fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    }),
  remove: (mediaId: string, kind: string) =>
    fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaId, kind }),
    }),
};

export interface ProgressRow {
  animeId: string;
  title: string;
  image?: string | null;
  provider?: string | null;
  dub?: boolean;
  episodeId: string;
  episodeNumber: number;
  position: number;
  duration: number;
  updatedAt: string;
}

export const progressApi = {
  list: () => getJSON<ProgressRow[]>("/api/progress"),
  save: (p: {
    animeId: string;
    title: string;
    image?: string;
    provider?: string;
    dub?: boolean;
    episodeId: string;
    episodeNumber: number;
    position: number;
    duration: number;
  }) =>
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    }).catch(() => {}),
};

/** Build a same-origin proxied URL for an HLS source / segment. */
export function proxied(url: string, ref?: string): string {
  const u = new URLSearchParams({ url });
  if (ref) u.set("ref", ref);
  return `/api/proxy?${u.toString()}`;
}
