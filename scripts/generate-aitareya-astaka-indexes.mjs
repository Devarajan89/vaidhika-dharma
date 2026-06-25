import fs from 'fs';
import path from 'path';
import {
	AITAREYA_PANCHIKAS,
	AITAREYA_TOTAL_ADHYAYAS,
	adhyayaSlug,
	panchikaAdhyayaToGlobal,
	panchikaDirName,
	panchikaSlug,
	adhyayaDirName,
} from './lib/aitareya-brahmana-structure.mjs';
import { normalizeTitusIast, splitTitusClauses } from './lib/normalize-titus-iast.mjs';
import { joinIastProse } from './lib/join-sanskrit-prose.mjs';
import { transliterateIastBatch } from './lib/transliterate-iast.mjs';

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, 'src/data/rigveda/aitareya/aitareya_brahmana_adhyayas.json');
const LAST_UPDATED = new Date().toISOString().slice(0, 10);

const BASES = [
	{ locale: 'root', dir: 'src/content/docs/brahmanas/rigveda/aitareya-brahmana' },
	{ locale: 'iast', dir: 'src/content/docs/iast/brahmanas/rigveda/aitareya-brahmana' },
];

/**
 * @param {string} value
 */
function yamlQuote(value) {
	return `'${value.replace(/'/g, "''")}'`;
}

/**
 * @param {number} panchika
 * @param {'root' | 'iast'} locale
 */
function renderPanchikaIndex(panchika, locale) {
	const panchikaInfo = AITAREYA_PANCHIKAS.find((entry) => entry.panchika === panchika);
	const label = locale === 'iast' ? panchikaInfo.iastLabel : panchikaInfo.rootLabel;

	const frontmatter = [
		'---',
		`title: ${yamlQuote(label)}`,
		`slug: ${panchikaSlug(panchika, locale)}`,
		'sidebar:',
		`  label: ${yamlQuote(label)}`,
		`  order: ${panchika}`,
		'tableOfContents: false',
		`description: ${yamlQuote(label)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	return [
		frontmatter,
		'',
		"import AitareyaPanchika from '/src/components/content/AitareyaPanchika.astro';",
		'',
		`<AitareyaPanchika panchika={${panchika}} locale="${locale}" />`,
		'',
	].join('\n');
}

/**
 * @param {number} panchika
 * @param {number} adhyaya
 * @param {'root' | 'iast'} locale
 */
function renderAdhyayaIndex(panchika, adhyaya, locale) {
	const panchikaInfo = AITAREYA_PANCHIKAS.find((entry) => entry.panchika === panchika);
	const title =
		locale === 'iast'
			? `${panchikaInfo.iastLabel}, adhyāya ${adhyaya}`
			: `${panchikaInfo.rootLabel}, अध्याय ${adhyaya}`;
	const globalAdhyaya = panchikaAdhyayaToGlobal(panchika, adhyaya);

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${adhyayaSlug(panchika, adhyaya, locale)}`,
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
		"import AitareyaAdhyaya from '/src/components/content/AitareyaAdhyaya.astro';",
		'',
		`<AitareyaAdhyaya adhyaya={${globalAdhyaya}} locale="${locale}" />`,
		'',
	].join('\n');
}

/**
 * @param {'root' | 'iast'} locale
 * @param {unknown[]} chapters
 */
