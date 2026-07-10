import fs from 'fs';
import path from 'path';
import {
	AITAREYA_ARANYAKAS,
	AITAREYA_ARANYAKA_ADHYAYAS,
	AITAREYA_ARANYAKA_TEXT_ADHYAYAS,
	AITAREYA_ARANYAKA_TOTAL_ADHYAYAS,
	AITAREYA_ARANYAKA_SOURCE_URL,
	aranyakaDirName,
	aranyakaSlug,
	adhyayaSlug,
	aranyakaCorpusSlug,
	adhyayaDirName,
	globalToAranyakaAdhyaya,
	upanishadTargetHref,
} from './lib/aitareya-aranyaka-structure.mjs';
import { normalizeTitusIast, splitTitusClauses } from './lib/normalize-titus-iast.mjs';
import { joinIastProse } from './lib/join-sanskrit-prose.mjs';
import { transliterateIastBatch } from './lib/transliterate-iast.mjs';

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, 'src/data/rigveda/aitareya/aitareya_aranyaka_adhyayas.json');
const LAST_UPDATED = new Date().toISOString().slice(0, 10);

const BASES = [
	{ locale: 'root', dir: 'src/content/docs/aranyakas/rigveda/aitareya-aranyaka' },
	{ locale: 'iast', dir: 'src/content/docs/iast/aranyakas/rigveda/aitareya-aranyaka' },
];

/**
 * @param {string} value
 */
function yamlQuote(value) {
	return `'${value.replace(/'/g, "''")}'`;
}

/**
 * @param {string} iast
 */
function prepareIastSentence(iast) {
	return joinIastProse(normalizeTitusIast(iast));
}

/**
 * @param {number} globalAdhyaya
 * @param {'root' | 'iast'} locale
 */
