const CACHE_NAME = 'tinygames-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/tictactoe.html',
  '/dotsandboxes.html',
  '/css/style.css',
  '/js/app.js',
  '/js/tictactoe.js',
  '/js/dotsandboxes.js',
  '/js/tetris.js',
  '/tetris.html',
  '/socket.io/socket.io.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
