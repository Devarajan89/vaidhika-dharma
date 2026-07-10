import type { HomeLocale } from './home';
import { AITAREYA_PANCHIKAS } from '../../scripts/lib/aitareya-brahmana-structure.mjs';
import { TAITTIRIYA_BRAHMANA_ASHTAKAS, getPrapathakaDisplayLabel } from '../../scripts/lib/taittiriya-brahmana-structure.mjs';
import {
	TAITTIRIYA_ARANYAKA_PRASHNAS,
	getPrashnaDisplayLabel,
} from '../../scripts/lib/taittiriya-aranyaka-structure.mjs';
import {
	AITAREYA_ARANYAKAS,
	AITAREYA_ARANYAKA_ADHYAYAS,
} from '../../scripts/lib/aitareya-aranyaka-structure.mjs';

export interface CategoryBadge {
	text: string;
	variant?: 'danger' | 'note' | 'caution' | 'success' | 'tip' | 'default';
}

export interface CategoryNode {
	label: string;
	href?: string;
	badge?: CategoryBadge;
	children?: CategoryNode[];
	defaultOpen?: boolean;
}

const RIGVEDA_MANDALA_LABELS = {
	root: [
		'प्रथम मण्डल',
		'द्वितीय मण्डल',
		'तृतीय मण्डल',
		'चतुर्थ मण्डल',
		'पञ्चम मण्डल',
		'षष्ठ मण्डल',
		'सप्तम मण्डल',
		'अष्टम मण्डल',
		'नवम मण्डल',
		'दशम मण्डल',
	],
	iast: [
		'Prathama Maṇḍala',
		'Dvitīya Maṇḍala',
		'Tṛtīya Maṇḍala',
		'Caturtha Maṇḍala',
		'Pañcama Maṇḍala',
		'Ṣaṣṭha Maṇḍala',
		'Saptama Maṇḍala',
		'Aṣṭama Maṇḍala',
		'Navama Maṇḍala',
		'Daśama Maṇḍala',
	],
} as const;

function rigvedaSamhitaMandalas(locale: keyof typeof RIGVEDA_MANDALA_LABELS): CategoryNode[] {
	const prefix = locale === 'iast' ? '/iast/rigveda-samhita' : '/rigveda-samhita';
	return [
		{ label: locale === 'iast' ? 'Saṃpūrṇa sūcī' : 'संपूर्ण सूची', href: `${prefix}/` },
		...RIGVEDA_MANDALA_LABELS[locale].map((label, index) => ({
			label,
			href: `${prefix}/mandala-${index + 1}/`,
		})),
	];
}

const rigvedaShakalaSamhitaMandalas = rigvedaSamhitaMandalas('root');

const SAMHITA_ADHYAYA_COUNT = 40;

function formatAdhyayaSlug(chapter: number): string {
	return `chapter-${String(chapter).padStart(2, '0')}`;
}

function samhitaAdhyayas(samhita: 'kanva' | 'madhyandina', locale: 'root' | 'iast'): CategoryNode[] {
	const prefix = locale === 'iast' ? `/iast/${samhita}-samhita` : `/${samhita}-samhita`;
	return [
		{ label: locale === 'iast' ? 'Saṃpūrṇa sūcī' : 'संपूर्ण सूची', href: `${prefix}/` },
		...Array.from({ length: SAMHITA_ADHYAYA_COUNT }, (_, index) => {
			const adhyaya = index + 1;
			return {
				label: locale === 'iast' ? `Adhyāya ${adhyaya}` : `अध्याय ${adhyaya}`,
				href: `${prefix}/${formatAdhyayaSlug(adhyaya)}/`,
			};
		}),
	];
}

const madhyandinaSamhitaChapters = samhitaAdhyayas('madhyandina', 'root');
const iastMadhyandinaSamhitaChapters = samhitaAdhyayas('madhyandina', 'iast');
const kanvaSamhitaChapters = samhitaAdhyayas('kanva', 'root');
const iastKanvaSamhitaChapters = samhitaAdhyayas('kanva', 'iast');

