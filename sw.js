/* ==========================================================================
   AppGym — Service Worker
   App instalable + funcionamiento offline. Estrategia:
   - navegación .......... network-first (siempre la última versión si hay red)
   - assets del sitio .... cache-first (van versionados con ?v=N)
   - fuentes / SDK CDN ... stale-while-revalidate
   - Supabase ............ nunca se toca (auth y datos siempre en vivo)
   Subir V en cada deploy (junto con el ?v=N de index.html) para renovar caché.
   ========================================================================== */
const V = "27";
const CACHE = "appgym-" + V;
const CORE = [
  "./",
  "./index.html",
  "./css/styles.css?v=" + V,
  "./js/data.js?v=" + V,
  "./js/videos.js?v=" + V,
  "./js/timer.js?v=" + V,
  "./js/app.js?v=" + V,
  "./js/program.js?v=" + V,
  "./js/config.js?v=" + V,
  "./js/sync.js?v=" + V,
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  let url;
  try { url = new URL(req.url); } catch (_) { return; }

  // Supabase: auth + datos siempre en vivo, jamás desde caché.
  if (url.hostname.endsWith(".supabase.co")) return;

  const sameOrigin = url.origin === self.location.origin;

  // Navegación -> network-first, con el index cacheado como respaldo offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  // Assets del mismo origen (versionados) -> cache-first.
  if (sameOrigin) {
    e.respondWith(
      caches.match(req).then((hit) =>
        hit ||
        fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => hit)
      )
    );
    return;
  }

  // Google Fonts + CDN del SDK de Supabase -> stale-while-revalidate.
  if (/(^|\.)(gstatic\.com|googleapis\.com|jsdelivr\.net)$/.test(url.hostname)) {
    e.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => hit);
        return hit || net;
      })
    );
  }
});
