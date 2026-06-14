/** Expected mantra counts per adhyāya (parsed from Madhyandina JSON). */
export const MADHYANDINA_SAMHITA_MANTRA_COUNTS = {
	1: 31,
	2: 34,
	3: 63,
	4: 37,
	5: 43,
	6: 37,
	7: 48,
	8: 63,
	9: 40,
	10: 34,
	11: 83,
	12: 117,
	13: 58,
	14: 31,
	15: 65,
	16: 66,
	17: 99,
	18: 77,
	19: 95,
	20: 90,
	21: 61,
	22: 34,
	23: 65,
	24: 40,
	25: 47,
	26: 26,
	27: 45,
	28: 46,
	29: 60,
	30: 22,
	31: 22,
	32: 16,
	33: 97,
	34: 58,
	35: 22,
	36: 24,
	37: 21,
	38: 28,
	39: 13,
	40: 17,
};

/**
 * @param {number} chapter
 */
export function expectedMantraCount(chapter) {
	return MADHYANDINA_SAMHITA_MANTRA_COUNTS[chapter];
}