const TAITTIRIYA_KANDA_LABELS = {
	root: [
		'प्रथम काण्ड',
		'द्वितीय काण्ड',
		'तृतीय काण्ड',
		'चतुर्थ काण्ड',
		'पञ्चम काण्ड',
		'षष्ठ काण्ड',
		'सप्तम काण्ड',
	],
	iast: [
		'Prathama kāṇḍa',
		'Dvitīya kāṇḍa',
		'Tṛtīya kāṇḍa',
		'Caturtha kāṇḍa',
		'Pañcama kāṇḍa',
		'Ṣaṣṭha kāṇḍa',
		'Saptama kāṇḍa',
	],
} as const;

function taittiriyaSamhitaChapters(locale: keyof typeof TAITTIRIYA_KANDA_LABELS): CategoryNode[] {
	const prefix = locale === 'iast' ? '/iast/taittiriya-samhita' : '/taittiriya-samhita';

	return [
		{ label: locale === 'iast' ? 'Saṃpūrṇa sūcī' : 'संपूर्ण सूची', href: `${prefix}/` },
		...TAITTIRIYA_KANDA_LABELS[locale].map((label, index) => ({
			label,
			href: `${prefix}/kanda-${index + 1}/`,
		})),
	];
}

const taittiriyaSamhitaPrapathakas = taittiriyaSamhitaChapters('root');
const iastTaittiriyaSamhitaPrapathakas = taittiriyaSamhitaChapters('iast');

const MAITRAYANI_KANDA_LABELS = {
	root: ['प्रथम काण्ड', 'द्वितीय काण्ड', 'तृतीय काण्ड', 'चतुर्थ काण्ड (खिल)'],
	iast: [
		'Prathama kāṇḍa',
		'Dvitīya kāṇḍa',
		'Tṛtīya kāṇḍa',
		'Caturtha kāṇḍa (Khila)',
	],
} as const;

function maitrayaniSamhitaChapters(locale: keyof typeof MAITRAYANI_KANDA_LABELS): CategoryNode[] {
	const prefix = locale === 'iast' ? '/iast/maitrayani-samhita' : '/maitrayani-samhita';

	return [
		{ label: locale === 'iast' ? 'Saṃpūrṇa sūcī' : 'संपूर्ण सूची', href: `${prefix}/` },
		...MAITRAYANI_KANDA_LABELS[locale].map((label, index) => ({
			label,
			href: `${prefix}/kanda-${index + 1}/`,
		})),
	];
}

const maitrayaniSamhitaPrapathakas = maitrayaniSamhitaChapters('root');
const iastMaitrayaniSamhitaPrapathakas = maitrayaniSamhitaChapters('iast');

function aitareyaBrahmanaPanchikas(locale: 'root' | 'iast'): CategoryNode[] {
	const prefix = locale === 'iast' ? '/iast/aitareya-brahmana' : '/aitareya-brahmana';

	return [
		{ label: locale === 'iast' ? 'Saṃpūrṇa sūcī' : 'संपूर्ण सूची', href: `${prefix}/` },
		...AITAREYA_PANCHIKAS.map((panchikaInfo) => ({
			label: locale === 'iast' ? panchikaInfo.iastLabel : panchikaInfo.rootLabel,
			href: `${prefix}/panchika-${panchikaInfo.panchika}/`,
			children: Array.from({ length: panchikaInfo.adhyayaCount }, (_, index) => {
				const adhyaya = index + 1;
				return {
					label: locale === 'iast' ? `Adhyāya ${adhyaya}` : `अध्याय ${adhyaya}`,
					href: `${prefix}/panchika-${panchikaInfo.panchika}/adhyaya-${adhyaya}/`,
				};
			}),
		})),
	];
}

const aitareyaBrahmanaPanchikasRoot = aitareyaBrahmanaPanchikas('root');
const aitareyaBrahmanaPanchikasIast = aitareyaBrahmanaPanchikas('iast');

function taittiriyaBrahmanaAshtakas(locale: 'root' | 'iast'): CategoryNode[] {
	const prefix = locale === 'iast' ? '/iast/taittiriya-brahmana' : '/taittiriya-brahmana';

	return [
		{ label: locale === 'iast' ? 'Saṃpūrṇa sūcī' : 'संपूर्ण सूची', href: `${prefix}/` },
		...TAITTIRIYA_BRAHMANA_ASHTAKAS.map((ashtakaInfo) => ({
			label: locale === 'iast' ? ashtakaInfo.iastLabel : ashtakaInfo.rootLabel,
			href: `${prefix}/ashtaka-${ashtakaInfo.ashtaka}/`,
			children: Array.from({ length: ashtakaInfo.prapathakaCount }, (_, index) => {
				const prapathaka = index + 1;
				return {
					label: getPrapathakaDisplayLabel(ashtakaInfo.ashtaka, prapathaka, locale),
					href: `${prefix}/ashtaka-${ashtakaInfo.ashtaka}/prapathaka-${prapathaka}/`,
				};
			}),
		})),
	];
}

