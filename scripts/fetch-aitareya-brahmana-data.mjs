import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AITAREYA_TOTAL_ADHYAYAS } from './lib/aitareya-brahmana-structure.mjs';
import {
	extractTitusSentences,
	parseTitusMeta,
} from './lib/parse-aitareya-adhyaya.mjs';
import { adhyayaToPanchikaAdhyaya } from './lib/aitareya-brahmana-structure.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(
	ROOT,
	'src/data/rigveda/aitareya/aitareya_brahmana_adhyayas.json'
);
const TITUS_BASE = 'http://titus.uni-frankfurt.de/texte/etcs/ind/aind/ved/rv/ab/ab';

/**
 * @param {number} fileNumber
 */
async function fetchTitusFile(fileNumber) {
	const id = String(fileNumber).padStart(3, '0');
	const url = `${TITUS_BASE}${id}.htm`;
	const localPath = process.env.AITAREYA_SOURCE_DIR
		? path.join(process.env.AITAREYA_SOURCE_DIR, `ab${id}.htm`)
		: null;

	let html;
	if (localPath && fs.existsSync(localPath)) {
		html = fs.readFileSync(localPath, 'utf8');
	} else {
		const response = await fetch(url);
		if (!response.ok) return null;
		html = await response.text();
	}

	const meta = [...html.matchAll(/<span id=iovcs22>([\s\S]*?)<\/span>/g)]
		.map((match) => match[1].replace(/<[^>]+>/g, '').trim())
		.filter(Boolean)
		.join(' ');

	return {
		fileNumber,
		meta,
		sentences: extractTitusSentences(html),
	};
}

async function main() {
	/** @type {Map<number, { panchika: number; adhyayaInPanchika: number; khandas: Map<number, string[]> }>} */
	const adhyayaMap = new Map();

	let currentGlobalAdhyaya = 0;

	for (let fileNumber = 1; fileNumber <= 300; fileNumber++) {
		const file = await fetchTitusFile(fileNumber);
		if (!file) break;

		const { globalAdhyaya: metaAdhyaya } = parseTitusMeta(file.meta);
		if (metaAdhyaya) currentGlobalAdhyaya = metaAdhyaya;

		if (!currentGlobalAdhyaya) continue;

		if (!adhyayaMap.has(currentGlobalAdhyaya)) {
			const { panchika, adhyaya, panchikaInfo } = adhyayaToPanchikaAdhyaya(currentGlobalAdhyaya);
			adhyayaMap.set(currentGlobalAdhyaya, {
				panchika,
				adhyayaInPanchika: adhyaya,
				panchikaLabel: panchikaInfo.rootLabel,
				khandas: new Map(),
			});
		}

		const entry = adhyayaMap.get(currentGlobalAdhyaya);
		for (const sentence of file.sentences) {
			if (!entry.khandas.has(sentence.khanda)) {
				entry.khandas.set(sentence.khanda, []);
			}
			entry.khandas.get(sentence.khanda).push(sentence.text);
		}
	}

	/** @type {object[]} */
	const output = [];

	for (let adhyaya = 1; adhyaya <= AITAREYA_TOTAL_ADHYAYAS; adhyaya++) {
		const entry = adhyayaMap.get(adhyaya);
		if (!entry) {
			console.warn(`Missing adhyāya ${adhyaya}`);
			continue;
		}

		const sortedKhandaKeys = [...entry.khandas.keys()].sort((a, b) => a - b);
		const khandas = sortedKhandaKeys.map((khandaKey, index) => {
			const sentencesIast = entry.khandas.get(khandaKey);
			return {
				khanda: index + 1,
				sourceKhanda: khandaKey,
				sentencesIast,
			};
		});

		const textIast = khandas
			.flatMap((khanda) => [`khaṇḍaḥ ${khanda.khanda}`, ...khanda.sentencesIast])
			.join('\n');

		output.push({
			veda: 'rigveda',
			corpusId: 'aitareya-brahmana',
			panchika: entry.panchika,
			adhyaya: entry.adhyayaInPanchika,
			globalAdhyaya: adhyaya,
			khandas,
			textIast,
		});
	}

	if (output.length !== AITAREYA_TOTAL_ADHYAYAS) {
		throw new Error(`Expected ${AITAREYA_TOTAL_ADHYAYAS} adhyāyas, got ${output.length}`);
	}

	fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
	console.log(`Wrote ${output.length} adhyāyas to ${OUTPUT_FILE}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
