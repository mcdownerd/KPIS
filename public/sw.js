// Service Worker for PWA - Dashboard KPI's 2025
const CACHE_NAME = 'kpis-pwa-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/site.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      console.log('[SW] Skip waiting');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', event.request.url);
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the fetched resource
        caches.open(CACHE_NAME).then((cache) => {
          // Only cache HTML, CSS, JS, and images
          if (
            event.request.url.match(/\.(html|css|js|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf)$/) ||
            event.request.url.endsWith('/')
          ) {
            console.log('[SW] Caching new resource:', event.request.url);
            cache.put(event.request, responseToCache);
          }
        });

        return response;
      }).catch(() => {
        // Network failed, try to serve offline page
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        
        // For other resources, just fail
        return new Response('Network error', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
