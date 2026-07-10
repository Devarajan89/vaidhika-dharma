import kenaData from '../data/upanishads/kena.json';
import kathaData from '../data/upanishads/katha.json';
import taittiriyaData from '../data/upanishads/taittiriya.json';
import mahanarayanaData from '../data/upanishads/mahanarayana.json';
import aitareyaData from '../data/upanishads/aitareya.json';

export type UpanishadId = 'kena' | 'katha' | 'taittiriya' | 'mahanarayana' | 'aitareya';

export type UpanishadVerse = {
	number: number;
	text: string;
	textIast?: string;
};

export type UpanishadSection = {
	type: string;
	label: string;
	verses: UpanishadVerse[];
};

export type UpanishadCorpus = {
	id: UpanishadId;
	source: string;
	veda: { root: string; iast: string };
	title: string | null;
	openingShanti: string | null;
	mantraCount: number;
	sections: UpanishadSection[];
	fetchedAt: string;
};

const CORPUS_BY_ID: Record<UpanishadId, UpanishadCorpus> = {
	kena: kenaData as UpanishadCorpus,
	katha: kathaData as UpanishadCorpus,
	taittiriya: taittiriyaData as UpanishadCorpus,
	mahanarayana: mahanarayanaData as UpanishadCorpus,
	aitareya: aitareyaData as UpanishadCorpus,
};

export function getUpanishadCorpus(id: UpanishadId): UpanishadCorpus {
	return CORPUS_BY_ID[id];
}

export function getUpanishadMantraJumpItems(sections: UpanishadSection[]) {
	return sections.flatMap((section, sectionIndex) =>
		section.verses.map((verse) => ({
			id: `mantra-${sectionIndex + 1}-${verse.number}`,
			label: String(verse.number),
		}))
	);
}
