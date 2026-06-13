# Skill: PWA (Progressive Web App) — Offline-First

## Overview

TinyGames is a full PWA:
- Installable on Android, iOS, desktop
- Works offline (cached assets via Service Worker)
- APK-able via PWABuilder

---

## manifest.json

```json
{
  "name": "TinyGames",
  "short_name": "TinyGames",
  "start_url": "/",
  "display": "fullscreen",
  "background_color": "#121212",
  "theme_color": "#121212",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

> Use `"display": "fullscreen"` for games (hides browser chrome).

---

## Service Worker (sw.js) — Network-First HTML, Cache-First Assets

**Current cache version**: v27 (bump for each deployment with JS/CSS changes)

```javascript
const CACHE_NAME = 'tinygames-v27'; // ← INCREMENT THIS on every deployment

const ASSETS = [
  '/css/style.css',
  '/css/hermit-crab.css',
  '/css/pallanguzhi.css',
  '/css/aadu-puli-aattam.css',
  '/css/syn-ant.css',
  '/css/signal-green.css',
  '/js/app.js',
  '/js/sounds.js',
  '/js/tictactoe.js',
  '/js/dotsandboxes.js',
  '/js/tetris.js',
  '/js/kakka.js',
  '/js/hermit-crab.js',
  '/js/pallanguzhi.js',
  '/js/aadu-puli-aattam.js',
  '/js/signal-green.js',
  '/js/syn-ant.js',
  // Add new game JS files here ↑
  '/manifest.json'
];

// Install: pre-cache static assets
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for HTML, cache-first for assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isHTML = event.request.destination === 'document' 
              || url.pathname.endsWith('.html') 
              || url.pathname === '/';

  if (isHTML) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});
```

---

## Registering the Service Worker (app.js)

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.error('SW registration failed:', err));
  });
}
```

---

## PWA Install Prompt (app.js)

```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById('install-pwa-btn');
  if (installBtn) installBtn.classList.remove('hidden');
});

const installBtn = document.getElementById('install-pwa-btn');
if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn.classList.add('hidden');
    }
  });
}
```

---

## Icon Generation (gen-icons.ps1)

Generate icons from a single source image:

```powershell
# Requires ImageMagick installed (winget install ImageMagick.Q16)
$src = "icon-source.png"
magick $src -resize 192x192 "public/icons/icon-192.png"
magick $src -resize 512x512 "public/icons/icon-512.png"
magick $src -resize 512x512 "public/icons/icon-maskable.png"
```

---

## Converting to APK (PWABuilder)

1. Go to https://www.pwabuilder.com/
2. Enter your HuggingFace URL: `https://o-meiuqer-o-tinygames.hf.space`
3. Click "Package for Stores"
4. Choose Android → Download APK
5. Extract zip → find the `.apk` file
6. Share `.apk` directly with friends (requires "Install from unknown sources" on Android)
7. For Google Play → use the `.aab` file instead

---

## Required HTML Meta Tags (All Pages)

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#121212">
<link rel="manifest" href="manifest.json">
```

---

## Checklist When Adding a New Game

- [ ] Add game HTML file with manifest link
- [ ] Add JS file path to `ASSETS` array in `sw.js`
- [ ] Add CSS file path to `ASSETS` array in `sw.js`
- [ ] **Bump `CACHE_NAME` version number** (critical!)
- [ ] Add game card to `index.html` with correct `data-category`
- [ ] Push to both remotes: `git push origin main ; git push hf main`

---

## Debugging Service Worker

```javascript
// In browser DevTools Console:
// Check registered SW
navigator.serviceWorker.getRegistrations().then(regs => console.log(regs));

// Force update SW
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.update());
});

// Clear all caches manually
caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
```

---

## Mobile Fullscreen Lock

For immersive games (single-player), lock to portrait or landscape:

```javascript
// Lock to portrait
screen.orientation.lock('portrait').catch(() => {});

// Lock to landscape (for landscape games like Signal Green)
screen.orientation.lock('landscape').catch(() => {});
```

> Only works on Android Chrome. iOS ignores orientation lock API.
