import * as inditrans from '@vm75/inditrans';

const DEVANAGARI_RE = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]+/g;

await inditrans.init();

const line = process.argv[2];
const runs = [...line.matchAll(DEVANAGARI_RE)];
if (!runs.length) {
	process.stdout.write(line);
	process.exit(0);
}

let cursor = 0;
let out = '';
const chunkSize = 240;
for (const run of runs) {
	out += line.slice(cursor, run.index);
	const text = run[0];
	for (let i = 0; i < text.length; i += chunkSize) {
		out += inditrans.transliterate(text.slice(i, i + chunkSize), inditrans.Script.devanagari, inditrans.Script.iast);
	}
	cursor = run.index + run[0].length;
}
out += line.slice(cursor);
process.stdout.write(out.replace(/।/g, '.').replace(/॥/g, '..'));
