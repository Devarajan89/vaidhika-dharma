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

const daily = extractUrlArray('OFFLINE_PACK_DAILY');
const rudra = extractUrlArray('OFFLINE_PACK_RUDRA');
const sangraha = extractUrlArray('OFFLINE_PACK_SANGRAHA');
const assets = extractUrlArray('OFFLINE_ASSET_URLS');

const pack = {
	version: 2,
	generatedAt: new Date().toISOString(),
	urls: daily,
	assets,
	packs: {
		daily,
		rudra,
		sangraha,
	},
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify(pack, null, 2)}\n`);
console.log(
	`Wrote offline packs daily=${daily.length} rudra=${rudra.length} sangraha=${sangraha.length} → ${path.relative(ROOT, OUTPUT)}`
);
