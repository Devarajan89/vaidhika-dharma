import type { HomeLocale } from './home';
import type { SamhitaPageNavLinks } from '../lib/samhita-nav';
import toc from './yajusha/yajusha-toc.json';

export interface YajushaKhanda {
	id: string;
	rootTitle: string;
	iastTitle: string;
	bookPage?: number;
}

export interface YajushaTocEntry {
	order: number;
	id: string;
	rootTitle: string;
	iastTitle: string;
	khanda: string;
	bookPage?: number;
	/** Page slug without locale prefix. Defaults to `id`. */
	target?: string;
}

interface YajushaTocFile {
	khandas: YajushaKhanda[];
	entries: YajushaTocEntry[];
}

const data = toc as YajushaTocFile;

export const YAJUSHA_KHANDAS = data.khandas;
export const YAJUSHA_TOC = data.entries;

export function getYajushaEntry(id: string): YajushaTocEntry | undefined {
	return YAJUSHA_TOC.find((entry) => entry.id === id);
}

function localePrefix(locale: HomeLocale): string {
	return locale === 'iast' ? '/iast' : '';
}

export function yajushaBookHref(locale: HomeLocale): string {
	return `${localePrefix(locale)}/yajusha-mantra-ratnakaram/`;
}

export function yajushaKhandaHref(khandaId: string, locale: HomeLocale): string {
	return `${localePrefix(locale)}/yajusha-mantra-ratnakaram/${khandaId}/`;
}

export function yajushaHref(entry: YajushaTocEntry, locale: HomeLocale): string {
	const raw = entry.target ?? entry.id;
	const [slug, hash] = raw.split('#');
	const path = `${localePrefix(locale)}/${slug}/`;
	return hash ? `${path}#${hash}` : path;
}

export function getYajushaKhanda(id: string): YajushaKhanda | undefined {
	return YAJUSHA_KHANDAS.find((khanda) => khanda.id === id);
}

export function yajushaKhandaEntries(khandaId: string): YajushaTocEntry[] {
	return YAJUSHA_TOC.filter((entry) => entry.khanda === khandaId);
}

export function yajushaCategoryNodes(
	locale: HomeLocale
): Array<{ label: string; defaultOpen: false; children: Array<{ label: string; href: string }> }> {
	return YAJUSHA_KHANDAS.map((khanda) => ({
		label: locale === 'iast' ? khanda.iastTitle : khanda.rootTitle,
		defaultOpen: false,
		children: [
			{
				label: locale === 'iast' ? 'Khaṇḍa index' : 'खण्डसूची',
				href: yajushaKhandaHref(khanda.id, locale),
			},
			...yajushaKhandaEntries(khanda.id).map((entry) => ({
				label: locale === 'iast' ? entry.iastTitle : entry.rootTitle,
				href: yajushaHref(entry, locale),
			})),
		],
	}));
}

export function yajushaSearchSynonyms(): Array<{
	aliases: string[];
	query: string;
	label: Record<HomeLocale, string>;
	href: Record<HomeLocale, string>;
}> {
	const seen = new Set<string>();
	const book = [
		{
			aliases: [
				'yajusha',
				'yajusha mantra ratnakaram',
				'yajusha mantra ratnakara',
				'याजुष मन्त्र रत्नाकरम्',
			],
			query: 'yajusha mantra ratnakaram',
			label: { root: 'याजुष मन्त्र रत्नाकरम्', iast: 'Yājuṣa Mantra Ratnākaram' },
			href: { root: yajushaBookHref('root'), iast: yajushaBookHref('iast') },
		},
	];
	return [
		...book,
		...YAJUSHA_TOC.flatMap((entry) => {
			const href = yajushaHref(entry, 'root');
			if (seen.has(href)) return [];
			seen.add(href);
			const spaced = entry.id.replace(/-/g, ' ');
			return [
				{
					aliases: [...new Set([spaced, entry.rootTitle, entry.iastTitle])],
					query: spaced,
					label: { root: entry.rootTitle, iast: entry.iastTitle },
					href: { root: href, iast: yajushaHref(entry, 'iast') },
				},
			];
		}),
	];
}

export function yajushaSegmentLabels(): Record<string, string> {
	return {
		'yajusha-mantra-ratnakaram': 'Yājuṣa Mantra Ratnākaram',
		...Object.fromEntries(YAJUSHA_KHANDAS.map((khanda) => [khanda.id, khanda.iastTitle])),
		...Object.fromEntries(YAJUSHA_TOC.map((entry) => [entry.id, entry.iastTitle])),
	};
}

export function yajushaPeerSlugs(limit = 10): string[] {
	const seen = new Set<string>();
	const peers: string[] = [];
	for (const entry of YAJUSHA_TOC) {
		const slug = (entry.target ?? entry.id).split('#')[0];
		if (seen.has(slug)) continue;
		seen.add(slug);
		peers.push(slug);
		if (peers.length >= limit) break;
	}
	return peers;
}

