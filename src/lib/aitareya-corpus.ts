import aitareyaData from '../data/rigveda/aitareya/aitareya_brahmana_adhyayas.json';
import {
	AITAREYA_PANCHIKAS,
	panchikaAdhyayaToGlobal,
} from '../../scripts/lib/aitareya-brahmana-structure.mjs';

export type AitareyaKhanda = {
	khanda: number;
	sentences: string[];
	sentencesIast: string[];
};

export type AitareyaAdhyayaEntry = {
	globalAdhyaya: number;
	panchika: number;
	adhyaya: number;
	khandas: AitareyaKhanda[];
	text: string;
	textIast: string;
};

const corpus = aitareyaData as AitareyaAdhyayaEntry[];

export function getAitareyaAdhyaya(globalAdhyaya: number): AitareyaAdhyayaEntry | undefined {
	return corpus.find((entry) => entry.globalAdhyaya === globalAdhyaya);
}

export function getAitareyaPanchikaAdhyayas(panchika: number): AitareyaAdhyayaEntry[] {
	return corpus
		.filter((entry) => entry.panchika === panchika)
		.sort((a, b) => a.adhyaya - b.adhyaya);
}

export function getAitareyaAdhyayaByPanchika(
	panchika: number,
	adhyaya: number
): AitareyaAdhyayaEntry | undefined {
	return getAitareyaAdhyaya(panchikaAdhyayaToGlobal(panchika, adhyaya));
}

export { AITAREYA_PANCHIKAS, panchikaAdhyayaToGlobal };
