// RhythmBox - Service Worker para Soporte Offline y Caché PWA

const CACHE_NAME = "rhythmbox-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/main.css",
  "./css/theme.css",
  "./css/components.css",
  "./css/player.css",
  "./css/lyrics.css",
  "./css/views.css",
  "./js/app.js",
  "./js/state.js",
  "./js/audio/engine.js",
  "./js/audio/synthesizer.js",
  "./js/audio/mediaSession.js",
  "./js/data/songs.js",
  "./js/data/playlists.js",
  "./js/data/i18n.js",
  "./js/utils/colorExtractor.js",
  "./js/utils/lyricsCardGen.js",
  "./js/utils/storage.js",
  "./js/views/homeView.js",
  "./js/views/libraryView.js",
  "./js/views/searchView.js",
  "./js/views/queueView.js",
  "./js/views/settingsView.js",
  "./js/views/detailView.js",
  "./js/views/lyricsView.js",
  "./js/views/playerView.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      return caches.match("./index.html");
    })
  );
});
