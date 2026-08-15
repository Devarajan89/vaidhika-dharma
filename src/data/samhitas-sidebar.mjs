import { TAITTIRIYA_KANDAS } from '../../scripts/lib/taittiriya-samhita-structure.mjs';
import { MAITRAYANI_KANDAS } from '../../scripts/lib/maitrayani-samhita-structure.mjs';
import { AITAREYA_PANCHIKAS } from '../../scripts/lib/aitareya-brahmana-structure.mjs';
import { AITAREYA_ARANYAKAS } from '../../scripts/lib/aitareya-aranyaka-structure.mjs';
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
			translations: { 'sa-Latn': MANDALA_LABELS.iast[index] },
			link: `/rigveda-samhita/mandala-${mandala}/`,
		};
	});
}

function taittiriyaKandaItems() {
	return TAITTIRIYA_KANDAS.map((kandaInfo) => ({
		label: kandaInfo.rootLabel,
		translations: { 'sa-Latn': kandaInfo.iastLabel },
		link: `/taittiriya-samhita/kanda-${kandaInfo.kanda}/`,
	}));
}

function maitrayaniKandaItems() {
	return MAITRAYANI_KANDAS.map((kandaInfo) => ({
		label: kandaInfo.rootLabel,
		translations: { 'sa-Latn': kandaInfo.iastLabel },
		link: `/maitrayani-samhita/kanda-${kandaInfo.kanda}/`,
	}));
}

function aitareyaPanchikaItems() {
	return AITAREYA_PANCHIKAS.map((panchikaInfo) => ({
		label: panchikaInfo.rootLabel,
		translations: { 'sa-Latn': panchikaInfo.iastLabel },
		link: `/aitareya-brahmana/panchika-${panchikaInfo.panchika}/`,
	}));
}

function taittiriyaBrahmanaAshtakaItems() {
	return TAITTIRIYA_BRAHMANA_ASHTAKAS.map((ashtakaInfo) => ({
		label: ashtakaInfo.rootLabel,
		translations: { 'sa-Latn': ashtakaInfo.iastLabel },
		link: `/taittiriya-brahmana/ashtaka-${ashtakaInfo.ashtaka}/`,
	}));
}

/** Lightweight samhitas sidebar — mandala/chapter links only, no per-sukta autogenerate. */
export const samhitasSidebarGroup = {
	label: 'संहिताः',
	translations: { 'sa-Latn': 'Saṃhitāḥ' },
	items: [
		{
			label: 'शाकल संहिता (ऋग्वेद)',
			translations: { 'sa-Latn': 'Śākala saṃhitā (Ṛgveda)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { 'sa-Latn': 'Sūcī' },
					link: '/rigveda-samhita/',
				},
				...rigvedaMandalaItems(),
			],
		},
		{
			label: 'वाजसनेयी संहिता (शुक्ल यजुः — काण्व)',
			translations: { 'sa-Latn': 'Vājasaneyi saṃhitā (Śukla yajur — Kāṇva)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { 'sa-Latn': 'Sūcī' },
					link: '/kanva-samhita/',
				},
			],
		},
		{
			label: 'वाजसनेयी संहिता (शुक्ल यजुः — माध्यन्दिन)',
			translations: { 'sa-Latn': 'Vājasaneyi saṃhitā (Śukla yajur — Mādhyandina)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { 'sa-Latn': 'Sūcī' },
					link: '/madhyandina-samhita/',
				},
			],
		},
		{
			label: 'तैत्तिरीय संहिता (कृष्णयजुः)',
			translations: { 'sa-Latn': 'Taittirīya saṃhitā (Kṛṣṇayajuḥ)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { 'sa-Latn': 'Sūcī' },
					link: '/taittiriya-samhita/',
				},
				...taittiriyaKandaItems(),
			],
		},
		{
			label: 'मैत्रायणी संहिता (कृष्णयजुः)',
			translations: { 'sa-Latn': 'Maitrāyaṇī saṃhitā (Kṛṣṇayajuḥ)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { 'sa-Latn': 'Sūcī' },
					link: '/maitrayani-samhita/',
				},
				...maitrayaniKandaItems(),
			],
		},
	],
};

