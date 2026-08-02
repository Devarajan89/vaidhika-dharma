export interface StructuredDataInput {
	title: string;
	description: string;
	canonicalUrl: string;
	siteUrl: string;
	siteName?: string;
	inLanguage: string;
	slug: string;
}

interface BreadcrumbItem {
	name: string;
	item: string;
}

const SEGMENT_LABELS: Record<string, string> = {
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
	'pancha-rudram': 'Pañca Rudram',
	'brahmanaspati-suktam': 'Brahmaṇaspati Sūktam',
	offline: 'Offline',
};

const CREATIVE_WORK_SERIES: Array<{ test: RegExp; name: string }> = [
	{ test: /(?:^|\/)rigveda-samhita(?:\/|$)/, name: 'Ṛgveda Śākala Saṃhitā' },
	{ test: /(?:^|\/)kanva-samhita(?:\/|$)/, name: 'Vājasaneyi Saṃhitā (Kāṇva)' },
	{ test: /(?:^|\/)madhyandina-samhita(?:\/|$)/, name: 'Vājasaneyi Saṃhitā (Mādhyandina)' },
	{ test: /(?:^|\/)taittiriya-samhita(?:\/|$)/, name: 'Taittirīya Saṃhitā' },
	{ test: /(?:^|\/)maitrayani-samhita(?:\/|$)/, name: 'Maitrāyaṇī Saṃhitā' },
	{ test: /(?:^|\/)aitareya-brahmana(?:\/|$)/, name: 'Aitareya Brāhmaṇa' },
	{ test: /(?:^|\/)taittiriya-brahmana(?:\/|$)/, name: 'Taittirīya Brāhmaṇa' },
	{ test: /(?:^|\/)aitareya-aranyaka(?:\/|$)/, name: 'Aitareya Āraṇyaka' },
	{ test: /(?:^|\/)taittiriya-aranyaka(?:\/|$)/, name: 'Taittirīya Āraṇyaka' },
	{ test: /(?:^|\/)[\w-]+-upanishad(?:\/|$)/, name: 'Upaniṣad' },
	{ test: /(?:^|\/)(?:sri-rudra|chamakam|purusha-suktam|narayana-suktam|sri-suktam|pancha-rudram|brahmanaspati)/, name: 'Veda Mantra Saṅgraha' },
	{ test: /sandhyavandanam|brahmayagyam|samidadhanam/, name: 'Nityakarma' },
];

function humanizeSegment(segment: string): string {
	if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];

	const mandala = segment.match(/^mandala-(\d+)$/);
	if (mandala) return `Maṇḍala ${mandala[1]}`;

	const kanda = segment.match(/^kanda-(\d+)$/);
	if (kanda) return `Kāṇḍa ${kanda[1]}`;

	const prapathaka = segment.match(/^prapathaka-(\d+)$/);
	if (prapathaka) return `Prapāṭhaka ${prapathaka[1]}`;

	const chapter = segment.match(/^chapter-(\d+)$/);
	if (chapter) return `Adhyāya ${Number(chapter[1])}`;

	const sukta = segment.match(/^sukta-(\d+)$/);
	if (sukta) return `Sūkta ${Number(sukta[1])}`;

	const panchika = segment.match(/^panchika-(\d+)$/);
	if (panchika) return `Pañcikā ${panchika[1]}`;

	const adhyaya = segment.match(/^adhyaya-(\d+)$/);
	if (adhyaya) return `Adhyāya ${adhyaya[1]}`;

	const prashna = segment.match(/^prashna-(\d+)$/);
	if (prashna) return `Praśna ${prashna[1]}`;

	const ashtaka = segment.match(/^ashtaka-(\d+)$/);
	if (ashtaka) return `Aṣṭaka ${ashtaka[1]}`;

	return segment
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function slugPath(slug: string): string {
	if (!slug || slug === 'index') return '';
	if (slug === 'iast/index') return 'iast';
	return slug.replace(/^\/+|\/+$/g, '');
}

export function buildBreadcrumbList(
	slug: string,
	pageTitle: string,
	siteUrl: string,
	canonicalUrl: string,
	siteName = 'Vaidhika Dharma'
): Record<string, unknown> {
	const path = slugPath(slug);
	const items: BreadcrumbItem[] = [{ name: siteName, item: new URL('/', siteUrl).href }];

	if (path) {
		const segments = path.split('/').filter(Boolean);
		let accumulated = '';
		segments.forEach((segment, index) => {
			accumulated += `${segment}/`;
			const isLast = index === segments.length - 1;
			items.push({
				name: isLast ? pageTitle : humanizeSegment(segment),
				item: isLast ? canonicalUrl : new URL(accumulated, siteUrl).href,
			});
		});
	}

	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map((entry, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: entry.name,
			item: entry.item,
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

	const series = CREATIVE_WORK_SERIES.find((entry) => entry.test.test(path));
	if (!series) return null;

	return {
		'@type': 'CreativeWork',
		name: title,
		description,
		url: canonicalUrl,
		inLanguage,
		isPartOf: {
			'@type': 'CreativeWorkSeries',
			name: series.name,
		},
		publisher: {
			'@type': 'Organization',
			name: 'Vaidhika Dharma',
			url: 'https://vaidhikadharma.org/',
		},
	};
}

export function buildPageJsonLd(input: StructuredDataInput): Record<string, unknown> {
	const siteName = input.siteName ?? 'Vaidhika Dharma';
	const webPage: Record<string, unknown> = {
		'@type': 'WebPage',
		'@id': `${input.canonicalUrl}#webpage`,
		name: input.title,
		description: input.description,
		url: input.canonicalUrl,
		inLanguage: input.inLanguage,
		isPartOf: {
			'@type': 'WebSite',
			name: siteName,
			url: input.siteUrl,
			description:
				'Vedic mantras, Rigveda and Yajurveda saṃhitās, nityakarma, and sūkta compilations with svara marks.',
		},
	};

	const breadcrumb = buildBreadcrumbList(
		input.slug,
		input.title,
		input.siteUrl,
		input.canonicalUrl,
		siteName
	);
	webPage.breadcrumb = { '@id': `${input.canonicalUrl}#breadcrumb` };
	breadcrumb['@id'] = `${input.canonicalUrl}#breadcrumb`;

	const graph: Record<string, unknown>[] = [webPage, breadcrumb];
	const creativeWork = buildCreativeWork(
		input.slug,
		input.title,
		input.description,
		input.canonicalUrl,
		input.inLanguage
	);
	if (creativeWork) {
		creativeWork['@id'] = `${input.canonicalUrl}#creativework`;
		webPage.mainEntity = { '@id': `${input.canonicalUrl}#creativework` };
		graph.push(creativeWork);
	}

	return {
		'@context': 'https://schema.org',
		'@graph': graph,
	};
}