const taittiriyaBrahmanaAshtakasRoot = taittiriyaBrahmanaAshtakas('root');
const taittiriyaBrahmanaAshtakasIast = taittiriyaBrahmanaAshtakas('iast');

function taittiriyaAranyakaPrashnas(locale: 'root' | 'iast'): CategoryNode[] {
	const prefix = locale === 'iast' ? '/iast/taittiriya-aranyaka' : '/taittiriya-aranyaka';
	return [
		{ label: locale === 'iast' ? 'Saṃpūrṇa sūcī' : 'संपूर्ण सूची', href: `${prefix}/` },
		...TAITTIRIYA_ARANYAKA_PRASHNAS.map((info) => ({
			label: getPrashnaDisplayLabel(info.prashna, locale),
			href: `${prefix}/prashna-${info.prashna}/`,
		})),
	];
}

const taittiriyaAranyakaPrashnasRoot = taittiriyaAranyakaPrashnas('root');
const taittiriyaAranyakaPrashnasIast = taittiriyaAranyakaPrashnas('iast');

function aitareyaAranyakaSections(locale: 'root' | 'iast'): CategoryNode[] {
	const prefix = locale === 'iast' ? '/iast/aitareya-aranyaka' : '/aitareya-aranyaka';
	return [
		{ label: locale === 'iast' ? 'Saṃpūrṇa sūcī' : 'संपूर्ण सूची', href: `${prefix}/` },
		...AITAREYA_ARANYAKAS.map((aranyakaInfo) => ({
			label: locale === 'iast' ? aranyakaInfo.iastLabel : aranyakaInfo.rootLabel,
			defaultOpen: false,
			children: [
				{
					label: locale === 'iast' ? 'Overview' : 'सूची',
					href: `${prefix}/aranyaka-${aranyakaInfo.aranyaka}/`,
				},
				...AITAREYA_ARANYAKA_ADHYAYAS.filter(
					(entry) => entry.aranyaka === aranyakaInfo.aranyaka
				).map((entry) => ({
					label:
						locale === 'iast'
							? entry.iastLabel.split(', ').slice(1).join(', ') || entry.iastLabel
							: entry.rootLabel.split(', ').slice(1).join(', ') || entry.rootLabel,
					href: `${prefix}/aranyaka-${entry.aranyaka}/adhyaya-${entry.adhyaya}/`,
				})),
			],
		})),
	];
}

const aitareyaAranyakaSectionsRoot = aitareyaAranyakaSections('root');
const aitareyaAranyakaSectionsIast = aitareyaAranyakaSections('iast');

const iastRigvedaShakalaSamhitaMandalas = rigvedaSamhitaMandalas('iast');

const rigvedaSuktaSangraha: CategoryNode[] = [
	{ label: 'ब्रह्मणस्पति सूक्तम्', href: '/brahmanaspati-suktam/' },
	{ label: 'गणपति सूक्तम्', href: '/ganapathy-suktam/' },
	{ label: 'पञ्च रुद्रम्', href: '/pancha-rudram/' },
	{ label: 'स्वस्ति सूक्तम्', href: '/swasti-suktam/' },
	{ label: 'आ नो भद्राः सूक्तम्', href: '/a-no-bhadrauh-suktam/' },
	{ label: 'औषधि सूक्तम्', href: '/oshadhi-suktam/' },
	{ label: 'कुमार सूक्तम्', href: '/kumara-suktam/' },
	{ label: 'देवी सूक्तम्', href: '/devi-suktam/' },
	{ label: 'नासदीय सूक्तम्', href: '/nasadiya-suktam/' },
	{ label: 'पितृ सूक्तम्', href: '/pitri-suktam/' },
	{ label: 'पुरुष सूक्तम् (ऋग्वेद)', href: '/purusha-suktam-rig/' },
	{ label: 'भाग्य (भग) सूक्तम्', href: '/bhaga-suktam/' },
	{ label: 'मन्यु सूक्तम्', href: '/manyu-suktam/' },
	{ label: 'रात्रि सूक्तम्', href: '/ratri-suktam/' },
	{ label: 'वास्तु सूक्तम्', href: '/vastu-suktam/' },
	{ label: 'श्रद्धा सूक्तम्', href: '/shraddha-suktam/' },
	{ label: 'सरस्वती सूक्तम्', href: '/sarasvati-suktam/' },
	{ label: 'संज्ञान सूक्तम्', href: '/samjnana-suktam/' },
	{ label: 'हिरण्यगर्भ सूक्तम्', href: '/hiranyagarbha-suktam/' },
];

