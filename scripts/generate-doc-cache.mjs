import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'src/content/docs');
const OUTPUT = path.join(ROOT, 'src/data/doc-cache.json');

/**
 * @param {string} content
 */
function parseFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return null;

	const titleMatch = match[1].match(/^title:\s*(.+)$/m);
	const slugMatch = match[1].match(/^slug:\s*(.+)$/m);
	const lastUpdatedMatch = match[1].match(/^lastUpdated:\s*(.+)$/m);

	if (!titleMatch) return null;

	const title = titleMatch[1]
		.trim()
		.replace(/^['"]|['"]$/g, '')
		.replace(/^['"](.+)['"]$/, '$1');

	const slug = slugMatch
		? slugMatch[1]
				.trim()
				.replace(/^['"]|['"]$/g, '')
		: undefined;

	const lastUpdated = lastUpdatedMatch ? lastUpdatedMatch[1].trim() : undefined;

	return { title, slug, lastUpdated };
}

/**
 * @param {string} dir
 * @param {string} relative
 * @returns {string[]}
 */
function walkDocs(dir, relative = '') {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		if (entry.name.startsWith('_')) continue;
		const rel = relative ? `${relative}/${entry.name}` : entry.name;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...walkDocs(full, rel));
		} else if (/\.(md|mdx)$/.test(entry.name)) {
			files.push(rel);
		}
	}

	return files;
}

/**
 * @param {string} id
 */
function getEffectiveSlug(id, slug) {
	if (slug) {
		if (slug === 'index') return '';
		if (slug === 'iast/index') return 'iast';
		return slug;
	}
	if (id === 'index.md' || id === 'index.mdx') return '';
	const base = id.replace(/\.(md|mdx)$/, '');
	return base;
}

/**
 * @param {string} id
 */
function matchesLocale(id, locale) {
	const pathId = id.replace(/\.(md|mdx)$/, '');
	if (locale === 'root') return !pathId.startsWith('iast/') && !pathId.startsWith('ta/');
	return pathId.startsWith(`${locale}/`) || pathId === `${locale}/index`;
}

function isContentPage(id, title) {
	const pathId = id.replace(/\.(md|mdx)$/, '');
	if (pathId === 'index' || pathId === 'iast' || pathId === 'iast/index') return false;
	if (pathId.endsWith('-index')) return false;
	if (pathId.endsWith('/index') && title && /सूची/.test(title)) return false;
	return true;
}

function main() {
	const files = walkDocs(DOCS_DIR);
	const slugToTitle = {};
	const docs = [];

	for (const rel of files) {
		const content = fs.readFileSync(path.join(DOCS_DIR, rel), 'utf8');
		const meta = parseFrontmatter(content);
		if (!meta) continue;

		const id = rel.replace(/\.(md|mdx)$/, '');
		const effectiveSlug = getEffectiveSlug(rel, meta.slug);
		slugToTitle[effectiveSlug] = meta.title;

		if (meta.lastUpdated) {
			docs.push({
				id,
				slug: meta.slug,
				title: meta.title,
				lastUpdated: meta.lastUpdated,
			});
		}
	}

	const recentByLocale = {};
	for (const locale of ['root', 'iast']) {
		recentByLocale[locale] = docs
			.filter((doc) => matchesLocale(doc.id, locale) && isContentPage(doc.id, doc.title))
			.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
			.slice(0, 10)
			.map((doc) => ({
				title: doc.title,
				slug: doc.slug,
				id: doc.id,
				lastUpdated: doc.lastUpdated,
			}));
	}

	fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
	fs.writeFileSync(
		OUTPUT,
		JSON.stringify({ slugToTitle, recentByLocale }, null, 0),
		'utf8'
	);

	const searchIndex = Object.entries(slugToTitle).filter(([slug]) => {
		if (!slug || slug.includes('_archive')) return false;
		if (/(^|\/)(?:offline|search)$/.test(slug)) return false;
		return true;
	});
	fs.writeFileSync(
		path.join(ROOT, 'public/search-index.json'),
		JSON.stringify(searchIndex),
		'utf8'
	);

	console.log(`Generated doc cache: ${Object.keys(slugToTitle).length} slugs, ${docs.length} dated docs`);
}

main();
