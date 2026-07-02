import "server-only";
import Redis from "ioredis";

/**
 * Lightweight Redis cache with graceful degradation: if REDIS_URL is unset or
 * Redis is unreachable, every call simply runs the underlying function. The app
 * never breaks because the cache is down.
 */

let client: Redis | null = null;
let disabled = false;

function getClient(): Redis | null {
  if (disabled) return null;
  if (client) return client;
  const url = process.env.REDIS_URL;
  if (!url) {
    disabled = true;
    return null;
  }
  try {
    client = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: false,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
    });
    // Swallow connection errors so a missing Redis never crashes a request.
    client.on("error", () => {});
    return client;
  } catch {
    disabled = true;
    return null;
  }
}

/**
 * Stale-while-revalidate: a cached entry is "fresh" for `ttlSeconds`, then
 * "stale" but still served (for up to GRACE) while it refreshes in the
 * background. This is what kills the ~15s cold-scrape wait on repeat visits —
 * the user gets the last-known value instantly and the new one lands silently.
 */
const GRACE_SECONDS = 60 * 60 * 24 * 2; // keep serving stale up to 2 days
type Wrapped<T> = { __swr: 1; v: T; f: number };

// De-dupe background refreshes within this process (avoids scrape stampedes).
const revalidating = new Set<string>();

function revalidate<T>(
  c: Redis,
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
): void {
  if (revalidating.has(key)) return;
  revalidating.add(key);
  // Fire-and-forget: on failure we keep serving the stale value.
  Promise.resolve()
    .then(fn)
    .then((data) => writeEntry(c, key, ttlSeconds, data))
    .catch(() => {})
    .finally(() => revalidating.delete(key));
}

async function writeEntry<T>(
  c: Redis,
  key: string,
  ttlSeconds: number,
  data: T,
): Promise<void> {
  const wrapped: Wrapped<T> = { __swr: 1, v: data, f: Date.now() + ttlSeconds * 1000 };
  try {
    await c.set(key, JSON.stringify(wrapped), "EX", ttlSeconds + GRACE_SECONDS);
  } catch {
    // cache write failed — ignore
  }
}

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
): Promise<T> {
  const c = getClient();
  if (c) {
    try {
      const hit = await c.get(key);
      if (hit) {
        const parsed = JSON.parse(hit);
        if (parsed && parsed.__swr === 1) {
          const w = parsed as Wrapped<T>;
          if (Date.now() >= w.f) revalidate(c, key, ttlSeconds, fn); // stale → refresh
          return w.v;
        }
        // Legacy (unwrapped) entry: serve it and refresh in the background.
        revalidate(c, key, ttlSeconds, fn);
        return parsed as T;
      }
    } catch {
      // cache read failed — fall through to live fetch
    }
  }

  const data = await fn();
  if (c) await writeEntry(c, key, ttlSeconds, data);
  return data;
}

/** Invalidate a cache key (e.g. after a write). Safe no-op without Redis. */
export async function cacheDel(key: string): Promise<void> {
  const c = getClient();
  if (!c) return;
  try {
    await c.del(key);
  } catch {
    // ignore
  }
}

/** TTLs (seconds) tuned per data volatility. */
export const TTL = {
  list: 1800, // trending / popular / browse / genre — 30 min
  search: 900, // search results — 15 min
  info: 3600, // anime/manga detail metadata — 1 hour
  schedule: 600, // airing schedule — 10 min
};
