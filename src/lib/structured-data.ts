import {
	isCollectionSlug,
	isHomeSlug,
	isIastSlug,
	isSearchSlug,
	localeHomePath,
	SITE_LOGO_PATH,
	SITE_LOGO_SIZE,
	SITE_ORIGIN,
	slugPath,
} from './seo';
import { sangrahaSegmentLabels } from '../data/sangraha';

export interface StructuredDataInput {
	title: string;
	description: string;
	canonicalUrl: string;
	siteUrl: string;
	siteName?: string;
	inLanguage: string;
	slug: string;
	dateModified?: string;
}

export interface BreadcrumbNavItem {
	name: string;
	href: string;
	current?: boolean;
}

const SEGMENT_LABELS: Record<string, string> = {
	...sangrahaSegmentLabels(),
	iast: 'IAST',
	nityakarma: 'Nityakarma',
	'aswalayana-sandhyavandanam': 'Aśvalāyana Sandhyāvandanam',
	'apastamba-sandhyavandanam': 'Āpastamba Sandhyāvandanam',
	'aswalayana-brahmayagyam': 'Aśvalāyana Brahmayajñam',
	'apastamba-brahmayagyam': 'Āpastamba Brahmayajñam',
	'aswalayana-samidadhanam': 'Aśvalāyana Samidādhānam',
	'apastamba-samidadhanam': 'Āpastamba Samidādhānam',
	prata: 'Prātaḥ',
	madhyahnika: 'Madhyāhnika',
	sayam: 'Sāyam',
	'rigveda-samhita': 'Ṛgveda Saṃhitā',
	'kanva-samhita': 'Kāṇva Saṃhitā',
	'madhyandina-samhita': 'Mādhyandina Saṃhitā',
	'taittiriya-samhita': 'Taittirīya Saṃhitā',
	'maitrayani-samhita': 'Maitrāyaṇī Saṃhitā',
	'aitareya-brahmana': 'Aitareya Brāhmaṇa',
	'taittiriya-brahmana': 'Taittirīya Brāhmaṇa',
	'aitareya-aranyaka': 'Aitareya Āraṇyaka',
	'taittiriya-aranyaka': 'Taittirīya Āraṇyaka',
	'isha-upanishad': 'Īśāvāsyopaniṣad',
	'kena-upanishad': 'Kenopaniṣad',
	'katha-upanishad': 'Kaṭhopaniṣad',
	'prashna-upanishad': 'Praśnopaniṣad',
	'taittiriya-upanishad': 'Taittirīyopaniṣad',
	'mahanarayana-upanishad': 'Mahānārāyaṇa Upaniṣad',
	'aitareya-upanishad': 'Aitareyopaniṣad',
	'sri-rudra-prashnah': 'Śrī Rudra Praśnaḥ',
	'sri-rudra-laghunyasa': 'Śrī Rudra Laghunyāsaḥ',
	chamakam: 'Chamakam',
	'purusha-suktam': 'Puruṣa Sūktam',
	'purusha-suktam-rig': 'Puruṣa Sūktam (Ṛgveda)',
	'sri-suktam': 'Śrī Sūktam',
	'narayana-suktam': 'Nārāyaṇa Sūktam',
	'durga-suktam': 'Durgā Sūktam',
	'medha-suktam': 'Medhā Sūktam',
	'vishnu-suktam': 'Viṣṇu Sūktam',
	'ganapathy-atharvasirsham': 'Gaṇapati Atharvaśīrṣam',
	'pancha-rudram': 'Pañca Rudram',
	'brahmanaspati-suktam': 'Brahmaṇaspati Sūktam',
	offline: 'Offline',
	search: 'Search',
};

