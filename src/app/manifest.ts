import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AnimeFlix — Stream Anime, Movies & Manga",
    short_name: "AnimeFlix",
    description:
      "A modern, self-hosted universal streaming + reading app for anime, movies, TV, and manga.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0e0e",
    theme_color: "#0e0e0e",
    categories: ["entertainment"],
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
