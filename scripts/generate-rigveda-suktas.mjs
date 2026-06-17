import fs from 'fs';
import path from 'path';
import {
	extractFirstWord,
	formatSuktaHeader,
	formatVerseCountLabel,
} from './lib/parse-rigveda-sukta.mjs';
import { loadRigvedaCorpus, loadRigvedaSuktaIndex } from './lib/rigveda-corpus.mjs';
import { transliterateDevanagari } from './lib/transliterate-devanagari.mjs';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'src/data/rigveda');
const ROOT_DOCS = path.join(ROOT, 'src/content/docs/samhitas/शाकल-संहिता-ऋग्वेद');
const IAST_DOCS = path.join(ROOT, 'src/content/docs/iast/samhitas/शाकल-संहिता-ऋग्वेद');
const LAST_UPDATED = new Date().toISOString().slice(0, 10);
const mandalaLimit = Number.parseInt(process.env.MANDALA_LIMIT ?? '1', 10);
const skipIast = process.env.SKIP_IAST === '1';

const MANDALAS = [
	{ number: 1, folder: 'प्रथम-मण्डल', label: 'प्रथम मण्डल', iastLabel: 'Prathama Maṇḍala' },
	{ number: 2, folder: 'द्वितीय-मण्डल', label: 'द्वितीय मण्डल', iastLabel: 'Dvitīya Maṇḍala' },
	{ number: 3, folder: 'तृतीय-मण्डल', label: 'तृतीय मण्डल', iastLabel: 'Tṛtīya Maṇḍala' },
	{ number: 4, folder: 'चतुर्थ-मण्डल', label: 'चतुर्थ मण्डल', iastLabel: 'Caturtha Maṇḍala' },
	{ number: 5, folder: 'पञ्चम-मण्डल', label: 'पञ्चम मण्डल', iastLabel: 'Pañcama Maṇḍala' },
	{ number: 6, folder: 'षष्ठ-मण्डल', label: 'षष्ठ मण्डल', iastLabel: 'Ṣaṣṭha Maṇḍala' },
	{ number: 7, folder: 'सप्तम-मण्डल', label: 'सप्तम मण्डल', iastLabel: 'Saptama Maṇḍala' },
	{ number: 8, folder: 'अष्टम-मण्डल', label: 'अष्टम मण्डल', iastLabel: 'Aṣṭama Maṇḍala' },
	{ number: 9, folder: 'नवम-मण्डल', label: 'नवम मण्डल', iastLabel: 'Navama Maṇḍala' },
	{ number: 10, folder: 'दशम-मण्डल', label: 'दशम मण्डल', iastLabel: 'Daśama Maṇḍala' },
];

/**
 * @param {string} value
 */
function yamlQuote(value) {
	return `'${value.replace(/'/g, "''")}'`;
}

/**
 * @param {number} sukta
 */
function suktaFileName(sukta) {
	return `सूक्तम्-${String(sukta).padStart(3, '0')}.mdx`;
}

/**
 * @param {{ header: string; verses: { number: number; text: string }[]; firstWord: string; verseCount: number }} parsed
 * @param {'root' | 'iast'} locale
 */
function renderSuktaBody(parsed, locale) {
	const header =
		locale === 'iast'
			? transliterateDevanagari(formatSuktaHeader(parsed.header))
			: formatSuktaHeader(parsed.header);
	const lines = [
		"import SuktaPage from '/src/components/content/SuktaPage.astro';",
		"import Verse from '/src/components/content/Verse.astro';",
		'',
		`<SuktaPage locale="${locale === 'iast' ? 'iast' : 'root'}">`,
		'',
		`**${header}**`,
		'',
	];

	for (const verse of parsed.verses) {
		const text = locale === 'iast' ? transliterateDevanagari(verse.text) : verse.text;
		lines.push(`<Verse number={${verse.number}}>`);
		lines.push(text);
		lines.push('</Verse>');
		lines.push('');
	}

	lines.push('</SuktaPage>');
	lines.push('');
	return lines.join('\n');
}

