import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('src/content/docs/iast/vedamantras');
const HAS_DEVANAGARI = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]/;

const lineWorker = `import * as inditrans from '@vm75/inditrans';

const DEVANAGARI_RE = /[\\u0900-\\u097F\\u1CD0-\\u1CFF\\uA8E0-\\uA8FF]+/g;

await inditrans.init();

const line = process.argv[2];
const runs = [...line.matchAll(DEVANAGARI_RE)];
if (!runs.length) {
\tprocess.stdout.write(line);
\tprocess.exit(0);
}

let cursor = 0;
let out = '';
for (const run of runs) {
\tout += line.slice(cursor, run.index);
\tout += inditrans.transliterate(run[0], inditrans.Script.devanagari, inditrans.Script.iast);
\tcursor = run.index + run[0].length;
}
out += line.slice(cursor);
process.stdout.write(out.replace(/।/g, '.').replace(/॥/g, '..'));
`;

const worker = `import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const lineWorkerPath = path.resolve('scripts/.transliterate-line-worker.mjs');
const HAS_DEVANAGARI = /[\\u0900-\\u097F\\u1CD0-\\u1CFF\\uA8E0-\\uA8FF]/;

function transliterateLine(line) {
\tconst result = spawnSync(process.execPath, [lineWorkerPath, line], {
\t\tencoding: 'utf8',
\t\tmaxBuffer: 10 * 1024 * 1024,
\t});
\tif (result.status !== 0) throw new Error(result.stderr || 'line transliteration failed');
\treturn result.stdout;
}

const filePath = process.argv[2];
const content = fs.readFileSync(filePath, 'utf8');
const parts = content.match(/^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)$/);
if (!parts) process.exit(2);

const [, frontmatter, body] = parts;
if (!HAS_DEVANAGARI.test(body)) process.exit(3);

const updatedLines = body.split('\\n').map((line) =>
\tHAS_DEVANAGARI.test(line) ? transliterateLine(line) : line,
);

fs.writeFileSync(filePath, \`---\\n\${frontmatter}\\n---\\n\${updatedLines.join('\\n')}\`, 'utf8');
`;

const workerPath = path.resolve('scripts/.transliterate-worker.mjs');
const lineWorkerPath = path.resolve('scripts/.transliterate-line-worker.mjs');
fs.writeFileSync(workerPath, worker);
fs.writeFileSync(lineWorkerPath, lineWorker);

function processFile(filePath) {
	if (!HAS_DEVANAGARI.test(fs.readFileSync(filePath, 'utf8').split('---\n').slice(2).join('---\n'))) {
		console.log(`skip (already transliterated): ${filePath}`);
		return false;
	}

	const result = spawnSync(process.execPath, [workerPath, filePath], {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
	});

	if (result.status === 3) {
		console.log(`skip (already transliterated): ${filePath}`);
		return false;
	}

	if (result.status !== 0) {
		console.error(`failed: ${filePath}`);
		if (result.stderr) console.error(result.stderr);
		if (result.stdout) console.error(result.stdout);
		return false;
	}

	console.log(`updated: ${filePath}`);
	return true;
}

function walk(dir) {
	let count = 0;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			count += walk(fullPath);
		} else if (entry.name.endsWith('.mdx')) {
			if (processFile(fullPath)) count++;
		}
	}
	return count;
}

const updated = walk(ROOT);
fs.unlinkSync(workerPath);
fs.unlinkSync(lineWorkerPath);
console.log(`\nDone. Updated ${updated} file(s).`);
