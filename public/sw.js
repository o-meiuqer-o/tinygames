// CACHE v18 — network-first for HTML, cache-first for assets
// Bumping version forces all old caches to be wiped
const CACHE_NAME = 'tinygames-v18';
const ASSETS = [
  '/css/style.css',
  '/css/hermit-crab.css',
  '/css/pallanguzhi.css',
  '/css/aadu-puli-aattam.css',
  '/js/app.js',
  '/js/sounds.js',
  '/js/tictactoe.js',
  '/js/dotsandboxes.js',
  '/js/tetris.js',
  '/js/kakka.js',
  '/js/hermit-crab.js',
  '/js/pallanguzhi.js',
  '/js/aadu-puli-aattam.js',
  '/manifest.json'
];

// Install: pre-cache only static assets (not HTML — served network-first)
self.addEventListener('install', event => {
  self.skipWaiting(); // activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate: delete all old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim()) // take control of all open tabs
  );
});

// Fetch: network-first for HTML pages, cache-first for assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isHTML = event.request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/';

  if (isHTML) {
    // Always try network first for HTML so updates show immediately
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request)) // fallback to cache if offline
    );
  } else {
    // Cache-first for JS/CSS assets
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});
