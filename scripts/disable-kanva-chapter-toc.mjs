import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const KANVA_DIRS = [
	'src/content/docs/samhitas/shukla-yajur/kanva-samhita',
	'src/content/docs/iast/samhitas/shukla-yajur/kanva-samhita',
];

const TOC_FALSE = 'tableOfContents: false';
const TOC_BLOCK = /tableOfContents:\s*\n\s*minHeadingLevel:\s*\d+\s*\n\s*maxHeadingLevel:\s*\d+/;

let updated = 0;

for (const relDir of KANVA_DIRS) {
	const dir = path.join(ROOT, relDir);
	for (const file of fs.readdirSync(dir)) {
		if (!/^chapter-\d+\.md$/.test(file)) continue;

		const filePath = path.join(dir, file);
		const content = fs.readFileSync(filePath, 'utf8');
		if (!TOC_BLOCK.test(content)) continue;

		fs.writeFileSync(filePath, content.replace(TOC_BLOCK, TOC_FALSE), 'utf8');
		updated++;
	}
}

console.log(`Disabled per-mantra TOC on ${updated} Kanva chapter pages`);
