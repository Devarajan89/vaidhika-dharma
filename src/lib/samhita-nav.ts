import type { HomeLocale } from '../data/home';
import { getMandalaSuktas, getSuktaRecord } from './rigveda-corpus';
import {
	TAITTIRIYA_KANDAS,
	kandaPrapathakaToChapter,
} from '../../scripts/lib/taittiriya-samhita-structure.mjs';
import { MAITRAYANI_KANDAS } from '../../scripts/lib/maitrayani-samhita-structure.mjs';
import { AITAREYA_PANCHIKAS } from '../../scripts/lib/aitareya-brahmana-structure.mjs';
import { TAITTIRIYA_BRAHMANA_ASHTAKAS } from '../../scripts/lib/taittiriya-brahmana-structure.mjs';
import {
	TAITTIRIYA_ARANYAKA_PRASHNAS,
	getPrashnaSidebarLabel,
} from '../../scripts/lib/taittiriya-aranyaka-structure.mjs';
import {
	AITAREYA_ARANYAKAS,
	AITAREYA_ARANYAKA_ADHYAYAS,
	AITAREYA_ARANYAKA_TOTAL_ADHYAYAS,
	aranyakaAdhyayaToGlobal,
	globalToAranyakaAdhyaya,
} from '../../scripts/lib/aitareya-aranyaka-structure.mjs';

export interface JumpNavItem {
	id: string;
	label: string;
	href?: string;
}

export interface PageNavLink {
	href: string;
	label: string;
}

export interface SequenceProgress {
	current: number;
	total: number;
	context: string;
}

