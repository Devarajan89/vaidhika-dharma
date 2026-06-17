const SVARA_RE = /[\u0900-\u0903\u0951-\u0954]/g;
const LEADING_SPACE_RE = /^[ \t]+/gm;
const PRIVATE_USE_RE = /[\uE000-\uF8FF\uFFFC]/g;
const ANUVAKA_MARKER_RE = /॥\s*([०-९0-9]+)\s*[।.]\s*([०-९0-9]+)\s*[।.]\s*([०-९0-9]+)\s*॥/g;
const PRAYERS_RE = /^॥\s*श्री|^हरिः|^ओ\(४\)म्|^प्रथमकाण्डे|^द्वितीयकाण्डे|^तृतीयकाण्डे|^चतुर्थकाण्डे|^पञ्चमकाण्डे|^षष्ठकाण्डे|^सप्तमकाण्डे|^॥\s*[\u0900-\u097F\s]+काण्डम्\s*॥/u;

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * @param {string} value
 */
export function parseDevanagariNumber(value) {
	return Number.parseInt(
		value
			.split('')
			.map((char) => {
				const index = DEVANAGARI_DIGITS.indexOf(char);
				return index >= 0 ? String(index) : char;
			})
			.join(''),
		10
	);
}

/**
 * @param {number} value
 */
export function toDevanagariNumber(value) {
	return String(value)
		.split('')
		.map((digit) => DEVANAGARI_DIGITS[Number(digit)] ?? digit)
		.join('');
}

/**
 * @param {number} kanda
 * @param {number} prapathaka
 * @param {number} anuvaka
 * @param {'root' | 'iast'} locale
 */
export function formatAnuvakaMarker(kanda, prapathaka, anuvaka, locale) {
	if (locale === 'iast') {
		return `||${kanda}.${prapathaka}.${anuvaka}||`;
	}
	return `॥${toDevanagariNumber(kanda)}.${toDevanagariNumber(prapathaka)}.${toDevanagariNumber(anuvaka)}॥`;
}

/**
 * @param {string} text
 * @param {number} kanda
 * @param {number} prapathaka
 * @param {'root' | 'iast'} locale
 */
export function appendAnuvakaMarker(text, kanda, prapathaka, anuvaka, locale) {
	const marker = formatAnuvakaMarker(kanda, prapathaka, anuvaka, locale);
	const lines = text.split('\n');
	if (!lines.length) return marker;
	const lastIndex = lines.length - 1;
	lines[lastIndex] = `${lines[lastIndex].trimEnd()} ${marker}`;
	return lines.join('\n');
}

/**
 * @param {string} text
 */
function cleanBlock(text) {
	return text
		.replace(PRIVATE_USE_RE, '')
		.replace(LEADING_SPACE_RE, '')
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n')
		.trim();
}

/**
 * @param {string} line
 */
function isSkippableLine(line) {
	const trimmed = line.trim();
	if (!trimmed) return true;
	if (PRAYERS_RE.test(trimmed)) return true;
	if (/^॥\s*[\u0900-\u097F\s]+काण्डम्\s*॥$/u.test(trimmed)) return true;
	return false;
}

/**
 * @param {string} text
 */
export function extractHeader(text) {
	const lines = text.split('\n');
	for (const line of lines) {
		if (/काण्डे\s+.+\s+प्रश्नः/u.test(line)) {
			return line.trim();
		}
	}
	return '';
}

/**
 * @param {string} verseText
 */
export function extractFirstTwoWords(verseText) {
	const firstLine =
		verseText
			.split('\n')
			.map((line) => line.trim())
			.find((line) => /[\u0900-\u097F]/.test(line)) ?? '';
	const stripped = firstLine.replace(SVARA_RE, '').replace(PRIVATE_USE_RE, '');
	const words = stripped
		.split(/[।.\s|]+/)
		.map((part) => part.replace(/[^\u0900-\u097F]/g, ''))
		.filter(Boolean);
	return words.slice(0, 2).join(' ');
}

/**
 * @param {string} text
 * @param {{ kanda: number; prapathaka: number }} context
 */
export function parseTaittiriyaPrapathaka(text, context) {
	const normalized = cleanBlock(text);
	const header = extractHeader(normalized);
	const body = normalized.slice(normalized.indexOf(header) + header.length).trim();
	const matches = [...body.matchAll(ANUVAKA_MARKER_RE)];

	if (!matches.length) {
		return { header, verses: [], firstWord: '', verseCount: 0 };
	}

	const verses = [];

	for (let i = 0; i < matches.length; i++) {
		const start = i === 0 ? 0 : matches[i - 1].index + matches[i - 1][0].length;
		const end = matches[i].index + matches[i][0].length;
		let block = body.slice(start, end);
		block = block.replace(matches[i][0], '').trim();
		block = block
			.split('\n')
			.filter((line) => !isSkippableLine(line))
			.join('\n')
			.trim();

		if (!block || !/[\u0900-\u097F]/.test(block)) continue;

		const markerKanda = parseDevanagariNumber(matches[i][1]);
		const markerPrapathaka = parseDevanagariNumber(matches[i][2]);
		const anuvaka = parseDevanagariNumber(matches[i][3]);

		if (markerKanda !== context.kanda || markerPrapathaka !== context.prapathaka) {
			continue;
		}

		verses.push({
			number: anuvaka,
			text: block,
		});
	}

	const firstWord = verses.length ? extractFirstTwoWords(verses[0].text) : '';

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
export function formatAnuvakaCountLabel(count) {
	return count === 1 ? '१ अनुवाकः' : `${count} अनुवाकाः`;
}
