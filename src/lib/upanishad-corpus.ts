import kenaData from '../data/upanishads/kena.json';
import kathaData from '../data/upanishads/katha.json';

export type UpanishadId = 'kena' | 'katha';

export type UpanishadVerse = {
	number: number;
	text: string;
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
