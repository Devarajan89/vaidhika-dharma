/** @typedef {{ prashna: number; rootLabel: string; iastLabel: string; kind: 'aranyaka' | 'upanishad-link'; target?: { corpus: 'taittiriya-upanishad' | 'mahanarayana-upanishad'; hash?: string } }} PrashnaInfo */

/**
 * Taittirīya Āraṇyakam has ten praśnas (prapāṭhakas).
 * Praśnas 1–6 are the āraṇyaka proper.
 * Praśnas 7–9 are the Taittirīya Upaniṣad (Śikṣā / Brahmānanda / Bhṛgu vallīs).
 * Praśna 10 is the Mahānārāyaṇa (Yājñikī) Upaniṣad.
 */
/** @type {PrashnaInfo[]} */
export const TAITTIRIYA_ARANYAKA_PRASHNAS = [
	{
		prashna: 1,
		rootLabel: 'प्रथमः प्रश्नः — अरुणप्रश्नः',
		iastLabel: 'Prathamaḥ praśnaḥ — Aruṇapraśnaḥ',
		kind: 'aranyaka',
	},
	{
		prashna: 2,
		rootLabel: 'द्वितीयः प्रश्नः',
		iastLabel: 'Dvitīyaḥ praśnaḥ',
		kind: 'aranyaka',
	},
	{
		prashna: 3,
		rootLabel: 'तृतीयः प्रश्नः',
		iastLabel: 'Tṛtīyaḥ praśnaḥ',
		kind: 'aranyaka',
	},
	{
		prashna: 4,
		rootLabel: 'चतुर्थः प्रश्नः',
		iastLabel: 'Caturthaḥ praśnaḥ',
		kind: 'aranyaka',
	},
	{
		prashna: 5,
		rootLabel: 'पञ्चमः प्रश्नः',
		iastLabel: 'Pañcamaḥ praśnaḥ',
		kind: 'aranyaka',
	},
	{
		prashna: 6,
		rootLabel: 'षष्ठः प्रश्नः',
		iastLabel: 'Ṣaṣṭhaḥ praśnaḥ',
		kind: 'aranyaka',
	},
	{
		prashna: 7,
		rootLabel: 'सप्तमः प्रश्नः — शीक्षावल्ली',
		iastLabel: 'Saptamaḥ praśnaḥ — Śīkṣāvallī',
		kind: 'upanishad-link',
		target: { corpus: 'taittiriya-upanishad', hash: 'siksha-valli' },
	},
	{
		prashna: 8,
		rootLabel: 'अष्टमः प्रश्नः — ब्रह्मानन्दवल्ली',
		iastLabel: 'Aṣṭamaḥ praśnaḥ — Brahmānandavallī',
		kind: 'upanishad-link',
		target: { corpus: 'taittiriya-upanishad', hash: 'brahmananda-valli' },
	},
	{
		prashna: 9,
		rootLabel: 'नवमः प्रश्नः — भृगुवल्ली',
		iastLabel: 'Navamaḥ praśnaḥ — Bhṛguvallī',
		kind: 'upanishad-link',
		target: { corpus: 'taittiriya-upanishad', hash: 'bhrigu-valli' },
	},
	{
		prashna: 10,
		rootLabel: 'दशमः प्रश्नः — महानारायणोपनिषत्',
		iastLabel: 'Daśamaḥ praśnaḥ — Mahānārāyaṇopaniṣat',
		kind: 'upanishad-link',
		target: { corpus: 'mahanarayana-upanishad' },
	},
];

export const TAITTIRIYA_ARANYAKA_TOTAL_PRASHNAS = TAITTIRIYA_ARANYAKA_PRASHNAS.length;

/** Praśnas whose full accented text is stored under the āraṇyaka corpus. */
export const TAITTIRIYA_ARANYAKA_TEXT_PRASHNAS = TAITTIRIYA_ARANYAKA_PRASHNAS.filter(
	(entry) => entry.kind === 'aranyaka'
).map((entry) => entry.prashna);

/**
 * Source TeX files (stotrasamhita/vedamantra-book) keyed by praśna.
 * Praśnas 7–9 share Taittiriyopanishat.tex; praśna 10 is separate.
 */
export const TAITTIRIYA_ARANYAKA_SOURCE_FILES = {
	1: 'ArunaPrashnah.tex',
	2: 'SahaVai.tex',
	3: 'Chittissruk.tex',
	4: 'NamoVache.tex',
	5: 'DevaVai.tex',
	6: 'PareyuvaMsam.tex',
	7: 'Taittiriyopanishat.tex',
	8: 'Taittiriyopanishat.tex',
	9: 'Taittiriyopanishat.tex',
	10: 'Mahanarayanopanishat.tex',
};

/**
 * @param {number} prashna
 */
export function getPrashnaInfo(prashna) {
	return TAITTIRIYA_ARANYAKA_PRASHNAS.find((entry) => entry.prashna === prashna);
}

/**
 * @param {number} prashna
 * @param {'root' | 'iast'} locale
 */
export function getPrashnaDisplayLabel(prashna, locale) {
	const info = getPrashnaInfo(prashna);
	if (!info) return String(prashna);
	return locale === 'iast' ? info.iastLabel : info.rootLabel;
}

/**
 * Short sidebar ordinal (without the long subtitle).
 * @param {number} prashna
 * @param {'root' | 'iast'} locale
 */
export function getPrashnaSidebarLabel(prashna, locale) {
	const ordinals = {
		root: [
			'प्रथमः प्रश्नः',
			'द्वितीयः प्रश्नः',
			'तृतीयः प्रश्नः',
			'चतुर्थः प्रश्नः',
			'पञ्चमः प्रश्नः',
			'षष्ठः प्रश्नः',
			'सप्तमः प्रश्नः',
			'अष्टमः प्रश्नः',
			'नवमः प्रश्नः',
			'दशमः प्रश्नः',
		],
		iast: [
			'Prathamaḥ praśnaḥ',
			'Dvitīyaḥ praśnaḥ',
			'Tṛtīyaḥ praśnaḥ',
			'Caturthaḥ praśnaḥ',
			'Pañcamaḥ praśnaḥ',
			'Ṣaṣṭhaḥ praśnaḥ',
			'Saptamaḥ praśnaḥ',
			'Aṣṭamaḥ praśnaḥ',
			'Navamaḥ praśnaḥ',
			'Daśamaḥ praśnaḥ',
		],
	};
	return ordinals[locale][prashna - 1] ?? String(prashna);
}

/**
 * @param {number} prashna
 */
export function prashnaDirName(prashna) {
	return `Prashna_${String(prashna).padStart(2, '0')}`;
}

/**
 * @param {'root' | 'iast'} locale
 */
export function aranyakaSlug(locale) {
	return locale === 'iast' ? 'iast/taittiriya-aranyaka' : 'taittiriya-aranyaka';
}

/**
 * @param {number} prashna
 * @param {'root' | 'iast'} locale
 */
export function prashnaSlug(prashna, locale) {
	return `${aranyakaSlug(locale)}/prashna-${prashna}`;
}

/**
 * @param {number} prashna
 * @param {'root' | 'iast'} locale
 */
export function upanishadTargetHref(prashna, locale) {
	const info = getPrashnaInfo(prashna);
	if (!info?.target) return null;
	const prefix = locale === 'iast' ? '/iast/' : '/';
	const base = `${prefix}${info.target.corpus}/`;
	return info.target.hash ? `${base}#${info.target.hash}` : base;
}
