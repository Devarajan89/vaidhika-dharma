import type { HomeLocale } from '../data/home';
import { getMandalaSuktas, getSuktaRecord } from './rigveda-corpus';
import {
	TAITTIRIYA_KANDAS,
	kandaPrapathakaToChapter,
} from '../../scripts/lib/taittiriya-samhita-structure.mjs';
import { MAITRAYANI_KANDAS } from '../../scripts/lib/maitrayani-samhita-structure.mjs';
import { AITAREYA_PANCHIKAS } from '../../scripts/lib/aitareya-brahmana-structure.mjs';

export interface JumpNavItem {
	id: string;
	label: string;
	href?: string;
}

export interface PageNavLink {
	href: string;
	label: string;
}

export interface SamhitaPageNavLinks {
	prev?: PageNavLink;
	next?: PageNavLink;
	up?: PageNavLink;
	index?: PageNavLink;
}

const MANDALA_COUNT = 10;
const ADHYAYA_COUNT = 40;

function prefix(locale: HomeLocale): string {
	return locale === 'iast' ? '/iast' : '';
}

export function getRigvedaMandalaHref(mandala: number, locale: HomeLocale): string {
	return `${prefix(locale)}/rigveda-samhita/mandala-${mandala}/`;
}

export function getRigvedaSuktaHref(
	mandala: number,
	sukta: number,
	locale: HomeLocale
): string {
	return `${getRigvedaMandalaHref(mandala, locale)}sukta-${sukta}/`;
}

export function getRigvedaMandalaJumpItems(mandala: number, _locale: HomeLocale): JumpNavItem[] {
	return getMandalaSuktas(mandala).map((record) => ({
		id: `sukta-${record.sukta}`,
		label: String(record.sukta),
	}));
}

export function getRigvedaMandalaPageNav(mandala: number, locale: HomeLocale): SamhitaPageNavLinks {
	const up = {
		href: `${prefix(locale)}/rigveda-samhita/`,
		label: locale === 'iast' ? 'Saṃhitā index' : 'संहिता सूची',
	};
	if (mandala <= 1) {
		return mandala < MANDALA_COUNT
			? {
					up,
					next: {
						href: getRigvedaMandalaHref(mandala + 1, locale),
						label:
							locale === 'iast'
								? `Next · Maṇḍala ${mandala + 1}`
								: `अग्रिम · मण्डल ${mandala + 1}`,
					},
				}
			: { up };
	}
	if (mandala >= MANDALA_COUNT) {
		return {
			up,
			prev: {
				href: getRigvedaMandalaHref(mandala - 1, locale),
				label:
					locale === 'iast'
						? `Previous · Maṇḍala ${mandala - 1}`
						: `पूर्व · मण्डल ${mandala - 1}`,
			},
		};
	}
	return {
		up,
		prev: {
			href: getRigvedaMandalaHref(mandala - 1, locale),
			label:
				locale === 'iast'
					? `Previous · Maṇḍala ${mandala - 1}`
					: `पूर्व · मण्डल ${mandala - 1}`,
		},
		next: {
			href: getRigvedaMandalaHref(mandala + 1, locale),
			label:
				locale === 'iast'
					? `Next · Maṇḍala ${mandala + 1}`
					: `अग्रिम · मण्डल ${mandala + 1}`,
		},
	};
}

export function getRigvedaSuktaMantraJumpItems(
	mandala: number,
	sukta: number,
	locale: HomeLocale
): JumpNavItem[] {
	const record = getSuktaRecord(mandala, sukta);
	if (!record) return [];
	return record.verses.map((verse) => ({
		id: `mantra-${verse}`,
		label: String(verse),
	}));
}

export function getRigvedaSuktaPageNav(
	mandala: number,
	sukta: number,
	locale: HomeLocale
): SamhitaPageNavLinks {
	const suktas = getMandalaSuktas(mandala);
	const index = suktas.findIndex((record) => record.sukta === sukta);
	const up = {
		href: getRigvedaMandalaHref(mandala, locale),
		label: locale === 'iast' ? `Maṇḍala ${mandala}` : `मण्डल ${mandala}`,
	};
	const nav: SamhitaPageNavLinks = { up };

	if (index > 0) {
		const prevSukta = suktas[index - 1].sukta;
		nav.prev = {
			href: getRigvedaSuktaHref(mandala, prevSukta, locale),
			label: locale === 'iast' ? `Sūkta ${prevSukta}` : `सूक्त ${prevSukta}`,
		};
	}
	if (index >= 0 && index < suktas.length - 1) {
		const nextSukta = suktas[index + 1].sukta;
		nav.next = {
			href: getRigvedaSuktaHref(mandala, nextSukta, locale),
			label: locale === 'iast' ? `Sūkta ${nextSukta}` : `सूक्त ${nextSukta}`,
		};
	}
	return nav;
}

