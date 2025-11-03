const CACHE_NAME = "bay-breeze-cache-v4";
const urlsToCache = [
  "/",
  "/index.html",
  "/tools.html",
  "/resources.html",
  "/css/style.css",
  "/css/tools.css",
  "/js/script.js",
  "/img/Bay Breeze.webp",
  "/img/Bay Leaders.webp",
  "/img/kvk.webp",
  "/img/gar.webp",
  "/img/ancientbattlefield.webp",
  "/speedup-calc.html",
  "/css/speedups-calc.css",
  "/js/speedups-calc.js",
  "/weapon-calc.html",
  "/css/weapon-calc.css",
  "/js/weapon-calc.js",
  "/hero-shard.html",
  "/css/hero-shards.css",
  "/js/hero-shards.js",
  "/skill-books-calc.html",
  "/css/skill-books-calc.css",
  "/js/skill-books-calc.js",
  "/hero-awakening.html",
  "/css/hero-awakening.css",
  "/js/hero-awakening.js",
  "/pet-level.html",
  "/css/pet-level.css",
  "/js/pet-level.js",
  "/decor-calc.html",
  "/css/decor-calc.css",
  "/js/decor-calc.js",
  "/castle-calc.html",
  "/css/castle.calc.css",
  "/js/castle-calc.js",
  "/rune-calc.html",
  "/css/rune-calc.css",
  "/js/rune-calc.js",
  "/guides/adventure-mode.html",
  "/guides/building-priorities.html",
  "/guides/carriage-caravan.html",
  "/guides/castle-brilliance.html",
  "/guides/castle-skins.html",
  "/guides/castle-upgrades.html",
  "/guides/f2p-tips.html",
  "/guides/game-events.html",
  "/guides/guild-shop.html",
  "/guides/hero-gear.html",
  "/guides/hero-overview.html",
  "/guides/hero-pets.html",
  "/guides/hero-relics.html",
  "/guides/king-server-titles.html",
  "/guides/light-dark-towers.html",
  "/guides/lord-traits.html",
  "/guides/research-guide.html",
  "/guides/season-guides.html",
  "/guides/spending-diamonds.html",
  "/guides/spending-money.html",
  "/guides/troop-morale.html",
  "/guides/villager-guide.html",
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
  "https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
