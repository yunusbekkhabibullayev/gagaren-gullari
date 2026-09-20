const CACHE_NAME = "nastarin-gullari-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/logo.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/apple-touch-icon.png",
  "/icon-maskable-192x192.png",
  "/icon-maskable-512x512.png"
];

// Install Event
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("Failed to pre-cache some assets:", err);
      });
    })
  );
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  // Ignore non-GET requests or external API calls (e.g. Supabase DB calls)
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // For static assets (images, fonts, scripts, styles), try cache first then network
  if (
    url.origin === self.location.origin &&
    (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|css|js|woff2?)$/i) ||
      url.pathname.startsWith("/_build/") ||
      url.pathname.startsWith("/assets/"))
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => {});
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Navigation requests: try network first, fallback to cached index / root if offline
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        const rootResponse = await caches.match("/");
        if (rootResponse) return rootResponse;

        // Clean inline html fallback if completely offline and no cached shell
        return new Response(
          `<!DOCTYPE html>
           <html lang="uz">
             <head>
               <meta charset="utf-8">
               <meta name="viewport" content="width=device-width, initial-scale=1">
               <title>Oflayn holat - NASTARIN GULLARI</title>
               <style>
                 body { font-family: system-ui, sans-serif; text-align: center; padding: 3rem 1rem; background: #fafaf7; color: #1a1a1a; }
                 .card { max-width: 400px; margin: 0 auto; background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
                 h1 { color: #9b2c3b; font-size: 1.5rem; margin-bottom: 0.5rem; }
                 p { color: #666; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem; }
                 button { background: #9b2c3b; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
               </style>
             </head>
             <body>
               <div class="card">
                 <h1>Siz oflayn holatdasiz</h1>
                 <p>Sizda hozir internet aloqasi yo'q. Qaytadan urinib ko'rish uchun tarmoqqa ulaning.</p>
                 <button onclick="window.location.reload()">Qaytadan yuklash</button>
               </div>
             </body>
           </html>`,
          { headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      })
    );
  }
});
