import { TAITTIRIYA_KANDAS } from '../../scripts/lib/taittiriya-samhita-structure.mjs';
import { MAITRAYANI_KANDAS } from '../../scripts/lib/maitrayani-samhita-structure.mjs';
import { AITAREYA_PANCHIKAS } from '../../scripts/lib/aitareya-brahmana-structure.mjs';
import {
	AITAREYA_ARANYAKAS,
	AITAREYA_ARANYAKA_ADHYAYAS,
} from '../../scripts/lib/aitareya-aranyaka-structure.mjs';
import { TAITTIRIYA_BRAHMANA_ASHTAKAS } from '../../scripts/lib/taittiriya-brahmana-structure.mjs';
import {
	TAITTIRIYA_ARANYAKA_PRASHNAS,
	getPrashnaSidebarLabel,
} from '../../scripts/lib/taittiriya-aranyaka-structure.mjs';

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

function taittiriyaBrahmanaAshtakaItems() {
	return TAITTIRIYA_BRAHMANA_ASHTAKAS.map((ashtakaInfo) => ({
		label: ashtakaInfo.rootLabel,
		translations: { en: ashtakaInfo.iastLabel },
		link: `/taittiriya-brahmana/ashtaka-${ashtakaInfo.ashtaka}/`,
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
		{
			label: 'तैत्तिरीय ब्राह्मणम् (कृष्णयजुर्वेद)',
			translations: { en: 'Taittirīya brāhmaṇam (Kṛṣṇayajurveda)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { en: 'Sūcī' },
					link: '/taittiriya-brahmana/',
				},
				...taittiriyaBrahmanaAshtakaItems(),
			],
		},
	],
};

function taittiriyaAranyakaPrashnaItems() {
	return TAITTIRIYA_ARANYAKA_PRASHNAS.map((info) => ({
		label: getPrashnaSidebarLabel(info.prashna, 'root'),
		translations: { en: getPrashnaSidebarLabel(info.prashna, 'iast') },
		link: `/taittiriya-aranyaka/prashna-${info.prashna}/`,
	}));
}

function aitareyaAranyakaItems() {
	return AITAREYA_ARANYAKAS.map((aranyakaInfo) => ({
		label: aranyakaInfo.rootLabel,
		translations: { en: aranyakaInfo.iastLabel },
		collapsed: true,
		items: [
			{
				label: 'सूची',
				translations: { en: 'Overview' },
				link: `/aitareya-aranyaka/aranyaka-${aranyakaInfo.aranyaka}/`,
			},
			...AITAREYA_ARANYAKA_ADHYAYAS.filter(
				(entry) => entry.aranyaka === aranyakaInfo.aranyaka
			).map((entry) => ({
				label: entry.rootLabel.split(', ').slice(1).join(', ') || entry.rootLabel,
				translations: {
					en: entry.iastLabel.split(', ').slice(1).join(', ') || entry.iastLabel,
				},
				link: `/aitareya-aranyaka/aranyaka-${entry.aranyaka}/adhyaya-${entry.adhyaya}/`,
			})),
		],
	}));
}

export const aranyakamSidebarGroup = {
	label: 'आरण्यकानि',
	translations: { en: 'Āraṇyakāni' },
	items: [
		{
			label: 'तैत्तिरीय आरण्यकम् (कृष्णयजुर्वेद)',
			translations: { en: 'Taittirīya āraṇyakam (Kṛṣṇayajurveda)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { en: 'Sūcī' },
					link: '/taittiriya-aranyaka/',
				},
				...taittiriyaAranyakaPrashnaItems(),
			],
		},
		{
			label: 'ऐतरेय आरण्यकम् (ऋग्वेद)',
			translations: { en: 'Aitareya āraṇyakam (Ṛgveda)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { en: 'Sūcī' },
					link: '/aitareya-aranyaka/',
				},
				...aitareyaAranyakaItems(),
			],
		},
	],
};

export const upanishadsSidebarGroup = {
	label: 'उपनिषदः',
	translations: { en: 'Upaniṣadaḥ' },
	items: [
		{
			label: 'शुक्लयजुर्वेद',
			translations: { en: 'Śuklayajurveda' },
			collapsed: true,
			items: [
				{
					label: 'ईशावास्योपनिषद्',
					translations: { en: 'Īśāvāsyopaniṣad' },
					link: '/isha-upanishad/',
				},
			],
		},
		{
			label: 'सामवेद',
			translations: { en: 'Sāmaveda' },
			collapsed: true,
			items: [
				{
					label: 'केनोपनिषत्',
					translations: { en: 'Kenopaniṣad' },
					link: '/kena-upanishad/',
				},
			],
		},
		{
			label: 'कृष्णयजुर्वेद',
			translations: { en: 'Kṛṣṇayajurveda' },
			collapsed: true,
			items: [
				{
					label: 'कठोपनिषत्',
					translations: { en: 'Kaṭhopaniṣad' },
					link: '/katha-upanishad/',
				},
				{
					label: 'तैत्तिरीयोपनिषत्',
					translations: { en: 'Taittirīyopaniṣat' },
					link: '/taittiriya-upanishad/',
				},
				{
					label: 'महानारायणोपनिषत्',
					translations: { en: 'Mahānārāyaṇopaniṣat' },
					link: '/mahanarayana-upanishad/',
				},
			],
		},
		{
			label: 'ऋग्वेद',
			translations: { en: 'Ṛgveda' },
			collapsed: true,
			items: [
				{
					label: 'ऐतरेयोपनिषत्',
					translations: { en: 'Aitareyopaniṣat' },
					link: '/aitareya-upanishad/',
				},
			],
		},
	],
};
