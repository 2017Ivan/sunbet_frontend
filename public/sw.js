const CACHE_NAME = 'sunbet-pwa-v1'
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/sunbet_logo.svg',
  '/icons/sunbet-192.png',
  '/icons/sunbet-512.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(cacheName => cacheName.startsWith('sunbet-pwa-') && cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const requestUrl = new URL(request.url)

  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => (
        await caches.match('/')
        || Response.error()
      ))
    )
    return
  }

  if (
    requestUrl.pathname.startsWith('/assets/')
    || requestUrl.pathname === '/sunbet_logo.svg'
    || requestUrl.pathname === '/manifest.webmanifest'
    || requestUrl.pathname.startsWith('/icons/')
  ) {
    event.respondWith(
      caches.match(request).then(async (cachedResponse) => {
        if (cachedResponse) return cachedResponse

        const response = await fetch(request)
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME)
          await cache.put(request, response.clone())
        }
        return response
      })
    )
  }
})