function renderTextAdhyaya(globalAdhyaya, locale) {
	const info = AITAREYA_ARANYAKA_ADHYAYAS.find((entry) => entry.globalAdhyaya === globalAdhyaya);
	const title = locale === 'iast' ? info.iastLabel : info.rootLabel;
	const { aranyaka, adhyaya } = globalToAranyakaAdhyaya(globalAdhyaya);

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${adhyayaSlug(aranyaka, adhyaya, locale)}`,
		'sidebar:',
		'  hidden: true',
		'tableOfContents: false',
		`description: ${yamlQuote(title)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	return [
		frontmatter,
		'',
		"import AitareyaAranyakaAdhyaya from '/src/components/content/AitareyaAranyakaAdhyaya.astro';",
		'',
		`<AitareyaAranyakaAdhyaya adhyaya={${globalAdhyaya}} locale="${locale}" />`,
		'',
	].join('\n');
}

/**
 * @param {number} globalAdhyaya
 * @param {'root' | 'iast'} locale
 */
function renderLinkAdhyaya(globalAdhyaya, locale) {
	const info = AITAREYA_ARANYAKA_ADHYAYAS.find((entry) => entry.globalAdhyaya === globalAdhyaya);
	const title = locale === 'iast' ? info.iastLabel : info.rootLabel;
	const { aranyaka, adhyaya } = globalToAranyakaAdhyaya(globalAdhyaya);
	const href = upanishadTargetHref(globalAdhyaya, locale);
	const isIast = locale === 'iast';

	const body = isIast
		? `This adhyāya is part of the **Aitareya Upaniṣad** (āraṇyaka 2, adhyāyas 4–6). The text is published under the Upaniṣads collection so it is not duplicated here.\n\n→ [Read the Aitareya Upaniṣad](${href})`
		: `अयम् अध्यायः **ऐतरेयोपनिषदः** अंशः (द्वितीयम् आरण्यकम्, चतुर्थषष्ठाध्यायाः)। पाठः उपनिषत्संग्रहे प्रकाशितः, अतः अत्र न द्विरुत्पाद्यते।\n\n→ [ऐतरेयोपनिषदं पठतु](${href})`;

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${adhyayaSlug(aranyaka, adhyaya, locale)}`,
		'sidebar:',
		'  hidden: true',
		'tableOfContents: false',
		`description: ${yamlQuote(title)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	return [frontmatter, '', `# ${title}`, '', body, ''].join('\n');
}

/**
 * @param {number} aranyakaNumber
 * @param {'root' | 'iast'} locale
 */
function renderAranyakaIndex(aranyakaNumber, locale) {
	const aranyakaInfo = AITAREYA_ARANYAKAS.find((entry) => entry.aranyaka === aranyakaNumber);
	const label = locale === 'iast' ? aranyakaInfo.iastLabel : aranyakaInfo.rootLabel;

	const frontmatter = [
		'---',
		`title: ${yamlQuote(label)}`,
		`slug: ${aranyakaSlug(aranyakaNumber, locale)}`,
		'sidebar:',
		`  label: ${yamlQuote(label)}`,
		`  order: ${aranyakaNumber}`,
		'tableOfContents: false',
		`description: ${yamlQuote(label)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	const adhyayas = AITAREYA_ARANYAKA_ADHYAYAS.filter((entry) => entry.aranyaka === aranyakaNumber);
	const isIast = locale === 'iast';
	const header = isIast ? '| Adhyāya | Read |' : '| अध्याय | पाठ |';
	const sep = isIast ? '|-------:|:-----|' : '|-------:|:----|';
	const basePath = isIast ? '/iast/aitareya-aranyaka' : '/aitareya-aranyaka';
	const rows = adhyayas
		.map((entry) => {
			const readLabel = isIast ? 'Read' : 'पाठ';
			const kindLabel =
				entry.kind === 'upanishad-link' ? (isIast ? '→ Upaniṣad' : '→ उपनिषद्') : readLabel;
			return `| ${entry.adhyaya} | [${kindLabel}](${basePath}/aranyaka-${aranyakaNumber}/adhyaya-${entry.adhyaya}/) |`;
		})
		.join('\n');

	return [
		frontmatter,
		'',
		`# ${label}`,
		'',
		header,
		sep,
		rows,
		'',
	].join('\n');
}

/**
 * @param {'root' | 'iast'} locale
 * @param {unknown[]} chapters
 */
function renderCorpusIndex(locale, chapters) {
	const isIast = locale === 'iast';
	const title = isIast ? 'Aitareya āraṇyakam — Sūcī' : 'ऐतरेय आरण्यकम् — सूची';
	const slug = aranyakaCorpusSlug(locale);
	const intro = isIast
		? `The Aitareya Āraṇyakam has five āraṇyakas and eighteen adhyāyas. Āraṇyaka 2 adhyāyas 4–6 are the **Aitareya Upaniṣad** — follow those links rather than duplicating the text here.\n\nSource: [MIU Vedic Reserve — Aitareya Āraṇyakam (PDF)](${AITAREYA_ARANYAKA_SOURCE_URL})`
		: `ऐतरेय आरण्यकस्य पञ्च आरण्यकानि, अष्टादश अध्यायाः। द्वितीयस्य आरण्यकस्य चतुर्थषष्ठाध्यायाः **ऐतरेयोपनिषत्** — पाठद्वैरस्य परिहारेण तत्रैव पठयन्ताम्।\n\nस्रोतः — [MIU Vedic Reserve — Aitareya Āraṇyakam (PDF)](${AITAREYA_ARANYAKA_SOURCE_URL})`;

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(isIast ? 'Aitareya āraṇyakam' : 'ऐतरेय आरण्यकम्')}`,
		'  order: 1',
		'tableOfContents: false',
		`description: ${yamlQuote(title)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	const sections = AITAREYA_ARANYAKAS.map((aranyakaInfo) => {
		const aranyakaTitle = isIast ? aranyakaInfo.iastLabel : aranyakaInfo.rootLabel;
		const basePath = isIast ? '/iast/aitareya-aranyaka' : '/aitareya-aranyaka';
		const aranyakaLink = `${basePath}/aranyaka-${aranyakaInfo.aranyaka}`;
		const overviewHeader = isIast
			? '| Adhyāya | Khaṇḍāḥ | Read |'
			: '| अध्याय | खण्डाः | पाठ |';
		const overviewRows = AITAREYA_ARANYAKA_ADHYAYAS.filter(
			(entry) => entry.aranyaka === aranyakaInfo.aranyaka
		)
			.map((entry) => {
				const chapter = chapters.find((item) => item.globalAdhyaya === entry.globalAdhyaya);
				const khandaLabel =
					entry.kind === 'aranyaka'
						? chapter
							? String(chapter.khandas.length)
							: '—'
						: isIast
							? '→ Upaniṣad'
							: '→ उपनिषद्';
				const readLabel = isIast ? 'Read' : 'पाठ';
				const adhyayaPath = `${aranyakaLink}/adhyaya-${entry.adhyaya}`;
				return `| ${entry.adhyaya} | ${khandaLabel} | [${readLabel}](${adhyayaPath}/) |`;
			})
			.join('\n');

		return [
			`## ${aranyakaTitle} {#aranyaka-${aranyakaInfo.aranyaka}}`,
			'',
			isIast
				? `[${aranyakaTitle} — overview](${aranyakaLink}/)`
				: `[${aranyakaTitle} — सूची](${aranyakaLink}/)`,
			'',
			overviewHeader,
			isIast ? '|-------:|-------:|:-----|' : '|-------:|-------:|:----|',
			overviewRows,
			'',
		].join('\n');
	});

	return [frontmatter, '', `# ${title}`, '', intro, '', ...sections].join('\n');
}

/**
 * @param {'root' | 'iast'} locale
 */
function renderUpanishadPage(locale) {
	const isIast = locale === 'iast';
	const title = isIast
		? 'Aitareyopaniṣat — Ṛgveda'
		: 'ऐतरेयोपनिषत् — ऋग्वेद';
	const slug = isIast ? 'iast/aitareya-upanishad' : 'aitareya-upanishad';
	const sidebarLabel = isIast ? 'Aitareyopaniṣat' : 'ऐतरेयोपनिषत्';

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(sidebarLabel)}`,
		'  order: 1',
		'tableOfContents: false',
		`description: ${yamlQuote(title)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	return [
		frontmatter,
		'',
		"import UpanishadPage from '/src/components/content/UpanishadPage.astro';",
		'',
		`<UpanishadPage id="aitareya" locale="${locale}" blockLabel="${sidebarLabel}" />`,
		'',
	].join('\n');
}

if (!fs.existsSync(DATA_FILE)) {
	console.error(`Missing ${DATA_FILE}. Run: node scripts/fetch-aitareya-aranyaka-data.mjs`);
	process.exit(1);
}

/** @type {Array<{ globalAdhyaya: number; aranyaka: number; adhyaya: number; khandas: { khanda: number; sentencesIast: string[]; sentences?: string[] }[]; textIast: string; text?: string }>} */
let chapters = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

const updatedChapters = [];
for (const chapter of chapters) {
	const khandas = chapter.khandas.map((khanda) => {
		const sentencesIast = khanda.sentencesIast
			.flatMap((sentence) => splitTitusClauses(sentence))
			.map(prepareIastSentence);
		return { ...khanda, sentencesIast };
	});
	const flatIast = khandas.flatMap((khanda) => khanda.sentencesIast);
	const flatDeva = transliterateIastBatch(flatIast);
	let cursor = 0;
	const khandasWithDeva = khandas.map((khanda) => {
		const sentences = flatDeva.slice(cursor, cursor + khanda.sentencesIast.length);
		cursor += khanda.sentencesIast.length;
		return { ...khanda, sentences };
	});
	const textIast = khandasWithDeva
		.flatMap((khanda) => [`khaṇḍaḥ ${khanda.khanda}`, ...khanda.sentencesIast])
		.join('\n');
	const text = khandasWithDeva
		.flatMap((khanda) => [`khaṇḍaḥ ${khanda.khanda}`, ...khanda.sentences])
		.join('\n');
	updatedChapters.push({ ...chapter, khandas: khandasWithDeva, textIast, text });
}
chapters = updatedChapters;

fs.writeFileSync(DATA_FILE, JSON.stringify(chapters, null, 2), 'utf8');
console.log(`Transliterated ${chapters.length} adhyāyas in ${DATA_FILE}`);

if (chapters.length !== AITAREYA_ARANYAKA_TOTAL_ADHYAYAS) {
	throw new Error(
		`Expected ${AITAREYA_ARANYAKA_TOTAL_ADHYAYAS} adhyāyas in data file, found ${chapters.length}`
	);
}

for (const { locale, dir } of BASES) {
	const baseDir = path.join(ROOT, dir);
	fs.mkdirSync(baseDir, { recursive: true });

	fs.writeFileSync(
		path.join(baseDir, 'index.md'),
		renderCorpusIndex(/** @type {'root' | 'iast'} */ (locale), chapters),
		'utf8'
	);
	console.log(`Wrote ${path.join(dir, 'index.md')}`);

	for (const aranyakaInfo of AITAREYA_ARANYAKAS) {
		const aranyakaPath = path.join(baseDir, aranyakaDirName(aranyakaInfo.aranyaka));
		fs.mkdirSync(aranyakaPath, { recursive: true });
		fs.writeFileSync(
			path.join(aranyakaPath, 'index.md'),
			renderAranyakaIndex(aranyakaInfo.aranyaka, /** @type {'root' | 'iast'} */ (locale)),
			'utf8'
		);

		const adhyayas = AITAREYA_ARANYAKA_ADHYAYAS.filter(
			(entry) => entry.aranyaka === aranyakaInfo.aranyaka
		);
		for (const adhyayaInfo of adhyayas) {
			const adhyayaPath = path.join(aranyakaPath, adhyayaDirName(adhyayaInfo.adhyaya));
			fs.mkdirSync(adhyayaPath, { recursive: true });
			const content =
				adhyayaInfo.kind === 'aranyaka'
					? renderTextAdhyaya(adhyayaInfo.globalAdhyaya, /** @type {'root' | 'iast'} */ (locale))
					: renderLinkAdhyaya(adhyayaInfo.globalAdhyaya, /** @type {'root' | 'iast'} */ (locale));
			const filename = adhyayaInfo.kind === 'aranyaka' ? 'index.mdx' : 'index.md';
			fs.writeFileSync(path.join(adhyayaPath, filename), content, 'utf8');
		}
	}
}

for (const locale of /** @type {const} */ (['root', 'iast'])) {
	const upanishadDir = path.join(
		ROOT,
		locale === 'iast'
			? 'src/content/docs/iast/upanishads/rigveda/aitareya-upanishad'
			: 'src/content/docs/upanishads/rigveda/aitareya-upanishad'
	);
	fs.mkdirSync(upanishadDir, { recursive: true });
	fs.writeFileSync(path.join(upanishadDir, 'index.mdx'), renderUpanishadPage(locale), 'utf8');
	console.log(`Wrote ${upanishadDir}/index.mdx`);
}

console.log(
	`Generated Aitareya āraṇyakam: ${AITAREYA_ARANYAKA_TEXT_ADHYAYAS.length} text adhyāyas + ${AITAREYA_ARANYAKA_TOTAL_ADHYAYAS - AITAREYA_ARANYAKA_TEXT_ADHYAYAS.length} upaniṣad links`
);
