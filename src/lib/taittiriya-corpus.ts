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

const DEVANAGARI_DIGITS = '०१२३४५६७८९';

function toDevaNumber(n: number): string {
	return String(n).replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

function fromDevaNumber(value: string): number {
	const normalized = value.replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)));
	return Number(normalized);
}

export function getTaittiriyaAnuvaka(
	kanda: number,
	prapathaka: number,
	anuvaka: number
): string | undefined {
	const entry = getTaittiriyaPrapathaka(kanda, prapathaka);
	if (!entry) return undefined;
	const k = toDevaNumber(kanda);
	const p = toDevaNumber(prapathaka);
	const marker = new RegExp(`॥\\s*${k}।\\s*${p}।\\s*([०-९]+)\\s*॥`, 'g');
	const parts: Array<{ n: number; start: number; end: number }> = [];
	let match: RegExpExecArray | null;
	while ((match = marker.exec(entry.text))) {
		parts.push({ n: fromDevaNumber(match[1]), start: match.index, end: match.index + match[0].length });
	}
	const lastByN = new Map<number, { n: number; start: number; end: number }>();
	for (const part of parts) lastByN.set(part.n, part);
	const hit = lastByN.get(anuvaka);
	if (!hit) return undefined;
	const prev = lastByN.get(anuvaka - 1);
	const start = prev ? prev.end : 0;
	let body = entry.text.slice(start, hit.start).trim();
	body = body.replace(new RegExp(`^${toDevaNumber(anuvaka)}\\s+`), '');
	return body.replace(/\n+/g, '\n').trim() || undefined;
}

export { TAITTIRIYA_KANDAS, kandaPrapathakaToChapter };
