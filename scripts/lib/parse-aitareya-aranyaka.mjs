import { cleanTitusMarkup } from './normalize-titus-iast.mjs';

const ROMAN_ARANYAKA = {
	I: 1,
	II: 2,
	III: 3,
	IV: 4,
	V: 5,
};

/**
 * @param {string} anchor
 */
export function parseAranyakaAnchor(anchor) {
	const trimmed = anchor.replace(/__\d+_\d+$/, '').replace(/__\d+$/, '');

	const romanMatch = trimmed.match(/^(III|II|IV|I|V)(?:_|$)/);
	if (romanMatch) {
		const verse = trimmed.match(/_([a-z])_(\d+)/i);
		const paragraph = verse ? Number(verse[2]) : 1;
		return {
			aranyaka: ROMAN_ARANYAKA[romanMatch[1]],
			adhyaya: 1,
			paragraph,
		};
	}

	const parts = trimmed.split('_').filter((part) => part !== '');
	if (parts.length < 2) return null;

	const aranyaka = Number(parts[0]);
	const adhyaya = Number(parts[1]);
	if (!Number.isFinite(aranyaka) || !Number.isFinite(adhyaya)) return null;

	let paragraph = 1;
	if (parts[2] && /^\d+$/.test(parts[2])) {
		paragraph = Number(parts[2]);
	}

	return { aranyaka, adhyaya, paragraph };
}

/**
 * @param {string} html
 */
export function parseAranyakaTitusMeta(html) {
	const aranyaka = html.match(/Aranyaka:\s*(\d+)/i)?.[1];
	const adhyaya = html.match(/Adhyaya:\s*(\d+)/i)?.[1];
	return {
		aranyaka: aranyaka ? Number(aranyaka) : undefined,
		adhyaya: adhyaya ? Number(adhyaya) : undefined,
	};
}

/**
 * Mahānāmnī (āraṇyaka 4) is encoded as metrical verses in TITUS, not prose sentences.
 * @param {string} html
 */
function extractMahanamniVerses(html) {
	/** @type {{ aranyaka: number; adhyaya: number; paragraph: number; text: string }[]} */
	const results = [];

	for (const block of html.split(/<span id=h7>/).slice(1)) {
		const verseNum = Number(block.match(/Verse:\s*(\d+)/)?.[1] ?? 0);
		if (!verseNum) continue;

		const lines = [...block.matchAll(/<span id=iovml16>([\s\S]*?)<\/span>/g)]
			.map((match) => cleanTitusMarkup(match[1].replace(/<[^>]+>/g, '')).trim())
			.filter((line) => line && !/^\d+$/.test(line));

		const text = lines.join(' ').replace(/\s+/g, ' ').trim();
		if (!text) continue;

		results.push({
			aranyaka: 4,
			adhyaya: 1,
			paragraph: verseNum,
			text,
		});
	}

	return results;
}

/**
 * @param {string} html
 */
export function extractAranyakaTitusSentences(html) {
	if (/NAME="RV_AA_IV/.test(html)) {
		return extractMahanamniVerses(html);
	}

	/** @type {{ aranyaka: number; adhyaya: number; paragraph: number; text: string }[]} */
	const results = [];

	for (const part of html.split(/NAME="RV_AA_/).slice(1)) {
		const anchor = part.match(/^([^"]+)"/)?.[1];
		if (!anchor) continue;

		const parsed = parseAranyakaAnchor(anchor);
		if (!parsed) continue;

		const proseMatch = part.match(/<span id=iovpl16>([\s\S]*?)<\/span>/);
		const verseMatch = part.match(/<span id=iovml16>([\s\S]*?)<\/span>/);
		const rawSource = proseMatch?.[1] ?? verseMatch?.[1];
		if (!rawSource) continue;

		const raw = cleanTitusMarkup(rawSource.replace(/<[^>]+>/g, ''))
			.replace(/\\/g, '')
			.trim();
		if (!raw || /^\d+$/.test(raw)) continue;

		results.push({
			aranyaka: parsed.aranyaka,
			adhyaya: parsed.adhyaya,
			paragraph: parsed.paragraph,
			text: raw,
		});
	}

	return results;
}
