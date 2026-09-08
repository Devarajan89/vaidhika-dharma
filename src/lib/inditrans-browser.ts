const CHUNK = 240;
const WASM_URL = '/vendor/inditrans.wasm';
/** inditrans Option.TamilSuperscripted — Grantha-style Tamil with ³/⁴ for voiced stops. */
const TAMIL_SUPERSCRIPT = 2;

type WasmExports = {
	memory: WebAssembly.Memory;
	stackAlloc: (len: number) => number;
	stackSave: () => number;
	stackRestore: (ptr: number) => void;
	transliterate: (text: number, from: number, to: number, options: number) => number;
	releaseBuffer: (ptr: number) => void;
	isScriptSupported: (ptr: number) => number;
};

class InditransBrowser {
	constructor(private readonly module: WasmExports) {}

	private get memory(): Uint8Array {
		return new Uint8Array(this.module.memory.buffer);
	}

	private utf8ToString(ptr: number): string {
		if (ptr === 0) return '';
		const memory = this.memory;
		let end = ptr;
		while (memory[end]) end += 1;
		return new TextDecoder().decode(memory.subarray(ptr, end));
	}

	private stringToUtf8(str: string): number {
		const encoded = new TextEncoder().encode(str);
		const ptr = this.module.stackAlloc(encoded.length + 1);
		this.memory.set(encoded, ptr);
		this.memory[ptr + encoded.length] = 0;
		return ptr;
	}

	transliterate(text: string, from: string, to: string, options = 0): string {
		const stack = this.module.stackSave();
		try {
			const pointers = [text, from, to].map((value) => this.stringToUtf8(value));
			const resultPtr = this.module.transliterate(pointers[0], pointers[1], pointers[2], options);
			if (resultPtr === 0) return text;
			const result = this.utf8ToString(resultPtr);
			this.module.releaseBuffer(resultPtr);
			return result || text;
		} finally {
			this.module.stackRestore(stack);
		}
	}
}

let engine: InditransBrowser | null = null;
let loading: Promise<InditransBrowser> | null = null;

export async function getInditrans(): Promise<InditransBrowser> {
	if (engine) return engine;
	if (!loading) {
		loading = (async () => {
			const response = await fetch(WASM_URL);
			if (!response.ok) throw new Error('Failed to load inditrans.wasm');
			const { instance } = await WebAssembly.instantiate(await response.arrayBuffer());
			engine = new InditransBrowser(instance.exports as unknown as WasmExports);
			return engine;
		})();
	}
	return loading;
}

/** Keep Western digits; never map ०–९ (or other Indic digits) into the target script. */
const INDIC_DIGIT = /[\u0966-\u096F\u09E6-\u09EF\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F]/g;

export function toAsciiDigits(text: string): string {
	return text.replace(INDIC_DIGIT, (ch) => {
		const cp = ch.codePointAt(0)!;
		if (cp >= 0x0966 && cp <= 0x096f) return String(cp - 0x0966);
		if (cp >= 0x09e6 && cp <= 0x09ef) return String(cp - 0x09e6);
		if (cp >= 0x0ae6 && cp <= 0x0aef) return String(cp - 0x0ae6);
		if (cp >= 0x0b66 && cp <= 0x0b6f) return String(cp - 0x0b66);
		if (cp >= 0x0be6 && cp <= 0x0bef) return String(cp - 0x0be6);
		if (cp >= 0x0c66 && cp <= 0x0c6f) return String(cp - 0x0c66);
		if (cp >= 0x0ce6 && cp <= 0x0cef) return String(cp - 0x0ce6);
		if (cp >= 0x0d66 && cp <= 0x0d6f) return String(cp - 0x0d66);
		return ch;
	});
}

export function transliterateDevanagariRuns(
	engineInstance: InditransBrowser,
	text: string,
	to: string
): string {
	const options = to === 'tamil' ? TAMIL_SUPERSCRIPT : 0;
	// Digits stay ASCII so inditrans / Aksharamukha-style mapping cannot rewrite them.
	const source = toAsciiDigits(text);
	const pattern = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]+/g;
	let cursor = 0;
	let out = '';
	for (const match of source.matchAll(pattern)) {
		out += source.slice(cursor, match.index);
		const run = match[0];
		for (let i = 0; i < run.length; i += CHUNK) {
			out += engineInstance.transliterate(run.slice(i, i + CHUNK), 'devanagari', to, options);
		}
		cursor = (match.index ?? 0) + run.length;
	}
	return toAsciiDigits(out + source.slice(cursor));
}
