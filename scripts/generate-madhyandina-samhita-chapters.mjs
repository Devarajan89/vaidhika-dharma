import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import * as inditrans from '@vm75/inditrans';
import {
	appendChapterMantraMarker,
	extractFirstTwoWords,
	formatMantraCountLabel,
	parseYajurvedaChapter,
} from './lib/parse-yajurveda-chapter.mjs';
import { expectedMantraCount } from './lib/madhyandina-samhita-counts.mjs';
import { getAdhyayaSidebarLabel } from './lib/yajurveda-adhyaya-labels.mjs';
import { renderSamhitaChapterMdx, chapterFileName } from './lib/render-samhita-chapter-mdx.mjs';
import { transliterateDevanagari } from './lib/transliterate-devanagari.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(
	ROOT,
	'src/data/shukla-yajur/madhyandina/vajasneyi_madhyadina_samhita.json'
);
const CHAPTER_FALLBACK_FILES = new Map();
const DOCS_ROOT = path.join(ROOT, 'src/content/docs');
const ROOT_CHAPTERS_DIR = path.join(DOCS_ROOT, 'samhitas/shukla-yajur/madhyandina-samhita');
const IAST_CHAPTERS_DIR = path.join(DOCS_ROOT, 'iast/samhitas/shukla-yajur/madhyandina-samhita');
const LAST_UPDATED = new Date().toISOString().slice(0, 10);
const TOTAL_CHAPTERS = 40;

const GENERATOR_SCRIPT = fileURLToPath(import.meta.url);
const isIastWorker = Boolean(process.env.MADHYANDINA_IAST_CHAPTER);

if (isIastWorker) {
	await inditrans.init();
}

const DEVANAGARI_RE = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]+/g;
const HAS_DEVANAGARI = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]/;
const TRANSLITERATE_CHUNK = 240;

/** @type {Map<string, string>} */
const transliterationCache = new Map();

/**
 * @param {string} line
 */
function transliterateLine(line) {
	if (!HAS_DEVANAGARI.test(line)) return line;

	const cached = transliterationCache.get(line);
	if (cached !== undefined) return cached;

	try {
		const runs = [...line.matchAll(DEVANAGARI_RE)];
		if (!runs.length) {
			transliterationCache.set(line, line);
			return line;
		}

		let cursor = 0;
		let out = '';
		for (const run of runs) {
			out += line.slice(cursor, run.index);
			const text = run[0];
			for (let i = 0; i < text.length; i += TRANSLITERATE_CHUNK) {
				out += inditrans.transliterate(
					text.slice(i, i + TRANSLITERATE_CHUNK),
					inditrans.Script.devanagari,
					inditrans.Script.iast
				);
			}
			cursor = run.index + run[0].length;
		}
		out += line.slice(cursor);
		const result = out.replace(/।/g, '.').replace(/॥/g, '..');
		transliterationCache.set(line, result);
		return result;
	} catch {
		const fallback = transliterateDevanagari(line);
		transliterationCache.set(line, fallback);
		return fallback;
	}
}

const CHAPTER_ORDINALS = {
	1: 'प्रथम',
	2: 'द्वितीय',
	3: 'तृतीय',
	4: 'चतुर्थ',
	5: 'पञ्चम',
	6: 'षष्ठ',
	7: 'सप्तम',
	8: 'अष्टम',
	9: 'नवम',
	10: 'दशम',
	11: 'एकादश',
	12: 'द्वादश',
	13: 'त्रयोदश',
	14: 'चतुर्दश',
	15: 'पञ्चदश',
	16: 'षोडश',
	17: 'सप्तदश',
	18: 'अष्टादश',
	19: 'नवदश',
	20: 'विंश',
	21: 'एकविंश',
	22: 'द्वाविंश',
	23: 'त्रयोविंश',
	24: 'चतुर्विंश',
	25: 'पञ्चविंश',
	26: 'षड्विंश',
	27: 'सप्तविंश',
	28: 'अष्टाविंश',
	29: 'नवविंश',
	30: 'त्रिंश',
	31: 'एकत्रिंश',
	32: 'द्वात्रिंश',
	33: 'त्रयस्त्रिंश',
	34: 'चतुस्त्रिंश',
	35: 'पञ्चत्रिंश',
	36: 'षट्त्रिंश',
	37: 'सप्तत्रिंश',
	38: 'अष्टात्रिंश',
	39: 'एकोणचत्वारिंश',
	40: 'चत्वारिंश',
};

