import type { HomeLocale } from '../data/home';
import { getYajushaEntry, yajushaHref } from '../data/yajusha';
import { getSamhitaVerseHref, samhitaRefCode } from './rigveda-corpus';
import {
	getTaittiriyaAranyakaPrashnaHref,
	getTaittiriyaBrahmanaPrapathakaHref,
	getTaittiriyaPrapathakaHref,
} from './samhita-nav';

export interface YajushaSourceBlock {
	text?: string;
	rv?: { mandala: number; sukta: number; verse: number };
	ts?: { kanda: number; prapathaka: number; anuvaka: number };
	tb?: { ashtaka: number; prapathaka: number; anuvaka: number };
	ta?: { prashna: number; anuvaka: number };
}

export interface YajushaCompilationSection {
	header?: string;
	blocks: YajushaSourceBlock[];
}

export interface YajushaCorpusLink {
	rootLabel: string;
	iastLabel: string;
	slug: string;
}

export interface YajushaCompilationMap {
	id: string;
	sourceNote?: string;
	related?: string[];
	corpusLinks?: YajushaCorpusLink[];
	sections: YajushaCompilationSection[];
}

export interface YajushaSourceCite {
	code: string;
	href: string;
}

const compilationModules = import.meta.glob<{ default: YajushaCompilationMap }>(
	'../data/yajusha/compilations/*.json',
	{ eager: true }
);

let maps: YajushaCompilationMap[] | undefined;
let sourceToIds: Map<string, string[]> | undefined;

function compilationIdFromPath(path: string): string {
	const file = path.split('/').pop() ?? '';
	return file.replace(/\.json$/, '');
}

export function getYajushaCompilationMaps(): YajushaCompilationMap[] {
	if (maps) return maps;
	maps = Object.entries(compilationModules).map(([path, mod]) => {
		const loaded = mod.default;
		return {
			...loaded,
			id: loaded.id || compilationIdFromPath(path),
			sections: loaded.sections ?? [],
		};
	});
	return maps;
}

function sourceKey(block: YajushaSourceBlock): string | undefined {
	if (block.rv) return `rv:${block.rv.mandala}.${block.rv.sukta}.${block.rv.verse}`;
	if (block.ts) return `ts:${block.ts.kanda}.${block.ts.prapathaka}.${block.ts.anuvaka}`;
	if (block.tb) return `tb:${block.tb.ashtaka}.${block.tb.prapathaka}.${block.tb.anuvaka}`;
	if (block.ta) return `ta:${block.ta.prashna}.${block.ta.anuvaka}`;
	return undefined;
}

function sourceIndex(): Map<string, string[]> {
	if (sourceToIds) return sourceToIds;
	sourceToIds = new Map();
	for (const compilation of getYajushaCompilationMaps()) {
		for (const section of compilation.sections) {
			for (const block of section.blocks) {
				const key = sourceKey(block);
				if (!key) continue;
				const list = sourceToIds.get(key) ?? [];
				if (!list.includes(compilation.id)) list.push(compilation.id);
				sourceToIds.set(key, list);
			}
		}
	}
	return sourceToIds;
}

export function yajushaSourceCite(
	block: YajushaSourceBlock,
	locale: HomeLocale
): YajushaSourceCite | undefined {
	if (block.rv) {
		return {
			code: `RV ${samhitaRefCode(block.rv.mandala, block.rv.sukta, block.rv.verse)}`,
			href: getSamhitaVerseHref(block.rv.mandala, block.rv.sukta, block.rv.verse, locale),
		};
	}
	if (block.ts) {
		return {
			code: `TS ${block.ts.kanda}.${block.ts.prapathaka}.${block.ts.anuvaka}`,
			href: `${getTaittiriyaPrapathakaHref(block.ts.kanda, block.ts.prapathaka, locale)}#anuvaka-${block.ts.anuvaka}`,
		};
	}
	if (block.tb) {
		return {
			code: `TB ${block.tb.ashtaka}.${block.tb.prapathaka}.${block.tb.anuvaka}`,
			href: `${getTaittiriyaBrahmanaPrapathakaHref(block.tb.ashtaka, block.tb.prapathaka, locale)}#anuvaka-${block.tb.anuvaka}`,
		};
	}
	if (block.ta) {
		return {
			code: `TA ${block.ta.prashna}.${block.ta.anuvaka}`,
			href: `${getTaittiriyaAranyakaPrashnaHref(block.ta.prashna, locale)}#anuvaka-${block.ta.anuvaka}`,
		};
	}
	return undefined;
}

export function uniqueYajushaCrossLinks(
	compilation: YajushaCompilationMap,
	locale: HomeLocale
): Array<{ href: string; label: string }> {
	const seen = new Set<string>();
	const links: Array<{ href: string; label: string }> = [];
	for (const section of compilation.sections) {
		for (const block of section.blocks) {
			const key = sourceKey(block);
			if (!key) continue;
			for (const id of sourceIndex().get(key) ?? []) {
				if (id === compilation.id || seen.has(id)) continue;
				seen.add(id);
				const entry = getYajushaEntry(id);
				if (!entry) continue;
				links.push({
					href: yajushaHref(entry, locale),
					label: locale === 'iast' ? entry.iastTitle : entry.rootTitle,
				});
			}
		}
	}
	return links.sort((a, b) => a.label.localeCompare(b.label, 'en'));
}

const RELATED_LABELS: Record<string, { root: string; iast: string }> = {
	'mahanarayana-upanishad': { root: 'महानारायणोपनिषत्', iast: 'Mahānārāyaṇopaniṣat' },
	'taittiriya-upanishad': { root: 'तैत्तिरीयोपनिषत्', iast: 'Taittirīyopaniṣat' },
};

export function yajushaRelatedLinks(
	related: string[] | undefined,
	locale: HomeLocale
): Array<{ href: string; label: string }> {
	if (!related?.length) return [];
	const prefix = locale === 'iast' ? '/iast' : '';
	return related.flatMap((item) => {
		const entry = getYajushaEntry(item);
		if (entry) {
			return [
				{
					href: yajushaHref(entry, locale),
					label: locale === 'iast' ? entry.iastTitle : entry.rootTitle,
				},
			];
		}
		const [slug, hash] = item.split('#');
		const known = RELATED_LABELS[slug];
		return [
			{
				href: hash ? `${prefix}/${slug}/#${hash}` : `${prefix}/${slug}/`,
				label: known ? (locale === 'iast' ? known.iast : known.root) : slug,
			},
		];
	});
}
