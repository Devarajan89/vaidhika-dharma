const SVARA_RE = /[\u0900-\u0903\u0951-\u0954]/g;
const LEADING_SPACE_RE = /^[ \t]+/gm;
const VERSE_MARKER_RE = /॥([०-९0-9]+)(?:॥)?/g;
const PRIVATE_USE_RE = /[\uE000-\uF8FF\uFFFC]/g;
const ORPHAN_NUMBER_LINE_RE = /^([०-९0-9]+(?:\([०-९0-9]+\))?)\s*$/;

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
 * @param {string} text
 */
function cleanVerseBody(text) {
	return text
		.replace(PRIVATE_USE_RE, '')
		.replace(LEADING_SPACE_RE, '')
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n')
		.trim();
}

/**
 * @param {string} text
 */
function normalizeChapterText(text) {
	return text
		.replace(/^[\u201c\u201d"]+/, '')
		.replace(/[\u201d"]+$/, '')
		.replace(/\u0955/g, '\u0943')
		.replace(/ꣳ/g, '\u0943')
		.replace(PRIVATE_USE_RE, '')
		.trim();
}

/**
 * @param {string} text
 */
function extractHeader(text) {
	const lines = text.split('\n');
	const headerLines = [];

	for (const line of lines) {
		headerLines.push(line);
		if (/ध्यायः|उपनिषद/.test(line)) {
			break;
		}
	}

	return headerLines.join('\n').trim();
}

/**
 * @param {string} text
 */
function stripLeadingOrphans(text) {
	return text
		.split('\n')
		.filter((line, index) => {
			if (index > 2) return true;
			const trimmed = line.trim();
			if (!trimmed) return false;
			if (ORPHAN_NUMBER_LINE_RE.test(trimmed)) return false;
			if (/^[\d०-९\s()]+$/.test(trimmed)) return false;
			if (/^॥\s*[\d०-९]+/.test(trimmed)) return false;
			return true;
		})
		.join('\n')
		.trim();
}

/**
 * @param {string} text
 */
function stripFooter(text) {
	const footerMatch = text.search(/\n?॥\s*(?:इति|iti)/i);
	if (footerMatch !== -1) {
		return text.slice(0, footerMatch).trim();
	}
	return text.replace(/\n?[^\n]*(?:समाप्त|संहिता)[^\n]*$/u, '').trim();
}

/**
 * @param {string} verseText
 */
export function extractFirstWord(verseText) {
	const firstLine = meaningfulVerseLines(verseText)[0] ?? '';
	const stripped = firstLine.replace(SVARA_RE, '').replace(PRIVATE_USE_RE, '');
	const word = stripped.split(/[।.\s]+/).find((part) => /[\u0900-\u097F]/.test(part));
	return word?.replace(/[^\u0900-\u097F]/g, '') ?? '';
}

/**
 * @param {string} verseText
 */
function meaningfulVerseLines(verseText) {
	return verseText
		.split('\n')
		.map((line) => line.trim().replace(/^॥(?:[oō]?३?म्|OM)?॥?\s*/u, ''))
		.filter((line) => {
			if (!line) return false;
			if (ORPHAN_NUMBER_LINE_RE.test(line)) return false;
			if (/^[\d०-९\s()|]+$/.test(line.replace(SVARA_RE, ''))) return false;
			if (/^॥/.test(line)) return false;
			return /[\u0900-\u097F]/.test(line);
		});
}

/**
 * @param {string} verseText
 */
export function extractFirstTwoWords(verseText) {
	const firstLine = meaningfulVerseLines(verseText)[0] ?? '';
	const stripped = firstLine.replace(SVARA_RE, '').replace(PRIVATE_USE_RE, '');
	const words = stripped
		.split(/[।.\s|]+/)
		.map((part) => part.replace(/[^\u0900-\u097F]/g, ''))
		.filter(Boolean);
	return words.slice(0, 2).join(' ');
}

/**
 * @param {string} text
 * @param {{ expectedVerses?: number }} [options]
 * @returns {{ header: string; verses: { number: number; text: string }[]; firstWord: string; verseCount: number }}
 */
export function parseYajurvedaChapter(text, options = {}) {
	const normalized = normalizeChapterText(text);
	const header = extractHeader(normalized);
	const body = normalized.slice(header.length).trim();
	const matches = [...body.matchAll(VERSE_MARKER_RE)];

	if (!matches.length) {
		return { header, verses: [], firstWord: '', verseCount: 0 };
	}

	const verses = [];
	const limit = options.expectedVerses ?? matches.length;

	for (let i = 0; i < matches.length && verses.length < limit; i++) {
		const start = i === 0 ? 0 : matches[i - 1].index + matches[i - 1][0].length;
		const end = matches[i].index;
		let verseText = cleanVerseBody(body.slice(start, end));
		verseText = stripLeadingOrphans(verseText);
		verseText = stripFooter(verseText);

		if (!verseText || !/[\u0900-\u097F]/.test(verseText)) continue;
		if (/^(?:iti|इति)\b/i.test(verseText)) continue;

		verses.push({
			number: verses.length + 1,
			text: verseText,
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
 * @param {number} count
 */
export function formatMantraCountLabel(count) {
	return count === 1 ? '१ मन्त्रः' : `${count} मन्त्राः`;
}
