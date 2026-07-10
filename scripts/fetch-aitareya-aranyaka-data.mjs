import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	AITAREYA_ARANYAKA_TOTAL_ADHYAYAS,
	AITAREYA_UPANISHAD_ADHYAYAS,
	AITAREYA_ARANYAKA_SOURCE_URL,
	aranyakaAdhyayaToGlobal,
	globalToAranyakaAdhyaya,
} from './lib/aitareya-aranyaka-structure.mjs';
import {
	extractAranyakaTitusSentences,
	parseAranyakaTitusMeta,
} from './lib/parse-aitareya-aranyaka.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ARANYAKA_OUTPUT = path.join(
	ROOT,
	'src/data/rigveda/aitareya/aitareya_aranyaka_adhyayas.json'
);
const UPANISHAD_OUTPUT = path.join(ROOT, 'src/data/upanishads/aitareya.json');
const TITUS_BASE = 'http://titus.uni-frankfurt.de/texte/etcs/ind/aind/ved/rv/aa/aa';
const TITUS_FILES = 18;

/**
 * @param {number} fileNumber
 */
async function fetchTitusFile(fileNumber) {
	const id = String(fileNumber).padStart(3, '0');
	const url = `${TITUS_BASE}${id}.htm`;
	const localPath = process.env.AITAREYA_ARANYAKA_SOURCE_DIR
		? path.join(process.env.AITAREYA_ARANYAKA_SOURCE_DIR, `aa${id}.htm`)
		: null;

	let html;
	if (localPath && fs.existsSync(localPath)) {
		html = fs.readFileSync(localPath, 'utf8');
	} else {
		const response = await fetch(url);
		if (!response.ok) return null;
		html = await response.text();
	}

	return {
		fileNumber,
		meta: parseAranyakaTitusMeta(html),
		sentences: extractAranyakaTitusSentences(html),
	};
}

/**
 * @param {Map<string, { aranyaka: number; adhyayaInAranyaka: number; globalAdhyaya: number; aranyakaLabel: string; paragraphs: Map<number, string[]> }>} adhyayaMap
 * @param {{ aranyaka: number; adhyaya: number; paragraph: number; text: string }} sentence
 */
function addSentence(adhyayaMap, sentence) {
	const key = `${sentence.aranyaka}:${sentence.adhyaya}`;
	if (!adhyayaMap.has(key)) {
		const { aranyakaInfo, adhyaya: adhyayaInAranyaka } = globalToAranyakaAdhyaya(
			aranyakaAdhyayaToGlobal(sentence.aranyaka, sentence.adhyaya)
		);
		adhyayaMap.set(key, {
			aranyaka: sentence.aranyaka,
			adhyayaInAranyaka,
			globalAdhyaya: aranyakaAdhyayaToGlobal(sentence.aranyaka, sentence.adhyaya),
			aranyakaLabel: aranyakaInfo.rootLabel,
			paragraphs: new Map(),
		});
	}

	const entry = adhyayaMap.get(key);
	if (!entry.paragraphs.has(sentence.paragraph)) {
		entry.paragraphs.set(sentence.paragraph, []);
	}
	entry.paragraphs.get(sentence.paragraph).push(sentence.text);
}

/**
 * @param {{ aranyaka: number; adhyayaInAranyaka: number; globalAdhyaya: number; aranyakaLabel: string; paragraphs: Map<number, string[]> }} entry
 */
function buildKhandas(entry) {
	const sortedParagraphKeys = [...entry.paragraphs.keys()].sort((a, b) => a - b);
	return sortedParagraphKeys.map((paragraphKey, index) => ({
		khanda: index + 1,
		sourceParagraph: paragraphKey,
		sentencesIast: entry.paragraphs.get(paragraphKey),
	}));
}

