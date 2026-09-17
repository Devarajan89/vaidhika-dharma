import type { HomeLocale } from '../data/home';
import { SEARCH_FEATURED_HINTS, SEARCH_SYNONYMS } from '../data/search-synonyms';
import { resolveCitationQuery } from './citation-search';

export type SearchHitGroup =
	| 'citation'
	| 'verse'
	| 'ritual'
	| 'mantra'
	| 'samhita'
	| 'brahmana'
	| 'aranyaka'
	| 'upanishad'
	| 'other';

export interface SiteSearchHit {
	title: string;
	href: string;
	detail?: string;
	group?: SearchHitGroup;
}

/** Compact verse row: mandala, sukta, verse, normalized Devanagari, normalized IAST. */
export type VerseSearchRow = [number, number, number, string, string];

export const SEARCH_GROUP_LABELS: Record<HomeLocale, Record<SearchHitGroup, string>> = {
	root: {
		citation: 'उल्लेखः',
		verse: 'मन्त्रपाठः',
		ritual: 'नित्यकर्म',
		mantra: 'मन्त्राः',
		samhita: 'संहिताः',
		brahmana: 'ब्राह्मणाः',
		aranyaka: 'आरण्यकानि',
		upanishad: 'उपनिषदः',
		other: 'अन्यत्',
	},
	iast: {
		citation: 'Citation',
		verse: 'Mantra text',
		ritual: 'Nityakarma',
		mantra: 'Mantras',
		samhita: 'Saṃhitā',
		brahmana: 'Brāhmaṇa',
		aranyaka: 'Āraṇyaka',
		upanishad: 'Upaniṣad',
		other: 'Other',
	},
};

export const SEARCH_FILTERS: Array<SearchHitGroup | 'all'> = [
	'all',
	'ritual',
	'mantra',
	'samhita',
	'brahmana',
	'aranyaka',
	'upanishad',
];

const GROUP_ORDER: SearchHitGroup[] = [
	'citation',
	'verse',
	'ritual',
	'mantra',
	'samhita',
	'brahmana',
	'aranyaka',
	'upanishad',
	'other',
];

export function normalizeSearch(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[\u0951-\u0954\u1CD0-\u1CFF\uA8E0-\uA8FF]/g, '')
		.replace(/[^\p{L}\p{N}\s]+/gu, ' ')
		.replace(/\s+/g, ' ');
}

