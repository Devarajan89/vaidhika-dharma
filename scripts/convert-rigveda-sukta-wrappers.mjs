import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const BASES = [
	{ locale: 'root', dir: 'src/content/docs/samhitas/rigveda' },
	{ locale: 'iast', dir: 'src/content/docs/iast/samhitas/rigveda' },
];

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?\r?\n)---/;

/**
 * @param {string} content
 */
function extractFrontmatter(content) {
	const match = content.match(FRONTMATTER_RE);
	return match ? match[0] : '';
}

/**
 * @param {string} frontmatter
 */
function extractSlug(frontmatter) {
	const match = frontmatter.match(/^slug:\s*(.+)$/m);
	return match?.[1]?.trim() ?? '';
}

/**
 * @param {string} slug
 */
function parseMandalaSukta(slug) {
	const match = slug.match(/mandala-(\d+)\/sukta-(\d+)/);
	if (!match) return null;
	return { mandala: Number(match[1]), sukta: Number(match[2]) };
}

/**
 * @param {string} frontmatter
 */
function updateFrontmatterLabels(frontmatter) {
	return frontmatter
		.replace(/श्लोक/g, 'मन्त्र')
		.replace(/\bverses\b/gi, 'mantras')
		.replace(/\bverse\b/gi, 'mantra');
}

for (const { locale, dir } of BASES) {
	let converted = 0;
	const baseDir = path.join(ROOT, dir);

	for (let mandala = 1; mandala <= 10; mandala += 1) {
		const mandalaDir = path.join(baseDir, `Mandala_${String(mandala).padStart(2, '0')}`);
		if (!fs.existsSync(mandalaDir)) continue;

		for (const file of fs.readdirSync(mandalaDir)) {
			if (!/^sukta_\d+\.md$/.test(file)) continue;

			const mdPath = path.join(mandalaDir, file);
			const mdxPath = mdPath.replace(/\.md$/, '.mdx');
			const content = fs.readFileSync(mdPath, 'utf8');
			const frontmatter = updateFrontmatterLabels(extractFrontmatter(content));
			const slug = extractSlug(frontmatter);
			const ids = parseMandalaSukta(slug);
			if (!ids) {
				console.warn(`Skipping ${mdPath}: could not parse slug`);
				continue;
			}

			const body = [
				'',
				"import RigvedaSukta from '/src/components/content/RigvedaSukta.astro';",
				'',
				`<RigvedaSukta mandala={${ids.mandala}} sukta={${ids.sukta}} locale="${locale}" />`,
				'',
			].join('\n');

			fs.writeFileSync(mdxPath, frontmatter + body, 'utf8');
			fs.unlinkSync(mdPath);
			converted += 1;
		}
	}

	console.log(`${locale}: converted ${converted} sūkta pages in ${dir}`);
}
