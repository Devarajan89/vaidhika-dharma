import type { HomeLocale } from './home';
import { sangrahaCategoryNodes } from './sangraha';
import { yajushaCategoryNodes } from './yajusha';

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

const yajushaMantraRatnakaram: CategoryNode[] = yajushaCategoryNodes('root');

const iastRigvedaSuktaSangraha: CategoryNode[] = sangrahaCategoryNodes('iast');

const iastYajushaMantraRatnakaram: CategoryNode[] = yajushaCategoryNodes('iast');

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
					children: [
						{ label: 'सूची', href: '/yajusha-mantra-ratnakaram/' },
						...yajushaMantraRatnakaram,
					],
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
					label: 'मुण्डकोपनिषत् (अथर्ववेद)',
					href: '/mundaka-upanishad/',
				},
				{
					label: 'माण्डूक्योपनिषत् (अथर्ववेद)',
					href: '/mandukya-upanishad/',
				},
				{
					label: 'तैत्तिरीयोपनिषत् (कृष्णयजुर्वेद)',
					href: '/taittiriya-upanishad/',
				},
				{
					label: 'ऐतरेयोपनिषद् (ऋग्वेद)',
					href: '/aitareya-upanishad/',
				},
				{
					label: 'छान्दोग्योपनिषत् (सामवेद)',
					href: '/chandogya-upanishad/',
				},
				{
					label: 'बृहदारण्यकोपनिषत् (शुक्लयजुर्वेद)',
					href: '/brihadaranyaka-upanishad/',
				},
				{
					label: 'श्वेताश्वतरोपनिषत् (कृष्णयजुर्वेद)',
					href: '/svetasvatara-upanishad/',
				},
				{
					label: 'कैवल्योपनिषत् (कृष्णयजुर्वेद)',
					href: '/kaivalya-upanishad/',
				},
				{
					label: 'महानारायणोपनिषत् (कृष्णयजुर्वेद)',
					href: '/mahanarayana-upanishad/',
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
					children: [
						{ label: 'Index', href: '/iast/yajusha-mantra-ratnakaram/' },
						...iastYajushaMantraRatnakaram,
					],
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
					label: 'Muṇḍakopaniṣat (Atharvaveda)',
					href: '/iast/mundaka-upanishad/',
				},
				{
					label: 'Māṇḍūkyopaniṣat (Atharvaveda)',
					href: '/iast/mandukya-upanishad/',
				},
				{
					label: 'Taittirīya upaniṣad (Kṛṣṇayajurveda)',
					href: '/iast/taittiriya-upanishad/',
				},
				{
					label: 'Aitareya upaniṣad (Ṛgveda)',
					href: '/iast/aitareya-upanishad/',
				},
				{
					label: 'Chāndogya upaniṣad (Sāmaveda)',
					href: '/iast/chandogya-upanishad/',
				},
				{
					label: 'Bṛhadāraṇyaka upaniṣad (Śuklayajurveda)',
					href: '/iast/brihadaranyaka-upanishad/',
				},
				{
					label: 'Śvetāśvatara upaniṣad (Kṛṣṇayajurveda)',
					href: '/iast/svetasvatara-upanishad/',
				},
				{
					label: 'Kaivalya upaniṣad (Kṛṣṇayajurveda)',
					href: '/iast/kaivalya-upanishad/',
				},
				{
					label: 'Mahānārāyaṇa upaniṣad (Kṛṣṇayajurveda)',
					href: '/iast/mahanarayana-upanishad/',
				},
			],
		},
	],
};
