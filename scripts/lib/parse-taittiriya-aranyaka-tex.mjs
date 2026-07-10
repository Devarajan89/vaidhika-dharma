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

const SECT_RE = /\\sect\{([^}]*)\}/g;
const ANUVAKA_SPLIT_RE = /\\anuvakamend(?:\[[\s\S]*?\])?/;
const VERSE_END_RE = /॥\s*([०-९0-9]+)\s*॥\s*$/;
const DNSUB_RE = /\\dnsub\{([^}]+)\}/g;

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
		if (/^\\(sect|setcounter|clearpage|chapt|prashnaend|label|dnsub|noindent)\b/.test(line)) {
			continue;
		}

		lines.push(line);

		const cleaned = cleanTaittiriyaBrahmanaTexLine(line);
		const verseEnd = cleaned.match(VERSE_END_RE);
		if (verseEnd) {
			flush(parseNumber(verseEnd[1]));
		}
	}

	if (lines.length) {
		flush(verses.length ? verses[verses.length - 1].number + 1 : 1);
	}

	return verses;
}

/**
 * Split a praśna body into anuvākas via \\anuvakamend markers.
 * Material after the final \\anuvakamend (closing śānti / namaskāra) is not a
 * separate anuvāka — merge it into the last anuvāka when present.
 * @param {string} body
 */
function parseAnuvakasFromBody(body) {
	const prashnaEnd = body.search(/\\prashnaend/);
	if (prashnaEnd >= 0) {
		body = body.slice(0, prashnaEnd);
	}

	const anuvakamendCount = (body.match(/\\anuvakamend/g) || []).length;
	const chunks = body.split(ANUVAKA_SPLIT_RE);
	/** @type {{ anuvaka: number; verses: { number: number; lines: string[] }[] }[]} */
	const anuvakas = [];

	// When the source closes N anuvākas, split yields N+1 chunks. The final
	// chunk is post-amble (śānti), not anuvāka N+1.
	const bodyChunks =
		anuvakamendCount > 0 && chunks.length === anuvakamendCount + 1
			? chunks.slice(0, -1)
			: chunks;
	const trailing = chunks.length > bodyChunks.length ? chunks[chunks.length - 1] : '';

	for (const chunk of bodyChunks) {
		const verses = parseVerses(chunk);
		if (verses.length) {
			anuvakas.push({ anuvaka: anuvakas.length + 1, verses });
		}
	}

	if (trailing && anuvakas.length) {
		const trailingVerses = parseVerses(trailing);
		if (trailingVerses.length) {
			const last = anuvakas[anuvakas.length - 1];
			last.verses.push(...trailingVerses);
		}
	}

	return anuvakas;
}

/**
 * Parse a single-praśna Aranyaka TeX file (praśnas 1–6).
 * @param {string} tex
 * @param {number} prashna
 */
export function parseTaittiriyaAranyakaPrashnaTex(tex, prashna) {
	const sectMatches = [...tex.matchAll(SECT_RE)];
	if (!sectMatches.length) {
		throw new Error(`Could not locate \\sect markers in praśna ${prashna} source`);
	}

	const match = sectMatches[0];
	const startIdx = (match.index ?? 0) + match[0].length;
	const body = tex.slice(startIdx);
	const anuvakas = parseAnuvakasFromBody(body);

	return {
		prashna,
		title: match[1].replace(/\s+/g, ' ').trim(),
		anuvakas,
	};
}

/**
 * Parse Taittiriyopanishat.tex into three vallī sections for the Upaniṣad corpus.
 * Śikṣāvallī uses \\anuvakamend; Brahmānanda / Bhṛgu use ॥N॥ anuvāka closers.
 * @param {string} tex
 */
