import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';

const LINE_WORKER = path.join(process.cwd(), 'scripts/.transliterate-line-worker.mjs');
const HAS_DEVANAGARI = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]/;

function transliterateSync(text: string): string {
	const result = spawnSync(process.execPath, [LINE_WORKER, text], {
		encoding: 'utf8',
		maxBuffer: 16 * 1024 * 1024,
	});

	if (result.status !== 0) {
		throw new Error(result.stderr || 'transliteration failed');
	}

	return result.stdout;
}

function transliterateAsync(text: string): Promise<string> {
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
			reject(new Error(stderr || 'transliteration failed'));
		});
	});
}

export async function transliterateDevanagari(text: string): Promise<string> {
	if (!text.trim() || !HAS_DEVANAGARI.test(text)) {
		return text;
	}
	return transliterateSync(text);
}

const BATCH_SEP = '\n\u241E\n';

function transliterateStdin(text: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [LINE_WORKER], {
			stdio: ['pipe', 'pipe', 'pipe'],
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
			reject(new Error(stderr || 'transliteration failed'));
		});
		child.stdin.end(text, 'utf8');
	});
}

export async function transliterateDevanagariMany(texts: string[]): Promise<string[]> {
	if (texts.length === 0) return [];
	if (texts.length === 1) {
		return [await transliterateDevanagari(texts[0])];
	}

	const maxChars = 6000;
	const out: string[] = [];
	let batch: string[] = [];
	let batchChars = 0;

	const flush = async () => {
		if (batch.length === 0) return;
		if (batch.length === 1) {
			out.push(await transliterateStdin(batch[0]));
		} else {
			const result = await transliterateStdin(batch.join(BATCH_SEP));
			const parts = result.split(BATCH_SEP);
			if (parts.length === batch.length) {
				out.push(...parts);
			} else {
				for (const text of batch) {
					out.push(await transliterateStdin(text));
				}
			}
		}
		batch = [];
		batchChars = 0;
	};

	for (const text of texts) {
		if (batch.length > 0 && batchChars + text.length > maxChars) {
			await flush();
		}
		batch.push(text);
		batchChars += text.length;
	}
	await flush();
	return out;
}

export async function transliterateDevanagariMap(
	texts: Record<string, string>
): Promise<Record<string, string>> {
	const entries = Object.entries(texts);
	const out: Record<string, string> = { ...texts };
	const concurrency = 4;
	let nextIndex = 0;

	async function worker() {
		while (nextIndex < entries.length) {
			const index = nextIndex;
			nextIndex += 1;
			const [key, text] = entries[index];
			if (!text.trim() || !HAS_DEVANAGARI.test(text)) {
				continue;
			}
			out[key] = await transliterateAsync(text);
		}
	}

	await Promise.all(
		Array.from({ length: Math.min(concurrency, entries.length) }, worker)
	);
	return out;
}

export const transliterateDevanagariMapWithWorker = transliterateDevanagariMap;
