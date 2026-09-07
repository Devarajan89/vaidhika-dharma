import { getUniqueSeoDescription } from '../data/seo-page-copy';

export const SITE_ORIGIN = 'https://vaidhikadharma.org';
export const OG_IMAGE_PATH = '/images/og-default.jpg';
export const SITE_LOGO_PATH = '/images/logo-512.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const SITE_LOGO_SIZE = 512;

export interface SeoHeadItem {
	tag: string;
	attrs?: Record<string, string | boolean | undefined>;
	content?: string;
}

export interface SeoHeadState {
	head: SeoHeadItem[];
	title: string;
	description?: string;
	slug: string;
	locale?: string;
	canonicalUrl: string;
	siteUrl: string;
	lastUpdated?: Date;
	isHome: boolean;
	noindex: boolean;
	documentTitle?: string;
}

const GENERIC_DESCRIPTION =
	/(?:^|\s+[—–-]\s+)svara-sahita[\s\S]*vaidhika dharma\.?$/i;

const HREFLANG_MAP: Record<string, string> = {
	sa: 'sa-Deva',
	en: 'sa-Latn',
};

export const SITE_TITLE = 'Vaidhika Dharma';

export const SIDDHANTA_PRELOAD: SeoHeadItem = {
	tag: 'link',
	attrs: {
		rel: 'preload',
		href: '/fonts/siddhanta.woff2',
		as: 'font',
		type: 'font/woff2',
		crossorigin: 'anonymous',
	},
};

