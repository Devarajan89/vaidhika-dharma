import { formatKhandaProse } from '../../scripts/lib/join-sanskrit-prose.mjs';
import type { HomeLocale } from '../data/home';
import type { AitareyaKhanda } from './aitareya-corpus';

export type AitareyaKhandaBlock = {
	khanda: number;
	prose: string;
};

export function buildAitareyaKhandaBlocks(
	khandas: AitareyaKhanda[],
	locale: HomeLocale
): AitareyaKhandaBlock[] {
	return khandas.map((khanda) => {
		const sentences = locale === 'iast' ? khanda.sentencesIast : khanda.sentences;
		return {
			khanda: khanda.khanda,
			prose: formatKhandaProse(sentences),
		};
	});
}
