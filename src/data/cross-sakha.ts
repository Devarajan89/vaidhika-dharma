import type { HomeLocale } from './home';

export interface CrossSakhaPair {
	rig: string;
	yajur: string;
	label: Record<HomeLocale, string>;
}

export const CROSS_SAKHA_PAIRS: CrossSakhaPair[] = [
	{
		rig: 'purusha-suktam-rig',
		yajur: 'purusha-suktam',
		label: { root: 'पुरुष सूक्तम्', iast: 'Puruṣa Sūktam' },
	},
	{
		rig: 'sri-suktam-rig',
		yajur: 'sri-suktam',
		label: { root: 'श्री सूक्तम्', iast: 'Śrī Sūktam' },
	},
	{
		rig: 'vishnu-suktam-rig',
		yajur: 'vishnu-suktam',
		label: { root: 'विष्णु सूक्तम्', iast: 'Viṣṇu Sūktam' },
	},
	{
		rig: 'rudra-suktam-rig',
		yajur: 'rudra-suktam',
		label: { root: 'रुद्र सूक्तम्', iast: 'Rudra Sūktam' },
	},
	{
		rig: 'medha-suktam-rig',
		yajur: 'medha-suktam',
		label: { root: 'मेधा सूक्तम्', iast: 'Medhā Sūktam' },
	},
	{
		rig: 'pavamana-suktam-rig',
		yajur: 'pavamana-suktam',
		label: { root: 'पवमान सूक्तम्', iast: 'Pavamāna Sūktam' },
	},
	{
		rig: 'navagraha-suktam-rig',
		yajur: 'navagraha-suktam',
		label: { root: 'नवग्रह सूक्तम्', iast: 'Navagraha Sūktam' },
	},
	{
		rig: 'vak-suktam-rig',
		yajur: 'vak-suktam',
		label: { root: 'वाक् सूक्तम्', iast: 'Vāk Sūktam' },
	},
	{
		rig: 'sarpa-suktam-rig',
		yajur: 'sarpa-suktam',
		label: { root: 'सर्प सूक्तम्', iast: 'Sarpa Sūktam' },
	},
];

export interface CrossSakhaLink {
	href: string;
	label: string;
	side: 'rig' | 'yajur';
}

export function getCrossSakhaPeer(
	slug: string,
	locale: HomeLocale
): CrossSakhaLink | undefined {
	const id = slug.replace(/^iast\//, '').replace(/^\/+|\/+$/g, '');
	const prefix = locale === 'iast' ? '/iast' : '';
	const pair = CROSS_SAKHA_PAIRS.find((entry) => entry.rig === id || entry.yajur === id);
	if (!pair) return undefined;
	const toYajur = pair.rig === id;
	return {
		href: `${prefix}/${toYajur ? pair.yajur : pair.rig}/`,
		label: pair.label[locale],
		side: toYajur ? 'yajur' : 'rig',
	};
}

export function crossSakhaStudyLabel(locale: HomeLocale, side: 'rig' | 'yajur'): string {
	if (locale === 'iast') {
		return side === 'yajur' ? 'Yajurveda recension' : 'Ṛgveda recension';
	}
	return side === 'yajur' ? 'यजुर्वेद पाठः' : 'ऋग्वेद पाठः';
}
