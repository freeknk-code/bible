const CACHE = 'bible-v17';
const ASSETS = [
  '/bible/',
  '/bible/index.html',
  '/bible/bible.json',
  '/bible/manifest.json',
  '/bible/icons/icon-192.png',
  '/bible/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // index.html은 항상 네트워크 우선 (최신 코드 보장)
  if (url.endsWith('/bible/') || url.endsWith('index.html')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
