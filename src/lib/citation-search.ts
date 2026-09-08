import type { HomeLocale } from '../data/home';

const RV_FULL =
	/^(?:(?:rv|ṛg|rg|rik|rigveda|ऋग्वेद)\s*)?(\d{1,2})\s*[.:,\-]\s*(\d{1,3})\s*[.:,\-]\s*(\d{1,3})$/i;
const RV_SUKTA =
	/^(?:(?:rv|ṛg|rg|rik|rigveda|ऋग्वेद)\s+)(\d{1,2})\s*[.:,\-]\s*(\d{1,3})$/i;
const TS_FULL =
	/^(?:(?:ts|tai|taittiriya|तैत्तिरीय)\s+)(\d{1})\s*[.:,\-]\s*(\d{1,2})\s*[.:,\-]\s*(\d{1,3})$/i;
const TS_PRAP =
	/^(?:(?:ts|tai|taittiriya|तैत्तिरीय)\s+)(\d{1})\s*[.:,\-]\s*(\d{1,2})$/i;
const VS_CHAPTER =
	/^(?:(?:vs|vsk|vsm|vajasaneyi|शुक्ल)\s+)?(?:(?:kanva|kāṇva|काण्व|madhyandina|mādhyandina|माध्यन्दिन)\s+)?(\d{1,2})$/i;

const TS_PRAPATHAKAS = [0, 8, 6, 5, 7, 7, 6, 5];

type CitationHit = { title: string; href: string; detail: string; group: 'citation' };

function localePrefix(locale: HomeLocale): string {
	return locale === 'iast' ? '/iast' : '';
}

function rvHit(
	locale: HomeLocale,
	mandala: number,
	sukta: number,
	verse?: number
): CitationHit | null {
	if (mandala < 1 || mandala > 10 || sukta < 1 || sukta > 191) return null;
	if (verse !== undefined && (verse < 1 || verse > 80)) return null;
	const base = `${localePrefix(locale)}/rigveda-samhita/mandala-${mandala}/sukta-${sukta}/`;
	const href = verse ? `${base}#mantra-${verse}` : base;
	const cite =
		verse !== undefined ? `${mandala}.${sukta}.${verse}` : `${mandala}.${sukta}`;
	return {
		title: locale === 'iast' ? `Ṛgveda ${cite}` : `ऋग्वेद ${cite}`,
		href,
		detail: verse !== undefined ? `RV ${cite}` : `RV ${cite} (sūkta)`,
		group: 'citation',
	};
}

function tsHit(
	locale: HomeLocale,
	kanda: number,
	prapathaka: number,
	anuvaka?: number
): CitationHit | null {
	const maxP = TS_PRAPATHAKAS[kanda];
	if (!maxP || prapathaka < 1 || prapathaka > maxP) return null;
	const base = `${localePrefix(locale)}/taittiriya-samhita/kanda-${kanda}/prapathaka-${prapathaka}/`;
	const href = anuvaka ? `${base}#anuvaka-${anuvaka}` : base;
	const cite =
		anuvaka !== undefined
			? `${kanda}.${prapathaka}.${anuvaka}`
			: `${kanda}.${prapathaka}`;
	return {
		title:
			locale === 'iast'
				? `Taittirīya Saṃhitā ${cite}`
				: `तैत्तिरीय संहिता ${cite}`,
		href,
		detail: anuvaka !== undefined ? `TS ${cite}` : `TS ${cite} (prapāṭhaka)`,
		group: 'citation',
	};
}

export function resolveCitationQuery(
	query: string,
	locale: HomeLocale
): CitationHit[] {
	const trimmed = query.trim();
	if (!trimmed) return [];

	const tsFull = trimmed.match(TS_FULL);
	if (tsFull) {
		const hit = tsHit(locale, Number(tsFull[1]), Number(tsFull[2]), Number(tsFull[3]));
		return hit ? [hit] : [];
	}

	const tsPrap = trimmed.match(TS_PRAP);
	if (tsPrap) {
		const hit = tsHit(locale, Number(tsPrap[1]), Number(tsPrap[2]));
		return hit ? [hit] : [];
	}

	const rvFull = trimmed.match(RV_FULL);
	if (rvFull) {
		const hit = rvHit(locale, Number(rvFull[1]), Number(rvFull[2]), Number(rvFull[3]));
		return hit ? [hit] : [];
	}

	const rvSukta = trimmed.match(RV_SUKTA);
	if (rvSukta) {
		const hit = rvHit(locale, Number(rvSukta[1]), Number(rvSukta[2]));
		return hit ? [hit] : [];
	}

	const lower = trimmed.toLowerCase();
	const vsMatch = trimmed.match(VS_CHAPTER);
	if (
		vsMatch &&
		(/kanva|kāṇva|काण्व|madhyandina|mādhyandina|माध्यन्दिन|vs\b|vsk|vsm|vajasaneyi|शुक्ल/.test(
			lower
		) ||
			/^(?:kanva|madhyandina)\s+\d{1,2}$/i.test(trimmed))
	) {
		const chapter = Number(vsMatch[1]);
		if (chapter < 1 || chapter > 40) return [];
		const isKanva = /kanva|kāṇva|काण्व|vsk/.test(lower);
		const isMadhy = /madhyandina|mādhyandina|माध्यन्दिन|vsm/.test(lower);
		const corpus = isKanva
			? 'kanva-samhita'
			: isMadhy
				? 'madhyandina-samhita'
				: null;
		if (!corpus) return [];
		const label =
			corpus === 'kanva-samhita'
				? locale === 'iast'
					? `Kāṇva Saṃhitā adhyāya ${chapter}`
					: `काण्व संहिता अध्याय ${chapter}`
				: locale === 'iast'
					? `Mādhyandina Saṃhitā adhyāya ${chapter}`
					: `माध्यन्दिन संहिता अध्याय ${chapter}`;
		return [
			{
				title: label,
				href: `${localePrefix(locale)}/${corpus}/chapter-${chapter}/`,
				detail: corpus === 'kanva-samhita' ? `VS-K ${chapter}` : `VS-M ${chapter}`,
				group: 'citation',
			},
		];
	}

	return [];
}
