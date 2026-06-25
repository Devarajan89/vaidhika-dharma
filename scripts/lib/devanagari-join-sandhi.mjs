const HALANT = '\u094D';

/** @type {Map<string, string>} */
const VOWEL_TO_MATRA = new Map([
	['\u0905', ''], // अ
	['\u0906', '\u093E'], // आ
	['\u0907', '\u093F'], // इ
	['\u0908', '\u0940'], // ई
	['\u0909', '\u0941'], // उ
	['\u090A', '\u0942'], // ऊ
	['\u090B', '\u0943'], // ऋ
	['\u0960', '\u0944'], // ॠ
	['\u090C', '\u0962'], // ऌ
	['\u090F', '\u0947'], // ए
	['\u0910', '\u0948'], // ऐ
	['\u0913', '\u094B'], // ओ
	['\u0914', '\u094C'], // औ
]);

const JOIN_SANDHI_RE = new RegExp(
	`([\\u0915-\\u0939\\u0958-\\u095F])${HALANT}\\s*([\\u0905-\\u0906\\u0907-\\u090A\\u090B\\u0960\\u090C\\u090F\\u0910\\u0913\\u0914])`,
	'g'
);

/**
 * Merge halant-final syllables with a following vowel-initial unit (PDF-style continuous prose).
 * @param {string} text
 */
export function applyDevanagariJoinSandhi(text) {
	if (!/[\u0900-\u097F]/.test(text)) return text;

	let result = text;
	let previous;

	do {
		previous = result;
		result = result.replace(JOIN_SANDHI_RE, (_match, consonant, vowel) => {
			return consonant + (VOWEL_TO_MATRA.get(vowel) ?? '');
		});
	} while (result !== previous);

	return result.replace(new RegExp(`${HALANT}(?=॥)`, 'g'), '');
}
