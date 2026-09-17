import taittiriyaBrahmanaData from '../data/krishna-yajur/taittiriya/taittiriya_brahmana_prapathakas.json';
import {
	TAITTIRIYA_BRAHMANA_ASHTAKAS,
	ashtakaPrapathakaToGlobal,
} from '../../scripts/lib/taittiriya-brahmana-structure.mjs';

export type TaittiriyaBrahmanaVerse = {
	number: number;
	lines: string[];
	linesIast: string[];
};

export type TaittiriyaBrahmanaAnuvaka = {
	anuvaka: number;
	sourceAnuvaka?: number;
	verses: TaittiriyaBrahmanaVerse[];
};

export type TaittiriyaBrahmanaPrapathakaEntry = {
	globalPrapathaka: number;
	ashtaka: number;
	prapathaka: number;
	title: string;
	anuvakas: TaittiriyaBrahmanaAnuvaka[];
};

const corpus = taittiriyaBrahmanaData as TaittiriyaBrahmanaPrapathakaEntry[];

export function getTaittiriyaBrahmanaPrapathaka(
	globalPrapathaka: number
): TaittiriyaBrahmanaPrapathakaEntry | undefined {
	return corpus.find((entry) => entry.globalPrapathaka === globalPrapathaka);
}

export function getTaittiriyaBrahmanaAshtakaPrapathakas(
	ashtaka: number
): TaittiriyaBrahmanaPrapathakaEntry[] {
	return corpus
		.filter((entry) => entry.ashtaka === ashtaka)
		.sort((a, b) => a.prapathaka - b.prapathaka);
}

export function getTaittiriyaBrahmanaPrapathakaByAshtaka(
	ashtaka: number,
	prapathaka: number
): TaittiriyaBrahmanaPrapathakaEntry | undefined {
	return getTaittiriyaBrahmanaPrapathaka(ashtakaPrapathakaToGlobal(ashtaka, prapathaka));
}

export function getTaittiriyaBrahmanaAnuvakaText(
	ashtaka: number,
	prapathaka: number,
	anuvaka: number,
	locale: 'root' | 'iast' = 'root'
): string | undefined {
	const entry = getTaittiriyaBrahmanaPrapathakaByAshtaka(ashtaka, prapathaka);
	const block = entry?.anuvakas.find((item) => item.anuvaka === anuvaka);
	if (!block) return undefined;
	const lines = block.verses.flatMap((verse) => (locale === 'iast' ? verse.linesIast : verse.lines));
	return lines.join('\n') || undefined;
}

export { TAITTIRIYA_BRAHMANA_ASHTAKAS, ashtakaPrapathakaToGlobal };
