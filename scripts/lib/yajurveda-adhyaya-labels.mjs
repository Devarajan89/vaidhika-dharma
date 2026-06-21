/** @typedef {'root' | 'iast'} YajurLocale */

export const CHAPTER_ORDINALS = {
	1: 'प्रथम',
	2: 'द्वितीय',
	3: 'तृतीय',
	4: 'चतुर्थ',
	5: 'पञ्चम',
	6: 'षष्ठ',
	7: 'सप्तम',
	8: 'अष्टम',
	9: 'नवम',
	10: 'दशम',
	11: 'एकादश',
	12: 'द्वादश',
	13: 'त्रयोदश',
	14: 'चतुर्दश',
	15: 'पञ्चदश',
	16: 'षोडश',
	17: 'सप्तदश',
	18: 'अष्टादश',
	19: 'नवदश',
	20: 'विंश',
	21: 'एकविंश',
	22: 'द्वाविंश',
	23: 'त्रयोविंश',
	24: 'चतुर्विंश',
	25: 'पञ्चविंश',
	26: 'षड्विंश',
	27: 'सप्तविंश',
	28: 'अष्टाविंश',
	29: 'नवविंश',
	30: 'त्रिंश',
	31: 'एकत्रिंश',
	32: 'द्वात्रिंश',
	33: 'त्रयस्त्रिंश',
	34: 'चतुस्त्रिंश',
	35: 'पञ्चत्रिंश',
	36: 'षट्त्रिंश',
	37: 'सप्तत्रिंश',
	38: 'अष्टात्रिंश',
	39: 'एकोणचत्वारिंश',
	40: 'चत्वारिंश',
};

export const CHAPTER_SIDEBAR_IAST = {
	1: "Prathamo'dhyāyaḥ",
	2: "Dvitīyo'dhyāyaḥ",
	3: "Tṛtīyo'dhyāyaḥ",
	4: "Caturtho'dhyāyaḥ",
	5: "Pañcamo'dhyāyaḥ",
	6: "Ṣaṣṭho'dhyāyaḥ",
	7: "Saptamo'dhyāyaḥ",
	8: "Aṣṭamo'dhyāyaḥ",
	9: "Navamo'dhyāyaḥ",
	10: "Daśamo'dhyāyaḥ",
	11: "Ekādaśo'dhyāyaḥ",
	12: "Dvādaśo'dhyāyaḥ",
	13: "Trayodaśo'dhyāyaḥ",
	14: "Caturdaśo'dhyāyaḥ",
	15: 'Pañcadaśo\'dhyāyaḥ',
	16: "Ṣoḍaśo'dhyāyaḥ",
	17: "Saptadaśo'dhyāyaḥ",
	18: "Aṣṭādaśo'dhyāyaḥ",
	19: "Navadaśo'dhyāyaḥ",
	20: "Viṃśo'dhyāyaḥ",
	21: "Ekaviṃśo'dhyāyaḥ",
	22: "Dvāviṃśo'dhyāyaḥ",
	23: "Trayoviṃśo'dhyāyaḥ",
	24: "Caturviṃśo'dhyāyaḥ",
	25: "Pañcaviṃśo'dhyāyaḥ",
	26: "Ṣaḍviṃśo'dhyāyaḥ",
	27: "Saptaviṃśo'dhyāyaḥ",
	28: "Aṣṭāviṃśo'dhyāyaḥ",
	29: "Navaviṃśo'dhyāyaḥ",
	30: "Triṃśo'dhyāyaḥ",
	31: "Ekatriṃśo'dhyāyaḥ",
	32: "Dvātriṃśo'dhyāyaḥ",
	33: "Trayastriṃśo'dhyāyaḥ",
	34: "Catustriṃśo'dhyāyaḥ",
	35: "Pañcatriṃśo'dhyāyaḥ",
	36: "Ṣaṭtriṃśo'dhyāyaḥ",
	37: "Saptatriṃśo'dhyāyaḥ",
	38: "Aṣṭātriṃśo'dhyāyaḥ",
	39: "Ekoṇacatvāriṃśo'dhyāyaḥ",
	40: "Catvāriṃśo'dhyāyaḥ",
};

/**
 * @param {number} chapter
 * @param {YajurLocale} locale
 */
export function getAdhyayaSidebarLabel(chapter, locale) {
	if (chapter === 40) {
		return locale === 'iast' ? 'Īśa upaniṣad' : 'ईशोपनिषद्';
	}
	if (locale === 'iast') {
		return CHAPTER_SIDEBAR_IAST[chapter] ?? `Chapter ${chapter}`;
	}
	const ordinal = CHAPTER_ORDINALS[chapter];
	return ordinal ? `${ordinal}ोऽध्यायः` : `अध्याय ${chapter}`;
}

/**
 * @param {number} chapter
 * @param {YajurLocale} locale
 */
export function getAdhyayaBlockLabel(chapter, locale) {
	if (chapter === 40) {
		return locale === 'iast' ? 'Īśa upaniṣad' : 'ईशोपनिषद्';
	}
	if (locale === 'iast') {
		return CHAPTER_SIDEBAR_IAST[chapter] ?? `Adhyāya ${chapter}`;
	}
	const ordinal = CHAPTER_ORDINALS[chapter];
	return ordinal ? `${ordinal}ोऽध्यायः` : `अध्याय ${chapter}`;
}
