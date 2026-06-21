import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	extractFirstTwoWords,
	formatAnuvakaCountLabel,
	parseMaitrayaniPrapathaka,
} from './lib/parse-maitrayani-prapathaka.mjs';
import {
	MAITRAYANI_KANDAS,
	MAITRAYANI_TOTAL_PRAPATHAKAS,
	chapterToKandaPrapathaka,
} from './lib/maitrayani-samhita-structure.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(
	ROOT,
	'src/data/krishna-yajur/maitrayani/maitrayani_samhita_prapathakas.json'
);
const DOCS_ROOT = path.join(ROOT, 'src/content/docs');
const ROOT_CHAPTERS_DIR = path.join(
	DOCS_ROOT,
	'samhitas/krishna-yajur/maitrayani-samhita'
);
const IAST_CHAPTERS_DIR = path.join(
	DOCS_ROOT,
	'iast/samhitas/krishna-yajur/maitrayani-samhita'
);
const LAST_UPDATED = new Date().toISOString().slice(0, 10);

/**
 * @param {string} value
 */
function yamlQuote(value) {
	return `'${value.replace(/'/g, "''")}'`;
}

/**
 * @param {string} verseText
 * @param {'root' | 'iast'} locale
 */
function firstWordsLabel(verseText, locale) {
	return extractFirstTwoWords(verseText);
}

/**
 * @param {object} options
 */
function renderIndexMarkdown({ locale, slug, title, description, outputPath, chapters }) {
	const isIast = locale === 'iast';
	const intro = isIast
		? 'Maitrāyaṇīsaṃhitāyāḥ catvāri kāṇḍāni, catuḥpañcāśat prapāṭhakāḥ. Anuvāka sūcīṃ draṣṭum prapāṭhakaṃ cinut.'
		: 'मैत्रायणीसंहितायाः चत्वारि काण्डानि, चतुःपञ्चाशत् प्रपाठकाः। अनुवाक सूची द्रष्टुं प्रपाठकं चिनुत।';

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(isIast ? 'Maitrāyaṇī saṃhitā' : 'मैत्रायणी संहिता')}`,
		`  order: 1`,
		'tableOfContents: false',
		`description: ${yamlQuote(description)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	const basePath = isIast ? '/iast/maitrayani-samhita' : '/maitrayani-samhita';
	const sections = MAITRAYANI_KANDAS.map((kandaInfo) => {
		const kandaChapters = chapters.filter((chapter) => chapter.kanda === kandaInfo.kanda);
		const kandaTitle = isIast ? kandaInfo.iastLabel : kandaInfo.rootLabel;
		const kandaLink = `${basePath}/kanda-${kandaInfo.kanda}`;
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

/** @type {{ number: number; kanda: number; prapathaka: number; parsed: ReturnType<typeof parseMaitrayaniPrapathaka> | null; firstWordsRoot?: string }[]} */
const chapterSummaries = [];
const missingChapters = [];

/**
 * @param {number} chapterNumber
 */
function loadParsedChapter(chapterNumber) {
	const entry = chapterMap.get(chapterNumber);
	if (!entry) return null;
	return parseMaitrayaniPrapathaka(entry.text, {
		kanda: entry.kanda,
		prapathaka: entry.prapathaka,
	});
}

for (let chapterNumber = 1; chapterNumber <= MAITRAYANI_TOTAL_PRAPATHAKAS; chapterNumber++) {
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

	chapterSummaries.push({
		number: chapterNumber,
		kanda: entry.kanda,
		prapathaka: entry.prapathaka,
		parsed,
		firstWordsRoot: firstWordsLabel(parsed.verses[0]?.text ?? '', 'root'),
	});
	console.log(`Parsed chapter ${chapterNumber}: ${parsed.verseCount} anuvakas`);
}

for (const locale of ['root', 'iast']) {
	const isIast = locale === 'iast';
	renderIndexMarkdown({
		locale,
		slug: isIast ? 'iast/maitrayani-samhita' : 'maitrayani-samhita',
		title: isIast
			? 'Kṛṣṇayajuḥ Maitrāyaṇīsaṃhitā — Sūcī'
			: 'कृष्णयजुः मैत्रायणीसंहिता — सूची',
		description: isIast
			? 'Kṛṣṇayajuḥ maitrāyaṇīsaṃhitāyāḥ catvāri kāṇḍānāṃ sūcī.'
			: 'कृष्णयजुः मैत्रायणीसंहितायाः चत्वारि काण्डानां सूची।',
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
