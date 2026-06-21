import taittiriyaData from '../data/krishna-yajur/taittiriya/taittiriya_samhita_prapathakas.json';
import {
	TAITTIRIYA_KANDAS,
	kandaPrapathakaToChapter,
} from '../../scripts/lib/taittiriya-samhita-structure.mjs';

export type TaittiriyaChapterEntry = {
	chapter: number;
	kanda: number;
	prapathaka: number;
	text: string;
};

const corpus = taittiriyaData as TaittiriyaChapterEntry[];

export function getTaittiriyaChapter(chapter: number): TaittiriyaChapterEntry | undefined {
	return corpus.find((entry) => entry.chapter === chapter);
}

export function getTaittiriyaPrapathaka(
	kanda: number,
	prapathaka: number
): TaittiriyaChapterEntry | undefined {
	const chapter = kandaPrapathakaToChapter(kanda, prapathaka);
	return getTaittiriyaChapter(chapter);
}

export function getTaittiriyaKandaChapters(kanda: number): TaittiriyaChapterEntry[] {
	return corpus
		.filter((entry) => entry.kanda === kanda)
		.sort((a, b) => a.prapathaka - b.prapathaka);
}

export { TAITTIRIYA_KANDAS, kandaPrapathakaToChapter };
