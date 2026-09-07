import type { HomeLocale } from '../data/home';
import { SEARCH_FEATURED_HINTS, SEARCH_SYNONYMS } from '../data/search-synonyms';
import { resolveCitationQuery } from './citation-search';

export type SearchHitGroup = 'citation' | 'ritual' | 'mantra' | 'samhita' | 'upanishad' | 'other';

export interface SiteSearchHit {
	title: string;
	href: string;
	detail?: string;
	group?: SearchHitGroup;
}

export const SEARCH_GROUP_LABELS: Record<HomeLocale, Record<SearchHitGroup, string>> = {
	root: {
		citation: 'उल्लेखः',
		ritual: 'नित्यकर्म',
		mantra: 'मन्त्राः',
		samhita: 'संहिताः',
		upanishad: 'उपनिषदः',
		other: 'अन्यत्',
	},
	iast: {
		citation: 'Citation',
		ritual: 'Nityakarma',
		mantra: 'Mantras',
		samhita: 'Saṃhitā',
		upanishad: 'Upaniṣad',
		other: 'Other',
	},
};

const GROUP_ORDER: SearchHitGroup[] = [
	'citation',
	'ritual',
	'mantra',
	'samhita',
	'upanishad',
	'other',
];

function normalize(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
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
	if (/(samhita|brahmana|aranyaka)\//.test(path)) return 'samhita';
	if (/suktam|prashnah|chamakam|laghunyasa|atharvasirsham|prarthana|pancha-rudram|richah|mantrah/.test(path)) {
		return 'mantra';
	}
	return 'other';
}

export function groupSearchHits(
	hits: SiteSearchHit[],
	locale: HomeLocale
): Array<{ group: SearchHitGroup; label: string; hits: SiteSearchHit[] }> {
	const buckets = new Map<SearchHitGroup, SiteSearchHit[]>();
	for (const hit of hits) {
		const group = searchHitGroup(hit.href, hit.group);
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

export function searchSitePages(
	query: string,
	locale: HomeLocale,
	slugToTitle: Record<string, string>,
	limit = 40
): SiteSearchHit[] {
	const citations = resolveCitationQuery(query, locale);
	const normalized = normalize(query);
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
				const aliasNorm = normalize(alias);
				return aliasNorm.includes(normalized) || normalized.includes(aliasNorm);
			});
			const queryHit = normalize(entry.query).includes(normalized);
			if (aliasHit || queryHit) {
				push(entry.label[locale], entry.href[locale], entry.aliases.slice(0, 3).join(', '));
			}
			if (hits.length >= limit) return hits;
		}

		for (const [slug, title] of Object.entries(slugToTitle)) {
			const path = slug.replace(/^\/+|\/+$/g, '');
			if (!path || path === 'offline' || path === 'iast/offline') continue;
			if (path.includes('_archive')) continue;
			if (/(^|\/)search$/.test(path)) continue;

			const isIastDoc = path === 'iast' || path.startsWith('iast/');
			if (locale === 'iast' ? !isIastDoc : isIastDoc) continue;

			const haystack = normalize(`${title} ${path}`);
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
