import {
	formatAnuvakaCountLabel,
	parseDevanagariNumber,
} from './parse-taittiriya-prapathaka.mjs';

export { formatAnuvakaCountLabel, parseDevanagariNumber };

const SVARA_RE = /[\u0900-\u0903\u0951-\u0954]/g;
const LEADING_SPACE_RE = /^[ \t]+/gm;
const PRIVATE_USE_RE = /[\uE000-\uF8FF\uFFFC]/g;
const ANUVAKA_MARKER_RE =
	/॥\s*म्स्_\s*([०-९0-9]+)\s*,\s*([०-९0-9]+)[।.]\s*([०-९0-9]+)\s*॥|\/\/MS_(\d+),(\d+)\.(\d+)\/\//g;

const KANDA_ORDINALS = {
	1: 'प्रथम',
	2: 'द्वितीय',
	3: 'तृतीय',
	4: 'चतुर्थ',
};

const PRAPATHAKA_ORDINALS = {
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
};

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
 * @param {number} kanda
 * @param {number} prapathaka
 */
export function formatPrapathakaHeader(kanda, prapathaka) {
	const kandaLabel = KANDA_ORDINALS[kanda] ?? String(kanda);
	const prapathakaLabel = PRAPATHAKA_ORDINALS[prapathaka] ?? String(prapathaka);
	return `${kandaLabel}काण्डे ${prapathakaLabel}ः प्रपाठकः`;
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
 * @param {RegExpMatchArray} match
 */
function markerParts(match) {
	if (match[1] !== undefined) {
		return {
			kanda: parseDevanagariNumber(match[1]),
			prapathaka: parseDevanagariNumber(match[2]),
			anuvaka: parseDevanagariNumber(match[3]),
		};
	}
	return {
		kanda: Number(match[4]),
		prapathaka: Number(match[5]),
		anuvaka: Number(match[6]),
	};
}

/**
 * @param {string} text
 * @param {{ kanda: number; prapathaka: number }} context
 */
export function parseMaitrayaniPrapathaka(text, context) {
	const normalized = cleanBlock(text);
	const header = formatPrapathakaHeader(context.kanda, context.prapathaka);
	const matches = [...normalized.matchAll(ANUVAKA_MARKER_RE)];

	if (!matches.length) {
		return { header, verses: [], firstWord: '', verseCount: 0 };
	}

	const verses = [];

	for (let i = 0; i < matches.length; i++) {
		const start = i === 0 ? 0 : matches[i - 1].index + matches[i - 1][0].length;
		const end = matches[i].index + matches[i][0].length;
		let block = normalized.slice(start, end);
		block = block.replace(matches[i][0], '').trim();
		block = block
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line && /[\u0900-\u097F]/.test(line))
			.join('\n')
			.trim();

		if (!block) continue;

		const { kanda, prapathaka, anuvaka } = markerParts(matches[i]);

		if (kanda !== context.kanda || prapathaka !== context.prapathaka) {
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
