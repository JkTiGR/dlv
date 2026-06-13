const DRAGON_CACHE = 'dragon-pwa-v2';
const CORE_ASSETS = [
  './',
  './index.html',
  './menu.html',
  './app.html',
  './base.css',
  './logo.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(DRAGON_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== DRAGON_CACHE).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(DRAGON_CACHE).then((cache) => cache.put(event.request, copy)).catch(() => null);
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
  );
});
