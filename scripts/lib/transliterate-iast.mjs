import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BATCH_WORKER = path.resolve(__dirname, '../.transliterate-iast-batch-worker.mjs');

/**
 * Normalize characters that break inditrans or come from TITUS markup.
 * @param {string} iast
 */
export function sanitizeIastForTransliteration(iast) {
	return iast
		.replace(/ü/g, 'u')
		.replace(/ö/g, 'o')
		.replace(/ä/g, 'a')
		.replace(/[\u0559\u055A\u055B]\d*/g, '')
		.replace(/&lt;([^&]+)&gt;/g, '$1')
		.replace(/\\[a-z]*/gi, '')
		.replace(/[+|=|\\]/g, '');
}

/**
 * Transliterate IAST strings to Devanagari in an isolated process (inditrans WASM corrupts in long sessions).
 * @param {string[]} sentences
 */
export function transliterateIastBatch(sentences) {
	if (!sentences.length) return [];

	const result = spawnSync(process.execPath, [BATCH_WORKER], {
		input: JSON.stringify(sentences),
		encoding: 'utf8',
		maxBuffer: 16 * 1024 * 1024,
	});

	if (result.status !== 0) {
		throw new Error(result.stderr || 'IAST transliteration failed');
	}

	return JSON.parse(result.stdout);
}
