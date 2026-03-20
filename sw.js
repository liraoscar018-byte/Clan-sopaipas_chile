const CACHE = "sopaipas-v1";
const ARCHIVOS = [
  "./index.html",
  "./manifest.json"
];

// Instalación: guarda archivos en caché
self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ARCHIVOS);
    })
  );
  self.skipWaiting();
});

// Activación: limpia cachés viejos
self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: primero red, si falla usa caché
self.addEventListener("fetch", function(e) {
  e.respondWith(
    fetch(e.request)
      .then(function(res) {
        // Guarda respuesta fresca en caché
        var copia = res.clone();
        caches.open(CACHE).then(function(cache) {
          cache.put(e.request, copia);
        });
        return res;
      })
      .catch(function() {
        return caches.match(e.request);
      })
  );
});
