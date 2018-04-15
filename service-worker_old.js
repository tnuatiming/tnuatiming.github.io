self.addEventListener('install', e => {
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open('tnuatiming').then(cache => {
      return cache.addAll([
 //       `/`,
        `/index.html?timestamp=${timeStamp}`,
        `/style/global.css?timestamp=${timeStamp}`,
        `/results/index.html?timestamp=${timeStamp}`,
        `/live/index.html?timestamp=${timeStamp}`
      ])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then(response => {
      return response || fetch(event.request);
    })
  );
}); 