/**
 * @param {string} value
 */
function yamlQuote(value) {
	return `'${value.replace(/'/g, "''")}'`;
}

/**
 * @param {number} chapter
 */
function chapterIndexFileName(chapter) {
	return `chapter-${String(chapter).padStart(2, '0')}-index.md`;
}

/**
 * @param {string} text
 */
function cleanForTransliteration(text) {
	return text.replace(/[\uE000-\uF8FF\uFFFC]/g, '').replace(/ꣳ/g, 'ृ');
}

/**
 * @param {number} count
 * @param {'root' | 'iast'} locale
 */
function formatCountLabel(count, locale) {
	if (locale === 'iast') {
		return count === 1 ? '1 mantra' : `${count} mantras`;
	}
	return formatMantraCountLabel(count);
}

/**
 * @param {number} chapter
 * @param {'root' | 'iast'} locale
 */
function getChapterTitle(chapter, locale) {
	if (chapter === 40) {
		return locale === 'iast'
			? 'Īśā Upaniṣad — Vājasaneyi Saṃhitā (Mādhyandina)'
			: 'ईशावास्योपनिषद् — वाजसनेयी संहिता (माध्यन्दिन)';
	}

	const ordinal = CHAPTER_ORDINALS[chapter];
	if (locale === 'iast') {
		return `Vājasaneyi Saṃhitā (Mādhyandina) — Chapter ${chapter}`;
	}
	return `वाजसनेयी संहिता (माध्यन्दिन) — ${ordinal}ोऽध्यायः`;
}

/**
 * @param {number} chapter
 * @param {'root' | 'iast'} locale
 */
function getChapterDescription(chapter, locale) {
	if (chapter === 40) {
		return locale === 'iast'
			? 'Īśāvāsya Upaniṣad — Vājasaneyi Saṃhitā (Mādhyandina), Chapter 40'
			: 'ईशावास्योपनिषद् — वाजसनेयी संहिता (माध्यन्दिन) चत्वारिंशोऽध्यायः';
	}

	const ordinal = CHAPTER_ORDINALS[chapter];
	if (locale === 'iast') {
		return `Śukla Yajur Veda — Vājasaneyi Saṃhitā (Mādhyandina), Chapter ${chapter}`;
	}
	return `शुक्ल यजुर्वेद — वाजसनेयी संहिता (माध्यन्दिन), ${ordinal}ोऽध्यायः`;
}

/**
 * @param {'root' | 'iast'} locale
 */
function getMantrasSectionTitle(locale) {
	return locale === 'iast' ? '## Mantras' : '## मन्त्राः';
}

/**
 * @param {'root' | 'iast'} locale
 */
function getChapterTocHeader(locale) {
	return locale === 'iast' ? '| Mantra | First Words |' : '| मन्त्र | प्रथम पद |';
}

/**
 * @param {'root' | 'iast'} locale
 */
function getIndexChapterTocHeader(locale) {
	return locale === 'iast'
		? '| Adhyāya | Mantra | First Words |'
		: '| अध्याय | मन्त्र | प्रथम पद |';
}

/**
 * @param {string} verseText
 * @param {'root' | 'iast'} locale
 */
function firstWordsLabel(verseText, locale) {
	const sourceText = locale === 'iast' ? cleanForTransliteration(verseText) : verseText;
	const words = extractFirstTwoWords(sourceText);
	return locale === 'iast' ? transliterateLine(words).replace(/\|/g, ' ') : words;
}

/**
 * First-words label for index tables. IAST index keeps Devanagari snippets here;
 * full transliteration lives on chapter pages.
 * @param {string} verseText
 * @param {'root' | 'iast'} locale
 */
function indexFirstWordsLabel(verseText, locale) {
	const sourceText = locale === 'iast' ? cleanForTransliteration(verseText) : verseText;
	return extractFirstTwoWords(sourceText);
}

/**
 * @param {object} options
 */
function renderChapterMarkdown({
	locale,
	chapterNumber,
	title,
	slug,
	sidebarLabel,
	description,
	outputPath,
	parsed,
}) {
	const body = renderSamhitaChapterMdx({
		component: 'madhyandina',
		chapterNumber,
		locale,
		title: `${title} (${formatCountLabel(parsed.verseCount, locale)})`,
		slug,
		sidebarLabel,
		description,
		outputPath,
	});

	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, body, 'utf8');
	return parsed.verseCount;
}

