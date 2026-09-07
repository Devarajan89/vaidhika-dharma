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

export function transliterateDevanagariRuns(
	engineInstance: InditransBrowser,
	text: string,
	to: string
): string {
	const options = to === 'tamil' ? TAMIL_SUPERSCRIPT : 0;
	const pattern = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]+/g;
	let cursor = 0;
	let out = '';
	for (const match of text.matchAll(pattern)) {
		out += text.slice(cursor, match.index);
		const run = match[0];
		for (let i = 0; i < run.length; i += CHUNK) {
			out += engineInstance.transliterate(run.slice(i, i + CHUNK), 'devanagari', to, options);
		}
		cursor = (match.index ?? 0) + run.length;
	}
	return out + text.slice(cursor);
}
