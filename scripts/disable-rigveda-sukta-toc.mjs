import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const RIGVEDA_DIRS = [
	'src/content/docs/samhitas/rigveda',
	'src/content/docs/iast/samhitas/rigveda',
];

const TOC_FALSE = 'tableOfContents: false';
const TOC_BLOCK = /tableOfContents:\s*\n\s*minHeadingLevel:\s*\d+\s*\n\s*maxHeadingLevel:\s*\d+/;

let updated = 0;

for (const relDir of RIGVEDA_DIRS) {
	const dir = path.join(ROOT, relDir);
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (!entry.isDirectory() || !entry.name.startsWith('Mandala_')) continue;

		const mandalaDir = path.join(dir, entry.name);
		for (const file of fs.readdirSync(mandalaDir)) {
			if (!/^sukta_\d+\.md$/.test(file)) continue;

			const filePath = path.join(mandalaDir, file);
			const content = fs.readFileSync(filePath, 'utf8');
			if (!TOC_BLOCK.test(content)) continue;

			const next = content.replace(TOC_BLOCK, TOC_FALSE);
			fs.writeFileSync(filePath, next, 'utf8');
			updated++;
		}
	}
}

console.log(`Disabled per-verse TOC on ${updated} Rigveda sukta pages`);
