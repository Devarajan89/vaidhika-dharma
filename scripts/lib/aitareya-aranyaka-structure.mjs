/** @typedef {{ aranyaka: number; adhyayaCount: number; rootLabel: string; iastLabel: string }} AranyakaInfo */

/** @typedef {{ aranyaka: number; adhyaya: number; globalAdhyaya: number; rootLabel: string; iastLabel: string; kind: 'aranyaka' | 'upanishad-link'; target?: { corpus: 'aitareya-upanishad'; hash: string } }} AdhyayaInfo */

/** Canonical reference edition (MIU Vedic Reserve). */
export const AITAREYA_ARANYAKA_SOURCE_URL =
	'https://vedicreserve.miu.edu/aranyaka/aitareya_aranyaka.pdf';

/** Machine-readable text keyed to Keith (1909), via TITUS. */
export const AITAREYA_ARANYAKA_TEXT_DERIVED_FROM =
	'http://titus.uni-frankfurt.de/texte/etcs/ind/aind/ved/rv/aa/';

/** @type {AranyakaInfo[]} */
export const AITAREYA_ARANYAKAS = [
	{ aranyaka: 1, adhyayaCount: 5, rootLabel: 'प्रथमम् आरण्यकम्', iastLabel: 'Prathamaṃ āraṇyakam' },
	{ aranyaka: 2, adhyayaCount: 7, rootLabel: 'द्वितीयम् आरण्यकम्', iastLabel: 'Dvitīyam āraṇyakam' },
	{ aranyaka: 3, adhyayaCount: 2, rootLabel: 'तृतीयम् आरण्यकम्', iastLabel: 'Tṛtīyam āraṇyakam' },
	{ aranyaka: 4, adhyayaCount: 1, rootLabel: 'चतुर्थम् आरण्यकम्', iastLabel: 'Caturtham āraṇyakam' },
	{ aranyaka: 5, adhyayaCount: 3, rootLabel: 'पञ्चमम् आरण्यकम्', iastLabel: 'Pañcamam āraṇyakam' },
];

export const AITAREYA_ARANYAKA_TOTAL_ADHYAYAS = AITAREYA_ARANYAKAS.reduce(
	(sum, entry) => sum + entry.adhyayaCount,
	0
);

/** Āraṇyaka 2 adhyāyas 4–6 are the Aitareya Upaniṣad (published separately). */
export const AITAREYA_UPANISHAD_ADHYAYAS = [
	{ aranyaka: 2, adhyaya: 4, chapter: 1, hash: 'chapter-1' },
	{ aranyaka: 2, adhyaya: 5, chapter: 2, hash: 'chapter-2' },
	{ aranyaka: 2, adhyaya: 6, chapter: 3, hash: 'chapter-3' },
];

const UPANISHAD_ADHYAYA_KEYS = new Set(
	AITAREYA_UPANISHAD_ADHYAYAS.map((entry) => `${entry.aranyaka}:${entry.adhyaya}`)
);

/**
 * @param {number} aranyakaNumber
 * @param {number} adhyayaNumber Adhyāya within āraṇyaka
 */
export function aranyakaAdhyayaToGlobal(aranyakaNumber, adhyayaNumber) {
	let cursor = 0;
	for (const aranyaka of AITAREYA_ARANYAKAS) {
		if (aranyaka.aranyaka === aranyakaNumber) {
			if (adhyayaNumber < 1 || adhyayaNumber > aranyaka.adhyayaCount) {
				throw new Error(`Invalid adhyāya ${adhyayaNumber} for āraṇyaka ${aranyakaNumber}`);
			}
			return cursor + adhyayaNumber;
		}
		cursor += aranyaka.adhyayaCount;
	}
	throw new Error(`Invalid āraṇyaka number: ${aranyakaNumber}`);
}

/**
 * @param {number} globalAdhyaya
 */
export function globalToAranyakaAdhyaya(globalAdhyaya) {
	let cursor = 0;
	for (const aranyaka of AITAREYA_ARANYAKAS) {
		if (globalAdhyaya <= cursor + aranyaka.adhyayaCount) {
			return {
				aranyaka: aranyaka.aranyaka,
				adhyaya: globalAdhyaya - cursor,
				aranyakaInfo: aranyaka,
			};
		}
		cursor += aranyaka.adhyayaCount;
	}
	throw new Error(`Invalid global adhyāya: ${globalAdhyaya}`);
}

/**
 * @param {number} aranyakaNumber
 * @param {number} adhyayaNumber
 */
export function isUpanishadAdhyaya(aranyakaNumber, adhyayaNumber) {
	return UPANISHAD_ADHYAYA_KEYS.has(`${aranyakaNumber}:${adhyayaNumber}`);
}