export const brahmanamSidebarGroup = {
	label: 'ब्राह्मणाः',
	translations: { 'sa-Latn': 'Brāhmaṇāḥ' },
	items: [
		{
			label: 'ऐतरेय ब्राह्मनम् (ऋग्वेद)',
			translations: { 'sa-Latn': 'Aitareya brāhmaṇam (Ṛgveda)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { 'sa-Latn': 'Sūcī' },
					link: '/aitareya-brahmana/',
				},
				...aitareyaPanchikaItems(),
			],
		},
		{
			label: 'तैत्तिरीय ब्राह्मणम् (कृष्णयजुर्वेद)',
			translations: { 'sa-Latn': 'Taittirīya brāhmaṇam (Kṛṣṇayajurveda)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { 'sa-Latn': 'Sūcī' },
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
		translations: { 'sa-Latn': getPrashnaSidebarLabel(info.prashna, 'iast') },
		link: `/taittiriya-aranyaka/prashna-${info.prashna}/`,
	}));
}

function aitareyaAranyakaItems() {
	return AITAREYA_ARANYAKAS.map((aranyakaInfo) => ({
		label: aranyakaInfo.rootLabel,
		translations: { 'sa-Latn': aranyakaInfo.iastLabel },
		link: `/aitareya-aranyaka/aranyaka-${aranyakaInfo.aranyaka}/`,
	}));
}

export const aranyakamSidebarGroup = {
	label: 'आरण्यकानि',
	translations: { 'sa-Latn': 'Āraṇyakāni' },
	items: [
		{
			label: 'तैत्तिरीय आरण्यकम् (कृष्णयजुर्वेद)',
			translations: { 'sa-Latn': 'Taittirīya āraṇyakam (Kṛṣṇayajurveda)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { 'sa-Latn': 'Sūcī' },
					link: '/taittiriya-aranyaka/',
				},
				...taittiriyaAranyakaPrashnaItems(),
			],
		},
		{
			label: 'ऐतरेय आरण्यकम् (ऋग्वेद)',
			translations: { 'sa-Latn': 'Aitareya āraṇyakam (Ṛgveda)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { 'sa-Latn': 'Sūcī' },
					link: '/aitareya-aranyaka/',
				},
				...aitareyaAranyakaItems(),
			],
		},
	],
};

export const upanishadsSidebarGroup = {
	label: 'उपनिषदः',
	translations: { 'sa-Latn': 'Upaniṣadaḥ' },
	items: [
		{
			label: 'शुक्लयजुर्वेद',
			translations: { 'sa-Latn': 'Śuklayajurveda' },
			collapsed: true,
			items: [
				{
					label: 'ईशावास्योपनिषद्',
					translations: { 'sa-Latn': 'Īśāvāsyopaniṣad' },
					link: '/isha-upanishad/',
				},
			],
		},
		{
			label: 'सामवेद',
			translations: { 'sa-Latn': 'Sāmaveda' },
			collapsed: true,
			items: [
				{
					label: 'केनोपनिषत्',
					translations: { 'sa-Latn': 'Kenopaniṣad' },
					link: '/kena-upanishad/',
				},
			],
		},
		{
			label: 'अथर्ववेद',
			translations: { 'sa-Latn': 'Atharvaveda' },
			collapsed: true,
			items: [
				{
					label: 'प्रश्नोपनिषत्',
					translations: { 'sa-Latn': 'Praśnopaniṣat' },
					link: '/prashna-upanishad/',
				},
			],
		},
		{
			label: 'कृष्णयजुर्वेद',
			translations: { 'sa-Latn': 'Kṛṣṇayajurveda' },
			collapsed: true,
			items: [
				{
					label: 'कठोपनिषत्',
					translations: { 'sa-Latn': 'Kaṭhopaniṣad' },
					link: '/katha-upanishad/',
				},
				{
					label: 'तैत्तिरीयोपनिषत्',
					translations: { 'sa-Latn': 'Taittirīyopaniṣat' },
					link: '/taittiriya-upanishad/',
				},
				{
					label: 'महानारायणोपनिषत्',
					translations: { 'sa-Latn': 'Mahānārāyaṇopaniṣat' },
					link: '/mahanarayana-upanishad/',
				},
			],
		},
		{
			label: 'ऋग्वेद',
			translations: { 'sa-Latn': 'Ṛgveda' },
			collapsed: true,
			items: [
				{
					label: 'ऐतरेयोपनिषत्',
					translations: { 'sa-Latn': 'Aitareyopaniṣat' },
					link: '/aitareya-upanishad/',
				},
			],
		},
	],
};
