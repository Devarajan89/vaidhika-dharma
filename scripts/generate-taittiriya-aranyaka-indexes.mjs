import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import {
	TAITTIRIYA_ARANYAKA_PRASHNAS,
	TAITTIRIYA_ARANYAKA_TEXT_PRASHNAS,
	prashnaDirName,
	prashnaSlug,
	aranyakaSlug,
	getPrashnaDisplayLabel,
	upanishadTargetHref,
} from './lib/taittiriya-aranyaka-structure.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LINES_WORKER = path.resolve(__dirname, '.transliterate-taittiriya-lines-worker.mjs');
const TRANSLITERATION_CHUNK_SIZE = 400;

/**
 * @param {string[]} lines
 * @returns {string[]}
 */
function transliterateLines(lines) {
	/** @type {string[]} */
	const out = [];
	for (let i = 0; i < lines.length; i += TRANSLITERATION_CHUNK_SIZE) {
		const chunk = lines.slice(i, i + TRANSLITERATION_CHUNK_SIZE);
		const result = spawnSync(process.execPath, [LINES_WORKER], {
			input: JSON.stringify(chunk),
			encoding: 'utf8',
			maxBuffer: 64 * 1024 * 1024,
		});
		if (result.status !== 0) {
			throw new Error(result.stderr || 'Taittirīya āraṇyakam transliteration failed');
		}
		out.push(...JSON.parse(result.stdout));
	}
	return out;
}

const ROOT = process.cwd();
const DATA_FILE = path.join(
	ROOT,
	'src/data/krishna-yajur/taittiriya/taittiriya_aranyaka_prashnas.json'
);
const LAST_UPDATED = new Date().toISOString().slice(0, 10);

const BASES = [
	{
		locale: 'root',
		dir: 'src/content/docs/aranyakas/krishna-yajur/taittiriya-aranyaka',
	},
	{
		locale: 'iast',
		dir: 'src/content/docs/iast/aranyakas/krishna-yajur/taittiriya-aranyaka',
	},
];

const UPANISHAD_PAGES = [
	{
		id: 'taittiriya',
		slug: 'taittiriya-upanishad',
		rootTitle: 'तैत्तिरीयोपनिषत् — कृष्णयजुर्वेद',
		iastTitle: 'Taittirīyopaniṣat — Kṛṣṇayajurveda',
		rootDir: 'src/content/docs/upanishads/krishna-yajur/taittiriya-upanishad',
		iastDir: 'src/content/docs/iast/upanishads/krishna-yajur/taittiriya-upanishad',
		order: 4,
	},
	{
		id: 'mahanarayana',
		slug: 'mahanarayana-upanishad',
		rootTitle: 'महानारायणोपनिषत् — कृष्णयजुर्वेद',
		iastTitle: 'Mahānārāyaṇopaniṣat — Kṛṣṇayajurveda',
		rootDir: 'src/content/docs/upanishads/krishna-yajur/mahanarayana-upanishad',
		iastDir: 'src/content/docs/iast/upanishads/krishna-yajur/mahanarayana-upanishad',
		order: 5,
	},
];

/**
 * @param {string} value
 */
function yamlQuote(value) {
	return `'${value.replace(/'/g, "''")}'`;
}

/**
 * @param {number} prashna
 * @param {'root' | 'iast'} locale
 */
