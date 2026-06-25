import { cleanTitusMarkup } from './normalize-titus-iast.mjs';

/**
 * @typedef {{ khanda: number; sentences: string[] }} AitareyaKhanda
 * @typedef {{ header?: string; khandas: AitareyaKhanda[]; sentenceCount: number }} ParsedAitareyaAdhyaya
 */

const KHANDA_HEADER_RE =
	/^(?:\{)?adʰyāya\s+(\d+)(?:,\s*kʰaṇḍaḥ\s+([\d-]+))?\}?$/i;

/**
 * @param {string} text
 */
export function parseAitareyaAdhyayaText(text) {
	/** @type {AitareyaKhanda[]} */
	const khandas = [];
	/** @type {string | undefined} */
	let header;

	const lines = text
		.split(/\n+/)
		.map((line) => line.trim())
		.filter(Boolean);

	for (const line of lines) {
		const khandaMatch = line.match(/^khaṇḍaḥ\s+(\d+)$/i);
		if (khandaMatch) {
			khandas.push({ khanda: Number(khandaMatch[1]), sentences: [] });
			continue;
		}

		if (khandas.length === 0) {
			header = header ? `${header}\n${line}` : line;
			continue;
		}

		const current = khandas[khandas.length - 1];
		current.sentences.push(line);
	}

	const sentenceCount = khandas.reduce((sum, khanda) => sum + khanda.sentences.length, 0);

	return { header, khandas, sentenceCount };
}

/**
 * @param {string} meta
 */
export function parseTitusMeta(meta) {
	const pancika = meta.match(/pañcikā\s*(\d+)/i)?.[1];
	const adhyaya = meta.match(/adʰyāya\s*(\d+)/i)?.[1];
	return {
		astaka: pancika ? Number(pancika) : undefined,
		globalAdhyaya: adhyaya ? Number(adhyaya) : undefined,
	};
}

/**
 * @param {string} html
 */
export function extractTitusSentences(html) {
	/** @type {{ astaka: number; khanda: number; sentence: number; text: string }[]} */
	const results = [];

	for (const part of html.split(/NAME="RV_AB_/).slice(1)) {
		const anchor = part.match(/^([^"]+)"/)?.[1];
		const textMatch = part.match(/<span id=iovpl16>([\s\S]*?)<\/span>/);
		if (!anchor || !textMatch) continue;

		const pieces = anchor.split('_').map(Number);
		if (pieces.length < 3) continue;

		const raw = cleanTitusMarkup(textMatch[1].replace(/<[^>]+>/g, ''));

		if (!raw) continue;

		results.push({
			astaka: pieces[0],
			khanda: pieces[1],
			sentence: pieces[2],
			text: raw,
		});
	}

	return results;
}
