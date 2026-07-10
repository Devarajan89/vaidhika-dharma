import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	TAITTIRIYA_ARANYAKA_PRASHNAS,
	TAITTIRIYA_ARANYAKA_SOURCE_FILES,
	TAITTIRIYA_ARANYAKA_TEXT_PRASHNAS,
	getPrashnaDisplayLabel,
} from './lib/taittiriya-aranyaka-structure.mjs';
import {
	parseTaittiriyaAranyakaPrashnaTex,
	parseTaittiriyaUpanishadTex,
	parseMahanarayanaUpanishadTex,
} from './lib/parse-taittiriya-aranyaka-tex.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ARANYAKA_OUTPUT = path.join(
	ROOT,
	'src/data/krishna-yajur/taittiriya/taittiriya_aranyaka_prashnas.json'
);
const UPANISHAD_DIR = path.join(ROOT, 'src/data/upanishads');
const RAW_BASE =
	'https://raw.githubusercontent.com/stotrasamhita/vedamantra-book/master/aranyakas';

/**
 * @param {string} filename
 * @param {string} [envVar]
 */
async function loadSourceTex(filename, envVar) {
	const localDir = process.env.TAITTIRIYA_ARANYAKA_SOURCE_DIR
		? path.resolve(process.env.TAITTIRIYA_ARANYAKA_SOURCE_DIR)
		: envVar && process.env[envVar]
			? path.resolve(process.env[envVar])
			: null;

	if (localDir) {
		const localPath = path.join(localDir, filename);
		if (fs.existsSync(localPath)) {
			return fs.readFileSync(localPath, 'utf8');
		}
	}

	const url = `${RAW_BASE}/${filename}`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status}`);
	}
	return response.text();
}

async function fetchAranyakaPrashnas() {
	/** @type {object[]} */
	const output = [];

	for (const prashna of TAITTIRIYA_ARANYAKA_TEXT_PRASHNAS) {
		const filename = TAITTIRIYA_ARANYAKA_SOURCE_FILES[prashna];
		const tex = await loadSourceTex(filename);
		const parsed = parseTaittiriyaAranyakaPrashnaTex(tex, prashna);
		output.push({
			veda: 'krishna-yajur',
			corpusId: 'taittiriya-aranyaka',
			prashna,
			title: getPrashnaDisplayLabel(prashna, 'root'),
			sourceTitle: parsed.title,
			anuvakas: parsed.anuvakas,
		});
		console.log(
			`Praśna ${prashna}: ${parsed.anuvakas.length} anuvākas (${filename})`
		);
	}

	fs.mkdirSync(path.dirname(ARANYAKA_OUTPUT), { recursive: true });
	fs.writeFileSync(ARANYAKA_OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
	console.log(`Wrote ${output.length} praśnas to ${ARANYAKA_OUTPUT}`);
	return output;
}

/**
 * @param {object} payload
 * @param {string} id
 * @param {string} source
 */
function writeUpanishadJson(payload, id, source) {
	fs.mkdirSync(UPANISHAD_DIR, { recursive: true });
	const mantraCount = payload.sections.reduce(
		(sum, section) => sum + section.verses.length,
		0
	);
	const wrapped = {
		id,
		source,
		veda: { root: 'कृष्णयजुर्वेद', iast: 'Kṛṣṇayajurveda' },
		title: payload.title,
		openingShanti: payload.openingShanti,
		mantraCount,
		sections: payload.sections.map(({ type, label, verses }) => ({
			type,
			label,
			verses,
		})),
		fetchedAt: new Date().toISOString().slice(0, 10),
	};
	const outputPath = path.join(UPANISHAD_DIR, `${id}.json`);
	fs.writeFileSync(outputPath, `${JSON.stringify(wrapped, null, 2)}\n`, 'utf8');
	console.log(
		`Wrote ${outputPath} (${wrapped.sections.length} sections, ${mantraCount} mantras)`
	);
}

async function fetchUpanishadsFromAranyaka() {
	const tuFilename = TAITTIRIYA_ARANYAKA_SOURCE_FILES[7];
	const tuTex = await loadSourceTex(tuFilename);
	const tuParsed = parseTaittiriyaUpanishadTex(tuTex);
	writeUpanishadJson(
		tuParsed,
		'taittiriya',
		`${RAW_BASE}/${tuFilename}`
	);

	const mnuFilename = TAITTIRIYA_ARANYAKA_SOURCE_FILES[10];
	const mnuTex = await loadSourceTex(mnuFilename);
	const mnuParsed = parseMahanarayanaUpanishadTex(mnuTex);
	writeUpanishadJson(
		mnuParsed,
		'mahanarayana',
		`${RAW_BASE}/${mnuFilename}`
	);
}

async function main() {
	console.log(
		`Taittirīya Āraṇyakam: fetching text for praśnas ${TAITTIRIYA_ARANYAKA_TEXT_PRASHNAS.join(', ')}`
	);
	console.log(
		`Upaniṣad praśnas ${TAITTIRIYA_ARANYAKA_PRASHNAS.filter((p) => p.kind === 'upanishad-link')
			.map((p) => p.prashna)
			.join(', ')} → separate upaniṣad corpora (no duplicate body text)`
	);
	await fetchAranyakaPrashnas();
	await fetchUpanishadsFromAranyaka();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
