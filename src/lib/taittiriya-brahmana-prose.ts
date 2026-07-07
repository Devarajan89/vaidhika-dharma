import type { HomeLocale } from '../data/home';
import type { TaittiriyaBrahmanaAnuvaka } from './taittiriya-brahmana-corpus';

export type TaittiriyaBrahmanaVerseBlock = {
	number: number;
	lines: string[];
};

export type TaittiriyaBrahmanaAnuvakaBlock = {
	anuvaka: number;
	verses: TaittiriyaBrahmanaVerseBlock[];
};

export function buildTaittiriyaBrahmanaAnuvakaBlocks(
	anuvakas: TaittiriyaBrahmanaAnuvaka[],
	locale: HomeLocale
): TaittiriyaBrahmanaAnuvakaBlock[] {
	return anuvakas.map((anuvaka) => ({
		anuvaka: anuvaka.anuvaka,
		verses: anuvaka.verses.map((verse) => ({
			number: verse.number,
			lines: (locale === 'iast' ? verse.linesIast : verse.lines).filter(Boolean),
		})),
	}));
}
