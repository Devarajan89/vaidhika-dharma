import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import {
	TAITTIRIYA_BRAHMANA_ASHTAKAS,
	TAITTIRIYA_BRAHMANA_TOTAL_PRAPATHAKAS,
	ashtakaPrapathakaToGlobal,
	ashtakaDirName,
	prapathakaDirName,
	ashtakaSlug,
	prapathakaSlug,
	getPrapathakaSidebarLabel,
	getPrapathakaDisplayLabel,
	isKathakamPrapathaka,
} from './lib/taittiriya-brahmana-structure.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LINES_WORKER = path.resolve(__dirname, '.transliterate-taittiriya-lines-worker.mjs');
// inditrans' WebAssembly leaks memory and faults ("memory access out of
// bounds") after a few hundred transliterations in one process, so we isolate
// batches in fresh subprocesses well under that threshold.
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
			throw new Error(result.stderr || 'Taittirīya brāhmaṇam transliteration failed');
		}
		out.push(...JSON.parse(result.stdout));
	}
	return out;
}

const ROOT = process.cwd();
const DATA_FILE = path.join(
	ROOT,
	'src/data/krishna-yajur/taittiriya/taittiriya_brahmana_prapathakas.json'
);
const LAST_UPDATED = new Date().toISOString().slice(0, 10);

const BASES = [
	{
		locale: 'root',
		dir: 'src/content/docs/brahmanas/krishna-yajur/taittiriya-brahmana',
	},
	{
		locale: 'iast',
		dir: 'src/content/docs/iast/brahmanas/krishna-yajur/taittiriya-brahmana',
	},
];

/**
 * @param {string} value
 */
function yamlQuote(value) {
	return `'${value.replace(/'/g, "''")}'`;
}

/**
 * @param {number} ashtaka
 * @param {'root' | 'iast'} locale
 */
function renderAshtakaIndex(ashtaka, locale) {
	const ashtakaInfo = TAITTIRIYA_BRAHMANA_ASHTAKAS.find((entry) => entry.ashtaka === ashtaka);
	const label = locale === 'iast' ? ashtakaInfo.iastLabel : ashtakaInfo.rootLabel;

	const frontmatter = [
		'---',
		`title: ${yamlQuote(label)}`,
		`slug: ${ashtakaSlug(ashtaka, locale)}`,
		'sidebar:',
		`  label: ${yamlQuote(label)}`,
		`  order: ${ashtaka}`,
		'tableOfContents: false',
		`description: ${yamlQuote(label)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	return [
		frontmatter,
		'',
		"import TaittiriyaBrahmanaAshtaka from '/src/components/content/TaittiriyaBrahmanaAshtaka.astro';",
		'',
		`<TaittiriyaBrahmanaAshtaka ashtaka={${ashtaka}} locale="${locale}" />`,
		'',
	].join('\n');
}

/**
 * @param {number} ashtaka
 * @param {number} prapathaka
 * @param {'root' | 'iast'} locale
 */
function renderPrapathakaIndex(ashtaka, prapathaka, locale) {
	const ashtakaInfo = TAITTIRIYA_BRAHMANA_ASHTAKAS.find((entry) => entry.ashtaka === ashtaka);
	const prapathakaLabel = getPrapathakaDisplayLabel(ashtaka, prapathaka, locale);
	const title =
		locale === 'iast'
			? `${ashtakaInfo.iastLabel}, ${prapathakaLabel}`
			: `${ashtakaInfo.rootLabel}, ${prapathakaLabel}`;
	const globalPrapathaka = ashtakaPrapathakaToGlobal(ashtaka, prapathaka);

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${prapathakaSlug(ashtaka, prapathaka, locale)}`,
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
		"import TaittiriyaBrahmanaPrapathaka from '/src/components/content/TaittiriyaBrahmanaPrapathaka.astro';",
		'',
		`<TaittiriyaBrahmanaPrapathaka prapathaka={${globalPrapathaka}} locale="${locale}" />`,
		'',
	].join('\n');
}

/**
 * @param {number} ashtaka
 * @param {number} prapathaka
 * @param {'root' | 'iast'} locale
 */