function renderSamhitaIndex(locale, chapters) {
	const isIast = locale === 'iast';
	const title = isIast ? 'Aitareya brāhmaṇam — Sūcī' : 'ऐतरेय ब्राह्मणम् — सूची';
	const slug = isIast ? 'iast/aitareya-brahmana' : 'aitareya-brahmana';
	const intro = isIast
		? 'Aitareyabrāhmaṇam has eight pañcikās and forty adhyāyas. Select a pañcikā to read.'
		: 'ऐतरेयब्राह्मणस्य अष्ट पञ्चिकाः, चत्वारिंशत् अध्यायाः। पञ्चिकां चिनुत।';

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(isIast ? 'Aitareya brāhmaṇam' : 'ऐतरेय ब्राह्मणम्')}`,
		`  order: 1`,
		'tableOfContents: false',
		`description: ${yamlQuote(title)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	const sections = AITAREYA_PANCHIKAS.map((panchikaInfo) => {
		const panchikaTitle = isIast ? panchikaInfo.iastLabel : panchikaInfo.rootLabel;
		const basePath = isIast ? '/iast/aitareya-brahmana' : '/aitareya-brahmana';
		const panchikaLink = `${basePath}/panchika-${panchikaInfo.panchika}`;
		const overviewHeader = isIast
			? '| Adhyāya | Khaṇḍāḥ | Read |'
			: '| अध्याय | खण्डाः | पाठ |';
		const overviewRows = Array.from({ length: panchikaInfo.adhyayaCount }, (_, index) => {
			const adhyaya = index + 1;
			const globalAdhyaya = panchikaAdhyayaToGlobal(panchikaInfo.panchika, adhyaya);
			const chapter = chapters.find((entry) => entry.globalAdhyaya === globalAdhyaya);
			const khandaLabel = chapter ? String(chapter.khandas.length) : '—';
			const readLabel = isIast ? 'Read' : 'पाठ';
			const adhyayaPath = `${panchikaLink}/adhyaya-${adhyaya}`;
			return `| ${adhyaya} | ${khandaLabel} | [${readLabel}](${adhyayaPath}/) |`;
		}).join('\n');

		return [
			`## ${panchikaTitle} {#panchika-${panchikaInfo.panchika}}`,
			'',
			isIast
				? `[${panchikaTitle} — full text](${panchikaLink}/)`
				: `[${panchikaTitle} — संपूर्ण पाठ](${panchikaLink}/)`,
			'',
			overviewHeader,
			isIast ? '|-------:|-------:|:-----|' : '|-------:|-------:|:----|',
			overviewRows,
			'',
		].join('\n');
	});

	return [frontmatter, '', `# ${title}`, '', intro, '', ...sections].join('\n');
}

if (!fs.existsSync(DATA_FILE)) {
	console.error(`Missing ${DATA_FILE}. Run: node scripts/fetch-aitareya-brahmana-data.mjs`);
	process.exit(1);
}

/**
 * @param {string} iast
 */
function prepareIastSentence(iast) {
	return joinIastProse(iast);
}

/** @type {Array<{ globalAdhyaya: number; panchika: number; adhyaya: number; khandas: { khanda: number; sentencesIast: string[]; sentences?: string[] }[]; textIast: string; text?: string }>} */
let chapters = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

const updatedChapters = [];
for (const chapter of chapters) {
	const panchika = chapter.panchika ?? chapter.astaka;
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
	updatedChapters.push({ ...chapter, panchika, khandas: khandasWithDeva, textIast, text });
}
chapters = updatedChapters;

fs.writeFileSync(DATA_FILE, JSON.stringify(chapters, null, 2), 'utf8');
console.log(`Transliterated ${chapters.length} adhyāyas in ${DATA_FILE}`);

if (chapters.length !== AITAREYA_TOTAL_ADHYAYAS) {
	throw new Error(`Expected ${AITAREYA_TOTAL_ADHYAYAS} adhyāyas in data file, found ${chapters.length}`);
}

for (const { locale, dir } of BASES) {
	const baseDir = path.join(ROOT, dir);
	fs.mkdirSync(baseDir, { recursive: true });

	const indexPath = path.join(baseDir, 'index.md');
	fs.writeFileSync(indexPath, renderSamhitaIndex(locale, chapters), 'utf8');
	console.log(`Wrote ${indexPath}`);

	for (const panchikaInfo of AITAREYA_PANCHIKAS) {
		const panchikaPath = path.join(baseDir, panchikaDirName(panchikaInfo.panchika));
		fs.mkdirSync(panchikaPath, { recursive: true });

		const panchikaIndexPath = path.join(panchikaPath, 'index.mdx');
		fs.writeFileSync(panchikaIndexPath, renderPanchikaIndex(panchikaInfo.panchika, locale), 'utf8');
		console.log(`Wrote ${panchikaIndexPath}`);

		for (let adhyaya = 1; adhyaya <= panchikaInfo.adhyayaCount; adhyaya++) {
			const adhyayaPath = path.join(panchikaPath, adhyayaDirName(adhyaya));
			fs.mkdirSync(adhyayaPath, { recursive: true });
			const adhyayaIndexPath = path.join(adhyayaPath, 'index.mdx');
			fs.writeFileSync(
				adhyayaIndexPath,
				renderAdhyayaIndex(panchikaInfo.panchika, adhyaya, locale),
				'utf8'
			);
		}
	}
}

console.log('Done generating Aitareya brāhmaṇa pages.');