async function main() {
	/** @type {Map<string, { aranyaka: number; adhyayaInAranyaka: number; globalAdhyaya: number; aranyakaLabel: string; paragraphs: Map<number, string[]> }>} */
	const adhyayaMap = new Map();

	let currentAranyaka;
	let currentAdhyaya;

	for (let fileNumber = 1; fileNumber <= TITUS_FILES; fileNumber++) {
		const file = await fetchTitusFile(fileNumber);
		if (!file) break;

		if (file.meta.aranyaka) currentAranyaka = file.meta.aranyaka;
		if (file.meta.adhyaya) currentAdhyaya = file.meta.adhyaya;

		for (const sentence of file.sentences) {
			addSentence(adhyayaMap, sentence);
		}

		if (!file.sentences.length && currentAranyaka && currentAdhyaya) {
			const key = `${currentAranyaka}:${currentAdhyaya}`;
			if (!adhyayaMap.has(key)) {
				const { aranyakaInfo, adhyaya: adhyayaInAranyaka } = globalToAranyakaAdhyaya(
					aranyakaAdhyayaToGlobal(currentAranyaka, currentAdhyaya)
				);
				adhyayaMap.set(key, {
					aranyaka: currentAranyaka,
					adhyayaInAranyaka,
					globalAdhyaya: aranyakaAdhyayaToGlobal(currentAranyaka, currentAdhyaya),
					aranyakaLabel: aranyakaInfo.rootLabel,
					paragraphs: new Map(),
				});
			}
		}
	}

	/** @type {object[]} */
	const output = [];

	for (let globalAdhyaya = 1; globalAdhyaya <= AITAREYA_ARANYAKA_TOTAL_ADHYAYAS; globalAdhyaya++) {
		const { aranyaka, adhyaya, aranyakaInfo } = globalToAranyakaAdhyaya(globalAdhyaya);
		const entry = adhyayaMap.get(`${aranyaka}:${adhyaya}`);
		if (!entry) {
			console.warn(`Missing adhyāya ${globalAdhyaya} (āraṇyaka ${aranyaka}, adhyāya ${adhyaya})`);
			continue;
		}

		const khandas = buildKhandas(entry);
		const textIast = khandas
			.flatMap((khanda) => [`khaṇḍaḥ ${khanda.khanda}`, ...khanda.sentencesIast])
			.join('\n');

		output.push({
			veda: 'rigveda',
			corpusId: 'aitareya-aranyaka',
			source: AITAREYA_ARANYAKA_SOURCE_URL,
			aranyaka,
			adhyaya,
			globalAdhyaya,
			aranyakaLabel: aranyakaInfo.rootLabel,
			khandas,
			textIast,
		});
	}

	if (output.length !== AITAREYA_ARANYAKA_TOTAL_ADHYAYAS) {
		throw new Error(`Expected ${AITAREYA_ARANYAKA_TOTAL_ADHYAYAS} adhyāyas, got ${output.length}`);
	}

	fs.mkdirSync(path.dirname(ARANYAKA_OUTPUT), { recursive: true });
	fs.writeFileSync(ARANYAKA_OUTPUT, JSON.stringify(output, null, 2), 'utf8');
	console.log(`Wrote ${output.length} adhyāyas to ${ARANYAKA_OUTPUT}`);

	const upanishadSections = AITAREYA_UPANISHAD_ADHYAYAS.map((entry) => {
		const globalAdhyaya = aranyakaAdhyayaToGlobal(entry.aranyaka, entry.adhyaya);
		const adhyayaEntry = output.find((item) => item.globalAdhyaya === globalAdhyaya);
		if (!adhyayaEntry) {
			throw new Error(`Missing Upaniṣad adhyāya ${globalAdhyaya}`);
		}

		return {
			type: `chapter-${entry.chapter}`,
			label:
				entry.chapter === 1
					? 'प्रथमोऽध्यायः'
					: entry.chapter === 2
						? 'द्वितीयोऽध्यायः'
						: 'तृतीयोऽध्यायः',
			verses: adhyayaEntry.khandas.map((khanda) => ({
				number: khanda.khanda,
				textIast: khanda.sentencesIast.join(' '),
			})),
		};
	});

	const upanishadPayload = {
		id: 'aitareya',
		source: AITAREYA_ARANYAKA_SOURCE_URL,
		veda: { root: 'ऋग्वेद', iast: 'Ṛgveda' },
		title: 'ऐतरेयोपनिषद्',
		openingShanti: null,
		mantraCount: upanishadSections.reduce((sum, section) => sum + section.verses.length, 0),
		sections: upanishadSections,
		fetchedAt: new Date().toISOString().slice(0, 10),
	};

	fs.mkdirSync(path.dirname(UPANISHAD_OUTPUT), { recursive: true });
	fs.writeFileSync(UPANISHAD_OUTPUT, `${JSON.stringify(upanishadPayload, null, 2)}\n`, 'utf8');
	console.log(
		`Wrote ${UPANISHAD_OUTPUT} (${upanishadPayload.sections.length} chapters, ${upanishadPayload.mantraCount} paragraphs)`
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