function renderMissingPrapathakaIndex(ashtaka, prapathaka, locale) {
	const ashtakaInfo = TAITTIRIYA_BRAHMANA_ASHTAKAS.find((entry) => entry.ashtaka === ashtaka);
	const prapathakaLabel = getPrapathakaDisplayLabel(ashtaka, prapathaka, locale);
	const title =
		locale === 'iast'
			? `${ashtakaInfo.iastLabel}, ${prapathakaLabel}`
			: `${ashtakaInfo.rootLabel}, ${prapathakaLabel}`;
	const isKathakam = isKathakamPrapathaka(ashtaka, prapathaka);
	const body = isKathakam
		? locale === 'iast'
			? 'Prapāṭhakas 3.10–3.12 of the third āṣṭaka are traditionally the **Kāṭhakam** (Kāṭhaka brāhmaṇa), distinct from the main Taittirīya brāhmaṇam source. Accented Devanagari text for this prapāṭhaka is not yet available in our source edition.'
			: 'तृतीयाष्टके दशमाद्वादशप्रपाठकाः परम्परया **काठकम्** (काठकब्राह्मणम्) इति प्रसिद्धाः, मुख्यतैत्तिरीयब्राह्मणस्रोतसः पृथक्। अस्मिन् प्रपाठके साक्षरदेवनागरीपाठः अद्यापि उपलब्धः नास्ति।'
		: locale === 'iast'
			? 'Text for this prapāṭhaka is not yet available in our source edition.'
			: 'अस्मिन् प्रपाठके साक्षरदेवनागरीपाठः अद्यापि उपलब्धः नास्ति।';

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${prapathakaSlug(ashtaka, prapathaka, locale)}`,
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
 * @param {unknown[]} prapathakas
 */
function renderCorpusIndex(locale, prapathakas) {
	const isIast = locale === 'iast';
	const title = isIast ? 'Taittirīya brāhmaṇam — Sūcī' : 'तैत्तिरीय ब्राह्मणम् — सूची';
	const slug = isIast ? 'iast/taittiriya-brahmana' : 'taittiriya-brahmana';
	const intro = isIast
		? 'Taittirīyabrāhmaṇam has three āṣṭakas and twenty-eight prapāṭhakas. Prapāṭhakas 3.10–3.12 of the third āṣṭaka are traditionally the **Kāṭhakam** (Kāṭhaka). Select an āṣṭaka to read.'
		: 'तैत्तिरीयब्राह्मणस्य त्रीणि अष्टकानि, अष्टाविंशतिः प्रपाठकाः। तृतीयाष्टके दशमाद्वादशप्रपाठकाः परम्परया **काठकम्** इति प्रसिद्धाः। अष्टकं चिनुत।';

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(isIast ? 'Taittirīya brāhmaṇam' : 'तैत्तिरीय ब्राह्मणम्')}`,
		`  order: 2`,
		'tableOfContents: false',
		`description: ${yamlQuote(title)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	const sections = TAITTIRIYA_BRAHMANA_ASHTAKAS.map((ashtakaInfo) => {
		const ashtakaTitle = isIast ? ashtakaInfo.iastLabel : ashtakaInfo.rootLabel;
		const basePath = isIast ? '/iast/taittiriya-brahmana' : '/taittiriya-brahmana';
		const ashtakaLink = `${basePath}/ashtaka-${ashtakaInfo.ashtaka}`;
		const overviewHeader = isIast
			? '| Prapāṭhaka | Anuvākāḥ | Read |'
			: '| प्रपाठक | अनुवाकाः | पाठ |';
		const overviewRows = Array.from({ length: ashtakaInfo.prapathakaCount }, (_, index) => {
			const prapathaka = index + 1;
			const globalPrapathaka = ashtakaPrapathakaToGlobal(ashtakaInfo.ashtaka, prapathaka);
			const entry = prapathakas.find((item) => item.globalPrapathaka === globalPrapathaka);
			const anuvakaLabel = entry ? String(entry.anuvakas.length) : '—';
			const readLabel = isIast ? 'Read' : 'पाठ';
			const prapathakaPath = `${ashtakaLink}/prapathaka-${prapathaka}`;
			const prapathakaLabel = getPrapathakaDisplayLabel(ashtakaInfo.ashtaka, prapathaka, locale);
			return `| ${prapathakaLabel} | ${anuvakaLabel} | [${readLabel}](${prapathakaPath}/) |`;
		}).join('\n');

		return [
			`## ${ashtakaTitle} {#ashtaka-${ashtakaInfo.ashtaka}}`,
			'',
			isIast
				? `[${ashtakaTitle} — full text](${ashtakaLink}/)`
				: `[${ashtakaTitle} — संपूर्ण पाठ](${ashtakaLink}/)`,
			'',
			overviewHeader,
			isIast ? '|-----------:|---------:|:-----|' : '|---------:|---------:|:----|',
			overviewRows,
			'',
		].join('\n');
	});

	return [frontmatter, '', `# ${title}`, '', intro, '', ...sections].join('\n');
}

