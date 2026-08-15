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
		aliases: ['rudra suktam', 'rudrasuktam', 'रुद्र सूक्त'],
		query: 'rudra suktam',
		label: { root: 'रुद्र सूक्तम्', iast: 'Rudra Sūktam' },
		href: { root: '/rudra-suktam/', iast: '/iast/rudra-suktam/' },
	},
	{
		aliases: ['laghunyasa', 'laghu nyasa', 'rudra nyasa', 'लघुन्यास'],
		query: 'laghunyasa',
		label: { root: 'श्री रुद्र लघुन्यासः', iast: 'Śrī Rudra Laghunyāsaḥ' },
		href: { root: '/sri-rudra-laghunyasa/', iast: '/iast/sri-rudra-laghunyasa/' },
	},
	{
		aliases: ['atharvasirsha', 'ganapati atharvasirsha', 'ganesha atharvasirsha', 'अथर्वशीर्ष'],
		query: 'atharvasirsha',
		label: { root: 'गणपति अथर्वशीर्षम्', iast: 'Gaṇapati Atharvaśīrṣam' },
		href: { root: '/ganapathy-atharvasirsham/', iast: '/iast/ganapathy-atharvasirsham/' },
	},
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
	{
		aliases: ['durga', 'durgasuktam', 'durga suktam', 'दुर्गासूक्त'],
		query: 'durga',
		label: { root: 'दुर्गा सूक्तम्', iast: 'Durgā Sūktam' },
		href: { root: '/durga-suktam/', iast: '/iast/durga-suktam/' },
	},
	{
		aliases: ['vishnu', 'vishnusuktam', 'विष्णुसूक्त'],
		query: 'vishnu',
		label: { root: 'विष्णु सूक्तम्', iast: 'Viṣṇu Sūktam' },
		href: { root: '/vishnu-suktam/', iast: '/iast/vishnu-suktam/' },
	},
	{
		aliases: ['medha', 'medhasuktam', 'मेधासूक्त'],
		query: 'medha',
		label: { root: 'मेधा सूक्तम्', iast: 'Medhā Sūktam' },
		href: { root: '/medha-suktam/', iast: '/iast/medha-suktam/' },
	},
	{
		aliases: ['navagraha', 'navagrahasuktam', 'नवग्रह'],
		query: 'navagraha',
		label: { root: 'नवग्रह सूक्तम्', iast: 'Navagraha Sūktam' },
		href: { root: '/navagraha-suktam/', iast: '/iast/navagraha-suktam/' },
	},
	{
		aliases: ['pavamana', 'pavamanasuktam', 'पवमान'],
		query: 'pavamana',
		label: { root: 'पवमान सूक्तम्', iast: 'Pavamāna Sūktam' },
		href: { root: '/pavamana-suktam/', iast: '/iast/pavamana-suktam/' },
	},
	{
		aliases: ['nasadiya', 'nasadiya suktam', 'creation hymn', 'नासदीय'],
		query: 'nasadiya',
		label: { root: 'नासदीय सूक्तम्', iast: 'Nāsadīya Sūktam' },
		href: { root: '/nasadiya-suktam/', iast: '/iast/nasadiya-suktam/' },
	},
	{
		aliases: ['ganesha', 'ganapati', 'ganapathy', 'गणपति', 'गणेश'],
		query: 'ganapati',
		label: { root: 'गणपति सूक्तम्', iast: 'Gaṇapati Sūktam' },
		href: { root: '/ganapathy-suktam/', iast: '/iast/ganapathy-suktam/' },
	},
	{
		aliases: ['yajurveda', 'yajur', 'taittiriya', 'कृष्णयजुर्वेद', 'यजुर्वेद'],
		query: 'taittiriya',
		label: { root: 'तैत्तिरीय संहिता', iast: 'Taittirīya Saṃhitā' },
		href: { root: '/taittiriya-samhita/', iast: '/iast/taittiriya-samhita/' },
	},
	{
		aliases: ['kanva', 'shukla yajur', 'vajasaneyi', 'काण्व'],
		query: 'kanva',
		label: { root: 'काण्व संहिता', iast: 'Kāṇva Saṃhitā' },
		href: { root: '/kanva-samhita/', iast: '/iast/kanva-samhita/' },
	},
	{
		aliases: ['madhyandina', 'madhyandina samhita', 'माध्यन्दिन'],
		query: 'madhyandina',
		label: { root: 'माध्यन्दिन संहिता', iast: 'Mādhyandina Saṃhitā' },
		href: { root: '/madhyandina-samhita/', iast: '/iast/madhyandina-samhita/' },
	},
	{
		aliases: ['kena', 'kenopanishad', 'केनोपनिषद्'],
		query: 'kena',
		label: { root: 'केनोपनिषत्', iast: 'Kenopaniṣad' },
		href: { root: '/kena-upanishad/', iast: '/iast/kena-upanishad/' },
	},
	{
		aliases: ['katha', 'kathopanishad', 'कठोपनिषद्'],
		query: 'katha',
		label: { root: 'कठोपनिषत्', iast: 'Kaṭhopaniṣad' },
		href: { root: '/katha-upanishad/', iast: '/iast/katha-upanishad/' },
	},
	{
		aliases: [
			'prashnopanishad',
			'prashna upanishad',
			'prasna upanishad',
			'prasna',
			'pippalada',
			'प्रश्नोपनिषद्',
			'प्रश्नोपनिषत्',
		],
		query: 'prashna',
		label: { root: 'प्रश्नोपनिषत्', iast: 'Praśnopaniṣad' },
		href: { root: '/prashna-upanishad/', iast: '/iast/prashna-upanishad/' },
	},
	{
		aliases: ['taittiriya upanishad', 'taittiriyopanishad', 'तैत्तिरीयोपनिषद्'],
		query: 'taittiriya upanishad',
		label: { root: 'तैत्तिरीयोपनिषत्', iast: 'Taittirīyopaniṣad' },
		href: { root: '/taittiriya-upanishad/', iast: '/iast/taittiriya-upanishad/' },
	},
	{
		aliases: ['mahanarayana', 'narayana upanishad', 'महानारायण'],
		query: 'mahanarayana',
		label: { root: 'महानारायणोपनिषत्', iast: 'Mahānārāyaṇa Upaniṣad' },
		href: { root: '/mahanarayana-upanishad/', iast: '/iast/mahanarayana-upanishad/' },
	},
	{
		aliases: ['aitareya brahmana', 'aitareya brahmanam', 'ऐतरेय ब्राह्मण'],
		query: 'aitareya brahmana',
		label: { root: 'ऐतरेय ब्राह्मणम्', iast: 'Aitareya Brāhmaṇa' },
		href: { root: '/aitareya-brahmana/', iast: '/iast/aitareya-brahmana/' },
	},
	{
		aliases: ['aitareya', 'aitareya upanishad', 'ऐतरेय'],
		query: 'aitareya',
		label: { root: 'ऐतरेयोपनिषद्', iast: 'Aitareyopaniṣad' },
		href: { root: '/aitareya-upanishad/', iast: '/iast/aitareya-upanishad/' },
	},
	{
		aliases: ['aswalayana', 'asvalayana', 'ashvalayana', 'आश्वलायन'],
		query: 'aswalayana',
		label: { root: 'आश्वलायन प्रातः सन्ध्या', iast: 'Aśvalāyana prātaḥ sandhyā' },
		href: {
			root: '/aswalayana-sandhyavandanam/prata/',
			iast: '/iast/aswalayana-sandhyavandanam/prata/',
		},
	},
	{
		aliases: ['apastamba', 'apastamba sandhya', 'आपस्तम्ब'],
		query: 'apastamba',
		label: { root: 'आपस्तम्ब प्रातः सन्ध्या', iast: 'Āpastamba prātaḥ sandhyā' },
		href: {
			root: '/apastamba-sandhyavandanam/prata/',
			iast: '/iast/apastamba-sandhyavandanam/prata/',
		},
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
	{
		alias: 'isha',
		label: { root: 'ईशावास्योपनिषद्', iast: 'īśāvāsya' },
		href: { root: '/isha-upanishad/', iast: '/iast/isha-upanishad/' },
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
