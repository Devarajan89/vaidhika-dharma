import type { HomeLocale } from './home';

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

const rigvedaSuktaSangraha: CategoryNode[] = [
	{ label: 'ब्रह्मणस्पति सूक्तम्', href: '/brahmanaspati-suktam/' },
	{ label: 'गणपति सूक्तम्', href: '/ganapathy-suktam/' },
	{ label: 'पञ्च रुद्रम्', href: '/pancha-rudram/' },
	{ label: 'स्वस्ति सूक्तम्', href: '/swasti-suktam/' },
];

const yajushaMantraRatnakaram: CategoryNode[] = [
	{ label: 'भाग्य सूक्तम्', href: '/bhagya-suktam/' },
	{ label: 'भू सूक्तम्', href: '/bhu-suktam/' },
	{ label: 'ब्रह्म सूक्तम्', href: '/brahma-suktam/' },
	{ label: 'चमक प्रश्नः', href: '/chamakam/' },
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
];

const iastYajushaMantraRatnakaram: CategoryNode[] = [
	{ label: 'Bhāgya Sūktam', href: '/iast/bhagya-suktam/' },
	{ label: 'Bhū Sūktam', href: '/iast/bhu-suktam/' },
	{ label: 'Brahma Sūktam', href: '/iast/brahma-suktam/' },
	{ label: 'Camakam', href: '/iast/chamakam/' },
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
					defaultOpen: true,
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
							defaultOpen: true,
							children: sandhyaTimeLinks.root.apastamba,
						},
					],
				},
				{
					label: 'समिदाधानम्',
					defaultOpen: true,
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
					defaultOpen: true,
					children: rigvedaSuktaSangraha,
				},
				{
					label: 'याजुष मन्त्र रत्नाकरम्',
					defaultOpen: true,
					children: yajushaMantraRatnakaram,
				},
			],
		},
		{
			label: 'संहिताः',
			children: [
				{
					label: 'शाकल संहिता (ऋग्वेद)',
					badge: { text: 'In Progress', variant: 'danger' },
				},
			],
		},
		{
			label: 'ब्राह्मनम्',
			children: [
				{
					label: 'ऐतरेय ब्राह्मनम् (ऋग्वेद)',
					badge: { text: 'In Progress', variant: 'danger' },
				},
			],
		},
		{
			label: 'उपनिषद्',
			children: [
				{
					label: 'ऐतरेयोपनिषद् (ऋग्वेद)',
					badge: { text: 'In Progress', variant: 'danger' },
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
					label: 'Brahmayagyam',
					defaultOpen: true,
					children: [
						{ label: 'Ashvalayana (Ṛgveda)', href: '/iast/aswalayana-brahmayagyam/' },
						{ label: 'Apastamba (Kṛṣṇa Yajurveda)', href: '/iast/apastamba-brahmayagyam/' },
					],
				},
				{
					label: 'Sandhyavandanam',
					defaultOpen: true,
					children: [
						{
							label: 'Ashvalayana (Ṛgveda)',
							defaultOpen: true,
							children: sandhyaTimeLinks.iast.aswalayana,
						},
						{
							label: 'Apastamba (Kṛṣṇa Yajurveda)',
							defaultOpen: true,
							children: sandhyaTimeLinks.iast.apastamba,
						},
					],
				},
				{
					label: 'Samidadhanam',
					defaultOpen: true,
					children: [
						{ label: 'Ashvalayana (Ṛgveda)', href: '/iast/aswalayana-samidadhanam/' },
						{ label: 'Apastamba (Kṛṣṇa Yajurveda)', href: '/iast/apastamba-samidadhanam/' },
					],
				},
			],
		},
		{
			label: 'Veda Mantras',
			defaultOpen: true,
			children: [
				{
					label: 'Rigveda Sukta Sangraha',
					defaultOpen: true,
					children: iastRigvedaSuktaSangraha,
				},
				{
					label: 'Yajusha Mantra Ratnakaram',
					defaultOpen: true,
					children: iastYajushaMantraRatnakaram,
				},
			],
		},
		{
			label: 'Samhita',
			children: [
				{
					label: 'Shakala Samhita (Rigveda)',
					badge: { text: 'In Progress', variant: 'danger' },
				},
			],
		},
		{
			label: 'Brahmanam',
			children: [
				{
					label: 'Aitareya Brahmanam (Rigveda)',
					badge: { text: 'In Progress', variant: 'danger' },
				},
			],
		},
		{
			label: 'Upanishad',
			children: [
				{
					label: 'Aitareyopanishad (Rigveda)',
					badge: { text: 'In Progress', variant: 'danger' },
				},
			],
		},
	],
	ta: [],
};
