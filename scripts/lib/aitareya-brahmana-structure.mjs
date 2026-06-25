/** @typedef {{ panchika: number; adhyayaCount: number; rootLabel: string; iastLabel: string }} PanchikaInfo */

/** @type {PanchikaInfo[]} */
export const AITAREYA_PANCHIKAS = [
	{ panchika: 1, adhyayaCount: 5, rootLabel: 'प्रथमा पञ्चिका', iastLabel: 'Prathamā pañcikā' },
	{ panchika: 2, adhyayaCount: 5, rootLabel: 'द्वितीया पञ्चिका', iastLabel: 'Dvitīyā pañcikā' },
	{ panchika: 3, adhyayaCount: 5, rootLabel: 'तृतीया पञ्चिका', iastLabel: 'Tṛtīyā pañcikā' },
	{ panchika: 4, adhyayaCount: 5, rootLabel: 'चतुर्थी पञ्चिका', iastLabel: 'Caturthī pañcikā' },
	{ panchika: 5, adhyayaCount: 5, rootLabel: 'पञ्चमी पञ्चिका', iastLabel: 'Pañcamī pañcikā' },
	{ panchika: 6, adhyayaCount: 5, rootLabel: 'षष्ठी पञ्चिका', iastLabel: 'Ṣaṣṭhī pañcikā' },
	{ panchika: 7, adhyayaCount: 5, rootLabel: 'सप्तमी पञ्चिका', iastLabel: 'Saptamī pañcikā' },
	{ panchika: 8, adhyayaCount: 5, rootLabel: 'अष्टमी पञ्चिका', iastLabel: 'Aṣṭamī pañcikā' },
];

export const AITAREYA_TOTAL_ADHYAYAS = AITAREYA_PANCHIKAS.reduce(
	(sum, panchika) => sum + panchika.adhyayaCount,
	0
);

/**
 * @param {number} adhyayaNumber Global adhyāya (1–40)
 */
export function adhyayaToPanchikaAdhyaya(adhyayaNumber) {
	let cursor = 0;
	for (const panchika of AITAREYA_PANCHIKAS) {
		if (adhyayaNumber <= cursor + panchika.adhyayaCount) {
			return {
				panchika: panchika.panchika,
				adhyaya: adhyayaNumber - cursor,
				panchikaInfo: panchika,
			};
		}
		cursor += panchika.adhyayaCount;
	}
	throw new Error(`Invalid adhyāya number: ${adhyayaNumber}`);
}

/**
 * @param {number} panchikaNumber
 * @param {number} adhyayaNumber Adhyāya within pañcikā (1–5)
 */
export function panchikaAdhyayaToGlobal(panchikaNumber, adhyayaNumber) {
	let cursor = 0;
	for (const panchika of AITAREYA_PANCHIKAS) {
		if (panchika.panchika === panchikaNumber) {
			if (adhyayaNumber < 1 || adhyayaNumber > panchika.adhyayaCount) {
				throw new Error(`Invalid adhyāya ${adhyayaNumber} for pañcikā ${panchikaNumber}`);
			}
			return cursor + adhyayaNumber;
		}
		cursor += panchika.adhyayaCount;
	}
	throw new Error(`Invalid pañcikā number: ${panchikaNumber}`);
}

/**
 * @param {number} panchikaNumber
 */
export function panchikaDirName(panchikaNumber) {
	return `Panchika_${String(panchikaNumber).padStart(2, '0')}`;
}

/**
 * @param {number} adhyayaNumber Adhyāya within pañcikā
 */
export function adhyayaDirName(adhyayaNumber) {
	return `Adhyaya_${String(adhyayaNumber).padStart(2, '0')}`;
}

/**
 * @param {number} panchikaNumber
 * @param {'root' | 'iast'} locale
 */
export function panchikaSlug(panchikaNumber, locale) {
	const prefix = locale === 'iast' ? 'iast/aitareya-brahmana' : 'aitareya-brahmana';
	return `${prefix}/panchika-${panchikaNumber}`;
}

/**
 * @param {number} panchikaNumber
 * @param {number} adhyayaNumber
 * @param {'root' | 'iast'} locale
 */
export function adhyayaSlug(panchikaNumber, adhyayaNumber, locale) {
	return `${panchikaSlug(panchikaNumber, locale)}/adhyaya-${adhyayaNumber}`;
}
