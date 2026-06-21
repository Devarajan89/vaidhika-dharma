import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import * as inditrans from '@vm75/inditrans';
import {
	appendAnuvakaMarker,
	extractFirstTwoWords,
	formatAnuvakaCountLabel,
	parseTaittiriyaPrapathaka,
} from './lib/parse-taittiriya-prapathaka.mjs';
import {
	TAITTIRIYA_KANDAS,
	TAITTIRIYA_TOTAL_PRAPATHAKAS,
	chapterToKandaPrapathaka,
} from './lib/taittiriya-samhita-structure.mjs';
import { transliterateDevanagari } from './lib/transliterate-devanagari.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(
	ROOT,
	'src/data/krishna-yajur/taittiriya/taittiriya_samhita_prapathakas.json'
);
const DOCS_ROOT = path.join(ROOT, 'src/content/docs');
const ROOT_CHAPTERS_DIR = path.join(
	DOCS_ROOT,
	'samhitas/krishna-yajur/taittiriya-samhita'
);
const IAST_CHAPTERS_DIR = path.join(
	DOCS_ROOT,
	'iast/samhitas/krishna-yajur/taittiriya-samhita'
);
const LAST_UPDATED = new Date().toISOString().slice(0, 10);
const GENERATOR_SCRIPT = fileURLToPath(import.meta.url);
const isIastWorker = Boolean(process.env.TAITTIRIYA_IAST_CHAPTER);

if (isIastWorker) {
	await inditrans.init();
}

const HAS_DEVANAGARI = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]/;

/** @type {Map<string, string>} */
const transliterationCache = new Map();

const KANDA_IAST = {
	1: 'Prathama kāṇḍa',
	2: 'Dvitīya kāṇḍa',
	3: 'Tṛtīya kāṇḍa',
	4: 'Caturtha kāṇḍa',
	5: 'Pañcama kāṇḍa',
	6: 'Ṣaṣṭha kāṇḍa',
	7: 'Saptama kāṇḍa',
};

/**
 * @param {string} line
 */
function transliterateLine(line) {
	if (!HAS_DEVANAGARI.test(line)) return line;

	const cached = transliterationCache.get(line);
	if (cached !== undefined) return cached;

	const cleaned = cleanForTransliteration(line);
	try {
		const result = inditrans
			.transliterate(cleaned, inditrans.Script.devanagari, inditrans.Script.iast)
			.replace(/।/g, '.')
			.replace(/॥/g, '..');
		transliterationCache.set(line, result);
		return result;
	} catch {
		const fallback = transliterateDevanagari(cleaned)
			.replace(/।/g, '.')
			.replace(/॥/g, '..');
		transliterationCache.set(line, fallback);
		return fallback;
	}
}

/**
 * @param {string} value
 */
function yamlQuote(value) {
	return `'${value.replace(/'/g, "''")}'`;
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
		return count === 1 ? '1 anuvāka' : `${count} anuvākāḥ`;
	}
	return formatAnuvakaCountLabel(count);
}

/**
 * @param {number} chapterNumber
 * @param {'root' | 'iast'} locale
 */
function getChapterTitle(chapterNumber, locale) {
	const { kanda, prapathaka } = chapterToKandaPrapathaka(chapterNumber);
	if (locale === 'iast') {
		return `Kṛṣṇayajuḥ Taittirīyasaṃhitā — ${KANDA_IAST[kanda]}, prapāṭhaka ${prapathaka}`;
	}
	const kandaInfo = TAITTIRIYA_KANDAS.find((entry) => entry.kanda === kanda);
	return `कृष्णयजुः तैत्तिरीयसंहिता — ${kandaInfo?.rootLabel ?? ''}, प्रपाठक ${prapathaka}`;
}

/**
 * @param {number} chapterNumber
 * @param {'root' | 'iast'} locale
 */
function getChapterDescription(chapterNumber, locale) {
	const { kanda, prapathaka } = chapterToKandaPrapathaka(chapterNumber);
	if (locale === 'iast') {
		return `Kṛṣṇa Yajur Veda — Taittirīya Saṃhitā, kāṇḍa ${kanda}, prapāṭhaka ${prapathaka} (chapter ${chapterNumber})`;
	}
	return `कृष्ण यजुर्वेद — तैत्तिरीय संहिता, काण्ड ${kanda}, प्रपाठक ${prapathaka} (अध्याय ${chapterNumber})`;
}

/**
 * @param {'root' | 'iast'} locale
 */
function getAnuvakaSectionTitle(locale) {
	return locale === 'iast' ? '## Anuvākāḥ' : '## अनुवाकाः';
}

/**
 * @param {'root' | 'iast'} locale
 */
function getChapterTocHeader(locale) {
	return locale === 'iast' ? '| Anuvāka | First Words |' : '| अनुवाक | प्रथम पद |';
}

/**
 * @param {'root' | 'iast'} locale
 */
