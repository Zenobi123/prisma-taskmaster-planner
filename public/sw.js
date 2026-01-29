// Service Worker for update detection and caching
const CACHE_NAME = 'prisma-gestion-v1';

// Install event - cache basic assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first strategy for API calls, cache first for assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Network first for API calls and dynamic content
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('supabase') ||
      event.request.url.includes('version.json')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // For other requests, try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
