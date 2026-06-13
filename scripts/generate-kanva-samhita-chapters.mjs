import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as inditrans from '@vm75/inditrans';
import {
	extractFirstTwoWords,
	formatMantraCountLabel,
	parseYajurvedaChapter,
} from './lib/parse-yajurveda-chapter.mjs';
import { transliterateDevanagari } from './lib/transliterate-devanagari.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'src/data/shukla-yajur/kanva/vajasneyi_kanva_samhita_chapters.json');
const CHAPTER_01_FILE = path.join(ROOT, 'src/data/shukla-yajur/kanva/chapter_01_text.txt');
const DOCS_ROOT = path.join(ROOT, 'src/content/docs');
const ROOT_CHAPTERS_DIR = path.join(DOCS_ROOT, 'samhitas/shukla-yajur/kanva-samhita');
const IAST_CHAPTERS_DIR = path.join(DOCS_ROOT, 'iast/samhitas/shukla-yajur/kanva-samhita');
const LAST_UPDATED = new Date().toISOString().slice(0, 10);
const TOTAL_CHAPTERS = 40;

await inditrans.init();

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
function chapterFileName(chapter) {
	return `chapter-${String(chapter).padStart(2, '0')}.md`;
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
			? 'Īśā Upaniṣad — Vājasaneyi Kanva Saṃhitā'
			: 'ईशावास्योपनिषद् — शुक्लयजुः काण्वसंहिता';
	}

	const ordinal = CHAPTER_ORDINALS[chapter];
	if (locale === 'iast') {
		return `Vājasaneyi Kanva Saṃhitā — Chapter ${chapter}`;
	}
	return `शुक्लयजुः काण्वसंहिता — ${ordinal}ोऽध्यायः`;
}

/**
 * @param {number} chapter
 * @param {'root' | 'iast'} locale
 */
function getChapterDescription(chapter, locale) {
	if (chapter === 40) {
		return locale === 'iast'
			? 'Īśāvāsya Upaniṣad — Śukla Yajur Veda, Chapter 40'
			: 'ईशावास्योपनिषद् — शुक्लयजुः काण्वसंहिता चत्वारिंशोऽध्यायः';
	}

	const ordinal = CHAPTER_ORDINALS[chapter];
	if (locale === 'iast') {
		return `Śukla Yajur Veda — Vājasaneyi Kanva Saṃhitā, Chapter ${chapter}`;
	}
	return `शुक्लयजुः काण्वसंहिता — ${ordinal}ोऽध्यायः`;
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
	const mantraLabel = formatCountLabel(parsed.verseCount, locale);
	const fileName = path.basename(outputPath);
	const tocRows = parsed.verses
		.map((verse) => {
			const firstWords = firstWordsLabel(verse.text, locale);
			return `| ${verse.number} | [${firstWords}](${fileName}#mantra-${verse.number}) |`;
		})
		.join('\n');

	const verseBlocks = parsed.verses
		.map((verse) => {
			const text =
				locale === 'iast'
					? transliterateLine(cleanForTransliteration(verse.text)).trim()
					: verse.text;
			return [
				`## Mantra ${verse.number} {#mantra-${verse.number}}`,
				'',
				`**Chapter:** ${chapterNumber} | **Mantra:** ${verse.number}`,
				'',
				text,
				'',
				'---',
				'',
			].join('\n');
		})
		.join('\n');

	const headerBlock = parsed.header
		? `**${(locale === 'iast' ? transliterateLine(parsed.header) : parsed.header).replace(/\n/g, ' ')}**`
		: '';

	const frontmatter = [
		'---',
		`title: ${yamlQuote(`${title} (${mantraLabel})`)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(sidebarLabel)}`,
		`  order: ${chapterNumber}`,
		'tableOfContents:',
		'  minHeadingLevel: 2',
		'  maxHeadingLevel: 2',
		`description: ${yamlQuote(description)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	const body = [
		frontmatter,
		'',
		`# ${title}`,
		'',
		headerBlock,
		headerBlock ? '' : null,
		'---',
		'',
		'## Mantras',
		'',
		'| Mantra | First Words |',
		'|-------:|-------------|',
		tocRows,
		'',
		'---',
		'',
		verseBlocks.trimEnd(),
		'',
	]
		.filter((line) => line !== null)
		.join('\n');

	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, body, 'utf8');
	return parsed.verseCount;
}

/**
 * @param {object} options
 */
