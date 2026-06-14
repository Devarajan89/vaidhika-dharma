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

const MANDALA_COUNTS = [191, 43, 62, 58, 87, 75, 104, 102, 114, 191];

function rigvedaMandalaItems() {
	return MANDALA_LABELS.root.map((label, index) => {
		const mandala = index + 1;
		return {
			label: `${label} (${MANDALA_COUNTS[index]})`,
			translations: { en: `${MANDALA_LABELS.iast[index]} (${MANDALA_COUNTS[index]})` },
			link: `/rigveda-samhita/mandala-${mandala}/`,
		};
	});
}

/** Lightweight samhitas sidebar — mandala/chapter links only, no per-sukta autogenerate. */
export const samhitasSidebarGroup = {
	label: 'संहिताः',
	translations: { en: 'saṃhitāḥ' },
	items: [
		{
			label: 'शाकल संहिता (ऋग्वेद)',
			translations: { en: 'Śākala Saṃhitā (Ṛgveda)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { en: 'Index' },
					link: '/rigveda-samhita/',
				},
				...rigvedaMandalaItems(),
			],
		},
		{
			label: 'काण्व संहिता (शुक्लयजुः)',
			translations: { en: 'Kanva Saṃhitā (Śukla Yajur)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { en: 'Index' },
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
			label: 'माध्यन्दिन संहिता (शुक्लयजुः)',
			translations: { en: 'Madhyandina Saṃhitā (Śukla Yajur)' },
			collapsed: true,
			items: [
				{
					label: 'सूची',
					translations: { en: 'Index' },
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
	],
};
