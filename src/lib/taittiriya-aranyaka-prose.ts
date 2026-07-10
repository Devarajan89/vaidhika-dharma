import type { HomeLocale } from '../data/home';
import type { TaittiriyaAranyakaAnuvaka } from './taittiriya-aranyaka-corpus';

export type TaittiriyaAranyakaVerseBlock = {
	number: number;
	lines: string[];
};

export type TaittiriyaAranyakaAnuvakaBlock = {
	anuvaka: number;
	verses: TaittiriyaAranyakaVerseBlock[];
};

export function buildTaittiriyaAranyakaAnuvakaBlocks(
	anuvakas: TaittiriyaAranyakaAnuvaka[],
	locale: HomeLocale
): TaittiriyaAranyakaAnuvakaBlock[] {
	return anuvakas.map((anuvaka) => ({
		anuvaka: anuvaka.anuvaka,
		verses: anuvaka.verses.map((verse) => ({
			number: verse.number,
			lines: (locale === 'iast' ? verse.linesIast : verse.lines).filter(Boolean),
		})),
	}));
}