function renderIndexMarkdown({ locale, slug, title, description, outputPath, chapters }) {
	const overviewRows = chapters
		.map((chapter) => {
			const fileName = chapterFileName(chapter.number);
			if (!chapter.parsed) {
				const missingLabel = locale === 'iast' ? '— (missing)' : '— (अनुपलब्ध)';
				return `| ${chapter.number} | ${missingLabel} | ${missingLabel} |`;
			}
			const firstWords = firstWordsLabel(chapter.parsed.verses[0]?.text ?? '', locale);
			const mantraLabel = String(chapter.parsed.verseCount);
			return `| [${chapter.number}](#chapter-${chapter.number}) | ${mantraLabel} | [${firstWords}](${fileName}#mantra-1) |`;
		})
		.join('\n');

	const chapterSections = chapters
		.filter((chapter) => chapter.parsed)
		.map((chapter) => {
			const fileName = chapterFileName(chapter.number);
			const sectionTitle =
				locale === 'iast'
					? `Chapter ${chapter.number}`
					: `अध्याय ${chapter.number}`;
			const mantraRows = chapter.parsed.verses
				.map((verse) => {
					const firstWords = firstWordsLabel(verse.text, locale);
					return `| ${chapter.number} | ${verse.number} | [${firstWords}](${fileName}#mantra-${verse.number}) |`;
				})
				.join('\n');

			return [
				`## ${sectionTitle} {#chapter-${chapter.number}}`,
				'',
				`| Chapter | Mantra | First Words |`,
				`|--------:|-------:|-------------|`,
				mantraRows,
				'',
			].join('\n');
		})
		.join('\n');

	const intro =
		locale === 'iast'
			? 'Complete index of the Vājasaneyi Kanva Saṃhitā (Śukla Yajur Veda) across 40 chapters.'
			: 'शुक्लयजुः काण्वसंहितायाः चत्वारिंशत् अध्यायानां सूची।';

	const overviewHeader =
		locale === 'iast'
			? '| Chapter | Mantras | Opening Mantra |'
			: '| अध्याय | मन्त्राः | प्रथम मन्त्र |';

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(locale === 'iast' ? 'Kanva Saṃhitā' : 'काण्व संहिता')}`,
		`  order: 1`,
		'tableOfContents:',
		'  minHeadingLevel: 2',
		'  maxHeadingLevel: 2',
		`description: ${yamlQuote(description)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	const body = [
		frontmatter,
		'',
		`# ${title}`,
		'',
		intro,
		'',
		locale === 'iast' ? '## Chapters' : '## अध्यायाः',
		'',
		overviewHeader,
		'|--------:|--------:|----------------|',
		overviewRows,
		'',
		chapterSections.trimEnd(),
		'',
	].join('\n');

	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, body, 'utf8');
}

/**
 * @param {unknown[]} chapters
 */
function ensureChapterOneInJson(chapters) {
	if (chapters.some((entry) => entry.chapter === 1)) {
		return chapters;
	}

	if (!fs.existsSync(CHAPTER_01_FILE)) {
		throw new Error(`Missing chapter 1 source text: ${CHAPTER_01_FILE}`);
	}

	const chapter01Text = fs.readFileSync(CHAPTER_01_FILE, 'utf8');
	const chapter01Entry = {
		veda: 'yajurveda',
		samhita: 'vajasneyi-kanva-samhita',
		chapter: 1,
		text: chapter01Text.trim(),
	};

	const updated = [chapter01Entry, ...chapters].sort((a, b) => a.chapter - b.chapter);
	fs.writeFileSync(DATA_FILE, `${JSON.stringify(updated, null, 4)}\n`, 'utf8');
	console.log(`Added chapter 1 to ${DATA_FILE}`);
	return updated;
}

/** @type {unknown[]} */
let chapters = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
chapters = ensureChapterOneInJson(chapters);

/** @type {Map<number, { text: string }>} */
const chapterMap = new Map(chapters.map((entry) => [entry.chapter, entry]));

/** @type {{ number: number; parsed: ReturnType<typeof parseYajurvedaChapter> | null; firstWordsRoot?: string; firstWordsIast?: string }[]} */
const chapterSummaries = [];
const missingChapters = [];

for (let chapterNumber = 1; chapterNumber <= TOTAL_CHAPTERS; chapterNumber++) {
	const entry = chapterMap.get(chapterNumber);
	if (!entry) {
		missingChapters.push(chapterNumber);
		chapterSummaries.push({ number: chapterNumber, parsed: null });
		continue;
	}

	const parseOptions = chapterNumber === 40 ? { expectedVerses: 18 } : {};
	const parsed = parseYajurvedaChapter(entry.text, parseOptions);
	const firstWordsRoot = firstWordsLabel(parsed.verses[0]?.text ?? '', 'root');
	const firstWordsIast = firstWordsLabel(parsed.verses[0]?.text ?? '', 'iast');
	chapterSummaries.push({ number: chapterNumber, parsed, firstWordsRoot, firstWordsIast });

	const sidebarLabelRoot = `${chapterNumber} ${firstWordsRoot}`;
	const sidebarLabelIast = `${chapterNumber} ${firstWordsIast}`;

	for (const locale of ['root', 'iast']) {
		const isIast = locale === 'iast';
		const chapterSlug = isIast
			? `iast/kanva-samhita/chapter-${String(chapterNumber).padStart(2, '0')}`
			: `kanva-samhita/chapter-${String(chapterNumber).padStart(2, '0')}`;
		const outputPath = path.join(
			isIast ? IAST_CHAPTERS_DIR : ROOT_CHAPTERS_DIR,
			chapterFileName(chapterNumber)
		);
		const count = renderChapterMarkdown({
			locale,
			chapterNumber,
			title: getChapterTitle(chapterNumber, locale),
			slug: chapterSlug,
			sidebarLabel: isIast ? sidebarLabelIast : sidebarLabelRoot,
			description: getChapterDescription(chapterNumber, locale),
			outputPath,
			parsed,
		});
		console.log(`Wrote ${outputPath} (${count} mantras, ${locale})`);
	}
}

for (const locale of ['root', 'iast']) {
	const isIast = locale === 'iast';
	renderIndexMarkdown({
		locale,
		slug: isIast ? 'iast/kanva-samhita' : 'kanva-samhita',
		title: isIast
			? 'Vājasaneyi Kanva Saṃhitā — Index'
			: 'शुक्लयजुः काण्वसंहिता — सूची',
		description: isIast
			? 'Complete index of the Vājasaneyi Kanva Saṃhitā (40 chapters).'
			: 'शुक्लयजुः काण्वसंहितायाः चत्वारिंशत् अध्यायानां सूची।',
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
