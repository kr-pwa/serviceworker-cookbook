// [Working example](/serviceworker-cookbook/cache-then-network/).

console.log('Running sw.js');

const cacheName = 'cache-then-network';

self.addEventListener('install', () => {
  console.log('SW install event');
  self.skipWaiting();
  ev.waitUntil(self.clients.claim());
  console.log('Leaving SW install event');
});

self.addEventListener('activate', (ev) => {
  console.log('SW activate event');
  ev.waitUntil(self.clients.claim());
  console.log('Leaving SW activate event');
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  const reqURL = new URL(req.url);

  if (reqURL.hostname === 'api.github.com') {
    console.log('Got request for github api');
    ev.respondWith(fetch(req).then((res) => {
      console.log('SW fetched data');
      caches.open(cacheName).then((cache) => {
        console.log('SW opened cache');
        cache.put(reqURL, res);
        console.log('SW cached data');
        console.log('Cache keys:');
        for (var i = 0; i < cache.keys().length; i++) {
          console.log('\t' + cache.keys()[i]);
        }
      });
      console.log('SW returning response');
      return res.clone();
    }));
  }

  // Any other handlers come here. Without calls to `ev.respondWith()` the
  // request will be handled without the ServiceWorker.
});

console.log('Leaving sw.js');