function renderTextPrashna(prashna, locale) {
	const title = getPrashnaDisplayLabel(prashna, locale);
	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${prashnaSlug(prashna, locale)}`,
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
		"import TaittiriyaAranyakaPrashna from '/src/components/content/TaittiriyaAranyakaPrashna.astro';",
		'',
		`<TaittiriyaAranyakaPrashna prashna={${prashna}} locale="${locale}" />`,
		'',
	].join('\n');
}

/**
 * @param {number} prashna
 * @param {'root' | 'iast'} locale
 */
function renderLinkPrashna(prashna, locale) {
	const title = getPrashnaDisplayLabel(prashna, locale);
	const href = upanishadTargetHref(prashna, locale);
	const isIast = locale === 'iast';

	let body;
	if (prashna >= 7 && prashna <= 9) {
		body = isIast
			? `This praśna is the **Taittirīya Upaniṣad** (praśnas 7–9 of the Āraṇyakam). The accented text is published under the Upaniṣads collection so it is not duplicated here.\n\n→ [Read the Taittirīya Upaniṣad](${href})`
			: `अयं प्रश्नः **तैत्तिरीयोपनिषत्** (आरण्यकस्य सप्तमाष्टमनवमाः प्रश्नाः)। साक्षरपाठः उपनिषद्संग्रहे प्रकाशितः, अतः अत्र न द्विरुत्पाद्यते।\n\n→ [तैत्तिरीयोपनिषदं पठतु](${href})`;
	} else {
		body = isIast
			? `This praśna is the **Mahānārāyaṇa Upaniṣad** (Yājñikī / tenth praśna). The accented text is published under the Upaniṣads collection.\n\n→ [Read the Mahānārāyaṇa Upaniṣad](${href})`
			: `अयं प्रश्नः **महानारायणोपनिषत्** (याज्ञिकी / दशमः प्रश्नः)। साक्षरपाठः उपनिषद्संग्रहे प्रकाशितः।\n\n→ [महानारायणोपनिषदं पठतु](${href})`;
	}

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${prashnaSlug(prashna, locale)}`,
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
 * @param {'root' | 'iast'} locale
 * @param {Array<{ prashna: number; anuvakas: unknown[] }>} prashnas
 */
function renderCorpusIndex(locale, prashnas) {
	const isIast = locale === 'iast';
	const title = isIast ? 'Taittirīya āraṇyakam — Sūcī' : 'तैत्तिरीय आरण्यकम् — सूची';
	const slug = aranyakaSlug(locale);
	const intro = isIast
		? 'The Taittirīya Āraṇyakam has ten praśnas. Praśnas 1–6 are the āraṇyaka proper (full text below). Praśnas 7–9 are the **Taittirīya Upaniṣad** and praśna 10 is the **Mahānārāyaṇa Upaniṣad** — follow those links rather than duplicating the text here.'
		: 'तैत्तिरीय आरण्यकस्य दश प्रश्नाः। प्रथमाः षट् प्रश्नाः आरण्यकम् (पूर्णपाठः अधः)। सप्तमाष्टमनवमाः **तैत्तिरीयोपनिषत्**, दशमः **महानारायणोपनिषत्** — पाठद्वैरस्य परिहारेण तत्रैव पठयन्ताम्।';

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(isIast ? 'Taittirīya āraṇyakam' : 'तैत्तिरीय आरण्यकम्')}`,
		'  order: 1',
		'tableOfContents: false',
		`description: ${yamlQuote(title)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	const overviewHeader = isIast
		? '| Praśna | Anuvākāḥ | Read |'
		: '| प्रश्न | अनुवाकाः | पाठ |';
	const overviewSep = isIast
		? '|-------:|---------:|:-----|'
		: '|-----:|---------:|:----|';

	const rows = TAITTIRIYA_ARANYAKA_PRASHNAS.map((info) => {
		const label = getPrashnaDisplayLabel(info.prashna, locale);
		const entry = prashnas.find((item) => item.prashna === info.prashna);
		const anuvakaLabel =
			info.kind === 'aranyaka'
				? entry
					? String(entry.anuvakas.length)
					: '—'
				: isIast
					? '→ Upaniṣad'
					: '→ उपनिषद्';
		const readLabel = isIast ? 'Read' : 'पाठ';
		const basePath = isIast ? '/iast/taittiriya-aranyaka' : '/taittiriya-aranyaka';
		return `| ${label} | ${anuvakaLabel} | [${readLabel}](${basePath}/prashna-${info.prashna}/) |`;
	}).join('\n');

	return [
		frontmatter,
		'',
		`# ${title}`,
		'',
		intro,
		'',
		overviewHeader,
		overviewSep,
		rows,
		'',
	].join('\n');
}

/**
 * @param {(typeof UPANISHAD_PAGES)[number]} page
 * @param {'root' | 'iast'} locale
 */
function renderUpanishadPage(page, locale) {
	const isIast = locale === 'iast';
	const title = isIast ? page.iastTitle : page.rootTitle;
	const slug = isIast ? `iast/${page.slug}` : page.slug;
	const sidebarLabel = isIast
		? page.id === 'taittiriya'
			? 'Taittirīyopaniṣat'
			: 'Mahānārāyaṇopaniṣat'
		: page.id === 'taittiriya'
			? 'तैत्तिरीयोपनिषत्'
			: 'महानारायणोपनिषत्';

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(sidebarLabel)}`,
		`  order: ${page.order}`,
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
		`<UpanishadPage id="${page.id}" locale="${locale}" blockLabel="${sidebarLabel}" />`,
		'',
	].join('\n');
}

if (!fs.existsSync(DATA_FILE)) {
	console.error(`Missing ${DATA_FILE}. Run: node scripts/fetch-taittiriya-aranyaka-data.mjs`);
	process.exit(1);
}

/** @type {Array<{ prashna: number; anuvakas: { anuvaka: number; verses: { number: number; lines: string[]; linesIast?: string[] }[] }[] }>} */
let prashnas = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

const flatLines = [];
for (const entry of prashnas) {
	for (const anuvaka of entry.anuvakas) {
		for (const verse of anuvaka.verses) {
			flatLines.push(...verse.lines);
		}
	}
}

if (flatLines.length) {
	console.log(`Transliterating ${flatLines.length} lines…`);
	const flatIast = transliterateLines(flatLines);
	let cursor = 0;
	prashnas = prashnas.map((entry) => ({
		...entry,
		anuvakas: entry.anuvakas.map((anuvaka) => ({
			...anuvaka,
			verses: anuvaka.verses.map((verse) => {
				const count = verse.lines.length;
				const linesIast = flatIast.slice(cursor, cursor + count);
				cursor += count;
				return { ...verse, linesIast };
			}),
		})),
	}));
	fs.writeFileSync(DATA_FILE, `${JSON.stringify(prashnas, null, 2)}\n`, 'utf8');
	console.log(`Updated ${DATA_FILE} with IAST lines`);
}

for (const base of BASES) {
	const absDir = path.join(ROOT, base.dir);
	fs.mkdirSync(absDir, { recursive: true });
	fs.writeFileSync(
		path.join(absDir, 'index.md'),
		renderCorpusIndex(/** @type {'root' | 'iast'} */ (base.locale), prashnas),
		'utf8'
	);
	console.log(`Wrote ${path.join(base.dir, 'index.md')}`);

	for (const info of TAITTIRIYA_ARANYAKA_PRASHNAS) {
		const prashnaDir = path.join(absDir, prashnaDirName(info.prashna));
		fs.mkdirSync(prashnaDir, { recursive: true });
		const content =
			info.kind === 'aranyaka'
				? renderTextPrashna(info.prashna, /** @type {'root' | 'iast'} */ (base.locale))
				: renderLinkPrashna(info.prashna, /** @type {'root' | 'iast'} */ (base.locale));
		const filename = info.kind === 'aranyaka' ? 'index.mdx' : 'index.md';
		fs.writeFileSync(path.join(prashnaDir, filename), content, 'utf8');
	}
	console.log(
		`Generated ${TAITTIRIYA_ARANYAKA_PRASHNAS.length} praśna pages for ${base.locale}`
	);
}

for (const page of UPANISHAD_PAGES) {
	const dataPath = path.join(ROOT, 'src/data/upanishads', `${page.id}.json`);
	if (!fs.existsSync(dataPath)) {
		console.warn(`Skipping ${page.id} MDX — missing ${dataPath}`);
		continue;
	}
	for (const locale of /** @type {const} */ (['root', 'iast'])) {
		const dir = path.join(ROOT, locale === 'iast' ? page.iastDir : page.rootDir);
		fs.mkdirSync(dir, { recursive: true });
		fs.writeFileSync(path.join(dir, 'index.mdx'), renderUpanishadPage(page, locale), 'utf8');
		console.log(`Wrote ${locale === 'iast' ? page.iastDir : page.rootDir}/index.mdx`);
	}
}

console.log(
	`Generated Taittirīya āraṇyakam indexes for ${TAITTIRIYA_ARANYAKA_TEXT_PRASHNAS.length} text praśnas + ${TAITTIRIYA_ARANYAKA_PRASHNAS.length - TAITTIRIYA_ARANYAKA_TEXT_PRASHNAS.length} upaniṣad links`
);
