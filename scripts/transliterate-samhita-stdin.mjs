import readline from 'readline';
import * as inditrans from '@vm75/inditrans';

const DEVANAGARI_RE = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]+/g;
const HAS_DEVANAGARI = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]/;
const chunkSize = 240;

await inditrans.init();

/**
 * @param {string} line
 */
function transliterateLine(line) {
	if (!HAS_DEVANAGARI.test(line)) return line;

	const runs = [...line.matchAll(DEVANAGARI_RE)];
	if (!runs.length) return line;

	let cursor = 0;
	let out = '';
	for (const run of runs) {
		out += line.slice(cursor, run.index);
		const text = run[0];
		for (let i = 0; i < text.length; i += chunkSize) {
			out += inditrans.transliterate(
				text.slice(i, i + chunkSize),
				inditrans.Script.devanagari,
				inditrans.Script.iast
			);
		}
		cursor = run.index + run[0].length;
	}
	out += line.slice(cursor);
	return out.replace(/।/g, '.').replace(/॥/g, '..');
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });

for await (const line of rl) {
	if (!line.trim()) continue;
	const { id, text } = JSON.parse(line);
	try {
		const result = transliterateLine(text);
		process.stdout.write(`${JSON.stringify({ id, result })}\n`);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		process.stdout.write(`${JSON.stringify({ id, error: message })}\n`);
	}
}
