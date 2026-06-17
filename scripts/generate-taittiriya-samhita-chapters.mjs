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
	chapterFileName,
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
function renderChapterMarkdown({
	locale,
	chapterNumber,
	title,
	slug,
	sidebarLabel,
	description,
	outputPath,
	parsed,
	kanda,
	prapathaka,
}) {
	const anuvakaLabel = formatCountLabel(parsed.verseCount, locale);
	const fileName = path.basename(outputPath);
	const tocRows = parsed.verses
		.map((verse) => {
			const firstWords = firstWordsLabel(verse.text, locale);
			return `| ${verse.number} | [${firstWords}](${fileName}#anuvaka-${verse.number}) |`;
		})
		.join('\n');

	const verseBlocks = parsed.verses
		.map((verse) => {
			const text =
				locale === 'iast'
					? transliterateLine(cleanForTransliteration(verse.text)).trim()
					: verse.text;
			const markedText = appendAnuvakaMarker(text, kanda, prapathaka, verse.number, locale);
			return [`<a id="anuvaka-${verse.number}"></a>`, '', markedText, '', '---', ''].join('\n');
		})
		.join('\n');

	const headerBlock = parsed.header
		? `**${(locale === 'iast' ? transliterateLine(parsed.header) : parsed.header).replace(/\n/g, ' ')}**`
		: '';

	const frontmatter = [
		'---',
		`title: ${yamlQuote(`${title} (${anuvakaLabel})`)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(sidebarLabel)}`,
		`  order: ${chapterNumber}`,
		'tableOfContents: false',
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
		getAnuvakaSectionTitle(locale),
		'',
		getChapterTocHeader(locale),
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
function renderKandaIndexMarkdown({ locale, kandaInfo, chapters, outputPath }) {
	const isIast = locale === 'iast';
	const slugPrefix = isIast ? 'iast/taittiriya-samhita' : 'taittiriya-samhita';
	const title = isIast
		? `Taittirīyasaṃhitā — ${kandaInfo.iastLabel}`
		: `तैत्तिरीयसंहिता — ${kandaInfo.rootLabel}`;

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slugPrefix}/kanda-${String(kandaInfo.kanda).padStart(2, '0')}`,
		'sidebar:',
		'  hidden: true',
		'tableOfContents: false',
		`description: ${yamlQuote(title)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	const overviewHeader = isIast
		? '| Prapāṭhaka | Anuvākāḥ | Sūcī |'
		: '| प्रपाठक | अनुवाकाः | सूची |';

	const overviewRows = chapters
		.map((chapter) => {
			const fileName = chapterFileName(chapter.number);
			const indexFile = `chapter-${String(chapter.number).padStart(2, '0')}-index`;
			if (!chapter.parsed) {
				const missingLabel = isIast ? '— (missing)' : '— (अनुपलब्ध)';
				return `| ${chapter.prapathaka} | ${missingLabel} | ${missingLabel} |`;
			}
			const anuvakaLabel = String(chapter.parsed.verseCount);
			const indexLabel = isIast ? 'Anuvāka sūcī' : 'अनुवाक सूची';
			return `| [${chapter.prapathaka}](${fileName}/) | ${anuvakaLabel} | [${indexLabel}](${indexFile}/) |`;
		})
		.join('\n');

	const body = [
		frontmatter,
		'',
		`# ${title}`,
		'',
		isIast ? '## Prapāṭhakāḥ' : '## प्रपाठकाः',
		'',
		overviewHeader,
		isIast ? '|--------:|--------:|:-----|' : '|--------:|--------:|:----|',
		overviewRows,
		'',
	].join('\n');

	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, body, 'utf8');
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
		const kandaIndexFile = `kanda-${String(kandaInfo.kanda).padStart(2, '0')}`;
		const overviewHeader = isIast
			? '| Prapāṭhaka | Anuvākāḥ | Sūcī |'
			: '| प्रपाठक | अनुवाकाः | सूची |';
		const overviewRows = kandaChapters
			.map((chapter) => {
				const fileName = chapterFileName(chapter.number);
				const indexFile = `chapter-${String(chapter.number).padStart(2, '0')}-index`;
				if (!chapter.parsed) {
					const missingLabel = isIast ? '— (missing)' : '— (अनुपलब्ध)';
					return `| ${chapter.prapathaka} | ${missingLabel} | ${missingLabel} |`;
				}
				const anuvakaLabel = String(chapter.parsed.verseCount);
				const indexLabel = isIast ? 'Anuvāka sūcī' : 'अनुवाक सूची';
				return `| [${chapter.prapathaka}](${fileName}/) | ${anuvakaLabel} | [${indexLabel}](${indexFile}/) |`;
			})
			.join('\n');

		return [
			`## ${kandaTitle} {#kanda-${kandaInfo.kanda}}`,
			'',
			isIast
				? `[${kandaTitle} overview](${kandaIndexFile}/)`
				: `[${kandaTitle} सूची](${kandaIndexFile}/)`,
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

	for (const kandaInfo of TAITTIRIYA_KANDAS) {
		const kandaChapters = chapters.filter((chapter) => chapter.kanda === kandaInfo.kanda);
		renderKandaIndexMarkdown({
			locale,
			kandaInfo,
			chapters: kandaChapters,
			outputPath: path.join(
				path.dirname(outputPath),
				`kanda-${String(kandaInfo.kanda).padStart(2, '0')}.md`
			),
		});
	}

	for (const chapter of chapters.filter((entry) => entry.parsed)) {
		const indexFile = `chapter-${String(chapter.number).padStart(2, '0')}-index.md`;
		const indexPath = path.join(path.dirname(outputPath), indexFile);
		const sectionTitle = isIast
			? `Prapāṭhaka ${chapter.prapathaka} (chapter ${chapter.number})`
			: `प्रपाठक ${chapter.prapathaka} (अध्याय ${chapter.number})`;
		const fileName = chapterFileName(chapter.number);
		const anuvakaRows = chapter.parsed.verses
			.map((verse) => {
				const firstWords = indexFirstWordsLabel(verse.text, locale);
				return `| ${chapter.number} | ${verse.number} | [${firstWords}](${fileName}#anuvaka-${verse.number}) |`;
			})
			.join('\n');
		const slugPrefix = isIast ? 'iast/taittiriya-samhita' : 'taittiriya-samhita';
		const indexFrontmatter = [
			'---',
			`title: ${yamlQuote(isIast ? `Prapāṭhaka ${chapter.number} — Anuvāka sūcī` : `प्रपाठक ${chapter.number} — अनुवाक सूची`)}`,
			`slug: ${slugPrefix}/chapter-${chapter.number}-index`,
			'sidebar:',
			'  hidden: true',
			'tableOfContents: false',
			`description: ${yamlQuote(isIast ? `Taittirīya saṃhitā — prapāṭhaka ${chapter.number} anuvāka sūcī.` : `तैत्तिरीय संहिता — प्रपाठक ${chapter.number} अनुवाक सूची।`)}`,
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
			anuvakaRows,
			'',
		].join('\n');
		fs.writeFileSync(indexPath, indexBody, 'utf8');
	}
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

if (isIastWorker) {
	const chapterNumber = Number.parseInt(process.env.TAITTIRIYA_IAST_CHAPTER ?? '', 10);
	const entry = chapterMap.get(chapterNumber);
	const parsed = loadParsedChapter(chapterNumber);
	if (!parsed || !entry) {
		throw new Error(`Missing chapter ${chapterNumber} for IAST generation`);
	}

	const firstWordsIast = firstWordsLabel(parsed.verses[0]?.text ?? '', 'iast');
	const outputPath = path.join(IAST_CHAPTERS_DIR, chapterFileName(chapterNumber));
	const count = renderChapterMarkdown({
		locale: 'iast',
		chapterNumber,
		title: getChapterTitle(chapterNumber, 'iast'),
		slug: `iast/taittiriya-samhita/chapter-${String(chapterNumber).padStart(2, '0')}`,
		sidebarLabel: `${chapterNumber} ${firstWordsIast}`,
		description: getChapterDescription(chapterNumber, 'iast'),
		outputPath,
		parsed,
		kanda: entry.kanda,
		prapathaka: entry.prapathaka,
	});
	console.log(`Wrote ${outputPath} (${count} anuvakas, iast)`);
	process.exit(0);
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
	for (let chapterNumber = 1; chapterNumber <= TAITTIRIYA_TOTAL_PRAPATHAKAS; chapterNumber++) {
		const summary = chapterSummaries.find((chapter) => chapter.number === chapterNumber);
		const entry = chapterMap.get(chapterNumber);
		if (!summary?.parsed || !entry) continue;

		const outputPath = path.join(ROOT_CHAPTERS_DIR, chapterFileName(chapterNumber));
		const count = renderChapterMarkdown({
			locale: 'root',
			chapterNumber,
			title: getChapterTitle(chapterNumber, 'root'),
			slug: `taittiriya-samhita/chapter-${String(chapterNumber).padStart(2, '0')}`,
			sidebarLabel: `${chapterNumber} ${summary.firstWordsRoot}`,
			description: getChapterDescription(chapterNumber, 'root'),
			outputPath,
			parsed: summary.parsed,
			kanda: entry.kanda,
			prapathaka: entry.prapathaka,
		});
		console.log(`Wrote ${outputPath} (${count} anuvakas, root)`);
	}
}

if (!indexOnly && !skipIast) {
	for (let chapterNumber = 1; chapterNumber <= TAITTIRIYA_TOTAL_PRAPATHAKAS; chapterNumber++) {
		if (!chapterMap.has(chapterNumber)) continue;

		const result = spawnSync(process.execPath, [GENERATOR_SCRIPT], {
			encoding: 'utf8',
			env: { ...process.env, TAITTIRIYA_IAST_CHAPTER: String(chapterNumber) },
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