const yajushaMantraRatnakaram: CategoryNode[] = [
	{ label: 'भाग्य सूक्तम्', href: '/bhagya-suktam/' },
	{ label: 'भू सूक्तम्', href: '/bhu-suktam/' },
	{ label: 'ब्रह्म सूक्तम्', href: '/brahma-suktam/' },
	{ label: 'दुर्गा सूक्तम्', href: '/durga-suktam/' },
	{ label: 'गणपति अथर्वशीर्षं', href: '/ganapathy-atharvasirsham/' },
	{ label: 'गणेश प्रार्थना', href: '/ganesha-prarthana/' },
	{ label: 'मेधा सूक्तम्', href: '/medha-suktam/' },
	{ label: 'नारायण सूक्तम्', href: '/narayana-suktam/' },
	{ label: 'नवग्रह सूक्तम्', href: '/navagraha-suktam/' },
	{ label: 'नीळा सूक्तम्', href: '/nila-suktam/' },
	{ label: 'पवमान सूक्तम्', href: '/pavamana-suktam/' },
	{ label: 'पुरुष सूक्तम्', href: '/purusha-suktam/' },
	{ label: 'श्री रुद्र लघुन्यासः', href: '/sri-rudra-laghunyasa/' },
	{ label: 'श्री रुद्र प्रश्नः', href: '/sri-rudra-prashnah/' },
	{ label: 'चमक प्रश्नः', href: '/chamakam/' },
	{ label: 'रुद्र सूक्तम्', href: '/rudra-suktam/' },
	{ label: 'सरस्वती प्रार्थना', href: '/saraswathi-prarthana/' },
	{ label: 'सर्प सूक्तम्', href: '/sarpa-suktam/' },
	{ label: 'श्री सूक्तम्', href: '/sri-suktam/' },
	{ label: 'वाक् सूक्तम्', href: '/vak-suktam/' },
	{ label: 'विष्णु सूक्तम्', href: '/vishnu-suktam/' },
];

const iastRigvedaSuktaSangraha: CategoryNode[] = [
	{ label: 'Brahmaṇaspati Sūktam', href: '/iast/brahmanaspati-suktam/' },
	{ label: 'Gaṇapati Sūktam', href: '/iast/ganapathy-suktam/' },
	{ label: 'Pañca Rudram', href: '/iast/pancha-rudram/' },
	{ label: 'Svasti Sūktam', href: '/iast/swasti-suktam/' },
	{ label: 'Ā no bhadrāḥ Sūktam', href: '/iast/a-no-bhadrauh-suktam/' },
	{ label: 'Auṣadhi Sūktam', href: '/iast/oshadhi-suktam/' },
	{ label: 'Kumāra Sūktam', href: '/iast/kumara-suktam/' },
	{ label: 'Devī Sūktam', href: '/iast/devi-suktam/' },
	{ label: 'Nāsadīya Sūktam', href: '/iast/nasadiya-suktam/' },
	{ label: 'Pitṛ Sūktam', href: '/iast/pitri-suktam/' },
	{ label: 'Puruṣa Sūktam (Ṛgveda)', href: '/iast/purusha-suktam-rig/' },
	{ label: 'Bhāgya (Bhaga) Sūktam', href: '/iast/bhaga-suktam/' },
	{ label: 'Manyu Sūktam', href: '/iast/manyu-suktam/' },
	{ label: 'Rātri Sūktam', href: '/iast/ratri-suktam/' },
	{ label: 'Vāstu Sūktam', href: '/iast/vastu-suktam/' },
	{ label: 'Śraddhā Sūktam', href: '/iast/shraddha-suktam/' },
	{ label: 'Sarasvatī Sūktam', href: '/iast/sarasvati-suktam/' },
	{ label: 'Saṃjñāna Sūktam', href: '/iast/samjnana-suktam/' },
	{ label: 'Hiraṇyagarbha Sūktam', href: '/iast/hiranyagarbha-suktam/' },
];

