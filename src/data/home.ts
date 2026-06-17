export type HomeLocale = 'root' | 'iast';

export interface HomeQuote {
	text: string;
	source: string;
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
		searchHint: 'उपरि अन्वेषणपट्टिकया मन्त्र, विधि, शास्त्राणि अन्विष्यन्ताम्।',
		intro:
			'वैदिकधर्मः वैदिकजीवनस्य मार्गदर्शकः — नित्यकर्म (दैनिक अनुष्ठान), धर्म (सदाचार), स्वाध्याय (शास्त्राध्ययन)।',
		browseHeading: 'सञ्चयनम्',
		aboutTitle: 'परिचय',
		aboutBody: [
			'वैदिकधर्मः वैदिकजीवनस्य मार्गं संरक्षितुं वितरितुं च समर्पितः — नित्यकर्म, धर्म, स्वाध्याय।',
			'देवनागरी-IAST-रूपेण प्रस्तुतम्, येन साधकाः गुरुपरम्परया अनुष्ठानं कर्तुम् अर्हन्ति।',
		],
		quoteTitle: 'अद्य श्लोकः',
		recentTitle: 'सम्प्रति परिवर्तनानि',
		recentEmpty: 'अद्य परिवर्तनानि न सन्ति।',
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

export const homeQuotes: Record<HomeLocale, HomeQuote[]> = {
	root: [
		{ text: 'वेदोऽखिलो धर्ममूलम्', source: 'मनुस्मृति २.६' },
		{ text: 'यतो धर्मस्ततो जयः', source: 'महाभारतम्' },
		{ text: 'सत्यं वद धर्मं चर', source: 'तैत्तिरीयोपनिषत्' },
		{ text: 'आचारः परमो धर्मः', source: 'परम्परा' },
	],
	iast: [
		{ text: "Vedo'khilo dharmamūlam", source: 'Manu smṛti 2.6' },
		{ text: 'Yato dharmas tato jayaḥ', source: 'Mahābhārata' },
		{ text: 'Satyaṃ vada, dharmaṃ cara', source: 'Taittirīya upaniṣad' },
		{ text: 'Ācāraḥ paramo dharmaḥ', source: 'Paramparā' },
	],
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

export function getQuoteOfDay(locale: HomeLocale): HomeQuote {
	const quotes = homeQuotes[locale];
	const start = new Date(new Date().getFullYear(), 0, 0);
	const day = Math.floor((Date.now() - start.getTime()) / 86_400_000);
	return quotes[day % quotes.length];
}
