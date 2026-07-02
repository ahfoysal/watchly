import type { MetadataRoute } from "next";
import { getTrending, getPopular } from "@/lib/consumet";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 86400; // regenerate daily

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = ["/", "/az"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.6,
  }));

  // Include the most relevant anime detail pages; wrapped so a provider outage
  // never breaks sitemap generation.
  let titles: MetadataRoute.Sitemap = [];
  try {
    const [trending, popular] = await Promise.all([
      getTrending(24).catch(() => []),
      getPopular(24).catch(() => []),
    ]);
    const seen = new Set<string>();
    titles = [...trending, ...popular]
      .filter((a) => (seen.has(a.id) ? false : (seen.add(a.id), true)))
      .map((a) => ({
        url: `${siteUrl}/anime/${a.id}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch {
    // ignore — return static pages only
  }

  return [...staticPages, ...titles];
}
