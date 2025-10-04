const DEV_MODE = false;
const CORE_CACHE = 'core-v1';
const STATIC_CACHE = 'static-v1';

const coreAssets = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/main.css',
  '/js/db.js',
  '/js/app.js',
  '/js/sync.js',
  '/js/log.js',
  '/js/services.js',
  '/js/controllers.js',
  '/js/conf.js',
  'https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js'
];
/* from manifest.json
    { "src": "/icons/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/apple-touch-icon-180x180.png", "sizes": "180x180", "type": "image/png" },
    { "src": "/icons/maskable_icon.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
*/
const staticAssets = [
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png',
  '/icons/apple-touch-icon-180x180.png',
  '/icons/maskable_icon.png'
];

const networkFirstWhitelist = [
    '/index.html',
    '/js/conf.js',
    'https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js'
];

self.addEventListener('install', event => {
  if (DEV_MODE) return;
  event.waitUntil(
    Promise.all([
      caches.open(CORE_CACHE).then(cache => cache.addAll(coreAssets)),
      caches.open(STATIC_CACHE).then(cache => cache.addAll(staticAssets))
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  if (DEV_MODE) return;
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CORE_CACHE && k !== STATIC_CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (DEV_MODE) {
    event.respondWith(fetch(event.request));
    return;
  }

  const url = new URL(event.request.url);

  if (event.request.mode === 'navigate' || networkFirstWhitelist.includes(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then(resp => caches.open(CORE_CACHE).then(cache => { cache.put(event.request, resp.clone()); return resp; }))
        .catch(() => caches.match(event.request).then(resp => resp || caches.match('/offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(resp =>
      resp || fetch(event.request).then(netResp => {
        const cacheName = coreAssets.includes(url.pathname) ? CORE_CACHE : STATIC_CACHE;
        caches.open(cacheName).then(cache => cache.put(event.request, netResp.clone()));
        return netResp;
      }).catch(() => caches.match('/offline.html'))
    )
  );
});