if (!fs.existsSync(DATA_FILE)) {
	console.error(`Missing ${DATA_FILE}. Run: node scripts/fetch-taittiriya-brahmana-data.mjs`);
	process.exit(1);
}

/** @type {Array<{ globalPrapathaka: number; ashtaka: number; prapathaka: number; anuvakas: { anuvaka: number; sourceAnuvaka?: number; verses: { number: number; lines: string[]; linesIast?: string[] }[] }[] }>} */
let prapathakas = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

const flatLines = [];
for (const entry of prapathakas) {
	for (const anuvaka of entry.anuvakas) {
		for (const verse of anuvaka.verses) {
			flatLines.push(...verse.lines);
		}
	}
}
const flatIast = transliterateLines(flatLines);

let cursor = 0;
prapathakas = prapathakas.map((entry) => {
	const anuvakas = entry.anuvakas.map((anuvaka) => {
		const verses = anuvaka.verses.map((verse) => ({
			...verse,
			linesIast: verse.lines.map(() => flatIast[cursor++]),
		}));
		return { ...anuvaka, verses };
	});
	return { ...entry, anuvakas };
});

fs.writeFileSync(DATA_FILE, `${JSON.stringify(prapathakas, null, 2)}\n`, 'utf8');

for (const base of BASES) {
	const outputRoot = path.join(ROOT, base.dir);
	fs.mkdirSync(outputRoot, { recursive: true });
	fs.writeFileSync(
		path.join(outputRoot, 'index.md'),
		renderCorpusIndex(base.locale, prapathakas),
		'utf8'
	);
	console.log(`Wrote ${path.join(base.dir, 'index.md')}`);

	for (const ashtakaInfo of TAITTIRIYA_BRAHMANA_ASHTAKAS) {
		const ashtakaDir = path.join(outputRoot, ashtakaDirName(ashtakaInfo.ashtaka));
		fs.mkdirSync(ashtakaDir, { recursive: true });
		fs.writeFileSync(
			path.join(ashtakaDir, 'index.mdx'),
			renderAshtakaIndex(ashtakaInfo.ashtaka, base.locale),
			'utf8'
		);

		for (let prapathaka = 1; prapathaka <= ashtakaInfo.prapathakaCount; prapathaka++) {
			const globalPrapathaka = ashtakaPrapathakaToGlobal(ashtakaInfo.ashtaka, prapathaka);
			const hasData = prapathakas.some((entry) => entry.globalPrapathaka === globalPrapathaka);
			const prapathakaDir = path.join(ashtakaDir, prapathakaDirName(prapathaka));
			fs.mkdirSync(prapathakaDir, { recursive: true });
			fs.writeFileSync(
				path.join(prapathakaDir, 'index.mdx'),
				hasData
					? renderPrapathakaIndex(ashtakaInfo.ashtaka, prapathaka, base.locale)
					: renderMissingPrapathakaIndex(ashtakaInfo.ashtaka, prapathaka, base.locale),
				'utf8'
			);
		}
	}
}

console.log(
	`Generated Taittirīya brāhmaṇam indexes for ${prapathakas.length}/${TAITTIRIYA_BRAHMANA_TOTAL_PRAPATHAKAS} prapāṭhakas`
);
