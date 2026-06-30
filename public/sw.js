/* Watchly service worker — app-shell + offline fallback. */
const CACHE = "watchly-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.add(OFFLINE_URL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Never touch cross-origin (video streams, image CDNs, AniList/TMDB).
  if (url.origin !== self.location.origin) return;
  // Don't cache dynamic API responses.
  if (url.pathname.startsWith("/api/")) return;

  // Static build assets + icon/manifest: cache-first.
  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname === "/icon" ||
    url.pathname.startsWith("/manifest")
  ) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((resp) => {
            const copy = resp.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return resp;
          }),
      ),
    );
    return;
  }

  // Page navigations: network-first, fall back to cache then the offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return resp;
        })
        .catch(() =>
          caches.match(request).then((hit) => hit || caches.match(OFFLINE_URL)),
        ),
    );
  }
});
