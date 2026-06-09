export type HomeLocale = 'root' | 'iast';

export interface HomeQuote {
	text: string;
	source: string;
}

export interface HomeContent {
	searchHint: string;
	aboutTitle: string;
	aboutBody: string[];
	quoteTitle: string;
	recentTitle: string;
}

/** Shared English copy for all homepage UI — only verse-of-the-day varies by locale. */
export const homeContent: HomeContent = {
	searchHint: 'Use the search bar above to find mantras, rituals, and scriptures.',
	aboutTitle: 'About',
	aboutBody: [
		'Vaidhika Dharma is dedicated to preserving and sharing the Vedic way of life - nityakarma (daily rituals), dharma (right conduct), and svādhyāya (scriptural study).',
		'Content is presented in Devanāgarī and IAST so practitioners can follow anuṣṭhāna in the tradition of their gurus.',
	],
	quoteTitle: 'Verse of the Day',
	recentTitle: 'Recently Updated',
};

export const homeQuotes: Record<HomeLocale, HomeQuote[]> = {
	root: [
		{
			text: 'वेदोऽखिलो धर्ममूलम्',
			source: 'मनुस्मृति २.६',
		},
		{
			text: 'यतो धर्मस्ततो जयः',
			source: 'महाभारतम्',
		},
		{
			text: 'सत्यं वद धर्मं चर',
			source: 'तैत्तिरीयोपनिषत्',
		},
		{
			text: 'आचारः परमो धर्मः',
			source: 'परम्परा',
		},
	],
	iast: [
		{
			text: 'Vedo\'khilo dharmamūlaṃ — the Veda is the root of all dharma.',
			source: 'Manu Smṛti 2.6',
		},
		{
			text: 'Yato dharmas tato jayaḥ — where there is dharma, there is victory.',
			source: 'Mahābhārata',
		},
		{
			text: 'Satyaṃ vada, dharmaṃ cara — speak the truth, follow dharma.',
			source: 'Taittirīya Upaniṣad',
		},
		{
			text: 'Ācāraḥ paramo dharmaḥ — right conduct is the highest dharma.',
			source: 'Traditional',
		},
	]
};

export function getQuoteOfDay(locale: HomeLocale): HomeQuote {
	const quotes = homeQuotes[locale];
	const start = new Date(new Date().getFullYear(), 0, 0);
	const day = Math.floor((Date.now() - start.getTime()) / 86_400_000);
	return quotes[day % quotes.length];
}
