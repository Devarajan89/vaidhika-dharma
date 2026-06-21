/**
 * @param {string} value
 */
export function yamlQuote(value) {
	return `'${value.replace(/'/g, "''")}'`;
}

/**
 * @param {number} chapterNumber
 */
export function chapterFileName(chapterNumber) {
	return `chapter-${String(chapterNumber).padStart(2, '0')}.mdx`;
}

/**
 * @param {object} options
 * @param {'madhyandina' | 'kanva' | 'taittiriya'} options.component
 * @param {number} options.chapterNumber
 * @param {'root' | 'iast'} options.locale
 * @param {string} options.title
 * @param {string} options.slug
 * @param {string} options.sidebarLabel
 * @param {string} options.description
 * @param {string} options.outputPath
 * @param {boolean} [options.hiddenSidebar]
 */
export function renderSamhitaChapterMdx({
	component,
	chapterNumber,
	locale,
	title,
	slug,
	sidebarLabel,
	description,
	outputPath,
	hiddenSidebar = false,
}) {
	const componentImport =
		component === 'taittiriya'
			? "import TaittiriyaChapter from '/src/components/content/TaittiriyaChapter.astro';"
			: "import YajurvedaChapter from '/src/components/content/YajurvedaChapter.astro';";

	const componentTag =
		component === 'taittiriya'
			? `<TaittiriyaChapter chapter={${chapterNumber}} locale="${locale}" />`
			: `<YajurvedaChapter tradition="${component}" chapter={${chapterNumber}} locale="${locale}" />`;

	const frontmatter = [
		'---',
		`title: ${yamlQuote(title)}`,
		`slug: ${slug}`,
		'sidebar:',
		hiddenSidebar ? '  hidden: true' : `  label: ${yamlQuote(sidebarLabel)}`,
		!hiddenSidebar ? `  order: ${chapterNumber}` : null,
		'tableOfContents: false',
		`description: ${yamlQuote(description)}`,
		`lastUpdated: ${new Date().toISOString().slice(0, 10)}`,
		'---',
	]
		.filter((line) => line !== null)
		.join('\n');

	const body = [frontmatter, '', componentImport, '', componentTag, ''].join('\n');

	return body;
}
