import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

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

const BASES = [
	{ locale: 'root', dir: 'src/content/docs/samhitas/rigveda' },
	{ locale: 'iast', dir: 'src/content/docs/iast/samhitas/rigveda' },
];

/**
 * @param {number} mandala
 * @param {'root' | 'iast'} locale
 */
function renderMandalaIndex(mandala, locale) {
	const slugPrefix = locale === 'iast' ? 'iast/rigveda-samhita' : 'rigveda-samhita';
	const label = MANDALA_LABELS[locale][mandala];
	const count = MANDALA_COUNTS[mandala];

	const frontmatter =
		locale === 'iast'
			? [
					'---',
					`title: '${label}'`,
					`slug: ${slugPrefix}/mandala-${mandala}`,
					'sidebar:',
					`  label: '${label}'`,
					`  order: ${mandala}`,
					'tableOfContents: false',
					`description: 'Ṛgveda Śākala Saṃhitā — ${label} (${count} sūktas).'`,
					'lastUpdated: 2026-06-14',
					'---',
				].join('\n')
			: [
					'---',
					`title: '${label}'`,
					`slug: ${slugPrefix}/mandala-${mandala}`,
					'sidebar:',
					`  label: '${label}'`,
					`  order: ${mandala}`,
					'tableOfContents: false',
					`description: 'ऋग्वेद शाकल संहिता — ${label} (${count} सूक्तानि).'`,
					'lastUpdated: 2026-06-14',
					'---',
				].join('\n');

	return [
		frontmatter,
		'',
		"import RigvedaMandala from '/src/components/content/RigvedaMandala.astro';",
		'',
		`<RigvedaMandala mandala={${mandala}} locale="${locale}" />`,
		'',
	].join('\n');
}

for (const { locale, dir } of BASES) {
	for (let mandala = 1; mandala <= 10; mandala += 1) {
		const mandalaDir = path.join(ROOT, dir, `Mandala_${String(mandala).padStart(2, '0')}`);
		fs.mkdirSync(mandalaDir, { recursive: true });
		const indexPath = path.join(mandalaDir, 'index.mdx');
		const legacyPath = path.join(mandalaDir, 'index.md');
		if (fs.existsSync(legacyPath)) {
			fs.unlinkSync(legacyPath);
		}
		fs.writeFileSync(indexPath, renderMandalaIndex(mandala, locale), 'utf8');
	}
	console.log(`Wrote ${locale} mandala index pages in ${dir}`);
}
