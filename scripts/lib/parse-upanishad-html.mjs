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

const VERSE_END_RE = /॥\s*([०-९0-9]+)\s*॥/g;
const SECTION_MARKER_RE =
	/^\s*॥?\s*इति\s+(?:केनोपनिषदि|काठकोपनिषदि)\s+[^॥\n]+?\s*॥/gmu;
const PREAMBLE_TITLE_RE = /॥\s*अथ\s+([^॥]+?)\s*॥/;
const METADATA_LINE_RE = /^%/;
const ENGLISH_PART_RE = /^\s*Part\s+[IVX]+\s*$/im;
const ENGLISH_CANTO_RE = /^\s*Canto\s+[IVX]+\s*$/im;
const VAR_NOTE_RE = /\s+var\s+[^\n।॥]+/g;
const HR_SPLIT_RE = /<hr\b[^>]*>/gi;
const HR_MARKER = '\n\n§§HR§§\n\n';

/**
 * @param {string} value
 */
export function parseDevanagariNumber(value) {
	return Number.parseInt(
		value
			.split('')
			.map((char) => DEVANAGARI_DIGIT_MAP[char] ?? char)
			.join(''),
		10
	);
}

/**
 * @param {string} html
 */
export function extractUpanishadPreText(html) {
	const match = html.match(/<pre[^>]*id=["']content["'][^>]*>([\s\S]*?)<\/pre>/i);
	if (!match) {
		throw new Error('Could not locate <pre id="content"> in source HTML');
	}

	let text = match[1];
	text = text.replace(/<h2[^>]*>[\s\S]*?<\/h2>/gi, '');
	text = text.replace(HR_SPLIT_RE, HR_MARKER);
	text = text.replace(/<br\s*\/?>/gi, '\n');
	text = text.replace(/<[^>]+>/g, '');
	text = text
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/\r/g, '');

	const metadataIndex = text.search(/\n% Text title/m);
	if (metadataIndex >= 0) {
		text = text.slice(0, metadataIndex);
	}

	return text.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * @param {string} text
 */
function cleanVerseText(text) {
	return text
		.replace(VAR_NOTE_RE, '')
		.replace(ENGLISH_PART_RE, '')
		.replace(ENGLISH_CANTO_RE, '')
		.replace(/[ \t]+\n/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

/**
 * @param {string} chunk
 */
function parseVersesFromChunk(chunk) {
	/** @type {{ number: number; text: string }[]} */
	const verses = [];
	let lastIndex = 0;
	let match;

	VERSE_END_RE.lastIndex = 0;
	while ((match = VERSE_END_RE.exec(chunk)) !== null) {
		const number = parseDevanagariNumber(match[1]);
		const rawText = chunk.slice(lastIndex, match.index);
		const text = cleanVerseText(rawText);
		if (text) {
			verses.push({ number, text });
		}
		lastIndex = match.index + match[0].length;
	}

	return verses;
}

/**
 * @param {string} marker
 */
function parseSectionLabel(marker) {
	const trimmed = marker.trim();
	const kathaMatch = trimmed.match(
		/काठकोपनिषदि\s+((?:प्रथम|द्वितीय)ाध्याये)\s+((?:प्रथम[ा]?|द्वितीया|तृतीया)\s+वल्ली)/u
	);
	if (kathaMatch) {
		return {
			type: 'valli',
			label: `काठकोपनिषदि ${kathaMatch[1]} ${kathaMatch[2]}`,
		};
	}

	const kenaMatch = trimmed.match(/केनोपनिषदि\s+((?:प्रथम|द्वितीय|तृतीय|चतुर्थ)ः?\s+खण्डः)/u);
	if (kenaMatch) {
		return {
			type: 'khanda',
			label: kenaMatch[1],
		};
	}

	return {
		type: 'section',
		label: trimmed,
	};
}

/**
 * @param {string} text
 */
export function parseUpanishadSections(text) {
	const titleMatch = text.match(PREAMBLE_TITLE_RE);
	const preambleEnd = titleMatch ? text.indexOf(titleMatch[0]) + titleMatch[0].length : 0;
	const body = text.slice(preambleEnd).trim();
	const chunks = body
		.split(HR_MARKER)
		.map((chunk) => chunk.trim())
		.filter(Boolean);

	/** @type {{ label: string; type: string; verses: { number: number; text: string }[] }[]} */
	const sections = [];

	for (const chunk of chunks) {
		const markers = [...chunk.matchAll(SECTION_MARKER_RE)];
		const closingMarker = markers.at(-1);
		const versesChunk = closingMarker
			? chunk.slice(0, closingMarker.index).trim()
			: chunk.trim();
		const verses = parseVersesFromChunk(versesChunk);
		if (!verses.length) continue;

		const labelInfo = closingMarker
			? parseSectionLabel(
					closingMarker[0].replace(/^\s*॥?\s*इति\s+/, '').replace(/\s*॥\s*$/, '')
				)
			: { type: 'section', label: `Section ${sections.length + 1}` };

		sections.push({
			type: labelInfo.type,
			label: labelInfo.label,
			verses,
		});
	}

	const shantiMatch = body.match(
		/ॐ\s+आप्यायन्तु[\s\S]*?ॐ\s+शान्तिः\s+शान्तिः\s+शान्तिः\s*॥/u
	);
	const openingShanti = shantiMatch?.[0]?.trim() ?? null;

	return {
		title: titleMatch?.[1]?.trim() ?? null,
		openingShanti,
		sections,
	};
}

/**
 * @param {string} html
 */
export function parseUpanishadHtml(html) {
	const text = extractUpanishadPreText(html);
	return parseUpanishadSections(text);
}

const AITAREYA_UPANISHAD_START_RE = /अथ\s+ऋग्वेदीयैतरेयोपनिषत्/u;
const AITAREYA_ADHYAYA_SPLIT_RE =
	/अथ\s+(प्रथम|द्वितीय|तृतीय)ो(?:\s+|ऽ|'?'?)(?:अ)?ध्यायः/gu;
const AITAREYA_ADHYAYA_LINE_RE =
	/अथ\s+(?:प्रथम|द्वितीय|तृतीय)ो(?:\s+|ऽ|'?'?)(?:अ)?ध्यायः/u;
const AITAREYA_KHANDA_HEADER_RE = /अथ\s+(?:प्रथम|द्वितीय|तृतीय|चतुर्थ|पञ्चम)ः?\s+खण्डः/u;
const AITAREYA_KHANDA_MARKER = '§§KHANDA§§';
const AITAREYA_KHANDA_END_RE = /॥\s*इति\s+[^॥\n]+खण्ड[^॥\n]*॥/gu;
const AITAREYA_VERSE_END_RE = /॥\s*([०-९0-9]+)\s*॥/g;
const AITAREYA_CLOSING_SHANTI_RE =
	/ॐ\s+वाङ्मे[\s\S]*?ॐ\s+शान्तिः\s+शान्तिः\s+शान्तिः\s*॥/u;

const AITAREYA_ADHYAYA_LABELS = {
	प्रथम: 'प्रथमोऽध्यायः',
	द्वितीय: 'द्वितीयोऽध्यायः',
	तृतीय: 'तृतीयोऽध्यायः',
};

/**
 * @param {string} chunk
 */
function parseAitareyaKhandaText(chunk) {
	const withoutEnd = chunk.replace(AITAREYA_KHANDA_END_RE, '').trim();
	/** @type {string[]} */
	const lines = [];

	for (const rawLine of withoutEnd.split('\n')) {
		const line = rawLine.trim();
		if (!line) continue;
		if (AITAREYA_ADHYAYA_LINE_RE.test(line)) continue;
		if (AITAREYA_KHANDA_HEADER_RE.test(line)) continue;
		if (/^इत्यैतरेय/u.test(line)) continue;
		if (/^इति\s+उपनिषत्सु/u.test(line)) continue;
		if (/^॥\s*ॐ\s*॥/.test(line)) continue;

		const stripped = line
			.replace(AITAREYA_VERSE_END_RE, '')
			.replace(/\s+/g, ' ')
			.trim();
		if (stripped) {
			lines.push(stripped);
		}
	}

	return lines.join('\n').trim();
}

/**
 * @param {string} text
 */
export function parseAitareyaUpanishadSections(text) {
	const startIndex = text.search(AITAREYA_UPANISHAD_START_RE);
	const bodyStart = startIndex >= 0 ? startIndex : 0;
	const preamble = text.slice(0, bodyStart).trim();
	const body = text.slice(bodyStart).trim();

	const openingShanti =
		preamble.match(AITAREYA_CLOSING_SHANTI_RE)?.[0]?.trim() ??
		preamble.match(/ॐ\s+वाङ्मे[\s\S]+/)?.[0]?.trim() ??
		null;

	/** @type {{ label: string; type: string; verses: { number: number; text: string }[] }[]} */
	const sections = [];

	const adhyayaMatches = [...body.matchAll(AITAREYA_ADHYAYA_SPLIT_RE)];
	/** @type {{ ordinal: string; chunk: string }[]} */
	const adhyayaChunks = [];

	if (adhyayaMatches.length) {
		for (let index = 0; index < adhyayaMatches.length; index++) {
			const match = adhyayaMatches[index];
			const chunkStart = (match.index ?? 0) + match[0].length;
			const chunkEnd =
				index + 1 < adhyayaMatches.length
					? adhyayaMatches[index + 1].index ?? body.length
					: body.length;
			adhyayaChunks.push({
				ordinal: match[1],
				chunk: body.slice(chunkStart, chunkEnd),
			});
		}
	} else {
		adhyayaChunks.push({ ordinal: 'प्रथम', chunk: body });
	}

	for (const { ordinal, chunk } of adhyayaChunks) {
		const label = AITAREYA_ADHYAYA_LABELS[ordinal] ?? `${ordinal}ोऽध्यायः`;
		const khandaChunks = chunk
			.split(AITAREYA_KHANDA_MARKER)
			.map((part) => part.trim())
			.filter((part) => /[\u0900-\u097F]/.test(part.replace(/[।॥\s]/g, '')));

		/** @type {{ number: number; text: string }[]} */
		const verses = [];
		for (const khandaChunk of khandaChunks) {
			const textBody = parseAitareyaKhandaText(khandaChunk);
			if (textBody) {
				verses.push({ number: verses.length + 1, text: textBody });
			}
		}

		if (verses.length) {
			sections.push({
				type: `chapter-${sections.length + 1}`,
				label,
				verses,
			});
		}
	}

	return {
		title: 'ऐतरेयोपनिषद्',
		openingShanti,
		sections,
	};
}

/**
 * @param {string} html
 */
export function parseAitareyaUpanishadHtml(html) {
	const match = html.match(/<pre[^>]*id=["']content["'][^>]*>([\s\S]*?)<\/pre>/i);
	if (!match) {
		throw new Error('Could not locate <pre id="content"> in Aitareya Upaniṣad source HTML');
	}

	let text = match[1];
	text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, `\n${AITAREYA_KHANDA_MARKER}$1\n`);
	text = text.replace(HR_SPLIT_RE, HR_MARKER);
	text = text.replace(/<br\s*\/?>/gi, '\n');
	text = text.replace(/<[^>]+>/g, '');
	text = text
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/\r/g, '');

	const metadataIndex = text.search(/\n% Text title/m);
	if (metadataIndex >= 0) {
		text = text.slice(0, metadataIndex);
	}

	return parseAitareyaUpanishadSections(text.replace(/\n{3,}/g, '\n\n').trim());
}