/**
 * @param {object} options
 */
function renderIndexMarkdown({ locale, slug, title, description, outputPath, chapters }) {
	const intro =
		locale === 'iast'
			? 'Vājasaneyi Saṃhitā (Mādhyandina) — forty chapters. Select a chapter for the mantra index.'
			: 'वाजसनेयी संहिता (माध्यन्दिन) — चत्वारिंशत् अध्यायाः। मन्त्र सूची द्रष्टुं अध्यायं चिनुत।';

	const overviewHeader =
		locale === 'iast'
			? '| Adhyāya | Mantrāḥ | Sūcī |'
			: '| अध्याय | मन्त्राः | सूची |';

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(locale === 'iast' ? 'Vājasaneyi saṃhitā (Mādhyandina)' : 'वाजसनेयी संहिता (माध्यन्दिन)')}`,
		`  order: 2`,
		'tableOfContents: false',
		`description: ${yamlQuote(description)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	const overviewRows = chapters
		.map((chapter) => {
			const fileName = chapterFileName(chapter.number);
			const indexFile = `chapter-${String(chapter.number).padStart(2, '0')}-index`;
			if (!chapter.parsed) {
				const missingLabel = locale === 'iast' ? '— (missing)' : '— (अनुपलब्ध)';
				return `| ${chapter.number} | ${missingLabel} | ${missingLabel} |`;
			}
			const mantraLabel = String(chapter.parsed.verseCount);
			const indexLabel = locale === 'iast' ? 'Mantra sūcī' : 'मन्त्र सूची';
			return `| [${chapter.number}](${fileName}/) | ${mantraLabel} | [${indexLabel}](${indexFile}/) |`;
		})
		.join('\n');

	const body = [
		frontmatter,
		'',
		`# ${title}`,
		'',
		intro,
		'',
		locale === 'iast' ? '## Adhyāyāḥ' : '## अध्यायाः',
		'',
		overviewHeader,
		locale === 'iast' ? '|--------:|--------:|:-----|' : '|--------:|--------:|:----|',
		overviewRows,
		'',
	].join('\n');

	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, body, 'utf8');

	for (const chapter of chapters.filter((entry) => entry.parsed)) {
		const indexFile = `chapter-${String(chapter.number).padStart(2, '0')}-index.md`;
		const indexPath = path.join(path.dirname(outputPath), indexFile);
		const sectionTitle =
			locale === 'iast' ? `Adhyāya ${chapter.number}` : `अध्याय ${chapter.number}`;
		const fileName = chapterFileName(chapter.number);
		const mantraRows = chapter.parsed.verses
			.map((verse) => {
				const firstWords = indexFirstWordsLabel(verse.text, locale);
				return `| ${chapter.number} | ${verse.number} | [${firstWords}](${fileName.replace(/\.mdx$/, '')}/#mantra-${verse.number}) |`;
			})
			.join('\n');
		const slugPrefix = locale === 'iast' ? 'iast/madhyandina-samhita' : 'madhyandina-samhita';
		const indexFrontmatter = [
			'---',
			`title: ${yamlQuote(locale === 'iast' ? `Adhyāya ${chapter.number} — Mantra sūcī` : `अध्याय ${chapter.number} — मन्त्र सूची`)}`,
			`slug: ${slugPrefix}/chapter-${chapter.number}-index`,
			'sidebar:',
			'  hidden: true',
			'tableOfContents: false',
			`description: ${yamlQuote(locale === 'iast' ? `Madhyandina saṃhitā — adhyāya ${chapter.number} mantra sūcī.` : `माध्यन्दिन संहिता — अध्याय ${chapter.number} मन्त्र सूची।`)}`,
			`lastUpdated: ${LAST_UPDATED}`,
			'---',
		].join('\n');
		const indexBody = [
			indexFrontmatter,
			'',
			`## ${sectionTitle} {#chapter-${chapter.number}}`,
			'',
			getIndexChapterTocHeader(locale),
			`|--------:|-------:|-------------|`,
			mantraRows,
			'',
		].join('\n');
		fs.writeFileSync(indexPath, indexBody, 'utf8');
	}
}

