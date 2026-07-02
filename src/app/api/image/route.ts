import { isPublicHttp } from "@/lib/url-safety";

export const runtime = "nodejs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export function OPTIONS() {
  return new Response(null, { headers: CORS });
}

/**
 * Image proxy for manga page scans and covers. Source CDNs (weebcentral,
 * compsci88, etc.) enforce a Referer/User-Agent and block hotlinking, so the
 * browser can't load them directly. We replay the required headers server-side
 * and stream the bytes back with permissive CORS + long-lived caching (the
 * underlying scan images are immutable).
 */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const target = params.get("url");
  if (!target || !isPublicHttp(target)) {
    return new Response("Bad url", { status: 400, headers: CORS });
  }

  // Referer defaults to the image's own origin, which satisfies most hotlink
  // checks; the provider can override it (e.g. weebcentral pages).
  const ref = params.get("ref") || new URL(target).origin;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      headers: {
        "User-Agent": UA,
        Referer: ref,
        Accept: "image/avif,image/webp,image/png,image/jpeg,*/*",
      },
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    return new Response("Upstream fetch failed", { status: 502, headers: CORS });
  }

  if (!upstream.ok) {
    return new Response(`Upstream ${upstream.status}`, {
      status: 502,
      headers: CORS,
    });
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  // Guard against a CDN serving an HTML challenge with a 200.
  if (!contentType.startsWith("image/")) {
    return new Response("Not an image", { status: 502, headers: CORS });
  }

  return new Response(upstream.body, {
    headers: {
      ...CORS,
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
    },
  });
}
