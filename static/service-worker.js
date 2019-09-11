self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open("ivepta").then(function(cache) {
      return cache.addAll([
        "/",
        "/event/",
        "/news/",
        "/get-involved/",
        "/contact/",
        "/css/**.css"
      ]);
    })
  );
});

self.addEventListener("fetch", function(event) {
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
