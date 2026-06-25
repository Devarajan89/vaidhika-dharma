const HALANT = '\u094D';
const VISARGA = '\u0903';
const RA = '\u0930';

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

const CONSONANT_CLASS = '[\\u0915-\\u0939\\u0958-\\u095F]';
const VOWEL_CLASS =
	'[\\u0905\\u0906\\u0907\\u0908\\u0909\\u090A\\u090B\\u0960\\u090C\\u090F\\u0910\\u0913\\u0914]';

const HALANT_VOWEL_RE = new RegExp(
	`(${CONSONANT_CLASS})${HALANT}\\s*(${VOWEL_CLASS})`,
	'g'
);
const VISARGA_CONSONANT_RE = new RegExp(`${VISARGA}\\s*(${CONSONANT_CLASS})`, 'g');
const VISARGA_VOWEL_RE = new RegExp(`${VISARGA}\\s*(${VOWEL_CLASS})`, 'g');

/**
 * @param {string} text
 */
function mergeUntilStable(text, replacer) {
	let result = text;
	let previous;

	do {
		previous = result;
		result = result.replace(replacer.pattern, replacer.replace);
	} while (result !== previous);

	return result;
}

/**
 * Merge halant/visarga breaks across sentence units (PDF-style continuous prose).
 * @param {string} text
 */
export function applyDevanagariJoinSandhi(text) {
	if (!/[\u0900-\u097F]/.test(text)) return text;

	let result = text;

	result = mergeUntilStable(result, {
		pattern: VISARGA_CONSONANT_RE,
		replace: (_match, consonant) => `${RA}${HALANT}${consonant}`,
	});

	result = mergeUntilStable(result, {
		pattern: VISARGA_VOWEL_RE,
		replace: (_match, vowel) => `${RA}${VOWEL_TO_MATRA.get(vowel) ?? ''}`,
	});

	result = mergeUntilStable(result, {
		pattern: HALANT_VOWEL_RE,
		replace: (_match, consonant, vowel) => consonant + (VOWEL_TO_MATRA.get(vowel) ?? ''),
	});

	return result
		.replace(new RegExp(`${HALANT}(?=॥)`, 'g'), '')
		.replace(new RegExp(`${VISARGA}(?=॥)`, 'g'), '');
}