/** @type {AdhyayaInfo[]} */
export const AITAREYA_ARANYAKA_ADHYAYAS = AITAREYA_ARANYAKAS.flatMap((aranyaka) =>
	Array.from({ length: aranyaka.adhyayaCount }, (_, index) => {
		const adhyaya = index + 1;
		const globalAdhyaya = aranyakaAdhyayaToGlobal(aranyaka.aranyaka, adhyaya);
		const upanishad = AITAREYA_UPANISHAD_ADHYAYAS.find(
			(entry) => entry.aranyaka === aranyaka.aranyaka && entry.adhyaya === adhyaya
		);
		const ordinal =
			adhyaya === 1
				? 'प्रथम'
				: adhyaya === 2
					? 'द्वितीय'
					: adhyaya === 3
						? 'तृतीय'
						: adhyaya === 4
							? 'चतुर्थ'
							: adhyaya === 5
								? 'पञ्चम'
								: adhyaya === 6
									? 'षष्ठ'
									: 'सप्तम';
		const ordinalIast =
			adhyaya === 1
				? 'Prathama'
				: adhyaya === 2
					? 'Dvitīya'
					: adhyaya === 3
						? 'Tṛtīya'
						: adhyaya === 4
							? 'Caturtha'
							: adhyaya === 5
								? 'Pañcama'
								: adhyaya === 6
									? 'Ṣaṣṭha'
									: 'Saptama';

		return {
			aranyaka: aranyaka.aranyaka,
			adhyaya,
			globalAdhyaya,
			rootLabel: upanishad
				? `${aranyaka.rootLabel}, ${ordinal}ोऽध्यायः — ऐतरेयोपनिषत् ${upanishad.chapter}`
				: `${aranyaka.rootLabel}, ${ordinal}ोऽध्यायः`,
			iastLabel: upanishad
				? `${aranyaka.iastLabel}, ${ordinalIast} adhyāyaḥ — Aitareyopaniṣat ${upanishad.chapter}`
				: `${aranyaka.iastLabel}, ${ordinalIast} adhyāyaḥ`,
			kind: upanishad ? 'upanishad-link' : 'aranyaka',
			target: upanishad
				? { corpus: 'aitareya-upanishad', hash: upanishad.hash }
				: undefined,
		};
	})
);

export const AITAREYA_ARANYAKA_TEXT_ADHYAYAS = AITAREYA_ARANYAKA_ADHYAYAS.filter(
	(entry) => entry.kind === 'aranyaka'
).map((entry) => entry.globalAdhyaya);

/**
 * @param {number} globalAdhyaya
 */
export function getAdhyayaInfo(globalAdhyaya) {
	return AITAREYA_ARANYAKA_ADHYAYAS.find((entry) => entry.globalAdhyaya === globalAdhyaya);
}

/**
 * @param {number} aranyakaNumber
 */
export function aranyakaDirName(aranyakaNumber) {
	return `Aranyaka_${String(aranyakaNumber).padStart(2, '0')}`;
}

/**
 * @param {number} adhyayaNumber Adhyāya within āraṇyaka
 */
export function adhyayaDirName(adhyayaNumber) {
	return `Adhyaya_${String(adhyayaNumber).padStart(2, '0')}`;
}

/**
 * @param {'root' | 'iast'} locale
 */
export function aranyakaCorpusSlug(locale) {
	return locale === 'iast' ? 'iast/aitareya-aranyaka' : 'aitareya-aranyaka';
}

/**
 * @param {number} aranyakaNumber
 * @param {'root' | 'iast'} locale
 */
export function aranyakaSlug(aranyakaNumber, locale) {
	return `${aranyakaCorpusSlug(locale)}/aranyaka-${aranyakaNumber}`;
}

/**
 * @param {number} aranyakaNumber
 * @param {number} adhyayaNumber
 * @param {'root' | 'iast'} locale
 */
export function adhyayaSlug(aranyakaNumber, adhyayaNumber, locale) {
	return `${aranyakaSlug(aranyakaNumber, locale)}/adhyaya-${adhyayaNumber}`;
}

/**
 * @param {number} globalAdhyaya
 * @param {'root' | 'iast'} locale
 */
export function upanishadTargetHref(globalAdhyaya, locale) {
	const info = getAdhyayaInfo(globalAdhyaya);
	if (!info?.target) return null;
	const prefix = locale === 'iast' ? '/iast/' : '/';
	const base = `${prefix}${info.target.corpus}/`;
	return info.target.hash ? `${base}#${info.target.hash}` : base;
}
