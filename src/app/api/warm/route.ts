import { warmAnimeInfo } from "@/lib/consumet";

export const runtime = "nodejs";
export const maxDuration = 300; // warming scrapes several titles; allow time

/**
 * Cache-warming endpoint for a cron (e.g. every 20 min). Pre-resolves detail
 * info for the top trending/popular titles so visitors hit a warm cache.
 * Optionally protect with WARM_SECRET (?secret=...).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = process.env.WARM_SECRET;
  if (secret && url.searchParams.get("secret") !== secret) {
    return new Response("Forbidden", { status: 403 });
  }
  const limit = Math.min(Number(url.searchParams.get("limit")) || 10, 24);
  const warmed = await warmAnimeInfo(limit);
  return Response.json({ warmed, limit });
}
