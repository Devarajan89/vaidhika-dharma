/** Expected mantra counts per adhyāya (parsed from cleaned Kanva JSON). */
export const KANVA_SAMHITA_MANTRA_COUNTS = {
	1: 49,
	2: 60,
	3: 76,
	4: 49,
	5: 55,
	6: 50,
	7: 40,
	8: 32,
	9: 46,
	10: 43,
	11: 47,
	12: 85,
	13: 116,
	14: 65,
	15: 35,
	16: 85,
	17: 64,
	18: 84,
	19: 43,
	20: 46,
	21: 66,
	22: 75,
	23: 60,
	24: 47,
	25: 67,
	26: 44,
	27: 45,
	28: 14,
	29: 50,
	30: 46,
	31: 51,
	32: 84,
	33: 46,
	34: 22,
	35: 55,
	36: 24,
	37: 20,
	38: 27,
	39: 12,
	40: 18,
};

/**
 * @param {number} chapter
 */
export function expectedMantraCount(chapter) {
	return KANVA_SAMHITA_MANTRA_COUNTS[chapter];
}