const CREATIVE_WORK_SERIES: Array<{ test: RegExp; name: string; nameDeva: string }> = [
	{ test: /(?:^|\/)rigveda-samhita(?:\/|$)/, name: 'Śākala Saṃhitā (Ṛgveda)', nameDeva: 'शाकल संहिता (ऋग्वेद)' },
	{ test: /(?:^|\/)kanva-samhita(?:\/|$)/, name: 'Vājasaneyi Saṃhitā (Kāṇva)', nameDeva: 'वाजसनेयी संहिता (काण्व)' },
	{ test: /(?:^|\/)madhyandina-samhita(?:\/|$)/, name: 'Vājasaneyi Saṃhitā (Mādhyandina)', nameDeva: 'वाजसनेयी संहिता (माध्यन्दिन)' },
	{ test: /(?:^|\/)taittiriya-samhita(?:\/|$)/, name: 'Taittirīya Saṃhitā', nameDeva: 'तैत्तिरीय संहिता' },
	{ test: /(?:^|\/)maitrayani-samhita(?:\/|$)/, name: 'Maitrāyaṇī Saṃhitā', nameDeva: 'मैत्रायणी संहिता' },
	{ test: /(?:^|\/)aitareya-brahmana(?:\/|$)/, name: 'Aitareya Brāhmaṇa', nameDeva: 'ऐतरेय ब्राह्मणम्' },
	{ test: /(?:^|\/)taittiriya-brahmana(?:\/|$)/, name: 'Taittirīya Brāhmaṇa', nameDeva: 'तैत्तिरीय ब्राह्मणम्' },
	{ test: /(?:^|\/)aitareya-aranyaka(?:\/|$)/, name: 'Aitareya Āraṇyaka', nameDeva: 'ऐतरेय आरण्यकम्' },
	{ test: /(?:^|\/)taittiriya-aranyaka(?:\/|$)/, name: 'Taittirīya Āraṇyaka', nameDeva: 'तैत्तिरीय आरण्यकम्' },
	{ test: /(?:^|\/)[\w-]+-upanishad(?:\/|$)/, name: 'Upaniṣad', nameDeva: 'उपनिषद्' },
	{
		test: /(?:suktam|prashnah|chamakam|laghunyasa|atharvasirsham|prarthana|pancha-rudram)(?:\/|$)/,
		name: 'Veda Mantra Saṅgraha',
		nameDeva: 'वेद मन्त्र सङ्ग्रहः',
	},
	{ test: /sandhyavandanam|brahmayagyam|samidadhanam/, name: 'Nityakarma', nameDeva: 'नित्यकर्म' },
];

const SITE_DESCRIPTION =
	'Vedic mantras, Rigveda and Yajurveda saṃhitās, nityakarma, and sūkta compilations with svara marks.';

export function humanizeSegment(segment: string): string {
	if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];

	const patterns: Array<[RegExp, string]> = [
		[/^mandala-(\d+)$/, 'Maṇḍala'],
		[/^kanda-(\d+)$/, 'Kāṇḍa'],
		[/^prapathaka-(\d+)$/, 'Prapāṭhaka'],
		[/^sukta-(\d+)$/, 'Sūkta'],
		[/^panchika-(\d+)$/, 'Pañcikā'],
		[/^adhyaya-(\d+)$/, 'Adhyāya'],
		[/^prashna-(\d+)$/, 'Praśna'],
		[/^ashtaka-(\d+)$/, 'Aṣṭaka'],
		[/^aranyaka-(\d+)$/, 'Āraṇyaka'],
	];

	for (const [pattern, label] of patterns) {
		const match = segment.match(pattern);
		if (match) return `${label} ${Number(match[1])}`;
	}

	const chapter = segment.match(/^chapter-(\d+)(?:-index)?$/);
	if (chapter) return `Adhyāya ${Number(chapter[1])}`;

	return segment
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

export function getSeriesName(slug: string): string | null {
	const path = slugPath(slug);
	return CREATIVE_WORK_SERIES.find((entry) => entry.test.test(path))?.name ?? null;
}

export function getSeriesTitle(slug: string, isIast: boolean): string | null {
	const path = slugPath(slug);
	const series = CREATIVE_WORK_SERIES.find((entry) => entry.test.test(path));
	if (!series) return null;
	return isIast ? series.name : series.nameDeva;
}

export function getBreadcrumbItems(
	slug: string,
	pageTitle: string,
	siteUrl: string,
	canonicalUrl: string,
	siteName = 'Vaidhika Dharma'
): BreadcrumbNavItem[] {
	const path = slugPath(slug);
	const iast = isIastSlug(slug);
	const items: BreadcrumbNavItem[] = [
		{ name: siteName, href: new URL(localeHomePath(iast), siteUrl).href },
	];

	if (!path || path === 'iast') return items;

	const segments = path.split('/').filter(Boolean);
	const start = segments[0] === 'iast' ? 1 : 0;
	let accumulated = start === 1 ? 'iast/' : '';
	const visible = segments.slice(start);

	visible.forEach((segment, index) => {
		accumulated += `${segment}/`;
		const isLast = index === visible.length - 1;
		items.push({
			name: isLast ? pageTitle : humanizeSegment(segment),
			href: isLast ? canonicalUrl : new URL(accumulated, siteUrl).href,
			current: isLast,
		});
	});

	return items;
}

