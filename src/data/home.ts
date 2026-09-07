import homeQuotesData from './home-quotes.json';

export type HomeLocale = 'root' | 'iast';

export interface HomeQuote {
	text: string;
	source: string;
	meaning: string;
	href?: string;
}

interface HomeQuoteEntry {
	text: Record<HomeLocale, string>;
	source: Record<HomeLocale, string>;
	meaning: string;
}

export interface HomeHeroAction {
	text: string;
	link: string;
	variant?: 'primary' | 'secondary' | 'minimal';
	icon?: string;
}

export interface HomeHero {
	title: string;
	tagline: string;
	gloss: string;
	actions: HomeHeroAction[];
}

export interface HomeContent {
	searchHint: string;
	searchPlaceholder: string;
	searchSubmit: string;
	intro: string;
	browseHeading: string;
	browseBlurb: string;
	shortcutsHeading: string;
	aboutTitle: string;
	aboutBody: string[];
	quoteTitle: string;
	recentTitle: string;
	recentEmpty: string;
}

export const heroContentByLocale: Record<HomeLocale, HomeHero> = {
	root: {
		title: 'वेदोऽखिलो धर्ममूलं',
		tagline:
			'नारायणं पद्मभुवं वशिष्ठं शक्तिं च तत्पुत्र पराशरं च व्यासं शुकं गौडपदं महान्तं गोविन्दयोगीन्द्रं अथास्य शिष्यम् ।<br /> श्री शंकराचार्यं अथास्य पद्मपादं च हस्तामलकं च शिष्यम् तं तोटकं वार्त्तिककारमन्यान् अस्मद् गुरून् सन्ततमानतोऽस्मि ॥',
		gloss: 'The Veda is the root of all dharma — daily practice, recitation, and study.',
		actions: [
			{
				text: 'नित्यकर्म',
				link: '/aswalayana-sandhyavandanam/prata/',
				icon: 'right-arrow',
			},
			{
				text: 'वेद मन्त्राः',
				link: '/ganapathy-suktam/',
				variant: 'secondary',
				icon: 'right-arrow',
			},
			{
				text: 'अन्वेषणम्',
				link: '/search/',
				variant: 'minimal',
			},
		],
	},
	iast: {
		title: "Vedo'khilo Dharmamūlaṃ",
		tagline:
			"Nārāyaṇaṃ padmabhuvaṃ vaśiṣṭhaṃ śaktiṃ ca tatputraṃ parāśaraṃ ca Vyāsaṃ śukaṃ gauḍpadaṃ mahāntaṃ govindayogīndraṃ athāsya śiṣyam .<br /><br /> Śrī śaṃkarācāryaṃ athāsya padmapādaṃ ca hastāmlakaṃ ca śiṣyam Taṃ toṭakaṃ vārttikakāramanyān asmad gurūn santatamānto'smi ..",
		gloss: 'The Veda is the root of all dharma — daily practice, recitation, and study.',
		actions: [
			{
				text: 'Nityakarma',
				link: '/iast/aswalayana-sandhyavandanam/prata/',
				icon: 'right-arrow',
			},
			{
				text: 'Veda mantrāḥ',
				link: '/iast/ganapathy-suktam/',
				variant: 'secondary',
				icon: 'right-arrow',
			},
			{
				text: 'Search',
				link: '/iast/search/',
				variant: 'minimal',
			},
		],
	},
};