const iastYajushaMantraRatnakaram: CategoryNode[] = [
	{ label: 'Bhāgya Sūktam', href: '/iast/bhagya-suktam/' },
	{ label: 'Bhū Sūktam', href: '/iast/bhu-suktam/' },
	{ label: 'Brahma Sūktam', href: '/iast/brahma-suktam/' },
	{ label: 'Durgā Sūktam', href: '/iast/durga-suktam/' },
	{ label: 'Gaṇapati Atharvaśīrṣam', href: '/iast/ganapathy-atharvasirsham/' },
	{ label: 'Gaṇeśa Prārthanā', href: '/iast/ganesha-prarthana/' },
	{ label: 'Medhā Sūktam', href: '/iast/medha-suktam/' },
	{ label: 'Nārāyaṇa Sūktam', href: '/iast/narayana-suktam/' },
	{ label: 'Navagraha Sūktam', href: '/iast/navagraha-suktam/' },
	{ label: 'Nīlā Sūktam', href: '/iast/nila-suktam/' },
	{ label: 'Pavamāna Sūktam', href: '/iast/pavamana-suktam/' },
	{ label: 'Puruṣa Sūktam', href: '/iast/purusha-suktam/' },
	{ label: 'Śrī Rudra Laghunyāsaḥ', href: '/iast/sri-rudra-laghunyasa/' },
	{ label: 'Śrī Rudra Praśnaḥ', href: '/iast/sri-rudra-prashnah/' },
	{ label: 'Camakam', href: '/iast/chamakam/' },
	{ label: 'Rudra Sūktam', href: '/iast/rudra-suktam/' },
	{ label: 'Sarasvatī Prārthanā', href: '/iast/saraswathi-prarthana/' },
	{ label: 'Sarpa Sūktam', href: '/iast/sarpa-suktam/' },
	{ label: 'Śrī Sūktam', href: '/iast/sri-suktam/' },
	{ label: 'Vāk Sūktam', href: '/iast/vak-suktam/' },
	{ label: 'Viṣṇu Sūktam', href: '/iast/vishnu-suktam/' },
];

const sandhyaTimeLinks = {
	root: {
		aswalayana: [
			{ label: 'प्रातः सन्ध्या', href: '/aswalayana-sandhyavandanam/prata/' },
			{ label: 'माध्यान्हिकम्', href: '/aswalayana-sandhyavandanam/madhyahnika/' },
			{ label: 'सायं सन्ध्या', href: '/aswalayana-sandhyavandanam/sayam/' },
		],
		apastamba: [
			{ label: 'प्रातः सन्ध्या', href: '/apastamba-sandhyavandanam/prata/' },
			{ label: 'माध्यान्हिकम्', href: '/apastamba-sandhyavandanam/madhyahnika/' },
			{ label: 'सायं सन्ध्या', href: '/apastamba-sandhyavandanam/sayam/' },
		],
	},
	iast: {
		aswalayana: [
			{ label: 'Prataḥ sandhyā', href: '/iast/aswalayana-sandhyavandanam/prata/' },
			{ label: 'Madhyāhnika', href: '/iast/aswalayana-sandhyavandanam/madhyahnika/' },
			{ label: 'Sāyam sandhyā', href: '/iast/aswalayana-sandhyavandanam/sayam/' },
		],
		apastamba: [
			{ label: 'Prataḥ sandhyā', href: '/iast/apastamba-sandhyavandanam/prata/' },
			{ label: 'Madhyāhnika', href: '/iast/apastamba-sandhyavandanam/madhyahnika/' },
			{ label: 'Sāyam sandhyā', href: '/iast/apastamba-sandhyavandanam/sayam/' },
		],
	},
} as const;

