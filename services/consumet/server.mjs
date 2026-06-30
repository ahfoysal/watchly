import express from "express";
import cors from "cors";
import { ANIME, MANGA, META } from "@consumet/extensions";

const app = express();
app.use(cors());

const PROVIDERS = (process.env.CONSUMET_PROVIDERS || "AnimeUnity,AnimeSaturn,Hianime")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const mangaProvider = new MANGA.ComicK();
const anilistCache = new Map();
function anilist(name) {
  if (!anilistCache.has(name)) {
    const Ctor = ANIME[name];
    if (!Ctor) throw new Error(`Unknown provider: ${name}`);
    anilistCache.set(name, new META.Anilist(new Ctor()));
  }
  return anilistCache.get(name);
}

// Tiny TTL cache for resolved sources/pages.
const cache = new Map();
function getCache(key) {
  const e = cache.get(key);
  if (e && e.exp > Date.now()) return e.val;
  cache.delete(key);
  return null;
}
function setCache(key, val, ttlMs) {
  cache.set(key, { val, exp: Date.now() + ttlMs });
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, providers: PROVIDERS });
});

// Episode streaming sources with provider failover.
app.get("/anime/sources", async (req, res) => {
  const ep = req.query.ep;
  const provider = req.query.provider;
  if (!ep) return res.status(400).json({ error: "ep required" });

  const key = `src:${ep}:${provider || ""}`;
  const hit = getCache(key);
  if (hit) return res.json(hit);

  const chain = provider
    ? [provider, ...PROVIDERS.filter((p) => p !== provider)]
    : PROVIDERS;
  for (const name of chain) {
    try {
      const r = await anilist(name).fetchEpisodeSources(ep);
      if (r?.sources?.length) {
        setCache(key, r, 3 * 60 * 1000); // 3 min (URLs carry expiring tokens)
        return res.json(r);
      }
    } catch {
      // try next provider
    }
  }
  res.status(502).json({ error: "no source available" });
});

// Manga chapter pages.
app.get("/manga/pages", async (req, res) => {
  const chapterId = req.query.chapterId;
  if (!chapterId) return res.status(400).json({ error: "chapterId required" });
  const key = `pages:${chapterId}`;
  const hit = getCache(key);
  if (hit) return res.json(hit);
  try {
    const pages = await mangaProvider.fetchChapterPages(chapterId);
    setCache(key, pages, 10 * 60 * 1000);
    res.json(pages);
  } catch {
    res.status(502).json({ error: "failed to load pages" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`[consumet-service] listening on :${port}`));
