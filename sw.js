/**
 * THE COMFORTER — Service Worker
 * Caches all app shell assets for full offline support.
 */

const CACHE_NAME = 'comforter-v1';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './data/conditions.js',
  './data/verses.js',
  './data/themes.js',
  './systems/particles.js',
  './systems/renderer.js',
  './systems/ambient.js',
  './systems/transitions.js',
  './systems/verseEngine.js',
  'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap',
];

/* ── Install: cache all assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: clear old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: cache-first, network fallback ── */
self.addEventListener('fetch', event => {
  /* Skip non-GET and cross-origin requests that aren't fonts */
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          /* Cache successful responses */
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          /* Offline fallback for HTML navigation */
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
    })
  );
});