import * as inditrans from '@vm75/inditrans';
import { postProcessDevanagari } from './lib/fix-vedic-devanagari.mjs';
import { joinIastProse, stripProsePunctuation } from './lib/join-sanskrit-prose.mjs';

let input = '';
for await (const chunk of process.stdin) {
	input += chunk;
}

/** @type {string[]} */
const sentences = JSON.parse(input);

await inditrans.init();

const out = sentences.map((sentence) => {
	try {
		const cleaned = stripProsePunctuation(sentence.trim());
		const transliterated = inditrans.transliterate(
			cleaned,
			inditrans.Script.devanagari,
			inditrans.Script.iast
		);
		return joinIastProse(transliterated.replace(/।/g, '.').replace(/॥/g, '..'));
	} catch {
		return sentence;
	}
});

process.stdout.write(JSON.stringify(out));
