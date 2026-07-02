import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // No point letting crawlers index user-specific or API routes.
      disallow: ["/api/", "/settings", "/my-list", "/sign-in", "/sign-up"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
