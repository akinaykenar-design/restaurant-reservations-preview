// Preview service worker: a KILL SWITCH, and nothing else.
//
// It used to cache the shell network-first, which sounds harmless and was
// not: a plain fetch() goes through the browser's own HTTP cache, so a deploy
// could be live for an hour while the device drew the page from before it,
// with nothing on screen to say so. A removed button kept coming back, and
// the only cure was a hard refresh — which is not a thing you can do on a
// phone. A preview that can lie about what is deployed is worse than a
// preview with no offline support, and offline is not what a preview is for.
//
// So this worker's whole job is to delete every cache, unregister itself and
// send the open windows back to the network. A browser re-checks a worker
// SCRIPT on navigation without going through the HTTP cache, so this reaches
// a device that is otherwise stuck, on its next open, with nobody touching
// anything. The registration is gone from the page too, so once it has run
// there is no worker here at all.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (err) {}
    try { await self.registration.unregister(); } catch (err) {}
    try {
      const open = await self.clients.matchAll({ type: 'window' });
      // navigate() where it exists, because it lands on the network with no
      // worker left to answer; a bare reload can still be served by this one.
      for (const c of open) {
        try { await c.navigate(c.url); } catch (err) { try { c.postMessage('reload'); } catch (e2) {} }
      }
    } catch (err) {}
  })());
});
// Answer nothing. With no fetch handler the browser goes straight to the
// network, so even the moment before this worker dies is honest.
