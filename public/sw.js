// Minimal Service Worker used only for update detection.
// NOTE: We intentionally do NOT intercept fetch requests to avoid stale asset caching issues.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Best-effort cache cleanup from any previous SW versions.
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.map((n) => caches.delete(n))))
      .catch(() => undefined)
  );
  self.clients.claim();
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
