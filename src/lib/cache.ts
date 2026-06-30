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

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
): Promise<T> {
  const c = getClient();
  if (c) {
    try {
      const hit = await c.get(key);
      if (hit) return JSON.parse(hit) as T;
    } catch {
      // cache read failed — fall through to live fetch
    }
  }

  const data = await fn();

  if (c) {
    try {
      await c.set(key, JSON.stringify(data), "EX", ttlSeconds);
    } catch {
      // cache write failed — ignore
    }
  }
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
