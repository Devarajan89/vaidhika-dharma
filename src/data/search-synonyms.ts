import type { HomeLocale } from './home';

export interface SearchSynonym {
	/** Latin / colloquial queries that should resolve to this entry. */
	aliases: string[];
	/** Term passed to Pagefind after synonym expansion. */
	query: string;
	label: Record<HomeLocale, string>;
	href: Record<HomeLocale, string>;
}

/** Colloquial / transliteration aliases → canonical pages and Pagefind terms. */
export const SEARCH_SYNONYMS: SearchSynonym[] = [
	{
		aliases: ['rudram', 'rudra', 'rudraprashna', 'rudra prashna', 'namakam', 'श्रीरुद्र', 'रुद्रम्'],
		query: 'rudra',
		label: { root: 'श्री रुद्र प्रश्नः', iast: 'Śrī Rudra Praśnaḥ' },
		href: { root: '/sri-rudra-prashnah/', iast: '/iast/sri-rudra-prashnah/' },
	},
	{
		aliases: ['chamakam', 'chamaka', 'चमकम्'],
		query: 'chamakam',
		label: { root: 'चमकम्', iast: 'Chamakam' },
		href: { root: '/chamakam/', iast: '/iast/chamakam/' },
	},
	{
		aliases: ['purusha', 'purushasuktam', 'purusa', 'पुरुषसूक्त'],
		query: 'purusha',
		label: { root: 'पुरुष सूक्तम्', iast: 'Puruṣa Sūktam' },
		href: { root: '/purusha-suktam/', iast: '/iast/purusha-suktam/' },
	},
	{
		aliases: ['srisuktam', 'sri suktam', 'shrisuktam', 'श्रीसूक्त'],
		query: 'sri suktam',
		label: { root: 'श्री सूक्तम्', iast: 'Śrī Sūktam' },
		href: { root: '/sri-suktam/', iast: '/iast/sri-suktam/' },
	},
	{
		aliases: ['narayana', 'narayanasuktam', 'नारायणसूक्त'],
		query: 'narayana',
		label: { root: 'नारायण सूक्तम्', iast: 'Nārāyaṇa Sūktam' },
		href: { root: '/narayana-suktam/', iast: '/iast/narayana-suktam/' },
	},
	{
		aliases: ['sandhya', 'sandhyavandanam', 'sandhyavandana', 'सन्ध्या', 'सन्ध्यावन्दनम्'],
		query: 'sandhya',
		label: { root: 'आश्वलायन प्रातः सन्ध्या', iast: 'Aśvalāyana prātaḥ sandhyā' },
		href: {
			root: '/aswalayana-sandhyavandanam/prata/',
			iast: '/iast/aswalayana-sandhyavandanam/prata/',
		},
	},
	{
		aliases: ['gayatri', 'gayathri', 'गायत्री'],
		query: 'gayatri',
		label: { root: 'आश्वलायन प्रातः सन्ध्या', iast: 'Aśvalāyana prātaḥ sandhyā' },
		href: {
			root: '/aswalayana-sandhyavandanam/prata/',
			iast: '/iast/aswalayana-sandhyavandanam/prata/',
		},
	},
	{
		aliases: ['brahmayajna', 'brahmayagyam', 'ब्रह्मयज्ञ'],
		query: 'brahmayaj',
		label: { root: 'आश्वलायन ब्रह्मयज्ञम्', iast: 'Aśvalāyana brahmayajñam' },
		href: { root: '/aswalayana-brahmayagyam/', iast: '/iast/aswalayana-brahmayagyam/' },
	},
	{
		aliases: ['samidadhanam', 'samidhadhana', 'समिदाधान'],
		query: 'samidadhanam',
		label: { root: 'आश्वलायन समिदाधानम्', iast: 'Aśvalāyana samidādhānam' },
		href: { root: '/aswalayana-samidadhanam/', iast: '/iast/aswalayana-samidadhanam/' },
	},
	{
		aliases: ['rigveda', 'rgveda', 'rik', 'ऋग्वेद'],
		query: 'rigveda',
		label: { root: 'ऋग्वेद संहिता', iast: 'Ṛgveda Saṃhitā' },
		href: { root: '/rigveda-samhita/', iast: '/iast/rigveda-samhita/' },
	},
	{
		aliases: ['isha', 'isavasya', 'ishavasya', 'ईश', 'ईशावास्य'],
		query: 'isha',
		label: { root: 'ईशावास्योपनिषद्', iast: 'Īśāvāsyopaniṣad' },
		href: { root: '/isha-upanishad/', iast: '/iast/isha-upanishad/' },
	},
	{
		aliases: ['pancha rudram', 'pancarudra', 'पञ्चरुद्रम्'],
		query: 'pancha rudram',
		label: { root: 'पञ्च रुद्रम्', iast: 'Pañca Rudram' },
		href: { root: '/pancha-rudram/', iast: '/iast/pancha-rudram/' },
	},
];

/** Featured chips shown when the search dialog opens (empty query). */
export const SEARCH_FEATURED_HINTS: Array<{
	alias: string;
	label: Record<HomeLocale, string>;
	href: Record<HomeLocale, string>;
}> = [
	{
		alias: 'rudram',
		label: { root: 'रुद्रम् → श्री रुद्र', iast: 'rudram → Śrī Rudra' },
		href: { root: '/sri-rudra-prashnah/', iast: '/iast/sri-rudra-prashnah/' },
	},
	{
		alias: 'sandhya',
		label: { root: 'सन्ध्या', iast: 'sandhyā' },
		href: {
			root: '/aswalayana-sandhyavandanam/prata/',
			iast: '/iast/aswalayana-sandhyavandanam/prata/',
		},
	},
	{
		alias: 'purusha',
		label: { root: 'पुरुष सूक्तम्', iast: 'puruṣa sūktam' },
		href: { root: '/purusha-suktam/', iast: '/iast/purusha-suktam/' },
	},
	{
		alias: 'chamakam',
		label: { root: 'चमकम्', iast: 'chamakam' },
		href: { root: '/chamakam/', iast: '/iast/chamakam/' },
	},
];

function normalizeQuery(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^\p{L}\p{N}\s]+/gu, ' ')
		.replace(/\s+/g, ' ');
}

/** Expand a typed query via the synonym table; returns the original term when unmatched. */
export function resolveSearchTerm(term: string): string {
	const normalized = normalizeQuery(term);
	if (!normalized) return term;

	for (const entry of SEARCH_SYNONYMS) {
		for (const alias of entry.aliases) {
			if (normalizeQuery(alias) === normalized) return entry.query;
		}
	}

	for (const entry of SEARCH_SYNONYMS) {
		for (const alias of entry.aliases) {
			const aliasNorm = normalizeQuery(alias);
			if (aliasNorm.length >= 4 && (normalized.startsWith(aliasNorm) || aliasNorm.startsWith(normalized))) {
				return entry.query;
			}
		}
	}

	return term;
}

export function matchSearchSynonyms(term: string, limit = 5): SearchSynonym[] {
	const normalized = normalizeQuery(term);
	if (!normalized || normalized.length < 2) return [];

	const matches: SearchSynonym[] = [];
	for (const entry of SEARCH_SYNONYMS) {
		const hit = entry.aliases.some((alias) => {
			const aliasNorm = normalizeQuery(alias);
			return aliasNorm.includes(normalized) || normalized.includes(aliasNorm);
		});
		if (hit) {
			matches.push(entry);
			if (matches.length >= limit) break;
		}
	}
	return matches;
}
