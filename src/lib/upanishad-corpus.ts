import kenaData from '../data/upanishads/kena.json';
import kathaData from '../data/upanishads/katha.json';
import taittiriyaData from '../data/upanishads/taittiriya.json';
import mahanarayanaData from '../data/upanishads/mahanarayana.json';
import aitareyaData from '../data/upanishads/aitareya.json';
import prashnaData from '../data/upanishads/prashna.json';
import mundakaData from '../data/upanishads/mundaka.json';
import mandukyaData from '../data/upanishads/mandukya.json';
import chandogyaData from '../data/upanishads/chandogya.json';
import brihadaranyakaData from '../data/upanishads/brihadaranyaka.json';
import svetasvataraData from '../data/upanishads/svetasvatara.json';
import kaivalyaData from '../data/upanishads/kaivalya.json';

export type UpanishadId =
	| 'kena'
	| 'katha'
	| 'taittiriya'
	| 'mahanarayana'
	| 'aitareya'
	| 'prashna'
	| 'mundaka'
	| 'mandukya'
	| 'chandogya'
	| 'brihadaranyaka'
	| 'svetasvatara'
	| 'kaivalya';

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
	prashna: prashnaData as UpanishadCorpus,
	mundaka: mundakaData as UpanishadCorpus,
	mandukya: mandukyaData as UpanishadCorpus,
	chandogya: chandogyaData as UpanishadCorpus,
	brihadaranyaka: brihadaranyakaData as UpanishadCorpus,
	svetasvatara: svetasvataraData as UpanishadCorpus,
	kaivalya: kaivalyaData as UpanishadCorpus,
};

export function getUpanishadCorpus(id: UpanishadId): UpanishadCorpus {
	return CORPUS_BY_ID[id];
}

const UPANISHAD_CITE: Record<UpanishadId, string> = {
	kena: 'KenU',
	katha: 'KaU',
	taittiriya: 'TU',
	mahanarayana: 'MNU',
	aitareya: 'AiU',
	prashna: 'PrU',
	mundaka: 'MuU',
	mandukya: 'MaU',
	chandogya: 'ChU',
	brihadaranyaka: 'BAU',
	svetasvatara: 'SvetU',
	kaivalya: 'KaiU',
};

function mantraJumpLabel(sectionType: string, verseNumber: number) {
	const nested = sectionType.match(/^adhyaya-(\d+)-(?:khanda|brahmana)-(\d+)$/);
	if (nested) return `${nested[1]}.${nested[2]}.${verseNumber}`;
	const adhyaya = sectionType.match(/^adhyaya-(\d+)$/);
	if (adhyaya) return `${adhyaya[1]}.${verseNumber}`;
	return String(verseNumber);
}

export function upanishadCite(id: UpanishadId, sectionType: string, verseNumber: number): string {
	return UPANISHAD_CITE[id] + ' ' + mantraJumpLabel(sectionType, verseNumber);
}

export function getUpanishadMantraJumpItems(sections: UpanishadSection[]) {
	return sections.flatMap((section, sectionIndex) =>
		section.verses.map((verse) => ({
			id: `mantra-${sectionIndex + 1}-${verse.number}`,
			label: mantraJumpLabel(section.type, verse.number),
		}))
	);
}
