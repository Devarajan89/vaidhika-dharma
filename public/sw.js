/* Vaidhika Dharma offline pack — nityakarma + favorite texts */
const CACHE_NAME = 'vd-offline-v2';
const FALLBACK_URL = '/offline/';

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			let pack = { urls: ['/', '/iast/', FALLBACK_URL], assets: ['/manifest.webmanifest', '/images/favicon.svg'] };
			try {
				const response = await fetch('/offline-pack.json', { cache: 'no-cache' });
				if (response.ok) pack = await response.json();
			} catch {
				/* use defaults */
			}

			const targets = [...new Set([...(pack.urls || []), ...(pack.assets || []), FALLBACK_URL])];
			await Promise.all(
				targets.map(async (url) => {
					try {
						await cache.add(url);
					} catch {
						/* skip missing optional routes during partial deploys */
					}
				})
			);
			await self.skipWaiting();
		})()
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
			await self.clients.claim();
		})()
	);
});

/**
 * @param {Request} request
 * @param {Response} response
 */
async function putInCache(request, response) {
	if (!response || !response.ok) return;
	const cache = await caches.open(CACHE_NAME);
	await cache.put(request, response.clone());
}

self.addEventListener('message', (event) => {
	const data = event.data;
	if (!data || data.type !== 'CACHE_URLS' || !Array.isArray(data.urls)) return;
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			await Promise.all(
				data.urls.map(async (url) => {
					try {
						await cache.add(url);
					} catch {
						/* skip missing routes */
					}
				})
			);
			if (event.ports && event.ports[0]) {
				event.ports[0].postMessage({ ok: true });
			}
		})()
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;

	if (request.mode === 'navigate') {
		event.respondWith(
			(async () => {
				try {
					const networkResponse = await fetch(request);
					void putInCache(request, networkResponse);
					return networkResponse;
				} catch {
					const cached = await caches.match(request, { ignoreSearch: true });
					return cached || (await caches.match(FALLBACK_URL)) || Response.error();
				}
			})()
		);
		return;
	}

	if (
		url.pathname.startsWith('/fonts/') ||
		url.pathname.startsWith('/vendor/') ||
		url.pathname.startsWith('/images/') ||
		url.pathname.startsWith('/_astro/') ||
		url.pathname === '/manifest.webmanifest' ||
		url.pathname === '/offline-pack.json'
	) {
		event.respondWith(
			(async () => {
				const cached = await caches.match(request);
				const networkPromise = fetch(request)
					.then((response) => {
						void putInCache(request, response);
						return response;
					})
					.catch(() => cached);
				return cached || networkPromise;
			})()
		);
	}
});
