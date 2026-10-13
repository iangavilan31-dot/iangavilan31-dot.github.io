/* Cache the complete local application shell. Household data stays in the app's
   chosen storage mode; this worker never caches exported plans or remote pages. */
const CACHE_NAMESPACE = 'nr-shell-';
const VERSION = 'v6';
const CACHE_NAME = `${CACHE_NAMESPACE}${VERSION}`;
const BASE_URL = new URL('./', self.location.href);
const SHELL_PATHS = [
  './', './index.html', './styles.css', './app.js', './engine.js', './storage.js',
  './icon.svg', './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './manifest.webmanifest', './fonts/geist.woff2',
];
const SHELL_URLS = SHELL_PATHS.map(path => new URL(path, BASE_URL).href);
const SHELL_SET = new Set(SHELL_URLS);

self.addEventListener('install', event => {
  // An incomplete download rejects installation. A previous worker remains
  // usable; the new version waits for closed tabs or an explicit user refresh.
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL_URLS);
    const status = await verifyOffline();
    if (!status.ready) throw new Error(`Invalid offline shell: ${status.missing.join(', ')}`);
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith(CACHE_NAMESPACE) && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function shellNavigation(request) {
  const cache = await caches.open(CACHE_NAME);
  // A controlled page uses the installed HTML/module pair, even when a newer
  // release is online. Its new worker stages a complete shell in a new cache.
  // Query strings and deep navigation do not select a different app version.
  const cached = await cache.match(new URL('./index.html', BASE_URL).href)
    || await cache.match(BASE_URL.href);
  if (validShellResponse(cached, './index.html')) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) return response;
  } catch {
    // Network unavailable: use this installed version's local shell.
  }
  return new Response(
    'NeighborReady is not available offline yet. Reconnect and open the app once to save its files.',
    { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== BASE_URL.origin || !url.pathname.startsWith(BASE_URL.pathname)) return;
  if (request.mode === 'navigate') {
    event.respondWith(shellNavigation(request));
    return;
  }
  if (SHELL_SET.has(url.href)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      // Runtime downloads do not silently repair an older version with newer
      // modules. Verification will report any missing installed-shell asset.
      return await cache.match(request) || fetch(request);
    })());
  }
});

function validShellResponse(response, path) {
  if (!response?.ok) return false;
  const contentType = (response.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
  // Static hosts sometimes return a 200 HTML fallback for absent modules. That
  // is not a usable cached script, stylesheet, image, or font.
  if (path === './' || path.endsWith('.html')) return contentType === 'text/html';
  if (path.endsWith('.js')) return ['text/javascript', 'application/javascript', 'text/ecmascript', 'application/ecmascript'].includes(contentType);
  if (path.endsWith('.css')) return contentType === 'text/css';
  if (path.endsWith('.svg')) return contentType === 'image/svg+xml';
  if (path.endsWith('.png')) return contentType === 'image/png';
  if (path.endsWith('.webmanifest')) return ['application/manifest+json', 'application/json'].includes(contentType);
  if (path.endsWith('.woff2')) return ['font/woff2', 'application/font-woff2', 'application/octet-stream'].includes(contentType);
  return false;
}

async function verifyOffline() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const responses = await Promise.all(SHELL_URLS.map(url => cache.match(url)));
    const missing = SHELL_PATHS.filter((path, index) => !validShellResponse(responses[index], path));
    return { type: 'OFFLINE_STATUS', ready: missing.length === 0, version: VERSION, missing };
  } catch {
    return { type: 'OFFLINE_STATUS', ready: false, version: VERSION, missing: [...SHELL_PATHS] };
  }
}

self.addEventListener('message', event => {
  if (event.origin && event.origin !== BASE_URL.origin) return;
  if (event.source?.url) {
    const source = new URL(event.source.url);
    if (source.origin !== BASE_URL.origin || !source.pathname.startsWith(BASE_URL.pathname)) return;
  }
  if (event.data?.type === 'VERIFY_OFFLINE') {
    event.waitUntil((async () => {
      const status = await verifyOffline();
      if (event.ports?.[0]) event.ports[0].postMessage(status);
      else event.source?.postMessage(status);
    })());
  } else if (event.data?.type === 'SKIP_WAITING') {
    event.waitUntil(self.skipWaiting());
  }
});
