/** @typedef {{ kanda: number; prapathakaCount: number; rootLabel: string; iastLabel: string }} KandaInfo */

/** @type {KandaInfo[]} */
export const MAITRAYANI_KANDAS = [
	{ kanda: 1, prapathakaCount: 11, rootLabel: 'प्रथम काण्ड', iastLabel: 'Prathama kāṇḍa' },
	{ kanda: 2, prapathakaCount: 13, rootLabel: 'द्वितीय काण्ड', iastLabel: 'Dvitīya kāṇḍa' },
	{ kanda: 3, prapathakaCount: 16, rootLabel: 'तृतीय काण्ड', iastLabel: 'Tṛtīya kāṇḍa' },
	{
		kanda: 4,
		prapathakaCount: 14,
		rootLabel: 'चतुर्थ काण्ड (खिल)',
		iastLabel: 'Caturtha kāṇḍa (Khila)',
	},
];

export const MAITRAYANI_TOTAL_PRAPATHAKAS = MAITRAYANI_KANDAS.reduce(
	(sum, kanda) => sum + kanda.prapathakaCount,
	0
);

/**
 * @param {number} chapterNumber Global prapāṭhaka number (1–54)
 */
export function chapterToKandaPrapathaka(chapterNumber) {
	let cursor = 0;
	for (const kanda of MAITRAYANI_KANDAS) {
		if (chapterNumber <= cursor + kanda.prapathakaCount) {
			return {
				kanda: kanda.kanda,
				prapathaka: chapterNumber - cursor,
				kandaInfo: kanda,
			};
		}
		cursor += kanda.prapathakaCount;
	}
	throw new Error(`Invalid chapter number: ${chapterNumber}`);
}

/**
 * @param {number} kandaNumber
 * @param {number} prapathakaNumber
 */
export function kandaPrapathakaToChapter(kandaNumber, prapathakaNumber) {
	let cursor = 0;
	for (const kanda of MAITRAYANI_KANDAS) {
		if (kanda.kanda === kandaNumber) {
			if (prapathakaNumber < 1 || prapathakaNumber > kanda.prapathakaCount) {
				throw new Error(`Invalid prapāṭhaka ${prapathakaNumber} for kāṇḍa ${kandaNumber}`);
			}
			return cursor + prapathakaNumber;
		}
		cursor += kanda.prapathakaCount;
	}
	throw new Error(`Invalid kāṇḍa number: ${kandaNumber}`);
}

/**
 * @param {number} kandaNumber
 */
export function kandaDirName(kandaNumber) {
	return `Kanda_${String(kandaNumber).padStart(2, '0')}`;
}

/**
 * @param {number} prapathakaNumber
 */
export function prapathakaDirName(prapathakaNumber) {
	return `Prapathaka_${String(prapathakaNumber).padStart(2, '0')}`;
}

/**
 * @param {number} kandaNumber
 * @param {'root' | 'iast'} locale
 */
export function kandaSlug(kandaNumber, locale) {
	const prefix = locale === 'iast' ? 'iast/maitrayani-samhita' : 'maitrayani-samhita';
	return `${prefix}/kanda-${kandaNumber}`;
}

/**
 * @param {number} kandaNumber
 * @param {number} prapathakaNumber
 * @param {'root' | 'iast'} locale
 */
export function prapathakaSlug(kandaNumber, prapathakaNumber, locale) {
	return `${kandaSlug(kandaNumber, locale)}/prapathaka-${prapathakaNumber}`;
}
