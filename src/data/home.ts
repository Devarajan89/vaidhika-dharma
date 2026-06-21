import homeQuotesData from './home-quotes.json';

export type HomeLocale = 'root' | 'iast';

export interface HomeQuote {
	text: string;
	source: string;
	meaning: string;
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
	actions: HomeHeroAction[];
}

export interface HomeContent {
	searchHint: string;
	intro: string;
	browseHeading: string;
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
			'नारायणं पद्मभुवं वशिष्ठं शक्तिं च तत्पुत्रं पराशरं च व्यासं शुकं गौडपदं महान्तं गोविन्दयोगीन्द्रं अथास्य शिष्यम् ।<br /> श्री शंकराचार्यं अथास्य पद्मपादं च हस्तामलकं च शिष्यम् तं तोटकं वार्त्तिककारमन्यान् अस्मद् गुरून् सन्ततमानतोऽस्मि ॥',
		actions: [
			{
				text: 'नित्यकर्म',
				link: '/aswalayana-sandhyavandanam/prata/',
				icon: 'right-arrow',
			},
			{
				text: 'वेद मन्त्राः',
				link: '/brahmanaspati-suktam/',
				variant: 'secondary',
				icon: 'right-arrow',
			},
		],
	},
	iast: {
		title: "Vedo'khilo Dharmamūlaṃ",
		tagline:
			"Nārāyaṇaṃ padmabhuvaṃ vaśiṣṭhaṃ śaktiṃ ca tatputraṃ parāśaraṃ ca Vyāsaṃ śukaṃ gauḍpadaṃ mahāntaṃ govindayogīndraṃ athāsya śiṣyam .<br /><br /> Śrī śaṃkarācāryaṃ athāsya padmapādaṃ ca hastāmlakaṃ ca śiṣyam Taṃ toṭakaṃ vārttikakāramanyān asmad gurūn santatamānto'smi ..",
		actions: [
			{
				text: 'Nityakarma',
				link: '/iast/aswalayana-sandhyavandanam/prata/',
				icon: 'right-arrow',
			},
			{
				text: 'Veda mantrāḥ',
				link: '/iast/brahmanaspati-suktam/',
				variant: 'secondary',
				icon: 'right-arrow',
			},
		],
	},
};

export const homeContentByLocale: Record<HomeLocale, HomeContent> = {
	root: {
		searchHint: 'Use the search bar above to find mantras, rituals, and scriptures.',
		intro:
			'Vaidhika Dharma guides Vedic living — nityakarma (daily practice), dharma (right conduct), and svādhyāya (study of the śāstras). Mantras are shown in IAST; switch to Devanagari for the native script view.',
		browseHeading: 'Browse',
		aboutTitle: 'About',
		aboutBody: [
			'Vaidhika Dharma is dedicated to preserving and sharing the path of Vedic life — daily rituals (nityakarma), ethical conduct (dharma), and scriptural study (svādhyāya).',
			'Content is available in Devanagari and IAST so practitioners can follow their guru-paramparā in the form they prefer.',
		],
		quoteTitle: 'Daily verse',
		recentTitle: 'Recent updates',
		recentEmpty: 'No updates today.',
	},
	iast: {
		searchHint: 'Use the search bar above to find mantras, rituals, and scriptures.',
		intro:
			'Vaidhika Dharma guides Vedic living — nityakarma (daily practice), dharma (right conduct), and svādhyāya (study of the śāstras). Mantras are shown in IAST; switch to Devanagari for the native script view.',
		browseHeading: 'Browse',
		aboutTitle: 'About',
		aboutBody: [
			'Vaidhika Dharma is dedicated to preserving and sharing the path of Vedic life — daily rituals (nityakarma), ethical conduct (dharma), and scriptural study (svādhyāya).',
			'Content is available in Devanagari and IAST so practitioners can follow their guru-paramparā in the form they prefer.',
		],
		quoteTitle: 'Daily verse',
		recentTitle: 'Recent updates',
		recentEmpty: 'No updates today.',
	},
};

/** @deprecated Use getHomeContent(locale) */
export const homeContent: HomeContent = homeContentByLocale.root;

const homeQuotesByLocale: Record<HomeLocale, HomeQuote[]> = {
	root: (homeQuotesData as HomeQuoteEntry[]).map((entry) => ({
		text: entry.text.root,
		source: entry.source.root,
		meaning: entry.meaning,
	})),
	iast: (homeQuotesData as HomeQuoteEntry[]).map((entry) => ({
		text: entry.text.iast,
		source: entry.source.iast,
		meaning: entry.meaning,
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