export const categoryTrees: Record<HomeLocale, CategoryNode[]> = {
	root: [
		{
			label: 'नित्यकर्म​',
			defaultOpen: true,
			children: [
				{
					label: 'ब्रह्मयज्ञम्',
					defaultOpen: false,
					children: [
						{ label: 'आश्वलायन (ऋग्वेद)', href: '/aswalayana-brahmayagyam/' },
					],
				},
				{
					label: 'सन्ध्यावन्दनम्​',
					defaultOpen: true,
					children: [
						{
							label: 'आश्वलायन (ऋग्वेद)',
							defaultOpen: true,
							children: sandhyaTimeLinks.root.aswalayana,
						},
						{
							label: 'आपस्तम्ब (कृष्ण यजुर्वेद)',
							defaultOpen: false,
							children: sandhyaTimeLinks.root.apastamba,
						},
					],
				},
				{
					label: 'समिदाधानम्',
					defaultOpen: false,
					children: [
						{ label: 'आश्वलायन (ऋग्वेद)', href: '/aswalayana-samidadhanam/' },
						{ label: 'आपस्तम्ब (कृष्ण यजुर्वेद)', href: '/apastamba-samidadhanam/' },
					],
				},
			],
		},
		{
			label: 'वेद मन्त्राः',
			defaultOpen: true,
			children: [
				{
					label: 'ऋग्वेद सूक्त संग्रह​:',
					defaultOpen: false,
					children: rigvedaSuktaSangraha,
				},
				{
					label: 'याजुष मन्त्र रत्नाकरम्',
					defaultOpen: false,
					children: yajushaMantraRatnakaram,
				},
			],
		},
		{
			label: 'संहिताः',
			defaultOpen: false,
			children: [
				{
					label: 'शाकल संहिता (ऋग्वेद)',
					defaultOpen: false,
					children: rigvedaShakalaSamhitaMandalas,
				},
				{
					label: 'वाजसनेयी संहिता (शुक्ल यजुर्वेद — काण्व)',
					defaultOpen: false,
					children: kanvaSamhitaChapters,
				},
				{
					label: 'वाजसनेयी संहिता (शुक्ल यजुर्वेद — माध्यन्दिन)',
					defaultOpen: false,
					children: madhyandinaSamhitaChapters,
				},
				{
					label: 'तैत्तिरीय संहिता (कृष्णयजुर्वेद)',
					defaultOpen: false,
					children: taittiriyaSamhitaPrapathakas,
				},
				{
					label: 'मैत्रायणी संहिता (कृष्णयजुर्वेद)',
					defaultOpen: false,
					children: maitrayaniSamhitaPrapathakas,
				},
			],
		},
		{
			label: 'ब्राह्मणाः',
			children: [
				{
					label: 'ऐतरेय ब्राह्मनम् (ऋग्वेद)',
					defaultOpen: false,
					children: aitareyaBrahmanaPanchikasRoot,
				},
				{
					label: 'तैत्तिरीय ब्राह्मणम् (कृष्णयजुर्वेद)',
					defaultOpen: false,
					children: taittiriyaBrahmanaAshtakasRoot,
				},
			],
		},
		{
			label: 'आरण्यकानि',
			children: [
				{
					label: 'तैत्तिरीय आरण्यकम् (कृष्णयजुर्वेद)',
					defaultOpen: false,
					children: taittiriyaAranyakaPrashnasRoot,
				},
				{
					label: 'ऐतरेय आरण्यकम् (ऋग्वेद)',
					defaultOpen: false,
					children: aitareyaAranyakaSectionsRoot,
				},
			],
		},
		{
			label: 'उपनिषदः',
			children: [
				{
					label: 'ईशावास्योपनिषद् (शुक्लयजुर्वेद)',
					href: '/isha-upanishad/',
				},
				{
					label: 'केनोपनिषत् (सामवेद)',
					href: '/kena-upanishad/',
				},
				{
					label: 'कठोपनिषत् (कृष्णयजुर्वेद)',
					href: '/katha-upanishad/',
				},
				{
					label: 'तैत्तिरीयोपनिषत् (कृष्णयजुर्वेद)',
					href: '/taittiriya-upanishad/',
				},
				{
					label: 'महानारायणोपनिषत् (कृष्णयजुर्वेद)',
					href: '/mahanarayana-upanishad/',
				},
				{
					label: 'ऐतरेयोपनिषद् (ऋग्वेद)',
					href: '/aitareya-upanishad/',
				},
			],
		},
	],
	iast: [
		{
			label: 'Nityakarma',
			defaultOpen: true,
			children: [
				{
					label: 'Brahmayajñam',
					defaultOpen: false,
					children: [
						{ label: 'Aśvalāyana (Ṛgveda)', href: '/iast/aswalayana-brahmayagyam/' },
						{ label: 'Āpastamba (Kṛṣṇa Yajurveda)', href: '/iast/apastamba-brahmayagyam/' },
					],
				},
				{
					label: 'Sandhyāvandanam',
					defaultOpen: true,
					children: [
						{
							label: 'Aśvalāyana (Ṛgveda)',
							defaultOpen: true,
							children: sandhyaTimeLinks.iast.aswalayana,
						},
						{
							label: 'Āpastamba (Kṛṣṇa Yajurveda)',
							defaultOpen: false,
							children: sandhyaTimeLinks.iast.apastamba,
						},
					],
				},
				{
					label: 'Samidādhānam',
					defaultOpen: false,
					children: [
						{ label: 'Aśvalāyana (Ṛgveda)', href: '/iast/aswalayana-samidadhanam/' },
						{ label: 'Āpastamba (Kṛṣṇa Yajurveda)', href: '/iast/apastamba-samidadhanam/' },
					],
				},
			],
		},
		{
			label: 'Veda mantrāḥ',
			defaultOpen: false,
			children: [
				{
					label: 'Ṛgveda sūkta saṅgraha:',
					defaultOpen: false,
					children: iastRigvedaSuktaSangraha,
				},
				{
					label: 'Yājuṣa mantra ratnākaram',
					defaultOpen: false,
					children: iastYajushaMantraRatnakaram,
				},
			],
		},
		{
			label: 'Saṃhitāḥ',
			defaultOpen: false,
			children: [
				{
					label: 'Śākala saṃhitā (Ṛgveda)',
					defaultOpen: false,
					children: iastRigvedaShakalaSamhitaMandalas,
				},
				{
					label: 'Vājasaneyi saṃhitā (Śuklayajurveda — Kāṇva)',
					defaultOpen: false,
					children: iastKanvaSamhitaChapters,
				},
				{
					label: 'Vājasaneyi saṃhitā (Śuklayajurveda — Mādhyandina)',
					defaultOpen: false,
					children: iastMadhyandinaSamhitaChapters,
				},
				{
					label: 'Taittirīya saṃhitā (Kṛṣṇayajurveda)',
					defaultOpen: false,
					children: iastTaittiriyaSamhitaPrapathakas,
				},
				{
					label: 'Maitrāyaṇī saṃhitā (Kṛṣṇayajurveda)',
					defaultOpen: false,
					children: iastMaitrayaniSamhitaPrapathakas,
				},
			],
		},
		{
			label: 'Brāhmaṇāḥ',
			children: [
				{
					label: 'Aitareya brāhmaṇam (Ṛgveda)',
					defaultOpen: false,
					children: aitareyaBrahmanaPanchikasIast,
				},
				{
					label: 'Taittirīya brāhmaṇam (Kṛṣṇayajurveda)',
					defaultOpen: false,
					children: taittiriyaBrahmanaAshtakasIast,
				},
			],
		},
		{
			label: 'Āraṇyakāni',
			children: [
				{
					label: 'Taittirīya āraṇyakam (Kṛṣṇayajurveda)',
					defaultOpen: false,
					children: taittiriyaAranyakaPrashnasIast,
				},
				{
					label: 'Aitareya āraṇyakam (Ṛgveda)',
					defaultOpen: false,
					children: aitareyaAranyakaSectionsIast,
				},
			],
		},
		{
			label: 'Upaniṣadaḥ',
			children: [
				{
					label: 'Īśāvāsya upaniṣad (Śuklayajurveda)',
					href: '/iast/isha-upanishad/',
				},
				{
					label: 'Kena upaniṣad (Sāmaveda)',
					href: '/iast/kena-upanishad/',
				},
				{
					label: 'Kaṭha upaniṣad (Kṛṣṇayajurveda)',
					href: '/iast/katha-upanishad/',
				},
				{
					label: 'Taittirīya upaniṣad (Kṛṣṇayajurveda)',
					href: '/iast/taittiriya-upanishad/',
				},
				{
					label: 'Mahānārāyaṇa upaniṣad (Kṛṣṇayajurveda)',
					href: '/iast/mahanarayana-upanishad/',
				},
				{
					label: 'Aitareya upaniṣad (Ṛgveda)',
					href: '/iast/aitareya-upanishad/',
				},
			],
		},
	],
	ta: [],
};
