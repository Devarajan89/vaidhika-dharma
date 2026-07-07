/** @typedef {{ ashtaka: number; prapathakaCount: number; rootLabel: string; iastLabel: string }} AshtakaInfo */

/** @type {AshtakaInfo[]} */
export const TAITTIRIYA_BRAHMANA_ASHTAKAS = [
	{ ashtaka: 1, prapathakaCount: 8, rootLabel: 'प्रथमाष्टकम्', iastLabel: 'Prathamāṣṭakam' },
	{ ashtaka: 2, prapathakaCount: 8, rootLabel: 'द्वितीयाष्टकम्', iastLabel: 'Dvitīyāṣṭakam' },
	{ ashtaka: 3, prapathakaCount: 12, rootLabel: 'तृतीयाष्टकम्', iastLabel: 'Tṛtīyāṣṭakam' },
];

export const TAITTIRIYA_BRAHMANA_TOTAL_PRAPATHAKAS = TAITTIRIYA_BRAHMANA_ASHTAKAS.reduce(
	(sum, ashtaka) => sum + ashtaka.prapathakaCount,
	0
);

/** Prapāṭhakas 3.10–3.12 are traditionally the Kāṭhakam (separate from the main TB source). */
export const KATHAKAM_ASHTAKA = 3;
export const KATHAKAM_PRAPATHAKAS = [10, 11, 12];

/**
 * @param {number} ashtakaNumber
 * @param {number} prapathakaNumber
 */
export function isKathakamPrapathaka(ashtakaNumber, prapathakaNumber) {
	return (
		ashtakaNumber === KATHAKAM_ASHTAKA && KATHAKAM_PRAPATHAKAS.includes(prapathakaNumber)
	);
}

const PRAPATHAKA_ORDINALS = {
	root: [
		'प्रथमः प्रपाठकः',
		'द्वितीयः प्रपाठकः',
		'तृतीयः प्रपाठकः',
		'चतुर्थः प्रपाठकः',
		'पञ्चमः प्रपाठकः',
		'षष्ठः प्रपाठकः',
		'सप्तमः प्रपाठकः',
		'अष्टमः प्रपाठकः',
		'नवमः प्रपाठकः',
		'दशमः प्रपाठकः',
		'एकादशः प्रपाठकः',
		'द्वादशः प्रपाठकः',
	],
	iast: [
		'Prathamaḥ prapāṭhakaḥ',
		'Dvitīyaḥ prapāṭhakaḥ',
		'Tṛtīyaḥ prapāṭhakaḥ',
		'Caturthaḥ prapāṭhakaḥ',
		'Pañcamaḥ prapāṭhakaḥ',
		'Ṣaṣṭhaḥ prapāṭhakaḥ',
		'Saptamaḥ prapāṭhakaḥ',
		'Aṣṭamaḥ prapāṭhakaḥ',
		'Navamaḥ prapāṭhakaḥ',
		'Daśamaḥ prapāṭhakaḥ',
		'Ekādaśaḥ prapāṭhakaḥ',
		'Dvādaśaḥ prapāṭhakaḥ',
	],
};

/**
 * @param {number} prapathakaNumber Prapāṭhaka within āṣṭaka (1–12)
 * @param {'root' | 'iast'} locale
 */
export function getPrapathakaSidebarLabel(prapathakaNumber, locale) {
	return PRAPATHAKA_ORDINALS[locale][prapathakaNumber - 1] ?? String(prapathakaNumber);
}

/**
 * @param {number} ashtakaNumber
 * @param {number} prapathakaNumber
 * @param {'root' | 'iast'} locale
 */
export function getPrapathakaDisplayLabel(ashtakaNumber, prapathakaNumber, locale) {
	const ordinal = getPrapathakaSidebarLabel(prapathakaNumber, locale);
	if (!isKathakamPrapathaka(ashtakaNumber, prapathakaNumber)) {
		return ordinal;
	}
	return locale === 'iast' ? `${ordinal} (Kāṭhakam)` : `${ordinal} (काठकम्)`;
}

/**
 * @param {number} globalPrapathaka
 */
export function prapathakaToAshtakaPrapathaka(globalPrapathaka) {
	let cursor = 0;
	for (const ashtaka of TAITTIRIYA_BRAHMANA_ASHTAKAS) {
		if (globalPrapathaka <= cursor + ashtaka.prapathakaCount) {
			return {
				ashtaka: ashtaka.ashtaka,
				prapathaka: globalPrapathaka - cursor,
				ashtakaInfo: ashtaka,
			};
		}
		cursor += ashtaka.prapathakaCount;
	}
	throw new Error(`Invalid global prapāṭhaka number: ${globalPrapathaka}`);
}

/**
 * @param {number} ashtakaNumber
 * @param {number} prapathakaNumber
 */
export function ashtakaPrapathakaToGlobal(ashtakaNumber, prapathakaNumber) {
	let cursor = 0;
	for (const ashtaka of TAITTIRIYA_BRAHMANA_ASHTAKAS) {
		if (ashtaka.ashtaka === ashtakaNumber) {
			if (prapathakaNumber < 1 || prapathakaNumber > ashtaka.prapathakaCount) {
				throw new Error(`Invalid prapāṭhaka ${prapathakaNumber} for āṣṭaka ${ashtakaNumber}`);
			}
			return cursor + prapathakaNumber;
		}
		cursor += ashtaka.prapathakaCount;
	}
	throw new Error(`Invalid āṣṭaka number: ${ashtakaNumber}`);
}

/**
 * @param {number} ashtakaNumber
 */
export function ashtakaDirName(ashtakaNumber) {
	return `Ashtaka_${String(ashtakaNumber).padStart(2, '0')}`;
}

/**
 * @param {number} prapathakaNumber
 */
export function prapathakaDirName(prapathakaNumber) {
	return `Prapathaka_${String(prapathakaNumber).padStart(2, '0')}`;
}

/**
 * @param {number} ashtakaNumber
 * @param {'root' | 'iast'} locale
 */
export function ashtakaSlug(ashtakaNumber, locale) {
	const prefix = locale === 'iast' ? 'iast/taittiriya-brahmana' : 'taittiriya-brahmana';
	return `${prefix}/ashtaka-${ashtakaNumber}`;
}

/**
 * @param {number} ashtakaNumber
 * @param {number} prapathakaNumber
 * @param {'root' | 'iast'} locale
 */
export function prapathakaSlug(ashtakaNumber, prapathakaNumber, locale) {
	return `${ashtakaSlug(ashtakaNumber, locale)}/prapathaka-${prapathakaNumber}`;
}
