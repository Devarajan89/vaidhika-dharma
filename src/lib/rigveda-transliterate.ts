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