export const homeContentByLocale: Record<HomeLocale, HomeContent> = {
	root: {
		searchHint:
			'Search mantras and rituals — try rudram, RV 10.90.1, TS 1.1.1, or puruṣa.',
		searchPlaceholder: 'मन्त्रान् कर्म च अन्विष्यताम्',
		searchSubmit: 'अन्विष्यताम्',
		intro:
			'Vaidhika Dharma guides Vedic living — nityakarma (daily practice), dharma (right conduct), and svādhyāya (study of the śāstras). Mantras are shown in Devanagari; switch to IAST for Latin transliteration.',
		browseHeading: 'Browse',
		browseBlurb: 'नित्यकर्म · मन्त्राः · संहिताः · उपनिषदः',
		shortcutsHeading: 'Daily practice',
		aboutTitle: 'About',
		aboutBody: [
			'Vaidhika Dharma is dedicated to preserving and sharing the path of Vedic life — daily rituals (nityakarma), ethical conduct (dharma), and scriptural study (svādhyāya).',
			'Content is available in Devanagari and IAST so practitioners can follow their guru-paramparā in the form they prefer. Key nityakarma pages also work offline after the first visit.',
		],
		quoteTitle: 'Daily verse',
		recentTitle: 'Recent updates',
		recentEmpty: 'No updates today.',
	},
	iast: {
		searchHint:
			'Search mantras and rituals — try rudram, RV 10.90.1, TS 1.1.1, or puruṣa.',
		searchPlaceholder: 'Search mantras and rituals',
		searchSubmit: 'Search',
		intro:
			'Vaidhika Dharma guides Vedic living — nityakarma (daily practice), dharma (right conduct), and svādhyāya (study of the śāstras). Mantras are shown in IAST; switch to Devanagari for the native script view.',
		browseHeading: 'Browse',
		browseBlurb: 'Nityakarma · mantras · saṃhitās · upaniṣads',
		shortcutsHeading: 'Daily practice',
		aboutTitle: 'About',
		aboutBody: [
			'Vaidhika Dharma is dedicated to preserving and sharing the path of Vedic life — daily rituals (nityakarma), ethical conduct (dharma), and scriptural study (svādhyāya).',
			'Content is available in Devanagari and IAST so practitioners can follow their guru-paramparā in the form they prefer. Key nityakarma pages also work offline after the first visit.',
		],
		quoteTitle: 'Daily verse',
		recentTitle: 'Recent updates',
		recentEmpty: 'No updates today.',
	},
};

/** @deprecated Use getHomeContent(locale) */
export const homeContent: HomeContent = homeContentByLocale.root;

const QUOTE_SOURCE_HREFS: Array<{ test: RegExp; href: Record<HomeLocale, string> }> = [
	{ test: /ईश|Īśa/, href: { root: '/isha-upanishad/', iast: '/iast/isha-upanishad/' } },
	{ test: /कठ|Kaṭha/, href: { root: '/katha-upanishad/', iast: '/iast/katha-upanishad/' } },
	{ test: /केन|Kena/, href: { root: '/kena-upanishad/', iast: '/iast/kena-upanishad/' } },
	{
		test: /तैत्तिरीय|Taittirīya/,
		href: { root: '/taittiriya-upanishad/', iast: '/iast/taittiriya-upanishad/' },
	},
	{
		test: /ऐतरेय|Aitareya/,
		href: { root: '/aitareya-upanishad/', iast: '/iast/aitareya-upanishad/' },
	},
];

function quoteHref(source: string, locale: HomeLocale): string | undefined {
	return QUOTE_SOURCE_HREFS.find((entry) => entry.test.test(source))?.href[locale];
}

const homeQuotesByLocale: Record<HomeLocale, HomeQuote[]> = {
	root: (homeQuotesData as HomeQuoteEntry[]).map((entry) => ({
		text: entry.text.root,
		source: entry.source.root,
		meaning: entry.meaning,
		href: quoteHref(entry.source.root, 'root'),
	})),
	iast: (homeQuotesData as HomeQuoteEntry[]).map((entry) => ({
		text: entry.text.iast,
		source: entry.source.iast,
		meaning: entry.meaning,
		href: quoteHref(entry.source.iast, 'iast'),
	})),
};

export const salutationByLocale: Record<HomeLocale, string> = {
	root: 'श्री गुरुभ्यो नम:',
	iast: 'śrī gurubhyo nama:',
};

/**
 * Resolve homepage locale from Starlight route locale.
 * @param {string | undefined} starlightLocale
 */
export function resolveHomeLocale(starlightLocale: string | undefined): HomeLocale {
	return starlightLocale === 'iast' ? 'iast' : 'root';
}

export function getHomeContent(locale: HomeLocale): HomeContent {
	return homeContentByLocale[locale];
}

export function getHeroContent(locale: HomeLocale): HomeHero {
	return heroContentByLocale[locale];
}

export function getSalutation(locale: HomeLocale): string {
	return salutationByLocale[locale];
}

/** Day-of-year index (0-based) for stable daily rotation. */
export function getDayOfYear(date = new Date()): number {
	const start = new Date(date.getFullYear(), 0, 0);
	return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export function getQuoteOfDay(locale: HomeLocale, date = new Date()): HomeQuote {
	const quotes = homeQuotesByLocale[locale];
	return quotes[getDayOfYear(date) % quotes.length];
}
