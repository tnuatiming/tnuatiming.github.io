var cacheName = 'tnuaTimingCache';
var filesToCache = ['/images/logo16.png', '/style/global.css'];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
      caches.keys().then(function(keyList) {
          return Promise.all(keyList.map(function(key) {
              if (key !== cacheName) {
                  return caches.delete(key);
              }
          }));
      })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
}); 
