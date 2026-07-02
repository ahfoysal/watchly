/**
 * Canonical public site URL, used for SEO (metadataBase, sitemap, robots, OG)
 * and auth. On Render, RENDER_EXTERNAL_URL is injected automatically, so a
 * deploy works with zero URL config; override with NEXT_PUBLIC_SITE_URL.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  "http://localhost:3000";
