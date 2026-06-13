const SVARA_RE = /[\u0900-\u0903\u0951-\u0954]/g;
const LEADING_SPACE_RE = /^[ \t]+/gm;
const VERSE_MARKER_RE = /॥([०-९0-9]+)(?:॥)?/g;

const DEVANAGARI_DIGIT_MAP = {
	'०': '0',
	'१': '1',
	'२': '2',
	'३': '3',
	'४': '4',
	'५': '5',
	'६': '6',
	'७': '7',
	'८': '8',
	'९': '9',
};

/**
 * @param {string} value
 */
function parseVerseNumber(value) {
	return Number.parseInt(
		value
			.split('')
			.map((char) => DEVANAGARI_DIGIT_MAP[char] ?? char)
			.join(''),
		10
	);
}

/**
 * @param {string} headerAndFirstVerse
 */
function splitHeaderAndFirstVerse(headerAndFirstVerse) {
	const headerBoundary = headerAndFirstVerse.search(/\n\s*\n/);
	if (headerBoundary !== -1) {
		return {
			header: headerAndFirstVerse.slice(0, headerBoundary).trim(),
			firstVerseText: headerAndFirstVerse.slice(headerBoundary).trim(),
		};
	}

	const parts = headerAndFirstVerse.split(/[।.]/).map((part) => part.trim()).filter(Boolean);
	if (parts.length <= 3) {
		return { header: headerAndFirstVerse.trim(), firstVerseText: '' };
	}

	return {
		header: parts.slice(0, 3).join('। ') + '।',
		firstVerseText: parts.slice(3).join('। '),
	};
}

/**
 * @param {string} text
 * @returns {{ header: string; verses: { number: number; text: string }[]; firstWord: string; verseCount: number }}
 */
export function parseRigvedaSukta(text) {
	const matches = [...text.matchAll(VERSE_MARKER_RE)];
	if (!matches.length) {
		return { header: text.trim(), verses: [], firstWord: '', verseCount: 0 };
	}

	const { header, firstVerseText } = splitHeaderAndFirstVerse(text.slice(0, matches[0].index).trim());
	const verses = [
		{
			number: parseVerseNumber(matches[0][1]),
			text: cleanVerseBody(firstVerseText),
		},
	];

	for (let i = 1; i < matches.length; i++) {
		const start = matches[i - 1].index + matches[i - 1][0].length;
		const end = matches[i].index;
		verses.push({
			number: parseVerseNumber(matches[i][1]),
			text: cleanVerseBody(text.slice(start, end)),
		});
	}

	const firstWord = verses.length ? extractFirstWord(verses[0].text) : '';

	return {
		header,
		verses,
		firstWord,
		verseCount: verses.length,
	};
}

/**
 * @param {string} text
 */
function cleanVerseBody(text) {
	return text
		.replace(LEADING_SPACE_RE, '')
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n')
		.trim();
}

/**
 * @param {string} verseText
 */
export function extractFirstWord(verseText) {
	const firstLine = verseText.split('\n').find((line) => line.trim()) ?? '';
	const stripped = firstLine.replace(SVARA_RE, '');
	const word = stripped.split(/[।\s]+/).find((part) => /[\u0900-\u097F]/.test(part));
	return word?.replace(/[^\u0900-\u097F]/g, '') ?? '';
}

/**
 * @param {string} header
 */
export function formatSuktaHeader(header) {
	return header
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.join(' ');
}

/**
 * @param {number} count
 * @param {'root' | 'iast'} locale
 */
export function formatVerseCountLabel(count, locale) {
	if (locale === 'iast') {
		return count === 1 ? '1 verse' : `${count} verses`;
	}
	return count === 1 ? '१ श्लोकः' : `${count} श्लोकाः`;
}
