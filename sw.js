/* Abide Youth offline cache. Bump VERSION whenever you publish changes. */
const VERSION = "abide-v13";
const CORE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png",
  // first background on each page; every other photo is cached the first time it loads
  "photos/senior-night-26-3.jpg", "photos/back-to-school-bash.jpg", "photos/sep-25-night-4.jpg", "photos/sep-26-night-1.jpg", "photos/ywam-launch-4.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith("version.json")) return; // always straight from the network
  if (req.mode === "navigate" || url.pathname.endsWith(".html")) {
    // pages: try the network first so updates show up, fall back to cache offline
    e.respondWith(fetch(req.url, { cache: "no-store" }).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; }).catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
  } else {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })));
  }
});
