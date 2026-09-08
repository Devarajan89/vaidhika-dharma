import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import {
	applySeoHead,
	buildDocumentTitle,
	buildOgImageAlt,
	buildSeoDescription,
	isHomeSlug,
	isIastSlug,
	isNoIndexSlug,
	SIDDHANTA_PRELOAD,
	slugPath,
	type SeoHeadItem,
} from './lib/seo';
import { getSeriesName, getSeriesTitle } from './lib/structured-data';

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
	const seriesName = getSeriesName(slug);
	const documentTitle = buildDocumentTitle(route.entry.data.title, slug, getSeriesTitle(slug, isIast));
	const description = buildSeoDescription(
		documentTitle,
		route.entry.data.description,
		slug,
		isIast,
		seriesName
	);

	const head = route.head as unknown as SeoHeadItem[];
	if (!isIast && !head.some((item) => item.tag === 'link' && item.attrs?.href === SIDDHANTA_PRELOAD.attrs?.href)) {
		head.push(SIDDHANTA_PRELOAD);
	}

	applySeoHead({
		head,
		title: route.entry.data.title,
		documentTitle,
		description,
		slug,
		locale: route.locale,
		canonicalUrl,
		siteUrl: site.href,
		lastUpdated: route.lastUpdated,
		isHome: isHomeSlug(slug),
		noindex: isNoIndexSlug(slug),
		ogImageAlt: buildOgImageAlt(slug, route.entry.data.title, isIast, documentTitle),
	});
});
