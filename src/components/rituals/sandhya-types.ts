import type { HomeLocale } from '../../data/home';

export type SandhyaTime = 'prata' | 'madhyahnika' | 'sayam';
export type RitualVariant = 'aswalayana' | 'apastamba';
export type LocaleKey = 'root' | 'iast';

export function toLocaleKey(locale: HomeLocale): LocaleKey {
	return locale === 'ta' ? 'iast' : locale;
}

export function sectionTime(lines: string[], index: number): SandhyaTime {
	let time: SandhyaTime = 'prata';
	for (let i = 0; i < index; i++) {
		const line = lines[i];
		if (!/^## /.test(line)) continue;
		if (/prata|प्रात/i.test(line)) time = 'prata';
		else if (/madhy|mādhy|माध्य/i.test(line)) time = 'madhyahnika';
		else if (/sayam|sāyam|साय/i.test(line)) time = 'sayam';
	}
	return time;
}
