import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	TAITTIRIYA_KANDAS,
	chapterToKandaPrapathaka,
} from './lib/taittiriya-samhita-structure.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(
	ROOT,
	'src/data/krishna-yajur/taittiriya/taittiriya_samhita_prapathakas.json'
);
const SOURCE_URL = 'https://sanskritdocuments.org/doc_veda/taittirIyasamhitA.html';

const KANDA_ORDINALS = {
	1: 'प्रथम',
	2: 'द्वितीय',
	3: 'तृतीय',
	4: 'चतुर्थ',
	5: 'पञ्चम',
	6: 'षष्ठ',
	7: 'सप्तम',
};

const PRAPATHAKA_ORDINALS = {
	1: 'प्रथम',
	2: 'द्वितीय',
	3: 'तृतीय',
	4: 'चतुर्थ',
	5: 'पञ्चम',
	6: 'षष्ठ',
	7: 'सप्तम',
	8: 'अष्टम',
};

const HEADER_RE = /([^\n]+काण्डे[^\n]+प्रश्नः[^\n]+)/g;

/**
 * @param {string} html
 */
function htmlToPlainText(html) {
	let text = html.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, content) => {
		const heading = content.replace(/<[^>]+>/g, '').trim();
		return `\n${heading}\n`;
	});
	text = text.replace(/<br\s*\/?>/gi, '\n');
	text = text.replace(/<[^>]+>/g, '');
	text = text
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/\r/g, '');
	return text.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * @param {string} text
 */
function extractSvaraSection(text) {
	const firstHeader = 'प्रथमकाण्डे प्रथमः प्रश्नः १';
	const firstIndex = text.indexOf(firstHeader);
	if (firstIndex < 0) {
		throw new Error('Could not locate first prapathaka header in source text');
	}

	const secondIndex = text.indexOf(firstHeader, firstIndex + firstHeader.length);
	return secondIndex > 0 ? text.slice(0, secondIndex).trim() : text.trim();
}

/**
 * @param {string} text
 */
function splitPrapathakas(text) {
	const headers = [...text.matchAll(HEADER_RE)];
	if (headers.length !== 44) {
		throw new Error(`Expected 44 prapathaka headers, found ${headers.length}`);
	}

	return headers.map((match, index) => {
		const header = match[1].trim();
		const start = match.index;
		const end = index + 1 < headers.length ? headers[index + 1].index : text.length;
		const block = text.slice(start, end).trim();
		const chapter = index + 1;
		const { kanda, prapathaka } = chapterToKandaPrapathaka(chapter);

		return {
			veda: 'yajurveda',
			samhita: 'taittiriya-samhita',
			kanda,
			prapathaka,
			chapter,
			header,
			kandaLabel: `${KANDA_ORDINALS[kanda]}काण्डे`,
			prapathakaLabel: `${PRAPATHAKA_ORDINALS[prapathaka]}ः प्रश्नः`,
			text: block,
		};
	});
}

/**
 * @param {string} html
 */
export function parseTaittiriyaSamhitaHtml(html) {
	const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
	if (!preMatch) {
		throw new Error('Could not find <pre> block in Taittiriya Samhita HTML');
	}

	const plainText = htmlToPlainText(preMatch[1]);
	const svaraText = extractSvaraSection(plainText);
	return splitPrapathakas(svaraText);
}

async function main() {
	const localSource = process.env.TAITTIRIYA_SOURCE_HTML;
	let html;

	if (localSource) {
		html = fs.readFileSync(path.resolve(localSource), 'utf8');
		console.log(`Using local HTML: ${localSource}`);
	} else {
		console.log(`Fetching ${SOURCE_URL}`);
		const response = await fetch(SOURCE_URL);
		if (!response.ok) {
			throw new Error(`Fetch failed (${response.status})`);
		}
		html = await response.text();
	}

	const prapathakas = parseTaittiriyaSamhitaHtml(html);
	const expectedTotal = TAITTIRIYA_KANDAS.reduce((sum, kanda) => sum + kanda.prapathakaCount, 0);
	if (prapathakas.length !== expectedTotal) {
		throw new Error(`Expected ${expectedTotal} prapathakas, parsed ${prapathakas.length}`);
	}

	fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
	fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(prapathakas, null, 2)}\n`, 'utf8');
	console.log(`Wrote ${OUTPUT_FILE} (${prapathakas.length} prapathakas)`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
