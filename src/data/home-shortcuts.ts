import type { HomeLocale } from './home';
import type { SandhyaSlot, ShakhaId } from '../lib/reader-prefs';

export interface HomeShortcut {
	label: Record<HomeLocale, string>;
	href: Record<HomeLocale, string>;
	group: 'ritual' | 'mantra' | 'text';
}

const SLOT_LABEL: Record<SandhyaSlot, Record<HomeLocale, string>> = {
	prata: { root: 'प्रातः सन्ध्या', iast: 'Prātaḥ sandhyā' },
	madhyahnika: { root: 'माध्यान्हिकम्', iast: 'Mādhyāhnikam' },
	sayam: { root: 'सायं सन्ध्या', iast: 'Sāyam sandhyā' },
};

export function sandhyaPracticeHref(
	locale: HomeLocale,
	shakha: ShakhaId,
	slot: SandhyaSlot
): string {
	const prefix = locale === 'iast' ? '/iast' : '';
	return `${prefix}/${shakha}-sandhyavandanam/${slot}/`;
}

export function getTodayPractice(locale: HomeLocale, slot: SandhyaSlot, shakha: ShakhaId = 'aswalayana') {
	return {
		label: SLOT_LABEL[slot][locale],
		href: sandhyaPracticeHref(locale, shakha, slot),
		slot,
		shakha,
	};
}

export const HOME_SHORTCUTS: HomeShortcut[] = [
	{
		group: 'ritual',
		label: { root: 'प्रातः सन्ध्या', iast: 'Prātaḥ sandhyā' },
		href: {
			root: '/aswalayana-sandhyavandanam/prata/',
			iast: '/iast/aswalayana-sandhyavandanam/prata/',
		},
	},
	{
		group: 'ritual',
		label: { root: 'माध्यान्हिकम्', iast: 'Madhyāhnikam' },
		href: {
			root: '/aswalayana-sandhyavandanam/madhyahnika/',
			iast: '/iast/aswalayana-sandhyavandanam/madhyahnika/',
		},
	},
	{
		group: 'ritual',
		label: { root: 'सायं सन्ध्या', iast: 'Sāyam sandhyā' },
		href: {
			root: '/aswalayana-sandhyavandanam/sayam/',
			iast: '/iast/aswalayana-sandhyavandanam/sayam/',
		},
	},
	{
		group: 'ritual',
		label: { root: 'ब्रह्मयज्ञम्', iast: 'Brahmayajñam' },
		href: {
			root: '/aswalayana-brahmayagyam/',
			iast: '/iast/aswalayana-brahmayagyam/',
		},
	},
	{
		group: 'mantra',
		label: { root: 'श्री रुद्र प्रश्नः', iast: 'Śrī Rudra Praśnaḥ' },
		href: { root: '/sri-rudra-prashnah/', iast: '/iast/sri-rudra-prashnah/' },
	},
	{
		group: 'mantra',
		label: { root: 'चमकम्', iast: 'Chamakam' },
		href: { root: '/chamakam/', iast: '/iast/chamakam/' },
	},
	{
		group: 'mantra',
		label: { root: 'पुरुष सूक्तम्', iast: 'Puruṣa Sūktam' },
		href: { root: '/purusha-suktam/', iast: '/iast/purusha-suktam/' },
	},
	{
		group: 'text',
		label: { root: 'ईशावास्योपनिषद्', iast: 'Īśāvāsyopaniṣad' },
		href: { root: '/isha-upanishad/', iast: '/iast/isha-upanishad/' },
	},
];

export function getHomeShortcuts(locale: HomeLocale) {
	return HOME_SHORTCUTS.map((item) => ({
		label: item.label[locale],
		href: item.href[locale],
		group: item.group,
	}));
}
