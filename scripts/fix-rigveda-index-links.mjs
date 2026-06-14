import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const INDEX_PATHS = [
	'src/content/docs/samhitas/rigveda/index.md',
	'src/content/docs/iast/samhitas/rigveda/index.md',
];

const RIGVEDA_DIRS = [
	'src/content/docs/samhitas/rigveda',
	'src/content/docs/iast/samhitas/rigveda',
];

/**
 * @param {string} content
 */
function fixMainIndexLinks(content) {
	return content.replace(/\(Mandala_(\d+)\/\)/g, (_, mandala) => `(mandala-${Number(mandala)}/)`);
}

/**
 * @param {string} content
 */
function fixMandalaIndexLinks(content) {
	return content.replace(
		/Mandala_\d+\/sukta_(\d+)\.md#(verse-\d+)/g,
		(_, sukta, anchor) => `sukta-${Number(sukta)}#${anchor}`
	);
}

for (const indexPath of INDEX_PATHS) {
	const fullPath = path.join(ROOT, indexPath);
	const fixed = fixMainIndexLinks(fs.readFileSync(fullPath, 'utf8'));
	fs.writeFileSync(fullPath, fixed, 'utf8');
	console.log(`Fixed main index links: ${indexPath}`);
}

let mandalaFiles = 0;
for (const relDir of RIGVEDA_DIRS) {
	const dir = path.join(ROOT, relDir);
	for (let mandala = 1; mandala <= 10; mandala++) {
		const indexFile = path.join(dir, `Mandala_${String(mandala).padStart(2, '0')}`, 'index.md');
		if (!fs.existsSync(indexFile)) continue;
		const fixed = fixMandalaIndexLinks(fs.readFileSync(indexFile, 'utf8'));
		fs.writeFileSync(indexFile, fixed, 'utf8');
		mandalaFiles++;
	}
}

console.log(`Fixed sukta links in ${mandalaFiles} mandala index pages`);
