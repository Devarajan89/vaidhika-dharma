import type { HomeLocale } from './home';
import { sangrahaCategoryNodes } from './sangraha';

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

export function countCategoryLeaves(node: CategoryNode): number {
	if (!node.children?.length) return node.href ? 1 : 0;
	return node.children.reduce((sum, child) => sum + countCategoryLeaves(child), 0);
}

const rigvedaSuktaSangraha: CategoryNode[] = sangrahaCategoryNodes('root');

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

const iastRigvedaSuktaSangraha: CategoryNode[] = sangrahaCategoryNodes('iast');

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
					defaultOpen: false,
					children: [
						{
							label: 'आश्वलायन (ऋग्वेद)',
							defaultOpen: false,
							children: [...sandhyaTimeLinks.root.aswalayana],
						},
						{
							label: 'आपस्तम्ब (कृष्ण यजुर्वेद)',
							defaultOpen: false,
							children: [...sandhyaTimeLinks.root.apastamba],
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
			defaultOpen: false,
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
			defaultOpen: true,
			children: [
				{ label: 'शाकल संहिता (ऋग्वेद)', href: '/rigveda-samhita/' },
				{ label: 'वाजसनेयी संहिता (शुक्ल यजुर्वेद — काण्व)', href: '/kanva-samhita/' },
				{ label: 'वाजसनेयी संहिता (शुक्ल यजुर्वेद — माध्यन्दिन)', href: '/madhyandina-samhita/' },
				{ label: 'तैत्तिरीय संहिता (कृष्णयजुर्वेद)', href: '/taittiriya-samhita/' },
				{ label: 'मैत्रायणी संहिता (कृष्णयजुर्वेद)', href: '/maitrayani-samhita/' },
			],
		},
		{
			label: 'ब्राह्मणाः',
			children: [
				{ label: 'ऐतरेय ब्राह्मनम् (ऋग्वेद)', href: '/aitareya-brahmana/' },
				{ label: 'तैत्तिरीय ब्राह्मणम् (कृष्णयजुर्वेद)', href: '/taittiriya-brahmana/' },
			],
		},
		{
			label: 'आरण्यकानि',
			children: [
				{ label: 'तैत्तिरीय आरण्यकम् (कृष्णयजुर्वेद)', href: '/taittiriya-aranyaka/' },
				{ label: 'ऐतरेय आरण्यकम् (ऋग्वेद)', href: '/aitareya-aranyaka/' },
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
					label: 'प्रश्नोपनिषत् (अथर्ववेद)',
					href: '/prashna-upanishad/',
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
					defaultOpen: false,
					children: [
						{
							label: 'Aśvalāyana (Ṛgveda)',
							defaultOpen: false,
							children: [...sandhyaTimeLinks.iast.aswalayana],
						},
						{
							label: 'Āpastamba (Kṛṣṇa Yajurveda)',
							defaultOpen: false,
							children: [...sandhyaTimeLinks.iast.apastamba],
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
			defaultOpen: true,
			children: [
				{ label: 'Śākala saṃhitā (Ṛgveda)', href: '/iast/rigveda-samhita/' },
				{ label: 'Vājasaneyi saṃhitā (Śuklayajurveda — Kāṇva)', href: '/iast/kanva-samhita/' },
				{
					label: 'Vājasaneyi saṃhitā (Śuklayajurveda — Mādhyandina)',
					href: '/iast/madhyandina-samhita/',
				},
				{ label: 'Taittirīya saṃhitā (Kṛṣṇayajurveda)', href: '/iast/taittiriya-samhita/' },
				{ label: 'Maitrāyaṇī saṃhitā (Kṛṣṇayajurveda)', href: '/iast/maitrayani-samhita/' },
			],
		},
		{
			label: 'Brāhmaṇāḥ',
			children: [
				{ label: 'Aitareya brāhmaṇam (Ṛgveda)', href: '/iast/aitareya-brahmana/' },
				{ label: 'Taittirīya brāhmaṇam (Kṛṣṇayajurveda)', href: '/iast/taittiriya-brahmana/' },
			],
		},
		{
			label: 'Āraṇyakāni',
			children: [
				{ label: 'Taittirīya āraṇyakam (Kṛṣṇayajurveda)', href: '/iast/taittiriya-aranyaka/' },
				{ label: 'Aitareya āraṇyakam (Ṛgveda)', href: '/iast/aitareya-aranyaka/' },
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
					label: 'Praśnopaniṣat (Atharvaveda)',
					href: '/iast/prashna-upanishad/',
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
};
