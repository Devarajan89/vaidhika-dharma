import type { HomeLocale } from '../data/home';

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'] as const;

export function toDevanagariNumber(value: number): string {
	return String(value)
		.split('')
		.map((digit) => DEVANAGARI_DIGITS[Number(digit)] ?? digit)
		.join('');
}

export function formatChapterMantraMarker(
	chapterNumber: number,
	verseNumber: number,
	locale: HomeLocale = 'root'
): string {
	if (locale === 'iast') {
		return `||${chapterNumber}.${verseNumber}||`;
	}
	return `॥${toDevanagariNumber(chapterNumber)}.${toDevanagariNumber(verseNumber)}॥`;
}

export function formatAnuvakaMarker(
	kanda: number,
	prapathaka: number,
	anuvaka: number,
	locale: HomeLocale = 'root'
): string {
	if (locale === 'iast') {
		return `||${kanda}.${prapathaka}.${anuvaka}||`;
	}
	return `॥${toDevanagariNumber(kanda)}.${toDevanagariNumber(prapathaka)}.${toDevanagariNumber(anuvaka)}॥`;
}
