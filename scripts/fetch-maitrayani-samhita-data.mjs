import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	MAITRAYANI_KANDAS,
	MAITRAYANI_TOTAL_PRAPATHAKAS,
	chapterToKandaPrapathaka,
	kandaPrapathakaToChapter,
} from './lib/maitrayani-samhita-structure.mjs';
import { formatPrapathakaHeader } from './lib/parse-maitrayani-prapathaka.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(
	ROOT,
	'src/data/krishna-yajur/maitrayani/maitrayani_samhita_prapathakas.json'
);

const RAW_BASE =
	'https://raw.githubusercontent.com/vishvAsa/vedAH_yajuH/content/maitrAyaNIyam/visvara-saMhitA';

/**
 * @param {string} content
 */
function stripFrontmatter(content) {
	if (!content.startsWith('+++')) return content.trim();
	const end = content.indexOf('+++', 3);
	if (end < 0) return content.trim();
	return content.slice(end + 3).trim();
}

/**
 * @param {string} url
 */
async function fetchText(url) {
	const response = await fetch(url);
	if (!response.ok) {
		return null;
	}
	return response.text();
}

/**
 * @param {number} kanda
 * @param {number} prapathaka
 */
async function loadPrapathakaText(kanda, prapathaka) {
	const kandaDir = String(kanda);
	const prapathakaDir = String(prapathaka).padStart(2, '0');
	const blocks = [];
	let consecutiveMisses = 0;

	for (let anuvaka = 1; anuvaka <= 99; anuvaka += 1) {
		const anuvakaFile = String(anuvaka).padStart(2, '0');
		const url = `${RAW_BASE}/${kandaDir}/${prapathakaDir}/${anuvakaFile}.md`;
		const raw = await fetchText(url);
		if (raw) {
			blocks.push(stripFrontmatter(raw));
			consecutiveMisses = 0;
		} else {
			consecutiveMisses += 1;
			if (blocks.length && consecutiveMisses >= 5) {
				break;
			}
		}
	}

	if (!blocks.length) {
		throw new Error(`No anuvāka files for kāṇḍa ${kanda}, prapāṭhaka ${prapathaka}`);
	}

	const header = formatPrapathakaHeader(kanda, prapathaka);
	return [header, ...blocks].join('\n\n');
}

async function main() {
	/** @type {object[]} */
	const prapathakas = [];
	let chapter = 0;

	for (const kandaInfo of MAITRAYANI_KANDAS) {
		for (let prapathaka = 1; prapathaka <= kandaInfo.prapathakaCount; prapathaka += 1) {
			chapter += 1;
			console.log(`Fetching kāṇḍa ${kandaInfo.kanda}, prapāṭhaka ${prapathaka}…`);
			const text = await loadPrapathakaText(kandaInfo.kanda, prapathaka);
			prapathakas.push({
				veda: 'yajurveda',
				samhita: 'maitrayani-samhita',
				kanda: kandaInfo.kanda,
				prapathaka,
				chapter,
				header: formatPrapathakaHeader(kandaInfo.kanda, prapathaka),
				kandaLabel: kandaInfo.rootLabel,
				prapathakaLabel: `प्रपाठक ${prapathaka}`,
				text,
			});
		}
	}

	if (prapathakas.length !== MAITRAYANI_TOTAL_PRAPATHAKAS) {
		throw new Error(`Expected ${MAITRAYANI_TOTAL_PRAPATHAKAS} prapāṭhakas, got ${prapathakas.length}`);
	}

	for (const entry of prapathakas) {
		const expectedChapter = kandaPrapathakaToChapter(entry.kanda, entry.prapathaka);
		const mapped = chapterToKandaPrapathaka(entry.chapter);
		if (expectedChapter !== entry.chapter || mapped.kanda !== entry.kanda) {
			throw new Error(`Chapter mapping mismatch at chapter ${entry.chapter}`);
		}
	}

	fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
	fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(prapathakas, null, 2)}\n`, 'utf8');
	console.log(`Wrote ${OUTPUT_FILE} (${prapathakas.length} prapāṭhakas)`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
