import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseAitareyaUpanishadHtml } from './lib/parse-upanishad-html.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'src/data/upanishads/aitareya.json');
const SOURCE_URL =
	'https://sanskritdocuments.org/doc_upanishhat/aitareyopaniShatsasvarA.html';

async function fetchHtml() {
	const localPath = process.env.UPANISHAD_SOURCE_DIR
		? path.join(process.env.UPANISHAD_SOURCE_DIR, 'aitareyopaniShatsasvarA.html')
		: null;

	if (localPath && fs.existsSync(localPath)) {
		return fs.readFileSync(localPath, 'utf8');
	}

	const response = await fetch(SOURCE_URL);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${SOURCE_URL}: ${response.status}`);
	}
	return response.text();
}

async function main() {
	const html = await fetchHtml();
	const parsed = parseAitareyaUpanishadHtml(html);
	const mantraCount = parsed.sections.reduce((sum, section) => sum + section.verses.length, 0);

	const payload = {
		id: 'aitareya',
		source: SOURCE_URL,
		veda: { root: 'ऋग्वेद', iast: 'Ṛgveda' },
		title: parsed.title,
		openingShanti: parsed.openingShanti,
		mantraCount,
		sections: parsed.sections,
		fetchedAt: new Date().toISOString().slice(0, 10),
	};

	fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
	fs.writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
	console.log(
		`Wrote ${OUTPUT} (${parsed.sections.length} chapters, ${mantraCount} khaṇḍas, svara-sahita Devanagari)`
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