export function getYajurvedaAdhyayaHref(
	tradition: 'madhyandina' | 'kanva',
	chapter: number,
	locale: HomeLocale
): string {
	return `${prefix(locale)}/${tradition}-samhita/chapter-${String(chapter).padStart(2, '0')}/`;
}

export function getYajurvedaAdhyayaIndexHref(
	tradition: 'madhyandina' | 'kanva',
	chapter: number,
	locale: HomeLocale
): string {
	return `${prefix(locale)}/${tradition}-samhita/chapter-${chapter}-index/`;
}

export function getYajurvedaMantraJumpItems(mantraCount: number): JumpNavItem[] {
	return Array.from({ length: mantraCount }, (_, index) => ({
		id: `mantra-${index + 1}`,
		label: String(index + 1),
	}));
}

export function getYajurvedaAdhyayaPageNav(
	tradition: 'madhyandina' | 'kanva',
	chapter: number,
	locale: HomeLocale
): SamhitaPageNavLinks {
	const up = {
		href: `${prefix(locale)}/${tradition}-samhita/`,
		label: locale === 'iast' ? 'Saṃhitā index' : 'संहिता सूची',
	};
	const index = {
		href: getYajurvedaAdhyayaIndexHref(tradition, chapter, locale),
		label: locale === 'iast' ? 'Mantra index' : 'मन्त्र सूची',
	};
	const nav: SamhitaPageNavLinks = { up, index };

	if (chapter > 1) {
		nav.prev = {
			href: getYajurvedaAdhyayaHref(tradition, chapter - 1, locale),
			label:
				locale === 'iast'
					? `Previous · Adhyāya ${chapter - 1}`
					: `पूर्व · अध्याय ${chapter - 1}`,
		};
	}
	if (chapter < ADHYAYA_COUNT) {
		nav.next = {
			href: getYajurvedaAdhyayaHref(tradition, chapter + 1, locale),
			label:
				locale === 'iast'
					? `Next · Adhyāya ${chapter + 1}`
					: `अग्रिम · अध्याय ${chapter + 1}`,
		};
	}
	return nav;
}

export function getTaittiriyaKandaHref(kanda: number, locale: HomeLocale): string {
	return `${prefix(locale)}/taittiriya-samhita/kanda-${kanda}/`;
}

export function getTaittiriyaPrapathakaHref(
	kanda: number,
	prapathaka: number,
	locale: HomeLocale
): string {
	return `${getTaittiriyaKandaHref(kanda, locale)}prapathaka-${prapathaka}/`;
}

export function getTaittiriyaKandaJumpItems(kanda: number, _locale: HomeLocale): JumpNavItem[] {
	const kandaInfo = TAITTIRIYA_KANDAS.find((entry) => entry.kanda === kanda);
	if (!kandaInfo) return [];

	return Array.from({ length: kandaInfo.prapathakaCount }, (_, index) => {
		const prapathaka = index + 1;
		return {
			id: `prapathaka-${prapathaka}`,
			label: String(prapathaka),
		};
	});
}

export function getTaittiriyaKandaPageNav(kanda: number, locale: HomeLocale): SamhitaPageNavLinks {
	const up = {
		href: `${prefix(locale)}/taittiriya-samhita/`,
		label: locale === 'iast' ? 'Saṃhitā index' : 'संहिता सूची',
	};
	const nav: SamhitaPageNavLinks = { up };
	const kandaIndex = TAITTIRIYA_KANDAS.findIndex((entry) => entry.kanda === kanda);

	if (kandaIndex > 0) {
		const prevKanda = TAITTIRIYA_KANDAS[kandaIndex - 1].kanda;
		nav.prev = {
			href: getTaittiriyaKandaHref(prevKanda, locale),
			label:
				locale === 'iast'
					? TAITTIRIYA_KANDAS[kandaIndex - 1].iastLabel
					: TAITTIRIYA_KANDAS[kandaIndex - 1].rootLabel,
		};
	}
	if (kandaIndex >= 0 && kandaIndex < TAITTIRIYA_KANDAS.length - 1) {
		const nextKanda = TAITTIRIYA_KANDAS[kandaIndex + 1].kanda;
		nav.next = {
			href: getTaittiriyaKandaHref(nextKanda, locale),
			label:
				locale === 'iast'
					? TAITTIRIYA_KANDAS[kandaIndex + 1].iastLabel
					: TAITTIRIYA_KANDAS[kandaIndex + 1].rootLabel,
		};
	}
	return nav;
}

export function getTaittiriyaAnuvakaJumpItems(anuvakaCount: number): JumpNavItem[] {
	return Array.from({ length: anuvakaCount }, (_, index) => ({
		id: `anuvaka-${index + 1}`,
		label: String(index + 1),
	}));
}

