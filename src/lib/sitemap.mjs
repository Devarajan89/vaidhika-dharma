import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HUB_RE =
	/\/(?:rigveda-samhita|kanva-samhita|madhyandina-samhita|taittiriya-samhita|maitrayani-samhita|aitareya-brahmana|taittiriya-brahmana|aitareya-aranyaka|taittiriya-aranyaka|[\w-]+-upanishad|[\w-]+-suktam|sri-rudra-prashnah|chamakam|aswalayana-[\w/-]+|apastamba-[\w/-]+)\/?$/;

const DOCS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../content/docs');

export const sitemapI18n = {
	defaultLocale: 'sa',
	locales: {
		sa: 'sa-Deva',
		iast: 'sa-Latn',
	},
};

export function sitemapFilter(page) {
	return !page.includes('/404') && !page.includes('/offline');
}

/**
 * @param {string} content
 */
function parseFrontmatterDates(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return null;

	const slugMatch = match[1].match(/^slug:\s*(.+)$/m);
	const lastUpdatedMatch = match[1].match(/^lastUpdated:\s*(.+)$/m);
	if (!lastUpdatedMatch) return null;

	const lastUpdated = lastUpdatedMatch[1].trim().replace(/^['"]|['"]$/g, '');
	const slug = slugMatch
		? slugMatch[1]
				.trim()
				.replace(/^['"]|['"]$/g, '')
		: undefined;

	return { slug, lastUpdated };
}

/**
 * @param {string} id
 * @param {string | undefined} slug
 */
function getEffectiveSlug(id, slug) {
	if (slug) {
		if (slug === 'index') return '';
		if (slug === 'iast/index') return 'iast';
		return slug;
	}
	if (id === 'index.md' || id === 'index.mdx') return '';
	return id.replace(/\.(md|mdx)$/, '');
}

/**
 * @param {string} slug
 */
function slugToPathname(slug) {
	if (!slug) return '/';
	if (slug === 'iast') return '/iast/';
	return `/${slug.replace(/^\/+|\/+$/g, '')}/`;
}

/**
 * @param {string} value
 */
function toLastmod(value) {
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return `${value}T00:00:00.000Z`;
	}
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function walkDocs(dir, relative = '') {
	if (!fs.existsSync(dir)) return [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
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

let lastmodByPath;

function getLastmodMap() {
	if (lastmodByPath) return lastmodByPath;

	lastmodByPath = new Map();
	for (const rel of walkDocs(DOCS_DIR)) {
		const content = fs.readFileSync(path.join(DOCS_DIR, rel), 'utf8');
		const meta = parseFrontmatterDates(content);
		if (!meta) continue;

		const pathname = slugToPathname(getEffectiveSlug(rel, meta.slug));
		const lastmod = toLastmod(meta.lastUpdated);
		if (!lastmod) continue;

		const existing = lastmodByPath.get(pathname);
		if (!existing || lastmod > existing) {
			lastmodByPath.set(pathname, lastmod);
		}
	}

	return lastmodByPath;
}

export function serializeSitemapItem(item) {
	let urlPath;
	try {
		urlPath = new URL(item.url).pathname;
	} catch {
		return undefined;
	}

	if (urlPath.includes('/offline') || urlPath.includes('/404')) return undefined;

	const depth = urlPath.split('/').filter(Boolean).length;
	const isHome = urlPath === '/' || urlPath === '/iast/';
	const isHub = depth <= 1 || HUB_RE.test(urlPath);
	const lastmod = getLastmodMap().get(urlPath) ?? getLastmodMap().get(urlPath.replace(/\/?$/, '/'));

	const serialized = {
		...item,
		changefreq: isHome || isHub ? 'weekly' : 'monthly',
		priority: isHome ? 1.0 : isHub ? 0.8 : Math.max(0.3, Number((0.65 - depth * 0.08).toFixed(1))),
	};

	if (lastmod) serialized.lastmod = lastmod;
	else delete serialized.lastmod;

	return serialized;
}
