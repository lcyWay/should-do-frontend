const staticCacheName = 's-app-v1';

const assetUrls = [
  '/662957.png',
  '/blank-check-box.svg',
  '/book.svg',
  '/check-box.svg',
  '/delete.svg',
  '/home.svg',
  '/menu-dark.svg',
  '/menu.svg',
  '/moon.svg',
  '/plus.svg',
  '/registration.svg',
  '/report.svg',
  '/sun.svg',
  '/user.svg',
  '/watch.svg',
]

self.addEventListener("install", async function (event) {
  const cache = await caches.open(staticCacheName)
  await cache.addAll(assetUrls)
});

self.addEventListener('fetch', event => {
  const { request } = event

  const url = new URL(request.url)
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request))
  }
})

async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached ?? await fetch(request)
}
