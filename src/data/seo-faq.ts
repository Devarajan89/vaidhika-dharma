function slugPath(slug: string): string {
	if (!slug || slug === 'index') return '';
	if (slug === 'iast/index') return 'iast';
	return slug.replace(/^\/+|\/+$/g, '');
}

export interface FaqItem {
	question: string;
	answer: string;
}

const FAQ_BY_KEY: Record<string, FaqItem[]> = {
	'aswalayana-sandhyavandanam/prata': [
		{
			question: 'What is Aśvalāyana prātaḥ sandhyāvandanam?',
			answer:
				'It is the morning sandhyā ritual in the Aśvalāyana (Ṛgveda) tradition, including ācamana, prāṇāyāma, Gāyatrī japa, and related mantras with Vedic svara on Vaidhika Dharma.',
		},
		{
			question: 'How do I find midday or evening sandhyā?',
			answer:
				'Use the mādhyāhnika and sāyam pages linked from morning sandhyā, or search for “sandhya” / “aswalayana sandhyavandanam” on the site search page.',
		},
		{
			question: 'Is Gayatri mantra included?',
			answer:
				'Yes. Gāyatrī japa is part of Aśvalāyana prātaḥ sandhyāvandanam. The page shows the mantras with Vedic svara in Devanagari (switch to IAST for Latin transliteration).',
		},
	],
	'apastamba-sandhyavandanam/prata': [
		{
			question: 'What is Āpastamba prātaḥ sandhyāvandanam?',
			answer:
				'It is the morning sandhyā ritual in the Āpastamba (Kṛṣṇa Yajurveda) tradition, with mantras marked for Vedic svara on Vaidhika Dharma.',
		},
		{
			question: 'How is it different from Aśvalāyana sandhyā?',
			answer:
				'Both are daily sandhyā practices, but they follow different śākhā (school) traditions. Choose the śākhā taught in your family or by your teacher.',
		},
	],
	'sri-rudra-prashnah': [
		{
			question: 'What is Rudram / Śrī Rudra Praśnaḥ?',
			answer:
				'Śrī Rudra Praśnaḥ (also called Rudram or Namakam) is a Yajurveda recitation of Rudra names and prayers. Vaidhika Dharma presents it with Vedic svara.',
		},
		{
			question: 'What comes before and after Rudram?',
			answer:
				'Laghunyāsa is often recited before Rudram; Chamakam commonly follows. Related pages are linked from the Rudram page.',
		},
		{
			question: 'Is this the same as Namakam?',
			answer:
				'Yes. Namakam is another common name for Śrī Rudra Praśnaḥ / Rudram.',
		},
	],
	chamakam: [
		{
			question: 'What is Chamakam?',
			answer:
				'Chamakam (Camakam) is a Yajurveda text often recited after Śrī Rudra Praśnaḥ (Namakam / Rudram), presented here with Vedic svara.',
		},
	],
	'purusha-suktam': [
		{
			question: 'What is Puruṣa Sūktam?',
			answer:
				'Puruṣa Sūktam (Purusha Sukta) is a Vedic hymn to the cosmic Puruṣa. This page presents the Yājuṣa / sangraha form with Vedic svara; a Ṛgveda compilation page is also available.',
		},
	],
	'nasadiya-suktam': [
		{
			question: 'What is Nāsadīya Sūktam?',
			answer:
				'Nāsadīya Sūktam is the Ṛgveda creation hymn (RV 10.129), also called the Nasadiya Sukta. It is presented with Vedic svara on Vaidhika Dharma.',
		},
	],
	'ganapathy-atharvasirsham': [
		{
			question: 'What is Gaṇapati Atharvaśīrṣam?',
			answer:
				'Gaṇapati Atharvaśīrṣam (Ganesha Atharvashirsha) is a well-known Gaṇapati text. This site presents it with Vedic svara in Devanagari and IAST.',
		},
	],
	'isha-upanishad': [
		{
			question: 'What is the Īśāvāsyopaniṣad?',
			answer:
				'Īśāvāsyopaniṣad (Isha / Isavasya Upanishad) is a principal Upaniṣad. Vaidhika Dharma presents the text with Vedic svara.',
		},
	],
	'rigveda-samhita': [
		{
			question: 'How do I look up a Ṛgveda verse?',
			answer:
				'Use site search with a citation such as RV 10.90.1 or 1.1.1. You can also browse by maṇḍala and sūkta from the Ṛgveda Saṃhitā index.',
		},
	],
	'taittiriya-samhita': [
		{
			question: 'How do I look up a Taittirīya Saṃhitā passage?',
			answer:
				'Search with a citation such as TS 1.1.1, or browse by kāṇḍa and prapāṭhaka from the Taittirīya Saṃhitā index.',
		},
	],
};

function pageKey(slug: string): string {
	const path = slugPath(slug);
	if (!path || path === 'iast') return '';
	return path.replace(/^iast\//, '');
}

export function getPageFaq(slug: string): FaqItem[] | null {
	const key = pageKey(slug);
	if (!key) return null;
	return FAQ_BY_KEY[key] ?? null;
}

export function buildFaqJsonLd(items: FaqItem[]): Record<string, unknown> {
	return {
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer,
			},
		})),
	};
}

/** Short HowTo for morning sandhyā landing pages (high-intent queries). */
export function getSandhyaHowTo(
	slug: string,
	canonicalUrl: string
): Record<string, unknown> | null {
	const key = pageKey(slug);
	if (!/sandhyavandanam\/prata$/.test(key)) return null;
	const tradition = key.startsWith('apastamba') ? 'Āpastamba' : 'Aśvalāyana';
	return {
		'@type': 'HowTo',
		name: `${tradition} prātaḥ sandhyāvandanam`,
		description: `Follow the ${tradition} morning sandhyā sequence with Vedic svara-marked mantras.`,
		url: canonicalUrl,
		step: [
			{
				'@type': 'HowToStep',
				position: 1,
				name: 'Prepare for sandhyā',
				text: 'Sit facing the appropriate direction for morning sandhyā and open the prātaḥ sandhyāvandanam page.',
			},
			{
				'@type': 'HowToStep',
				position: 2,
				name: 'Recite in order',
				text: 'Follow the page sections in order (ācamana, prāṇāyāma, Gāyatrī, and related limbs) using the svara marks.',
			},
			{
				'@type': 'HowToStep',
				position: 3,
				name: 'Continue daily practice',
				text: 'Use mādhyāhnika and sāyam pages for midday and evening sandhyā in the same śākhā.',
			},
		],
	};
}
