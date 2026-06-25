/**
 * TITUS encodes aspirates as consonant + U+02B0 (modifier letter small h), e.g. bʰ for bh.
 * inditrans expects standard IAST (bh, dh, …).
 */

/**
 * Strip TITUS editorial markup and decode entities from extracted sentence text.
 * @param {string} text
 */
export function cleanTitusMarkup(text) {
	return text
		.replace(/&#x27;/g, "'")
		.replace(/&nbsp;/g, ' ')
		.replace(/&lt;([^&]+)&gt;/g, '$1')
		.replace(/&amp;/g, '&')
		.replace(/[\u0559\u055A\u055B]\d*/g, '')
		.replace(/\\/g, '')
		.replace(/[+|=]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * @param {string} text
 */
export function normalizeTitusIast(text) {
	return cleanTitusMarkup(text)
		.replace(/([^\s])ʰ/g, '$1h')
		.replace(/\u0307/g, '')
		.trim();
}

/**
 * Aufrecht/TITUS uses "/" for a sentence break within one citation unit.
 * @param {string} text
 * @returns {string[]}
 */
export function splitTitusClauses(text) {
	const normalized = normalizeTitusIast(text);
	if (!normalized.includes('/')) return [normalized];

	return normalized
		.split('/')
		.map((part) => part.trim())
		.filter(Boolean);
}
