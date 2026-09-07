/** @typedef {{ kanda: number; prapathakaCount: number; rootLabel: string; iastLabel: string }} KandaInfo */

/** @type {KandaInfo[]} */
export const TAITTIRIYA_KANDAS = [
	{ kanda: 1, prapathakaCount: 8, rootLabel: 'प्रथम काण्ड', iastLabel: 'Prathama kāṇḍa' },
	{ kanda: 2, prapathakaCount: 6, rootLabel: 'द्वितीय काण्ड', iastLabel: 'Dvitīya kāṇḍa' },
	{ kanda: 3, prapathakaCount: 5, rootLabel: 'तृतीय काण्ड', iastLabel: 'Tṛtīya kāṇḍa' },
	{ kanda: 4, prapathakaCount: 7, rootLabel: 'चतुर्थ काण्ड', iastLabel: 'Caturtha kāṇḍa' },
	{ kanda: 5, prapathakaCount: 7, rootLabel: 'पञ्चम काण्ड', iastLabel: 'Pañcama kāṇḍa' },
	{ kanda: 6, prapathakaCount: 6, rootLabel: 'षष्ठ काण्ड', iastLabel: 'Ṣaṣṭha kāṇḍa' },
	{ kanda: 7, prapathakaCount: 5, rootLabel: 'सप्तम काण्ड', iastLabel: 'Saptama kāṇḍa' },
];

export const TAITTIRIYA_TOTAL_PRAPATHAKAS = TAITTIRIYA_KANDAS.reduce(
	(sum, kanda) => sum + kanda.prapathakaCount,
	0
);

/**
 * @param {number} chapterNumber Global prapathaka number (1–44)
 */
export function chapterToKandaPrapathaka(chapterNumber) {
	let cursor = 0;
	for (const kanda of TAITTIRIYA_KANDAS) {
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
	for (const kanda of TAITTIRIYA_KANDAS) {
		if (kanda.kanda === kandaNumber) {
			if (prapathakaNumber < 1 || prapathakaNumber > kanda.prapathakaCount) {
				throw new Error(`Invalid prapathaka ${prapathakaNumber} for kanda ${kandaNumber}`);
			}
			return cursor + prapathakaNumber;
		}
		cursor += kanda.prapathakaCount;
	}
	throw new Error(`Invalid kanda number: ${kandaNumber}`);
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
	const prefix = locale === 'iast' ? 'iast/taittiriya-samhita' : 'taittiriya-samhita';
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

/**
 * @param {number} chapterNumber
 * @deprecated Use kanda/prapathaka folder paths instead.
 */
export function chapterFileName(chapterNumber) {
	return `chapter-${String(chapterNumber).padStart(2, '0')}.mdx`;
}