export function isCollectionSlug(slug: string): boolean {
	const path = slugPath(slug).replace(/^iast\//, '');
	if (!path) return false;
	if (/(?:-samhita|-brahmana|-aranyaka)$/.test(path)) return true;
	if (/\/(?:mandala|kanda|panchika|ashtaka|aranyaka)-\d+$/.test(path)) return true;
	return /chapter-\d+-index$/.test(path);
}

export function slugPath(slug: string): string {
	if (!slug || slug === 'index') return '';
	if (slug === 'iast/index') return 'iast';
	return slug.replace(/^\/+|\/+$/g, '');
}

export function isHomeSlug(slug: string): boolean {
	const path = slugPath(slug);
	return path === '' || path === 'iast';
}

export function isNoIndexSlug(slug: string): boolean {
	const path = slugPath(slug);
	return (
		/(^|\/)offline$/.test(path) ||
		/(^|\/)404$/.test(path) ||
		path.split('/').includes('_archive')
	);
}

export function isSearchSlug(slug: string): boolean {
	return /(^|\/)search$/.test(slugPath(slug));
}

export function defaultLocaleUrl(slug: string, siteUrl: string): string {
	const path = slugPath(slug);
	if (path === 'iast') return new URL('/', siteUrl).href;
	if (path.startsWith('iast/')) {
		const stripped = path.slice('iast/'.length);
		return new URL(stripped ? `/${stripped}/` : '/', siteUrl).href;
	}
	return new URL(path === '' ? '/' : `/${path}/`, siteUrl).href;
}

export function isIastSlug(slug: string, locale?: string): boolean {
	return locale === 'iast' || slugPath(slug).startsWith('iast');
}

export function localeHomePath(isIast: boolean): string {
	return isIast ? 'iast/' : '/';
}

export function absoluteUrl(path: string, siteUrl: string): string {
	return new URL(path.replace(/^\//, ''), siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`).href;
}

export function ogImageUrl(siteUrl: string): string {
	return absoluteUrl(OG_IMAGE_PATH.replace(/^\//, ''), siteUrl);
}

export function truncateMeta(text: string, max = 168): string {
	if (text.length <= max) return text;
	return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

export function isThinDescription(title: string, description?: string): boolean {
	const trimmed = description?.trim() ?? '';
	if (!trimmed) return true;
	if (trimmed === title) return true;
	if (trimmed.length < 48) return true;
	return GENERIC_DESCRIPTION.test(trimmed);
}

export function buildSeoDescription(
	title: string,
	description: string | undefined,
	slug: string,
	isIast: boolean,
	seriesName?: string | null
): string {
	const unique = getUniqueSeoDescription(slug);
	if (unique) return truncateMeta(unique);

	const script = isIast
		? 'IAST transliteration with Vedic svara'
		: 'Devanagari with Vedic svara';

	if (!isThinDescription(title, description)) {
		const existing = description!.trim().replace(/\s+/g, ' ');
		if (/svara|transliter/i.test(existing)) return truncateMeta(existing);
		return truncateMeta(`${existing} ${script}.`);
	}

	const parts = [title];
	if (seriesName && !title.toLowerCase().includes(seriesName.split(' ')[0].toLowerCase())) {
		parts.push(seriesName);
	}
	return truncateMeta(`${parts.join(' — ')}. ${script}.`);
}

function titleAlreadyHasSeries(title: string, series: string): boolean {
	const normalizedTitle = title.normalize('NFC').toLowerCase();
	const tokens = series
		.split(/[()—,–-]/)
		.map((part) => part.trim().normalize('NFC').toLowerCase())
		.filter((part) => part.length >= 4);
	return tokens.some((token) => normalizedTitle.includes(token));
}

export function buildDocumentTitle(
	title: string,
	slug: string,
	seriesTitle?: string | null
): string {
	if (isHomeSlug(slug) || !seriesTitle) return title;
	if (titleAlreadyHasSeries(title, seriesTitle)) return title;
	return `${title} — ${seriesTitle}`;
}

function upsertMeta(
	head: SeoHeadItem[],
	attrKey: 'name' | 'property',
	attrValue: string,
	content: string
): void {
	const entry: SeoHeadItem = {
		tag: 'meta',
		attrs: { [attrKey]: attrValue, content },
	};
	const index = head.findIndex((item) => item.tag === 'meta' && item.attrs?.[attrKey] === attrValue);
	if (index >= 0) head[index] = entry;
	else head.push(entry);
}

function patchHreflang(head: SeoHeadItem[]): void {
	for (let index = 0; index < head.length; index += 1) {
		const item = head[index];
		if (item.tag !== 'link' || item.attrs?.rel !== 'alternate') continue;
		const current = item.attrs.hreflang;
		if (typeof current !== 'string') continue;
		const mapped = HREFLANG_MAP[current];
		if (!mapped) continue;
		head[index] = { tag: 'link', attrs: { ...item.attrs, hreflang: mapped } };
	}
}

function patchDocumentTitle(head: SeoHeadItem[], documentTitle: string, siteName: string): void {
	const content = documentTitle === siteName ? siteName : `${documentTitle} | ${siteName}`;
	const index = head.findIndex((item) => item.tag === 'title');
	const entry: SeoHeadItem = { tag: 'title', content };
	if (index >= 0) head[index] = entry;
	else head.push(entry);
}

export function applySeoHead(state: SeoHeadState): void {
	const { head } = state;
	const description = state.description ?? '';
	const documentTitle = state.documentTitle ?? state.title;
	const robots = state.noindex
		? 'noindex, follow'
		: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
	const image = ogImageUrl(state.siteUrl);
	const ogLocale = state.isHome || !isIastSlug(state.slug, state.locale) ? 'sa_IN' : 'en_US';
	const ogLocaleAlternate = ogLocale === 'sa_IN' ? 'en_US' : 'sa_IN';

	patchDocumentTitle(head, documentTitle, SITE_TITLE);
	upsertMeta(head, 'name', 'description', description);
	upsertMeta(head, 'property', 'og:description', description);
	upsertMeta(head, 'property', 'og:title', documentTitle);
	upsertMeta(head, 'property', 'og:type', state.isHome ? 'website' : 'article');
	upsertMeta(head, 'property', 'og:url', state.canonicalUrl);
	upsertMeta(head, 'property', 'og:site_name', SITE_TITLE);
	upsertMeta(head, 'property', 'og:locale', ogLocale);
	upsertMeta(head, 'property', 'og:locale:alternate', ogLocaleAlternate);
	upsertMeta(head, 'property', 'og:image', image);
	upsertMeta(head, 'property', 'og:image:secure_url', image);
	upsertMeta(head, 'property', 'og:image:type', 'image/jpeg');
	upsertMeta(head, 'property', 'og:image:width', String(OG_IMAGE_WIDTH));
	upsertMeta(head, 'property', 'og:image:height', String(OG_IMAGE_HEIGHT));
	upsertMeta(head, 'property', 'og:image:alt', 'Vaidhika Dharma — Vedic mantras and nityakarma');
	upsertMeta(head, 'name', 'twitter:card', 'summary_large_image');
	upsertMeta(head, 'name', 'twitter:title', documentTitle);
	upsertMeta(head, 'name', 'twitter:description', description);
	upsertMeta(head, 'name', 'twitter:image', image);
	upsertMeta(head, 'name', 'robots', robots);
	upsertMeta(head, 'name', 'googlebot', robots);

	if (state.lastUpdated) {
		const iso = state.lastUpdated.toISOString();
		upsertMeta(head, 'property', 'article:modified_time', iso);
		upsertMeta(head, 'property', 'og:updated_time', iso);
	}

	patchHreflang(head);
	upsertHreflang(head, 'x-default', defaultLocaleUrl(state.slug, state.siteUrl));
}

function upsertHreflang(head: SeoHeadItem[], hreflang: string, href: string): void {
	const entry: SeoHeadItem = {
		tag: 'link',
		attrs: { rel: 'alternate', hreflang, href },
	};
	const index = head.findIndex(
		(item) =>
			item.tag === 'link' && item.attrs?.rel === 'alternate' && item.attrs?.hreflang === hreflang
	);
	if (index >= 0) head[index] = entry;
	else head.push(entry);
}