function localePath(slug: string, locale: HomeLocale): string {
	const path = slug.replace(/^\/+|\/+$/g, '');
	if (!path) return locale === 'iast' ? '/iast/' : '/';
	const stripped = path.replace(/^iast\//, '');
	return locale === 'iast' ? `/iast/${stripped}/` : `/${stripped}/`;
}

export function searchHitGroup(href: string, explicit?: SearchHitGroup): SearchHitGroup {
	if (explicit) return explicit;
	const path = href.replace(/^\/iast\//, '/');
	if (/sandhyavandanam|brahmayagyam|samidadhanam/.test(path)) return 'ritual';
	if (/upanishad/.test(path)) return 'upanishad';
	if (/brahmana/.test(path)) return 'brahmana';
	if (/aranyaka/.test(path)) return 'aranyaka';
	if (/samhita/.test(path)) return 'samhita';
	if (/suktam|prashnah|chamakam|laghunyasa|atharvasirsham|prarthana|pancha-rudram|richah|mantrah/.test(path)) {
		return 'mantra';
	}
	return 'other';
}

function matchesFilter(group: SearchHitGroup, filter: SearchHitGroup | 'all'): boolean {
	if (filter === 'all') return true;
	if (group === filter) return true;
	if (filter === 'mantra' && group === 'verse') return true;
	if (filter === 'samhita' && (group === 'verse' || group === 'citation')) return true;
	return false;
}

export function groupSearchHits(
	hits: SiteSearchHit[],
	locale: HomeLocale,
	filter: SearchHitGroup | 'all' = 'all'
): Array<{ group: SearchHitGroup; label: string; hits: SiteSearchHit[] }> {
	const buckets = new Map<SearchHitGroup, SiteSearchHit[]>();
	for (const hit of hits) {
		const group = searchHitGroup(hit.href, hit.group);
		if (!matchesFilter(group, filter)) continue;
		const list = buckets.get(group) ?? [];
		list.push(hit);
		buckets.set(group, list);
	}
	return GROUP_ORDER.filter((group) => buckets.has(group)).map((group) => ({
		group,
		label: SEARCH_GROUP_LABELS[locale][group],
		hits: buckets.get(group) ?? [],
	}));
}

export function isSearchFilter(value: string | null | undefined): value is SearchHitGroup | 'all' {
	return Boolean(value && SEARCH_FILTERS.includes(value as SearchHitGroup | 'all'));
}

export function searchVerseRows(
	query: string,
	locale: HomeLocale,
	rows: VerseSearchRow[],
	limit = 12
): SiteSearchHit[] {
	const normalized = normalizeSearch(query);
	if (normalized.length < 3) return [];
	const prefix = locale === 'iast' ? '/iast' : '';
	const hits: SiteSearchHit[] = [];
	for (const [mandala, sukta, verse, deva, iast] of rows) {
		if (!deva.includes(normalized) && !iast.includes(normalized)) continue;
		const cite = `${mandala}.${sukta}.${verse}`;
		hits.push({
			title: locale === 'iast' ? `Ṛgveda ${cite}` : `ऋग्वेद ${cite}`,
			href: `${prefix}/rigveda-samhita/mandala-${mandala}/sukta-${sukta}/#mantra-${verse}`,
			detail: `RV ${cite}`,
			group: 'verse',
		});
		if (hits.length >= limit) break;
	}
	return hits;
}

export function searchSitePages(
	query: string,
	locale: HomeLocale,
	slugToTitle: Record<string, string>,
	limit = 40
): SiteSearchHit[] {
	const citations = resolveCitationQuery(query, locale);
	const normalized = normalizeSearch(query);
	if (normalized.length < 2 && citations.length === 0) return [];

	const hits: SiteSearchHit[] = [...citations];
	const seen = new Set(hits.map((hit) => hit.href));

	const push = (title: string, href: string, detail?: string, group?: SearchHitGroup) => {
		if (seen.has(href)) return;
		seen.add(href);
		hits.push({ title, href, detail, group: searchHitGroup(href, group) });
	};

	if (normalized.length >= 2) {
		for (const entry of SEARCH_SYNONYMS) {
			const aliasHit = entry.aliases.some((alias) => {
				const aliasNorm = normalizeSearch(alias);
				return aliasNorm.includes(normalized) || normalized.includes(aliasNorm);
			});
			const queryHit = normalizeSearch(entry.query).includes(normalized);
			if (aliasHit || queryHit) {
				push(entry.label[locale], entry.href[locale], entry.aliases.slice(0, 3).join(', '));
			}
			if (hits.length >= limit) return hits;
		}

		for (const [slug, title] of Object.entries(slugToTitle)) {
			const path = slug.replace(/^\/+|\/+$/g, '');
			if (!path || path.includes('_archive')) continue;
			if (/(^|\/)search$/.test(path)) continue;

			const isIastDoc = path === 'iast' || path.startsWith('iast/');
			if (locale === 'iast' ? !isIastDoc : isIastDoc) continue;

			const haystack = normalizeSearch(`${title} ${path}`);
			if (!haystack.includes(normalized)) continue;

			push(title, localePath(path, locale));
			if (hits.length >= limit) break;
		}
	}

	return hits;
}

export function featuredSearchHits(locale: HomeLocale): SiteSearchHit[] {
	return SEARCH_FEATURED_HINTS.map((hint) => ({
		title: hint.label[locale].split('→').pop()?.trim() ?? hint.label[locale],
		href: hint.href[locale],
		detail: hint.alias,
		group: searchHitGroup(hint.href[locale]),
	}));
}
