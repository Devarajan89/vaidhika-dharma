import type { HomeLocale } from './home';
import toc from './rigveda/riksukta-sangraha-toc.json';

export interface SangrahaTocEntry {
	order: number;
	id: string;
	rootTitle: string;
	iastTitle: string;
	bookPage?: number;
}

export const SANGRAHA_TOC = toc as SangrahaTocEntry[];

export function sangrahaHref(id: string, locale: HomeLocale): string {
	return locale === 'iast' ? `/iast/${id}/` : `/${id}/`;
}

export function getSangrahaEntry(id: string): SangrahaTocEntry | undefined {
	return SANGRAHA_TOC.find((entry) => entry.id === id);
}

export function sangrahaCategoryNodes(locale: HomeLocale): Array<{ label: string; href: string }> {
	return SANGRAHA_TOC.map((entry) => ({
		label: locale === 'iast' ? entry.iastTitle : entry.rootTitle,
		href: sangrahaHref(entry.id, locale),
	}));
}

export function sangrahaSearchSynonyms(): Array<{
	aliases: string[];
	query: string;
	label: Record<HomeLocale, string>;
	href: Record<HomeLocale, string>;
}> {
	return SANGRAHA_TOC.map((entry) => {
		const spaced = entry.id.replace(/-/g, ' ');
		const short = entry.id.replace(/-suktam(?:-rig)?$/, '').replace(/-/g, ' ');
		return {
			aliases: [...new Set([spaced, short, entry.rootTitle, entry.iastTitle])],
			query: spaced,
			label: { root: entry.rootTitle, iast: entry.iastTitle },
			href: { root: sangrahaHref(entry.id, 'root'), iast: sangrahaHref(entry.id, 'iast') },
		};
	});
}

export function sangrahaSegmentLabels(): Record<string, string> {
	return Object.fromEntries(SANGRAHA_TOC.map((entry) => [entry.id, entry.iastTitle]));
}
