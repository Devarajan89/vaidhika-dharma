import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const RIGVEDA_DIRS = [
	'src/content/docs/samhitas/rigveda',
	'src/content/docs/iast/samhitas/rigveda',
];

let updated = 0;

for (const relDir of RIGVEDA_DIRS) {
	const dir = path.join(ROOT, relDir);
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (!entry.isDirectory() || !entry.name.startsWith('Mandala_')) continue;

		const mandalaDir = path.join(dir, entry.name);
		for (const file of fs.readdirSync(mandalaDir)) {
			if (!/^sukta_\d+\.md$/.test(file)) continue;

			const filePath = path.join(mandalaDir, file);
			let content = fs.readFileSync(filePath, 'utf8');
			if (/sidebar:\s*\n[^]*?hidden:\s*true/.test(content)) continue;

			const next = content.replace(
				/(sidebar:\s*\n(?:\s+.+\n)*?)(\s+order:\s*\d+)/,
				'$1$2\n  hidden: true'
			);

			if (next === content) continue;
			fs.writeFileSync(filePath, next, 'utf8');
			updated++;
		}
	}
}

console.log(`Hidden ${updated} Rigveda sukta pages from sidebar`);
