import fs from 'fs';
import path from 'path';
import {
	formatSuktaHeader,
	parseRigvedaSukta,
} from './lib/parse-rigveda-sukta.mjs';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'src/data/rigveda');
const OUTPUT = path.join(DATA_DIR, 'verse-index.json');

function loadMandalaEntries() {
	/** @type {{ mandala: number; sukta: number; text: string }[]} */
	const entries = [];

	for (let mandala = 1; mandala <= 10; mandala += 1) {
		const jsonPath = path.join(DATA_DIR, `rigveda_mandala_${mandala}.json`);
		if (!fs.existsSync(jsonPath)) continue;
		entries.push(...JSON.parse(fs.readFileSync(jsonPath, 'utf8')));
	}

	return entries;
}

function buildFromMandalaJson() {
	/** @type {Record<string, { mandala: number; sukta: number; verse: number; text: string; iast?: string }>} */
	const verses = {};
	/** @type {Record<string, { mandala: number; sukta: number; header: string; verseCount: number; verses: number[] }>} */
	const suktas = {};

	for (const entry of loadMandalaEntries()) {
		const parsed = parseRigvedaSukta(entry.text);
		const suktaKey = `${entry.mandala}:${entry.sukta}`;
		const verseNumbers = [];

		for (const verse of parsed.verses) {
			const key = `${entry.mandala}:${entry.sukta}:${verse.number}`;
			verses[key] = {
				mandala: entry.mandala,
				sukta: entry.sukta,
				verse: verse.number,
				text: verse.text,
			};
			verseNumbers.push(verse.number);
		}

		suktas[suktaKey] = {
			mandala: entry.mandala,
			sukta: entry.sukta,
			header: formatSuktaHeader(parsed.header),
			verseCount: parsed.verses.length,
			verses: verseNumbers,
		};
	}

	return { verses, suktas };
}

function loadExistingIndex() {
	if (!fs.existsSync(OUTPUT)) return null;
	const parsed = JSON.parse(fs.readFileSync(OUTPUT, 'utf8'));
	if (parsed.verses && parsed.suktas) return parsed;
	return null;
}

function main() {
	const mandalaEntries = loadMandalaEntries();
	let index;

	if (mandalaEntries.length) {
		index = buildFromMandalaJson();
	} else {
		index = loadExistingIndex();
		if (!index) {
			throw new Error(
				'No rigveda_mandala_*.json files found and verse-index.json is missing or legacy format.'
			);
		}
		console.log('No mandala JSON source files — keeping existing verse-index.json');
	}

	fs.writeFileSync(OUTPUT, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
	console.log(
		`Wrote ${Object.keys(index.verses).length} verses and ${Object.keys(index.suktas).length} suktas to ${path.relative(ROOT, OUTPUT)}`
	);
}

main();
