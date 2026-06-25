import { TAITTIRIYA_KANDAS } from '../../scripts/lib/taittiriya-samhita-structure.mjs';
import { MAITRAYANI_KANDAS } from '../../scripts/lib/maitrayani-samhita-structure.mjs';
import { AITAREYA_PANCHIKAS } from '../../scripts/lib/aitareya-brahmana-structure.mjs';

const MANDALA_LABELS = {
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
};

function rigvedaMandalaItems() {
	return MANDALA_LABELS.root.map((label, index) => {
		const mandala = index + 1;
		return {
			label,
			translations: { en: MANDALA_LABELS.iast[index] },
			link: `/rigveda-samhita/mandala-${mandala}/`,
		};
	});
}

function taittiriyaKandaItems() {
	return TAITTIRIYA_KANDAS.map((kandaInfo) => ({
		label: kandaInfo.rootLabel,
		translations: { en: kandaInfo.iastLabel },
		link: `/taittiriya-samhita/kanda-${kandaInfo.kanda}/`,
	}));
}

function maitrayaniKandaItems() {
	return MAITRAYANI_KANDAS.map((kandaInfo) => ({
		label: kandaInfo.rootLabel,
		translations: { en: kandaInfo.iastLabel },
		link: `/maitrayani-samhita/kanda-${kandaInfo.kanda}/`,
	}));
}

function aitareyaPanchikaItems() {
	return AITAREYA_PANCHIKAS.map((panchikaInfo) => ({
		label: panchikaInfo.rootLabel,
		translations: { en: panchikaInfo.iastLabel },
		link: `/aitareya-brahmana/panchika-${panchikaInfo.panchika}/`,
	}));
}

/** Lightweight samhitas sidebar — mandala/chapter links only, no per-sukta autogenerate. */
export const samhitasSidebarGroup = {
	label: 'संहिताः',
	translations: { en: 'Saṃhitāḥ' },
	items: [
		{
			label: 'शाकल संहिता (ऋग्वेद)',
			translations: { en: 'Śākala saṃhitā (Ṛgveda)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { en: 'Sūcī' },
					link: '/rigveda-samhita/',
				},
				...rigvedaMandalaItems(),
			],
		},
		{
			label: 'वाजसनेयी संहिता (शुक्ल यजुः — काण्व)',
			translations: { en: 'Vājasaneyi saṃhitā (Śukla yajur — Kāṇva)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { en: 'Sūcī' },
					link: '/kanva-samhita/',
				},
				{
					autogenerate: {
						directory: 'samhitas/shukla-yajur/kanva-samhita',
						collapsed: true,
					},
				},
			],
		},
		{
			label: 'वाजसनेयी संहिता (शुक्ल यजुः — माध्यन्दिन)',
			translations: { en: 'Vājasaneyi saṃhitā (Śukla yajur — Mādhyandina)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { en: 'Sūcī' },
					link: '/madhyandina-samhita/',
				},
				{
					autogenerate: {
						directory: 'samhitas/shukla-yajur/madhyandina-samhita',
						collapsed: true,
					},
				},
			],
		},
		{
			label: 'तैत्तिरीय संहिता (कृष्णयजुः)',
			translations: { en: 'Taittirīya saṃhitā (Kṛṣṇayajuḥ)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { en: 'Sūcī' },
					link: '/taittiriya-samhita/',
				},
				...taittiriyaKandaItems(),
			],
		},
		{
			label: 'मैत्रायणी संहिता (कृष्णयजुः)',
			translations: { en: 'Maitrāyaṇī saṃhitā (Kṛṣṇayajuḥ)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { en: 'Sūcī' },
					link: '/maitrayani-samhita/',
				},
				...maitrayaniKandaItems(),
			],
		},
	],
};

export const brahmanamSidebarGroup = {
	label: 'ब्राह्मणाः',
	translations: { en: 'Brāhmaṇāḥ' },
	items: [
		{
			label: 'ऐतरेय ब्राह्मनम् (ऋग्वेद)',
			translations: { en: 'Aitareya brāhmaṇam (Ṛgveda)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { en: 'Sūcī' },
					link: '/aitareya-brahmana/',
				},
				...aitareyaPanchikaItems(),
			],
		},
	],
};

export const upanishadsSidebarGroup = {
	label: 'उपनिषदः',
	translations: { en: 'Upaniṣadaḥ' },
	items: [
		{
			label: 'ईशावास्योपनिषद् (शुक्लयजुर्वेद)',
			translations: { en: 'Īśāvāsya upaniṣad (Śuklayajurveda)' },
			link: '/kanva-samhita/chapter-40/',
		},
		{
			label: 'ऐतरेयोपनिषद् (ऋग्वेद)',
			translations: { en: 'Aitareya upaniṣad (Ṛgveda) — in progress' },
			link: '/iast/',
		},
	],
};
