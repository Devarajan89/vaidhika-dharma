import verseIndex from '../data/rigveda/verse-index.json';
import type { HomeLocale } from '../data/home';

export type VerseRecord = {
	mandala: number;
	sukta: number;
	verse: number;
	text: string;
	iast?: string;
};

export type SuktaRecord = {
	mandala: number;
	sukta: number;
	header: string;
	headerIast?: string;
	verseCount: number;
	verses: number[];
};

export type RigvedaVerseIndex = {
	verses: Record<string, VerseRecord>;
	suktas: Record<string, SuktaRecord>;
};

export type CompilationMantraRef = {
	mandala?: number;
	sukta?: number;
	verse?: number;
	label: number;
	text?: string;
};

export type CompilationSection = {
	header: string | null;
	mantras: CompilationMantraRef[];
};

export type CompilationMap = {
	id: string;
	sections: CompilationSection[];
};

const index = verseIndex as RigvedaVerseIndex;
const verses = index.verses;
const suktas = index.suktas;

export function verseKey(mandala: number, sukta: number, verse: number): string {
	return `${mandala}:${sukta}:${verse}`;
}

export function suktaKey(mandala: number, sukta: number): string {
	return `${mandala}:${sukta}`;
}

export function getVerseRecord(
	mandala: number,
	sukta: number,
	verse: number
): VerseRecord | undefined {
	return verses[verseKey(mandala, sukta, verse)];
}

export function getSuktaRecord(mandala: number, sukta: number): SuktaRecord | undefined {
	return suktas[suktaKey(mandala, sukta)];
}

export function getSuktaVerses(mandala: number, sukta: number): VerseRecord[] {
	const suktaRecord = getSuktaRecord(mandala, sukta);
	if (!suktaRecord) return [];

	return suktaRecord.verses
		.map((verseNumber) => getVerseRecord(mandala, sukta, verseNumber))
		.filter((record): record is VerseRecord => Boolean(record));
}

export function getMandalaSuktas(mandala: number): SuktaRecord[] {
	return Object.values(suktas)
		.filter((record) => record.mandala === mandala)
		.sort((a, b) => a.sukta - b.sukta);
}

export function getSamhitaSuktaHref(
	mandala: number,
	sukta: number,
	locale: HomeLocale = 'root'
): string {
	const prefix = locale === 'iast' ? '/iast/rigveda-samhita' : '/rigveda-samhita';
	return `${prefix}/mandala-${mandala}/sukta-${sukta}/`;
}

export function getSamhitaVerseHref(
	mandala: number,
	sukta: number,
	verse: number,
	locale: HomeLocale = 'root'
): string {
	return `${getSamhitaSuktaHref(mandala, sukta, locale)}#verse-${verse}`;
}

export function splitMantraPadas(text: string): string[] {
	return text
		.split(/\n+/)
		.map((line) => line.trim())
		.filter(Boolean);
}

export function samhitaRefCode(mandala: number, sukta: number, verse: number): string {
	return `${mandala}.${sukta}.${verse}`;
}

export function samhitaLinkLabel(
	mandala: number,
	sukta: number,
	verse: number,
	locale: HomeLocale = 'root'
): string {
	if (locale === 'iast') {
		return `Ṛgveda Saṃhitā · Maṇḍala ${mandala}, Sūkta ${sukta}, Mantra ${verse}`;
	}
	return `ऋग्वेद संहिता · मण्डल ${mandala}, सूक्त ${sukta}, मन्त्र ${verse}`;
}
