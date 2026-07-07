import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	TAITTIRIYA_BRAHMANA_ASHTAKAS,
	TAITTIRIYA_BRAHMANA_TOTAL_PRAPATHAKAS,
	KATHAKAM_ASHTAKA,
	ashtakaPrapathakaToGlobal,
	getPrapathakaDisplayLabel,
} from './lib/taittiriya-brahmana-structure.mjs';
import { parseTaittiriyaBrahmanaTex } from './lib/parse-taittiriya-brahmana-tex.mjs';
import { parseTaittiriyaKathakaTex } from './lib/parse-taittiriya-kathaka-tex.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(
	ROOT,
	'src/data/krishna-yajur/taittiriya/taittiriya_brahmana_prapathakas.json'
);
const SOURCE_URL =
	'https://raw.githubusercontent.com/stotrasamhita/vedamantra-book/master/ashtakas/TaittiriyaBrahmanam-Ashtakams.tex';
// Prapāṭhakas 3.10–3.12 are the Kāṭhaka, shipped in a separate source file.
const KATHAKA_SOURCE_URL =
	'https://raw.githubusercontent.com/stotrasamhita/vedamantra-book/master/aranyakas/Kathaka.tex';

async function loadSourceTex(url, localEnvVar) {
	const localPath =
		localEnvVar && process.env[localEnvVar]
			? path.resolve(process.env[localEnvVar])
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
	const tex = await loadSourceTex(SOURCE_URL, 'TAITTIRIYA_BRAHMANA_SOURCE');
	const parsed = parseTaittiriyaBrahmanaTex(tex);

	/** @type {object[]} */
	const output = [];

	for (const ashtakaEntry of parsed) {
		const ashtakaInfo = TAITTIRIYA_BRAHMANA_ASHTAKAS.find(
			(entry) => entry.ashtaka === ashtakaEntry.ashtaka
		);
		if (!ashtakaInfo) {
			console.warn(`Unknown āṣṭaka ${ashtakaEntry.ashtaka} in source`);
			continue;
		}

		for (const prapathakaEntry of ashtakaEntry.prapathakas) {
			const globalPrapathaka = ashtakaPrapathakaToGlobal(
				ashtakaEntry.ashtaka,
				prapathakaEntry.prapathaka
			);

			output.push({
				veda: 'krishna-yajur',
				corpusId: 'taittiriya-brahmana',
				ashtaka: ashtakaEntry.ashtaka,
				prapathaka: prapathakaEntry.prapathaka,
				globalPrapathaka,
				title: prapathakaEntry.title,
				anuvakas: prapathakaEntry.anuvakas,
			});
		}
	}

	try {
		const kathakaTex = await loadSourceTex(KATHAKA_SOURCE_URL, 'TAITTIRIYA_KATHAKA_SOURCE');
		const kathakaPrapathakas = parseTaittiriyaKathakaTex(kathakaTex);
		for (const prapathakaEntry of kathakaPrapathakas) {
			const globalPrapathaka = ashtakaPrapathakaToGlobal(
				KATHAKAM_ASHTAKA,
				prapathakaEntry.prapathaka
			);
			const ashtakaInfo = TAITTIRIYA_BRAHMANA_ASHTAKAS.find(
				(entry) => entry.ashtaka === KATHAKAM_ASHTAKA
			);
			const title = `${ashtakaInfo.rootLabel}, ${getPrapathakaDisplayLabel(
				KATHAKAM_ASHTAKA,
				prapathakaEntry.prapathaka,
				'root'
			)}`;
			output.push({
				veda: 'krishna-yajur',
				corpusId: 'taittiriya-brahmana',
				ashtaka: KATHAKAM_ASHTAKA,
				prapathaka: prapathakaEntry.prapathaka,
				globalPrapathaka,
				title,
				anuvakas: prapathakaEntry.anuvakas,
			});
		}
		console.log(`Merged Kāṭhakam prapāṭhakas: ${kathakaPrapathakas.map((p) => p.prapathaka).join(', ')}`);
	} catch (error) {
		console.warn(`Kāṭhakam source unavailable, leaving 3.10–3.12 without text: ${error.message}`);
	}

	output.sort((a, b) => a.globalPrapathaka - b.globalPrapathaka);

	if (output.length < TAITTIRIYA_BRAHMANA_TOTAL_PRAPATHAKAS) {
		console.warn(
			`Parsed ${output.length}/${TAITTIRIYA_BRAHMANA_TOTAL_PRAPATHAKAS} prapāṭhakas from source`
		);
	}

	fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
	fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
	console.log(`Wrote ${output.length} prapāṭhakas to ${OUTPUT_FILE}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
