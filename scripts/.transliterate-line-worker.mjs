import * as inditrans from '@vm75/inditrans';

const DEVANAGARI_RE = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]+/g;

await inditrans.init();

/**
 * @param {string} line
 */
function transliterateLine(line) {
	const runs = [...line.matchAll(DEVANAGARI_RE)];
	if (!runs.length) {
		return line;
	}

	let cursor = 0;
	let out = '';
	const chunkSize = 240;
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

async function readStdin() {
	const chunks = [];
	for await (const chunk of process.stdin) {
		chunks.push(chunk);
	}
	return Buffer.concat(chunks).toString('utf8');
}

const line = process.argv[2] ?? (await readStdin());
process.stdout.write(transliterateLine(line));
