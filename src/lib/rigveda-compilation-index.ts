import type { CompilationMap } from './rigveda-corpus';
import { verseKey } from './rigveda-corpus';
import { getSangrahaEntry, sangrahaHref } from '../data/sangraha';
import type { HomeLocale } from '../data/home';

const compilationModules = import.meta.glob<{ default: CompilationMap }>(
	'../data/rigveda/compilations/*.json',
	{ eager: true }
);

let maps: CompilationMap[] | undefined;
let verseToIds: Map<string, string[]> | undefined;

function compilationIdFromPath(path: string): string {
	const file = path.split('/').pop() ?? '';
	return file.replace(/\.json$/, '');
}

export function getCompilationMaps(): CompilationMap[] {
	if (maps) return maps;
	maps = Object.entries(compilationModules).map(([path, mod]) => {
		const loaded = mod.default;
		return {
			...loaded,
			id: loaded.id || compilationIdFromPath(path),
		};
	});
	return maps;
}

function verseIndex(): Map<string, string[]> {
	if (verseToIds) return verseToIds;
	verseToIds = new Map();
	for (const compilation of getCompilationMaps()) {
		for (const section of compilation.sections) {
			for (const mantra of section.mantras) {
				if (
					mantra.mandala === undefined ||
					mantra.sukta === undefined ||
					mantra.verse === undefined
				) {
					continue;
				}
				const key = verseKey(mantra.mandala, mantra.sukta, mantra.verse);
				const list = verseToIds.get(key) ?? [];
				if (!list.includes(compilation.id)) list.push(compilation.id);
				verseToIds.set(key, list);
			}
		}
	}
	return verseToIds;
}

export function compilationsSharingVerse(
	mandala: number,
	sukta: number,
	verse: number,
	exceptId?: string
): string[] {
	const ids = verseIndex().get(verseKey(mandala, sukta, verse)) ?? [];
	return exceptId ? ids.filter((id) => id !== exceptId) : ids;
}

export function uniqueCrossCompilationLinks(
	compilation: CompilationMap,
	locale: HomeLocale
): Array<{ id: string; href: string; label: string }> {
	const seen = new Set<string>();
	const links: Array<{ id: string; href: string; label: string }> = [];
	for (const section of compilation.sections) {
		for (const mantra of section.mantras) {
			if (
				mantra.mandala === undefined ||
				mantra.sukta === undefined ||
				mantra.verse === undefined
			) {
				continue;
			}
			for (const id of compilationsSharingVerse(
				mantra.mandala,
				mantra.sukta,
				mantra.verse,
				compilation.id
			)) {
				if (seen.has(id)) continue;
				seen.add(id);
				const entry = getSangrahaEntry(id);
				links.push({
					id,
					href: sangrahaHref(id, locale),
					label: locale === 'iast' ? (entry?.iastTitle ?? id) : (entry?.rootTitle ?? id),
				});
			}
		}
	}
	return links.sort((a, b) => a.label.localeCompare(b.label, 'en'));
}
