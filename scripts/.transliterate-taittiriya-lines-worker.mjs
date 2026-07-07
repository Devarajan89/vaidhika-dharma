import * as inditrans from '@vm75/inditrans';

const HAS_DEVANAGARI = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]/;

let input = '';
for await (const chunk of process.stdin) {
	input += chunk;
}

/** @type {string[]} */
const lines = JSON.parse(input);

await inditrans.init();

/**
 * Normalise Vedic nasal signs and private-use markers so inditrans yields clean
 * IAST, keep word spacing, and render dandas as ./..
 * @param {string} line
 */
function transliterateLine(line) {
	if (!HAS_DEVANAGARI.test(line)) return line;
	const cleaned = line.replace(/[\uE000-\uF8FF\uFFFC]/g, '').replace(/[ꣳꣴ]/g, 'ं');
	try {
		return inditrans
			.transliterate(cleaned, inditrans.Script.devanagari, inditrans.Script.iast)
			.replace(/॥/g, '..')
			.replace(/।/g, '.')
			.replace(/\|\|/g, '..')
			.replace(/\|/g, '.')
			.replace(/[ \t]+/g, ' ')
			.trim();
	} catch {
		return line;
	}
}

const out = lines.map((line) => transliterateLine(line));
process.stdout.write(JSON.stringify(out));
