// Preview service worker: NETWORK-FIRST, so every deploy reaches the device
// on its next launch and the cached copy only answers when the network is
// down. The preview's API is an in-page shim, so no data ever passes through
// here — only the shell.
const CACHE = 'resv-preview-v2';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./'])).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    // NETWORK-FIRST IS NOT FRESH-FIRST. GitHub Pages serves the shell with a
    // max-age, and a plain fetch() goes through the browser's own HTTP cache
    // first — so a deploy could be live and the device still drawing the page
    // from ten minutes ago, with no way to tell. The shell is asked for with
    // no-store; everything else may come from the HTTP cache as usual.
    fetch(e.request, e.request.mode === 'navigate' ? { cache: 'no-store' } : undefined).then((res) => {
      if (res.ok && new URL(e.request.url).origin === self.location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true })
      .then((hit) => hit || (e.request.mode === 'navigate' ? caches.match('./') : undefined)))
  );
});
