import taittiriyaAranyakaData from '../data/krishna-yajur/taittiriya/taittiriya_aranyaka_prashnas.json';
import {
	TAITTIRIYA_ARANYAKA_PRASHNAS,
	getPrashnaInfo,
} from '../../scripts/lib/taittiriya-aranyaka-structure.mjs';

export type TaittiriyaAranyakaVerse = {
	number: number;
	lines: string[];
	linesIast: string[];
};

export type TaittiriyaAranyakaAnuvaka = {
	anuvaka: number;
	verses: TaittiriyaAranyakaVerse[];
};

export type TaittiriyaAranyakaPrashnaEntry = {
	prashna: number;
	title: string;
	anuvakas: TaittiriyaAranyakaAnuvaka[];
};

const corpus = taittiriyaAranyakaData as TaittiriyaAranyakaPrashnaEntry[];

export function getTaittiriyaAranyakaPrashna(
	prashna: number
): TaittiriyaAranyakaPrashnaEntry | undefined {
	return corpus.find((entry) => entry.prashna === prashna);
}

export function getTaittiriyaAranyakaTextPrashnas(): TaittiriyaAranyakaPrashnaEntry[] {
	return [...corpus].sort((a, b) => a.prashna - b.prashna);
}

export function getTaittiriyaAranyakaAnuvakaText(
	prashna: number,
	anuvaka: number,
	locale: 'root' | 'iast' = 'root'
): string | undefined {
	const entry = getTaittiriyaAranyakaPrashna(prashna);
	const block = entry?.anuvakas.find((item) => item.anuvaka === anuvaka);
	if (!block) return undefined;
	const lines = block.verses.flatMap((verse) => (locale === 'iast' ? verse.linesIast : verse.lines));
	return lines.join('\n') || undefined;
}

export { TAITTIRIYA_ARANYAKA_PRASHNAS, getPrashnaInfo };
