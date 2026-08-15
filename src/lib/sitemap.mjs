const HUB_RE =
	/\/(?:rigveda-samhita|kanva-samhita|madhyandina-samhita|taittiriya-samhita|maitrayani-samhita|aitareya-brahmana|taittiriya-brahmana|aitareya-aranyaka|taittiriya-aranyaka|[\w-]+-upanishad|[\w-]+-suktam|sri-rudra-prashnah|chamakam|aswalayana-[\w/-]+|apastamba-[\w/-]+)\/?$/;

export const sitemapI18n = {
	defaultLocale: 'sa',
	locales: {
		sa: 'sa-Deva',
		iast: 'sa-Latn',
	},
};

export function sitemapFilter(page) {
	return !page.includes('/404') && !page.includes('/offline');
}

export function serializeSitemapItem(item) {
	let path;
	try {
		path = new URL(item.url).pathname;
	} catch {
		return undefined;
	}

	if (path.includes('/offline') || path.includes('/404')) return undefined;

	const depth = path.split('/').filter(Boolean).length;
	const isHome = path === '/' || path === '/iast/';
	const isHub = depth <= 1 || HUB_RE.test(path);

	return {
		...item,
		lastmod: new Date().toISOString(),
		changefreq: isHome || isHub ? 'weekly' : 'monthly',
		priority: isHome ? 1.0 : isHub ? 0.8 : Math.max(0.3, Number((0.65 - depth * 0.08).toFixed(1))),
	};
}