export function parseTaittiriyaUpanishadTex(tex) {
	const sectMatches = [...tex.matchAll(SECT_RE)];
	if (sectMatches.length < 3) {
		throw new Error('Expected three \\sect{...} markers in Taittiriyopanishat.tex');
	}

	const valliMeta = [
		{
			type: 'siksha-valli',
			label: 'शीक्षावल्ली',
			hash: 'siksha-valli',
			splitByAnuvakamend: true,
		},
		{
			type: 'brahmananda-valli',
			label: 'ब्रह्मानन्दवल्ली',
			hash: 'brahmananda-valli',
			splitByAnuvakamend: false,
		},
		{
			type: 'bhrigu-valli',
			label: 'भृगुवल्ली',
			hash: 'bhrigu-valli',
			splitByAnuvakamend: false,
		},
	];

	/** @type {{ type: string; label: string; hash: string; verses: { number: number; text: string }[] }[]} */
	const sections = [];

	for (let index = 0; index < 3; index++) {
		const match = sectMatches[index];
		const startIdx = (match.index ?? 0) + match[0].length;
		const endIdx =
			index + 1 < sectMatches.length ? sectMatches[index + 1].index ?? tex.length : tex.length;
		let body = tex.slice(startIdx, endIdx);
		const prashnaEnd = body.search(/\\prashnaend/);
		if (prashnaEnd >= 0) {
			body = body.slice(0, prashnaEnd);
		}

		const meta = valliMeta[index];
		/** @type {{ number: number; text: string }[]} */
		let verses = [];

		if (meta.splitByAnuvakamend) {
			const anuvakas = parseAnuvakasFromBody(body);
			verses = anuvakas.map((anuvaka) => ({
				number: anuvaka.anuvaka,
				text: anuvaka.verses.flatMap((verse) => verse.lines).join('\n'),
			}));
		} else {
			// Drop leading unnumbered śānti (common before Brahmānanda / Bhṛgu).
			const parsed = parseVerses(body).filter(
				(verse) =>
					!(
						verse.number === 0 ||
						(/शान्तिः/.test(verse.lines.join(' ')) &&
							!/तदप्येष|भृगु|ब्रह्मविद/.test(verse.lines.join(' ')) &&
							verse.lines.join(' ').length < 200)
					)
			);
			verses = parsed.map((verse, index) => ({
				number: verse.number > 0 ? verse.number : index + 1,
				text: verse.lines.join('\n'),
			}));
		}

		sections.push({
			type: meta.type,
			label: meta.label,
			hash: meta.hash,
			verses: verses.filter((verse) => verse.text.trim()),
		});
	}

	return {
		title: 'तैत्तिरीयोपनिषत्',
		openingShanti: null,
		sections,
	};
}

/**
 * Parse Mahanarayanopanishat.tex — group by \\dnsub when present, else anuvākas.
 * @param {string} tex
 */
export function parseMahanarayanaUpanishadTex(tex) {
	const sectMatch = [...tex.matchAll(SECT_RE)][0];
	const startIdx = sectMatch ? (sectMatch.index ?? 0) + sectMatch[0].length : 0;
	let body = tex.slice(startIdx);
	const prashnaEnd = body.search(/\\prashnaend/);
	if (prashnaEnd >= 0) {
		body = body.slice(0, prashnaEnd);
	}

	const dnsubMatches = [...body.matchAll(DNSUB_RE)];

	/** @type {{ type: string; label: string; verses: { number: number; text: string }[] }[]} */
	const sections = [];

	if (dnsubMatches.length) {
		for (let index = 0; index < dnsubMatches.length; index++) {
			const match = dnsubMatches[index];
			const chunkStart = (match.index ?? 0) + match[0].length;
			const chunkEnd =
				index + 1 < dnsubMatches.length
					? dnsubMatches[index + 1].index ?? body.length
					: body.length;
			const chunk = body.slice(chunkStart, chunkEnd);
			const anuvakas = parseAnuvakasFromBody(chunk);
			const verses =
				anuvakas.length > 0
					? anuvakas.map((anuvaka) => ({
							number: anuvaka.anuvaka,
							text: anuvaka.verses.flatMap((verse) => verse.lines).join('\n'),
						}))
					: parseVerses(chunk).map((verse) => ({
							number: verse.number,
							text: verse.lines.join('\n'),
						}));

			if (verses.some((verse) => verse.text.trim())) {
				sections.push({
					type: `section-${index + 1}`,
					label: cleanTaittiriyaBrahmanaTexLine(match[1]) || match[1],
					verses: verses.filter((verse) => verse.text.trim()),
				});
			}
		}
	} else {
		const anuvakas = parseAnuvakasFromBody(body);
		sections.push({
			type: 'mahanarayana',
			label: 'महानारायणोपनिषत्',
			verses: anuvakas.map((anuvaka) => ({
				number: anuvaka.anuvaka,
				text: anuvaka.verses.flatMap((verse) => verse.lines).join('\n'),
			})),
		});
	}

	return {
		title: 'महानारायणोपनिषत्',
		openingShanti: null,
		sections,
	};
}
