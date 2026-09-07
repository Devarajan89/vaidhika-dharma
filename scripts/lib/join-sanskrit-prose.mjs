/**
 * Join word-spaced TITUS/Aufrecht prose into continuous text (PDF style).
 */

import { applyDevanagariJoinSandhi } from './devanagari-join-sandhi.mjs';

/**
 * @param {string} text
 */
export function joinIastProse(text) {
	return text
		.replace(/,\s*/g, '')
		.replace(/;\s*/g, '')
		.replace(/:\s*/g, '')
		.replace(/\.\s*/g, '')
		.replace(/-\s*/g, '')
		.replace(/\s+/g, '');
}

/**
 * @param {string} text
 */
export function stripProsePunctuation(text) {
	return text.replace(/[।\.:;,]+/g, '');
}

/**
 * Merge khaṇḍa units into one continuous paragraph (no danda breaks).
 * @param {string[]} sentences
 */
export function formatKhandaProse(sentences) {
	const body = sentences
		.map((sentence) => stripProsePunctuation(sentence.trim()))
		.filter(Boolean)
		.join('');
	const merged = applyDevanagariJoinSandhi(body);
	return merged ? `${merged}॥` : '';
}
