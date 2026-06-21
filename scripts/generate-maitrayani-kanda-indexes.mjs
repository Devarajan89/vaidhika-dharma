import fs from 'fs';
import path from 'path';
import {
	MAITRAYANI_KANDAS,
	kandaDirName,
	kandaPrapathakaToChapter,
	kandaSlug,
	prapathakaDirName,
	prapathakaSlug,
} from './lib/maitrayani-samhita-structure.mjs';

const ROOT = process.cwd();
const LAST_UPDATED = new Date().toISOString().slice(0, 10);

const BASES = [
	{ locale: 'root', dir: 'src/content/docs/samhitas/krishna-yajur/maitrayani-samhita' },
	{ locale: 'iast', dir: 'src/content/docs/iast/samhitas/krishna-yajur/maitrayani-samhita' },
];

/**
 * @param {string} value
 */
function yamlQuote(value) {
	return `'${value.replace(/'/g, "''")}'`;
}

/**
 * @param {number} kanda
 * @param {'root' | 'iast'} locale
 */
function renderKandaIndex(kanda, locale) {
	const kandaInfo = MAITRAYANI_KANDAS.find((entry) => entry.kanda === kanda);
	const label = locale === 'iast' ? kandaInfo.iastLabel : kandaInfo.rootLabel;

	const frontmatter = [
		'---',
		`title: ${yamlQuote(label)}`,
		`slug: ${kandaSlug(kanda, locale)}`,
		'sidebar:',
		`  label: ${yamlQuote(label)}`,
		`  order: ${kanda}`,
		'tableOfContents: false',
		`description: ${yamlQuote(label)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');

	return [
		frontmatter,
		'',
		"import MaitrayaniKanda from '/src/components/content/MaitrayaniKanda.astro';",
		'',
		`<MaitrayaniKanda kanda={${kanda}} locale="${locale}" />`,
		'',
	].join('\n');
}

/**
 * @param {number} kanda
 * @param {number} prapathaka
 * @param {'root' | 'iast'} locale
 */
function renderPrapathakaIndex(kanda, prapathaka, locale) {
	const kandaInfo = MAITRAYANI_KANDAS.find((entry) => entry.kanda === kanda);
	const chapter = kandaPrapathakaToChapter(kanda, prapathaka);
	const title =
		locale === 'iast'
			? `${kandaInfo.iastLabel}, prapāṭhaka ${prapathaka}`
			: `${kandaInfo.rootLabel}, प्रपाठक ${prapathaka}`;

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${prapathakaSlug(kanda, prapathaka, locale)}`,
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
		"import MaitrayaniChapter from '/src/components/content/MaitrayaniChapter.astro';",
		'',
		`<MaitrayaniChapter chapter={${chapter}} locale="${locale}" />`,
		'',
	].join('\n');
}

for (const { locale, dir } of BASES) {
	const baseDir = path.join(ROOT, dir);

	for (const kandaInfo of MAITRAYANI_KANDAS) {
		const kandaPath = path.join(baseDir, kandaDirName(kandaInfo.kanda));
		fs.mkdirSync(kandaPath, { recursive: true });

		const kandaIndexPath = path.join(kandaPath, 'index.mdx');
		for (const legacy of ['index.md']) {
			const legacyPath = path.join(kandaPath, legacy);
			if (fs.existsSync(legacyPath)) fs.unlinkSync(legacyPath);
		}
		fs.writeFileSync(kandaIndexPath, renderKandaIndex(kandaInfo.kanda, locale), 'utf8');

		for (let prapathaka = 1; prapathaka <= kandaInfo.prapathakaCount; prapathaka += 1) {
			const prapathakaPath = path.join(kandaPath, prapathakaDirName(prapathaka));
			fs.mkdirSync(prapathakaPath, { recursive: true });

			const prapathakaIndexPath = path.join(prapathakaPath, 'index.mdx');
			for (const legacy of ['index.md']) {
				const legacyPath = path.join(prapathakaPath, legacy);
				if (fs.existsSync(legacyPath)) fs.unlinkSync(legacyPath);
			}
			fs.writeFileSync(
				prapathakaIndexPath,
				renderPrapathakaIndex(kandaInfo.kanda, prapathaka, locale),
				'utf8'
			);
		}
	}

	console.log(`Wrote ${locale} kāṇḍa/prapāṭhaka pages in ${dir}`);
}
