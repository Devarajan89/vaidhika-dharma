import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const INDEX_PATHS = [
	'src/content/docs/samhitas/shukla-yajur/kanva-samhita/index.md',
	'src/content/docs/iast/samhitas/shukla-yajur/kanva-samhita/index.md',
];

const CHAPTER_COUNTS = {
	1: 49, 2: 60, 3: 76, 4: 49, 5: 55, 6: 50, 7: 40, 8: 32, 9: 46, 10: 43,
	11: 47, 12: 85, 13: 116, 14: 65, 15: 35, 16: 85, 17: 64, 18: 84, 19: 43, 20: 46,
	21: 66, 22: 75, 23: 60, 24: 47, 25: 67, 26: 44, 27: 45, 28: 14, 29: 50, 30: 46,
	31: 51, 32: 84, 33: 46, 34: 22, 35: 55, 36: 24, 37: 20, 38: 27, 39: 12, 40: 18,
};

/**
 * @param {string} content
 */
function extractFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	return match ? match[0] : '';
}

/**
 * @param {string} content
 * @param {number} chapter
 * @param {'root' | 'iast'} locale
 */
function extractChapterSection(content, chapter, locale) {
	const heading =
		locale === 'iast' ? `## Adhyāya ${chapter}` : `## अध्याय ${chapter}`;
	const anchorHeading = `${heading} {#chapter-${chapter}}`;
	const plainHeading = heading;

	let start = content.indexOf(anchorHeading);
	if (start === -1) start = content.indexOf(plainHeading);
	if (start === -1) return null;

	const next = content.indexOf('\n## ', start + heading.length);
	const section = next === -1 ? content.slice(start) : content.slice(start, next);
	return section.trim() + '\n';
}

/**
 * @param {number} chapter
 * @param {'root' | 'iast'} locale
 */
function renderChapterIndexFrontmatter(chapter, locale) {
	const slugPrefix = locale === 'iast' ? 'iast/kanva-samhita' : 'kanva-samhita';
	const count = CHAPTER_COUNTS[chapter];
	const fileNum = String(chapter).padStart(2, '0');

	if (locale === 'iast') {
		return [
			'---',
			`title: 'Adhyāya ${chapter} — Mantra Index'`,
			`slug: ${slugPrefix}/chapter-${chapter}-index`,
			'sidebar:',
			'  hidden: true',
			'tableOfContents: false',
			`description: 'Kanva Saṃhitā — Adhyāya ${chapter} mantra index (${count} mantras).'`,
			'lastUpdated: 2026-06-14',
			'---',
		].join('\n');
	}

	return [
		'---',
		`title: 'अध्याय ${chapter} — मन्त्र सूची'`,
		`slug: ${slugPrefix}/chapter-${chapter}-index`,
		'sidebar:',
		'  hidden: true',
		'tableOfContents: false',
		`description: 'काण्व संहिता — अध्याय ${chapter} मन्त्र सूची (${count} मन्त्राः).'`,
		'lastUpdated: 2026-06-14',
		'---',
	].join('\n');
}

/**
 * @param {string} frontmatter
 * @param {'root' | 'iast'} locale
 */
function renderMainIndex(frontmatter, locale) {
	const isIast = locale === 'iast';
	const fm = frontmatter.replace(
		/tableOfContents:\s*\n\s*minHeadingLevel:\s*\d+\s*\n\s*maxHeadingLevel:\s*\d+/,
		'tableOfContents: false'
	);

	const lines = [
		fm,
		'',
		isIast ? '# Vājasaneyi Kanva Saṃhitā — Index' : '# शुक्लयजुः काण्वसंहिता — सूची',
		'',
		isIast
			? 'Browse all adhyāyas of the Kanva Saṃhitā. Select an adhyāya to view its mantra index.'
			: 'काण्वसंहितायाः चत्वारिंशत् अध्यायाः। मन्त्र सूची द्रष्टुं अध्यायं चिनुत।',
		'',
		isIast ? '## Adhyāyas' : '## अध्यायाः',
		'',
		isIast ? '| Adhyāya | Mantras | Index |' : '| अध्याय | मन्त्राः | सूची |',
		isIast ? '|--------:|--------:|:-----|' : '|--------:|--------:|:----|',
	];

	for (let chapter = 1; chapter <= 40; chapter++) {
		const fileNum = String(chapter).padStart(2, '0');
		const count = CHAPTER_COUNTS[chapter];
		const indexFile = `chapter-${fileNum}-index`;
		const chapterFile = `chapter-${fileNum}`;
		const indexLabel = isIast ? 'Mantra index' : 'मन्त्र सूची';
		lines.push(
			`| [${chapter}](${chapterFile}/) | ${count} | [${indexLabel}](${indexFile}/) |`
		);
	}

	lines.push('');
	return lines.join('\n');
}

function splitIndex(indexPath) {
	const locale = indexPath.includes('/iast/') ? 'iast' : 'root';
	const fullPath = path.join(ROOT, indexPath);
	const content = fs.readFileSync(fullPath, 'utf8');
	const frontmatter = extractFrontmatter(content);
	const baseDir = path.dirname(fullPath);

	for (let chapter = 1; chapter <= 40; chapter++) {
		const section = extractChapterSection(content, chapter, locale);
		if (!section) {
			console.warn(`No section for chapter ${chapter} in ${indexPath}`);
			continue;
		}

		const fileNum = String(chapter).padStart(2, '0');
		const chapterIndex = [
			renderChapterIndexFrontmatter(chapter, locale),
			'',
			section,
		].join('\n');

		fs.writeFileSync(path.join(baseDir, `chapter-${fileNum}-index.md`), chapterIndex, 'utf8');
	}

	fs.writeFileSync(fullPath, renderMainIndex(frontmatter, locale), 'utf8');
	console.log(`Split ${indexPath} → 40 chapter index pages`);
}

for (const indexPath of INDEX_PATHS) {
	splitIndex(indexPath);
}
