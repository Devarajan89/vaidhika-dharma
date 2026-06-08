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

export const categoryTrees: Record<HomeLocale, CategoryNode[]> = {
	root: [
		{
			label: 'Nityakarma',
			defaultOpen: true,
			children: [
				{
					label: 'Aswalayana (Ṛgveda)',
					defaultOpen: true,
					children: [
						{ label: 'Brahmayagyam', href: '/aswalayana-brahmayagyam/' },
						{ label: 'Sandhyavandanam', href: '/aswalayana-sandhyavandanam/' },
						{ label: 'Samidadhanam', href: '/aswalayana-samidadhanam/' },
					],
				},
				{
					label: 'Apastamba (Kṛṣṇa Yajurveda)',
					defaultOpen: true,
					children: [
						{ label: 'Brahmayagyam', href: '/apastamba-brahmayagyam/' },
						{ label: 'Sandhyavandanam', href: '/apastamba-sandhyavandanam/' },
						{ label: 'Samidadhanam', href: '/apastamba-samidadhanam/' },
					],
				},
			],
		},
		{
			label: 'Veda Mantras',
			defaultOpen: true,
			children: [
				{ label: 'Rigveda Sukta Sangraha', href: '/rigveda-sukta-sangraha/' },
				{ label: 'Yajusha Mantra Ratnakaram', href: '/yajusha-mantra-ratnakaram/' },
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
	sa: [
		{
			label: 'नित्यकर्म​',
			defaultOpen: true,
			children: [
				{
					label: 'आश्वलायन (ऋग्वेद)',
					defaultOpen: true,
					children: [
						{ label: 'ब्रह्मयज्ञम्', href: '/sa/aswalayana-brahmayagyam/' },
						{ label: 'सन्ध्यावन्दनम्​', href: '/sa/aswalayana-sandhyavandanam/' },
						{ label: 'समिदाधानम्', href: '/sa/aswalayana-samidadhanam/' },
					],
				},
				{
					label: 'आपस्तम्ब (कृष्ण यजुर्वेद)',
					defaultOpen: true,
					children: [
						{ label: 'ब्रह्मयज्ञम्', href: '/sa/apastamba-brahmayagyam/' },
						{ label: 'सन्ध्यावन्दनम्', href: '/sa/apastamba-sandhyavandanam/' },
						{ label: 'समिदाधानम्', href: '/sa/apastamba-samidadhanam/' },
					],
				},
			],
		},
		{
			label: 'वेद मन्त्रा:',
			defaultOpen: true,
			children: [
				{ label: 'ऋग्वेद सूक्त संग्रह​:', href: '/sa/rigveda-sukta-sangraha/' },
				{ label: 'याजुष मन्त्र रत्नाकरम्', href: '/sa/yajusha-mantra-ratnakaram/' },
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
	ta: [
		{
			label: 'நித்ய கர்ம',
			defaultOpen: true,
			children: [
				{
					label: 'ஆஶ்வலாயன (ரிக்³வேதம்)',
					defaultOpen: true,
					children: [
						{ label: 'ப்ருஹ்மயஞ்யம்', href: '/ta/aswalayana-brahmayagyam/' },
						{ label: 'ஸந்த்யாவந்தனம்', href: '/ta/aswalayana-sandhyavandanam/' },
						{ label: 'ஸமிதாதானம்', href: '/ta/aswalayana-samidadhanam/' },
					],
				},
				{
					label: 'ஆபஸ்தம்ப (க்ருஷ்ண யஜுர்)',
					defaultOpen: true,
					children: [
						{ label: 'ப்ருஹ்மயஞ்யம்', href: '/ta/apastamba-brahmayagyam/' },
						{ label: 'ஸந்த்யாவந்தனம்', href: '/ta/apastamba-sandhyavandanam/' },
						{ label: 'ஸமிதாதானம்', href: '/ta/apastamba-samidadhanam/' },
					],
				},
			],
		},
		{
			label: 'வேத மந்த்ரா:',
			defaultOpen: true,
			children: [
				{ label: 'ருக்வேத ஸூக்த ஸங்க்ரஹ​:', href: '/ta/rigveda-sukta-sangraha/' },
				{ label: 'யாஜுஷ மந்த்ர ரத்னாகரம்', href: '/ta/yajusha-mantra-ratnakaram/' },
			],
		},
		{
			label: 'ஸம்ஹிதா:',
			children: [
				{
					label: 'ஶாகல ஸம்ஹிதா (ருக்வேத)',
					badge: { text: 'Upcoming', variant: 'danger' },
				},
			],
		},
		{
			label: 'ப்ராஹ்மனம்',
			children: [
				{
					label: 'ஐதரேய ப்ராஹ்மனம் (ருக்வேத)',
					badge: { text: 'In Progress', variant: 'danger' },
				},
			],
		},
		{
			label: 'உபநிஷத்',
			children: [
				{
					label: 'ஐதரேயோபநிஷத் (ருக்வேத)',
					badge: { text: 'In Progress', variant: 'danger' },
				},
			],
		},
	],
};