export interface SamhitaPageNavLinks {
	prev?: PageNavLink;
	next?: PageNavLink;
	up?: PageNavLink;
	index?: PageNavLink;
	start?: PageNavLink;
	progress?: SequenceProgress;
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

export function getRigvedaMandalaJumpItems(mandala: number, locale: HomeLocale): JumpNavItem[] {
	return getMandalaSuktas(mandala).map((record) => ({
		id: `sukta-${record.sukta}`,
		label: String(record.sukta),
		href: getRigvedaSuktaHref(mandala, record.sukta, locale),
	}));
}

export function getRigvedaMandalaPageNav(mandala: number, locale: HomeLocale): SamhitaPageNavLinks {
	const up = {
		href: `${prefix(locale)}/rigveda-samhita/`,
		label: locale === 'iast' ? 'Saṃhitā index' : 'संहिता सूची',
	};
	const firstSukta = getMandalaSuktas(mandala)[0];
	const start = firstSukta
		? {
				href: getRigvedaSuktaHref(mandala, firstSukta.sukta, locale),
				label:
					locale === 'iast'
						? `Start from sūkta ${firstSukta.sukta}`
						: `सूक्त ${firstSukta.sukta} तः आरभ्यताम्`,
			}
		: undefined;

	if (mandala <= 1) {
		return mandala < MANDALA_COUNT
			? {
					up,
					start,
					next: {
						href: getRigvedaMandalaHref(mandala + 1, locale),
						label:
							locale === 'iast'
								? `Next · Maṇḍala ${mandala + 1}`
								: `अग्रिम · मण्डल ${mandala + 1}`,
					},
				}
			: { up, start };
	}
	if (mandala >= MANDALA_COUNT) {
		return {
			up,
			start,
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
		start,
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
	} else if (mandala > 1) {
		const previousMandala = getMandalaSuktas(mandala - 1);
		const lastSukta = previousMandala[previousMandala.length - 1];
		if (lastSukta) {
			nav.prev = {
				href: getRigvedaSuktaHref(mandala - 1, lastSukta.sukta, locale),
				label:
					locale === 'iast'
						? `Maṇḍala ${mandala - 1} · Sūkta ${lastSukta.sukta}`
						: `मण्डल ${mandala - 1} · सूक्त ${lastSukta.sukta}`,
			};
		}
	}

	if (index >= 0 && index < suktas.length - 1) {
		const nextSukta = suktas[index + 1].sukta;
		nav.next = {
			href: getRigvedaSuktaHref(mandala, nextSukta, locale),
			label: locale === 'iast' ? `Sūkta ${nextSukta}` : `सूक्त ${nextSukta}`,
		};
	} else if (index === suktas.length - 1 && mandala < MANDALA_COUNT) {
		const following = getMandalaSuktas(mandala + 1)[0];
		if (following) {
			nav.next = {
				href: getRigvedaSuktaHref(mandala + 1, following.sukta, locale),
				label:
					locale === 'iast'
						? `Maṇḍala ${mandala + 1} · Sūkta ${following.sukta}`
						: `मण्डल ${mandala + 1} · सूक्त ${following.sukta}`,
			};
		}
	}

	if (index >= 0) {
		nav.progress = {
			current: index + 1,
			total: suktas.length,
			context: locale === 'iast' ? `Maṇḍala ${mandala}` : `मण्डल ${mandala}`,
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
	nav.progress = {
		current: chapter,
		total: ADHYAYA_COUNT,
		context: locale === 'iast' ? 'Adhyāya' : 'अध्यायः',
	};
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

export function getTaittiriyaKandaJumpItems(kanda: number, locale: HomeLocale): JumpNavItem[] {
	const kandaInfo = TAITTIRIYA_KANDAS.find((entry) => entry.kanda === kanda);
	if (!kandaInfo) return [];

	return Array.from({ length: kandaInfo.prapathakaCount }, (_, index) => {
		const prapathaka = index + 1;
		return {
			id: `prapathaka-${prapathaka}`,
			label: String(prapathaka),
			href: getTaittiriyaPrapathakaHref(kanda, prapathaka, locale),
		};
	});
}

export function getTaittiriyaKandaPageNav(kanda: number, locale: HomeLocale): SamhitaPageNavLinks {
	const up = {
		href: `${prefix(locale)}/taittiriya-samhita/`,
		label: locale === 'iast' ? 'Saṃhitā index' : 'संहिता सूची',
	};
	const nav: SamhitaPageNavLinks = {
		up,
		start: {
			href: getTaittiriyaPrapathakaHref(kanda, 1, locale),
			label: locale === 'iast' ? 'Start from prapāṭhaka 1' : 'प्रपाठक 1 तः आरभ्यताम्',
		},
	};
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
	} else if (kanda > 1) {
		const previous = TAITTIRIYA_KANDAS.find((entry) => entry.kanda === kanda - 1);
		if (previous) {
			nav.prev = {
				href: getTaittiriyaPrapathakaHref(kanda - 1, previous.prapathakaCount, locale),
				label:
					locale === 'iast'
						? `Kāṇḍa ${kanda - 1} · Prapāṭhaka ${previous.prapathakaCount}`
						: `काण्ड ${kanda - 1} · प्रपाठक ${previous.prapathakaCount}`,
			};
		}
	}
	if (kandaInfo && prapathaka < kandaInfo.prapathakaCount) {
		nav.next = {
			href: getTaittiriyaPrapathakaHref(kanda, prapathaka + 1, locale),
			label: locale === 'iast' ? `Prapāṭhaka ${prapathaka + 1}` : `प्रपाठक ${prapathaka + 1}`,
		};
	} else if (kandaInfo && prapathaka >= kandaInfo.prapathakaCount) {
		const following = TAITTIRIYA_KANDAS.find((entry) => entry.kanda === kanda + 1);
		if (following) {
			nav.next = {
				href: getTaittiriyaPrapathakaHref(kanda + 1, 1, locale),
				label:
					locale === 'iast'
						? `Kāṇḍa ${kanda + 1} · Prapāṭhaka 1`
						: `काण्ड ${kanda + 1} · प्रपाठक 1`,
			};
		}
	}
	nav.progress = {
		current: prapathaka,
		total: kandaInfo?.prapathakaCount ?? prapathaka,
		context: up.label,
	};
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

export function getMaitrayaniKandaJumpItems(kanda: number, locale: HomeLocale): JumpNavItem[] {
	const kandaInfo = MAITRAYANI_KANDAS.find((entry) => entry.kanda === kanda);
	if (!kandaInfo) return [];

	return Array.from({ length: kandaInfo.prapathakaCount }, (_, index) => {
		const prapathaka = index + 1;
		return {
			id: `prapathaka-${prapathaka}`,
			label: String(prapathaka),
			href: getMaitrayaniPrapathakaHref(kanda, prapathaka, locale),
		};
	});
}

export function getMaitrayaniKandaPageNav(kanda: number, locale: HomeLocale): SamhitaPageNavLinks {
	const up = {
		href: `${prefix(locale)}/maitrayani-samhita/`,
		label: locale === 'iast' ? 'Saṃhitā index' : 'संहिता सूची',
	};
	const nav: SamhitaPageNavLinks = {
		up,
		start: {
			href: getMaitrayaniPrapathakaHref(kanda, 1, locale),
			label: locale === 'iast' ? 'Start from prapāṭhaka 1' : 'प्रपाठक 1 तः आरभ्यताम्',
		},
	};
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
	} else if (kanda > 1) {
		const previous = MAITRAYANI_KANDAS.find((entry) => entry.kanda === kanda - 1);
		if (previous) {
			nav.prev = {
				href: getMaitrayaniPrapathakaHref(kanda - 1, previous.prapathakaCount, locale),
				label:
					locale === 'iast'
						? `Kāṇḍa ${kanda - 1} · Prapāṭhaka ${previous.prapathakaCount}`
						: `काण्ड ${kanda - 1} · प्रपाठक ${previous.prapathakaCount}`,
			};
		}
	}
	if (kandaInfo && prapathaka < kandaInfo.prapathakaCount) {
		nav.next = {
			href: getMaitrayaniPrapathakaHref(kanda, prapathaka + 1, locale),
			label: locale === 'iast' ? `Prapāṭhaka ${prapathaka + 1}` : `प्रपाठक ${prapathaka + 1}`,
		};
	} else if (kandaInfo && prapathaka >= kandaInfo.prapathakaCount) {
		const following = MAITRAYANI_KANDAS.find((entry) => entry.kanda === kanda + 1);
		if (following) {
			nav.next = {
				href: getMaitrayaniPrapathakaHref(kanda + 1, 1, locale),
				label:
					locale === 'iast'
						? `Kāṇḍa ${kanda + 1} · Prapāṭhaka 1`
						: `काण्ड ${kanda + 1} · प्रपाठक 1`,
			};
		}
	}
	nav.progress = {
		current: prapathaka,
		total: kandaInfo?.prapathakaCount ?? prapathaka,
		context: up.label,
	};
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
	const nav: SamhitaPageNavLinks = {
		up,
		start: {
			href: getAitareyaAdhyayaHref(panchika, 1, locale),
			label: locale === 'iast' ? 'Start from adhyāya 1' : 'अध्याय 1 तः आरभ्यताम्',
		},
	};
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
	const adhyayaCount = panchikaInfo?.adhyayaCount ?? 5;

	if (adhyaya > 1) {
		nav.prev = {
			href: getAitareyaAdhyayaHref(panchika, adhyaya - 1, locale),
			label: locale === 'iast' ? `Adhyāya ${adhyaya - 1}` : `अध्याय ${adhyaya - 1}`,
		};
	} else if (panchika > 1) {
		const previous = AITAREYA_PANCHIKAS.find((entry) => entry.panchika === panchika - 1);
		if (previous) {
			nav.prev = {
				href: getAitareyaAdhyayaHref(previous.panchika, previous.adhyayaCount, locale),
				label:
					locale === 'iast'
						? `Pañcikā ${previous.panchika} · Adhyāya ${previous.adhyayaCount}`
						: `पञ्चिका ${previous.panchika} · अध्याय ${previous.adhyayaCount}`,
			};
		}
	}
	if (adhyaya < adhyayaCount) {
		nav.next = {
			href: getAitareyaAdhyayaHref(panchika, adhyaya + 1, locale),
			label: locale === 'iast' ? `Adhyāya ${adhyaya + 1}` : `अध्याय ${adhyaya + 1}`,
		};
	} else {
		const following = AITAREYA_PANCHIKAS.find((entry) => entry.panchika === panchika + 1);
		if (following) {
			nav.next = {
				href: getAitareyaAdhyayaHref(following.panchika, 1, locale),
				label:
					locale === 'iast'
						? `Pañcikā ${following.panchika} · Adhyāya 1`
						: `पञ्चिका ${following.panchika} · अध्याय 1`,
			};
		}
	}
	nav.progress = {
		current: adhyaya,
		total: adhyayaCount,
		context: up.label,
	};
	return nav;
}

export function getTaittiriyaBrahmanaHref(locale: HomeLocale): string {
	return `${prefix(locale)}/taittiriya-brahmana/`;
}

export function getTaittiriyaBrahmanaAshtakaHref(ashtaka: number, locale: HomeLocale): string {
	return `${prefix(locale)}/taittiriya-brahmana/ashtaka-${ashtaka}/`;
}

export function getTaittiriyaBrahmanaPrapathakaHref(
	ashtaka: number,
	prapathaka: number,
	locale: HomeLocale
): string {
	return `${getTaittiriyaBrahmanaAshtakaHref(ashtaka, locale)}prapathaka-${prapathaka}/`;
}

export function getTaittiriyaBrahmanaAshtakaJumpItems(
	ashtaka: number,
	_locale: HomeLocale
): JumpNavItem[] {
	const ashtakaInfo = TAITTIRIYA_BRAHMANA_ASHTAKAS.find((entry) => entry.ashtaka === ashtaka);
	if (!ashtakaInfo) return [];
	return Array.from({ length: ashtakaInfo.prapathakaCount }, (_, index) => {
		const prapathaka = index + 1;
		return {
			id: `prapathaka-${prapathaka}`,
			label: String(prapathaka),
		};
	});
}

export function getTaittiriyaBrahmanaAshtakaPageNav(
	ashtaka: number,
	locale: HomeLocale
): SamhitaPageNavLinks {
	const up = {
		href: getTaittiriyaBrahmanaHref(locale),
		label: locale === 'iast' ? 'Brāhmaṇa index' : 'ब्राह्मण सूची',
	};
	const nav: SamhitaPageNavLinks = {
		up,
		start: {
			href: getTaittiriyaBrahmanaPrapathakaHref(ashtaka, 1, locale),
			label: locale === 'iast' ? 'Start from prapāṭhaka 1' : 'प्रपाठक 1 तः आरभ्यताम्',
		},
	};
	const ashtakaIndex = TAITTIRIYA_BRAHMANA_ASHTAKAS.findIndex((entry) => entry.ashtaka === ashtaka);

	if (ashtakaIndex > 0) {
		const prevAshtaka = TAITTIRIYA_BRAHMANA_ASHTAKAS[ashtakaIndex - 1].ashtaka;
		nav.prev = {
			href: getTaittiriyaBrahmanaAshtakaHref(prevAshtaka, locale),
			label:
				locale === 'iast'
					? TAITTIRIYA_BRAHMANA_ASHTAKAS[ashtakaIndex - 1].iastLabel
					: TAITTIRIYA_BRAHMANA_ASHTAKAS[ashtakaIndex - 1].rootLabel,
		};
	}
	if (ashtakaIndex >= 0 && ashtakaIndex < TAITTIRIYA_BRAHMANA_ASHTAKAS.length - 1) {
		const nextAshtaka = TAITTIRIYA_BRAHMANA_ASHTAKAS[ashtakaIndex + 1].ashtaka;
		nav.next = {
			href: getTaittiriyaBrahmanaAshtakaHref(nextAshtaka, locale),
			label:
				locale === 'iast'
					? TAITTIRIYA_BRAHMANA_ASHTAKAS[ashtakaIndex + 1].iastLabel
					: TAITTIRIYA_BRAHMANA_ASHTAKAS[ashtakaIndex + 1].rootLabel,
		};
	}
	return nav;
}

export function getTaittiriyaBrahmanaPrapathakaJumpItems(anuvakaCount: number): JumpNavItem[] {
	return Array.from({ length: anuvakaCount }, (_, index) => ({
		id: `anuvaka-${index + 1}`,
		label: String(index + 1),
	}));
}

export function getTaittiriyaBrahmanaPrapathakaPageNav(
	ashtaka: number,
	prapathaka: number,
	locale: HomeLocale
): SamhitaPageNavLinks {
	const ashtakaInfo = TAITTIRIYA_BRAHMANA_ASHTAKAS.find((entry) => entry.ashtaka === ashtaka);
	const up = {
		href: getTaittiriyaBrahmanaAshtakaHref(ashtaka, locale),
		label: ashtakaInfo
			? locale === 'iast'
				? ashtakaInfo.iastLabel
				: ashtakaInfo.rootLabel
			: locale === 'iast'
				? `Āṣṭaka ${ashtaka}`
				: `अष्टक ${ashtaka}`,
	};
	const nav: SamhitaPageNavLinks = { up };

	if (prapathaka > 1) {
		nav.prev = {
			href: getTaittiriyaBrahmanaPrapathakaHref(ashtaka, prapathaka - 1, locale),
			label: locale === 'iast' ? `Prapāṭhaka ${prapathaka - 1}` : `प्रपाठक ${prapathaka - 1}`,
		};
	} else if (ashtaka > 1) {
		const previous = TAITTIRIYA_BRAHMANA_ASHTAKAS.find((entry) => entry.ashtaka === ashtaka - 1);
		if (previous) {
			nav.prev = {
				href: getTaittiriyaBrahmanaPrapathakaHref(
					previous.ashtaka,
					previous.prapathakaCount,
					locale
				),
				label:
					locale === 'iast'
						? `Āṣṭaka ${previous.ashtaka} · Prapāṭhaka ${previous.prapathakaCount}`
						: `अष्टक ${previous.ashtaka} · प्रपाठक ${previous.prapathakaCount}`,
			};
		}
	}
	if (ashtakaInfo && prapathaka < ashtakaInfo.prapathakaCount) {
		nav.next = {
			href: getTaittiriyaBrahmanaPrapathakaHref(ashtaka, prapathaka + 1, locale),
			label: locale === 'iast' ? `Prapāṭhaka ${prapathaka + 1}` : `प्रपाठक ${prapathaka + 1}`,
		};
	} else if (ashtakaInfo) {
		const following = TAITTIRIYA_BRAHMANA_ASHTAKAS.find((entry) => entry.ashtaka === ashtaka + 1);
		if (following) {
			nav.next = {
				href: getTaittiriyaBrahmanaPrapathakaHref(following.ashtaka, 1, locale),
				label:
					locale === 'iast'
						? `Āṣṭaka ${following.ashtaka} · Prapāṭhaka 1`
						: `अष्टक ${following.ashtaka} · प्रपाठक 1`,
			};
		}
	}
	nav.progress = {
		current: prapathaka,
		total: ashtakaInfo?.prapathakaCount ?? prapathaka,
		context: up.label,
	};
	return nav;
}

export function getTaittiriyaAranyakaHref(locale: HomeLocale): string {
	return `${prefix(locale)}/taittiriya-aranyaka/`;
}

export function getTaittiriyaAranyakaPrashnaHref(prashna: number, locale: HomeLocale): string {
	return `${getTaittiriyaAranyakaHref(locale)}prashna-${prashna}/`;
}

export function getTaittiriyaAranyakaPrashnaJumpItems(anuvakaCount: number): JumpNavItem[] {
	return Array.from({ length: anuvakaCount }, (_, index) => ({
		id: `anuvaka-${index + 1}`,
		label: String(index + 1),
	}));
}

export function getTaittiriyaAranyakaPrashnaPageNav(
	prashna: number,
	locale: HomeLocale
): SamhitaPageNavLinks {
	const nav: SamhitaPageNavLinks = {
		up: {
			href: getTaittiriyaAranyakaHref(locale),
			label: locale === 'iast' ? 'Taittirīya āraṇyakam' : 'तैत्तिरीय आरण्यकम्',
		},
	};

	if (prashna > 1) {
		nav.prev = {
			href: getTaittiriyaAranyakaPrashnaHref(prashna - 1, locale),
			label: getPrashnaSidebarLabel(prashna - 1, locale),
		};
	}
	if (prashna < TAITTIRIYA_ARANYAKA_PRASHNAS.length) {
		nav.next = {
			href: getTaittiriyaAranyakaPrashnaHref(prashna + 1, locale),
			label: getPrashnaSidebarLabel(prashna + 1, locale),
		};
	}
	nav.progress = {
		current: prashna,
		total: TAITTIRIYA_ARANYAKA_PRASHNAS.length,
		context: locale === 'iast' ? 'Praśna' : 'प्रश्नः',
	};
	return nav;
}

export function getAitareyaAranyakaHref(locale: HomeLocale): string {
	return `${prefix(locale)}/aitareya-aranyaka/`;
}

export function getAitareyaAranyakaAranyakaHref(aranyaka: number, locale: HomeLocale): string {
	return `${getAitareyaAranyakaHref(locale)}aranyaka-${aranyaka}/`;
}

export function getAitareyaAranyakaAdhyayaHref(
	aranyaka: number,
	adhyaya: number,
	locale: HomeLocale
): string {
	return `${getAitareyaAranyakaAranyakaHref(aranyaka, locale)}adhyaya-${adhyaya}/`;
}

export function getAitareyaAranyakaAdhyayaJumpItems(khandaCount: number): JumpNavItem[] {
	return Array.from({ length: khandaCount }, (_, index) => ({
		id: `khanda-${index + 1}`,
		label: String(index + 1),
	}));
}

export function getAitareyaAranyakaAdhyayaPageNav(
	aranyaka: number,
	adhyaya: number,
	locale: HomeLocale
): SamhitaPageNavLinks {
	const globalAdhyaya = aranyakaAdhyayaToGlobal(aranyaka, adhyaya);
	const nav: SamhitaPageNavLinks = {
		up: {
			href: getAitareyaAranyakaAranyakaHref(aranyaka, locale),
			label:
				AITAREYA_ARANYAKAS.find((entry) => entry.aranyaka === aranyaka)?.[
					locale === 'iast' ? 'iastLabel' : 'rootLabel'
				] ?? String(aranyaka),
		},
	};

	if (globalAdhyaya > 1) {
		const prev = globalToAranyakaAdhyaya(globalAdhyaya - 1);
		const prevInfo = AITAREYA_ARANYAKA_ADHYAYAS.find(
			(entry) => entry.globalAdhyaya === globalAdhyaya - 1
		);
		nav.prev = {
			href: getAitareyaAranyakaAdhyayaHref(prev.aranyaka, prev.adhyaya, locale),
			label:
				locale === 'iast'
					? (prevInfo?.iastLabel.split(', ').pop() ?? `Adhyāya ${prev.adhyaya}`)
					: (prevInfo?.rootLabel.split(', ').pop() ?? `अध्याय ${prev.adhyaya}`),
		};
	}
	if (globalAdhyaya < AITAREYA_ARANYAKA_TOTAL_ADHYAYAS) {
		const next = globalToAranyakaAdhyaya(globalAdhyaya + 1);
		const nextInfo = AITAREYA_ARANYAKA_ADHYAYAS.find(
			(entry) => entry.globalAdhyaya === globalAdhyaya + 1
		);
		nav.next = {
			href: getAitareyaAranyakaAdhyayaHref(next.aranyaka, next.adhyaya, locale),
			label:
				locale === 'iast'
					? (nextInfo?.iastLabel.split(', ').pop() ?? `Adhyāya ${next.adhyaya}`)
					: (nextInfo?.rootLabel.split(', ').pop() ?? `अध्याय ${next.adhyaya}`),
		};
	}
	nav.progress = {
		current: globalAdhyaya,
		total: AITAREYA_ARANYAKA_TOTAL_ADHYAYAS,
		context: nav.up?.label ?? (locale === 'iast' ? 'Āraṇyakam' : 'आरण्यकम्'),
	};
	return nav;
}
