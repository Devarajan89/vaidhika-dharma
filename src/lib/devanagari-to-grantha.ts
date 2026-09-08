/**
 * Devanagari → Grantha for Vedic reading.
 * Vedic svara (U+0951–0954, Vedic Extensions, Devanagari Extended) stay in place;
 * 0951+offset would become Grantha combining letters used for Sāma, not udātta.
 */
const GRANTHA_OFFSET = 0x10a00;

function keepCodePoint(cp: number): boolean {
	return (
		(cp >= 0x0951 && cp <= 0x0954) ||
		(cp >= 0x0964 && cp <= 0x0965) ||
		(cp >= 0x1cd0 && cp <= 0x1cff) ||
		(cp >= 0xa8e0 && cp <= 0xa8ff)
	);
}

export function devanagariToGrantha(text: string): string {
	let out = '';
	for (const ch of text) {
		const cp = ch.codePointAt(0);
		if (cp === undefined) continue;
		if (cp >= 0x0966 && cp <= 0x096f) {
			out += String(cp - 0x0966);
			continue;
		}
		if (keepCodePoint(cp)) {
			out += ch;
			continue;
		}
		if (cp >= 0x0900 && cp <= 0x097f) {
			const grantha = cp + GRANTHA_OFFSET;
			if (grantha >= 0x11300 && grantha <= 0x1137f) {
				out += String.fromCodePoint(grantha);
				continue;
			}
		}
		out += ch;
	}
	return out;
}
