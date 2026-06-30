/**
 * Loose-but-typed shapes for the raw responses Consumet/AniList/TMDB/ComicK
 * return. They intentionally allow extra fields (providers are inconsistent),
 * but give us real types for the fields we actually read in normalizers —
 * replacing scattered `any`.
 */

export interface RawTitle {
  romaji?: string;
  english?: string;
  native?: string;
  userPreferred?: string;
}

export interface RawMedia {
  id: string | number;
  title?: string | RawTitle;
  image?: string;
  coverImage?: string;
  cover?: string;
  rating?: number;
  type?: string;
  releaseDate?: string | number;
  status?: string;
  description?: string;
  genres?: string[];
  color?: string;
  totalEpisodes?: number;
  [key: string]: unknown;
}

export interface RawEpisode {
  id: string;
  number?: number;
  title?: string;
  image?: string;
  description?: string;
  [key: string]: unknown;
}
