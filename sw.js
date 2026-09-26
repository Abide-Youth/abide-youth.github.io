/* Abide Youth offline cache. Bump VERSION whenever you publish changes. */
const VERSION = "abide-v4";
const CORE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png",
  "photos/01-senior.jpg",
  "photos/02-summer.jpg",
  "photos/03-0916.jpg",
  "photos/04-summer.jpg",
  "photos/05-camp.jpg",
  "photos/06-camp.jpg",
  "photos/07-camp.jpg",
  "photos/08-0916.jpg",
  "photos/09-senior.jpg",
  "photos/10-0916.jpg",
  "photos/11-summer.jpg",
  "photos/12-0916.jpg",
  "photos/13-senior.jpg",
  "photos/14-carwash.jpg",
  "photos/15-carwash.jpg",
  "photos/16-carwash.jpg",
  "photos/17-0916.jpg"];
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
