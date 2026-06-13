import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LINE_WORKER = path.resolve(__dirname, '../.transliterate-line-worker.mjs');
const HAS_DEVANAGARI = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]/;

/**
 * @param {string} text
 */
export function transliterateDevanagari(text) {
	if (!HAS_DEVANAGARI.test(text)) return text;

	const result = spawnSync(process.execPath, [LINE_WORKER, text], {
		encoding: 'utf8',
		maxBuffer: 16 * 1024 * 1024,
	});

	if (result.status !== 0) {
		throw new Error(result.stderr || 'transliteration failed');
	}

	return result.stdout;
}
