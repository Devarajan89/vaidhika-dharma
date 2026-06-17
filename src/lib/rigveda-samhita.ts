import type { HomeLocale } from '../data/home';

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'] as const;

export type ParsedSuktaVerse = {
	number: number;
	text: string;
};

export type ParsedSukta = {
	header: string;
	verses: ParsedSuktaVerse[];
	firstWord: string;
	verseCount: number;
};

export function toDevanagariNumber(value: number): string {
	return String(value)
		.split('')
		.map((digit) => DEVANAGARI_DIGITS[Number(digit)] ?? digit)
		.join('');
}

export function formatMantraMarker(number: number, locale: HomeLocale = 'root'): string {
	if (locale === 'iast') {
		return `||${number}||`;
	}
	return `॥${toDevanagariNumber(number)}॥`;
}

export function mantraCountLabel(count: number, locale: HomeLocale = 'root'): string {
	if (locale === 'iast') {
		return count === 1 ? '1 mantra' : `${count} mantras`;
	}
	return count === 1 ? '१ मन्त्रः' : `${count} मन्त्राः`;
}

export function splitMantraPadas(text: string): string[] {
	return text
		.split(/\n+/)
		.map((line) => line.trim())
		.filter(Boolean);
}
