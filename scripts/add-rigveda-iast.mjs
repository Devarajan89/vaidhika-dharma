import fs from 'fs';
import path from 'path';
import { spawn } from 'node:child_process';

const ROOT = process.cwd();
const INDEX_PATH = path.join(ROOT, 'src/data/rigveda/verse-index.json');
const LINE_WORKER = path.join(ROOT, 'scripts/.transliterate-line-worker.mjs');
const CONCURRENCY = Number.parseInt(process.env.IAST_CONCURRENCY ?? '8', 10);
const SAVE_EVERY = 500;

function loadIndex() {
	return JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
}

function saveIndex(index) {
	fs.writeFileSync(INDEX_PATH, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
}

/**
 * @param {string} text
 */
function transliterateLine(text) {
	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [LINE_WORKER, text], {
			stdio: ['ignore', 'pipe', 'pipe'],
		});

		let stdout = '';
		let stderr = '';
		child.stdout.on('data', (chunk) => {
			stdout += chunk;
		});
		child.stderr.on('data', (chunk) => {
			stderr += chunk;
		});
		child.on('error', reject);
		child.on('close', (code) => {
			if (code === 0) {
				resolve(stdout);
				return;
			}
			reject(new Error(stderr || `transliteration failed with code ${code}`));
		});
	});
}

/**
 * @template T
 * @param {T[]} items
 * @param {number} concurrency
 * @param {(item: T, index: number) => Promise<void>} handler
 */
async function runPool(items, concurrency, handler) {
	let nextIndex = 0;

	async function worker() {
		while (nextIndex < items.length) {
			const index = nextIndex;
			nextIndex += 1;
			await handler(items[index], index);
		}
	}

	await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
}

async function main() {
	const index = loadIndex();
	/** @type {{ id: string; text: string }[]} */
	const tasks = [];

	for (const [key, record] of Object.entries(index.verses)) {
		if (!record.iast) {
			tasks.push({ id: `v:${key}`, text: record.text });
		}
	}

	for (const [key, record] of Object.entries(index.suktas)) {
		if (!record.headerIast) {
			tasks.push({ id: `s:${key}`, text: record.header });
		}
	}

	if (!tasks.length) {
		console.log('All Rigveda IAST fields already present.');
		return;
	}

	console.log(`Transliterating ${tasks.length} Rigveda texts (${CONCURRENCY} workers)…`);
	let completed = 0;

	await runPool(tasks, CONCURRENCY, async (task) => {
		const result = await transliterateLine(task.text);

		if (task.id.startsWith('v:')) {
			index.verses[task.id.slice(2)].iast = result;
		} else {
			index.suktas[task.id.slice(2)].headerIast = result;
		}

		completed += 1;
		if (completed % SAVE_EVERY === 0 || completed === tasks.length) {
			saveIndex(index);
			console.log(`  ${completed} / ${tasks.length}`);
		}
	});

	saveIndex(index);
	console.log(`Updated ${path.relative(ROOT, INDEX_PATH)}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