/**
 * @param {unknown[]} chapters
 */
function ensureFallbackChaptersInJson(chapters) {
	let updated = [...chapters];
	let changed = false;

	for (const [chapterNumber, fallbackFile] of CHAPTER_FALLBACK_FILES) {
		if (updated.some((entry) => (entry.adhyaya ?? entry.chapter) === chapterNumber)) {
			continue;
		}

		if (!fs.existsSync(fallbackFile)) {
			throw new Error(`Missing chapter ${chapterNumber} source text: ${fallbackFile}`);
		}

		const chapterText = fs.readFileSync(fallbackFile, 'utf8');
		updated.push({
			veda: 'yajurveda',
			samhita: 'vajasneyi-madhyandina-samhita',
			adhyaya: chapterNumber,
			text: chapterText.trim(),
		});
		changed = true;
		console.log(`Added chapter ${chapterNumber} to ${DATA_FILE}`);
	}

	if (!changed) {
		return chapters;
	}

	updated.sort((a, b) => (a.adhyaya ?? a.chapter) - (b.adhyaya ?? b.chapter));
	fs.writeFileSync(DATA_FILE, `${JSON.stringify(updated, null, 4)}\n`, 'utf8');
	return updated;
}

/** @type {unknown[]} */
let chapters = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
chapters = ensureFallbackChaptersInJson(chapters);

/** @type {Map<number, { text: string }>} */
const chapterMap = new Map(
	chapters.map((entry) => [entry.adhyaya ?? entry.chapter, entry])
);

/** @type {{ number: number; parsed: ReturnType<typeof parseYajurvedaChapter> | null; firstWordsRoot?: string; firstWordsIast?: string }[]} */
const chapterSummaries = [];
const missingChapters = [];

/**
 * @param {number} chapterNumber
 */
function loadParsedChapter(chapterNumber) {
	const entry = chapterMap.get(chapterNumber);
	if (!entry) return null;
	const expected = expectedMantraCount(chapterNumber);
	return parseYajurvedaChapter(entry.text, { expectedVerses: expected });
}

if (isIastWorker) {
	const chapterNumber = Number.parseInt(process.env.MADHYANDINA_IAST_CHAPTER ?? '', 10);
	const parsed = loadParsedChapter(chapterNumber);
	if (!parsed) {
		throw new Error(`Missing chapter ${chapterNumber} for IAST generation`);
	}

	const firstWordsIast = firstWordsLabel(parsed.verses[0]?.text ?? '', 'iast');
	const outputPath = path.join(IAST_CHAPTERS_DIR, chapterFileName(chapterNumber));
	const count = renderChapterMarkdown({
		locale: 'iast',
		chapterNumber,
		title: getChapterTitle(chapterNumber, 'iast'),
		slug: `iast/madhyandina-samhita/chapter-${String(chapterNumber).padStart(2, '0')}`,
		sidebarLabel: getAdhyayaSidebarLabel(chapterNumber, 'iast'),
		description: getChapterDescription(chapterNumber, 'iast'),
		outputPath,
		parsed,
	});
	console.log(`Wrote ${outputPath} (${count} mantras, iast)`);
	process.exit(0);
}

if (process.env.MADHYANDINA_ROOT_CHAPTER) {
	const chapterNumber = Number.parseInt(process.env.MADHYANDINA_ROOT_CHAPTER ?? '', 10);
	const parsed = loadParsedChapter(chapterNumber);
	if (!parsed) {
		throw new Error(`Missing chapter ${chapterNumber} for root generation`);
	}

	const firstWordsRoot = firstWordsLabel(parsed.verses[0]?.text ?? '', 'root');
	const outputPath = path.join(ROOT_CHAPTERS_DIR, chapterFileName(chapterNumber));
	const count = renderChapterMarkdown({
		locale: 'root',
		chapterNumber,
		title: getChapterTitle(chapterNumber, 'root'),
		slug: `madhyandina-samhita/chapter-${String(chapterNumber).padStart(2, '0')}`,
		sidebarLabel: getAdhyayaSidebarLabel(chapterNumber, 'root'),
		description: getChapterDescription(chapterNumber, 'root'),
		outputPath,
		parsed,
	});
	console.log(`Wrote ${outputPath} (${count} mantras, root)`);
	process.exit(0);
}

