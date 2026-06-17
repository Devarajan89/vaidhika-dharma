import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const INDEX_PATHS = [
	'src/content/docs/samhitas/rigveda/index.md',
	'src/content/docs/iast/samhitas/rigveda/index.md',
];

const MANDALA_LABELS = {
	root: {
		1: 'प्रथम मण्डल',
		2: 'द्वितीय मण्डल',
		3: 'तृतीय मण्डल',
		4: 'चतुर्थ मण्डल',
		5: 'पञ्चम मण्डल',
		6: 'षष्ठ मण्डल',
		7: 'सप्तम मण्डल',
		8: 'अष्टम मण्डल',
		9: 'नवम मण्डल',
		10: 'दशम मण्डल',
	},
	iast: {
		1: 'Prathama Maṇḍala',
		2: 'Dvitīya Maṇḍala',
		3: 'Tṛtīya Maṇḍala',
		4: 'Caturtha Maṇḍala',
		5: 'Pañcama Maṇḍala',
		6: 'Ṣaṣṭha Maṇḍala',
		7: 'Saptama Maṇḍala',
		8: 'Aṣṭama Maṇḍala',
		9: 'Navama Maṇḍala',
		10: 'Daśama Maṇḍala',
	},
};

const MANDALA_COUNTS = {
	1: 191,
	2: 43,
	3: 62,
	4: 58,
	5: 87,
	6: 75,
	7: 104,
	8: 102,
	9: 114,
	10: 191,
};

/**
 * @param {string} content
 */
function extractFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	return match ? match[0] : '';
}

/**
 * @param {string} content
 * @param {number} mandala
 */
function extractMandalaSection(content, mandala) {
	const heading = content.includes('## Maṇḍala')
		? `## Maṇḍala ${mandala}`
		: `## Mandala ${mandala}`;
	const start = content.indexOf(heading);
	if (start === -1) return null;

	const nextHeading = content.indexOf('\n## ', start + heading.length);
	const section = nextHeading === -1 ? content.slice(start) : content.slice(start, nextHeading);
	return section.trim() + '\n';
}

/**
 * @param {string} content
 */
function fixMandalaSectionLinks(content) {
	return content.replace(
		/Mandala_\d+\/sukta_(\d+)\.md#(verse-\d+)/g,
		(_, sukta, anchor) => `sukta-${Number(sukta)}#${anchor}`
	);
}

/**
 * @param {number} mandala
 * @param {'root' | 'iast'} locale
 */
function renderMandalaIndexFrontmatter(mandala, locale) {
	const slugPrefix = locale === 'iast' ? 'iast/rigveda-samhita' : 'rigveda-samhita';
	const label = MANDALA_LABELS[locale][mandala];
	const count = MANDALA_COUNTS[mandala];

	if (locale === 'iast') {
		return [
			'---',
			`title: '${label} — Mantra sūcī'`,
			`slug: ${slugPrefix}/mandala-${mandala}`,
			'sidebar:',
			`  label: '${label}'`,
			`  order: ${mandala}`,
			'tableOfContents: false',
			`description: 'Ṛgveda Śākala Saṃhitā — ${label} mantra index (${count} sūktas).'`,
			'lastUpdated: 2026-06-14',
			'---',
		].join('\n');
	}

	return [
		'---',
		`title: '${label} — मन्त्र सूची'`,
		`slug: ${slugPrefix}/mandala-${mandala}`,
		'sidebar:',
		`  label: '${label}'`,
		`  order: ${mandala}`,
		'tableOfContents: false',
		`description: 'ऋग्वेद शाकल संहिता — ${label} मन्त्र सूची (${count} सूक्तानि).'`,
		'lastUpdated: 2026-06-14',
		'---',
	].join('\n');
}

/**
 * @param {'root' | 'iast'} locale
 */
function renderMainIndex(frontmatter, locale) {
	const labels = MANDALA_LABELS[locale];
	const isIast = locale === 'iast';

	const fm = frontmatter.replace(
		/tableOfContents:\s*\n\s*minHeadingLevel:\s*\d+\s*\n\s*maxHeadingLevel:\s*\d+/,
		'tableOfContents: false'
	);

	const lines = [
		fm,
		'',
		isIast ? '# Śākala saṃhitā — Sūcī' : '# शाकल संहिता — सूची',
		'',
		isIast
			? '10,481 mantrāṇi daśa maṇḍaleṣu. Mantra sūcīṃ draṣṭum maṇḍalaṃ cinut.'
			: '१०,४८१ मन्त्राणि दश मण्डलेषु। मन्त्र सूची द्रष्टुं मण्डलं चिनुत।',
		'',
		isIast ? '## Śākala saṃhitā — Maṇḍalāḥ' : '## शाकल संहिता — मण्डलाः',
		'',
		isIast ? '| Maṇḍala | Sūktas |' : '| मण्डल | सूक्तानि |',
		isIast ? '|---------|-------:|' : '|-------|--------:|',
	];

	for (let mandala = 1; mandala <= 10; mandala++) {
		const label = labels[mandala];
		const count = MANDALA_COUNTS[mandala];
		lines.push(`| [${label}](mandala-${mandala}/) | ${count} |`);
	}

	lines.push('');
	return lines.join('\n');
}

function splitIndex(indexPath) {
	const locale = indexPath.includes('/iast/') ? 'iast' : 'root';
	const fullPath = path.join(ROOT, indexPath);
	const content = fs.readFileSync(fullPath, 'utf8');
	const frontmatter = extractFrontmatter(content);
	const baseDir = path.dirname(fullPath);

	for (let mandala = 1; mandala <= 10; mandala++) {
		const section = extractMandalaSection(content, mandala);
		if (!section) {
			console.warn(`No section for mandala ${mandala} in ${indexPath}`);
			continue;
		}

		const mandalaDir = path.join(baseDir, `Mandala_${String(mandala).padStart(2, '0')}`);
		fs.mkdirSync(mandalaDir, { recursive: true });

		const mandalaIndex = [
			renderMandalaIndexFrontmatter(mandala, locale),
			'',
			fixMandalaSectionLinks(section),
		].join('\n');

		fs.writeFileSync(path.join(mandalaDir, 'index.md'), mandalaIndex, 'utf8');
	}

	const mainIndex = renderMainIndex(frontmatter, locale);
	fs.writeFileSync(fullPath, mainIndex, 'utf8');
	console.log(`Split ${indexPath} → 10 mandala index pages`);
}

for (const indexPath of INDEX_PATHS) {
	splitIndex(indexPath);
}
