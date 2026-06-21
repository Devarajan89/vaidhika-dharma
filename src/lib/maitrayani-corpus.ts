import maitrayaniData from '../data/krishna-yajur/maitrayani/maitrayani_samhita_prapathakas.json';
import {
	MAITRAYANI_KANDAS,
	kandaPrapathakaToChapter,
} from '../../scripts/lib/maitrayani-samhita-structure.mjs';

export type MaitrayaniChapterEntry = {
	chapter: number;
	kanda: number;
	prapathaka: number;
	text: string;
};

const corpus = maitrayaniData as MaitrayaniChapterEntry[];

export function getMaitrayaniChapter(chapter: number): MaitrayaniChapterEntry | undefined {
	return corpus.find((entry) => entry.chapter === chapter);
}

export function getMaitrayaniPrapathaka(
	kanda: number,
	prapathaka: number
): MaitrayaniChapterEntry | undefined {
	const chapter = kandaPrapathakaToChapter(kanda, prapathaka);
	return getMaitrayaniChapter(chapter);
}

export function getMaitrayaniKandaChapters(kanda: number): MaitrayaniChapterEntry[] {
	return corpus
		.filter((entry) => entry.kanda === kanda)
		.sort((a, b) => a.prapathaka - b.prapathaka);
}

export { MAITRAYANI_KANDAS, kandaPrapathakaToChapter };
