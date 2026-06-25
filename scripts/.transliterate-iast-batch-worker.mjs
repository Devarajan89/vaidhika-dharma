import * as inditrans from '@vm75/inditrans';
import { postProcessDevanagari } from './lib/fix-vedic-devanagari.mjs';
import { stripProsePunctuation } from './lib/join-sanskrit-prose.mjs';
import { sanitizeIastForTransliteration } from './lib/transliterate-iast.mjs';

let input = '';
for await (const chunk of process.stdin) {
	input += chunk;
}

/** @type {string[]} */
const sentences = JSON.parse(input);

await inditrans.init();

const out = sentences.map((iast) => {
	try {
		const cleaned = sanitizeIastForTransliteration(iast);
		return postProcessDevanagari(
			stripProsePunctuation(
				inditrans.transliterate(cleaned, inditrans.Script.iast, inditrans.Script.devanagari)
			)
		);
	} catch {
		return iast;
	}
});

process.stdout.write(JSON.stringify(out));