function getIndexChapterTocHeader(locale) {
	return locale === 'iast'
		? '| Prapāṭhaka | Anuvāka | First Words |'
		: '| प्रपाठक | अनुवाक | प्रथम पद |';
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
function renderIndexMarkdown({ locale, slug, title, description, outputPath, chapters }) {
	const isIast = locale === 'iast';
	const intro = isIast
		? 'Taittirīyasaṃhitāyāḥ sapta kāṇḍāni, catvāriṃśat prapāṭhakāḥ. Anuvāka sūcīṃ draṣṭum prapāṭhakaṃ cinut.'
		: 'तैत्तिरीयसंहितायाः सप्त काण्डानि, चत्वारिंशत् प्रपाठकाः। अनुवाक सूची द्रष्टुं प्रपाठकं चिनुत।';

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(isIast ? 'Taittirīya saṃhitā' : 'तैत्तिरीय संहिता')}`,
		`  order: 1`,
		'tableOfContents: false',
		`description: ${yamlQuote(description)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	const sections = TAITTIRIYA_KANDAS.map((kandaInfo) => {
		const kandaChapters = chapters.filter((chapter) => chapter.kanda === kandaInfo.kanda);
		const kandaTitle = isIast ? kandaInfo.iastLabel : kandaInfo.rootLabel;
		const kandaLink = `kanda-${kandaInfo.kanda}`;
		const overviewHeader = isIast
			? '| Prapāṭhaka | Anuvākāḥ | Read |'
			: '| प्रपाठक | अनुवाकाः | पाठ |';
		const overviewRows = kandaChapters
			.map((chapter) => {
				const prapathakaPath = `${kandaLink}/prapathaka-${chapter.prapathaka}`;
				if (!chapter.parsed) {
					const missingLabel = isIast ? '— (missing)' : '— (अनुपलब्ध)';
					return `| ${chapter.prapathaka} | ${missingLabel} | ${missingLabel} |`;
				}
				const anuvakaLabel = String(chapter.parsed.verseCount);
				const readLabel = isIast ? 'Read' : 'पाठ';
				return `| ${chapter.prapathaka} | ${anuvakaLabel} | [${readLabel}](${prapathakaPath}/) |`;
			})
			.join('\n');

		return [
			`## ${kandaTitle} {#kanda-${kandaInfo.kanda}}`,
			'',
			isIast
				? `[${kandaTitle} — full text](${kandaLink}/)`
				: `[${kandaTitle} — संपूर्ण पाठ](${kandaLink}/)`,
			'',
			overviewHeader,
			isIast ? '|--------:|--------:|:-----|' : '|--------:|--------:|:----|',
			overviewRows,
			'',
		].join('\n');
	});

	const body = [frontmatter, '', `# ${title}`, '', intro, '', ...sections].join('\n');

	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, body, 'utf8');
}

/** @type {unknown[]} */
const chapters = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

/** @type {Map<number, object>} */
const chapterMap = new Map(chapters.map((entry) => [entry.chapter, entry]));

/** @type {{ number: number; kanda: number; prapathaka: number; parsed: ReturnType<typeof parseTaittiriyaPrapathaka> | null; firstWordsRoot?: string; firstWordsIast?: string }[]} */
const chapterSummaries = [];
const missingChapters = [];

/**
 * @param {number} chapterNumber
 */
function loadParsedChapter(chapterNumber) {
	const entry = chapterMap.get(chapterNumber);
	if (!entry) return null;
	return parseTaittiriyaPrapathaka(entry.text, {
		kanda: entry.kanda,
		prapathaka: entry.prapathaka,
	});
}

const indexOnly = Boolean(process.env.TAITTIRIYA_INDEX_ONLY);
const iastOnly = Boolean(process.env.TAITTIRIYA_IAST_ONLY);
const skipIast = Boolean(process.env.TAITTIRIYA_SKIP_IAST);

for (let chapterNumber = 1; chapterNumber <= TAITTIRIYA_TOTAL_PRAPATHAKAS; chapterNumber++) {
	const entry = chapterMap.get(chapterNumber);
	const parsed = loadParsedChapter(chapterNumber);
	if (!parsed || !entry) {
		missingChapters.push(chapterNumber);
		chapterSummaries.push({
			number: chapterNumber,
			kanda: entry?.kanda ?? chapterToKandaPrapathaka(chapterNumber).kanda,
			prapathaka: entry?.prapathaka ?? chapterToKandaPrapathaka(chapterNumber).prapathaka,
			parsed: null,
		});
		continue;
	}

	const firstWordsRoot = firstWordsLabel(parsed.verses[0]?.text ?? '', 'root');
	chapterSummaries.push({
		number: chapterNumber,
		kanda: entry.kanda,
		prapathaka: entry.prapathaka,
		parsed,
		firstWordsRoot,
	});
	console.log(`Parsed chapter ${chapterNumber}: ${parsed.verseCount} anuvakas`);
}

if (!indexOnly && !iastOnly) {
	console.log('Skipping flat chapter pages — run generate-taittiriya-kanda-indexes.mjs for kāṇḍa/prapāṭhaka pages.');
}

if (!indexOnly && !skipIast) {
	console.log('Skipping IAST flat chapter pages — kanda index generator writes both locales.');
}

for (const locale of ['root', 'iast']) {
	const isIast = locale === 'iast';
	renderIndexMarkdown({
		locale,
		slug: isIast ? 'iast/taittiriya-samhita' : 'taittiriya-samhita',
		title: isIast
			? 'Kṛṣṇayajuḥ Taittirīyasaṃhitā — Sūcī'
			: 'कृष्णयजुः तैत्तिरीयसंहिता — सूची',
		description: isIast
			? 'Kṛṣṇayajuḥ taittirīyasaṃhitāyāḥ sapta kāṇḍānāṃ sūcī.'
			: 'कृष्णयजुः तैत्तिरीयसंहितायाः सप्त काण्डानां सूची।',
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
