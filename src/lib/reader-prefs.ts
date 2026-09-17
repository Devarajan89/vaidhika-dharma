export const READER_KEYS = {
	mantraSize: 'vaidhika-mantra-size',
	chanting: 'vaidhika-chanting',
	indicScript: 'vaidhika-indic-script',
	scriptView: 'vaidhika-script-view',
	resume: 'vaidhika-resume',
	recent: 'vaidhika-recent',
	bookmarks: 'vaidhika-bookmarks',
	shakha: 'vaidhika-shakha',
} as const;

export type MantraSize = 'sm' | 'md' | 'lg' | 'xl';
export type ShakhaId = 'aswalayana' | 'apastamba';
export type ScriptView = 'primary' | 'alt';

export interface ResumeEntry {
	href: string;
	title: string;
	at: number;
}

export const MANTRA_SIZES: MantraSize[] = ['sm', 'md', 'lg', 'xl'];
export const RECENT_LIMIT = 5;

export type SandhyaSlot = 'prata' | 'madhyahnika' | 'sayam';

export function getSandhyaTimeSlot(date = new Date()): SandhyaSlot {
	const hour = date.getHours();
	if (hour >= 16 || hour < 4) return 'sayam';
	if (hour >= 11) return 'madhyahnika';
	return 'prata';
}

export function isPracticePath(pathname: string): boolean {
	return (
		/sandhyavandanam|brahmayagyam|samidadhanam/.test(pathname) ||
		/suktam|prashnah|chamakam|laghunyasa|atharvasirsham|pancha-rudram/.test(pathname) ||
		/\/(?:rigveda|kanva|madhyandina|taittiriya|maitrayani)-samhita\//.test(pathname) ||
		/upanishad/.test(pathname)
	);
}

function readEntries(key: string): ResumeEntry[] {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as ResumeEntry[];
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((entry) => entry && typeof entry.href === 'string' && entry.href);
	} catch {
		return [];
	}
}

function writeEntries(key: string, entries: ResumeEntry[]) {
	localStorage.setItem(key, JSON.stringify(entries));
}

export function normalizeResumeHref(href: string): string {
	try {
		const url = new URL(href, 'https://vaidhikadharma.org');
		return url.pathname.replace(/\/+$/, '/') || '/';
	} catch {
		return href;
	}
}

export function pushRecent(entry: ResumeEntry, limit = RECENT_LIMIT): ResumeEntry[] {
	const href = normalizeResumeHref(entry.href);
	const next = [
		{ ...entry, href },
		...readEntries(READER_KEYS.recent).filter((item) => normalizeResumeHref(item.href) !== href),
	].slice(0, limit);
	writeEntries(READER_KEYS.recent, next);
	localStorage.setItem(READER_KEYS.resume, JSON.stringify(next[0]));
	return next;
}

export function readRecent(): ResumeEntry[] {
	return readEntries(READER_KEYS.recent);
}

export function readBookmarks(): ResumeEntry[] {
	return readEntries(READER_KEYS.bookmarks);
}

export function isBookmarked(href: string): boolean {
	const path = normalizeResumeHref(href);
	return readBookmarks().some((entry) => normalizeResumeHref(entry.href) === path);
}

export function toggleBookmark(entry: ResumeEntry): boolean {
	const href = normalizeResumeHref(entry.href);
	const current = readBookmarks();
	const exists = current.some((item) => normalizeResumeHref(item.href) === href);
	const next = exists
		? current.filter((item) => normalizeResumeHref(item.href) !== href)
		: [{ ...entry, href }, ...current];
	writeEntries(READER_KEYS.bookmarks, next);
	return !exists;
}
