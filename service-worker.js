const DEV_MODE = true;
const CORE_CACHE = 'core-v1';
const STATIC_CACHE = 'static-v1';



const coreAssets = [
  '/',
  'index.html',
  'offline.html',
  'css/main.css',
  'js/db.js',
  'js/app.js',
  'js/sync.js',
  'js/log.js',
  'js/services.js',
  'js/controllers.js',
  'js/conf.js',
  'js/utils.js',
  'https://unpkg.com/onsenui/css/onsenui.css',
  'https://unpkg.com/onsenui/css/onsen-css-components.min.css',
  'https://unpkg.com/onsenui/js/onsenui.min.js'
];
/* from manifest.json*/
const staticAssets = [
  'assets/maskable_icon_x192.png',
  'assets/maskable_icon_x512.png',
  'assets/apple-touch-icon.png',
  'assets/maskable_icon.png',
  'assets/share.png',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.15/dist/cdn.min.js',
  'https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js',
  'https://unpkg.com/ionicons@4.6.3/dist/css/ionicons.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@500;600&display=swap'
];

const networkFirstWhitelist = [
  'index.html',
  'css/main.css',
  'js/db.js',
  'js/app.js',
  'js/sync.js',
  'js/log.js',
  'js/services.js',
  'js/controllers.js',
  'js/conf.js',
  'js/utils.js',

  'https://unpkg.com/onsenui/css/onsenui.css',
  'https://unpkg.com/onsenui/css/onsen-css-components.min.css',
  'https://unpkg.com/onsenui/js/onsenui.min.js'
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
  // 3️⃣ Notifica ai client che il SW è nuovo
  const allClients = self.clients.matchAll({ includeUncontrolled: true });
  for (const client of allClients) {
    client.postMessage({ type: 'NEW_VERSION_AVAILABLE' });
  }

  console.log('[SW] Activated new version and notified clients');
});


self.addEventListener("fetch", (event) => {
  if (DEV_MODE) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((resp) => {
      if (resp) return resp;

      return fetch(event.request)
        .then((netResp) => {
          const url = new URL(event.request.url);
          const cacheName = coreAssets.includes(url.pathname)
            ? CORE_CACHE
            : STATIC_CACHE;

          // Only cache valid, same-origin responses
          if (netResp && netResp.ok && netResp.type === "basic") {
            const responseClone = netResp.clone();
            caches.open(cacheName).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }

          return netResp;
        })
        .catch(() => caches.match("/offline.html"));
    })
  );
});