export function getTaittiriyaPrapathakaPageNav(
	kanda: number,
	prapathaka: number,
	locale: HomeLocale
): SamhitaPageNavLinks {
	const kandaInfo = TAITTIRIYA_KANDAS.find((entry) => entry.kanda === kanda);
	const up = {
		href: getTaittiriyaKandaHref(kanda, locale),
		label: kandaInfo
			? locale === 'iast'
				? kandaInfo.iastLabel
				: kandaInfo.rootLabel
			: locale === 'iast'
				? `Kāṇḍa ${kanda}`
				: `काण्ड ${kanda}`,
	};
	const nav: SamhitaPageNavLinks = { up };

	if (prapathaka > 1) {
		nav.prev = {
			href: getTaittiriyaPrapathakaHref(kanda, prapathaka - 1, locale),
			label: locale === 'iast' ? `Prapāṭhaka ${prapathaka - 1}` : `प्रपाठक ${prapathaka - 1}`,
		};
	}
	if (kandaInfo && prapathaka < kandaInfo.prapathakaCount) {
		nav.next = {
			href: getTaittiriyaPrapathakaHref(kanda, prapathaka + 1, locale),
			label: locale === 'iast' ? `Prapāṭhaka ${prapathaka + 1}` : `प्रपाठक ${prapathaka + 1}`,
		};
	}
	return nav;
}

export function getTaittiriyaGlobalChapter(kanda: number, prapathaka: number): number {
	return kandaPrapathakaToChapter(kanda, prapathaka);
}

export function getMaitrayaniKandaHref(kanda: number, locale: HomeLocale): string {
	return `${prefix(locale)}/maitrayani-samhita/kanda-${kanda}/`;
}

export function getMaitrayaniPrapathakaHref(
	kanda: number,
	prapathaka: number,
	locale: HomeLocale
): string {
	return `${getMaitrayaniKandaHref(kanda, locale)}prapathaka-${prapathaka}/`;
}

export function getMaitrayaniKandaJumpItems(kanda: number, _locale: HomeLocale): JumpNavItem[] {
	const kandaInfo = MAITRAYANI_KANDAS.find((entry) => entry.kanda === kanda);
	if (!kandaInfo) return [];

	return Array.from({ length: kandaInfo.prapathakaCount }, (_, index) => {
		const prapathaka = index + 1;
		return {
			id: `prapathaka-${prapathaka}`,
			label: String(prapathaka),
		};
	});
}

export function getMaitrayaniKandaPageNav(kanda: number, locale: HomeLocale): SamhitaPageNavLinks {
	const up = {
		href: `${prefix(locale)}/maitrayani-samhita/`,
		label: locale === 'iast' ? 'Saṃhitā index' : 'संहिता सूची',
	};
	const nav: SamhitaPageNavLinks = { up };
	const kandaIndex = MAITRAYANI_KANDAS.findIndex((entry) => entry.kanda === kanda);

	if (kandaIndex > 0) {
		const prevKanda = MAITRAYANI_KANDAS[kandaIndex - 1].kanda;
		nav.prev = {
			href: getMaitrayaniKandaHref(prevKanda, locale),
			label:
				locale === 'iast'
					? MAITRAYANI_KANDAS[kandaIndex - 1].iastLabel
					: MAITRAYANI_KANDAS[kandaIndex - 1].rootLabel,
		};
	}
	if (kandaIndex >= 0 && kandaIndex < MAITRAYANI_KANDAS.length - 1) {
		const nextKanda = MAITRAYANI_KANDAS[kandaIndex + 1].kanda;
		nav.next = {
			href: getMaitrayaniKandaHref(nextKanda, locale),
			label:
				locale === 'iast'
					? MAITRAYANI_KANDAS[kandaIndex + 1].iastLabel
					: MAITRAYANI_KANDAS[kandaIndex + 1].rootLabel,
		};
	}
	return nav;
}

export function getMaitrayaniAnuvakaJumpItems(anuvakaCount: number): JumpNavItem[] {
	return Array.from({ length: anuvakaCount }, (_, index) => ({
		id: `anuvaka-${index + 1}`,
		label: String(index + 1),
	}));
}

