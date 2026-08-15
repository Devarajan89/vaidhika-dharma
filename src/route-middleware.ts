import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import {
	applySeoHead,
	buildSeoDescription,
	isHomeSlug,
	isIastSlug,
	isNoIndexSlug,
	slugPath,
	type SeoHeadItem,
} from './lib/seo';
import { getSeriesName } from './lib/structured-data';

export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	const overviewLink = route.toc?.items[0];
	if (overviewLink) {
		overviewLink.text = route.entry.data.title;
	}

	const slug = String(route.entry.data.slug ?? route.entry.id);
	const path = slugPath(slug);
	const site = context.site ?? new URL('https://vaidhikadharma.org');
	const canonicalPath = path === '' ? '/' : `/${path}/`;
	const canonicalUrl = new URL(canonicalPath.replace(/\/+/g, '/'), site).href;
	const isIast = isIastSlug(slug, route.locale);
	const description = buildSeoDescription(
		route.entry.data.title,
		route.entry.data.description,
		slug,
		isIast,
		getSeriesName(slug)
	);

	applySeoHead({
		head: route.head as unknown as SeoHeadItem[],
		title: route.entry.data.title,
		description,
		slug,
		locale: route.locale,
		canonicalUrl,
		siteUrl: site.href,
		lastUpdated: route.lastUpdated,
		isHome: isHomeSlug(slug),
		noindex: isNoIndexSlug(slug),
	});
});