/**
 * @param {object} options
 */
function renderSuktaFrontmatter({ locale, mandala, sukta, parsed }) {
	const slugPrefix = locale === 'iast' ? 'iast/rigveda-shakala-samhita' : 'rigveda-shakala-samhita';
	const firstWord = locale === 'iast' ? transliterateDevanagari(parsed.firstWord) : parsed.firstWord;
	const verseLabel = formatVerseCountLabel(parsed.verseCount, locale);
	const sidebarLabel = `${sukta} ${firstWord}`;
	const title =
		locale === 'iast'
			? `Sūktam ${sukta} — ${firstWord} (${verseLabel})`
			: `सूक्तम् ${sukta} — ${firstWord} (${verseLabel})`;
	const description =
		locale === 'iast'
			? `Ṛgveda Śākala Saṃhitā — ${mandala.iastLabel}, Sūktam ${sukta}`
			: `ऋग्वेद शाकल संहिता — ${mandala.label}, सूक्तम् ${sukta}`;

	return [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slugPrefix}/mandala-${mandala.number}/sukta-${sukta}`,
		'sidebar:',
		`  label: ${yamlQuote(sidebarLabel)}`,
		`  order: ${sukta}`,
		'tableOfContents: false',
		`description: ${yamlQuote(description)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
	].join('\n');
}

/**
 * @param {object} options
 */
function renderMandalaIndex({ locale, mandala, suktaCount }) {
	const slugPrefix = locale === 'iast' ? 'iast/rigveda-shakala-samhita' : 'rigveda-shakala-samhita';
	const title =
		locale === 'iast'
			? `${mandala.iastLabel} (${suktaCount})`
			: `${mandala.label} (${suktaCount})`;
	const description =
		locale === 'iast'
			? `Ṛgveda Śākala Saṃhitā — ${mandala.iastLabel}`
			: `ऋग्वेद शाकल संहिता — ${mandala.label}`;

	return [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slugPrefix}/mandala-${mandala.number}`,
		'sidebar:',
		`  label: ${yamlQuote(title)}`,
		`  order: ${mandala.number}`,
		'tableOfContents: false',
		`description: ${yamlQuote(description)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
		'',
		locale === 'iast'
			? `Ṛgveda Śākala Saṃhitā — ${mandala.iastLabel}. Choose a sūktam from the sidebar.`
			: `ऋग्वेद शाकल संहिता — ${mandala.label}। सूक्तानि पार्श्वपट्टिकायां दृश्यन्ते।`,
		'',
	].join('\n');
}

/**
 * @param {object} options
 */
