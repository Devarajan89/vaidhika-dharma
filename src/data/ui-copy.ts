import type { HomeLocale } from './home';

export interface UiCopy {
	now: string;
	todayPractice: string;
	recent: string;
	continueLabel: string;
	recentlyViewed: string;
	bookmarks: string;
	bookmark: string;
	bookmarked: string;
	typeSize: string;
	chant: string;
	chanting: string;
	print: string;
	smaller: string;
	larger: string;
	script: string;
	scriptTitle: string;
	iastToggle: string;
	devaToggle: string;
	copyCite: string;
	copied: string;
	seqPrev: string;
	seqNext: string;
	sequence: string;
	filterAll: string;
	nextStep: string;
}

const root: UiCopy = {
	now: 'अधुना',
	todayPractice: 'अद्यतनं कर्म',
	recent: 'नवीनम्',
	continueLabel: 'पुनः पठ्यताम्',
	recentlyViewed: 'दृष्टपृष्ठाः',
	bookmarks: 'रक्षितानि',
	bookmark: 'रक्षतु',
	bookmarked: 'रक्षितम्',
	typeSize: 'अक्षरपरिमाणम्',
	chant: 'जपः',
	chanting: 'जप्यमानम्',
	print: 'मुद्रणम्',
	smaller: 'लघु अक्षराणि',
	larger: 'बृहत् अक्षराणि',
	script: 'लिपिः',
	scriptTitle: 'पठनलिपिः। देवनागरी-मराठी-ग्रन्थेभ्यः अन्यत्र स्वरः अनुमानिकः स्यात्।',
	iastToggle: 'IAST',
	devaToggle: 'देवनागरी',
	copyCite: 'उल्लेखं लिख्यताम्',
	copied: 'लिखितम्',
	seqPrev: 'पूर्वम्',
	seqNext: 'अग्रिमम्',
	sequence: 'क्रमः',
	filterAll: 'सर्वाणि',
	nextStep: 'अग्रिमः',
};

const iast: UiCopy = {
	now: 'Now',
	todayPractice: 'Today’s practice',
	recent: 'Recent',
	continueLabel: 'Continue',
	recentlyViewed: 'Recently viewed',
	bookmarks: 'Pinned',
	bookmark: 'Pin',
	bookmarked: 'Pinned',
	typeSize: 'Type size',
	chant: 'Chant',
	chanting: 'Chanting',
	print: 'Print',
	smaller: 'Smaller type',
	larger: 'Larger type',
	script: 'Script',
	scriptTitle: 'Reading script. Svara may be approximate outside Devanagari, Marathi, and Grantha.',
	iastToggle: 'IAST',
	devaToggle: 'Devanagari',
	copyCite: 'Copy citation',
	copied: 'Copied',
	seqPrev: 'Previous',
	seqNext: 'Next',
	sequence: 'Sequence',
	filterAll: 'All',
	nextStep: 'Next',
};

export function getUiCopy(locale: HomeLocale): UiCopy {
	return locale === 'iast' ? iast : root;
}
