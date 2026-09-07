export const INDIC_SCRIPT_IDS = [
	'devanagari',
	'tamil',
	'telugu',
	'kannada',
	'malayalam',
	'marathi',
	'gujarati',
	'bengali',
	'odia',
	'grantha',
] as const;

export type IndicScriptId = (typeof INDIC_SCRIPT_IDS)[number];

export interface IndicScriptOption {
	id: IndicScriptId;
	label: string;
	/** Inditrans target, or local handling. */
	engine: 'passthrough' | 'inditrans' | 'grantha';
	inditrans?: string;
	fontFamily: string;
}

export const INDIC_SCRIPTS: IndicScriptOption[] = [
	{
		id: 'devanagari',
		label: 'Devanagari',
		engine: 'passthrough',
		fontFamily: "'Siddhanta', serif",
	},
	{
		id: 'tamil',
		label: 'Tamil',
		engine: 'inditrans',
		inditrans: 'tamil',
		fontFamily: "'Tiro Tamil', 'NotoSerifTamil', 'Siddhanta', serif",
	},
	{
		id: 'telugu',
		label: 'Telugu',
		engine: 'inditrans',
		inditrans: 'telugu',
		fontFamily: "'Tiro Telugu', 'Siddhanta', serif",
	},
	{
		id: 'kannada',
		label: 'Kannada',
		engine: 'inditrans',
		inditrans: 'kannada',
		fontFamily: "'Tiro Kannada', 'Siddhanta', serif",
	},
	{
		id: 'malayalam',
		label: 'Malayalam',
		engine: 'inditrans',
		inditrans: 'malayalam',
		fontFamily: "'Noto Serif Malayalam', 'Siddhanta', serif",
	},
	{
		id: 'marathi',
		label: 'Marathi',
		engine: 'passthrough',
		fontFamily: "'Tiro Devanagari Marathi', 'Siddhanta', serif",
	},
	{
		id: 'gujarati',
		label: 'Gujarati',
		engine: 'inditrans',
		inditrans: 'gujarati',
		fontFamily: "'Noto Serif Gujarati', 'Siddhanta', serif",
	},
	{
		id: 'bengali',
		label: 'Bengali',
		engine: 'inditrans',
		inditrans: 'bengali',
		fontFamily: "'Tiro Bangla', 'Siddhanta', serif",
	},
	{
		id: 'odia',
		label: 'Odia',
		engine: 'inditrans',
		inditrans: 'odia',
		fontFamily: "'Noto Serif Oriya', 'Siddhanta', serif",
	},
	{
		id: 'grantha',
		label: 'Grantha',
		engine: 'grantha',
		fontFamily: "'Noto Serif Grantha', 'Siddhanta', serif",
	},
];

export function isIndicScriptId(value: string | null | undefined): value is IndicScriptId {
	return INDIC_SCRIPT_IDS.includes(value as IndicScriptId);
}