const indexOnly = Boolean(process.env.MADHYANDINA_INDEX_ONLY);
const iastOnly = Boolean(process.env.MADHYANDINA_IAST_ONLY);
const skipIast = Boolean(process.env.MADHYANDINA_SKIP_IAST);

for (let chapterNumber = 1; chapterNumber <= TOTAL_CHAPTERS; chapterNumber++) {
	const parsed = loadParsedChapter(chapterNumber);
	if (!parsed) {
		missingChapters.push(chapterNumber);
		chapterSummaries.push({ number: chapterNumber, parsed: null });
		continue;
	}

	const expected = expectedMantraCount(chapterNumber);
	if (parsed.verseCount !== expected) {
		console.warn(
			`Chapter ${chapterNumber}: expected ${expected} mantras, parsed ${parsed.verseCount}`
		);
	}

	const firstWordsRoot = firstWordsLabel(parsed.verses[0]?.text ?? '', 'root');
	chapterSummaries.push({ number: chapterNumber, parsed, firstWordsRoot });
}

if (!indexOnly && !iastOnly) {
	for (let chapterNumber = 1; chapterNumber <= TOTAL_CHAPTERS; chapterNumber++) {
		const summary = chapterSummaries.find((chapter) => chapter.number === chapterNumber);
		if (!summary?.parsed) continue;

		const outputPath = path.join(ROOT_CHAPTERS_DIR, chapterFileName(chapterNumber));
		const count = renderChapterMarkdown({
			locale: 'root',
			chapterNumber,
			title: getChapterTitle(chapterNumber, 'root'),
			slug: `madhyandina-samhita/chapter-${String(chapterNumber).padStart(2, '0')}`,
			sidebarLabel: getAdhyayaSidebarLabel(chapterNumber, 'root'),
			description: getChapterDescription(chapterNumber, 'root'),
			outputPath,
			parsed: summary.parsed,
		});
		console.log(`Wrote ${outputPath} (${count} mantras, root)`);
	}
}

if (!indexOnly && !skipIast) {
	for (let chapterNumber = 1; chapterNumber <= TOTAL_CHAPTERS; chapterNumber++) {
		if (!chapterMap.has(chapterNumber)) continue;

		const result = spawnSync(process.execPath, [GENERATOR_SCRIPT], {
			encoding: 'utf8',
			env: { ...process.env, MADHYANDINA_IAST_CHAPTER: String(chapterNumber) },
		});

		if (result.status !== 0) {
			throw new Error(
				result.stderr || result.stdout || `IAST generation failed for chapter ${chapterNumber}`
			);
		}

		process.stdout.write(result.stdout);

		const summary = chapterSummaries.find((chapter) => chapter.number === chapterNumber);
		if (summary?.parsed) {
			const opening = extractFirstTwoWords(
				cleanForTransliteration(summary.parsed.verses[0]?.text ?? '')
			);
			summary.firstWordsIast = transliterateDevanagari(opening).replace(/\|/g, ' ');
		}
	}
}

for (const locale of ['root', 'iast']) {
	const isIast = locale === 'iast';
	renderIndexMarkdown({
		locale,
		slug: isIast ? 'iast/madhyandina-samhita' : 'madhyandina-samhita',
		title: isIast
			? 'Śuklayajuḥ Vājasaneyi Saṃhitā (Mādhyandina) — Sūcī'
			: 'वाजसनेयी संहिता (शुक्ल यजुः — माध्यन्दिन) — सूची',
		description: isIast
			? 'Vājasaneyi saṃhitā (Mādhyandina) — index of forty chapters, Śukla Yajur Veda.'
			: 'वाजसनेयी संहिता (शुक्ल यजुः — माध्यन्दिन) — चत्वारिंशत् अध्यायानां सूची।',
		outputPath: path.join(isIast ? IAST_CHAPTERS_DIR : ROOT_CHAPTERS_DIR, 'index.md'),
		chapters: chapterSummaries,
	});
	console.log(
		`Wrote ${path.join(isIast ? IAST_CHAPTERS_DIR : ROOT_CHAPTERS_DIR, 'index.md')} (${locale} index)`
	);
}

if (missingChapters.length) {
	console.warn(`Missing chapters (no markdown generated): ${missingChapters.join(', ')}`);
}
