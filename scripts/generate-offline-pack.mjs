import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'src/data/offline-pack.ts');
const OUTPUT = path.join(ROOT, 'public/offline-pack.json');

const source = fs.readFileSync(SOURCE, 'utf8');

/**
 * @param {string} name
 * @returns {string[]}
 */
function extractUrlArray(name) {
	const match = source.match(new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\] as const`));
	if (!match) {
		throw new Error(`Could not parse ${name} from offline-pack.ts`);
	}
	return [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1]);
}

const pack = {
	version: 1,
	generatedAt: new Date().toISOString(),
	urls: extractUrlArray('OFFLINE_PACK_URLS'),
	assets: extractUrlArray('OFFLINE_ASSET_URLS'),
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify(pack, null, 2)}\n`);
console.log(`Wrote ${pack.urls.length} offline URLs + ${pack.assets.length} assets → ${path.relative(ROOT, OUTPUT)}`);