export function getMaitrayaniPrapathakaPageNav(
	kanda: number,
	prapathaka: number,
	locale: HomeLocale
): SamhitaPageNavLinks {
	const kandaInfo = MAITRAYANI_KANDAS.find((entry) => entry.kanda === kanda);
	const up = {
		href: getMaitrayaniKandaHref(kanda, locale),
		label: kandaInfo
			? locale === 'iast'
				? kandaInfo.iastLabel
				: kandaInfo.rootLabel
			: locale === 'iast'
				? `Kāṇḍa ${kanda}`
				: `काण्ड ${kanda}`,
	};
	const nav: SamhitaPageNavLinks = { up };

	if (prapathaka > 1) {
		nav.prev = {
			href: getMaitrayaniPrapathakaHref(kanda, prapathaka - 1, locale),
			label: locale === 'iast' ? `Prapāṭhaka ${prapathaka - 1}` : `प्रपाठक ${prapathaka - 1}`,
		};
	}
	if (kandaInfo && prapathaka < kandaInfo.prapathakaCount) {
		nav.next = {
			href: getMaitrayaniPrapathakaHref(kanda, prapathaka + 1, locale),
			label: locale === 'iast' ? `Prapāṭhaka ${prapathaka + 1}` : `प्रपाठक ${prapathaka + 1}`,
		};
	}
	return nav;
}

export function getAitareyaBrahmanaHref(locale: HomeLocale): string {
	return `${prefix(locale)}/aitareya-brahmana/`;
}

export function getAitareyaPanchikaHref(panchika: number, locale: HomeLocale): string {
	return `${prefix(locale)}/aitareya-brahmana/panchika-${panchika}/`;
}

export function getAitareyaAdhyayaHref(
	panchika: number,
	adhyaya: number,
	locale: HomeLocale
): string {
	return `${getAitareyaPanchikaHref(panchika, locale)}adhyaya-${adhyaya}/`;
}

export function getAitareyaPanchikaJumpItems(panchika: number, _locale: HomeLocale): JumpNavItem[] {
	return Array.from({ length: 5 }, (_, index) => {
		const adhyaya = index + 1;
		return {
			id: `adhyaya-${adhyaya}`,
			label: String(adhyaya),
		};
	});
}

export function getAitareyaPanchikaPageNav(panchika: number, locale: HomeLocale): SamhitaPageNavLinks {
	const up = {
		href: getAitareyaBrahmanaHref(locale),
		label: locale === 'iast' ? 'Brāhmaṇa index' : 'ब्राह्मण सूची',
	};
	const nav: SamhitaPageNavLinks = { up };
	const panchikaIndex = AITAREYA_PANCHIKAS.findIndex((entry) => entry.panchika === panchika);

	if (panchikaIndex > 0) {
		const prevPanchika = AITAREYA_PANCHIKAS[panchikaIndex - 1].panchika;
		nav.prev = {
			href: getAitareyaPanchikaHref(prevPanchika, locale),
			label:
				locale === 'iast'
					? AITAREYA_PANCHIKAS[panchikaIndex - 1].iastLabel
					: AITAREYA_PANCHIKAS[panchikaIndex - 1].rootLabel,
		};
	}
	if (panchikaIndex >= 0 && panchikaIndex < AITAREYA_PANCHIKAS.length - 1) {
		const nextPanchika = AITAREYA_PANCHIKAS[panchikaIndex + 1].panchika;
		nav.next = {
			href: getAitareyaPanchikaHref(nextPanchika, locale),
			label:
				locale === 'iast'
					? AITAREYA_PANCHIKAS[panchikaIndex + 1].iastLabel
					: AITAREYA_PANCHIKAS[panchikaIndex + 1].rootLabel,
		};
	}
	return nav;
}

export function getAitareyaAdhyayaJumpItems(khandaCount: number): JumpNavItem[] {
	return Array.from({ length: khandaCount }, (_, index) => ({
		id: `khanda-${index + 1}`,
		label: String(index + 1),
	}));
}

export function getAitareyaAdhyayaPageNav(
	panchika: number,
	adhyaya: number,
	locale: HomeLocale
): SamhitaPageNavLinks {
	const panchikaInfo = AITAREYA_PANCHIKAS.find((entry) => entry.panchika === panchika);
	const up = {
		href: getAitareyaPanchikaHref(panchika, locale),
		label: panchikaInfo
			? locale === 'iast'
				? panchikaInfo.iastLabel
				: panchikaInfo.rootLabel
			: locale === 'iast'
				? `Pañcikā ${panchika}`
				: `पञ्चिका ${panchika}`,
	};
	const nav: SamhitaPageNavLinks = { up };

	if (adhyaya > 1) {
		nav.prev = {
			href: getAitareyaAdhyayaHref(panchika, adhyaya - 1, locale),
			label: locale === 'iast' ? `Adhyāya ${adhyaya - 1}` : `अध्याय ${adhyaya - 1}`,
		};
	}
	if (adhyaya < 5) {
		nav.next = {
			href: getAitareyaAdhyayaHref(panchika, adhyaya + 1, locale),
			label: locale === 'iast' ? `Adhyāya ${adhyaya + 1}` : `अध्याय ${adhyaya + 1}`,
		};
	}
	return nav;
}
