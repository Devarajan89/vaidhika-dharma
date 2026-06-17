import fs from 'fs';
import path from 'path';
import { lookupMantra, loadRigvedaCorpus } from './lib/rigveda-corpus.mjs';

/**
 * One-time migration helper: parses legacy inline MDX and writes committed
 * compilation maps under src/data/rigveda/compilations/.
 * Normal builds read those JSON files directly; do not run this in prebuild
 * after MDX pages have been converted to <RigvedaCompilation />.
 */

const ROOT = process.cwd();
const SANGGRAHA_DIR = path.join(ROOT, 'src/content/docs/vedamantras/ऋग्वेदसूक्तसंग्रह');
const OUTPUT_DIR = path.join(ROOT, 'src/data/rigveda/compilations');

const COMPILATIONS = [
	'brahmanaspati-suktam',
	'ganapathy-suktam',
	'pancha-rudra',
	'swasti-suktam',
	'a-no-bhadrauh-suktam',
];

const HEADER_RE = /^\*\*(.+)\*\*$/;
const VERSE_END_RE = /॥([०-९0-9]+)(?:॥)?\s*$/;
const DEVANAGARI_DIGIT_MAP = {
	'०': '0',
	'१': '1',
	'२': '2',
	'३': '3',
	'४': '4',
	'५': '5',
	'६': '6',
	'७': '7',
	'८': '8',
	'९': '9',
};

/**
 * @param {string} value
 */
function parseDisplayNumber(value) {
	return Number.parseInt(
		value
			.split('')
			.map((char) => DEVANAGARI_DIGIT_MAP[char] ?? char)
			.join(''),
		10
	);
}

/**
 * @param {string} mdx
 */
function extractSuktaPageBody(mdx) {
	const start = mdx.indexOf('<SuktaPage');
	if (start === -1) return '';
	const openEnd = mdx.indexOf('>', start);
	const close = mdx.lastIndexOf('</SuktaPage>');
	if (openEnd === -1 || close === -1) return '';
	return mdx.slice(openEnd + 1, close).trim();
}

/**
 * @param {string} body
 * @param {ReturnType<typeof loadRigvedaCorpus>['byNormalized']} byNormalized
 * @param {ReturnType<typeof loadRigvedaCorpus>['byKey']} byKey
 * @param {ReturnType<typeof loadRigvedaCorpus>['normalizedEntries']} normalizedEntries
 */
function parseCompilationBody(body, byNormalized, byKey, normalizedEntries) {
	/** @type {{ header: string | null; mantras: { mandala: number; sukta: number; verse: number; label: number }[] }[]} */
	const sections = [];
	let current = { header: null, mantras: [] };
	/** @type {string[]} */
	let pendingLines = [];

	const flushMantra = (labelText) => {
		const text = pendingLines.join('\n').trim();
		pendingLines = [];
		if (!text) return;

		const match = lookupMantra(text, byNormalized, byKey, normalizedEntries);
		if (!match) {
			current.mantras.push({
				label: parseDisplayNumber(labelText),
				text: text.replace(/<br\s*\/?>/gi, '\n').trim(),
			});
			return;
		}

		current.mantras.push({
			mandala: match.mandala,
			sukta: match.sukta,
			verse: match.verse,
			label: parseDisplayNumber(labelText),
		});
	};

	for (const rawLine of body.split('\n')) {
		const line = rawLine.trim().replace(/<br\s*\/?>/gi, '').trim();
		if (!line) continue;

		const headerMatch = line.match(HEADER_RE);
		if (headerMatch) {
			if (current.header || current.mantras.length) {
				sections.push(current);
			}
			current = { header: headerMatch[1].trim(), mantras: [] };
			pendingLines = [];
			continue;
		}

		const verseEnd = line.match(VERSE_END_RE);
		if (verseEnd) {
			const withoutMarker = line.replace(VERSE_END_RE, '').trim();
			if (withoutMarker) pendingLines.push(withoutMarker);
			flushMantra(verseEnd[1]);
			continue;
		}

		if (line.includes('॥')) {
			const parts = line.split(/(?=॥[०-९0-9]+)/);
			for (const part of parts) {
				const partEnd = part.match(VERSE_END_RE);
				if (partEnd) {
					const withoutMarker = part.replace(VERSE_END_RE, '').trim();
					if (withoutMarker) pendingLines.push(withoutMarker);
					flushMantra(partEnd[1]);
				} else if (part.trim()) {
					pendingLines.push(part.trim());
				}
			}
			continue;
		}

		pendingLines.push(line);
	}

	if (pendingLines.length) {
		throw new Error(`Trailing unmatched lines: ${pendingLines.join(' | ').slice(0, 120)}`);
	}

	if (current.header || current.mantras.length) {
		sections.push(current);
	}

	return sections;
}

function main() {
	const { byNormalized, byKey, normalizedEntries } = loadRigvedaCorpus();
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });

	for (const id of COMPILATIONS) {
		const mdxPath = path.join(SANGGRAHA_DIR, `${id}.mdx`);
		const mdx = fs.readFileSync(mdxPath, 'utf8');
		const body = extractSuktaPageBody(mdx);
		const sections = parseCompilationBody(body, byNormalized, byKey, normalizedEntries);
		const output = { id, sections };
		const outPath = path.join(OUTPUT_DIR, `${id}.json`);
		fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
		const mantraCount = sections.reduce((sum, section) => sum + section.mantras.length, 0);
		console.log(`${id}: ${sections.length} sections, ${mantraCount} mantras → ${path.relative(ROOT, outPath)}`);
	}
}

main();