function renderSamhitaIndex({ locale }) {
	const slug = locale === 'iast' ? 'iast/rigveda-shakala-samhita' : 'rigveda-shakala-samhita';
	const title = locale === 'iast' ? 'Śākala Saṃhitā (Ṛgveda)' : 'शाकल संहिता (ऋग्वेद)';
	const description =
		locale === 'iast'
			? 'Ṛgveda Śākala Saṃhitā — ten maṇḍalas'
			: 'ऋग्वेद शाकल संहिता — दश मण्डलाः';

	return [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slug}`,
		'sidebar:',
		`  label: ${yamlQuote(title)}`,
		'  order: 1',
		'tableOfContents: false',
		`description: ${yamlQuote(description)}`,
		`lastUpdated: ${LAST_UPDATED}`,
		'---',
		'',
		locale === 'iast'
			? 'Ṛgveda Śākala Saṃhitā arranged by maṇḍala and sūktam.'
			: 'ऋग्वेद शाकल संहिता मण्डलानुसारम् सूक्तानुसारं च व्यवस्थिता।',
		'',
	].join('\n');
}

function ensureDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
	ensureDir(path.dirname(filePath));
	fs.writeFileSync(filePath, content, 'utf8');
}

function removeMandalaDirs(fromNumber) {
	for (const mandala of MANDALAS) {
		if (mandala.number < fromNumber) continue;
		for (const base of [ROOT_DOCS, IAST_DOCS]) {
			fs.rmSync(path.join(base, mandala.folder), { recursive: true, force: true });
		}
	}
}

function removeLegacyMandalaFiles() {
	for (const base of [ROOT_DOCS, IAST_DOCS]) {
		for (const mandala of MANDALAS) {
			const legacy = path.join(base, `${mandala.folder}.mdx`);
			if (fs.existsSync(legacy)) {
				fs.unlinkSync(legacy);
			}
		}
	}
}

function loadMandalaSuktas(mandalaNumber) {
	const { byKey } = loadRigvedaCorpus();
	const suktaIndex = loadRigvedaSuktaIndex();

	return Object.values(suktaIndex)
		.filter((record) => record.mandala === mandalaNumber)
		.sort((a, b) => a.sukta - b.sukta)
		.map((record) => {
			const verses = record.verses.map((verseNumber) => {
				const key = `${record.mandala}:${record.sukta}:${verseNumber}`;
				const verseRecord = byKey[key];
				if (!verseRecord) {
					throw new Error(`Missing verse record: ${key}`);
				}
				return {
					number: verseNumber,
					text: verseRecord.text,
				};
			});

			const parsed = {
				header: record.header,
				verses,
				firstWord: extractFirstWord(verses[0]?.text ?? ''),
				verseCount: record.verseCount,
			};

			return {
				mandala: record.mandala,
				sukta: record.sukta,
				parsed,
			};
		});
}

function generate() {
	removeLegacyMandalaFiles();
	removeMandalaDirs(mandalaLimit + 1);

	writeFile(path.join(ROOT_DOCS, 'index.mdx'), renderSamhitaIndex({ locale: 'root' }));
	if (!skipIast) {
		writeFile(path.join(IAST_DOCS, 'index.mdx'), renderSamhitaIndex({ locale: 'iast' }));
	}

	let totalSuktas = 0;
	const mandalasToGenerate = MANDALAS.filter((mandala) => mandala.number <= mandalaLimit);

	for (const mandala of mandalasToGenerate) {
		const entries = loadMandalaSuktas(mandala.number);
		const rootMandalaDir = path.join(ROOT_DOCS, mandala.folder);
		const iastMandalaDir = path.join(IAST_DOCS, mandala.folder);

		writeFile(
			path.join(rootMandalaDir, 'index.mdx'),
			renderMandalaIndex({ locale: 'root', mandala, suktaCount: entries.length })
		);
		if (!skipIast) {
			writeFile(
				path.join(iastMandalaDir, 'index.mdx'),
				renderMandalaIndex({ locale: 'iast', mandala, suktaCount: entries.length })
			);
		}

		for (const entry of entries) {
			const parsed = entry.parsed;
			if (!parsed.firstWord) {
				parsed.firstWord = extractFirstWord(parsed.verses[0]?.text ?? '');
			}
			if (!parsed.verseCount) {
				throw new Error(`mandala ${mandala.number} sukta ${entry.sukta}: no verses parsed`);
			}

			const fileName = suktaFileName(entry.sukta);
			const rootContent = `${renderSuktaFrontmatter({ locale: 'root', mandala, sukta: entry.sukta, parsed })}\n${renderSuktaBody(parsed, 'root')}`;
			writeFile(path.join(rootMandalaDir, fileName), rootContent);

			if (!skipIast) {
				const iastContent = `${renderSuktaFrontmatter({ locale: 'iast', mandala, sukta: entry.sukta, parsed })}\n${renderSuktaBody(parsed, 'iast')}`;
				writeFile(path.join(iastMandalaDir, fileName), iastContent);
			}

			totalSuktas += 1;
		}

		console.log(`mandala ${mandala.number}: ${entries.length} sūktas`);
	}

	console.log(
		`generated ${totalSuktas} sūktas for mandalas 1–${mandalaLimit}${skipIast ? ' (Devanagari only)' : ''}`
	);
}

generate();