export function buildBreadcrumbList(
	slug: string,
	pageTitle: string,
	siteUrl: string,
	canonicalUrl: string,
	siteName = 'Vaidhika Dharma'
): Record<string, unknown> | null {
	const items = getBreadcrumbItems(slug, pageTitle, siteUrl, canonicalUrl, siteName);
	if (items.length < 2) return null;

	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map((entry, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: entry.name,
			item: entry.href,
		})),
	};
}

export function buildCreativeWork(
	slug: string,
	title: string,
	description: string,
	canonicalUrl: string,
	inLanguage: string
): Record<string, unknown> | null {
	const path = slugPath(slug);
	if (!path || path === 'iast') return null;

	const seriesName = getSeriesName(slug);
	if (!seriesName) return null;

	return {
		'@type': isCollectionSlug(slug) ? 'CollectionPage' : 'CreativeWork',
		name: title,
		description,
		url: canonicalUrl,
		inLanguage,
		isPartOf: {
			'@type': 'CreativeWorkSeries',
			name: seriesName,
		},
		publisher: {
			'@id': 'https://vaidhikadharma.org/#organization',
		},
	};
}

function buildOrganization(): Record<string, unknown> {
	return {
		'@type': 'Organization',
		'@id': 'https://vaidhikadharma.org/#organization',
		name: 'Vaidhika Dharma',
		url: 'https://vaidhikadharma.org/',
		logo: {
			'@type': 'ImageObject',
			url: `${SITE_ORIGIN}${SITE_LOGO_PATH}`,
			width: SITE_LOGO_SIZE,
			height: SITE_LOGO_SIZE,
		},
		email: 'contact@vaidhikadharma.org',
	};
}

function buildWebSite(siteUrl: string, siteName: string): Record<string, unknown> {
	return {
		'@type': 'WebSite',
		'@id': `${siteUrl}#website`,
		name: siteName,
		url: siteUrl,
		description: SITE_DESCRIPTION,
		inLanguage: ['sa-Deva', 'sa-Latn'],
		publisher: { '@id': 'https://vaidhikadharma.org/#organization' },
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${SITE_ORIGIN}/search/?q={search_term_string}`,
			},
			'query-input': 'required name=search_term_string',
		},
	};
}

export function buildPageJsonLd(input: StructuredDataInput): Record<string, unknown> {
	const siteName = input.siteName ?? 'Vaidhika Dharma';
	const organization = buildOrganization();
	const website = buildWebSite(input.siteUrl, siteName);
	const pageType = isHomeSlug(input.slug)
		? 'WebPage'
		: isSearchSlug(input.slug)
			? 'SearchResultsPage'
			: isCollectionSlug(input.slug)
			? 'CollectionPage'
			: 'WebPage';

	const webPage: Record<string, unknown> = {
		'@type': pageType,
		'@id': `${input.canonicalUrl}#webpage`,
		name: input.title,
		description: input.description,
		url: input.canonicalUrl,
		inLanguage: input.inLanguage,
		isPartOf: { '@id': `${input.siteUrl}#website` },
		publisher: { '@id': 'https://vaidhikadharma.org/#organization' },
	};

	if (input.dateModified) {
		webPage.dateModified = input.dateModified;
	}

	const graph: Record<string, unknown>[] = [organization, website, webPage];

	const breadcrumb = buildBreadcrumbList(
		input.slug,
		input.title,
		input.siteUrl,
		input.canonicalUrl,
		siteName
	);
	if (breadcrumb) {
		breadcrumb['@id'] = `${input.canonicalUrl}#breadcrumb`;
		webPage.breadcrumb = { '@id': `${input.canonicalUrl}#breadcrumb` };
		graph.push(breadcrumb);
	}

	const creativeWork = buildCreativeWork(
		input.slug,
		input.title,
		input.description,
		input.canonicalUrl,
		input.inLanguage
	);
	if (creativeWork && pageType !== 'CollectionPage') {
		creativeWork['@id'] = `${input.canonicalUrl}#creativework`;
		webPage.mainEntity = { '@id': `${input.canonicalUrl}#creativework` };
		graph.push(creativeWork);
	}

	return {
		'@context': 'https://schema.org',
		'@graph': graph,
	};
}
