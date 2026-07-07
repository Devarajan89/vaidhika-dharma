import { cleanTaittiriyaBrahmanaTexLine } from './parse-taittiriya-brahmana-tex.mjs';

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

const SECT_RE = /\\sect\{([^}]*प्रश्नः[^}]*)\}/g;
const ANUVAKA_SPLIT_RE = /\\anuvakamend(?:\[[\s\S]*?\])?/;
const VERSE_END_RE = /॥\s*([०-९0-9]+)\s*॥\s*$/;

/**
 * The Kāṭhaka (kṛṣṇayajurvedīya taittirīya-kāṭhakam) is the third āṣṭaka's
 * prapāṭhakas 3.10, 3.11 and 3.12. It ships in a separate source file that uses
 * \sect{...प्रश्नः} for each prapāṭhaka and \anuvakamend to close each anuvāka,
 * with no coordinate comments.
 */
export const KATHAKA_PRAPATHAKA_NUMBERS = [10, 11, 12];

/**
 * @param {string} value
 */
function parseNumber(value) {
	return Number.parseInt(
		value
			.split('')
			.map((char) => DEVANAGARI_DIGIT_MAP[char] ?? char)
			.join(''),
		10
	);
}

/**
 * @param {string} chunk
 */
function parseVerses(chunk) {
	/** @type {{ number: number; lines: string[] }[]} */
	const verses = [];
	/** @type {string[]} */
	let lines = [];

	const flush = (number) => {
		const cleaned = lines
			.map((line) => cleanTaittiriyaBrahmanaTexLine(line))
			.filter(Boolean);
		lines = [];
		if (cleaned.length) {
			verses.push({ number, lines: cleaned });
		}
	};

	for (const rawLine of chunk.split('\n')) {
		const line = rawLine.trim();
		if (!line) continue;
		if (line.startsWith('%')) continue;
		if (/^\\(sect|setcounter|clearpage|chapt|prashnaend)\b/.test(line)) continue;

		lines.push(line);

		const cleaned = cleanTaittiriyaBrahmanaTexLine(line);
		const verseEnd = cleaned.match(VERSE_END_RE);
		if (verseEnd) {
			flush(parseNumber(verseEnd[1]));
		}
	}

	if (lines.length) {
		flush(0);
	}

	return verses;
}

/**
 * @param {string} tex
 * @returns {{ prapathaka: number; anuvakas: { anuvaka: number; verses: { number: number; lines: string[] }[] }[] }[]}
 */
export function parseTaittiriyaKathakaTex(tex) {
	const sectMatches = [...tex.matchAll(SECT_RE)];
	if (!sectMatches.length) {
		throw new Error('Could not locate Kāṭhaka \\sect{...प्रश्नः} markers in source');
	}

	const prapathakas = [];

	for (let index = 0; index < sectMatches.length; index++) {
		const match = sectMatches[index];
		const startIdx = (match.index ?? 0) + match[0].length;
		const endIdx =
			index + 1 < sectMatches.length ? sectMatches[index + 1].index ?? tex.length : tex.length;
		let body = tex.slice(startIdx, endIdx);

		const prashnaEnd = body.search(/\\prashnaend/);
		if (prashnaEnd >= 0) {
			body = body.slice(0, prashnaEnd);
		}

		const anuvakaChunks = body.split(ANUVAKA_SPLIT_RE);
		const anuvakas = [];
		for (const chunk of anuvakaChunks) {
			const verses = parseVerses(chunk);
			if (verses.length) {
				anuvakas.push({ anuvaka: anuvakas.length + 1, verses });
			}
		}

		const prapathaka = KATHAKA_PRAPATHAKA_NUMBERS[index] ?? 10 + index;
		if (anuvakas.length) {
			prapathakas.push({ prapathaka, anuvakas });
		}
	}

	return prapathakas;
}
