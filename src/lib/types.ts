// Normalized, UI-facing types. The Consumet/AniList shapes are messy and
// loosely typed (`[x: string]: any`), so we map everything into these.

export type MediaKind = "anime" | "movie" | "tv" | "manga";

export interface AnimeCard {
  id: string;
  title: string;
  titleRomaji?: string;
  /** Which catalog this item belongs to (drives routing). Defaults to anime. */
  kind?: MediaKind;
  image?: string;
  cover?: string;
  rating?: number; // 0-100 (AniList averageScore)
  type?: string; // TV, MOVIE, OVA...
  releaseDate?: string;
  status?: string;
  // Present on trending/popular results; used by the hero.
  description?: string;
  genres?: string[];
  color?: string;
  totalEpisodes?: number;
}

export interface Episode {
  id: string;
  number: number;
  title?: string;
  image?: string;
  description?: string;
}

export interface Character {
  id: string;
  name: string;
  role?: string;
  image?: string;
  voiceActor?: string;
}

export interface AnimeDetail extends AnimeCard {
  description?: string;
  genres?: string[];
  totalEpisodes?: number;
  duration?: number;
  season?: string;
  year?: number;
  studios?: string[];
  popularity?: number;
  japaneseTitle?: string;
  synonyms?: string[];
  color?: string;
  trailer?: { id: string; site: string } | null;
  characters?: Character[];
  recommendations?: AnimeCard[];
  relations?: AnimeCard[];
  /** Which Consumet provider supplied the episode list (needed for playback). */
  provider?: string;
  episodes: Episode[];
}

export interface MangaChapter {
  id: string;
  title: string;
  chapter?: string;
  volume?: string;
}

export interface MangaDetail {
  id: string;
  title: string;
  image?: string;
  description?: string;
  genres?: string[];
  status?: string;
  chapters: MangaChapter[];
}

export interface VideoSource {
  url: string;
  quality?: string;
  isM3U8?: boolean;
}

export interface Subtitle {
  url: string;
  lang: string;
}

export interface TimeRange {
  start: number; // seconds
  end: number; // seconds
}

export interface WatchSources {
  sources: VideoSource[];
  subtitles: Subtitle[];
  headers?: Record<string, string>;
  /** Provider-supplied opening/ending markers (HiAnime/Zoro expose these). */
  intro?: TimeRange;
  outro?: TimeRange;
}
