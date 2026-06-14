import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { expectedMantraCount } from './lib/kanva-samhita-counts.mjs';
import {
	parseYajurvedaChapter,
	prepareChapterText,
	truncateDuplicateChapterBody,
} from './lib/parse-yajurveda-chapter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'src/data/shukla-yajur/kanva/vajasneyi_kanva_samhita_chapters.json');
const TOTAL_CHAPTERS = 40;

/** @type {unknown[]} */
let chapters = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
let changed = false;
const issues = [];

for (let chapterNumber = 1; chapterNumber <= TOTAL_CHAPTERS; chapterNumber++) {
	const entry = chapters.find((item) => item.chapter === chapterNumber);
	if (!entry) {
		issues.push(`missing chapter ${chapterNumber}`);
		continue;
	}

	const cleaned = prepareChapterText(entry.text);
	if (cleaned !== entry.text) {
		entry.text = cleaned;
		changed = true;
	}

	const duplicateRemoved = truncateDuplicateChapterBody(entry.text) !== entry.text;
	if (duplicateRemoved) {
		issues.push(`chapter ${chapterNumber}: removed duplicated adhyāya body`);
	}

	const parsed = parseYajurvedaChapter(entry.text, {
		expectedVerses: expectedMantraCount(chapterNumber),
	});
	const expected = expectedMantraCount(chapterNumber);
	if (parsed.verseCount !== expected) {
		issues.push(
			`chapter ${chapterNumber}: expected ${expected} mantras, parsed ${parsed.verseCount}`
		);
	}
}

if (changed) {
	fs.writeFileSync(DATA_FILE, `${JSON.stringify(chapters, null, 4)}\n`, 'utf8');
	console.log(`Updated ${DATA_FILE}`);
} else {
	console.log(`No JSON changes needed in ${DATA_FILE}`);
}

if (issues.length) {
	console.warn('Validation notes:');
	for (const issue of issues) {
		console.warn(`  - ${issue}`);
	}
	process.exitCode = issues.some((issue) => issue.includes('expected')) ? 1 : 0;
} else {
	console.log('All chapters validated.');
}
