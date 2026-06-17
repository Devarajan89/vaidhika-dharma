import fs from 'fs';
import path from 'path';
import {
	formatSuktaHeader,
	parseRigvedaSukta,
} from './parse-rigveda-sukta.mjs';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'src/data/rigveda');
const VERSE_INDEX_PATH = path.join(DATA_DIR, 'verse-index.json');

const SVARA_ACCENT_RE = /[\u0951-\u0954\u1CD0-\u1CFA]/g;
const VERSE_MARKER_RE = /॥[०-९0-9]+(?:॥)?/g;
const WHITESPACE_RE = /\s+/g;

/**
 * @param {string} text
 */
export function normalizeMantraText(text) {
	return text
		.replace(/<br\s*\/?>/gi, ' ')
		.replace(VERSE_MARKER_RE, '')
		.replace(SVARA_ACCENT_RE, '')
		.replace(/[^\u0900-\u097F]/g, '')
		.replace(WHITESPACE_RE, '')
		.trim();
}

/**
 * @param {string} a
 * @param {string} b
 */
export function similarityScore(a, b) {
	if (a === b) return 1;
	if (!a || !b) return 0;

	const rows = a.length + 1;
	const cols = b.length + 1;
	/** @type {number[][]} */
	const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

	for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
	for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

	for (let i = 1; i < rows; i += 1) {
		for (let j = 1; j < cols; j += 1) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1,
				matrix[i][j - 1] + 1,
				matrix[i - 1][j - 1] + cost
			);
		}
	}

	const distance = matrix[a.length][b.length];
	return 1 - distance / Math.max(a.length, b.length);
}

/**
 * @returns {{
 *   byNormalized: Map<string, { mandala: number; sukta: number; verse: number; text: string; key: string }>;
 *   byKey: Record<string, { mandala: number; sukta: number; verse: number; text: string }>;
 *   normalizedEntries: { normalized: string; record: { mandala: number; sukta: number; verse: number; text: string; key: string } }[];
 * }}
 */
export function loadRigvedaCorpus() {
	/** @type {Map<string, { mandala: number; sukta: number; verse: number; text: string; key: string }>} */
	const byNormalized = new Map();
	/** @type {Record<string, { mandala: number; sukta: number; verse: number; text: string }>} */
	const byKey = {};
	/** @type {{ normalized: string; record: { mandala: number; sukta: number; verse: number; text: string; key: string } }[]} */
	const normalizedEntries = [];

	if (fs.existsSync(VERSE_INDEX_PATH)) {
		const index = JSON.parse(fs.readFileSync(VERSE_INDEX_PATH, 'utf8'));
		const verses = index.verses ?? index;

		for (const [key, record] of Object.entries(verses)) {
			byKey[key] = record;
			const normalized = normalizeMantraText(record.text);
			if (normalized && !byNormalized.has(normalized)) {
				const indexed = { ...record, key };
				byNormalized.set(normalized, indexed);
				normalizedEntries.push({ normalized, record: indexed });
			}
		}

		return { byNormalized, byKey, normalizedEntries };
	}

	for (let mandala = 1; mandala <= 10; mandala += 1) {
		const jsonPath = path.join(DATA_DIR, `rigveda_mandala_${mandala}.json`);
		if (!fs.existsSync(jsonPath)) continue;

		const entries = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
		for (const entry of entries) {
			const parsed = parseRigvedaSukta(entry.text);
			for (const verse of parsed.verses) {
				const key = `${entry.mandala}:${entry.sukta}:${verse.number}`;
				const record = {
					mandala: entry.mandala,
					sukta: entry.sukta,
					verse: verse.number,
					text: verse.text,
				};
				byKey[key] = record;
				const normalized = normalizeMantraText(verse.text);
				if (normalized && !byNormalized.has(normalized)) {
					const indexed = { ...record, key };
					byNormalized.set(normalized, indexed);
					normalizedEntries.push({ normalized, record: indexed });
				}
			}
		}
	}

	return { byNormalized, byKey, normalizedEntries };
}

/**
 * @returns {Record<string, { mandala: number; sukta: number; header: string; verseCount: number; verses: number[] }>}
 */
export function loadRigvedaSuktaIndex() {
	if (!fs.existsSync(VERSE_INDEX_PATH)) {
		throw new Error(`Missing verse index: ${VERSE_INDEX_PATH}`);
	}

	const index = JSON.parse(fs.readFileSync(VERSE_INDEX_PATH, 'utf8'));
	if (index.suktas) return index.suktas;

	/** @type {Record<string, { mandala: number; sukta: number; header: string; verseCount: number; verses: number[] }>} */
	const suktas = {};

	for (let mandala = 1; mandala <= 10; mandala += 1) {
		const jsonPath = path.join(DATA_DIR, `rigveda_mandala_${mandala}.json`);
		if (!fs.existsSync(jsonPath)) continue;

		const entries = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
		for (const entry of entries) {
			const parsed = parseRigvedaSukta(entry.text);
			const key = `${entry.mandala}:${entry.sukta}`;
			suktas[key] = {
				mandala: entry.mandala,
				sukta: entry.sukta,
				header: formatSuktaHeader(parsed.header),
				verseCount: parsed.verses.length,
				verses: parsed.verses.map((verse) => verse.number),
			};
		}
	}

	return suktas;
}

const FUZZY_THRESHOLD = 0.92;

/**
 * @param {string} text
 * @param {Map<string, { mandala: number; sukta: number; verse: number; text: string; key: string }>} byNormalized
 * @param {Record<string, { mandala: number; sukta: number; verse: number; text: string }>} byKey
 * @param {{ normalized: string; record: { mandala: number; sukta: number; verse: number; text: string; key: string } }[]} normalizedEntries
 */
export function lookupMantra(text, byNormalized, byKey, normalizedEntries) {
	const normalized = normalizeMantraText(text);
	if (!normalized) return null;

	const exact = byNormalized.get(normalized);
	if (exact) return exact;

	if (normalized.length >= 12) {
		let substringMatch = null;
		let substringScore = 0;
		for (const entry of normalizedEntries) {
			if (entry.normalized.includes(normalized)) {
				const score = normalized.length / entry.normalized.length;
				if (score > substringScore) {
					substringScore = score;
					substringMatch = entry.record;
				}
			} else if (
				entry.normalized.length >= 12 &&
				normalized.includes(entry.normalized)
			) {
				const score = entry.normalized.length / normalized.length;
				if (score > substringScore) {
					substringScore = score;
					substringMatch = entry.record;
				}
			}
		}
		if (substringMatch && substringScore >= 0.35) {
			return substringMatch;
		}
	}

	let best = null;
	let bestScore = FUZZY_THRESHOLD;

	const candidates = new Set();
	const prefix = normalized.slice(0, 4);
	for (const entry of normalizedEntries) {
		if (
			entry.normalized.startsWith(prefix) ||
			entry.normalized.includes(normalized.slice(0, 12))
		) {
			candidates.add(entry);
		}
	}

	const searchPool = candidates.size ? [...candidates] : normalizedEntries;

	for (const entry of searchPool) {
		const score = similarityScore(normalized, entry.normalized);
		if (score > bestScore) {
			bestScore = score;
			best = entry.record;
		}
	}

	return best;
}

/**
 * @param {number} mandala
 * @param {number} sukta
 * @param {number} verse
 * @param {Record<string, { mandala: number; sukta: number; verse: number; text: string }>} byKey
 */
export function getMantraRef(mandala, sukta, verse, byKey) {
	return byKey[`${mandala}:${sukta}:${verse}`] ?? null;
}
