import aranyakaData from '../data/rigveda/aitareya/aitareya_aranyaka_adhyayas.json';
import {
	AITAREYA_ARANYAKAS,
	aranyakaAdhyayaToGlobal,
	globalToAranyakaAdhyaya,
} from '../../scripts/lib/aitareya-aranyaka-structure.mjs';

export type AitareyaAranyakaKhanda = {
	khanda: number;
	sentences: string[];
	sentencesIast: string[];
};

export type AitareyaAranyakaAdhyayaEntry = {
	globalAdhyaya: number;
	aranyaka: number;
	adhyaya: number;
	aranyakaLabel: string;
	source?: string;
	khandas: AitareyaAranyakaKhanda[];
	text: string;
	textIast: string;
};

const corpus = aranyakaData as AitareyaAranyakaAdhyayaEntry[];

export function getAitareyaAranyakaAdhyaya(
	globalAdhyaya: number
): AitareyaAranyakaAdhyayaEntry | undefined {
	return corpus.find((entry) => entry.globalAdhyaya === globalAdhyaya);
}

export function getAitareyaAranyakaAdhyayas(aranyaka: number): AitareyaAranyakaAdhyayaEntry[] {
	return corpus
		.filter((entry) => entry.aranyaka === aranyaka)
		.sort((a, b) => a.adhyaya - b.adhyaya);
}

export function getAitareyaAranyakaAdhyayaByAranyaka(
	aranyaka: number,
	adhyaya: number
): AitareyaAranyakaAdhyayaEntry | undefined {
	return getAitareyaAranyakaAdhyaya(aranyakaAdhyayaToGlobal(aranyaka, adhyaya));
}

export { AITAREYA_ARANYAKAS, globalToAranyakaAdhyaya, aranyakaAdhyayaToGlobal };
