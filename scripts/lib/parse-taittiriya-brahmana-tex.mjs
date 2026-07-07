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

const ASHTAKA_RE = /\\chapt\{अष्टकम्\s*([०-९0-9]+)\}/;
const PRAPATHAKA_HEADER_RE = /\\dnsub\{([^}]+)\}/g;
const PRAPATHAKA_TITLE_RE = /तैत्तिरीयब्राह्मणे.+प्रपाठकः/;
const COORD_RE = /^%\s*(\d+)\.(\d+)\.(\d+)\.(\d+)/;
const VERSE_END_RE = /॥\s*([०-९0-9]+)\s*॥\s*$/;

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
 * Strip LaTeX markup from a single accented Devanagari sentence line,
 * keeping svaras, dandas, and verse-end markers intact.
 * @param {string} text
 */
export function cleanTaittiriyaBrahmanaTexLine(text) {
	return text
		.replace(/\\anuvakamend\[[\s\S]*?\]/g, '')
		.replace(/\\prashnaend\{[\s\S]*?\}/g, '')
		.replace(/\\dnsub\{[^}]*\}/g, '')
		.replace(/\\chapt\{[^}]*\}/g, '')
		.replace(/\\sect\{[^}]*\}/g, '')
		.replace(/\\setcounter\{[^}]*\}\{[^}]*\}/g, '')
		.replace(/\\mbox\{\}/g, '')
		.replace(/\\ip\b/g, '')
		.replace(/\\clearpage\b/g, '')
		.replace(/\\-/g, '')
		.replace(/\{[\u200B-\u200D\uFEFF]*\}/g, '')
		.replace(/\{\}/g, '')
		.replace(/\\[a-zA-Z]+\*?/g, '')
		.replace(/[ \t]+/g, ' ')
		.trim();
}

/**
 * @param {string} body
 */
function parsePrapathakaBody(body) {
	const endIdx = body.search(/\\prashnaend\{/);
	let content = (endIdx >= 0 ? body.slice(0, endIdx) : body).trim();
	content = content.replace(/\\anuvakamend\[[\s\S]*?\]/g, '');

	/** @type {Map<number, { anuvaka: number; verses: { number: number; lines: string[] }[] }>} */
	const anuvakaMap = new Map();
	let currentAnuvaka = 1;
	/** @type {string[]} */
	let verseLines = [];

	const ensureAnuvaka = (anuvaka) => {
		if (!anuvakaMap.has(anuvaka)) {
			anuvakaMap.set(anuvaka, { anuvaka, verses: [] });
		}
		return anuvakaMap.get(anuvaka);
	};

	const flushVerse = (number) => {
		const lines = verseLines
			.map((line) => cleanTaittiriyaBrahmanaTexLine(line))
			.filter(Boolean);
		verseLines = [];
		if (!lines.length) return;
		ensureAnuvaka(currentAnuvaka).verses.push({ number, lines });
	};

	for (const rawLine of content.split('\n')) {
		const line = rawLine.trim();
		if (!line) continue;

		const coordMatch = line.match(COORD_RE);
		if (coordMatch) {
			currentAnuvaka = parseNumber(coordMatch[3]);
			continue;
		}
		if (line.startsWith('%')) continue;
		if (/^\\(sect|setcounter|clearpage)\b/.test(line)) continue;

		verseLines.push(line);

		const cleaned = cleanTaittiriyaBrahmanaTexLine(line);
		const verseEnd = cleaned.match(VERSE_END_RE);
		if (verseEnd) {
			flushVerse(parseNumber(verseEnd[1]));
		}
	}

	if (verseLines.length) {
		flushVerse(0);
	}

	const sortedKeys = [...anuvakaMap.keys()].sort((a, b) => a - b);
	return sortedKeys
		.map((key, index) => {
			const entry = anuvakaMap.get(key);
			return {
				anuvaka: index + 1,
				sourceAnuvaka: key,
				verses: entry.verses.filter((verse) => verse.lines.length > 0),
			};
		})
		.filter((entry) => entry.verses.length > 0);
}

/**
 * @param {string} tex
 */
export function parseTaittiriyaBrahmanaTex(tex) {
	const start = tex.search(ASHTAKA_RE);
	if (start < 0) {
		throw new Error('Could not locate Taittiriya Brahmana āṣṭaka markers in source');
	}

	const body = tex.slice(start);
	const ashtakaChunks = body.split(/(?=\\chapt\{)/).filter((chunk) => chunk.includes('\\chapt{'));

	/** @type {{ ashtaka: number; prapathakas: { prapathaka: number; title: string; anuvakas: { anuvaka: number; sourceAnuvaka: number; verses: { number: number; lines: string[] }[] }[] }[] }[]} */
	const ashtakas = [];

	for (const ashtakaChunk of ashtakaChunks) {
		const ashtakaMatch = ashtakaChunk.match(ASHTAKA_RE);
		if (!ashtakaMatch) continue;
		const ashtaka = parseNumber(ashtakaMatch[1]);

		const headerMatches = [...ashtakaChunk.matchAll(PRAPATHAKA_HEADER_RE)].filter((match) =>
			PRAPATHAKA_TITLE_RE.test(match[1])
		);

		/** @type {{ prapathaka: number; title: string; anuvakas: unknown[] }[]} */
		const prapathakas = [];

		for (let index = 0; index < headerMatches.length; index++) {
			const match = headerMatches[index];
			const title = match[1].trim();
			const startIdx = (match.index ?? 0) + match[0].length;
			const endIdx =
				index + 1 < headerMatches.length
					? headerMatches[index + 1].index ?? ashtakaChunk.length
					: ashtakaChunk.length;
			const prapathakaBody = ashtakaChunk.slice(startIdx, endIdx);
			const anuvakas = parsePrapathakaBody(prapathakaBody);

			prapathakas.push({
				prapathaka: index + 1,
				title,
				anuvakas,
			});
		}

		ashtakas.push({ ashtaka, prapathakas });
	}

	return ashtakas;
}
