import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parsePrashnaUpanishadHtml } from './lib/parse-upanishad-html.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'src/data/upanishads/prashna.json');
const SOURCE_URL = 'https://sanskritdocuments.org/doc_upanishhat/prashna.html';

async function fetchHtml() {
	const localPath = process.env.UPANISHAD_SOURCE_DIR
		? path.join(process.env.UPANISHAD_SOURCE_DIR, 'prashna.html')
		: null;

	if (localPath && fs.existsSync(localPath)) {
		return fs.readFileSync(localPath, 'utf8');
	}

	const response = await fetch(SOURCE_URL, {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (compatible; VaidhikaDharma/1.0; +https://vaidhikadharma.org/)',
			Accept: 'text/html,application/xhtml+xml',
		},
	});
	if (!response.ok) {
		throw new Error(`Failed to fetch ${SOURCE_URL}: ${response.status}`);
	}
	return response.text();
}

async function main() {
	const html = await fetchHtml();
	const parsed = parsePrashnaUpanishadHtml(html);
	const mantraCount = parsed.sections.reduce((sum, section) => sum + section.verses.length, 0);

	if (parsed.sections.length !== 6) {
		throw new Error(`Expected 6 praśnas, got ${parsed.sections.length}`);
	}

	const expected = [16, 13, 12, 11, 7, 8];
	parsed.sections.forEach((section, index) => {
		if (section.verses.length !== expected[index]) {
			throw new Error(
				`Praśna ${index + 1}: expected ${expected[index]} mantras, got ${section.verses.length}`
			);
		}
	});

	const payload = {
		id: 'prashna',
		source: SOURCE_URL,
		veda: { root: 'अथर्ववेद', iast: 'Atharvaveda' },
		title: parsed.title || 'प्रश्नोपनिषत्',
		openingShanti: parsed.openingShanti,
		mantraCount,
		sections: parsed.sections,
		fetchedAt: new Date().toISOString().slice(0, 10),
	};

	fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
	fs.writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
	console.log(`Wrote ${OUTPUT} (${parsed.sections.length} praśnas, ${mantraCount} mantras)`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
