/**
 * inditrans maps TITUS ḷ (vedic ळ) to vocalic ऌ; restore correct ळ (U+0933).
 * @param {string} text
 */
export function fixVedicLaInDevanagari(text) {
	return text
		.replace(/ऌआ/g, 'ळा')
		.replace(/ऌा/g, 'ळा')
		.replace(/ऌइ/g, 'ळि')
		.replace(/ऌी/g, 'ळी')
		.replace(/ऌु/g, 'ळु')
		.replace(/ऌू/g, 'ळू')
		.replace(/ऌे/g, 'ळे')
		.replace(/ऌै/g, 'ळै')
		.replace(/ऌो/g, 'ळो')
		.replace(/ऌौ/g, 'ळौ')
		.replace(/ऌं/g, 'ळं')
		.replace(/ऌः/g, 'ळः')
		.replace(/ऌअ/g, 'ळ')
		.replace(/ऌ/g, 'ळ');
}

/**
 * @param {string} text
 */
export function postProcessDevanagari(text) {
	return fixVedicLaInDevanagari(text);
}
