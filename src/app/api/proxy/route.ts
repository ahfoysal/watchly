export const runtime = "nodejs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export function OPTIONS() {
  return new Response(null, { headers: CORS });
}

/**
 * Streaming proxy. HLS sources (vixcloud, etc.) block cross-origin browser
 * playback and require a Referer header, so we proxy them server-side. For
 * `.m3u8` playlists we rewrite every nested URL to flow back through this proxy
 * (carrying the same referer) so segments and variant playlists also load.
 */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const target = params.get("url");
  const ref = params.get("ref") ?? undefined;
  if (!target) return new Response("Missing url", { status: 400, headers: CORS });

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      headers: {
        "User-Agent": UA,
        ...(ref ? { Referer: ref, Origin: new URL(ref).origin } : {}),
      },
    });
  } catch {
    return new Response("Upstream fetch failed", { status: 502, headers: CORS });
  }

  if (!upstream.ok) {
    return new Response(`Upstream ${upstream.status}`, {
      status: upstream.status,
      headers: CORS,
    });
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  const isPlaylist =
    contentType.includes("mpegurl") ||
    target.includes(".m3u8") ||
    target.includes("/playlist/");

  if (isPlaylist) {
    const text = await upstream.text();
    // Some endpoints return a playlist with an octet-stream content-type; only
    // rewrite if it actually looks like one.
    if (text.trimStart().startsWith("#EXTM3U")) {
      const rewritten = rewritePlaylist(text, target, ref, req.url);
      return new Response(rewritten, {
        headers: {
          ...CORS,
          "Content-Type": "application/vnd.apple.mpegurl",
        },
      });
    }
    // fall through: serve as-is
    return new Response(text, {
      headers: { ...CORS, "Content-Type": contentType || "text/plain" },
    });
  }

  // Binary segment / key: stream straight through.
  return new Response(upstream.body, {
    headers: {
      ...CORS,
      "Content-Type": contentType || "application/octet-stream",
    },
  });
}

function proxify(absoluteUrl: string, ref: string | undefined, selfUrl: string): string {
  const base = new URL(selfUrl);
  const u = new URLSearchParams();
  u.set("url", absoluteUrl);
  if (ref) u.set("ref", ref);
  return `${base.origin}${base.pathname}?${u.toString()}`;
}

function rewritePlaylist(
  text: string,
  playlistUrl: string,
  ref: string | undefined,
  selfUrl: string,
): string {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;

      // Rewrite URI="..." attributes (keys, media, i-frames).
      if (trimmed.startsWith("#")) {
        return line.replace(/URI="([^"]+)"/g, (_m, uri) => {
          const abs = new URL(uri, playlistUrl).toString();
          return `URI="${proxify(abs, ref, selfUrl)}"`;
        });
      }

      // Plain URL line (variant playlist or segment).
      const abs = new URL(trimmed, playlistUrl).toString();
      return proxify(abs, ref, selfUrl);
    })
    .join("\n");
}
