import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseUpanishadHtml } from './lib/parse-upanishad-html.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'src/data/upanishads');

/** @type {Record<string, { url: string; id: string; veda: { root: string; iast: string } }>} */
const SOURCES = {
	kena: {
		id: 'kena',
		url: 'https://sanskritdocuments.org/doc_upanishhat/kena.html',
		veda: { root: 'सामवेद', iast: 'Sāmaveda' },
	},
	katha: {
		id: 'katha',
		url: 'https://sanskritdocuments.org/doc_upanishhat/katha.html',
		veda: { root: 'कृष्णयजुर्वेद', iast: 'Kṛṣṇayajurveda' },
	},
};

/**
 * @param {string} id
 * @param {string} url
 */
async function fetchHtml(id, url) {
	const localPath = process.env.UPANISHAD_SOURCE_DIR
		? path.join(process.env.UPANISHAD_SOURCE_DIR, `${id}.html`)
		: null;

	if (localPath && fs.existsSync(localPath)) {
		return fs.readFileSync(localPath, 'utf8');
	}

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status}`);
	}
	return response.text();
}

async function main() {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });

	for (const source of Object.values(SOURCES)) {
		const html = await fetchHtml(source.id, source.url);
		const parsed = parseUpanishadHtml(html);
		const mantraCount = parsed.sections.reduce((sum, section) => sum + section.verses.length, 0);

		const payload = {
			id: source.id,
			source: source.url,
			veda: source.veda,
			title: parsed.title,
			openingShanti: parsed.openingShanti,
			mantraCount,
			sections: parsed.sections,
			fetchedAt: new Date().toISOString().slice(0, 10),
		};

		const outputPath = path.join(OUTPUT_DIR, `${source.id}.json`);
		fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
		console.log(`Wrote ${outputPath} (${parsed.sections.length} sections, ${mantraCount} mantras)`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
