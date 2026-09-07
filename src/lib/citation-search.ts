import type { HomeLocale } from '../data/home';

const RV_PATTERN =
	/^(?:(?:rv|ṛg|rg|rik|rigveda|ऋग्वेद)\s*)?(\d{1,2})\s*[.:,\-]\s*(\d{1,3})\s*[.:,\-]\s*(\d{1,3})$/i;
const TS_PATTERN =
	/^(?:(?:ts|tai|taittiriya|तैत्तिरीय)\s+)(\d{1})\s*[.:,\-]\s*(\d{1,2})\s*[.:,\-]\s*(\d{1,3})$/i;

const TS_PRAPATHAKAS = [0, 8, 6, 5, 7, 7, 6, 5];

function localePrefix(locale: HomeLocale): string {
	return locale === 'iast' ? '/iast' : '';
}

export function resolveCitationQuery(
	query: string,
	locale: HomeLocale
): Array<{ title: string; href: string; detail: string; group: 'citation' }> {
	const trimmed = query.trim();
	if (!trimmed) return [];

	const ts = trimmed.match(TS_PATTERN);
	if (ts) {
		const kanda = Number(ts[1]);
		const prapathaka = Number(ts[2]);
		const anuvaka = Number(ts[3]);
		const maxP = TS_PRAPATHAKAS[kanda];
		if (!maxP || prapathaka < 1 || prapathaka > maxP) return [];
		const href = `${localePrefix(locale)}/taittiriya-samhita/kanda-${kanda}/prapathaka-${prapathaka}/#anuvaka-${anuvaka}`;
		return [
			{
				title:
					locale === 'iast'
						? `Taittirīya Saṃhitā ${kanda}.${prapathaka}.${anuvaka}`
						: `तैत्तिरीय संहिता ${kanda}.${prapathaka}.${anuvaka}`,
				href,
				detail: 'TS',
				group: 'citation',
			},
		];
	}

	const rv = trimmed.match(RV_PATTERN);
	if (!rv) return [];
	const mandala = Number(rv[1]);
	const sukta = Number(rv[2]);
	const verse = Number(rv[3]);
	if (mandala < 1 || mandala > 10 || sukta < 1 || sukta > 191 || verse < 1 || verse > 80) {
		return [];
	}
	const href = `${localePrefix(locale)}/rigveda-samhita/mandala-${mandala}/sukta-${sukta}/#mantra-${verse}`;
	return [
		{
			title: locale === 'iast' ? `Ṛgveda ${mandala}.${sukta}.${verse}` : `ऋग्वेद ${mandala}.${sukta}.${verse}`,
			href,
			detail: 'RV',
			group: 'citation',
		},
	];
}
