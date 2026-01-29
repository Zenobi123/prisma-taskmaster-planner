
// This utility helps with service worker registration for update detection

export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      let refreshing = false;

      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully');

          // Ensure we check for updates ASAP
          registration.update?.();

          // If there's already a waiting SW, activate it
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }

          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update available -> activate immediately
                  installingWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              }
            });
          });

          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
          });
        })
        .catch((error) => {
          // SW isn't critical for app functionality
          console.warn('Service Worker registration skipped:', error?.message || error);
        });
    });
  }
}

export function unregisterSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