export function getYajushaPageNav(id: string, locale: HomeLocale): SamhitaPageNavLinks {
	const index = YAJUSHA_TOC.findIndex((entry) => entry.id === id);
	const entry = index >= 0 ? YAJUSHA_TOC[index] : undefined;
	const khanda = YAJUSHA_KHANDAS.find((item) => item.id === entry?.khanda);
	const nav: SamhitaPageNavLinks = {
		index: {
			href: yajushaBookHref(locale),
			label: locale === 'iast' ? 'Yājuṣa index' : 'याजुष सूची',
		},
		start: {
			href: yajushaHref(YAJUSHA_TOC[0], locale),
			label: locale === 'iast' ? YAJUSHA_TOC[0].iastTitle : YAJUSHA_TOC[0].rootTitle,
		},
	};
	if (khanda) {
		nav.up = {
			href: yajushaKhandaHref(khanda.id, locale),
			label: locale === 'iast' ? khanda.iastTitle : khanda.rootTitle,
		};
	}
	if (index > 0) {
		const prev = YAJUSHA_TOC[index - 1];
		nav.prev = {
			href: yajushaHref(prev, locale),
			label: locale === 'iast' ? prev.iastTitle : prev.rootTitle,
		};
	}
	if (index >= 0 && index < YAJUSHA_TOC.length - 1) {
		const next = YAJUSHA_TOC[index + 1];
		nav.next = {
			href: yajushaHref(next, locale),
			label: locale === 'iast' ? next.iastTitle : next.rootTitle,
		};
	}
	if (entry) {
		nav.progress = {
			current: entry.order,
			total: YAJUSHA_TOC.length,
			context: locale === 'iast' ? 'Yājuṣa' : 'याजुष',
		};
	}
	return nav;
}

export function getYajushaKhandaPageNav(khandaId: string, locale: HomeLocale): SamhitaPageNavLinks {
	const khandaIndex = YAJUSHA_KHANDAS.findIndex((item) => item.id === khandaId);
	const khanda = khandaIndex >= 0 ? YAJUSHA_KHANDAS[khandaIndex] : undefined;
	const entries = yajushaKhandaEntries(khandaId);
	const nav: SamhitaPageNavLinks = {
		up: {
			href: yajushaBookHref(locale),
			label: locale === 'iast' ? 'Yājuṣa index' : 'याजुष सूची',
		},
		index: {
			href: yajushaBookHref(locale),
			label: locale === 'iast' ? 'Yājuṣa index' : 'याजुष सूची',
		},
	};
	if (entries[0]) {
		nav.start = {
			href: yajushaHref(entries[0], locale),
			label: locale === 'iast' ? entries[0].iastTitle : entries[0].rootTitle,
		};
	}
	if (khandaIndex > 0) {
		const prev = YAJUSHA_KHANDAS[khandaIndex - 1];
		nav.prev = {
			href: yajushaKhandaHref(prev.id, locale),
			label: locale === 'iast' ? prev.iastTitle : prev.rootTitle,
		};
	}
	if (khandaIndex >= 0 && khandaIndex < YAJUSHA_KHANDAS.length - 1) {
		const next = YAJUSHA_KHANDAS[khandaIndex + 1];
		nav.next = {
			href: yajushaKhandaHref(next.id, locale),
			label: locale === 'iast' ? next.iastTitle : next.rootTitle,
		};
	}
	if (khanda) {
		nav.progress = {
			current: khandaIndex + 1,
			total: YAJUSHA_KHANDAS.length,
			context: locale === 'iast' ? khanda.iastTitle : khanda.rootTitle,
		};
	}
	return nav;
}

export function getYajushaBookPageNav(locale: HomeLocale): SamhitaPageNavLinks {
	const first = YAJUSHA_TOC[0];
	const firstKhanda = YAJUSHA_KHANDAS[0];
	return {
		start: first
			? {
					href: yajushaHref(first, locale),
					label: locale === 'iast' ? first.iastTitle : first.rootTitle,
				}
			: undefined,
		next: firstKhanda
			? {
					href: yajushaKhandaHref(firstKhanda.id, locale),
					label: locale === 'iast' ? firstKhanda.iastTitle : firstKhanda.rootTitle,
				}
			: undefined,
	};
}

export function yajushaSidebarGroup() {
	return {
		label: 'याजुष मन्त्र रत्नाकरम्',
		translations: { 'sa-Latn': 'Yājuṣa Mantra Ratnākaram' },
		collapsed: true,
		items: [
			{
				label: 'सूची',
				translations: { 'sa-Latn': 'Sūcī' },
				link: yajushaBookHref('root'),
			},
			...YAJUSHA_KHANDAS.map((khanda) => ({
				label: khanda.rootTitle,
				translations: { 'sa-Latn': khanda.iastTitle },
				collapsed: true,
				items: [
					{
						label: 'सूची',
						translations: { 'sa-Latn': 'Sūcī' },
						link: yajushaKhandaHref(khanda.id, 'root'),
					},
					...yajushaKhandaEntries(khanda.id).map((entry) => ({
						label: entry.rootTitle,
						translations: { 'sa-Latn': entry.iastTitle },
						link: yajushaHref(entry, 'root'),
					})),
				],
			})),
		],
	};
}
