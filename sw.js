/* Service worker : garde une copie du site pour qu'il reste consultable sans internet,
   et affiche offline.html si une page n'a jamais été visitée.
   Stratégie « réseau d'abord » : en ligne, on sert toujours la version la plus récente. */
'use strict';

// Changer ce numéro force les visiteurs à repartir d'un cache propre
var CACHE = 'acvisuals-v1';

var PRECACHE = [
  './',
  'index.html',
  'offline.html',
  'style.css',
  'script.js',
  'intro.js',
  '404.js',
  'game.js',
  'page-i18n.js',
  '404-base.js',
  'favicon.svg',
  'img/ac-logo.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // Polices Google : « cache d'abord », elles ne changent jamais
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
          return res;
        });
      })
    );
    return;
  }

  // Le reste des domaines externes (WhatsApp, Web3Forms…) et la vidéo ne passent pas par le cache
  if (url.origin !== self.location.origin) return;
  if (req.headers.has('range') || req.destination === 'video') return;

  event.respondWith(
    fetch(req).then(function (res) {
      if (res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') return caches.match('offline.html');
        return Response.error();
      });
    })
  );
});
