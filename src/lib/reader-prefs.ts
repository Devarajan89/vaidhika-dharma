export const READER_KEYS = {
	mantraSize: 'vaidhika-mantra-size',
	chanting: 'vaidhika-chanting',
	indicScript: 'vaidhika-indic-script',
	resume: 'vaidhika-resume',
	shakha: 'vaidhika-shakha',
} as const;

export type MantraSize = 'sm' | 'md' | 'lg' | 'xl';
export type ShakhaId = 'aswalayana' | 'apastamba';

export interface ResumeEntry {
	href: string;
	title: string;
	at: number;
}

export const MANTRA_SIZES: MantraSize[] = ['sm', 'md', 'lg', 'xl'];

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
