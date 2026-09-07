import type { HomeLocale } from './home';
import { SEARCH_SYNONYMS } from './search-synonyms';

export interface PageSeoCopy {
	description: string;
	intro: Record<HomeLocale, string>;
}

function pageKey(slug: string): string {
	const path = slug.replace(/^\/+|\/+$/g, '');
	if (!path || path === 'index') return '';
	if (path === 'iast' || path === 'iast/index') return '';
	return path.replace(/^iast\//, '');
}

const PAGE_SEO: Record<string, PageSeoCopy> = {
	'aswalayana-sandhyavandanam/prata': {
		description:
			'Aśvalāyana prātaḥ sandhyāvandanam (morning sandhya, Gayatri) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Āśvalāyana morning sandhyāvandanam (prātaḥ sandhyā, Gāyatrī japa) with svara. Also spelled aswalayana / ashvalayana sandhyavandanam.',
			iast: 'Āśvalāyana morning sandhyāvandanam (prātaḥ sandhyā, Gāyatrī japa) with Vedic svara. Common searches: aswalayana sandhya, ashvalayana sandhyavandanam.',
		},
	},
	'aswalayana-sandhyavandanam/madhyahnika': {
		description:
			'Aśvalāyana mādhyāhnika sandhyāvandanam (midday sandhya) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Āśvalāyana midday sandhyā (mādhyāhnika sandhyāvandanam) with svara for daily nityakarma.',
			iast: 'Āśvalāyana midday sandhyā (mādhyāhnika sandhyāvandanam) with Vedic svara for daily nityakarma.',
		},
	},
	'aswalayana-sandhyavandanam/sayam': {
		description:
			'Aśvalāyana sāyaṃ sandhyāvandanam (evening sandhya) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Āśvalāyana evening sandhyā (sāyaṃ sandhyāvandanam) with svara.',
			iast: 'Āśvalāyana evening sandhyā (sāyaṃ sandhyāvandanam) with Vedic svara.',
		},
	},
	'apastamba-sandhyavandanam/prata': {
		description:
			'Āpastamba prātaḥ sandhyāvandanam (morning sandhya, Gayatri) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Āpastamba morning sandhyāvandanam (prātaḥ sandhyā) with svara. Search terms: apastamba sandhya, āpastamba sandhyavandanam.',
			iast: 'Āpastamba morning sandhyāvandanam (prātaḥ sandhyā, Gāyatrī) with Vedic svara.',
		},
	},
	'apastamba-sandhyavandanam/madhyahnika': {
		description:
			'Āpastamba mādhyāhnika sandhyāvandanam (midday sandhya) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Āpastamba midday sandhyā (mādhyāhnika) with svara.',
			iast: 'Āpastamba midday sandhyā (mādhyāhnika sandhyāvandanam) with Vedic svara.',
		},
	},
	'apastamba-sandhyavandanam/sayam': {
		description:
			'Āpastamba sāyaṃ sandhyāvandanam (evening sandhya) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Āpastamba evening sandhyā (sāyaṃ sandhyāvandanam) with svara.',
			iast: 'Āpastamba evening sandhyā (sāyaṃ sandhyāvandanam) with Vedic svara.',
		},
	},
	'aswalayana-brahmayagyam': {
		description:
			'Aśvalāyana brahmayajñam (brahmayagyam) daily recitation with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Āśvalāyana brahmayajñam (brahmayagyam) — daily svādhyāya recitation with svara.',
			iast: 'Āśvalāyana brahmayajñam (brahmayagyam) — daily svādhyāya recitation with Vedic svara.',
		},
	},
	'apastamba-brahmayagyam': {
		description:
			'Āpastamba brahmayajñam (brahmayagyam) daily recitation with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Āpastamba brahmayajñam (brahmayagyam) with svara.',
			iast: 'Āpastamba brahmayajñam (brahmayagyam) with Vedic svara.',
		},
	},
	'aswalayana-samidadhanam': {
		description:
			'Aśvalāyana samidādhānam (samidhadhana, fire-stick offering) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Āśvalāyana samidādhānam (samidadhanam, samidhadhana) with svara.',
			iast: 'Āśvalāyana samidādhānam (samidadhanam) — the daily fire-stick offering with Vedic svara.',
		},
	},
	'apastamba-samidadhanam': {
		description:
			'Āpastamba samidādhānam (samidhadhana) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Āpastamba samidādhānam (samidadhanam) with svara.',
			iast: 'Āpastamba samidādhānam (samidadhanam) with Vedic svara.',
		},
	},
	'sri-rudra-prashnah': {
		description:
			'Śrī Rudra Praśnaḥ (Namakam, Rudram, Rudraprashna) from the Yajurveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Śrī Rudra Praśnaḥ — Namakam / Rudram / Rudraprashna with svara. Also searched as rudram, śrīrudram.',
			iast: 'Śrī Rudra Praśnaḥ (Namakam, Rudram, Rudraprashna) with Vedic svara from the Yajurveda.',
		},
	},
	'sri-rudra-laghunyasa': {
		description:
			'Śrī Rudra Laghunyāsaḥ (laghu nyasa, rudra nyasa) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Śrī Rudra Laghunyāsaḥ (laghunyasa, rudra nyāsa) recited before Rudram.',
			iast: 'Śrī Rudra Laghunyāsaḥ (laghu nyāsa, rudra nyāsa) recited before Rudram, with Vedic svara.',
		},
	},
	chamakam: {
		description: 'Chamakam (Camakam) from the Yajurveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Chamakam (Camakam) follows Namakam in Śrī Rudra recitation, with svara.',
			iast: 'Chamakam (Camakam) follows Namakam in the Śrī Rudra recitation, with Vedic svara.',
		},
	},
	'purusha-suktam': {
		description:
			'Puruṣa Sūktam (Purusha Sukta, Purusa Suktam) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Puruṣa Sūktam (Purusha Sukta) with svara. Ṛgveda compilation: Puruṣa Sūktam (Ṛgveda).',
			iast: 'Puruṣa Sūktam (Purusha Sukta, Purusa Suktam) with Vedic svara. See also the Ṛgveda compilation page.',
		},
	},
	'sri-suktam': {
		description: 'Śrī Sūktam (Sri Suktam, Shri Suktam) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Śrī Sūktam (Sri Suktam, Shri Suktam) with svara. Ṛgveda compilation: Śrī Sūktam (Ṛgveda).',
			iast: 'Śrī Sūktam (Sri Suktam, Shri Suktam) with Vedic svara. See also the Ṛgveda compilation page.',
		},
	},
	'narayana-suktam': {
		description: 'Nārāyaṇa Sūktam (Narayana Suktam) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Nārāyaṇa Sūktam (Narayana Suktam) with svara.',
			iast: 'Nārāyaṇa Sūktam (Narayana Suktam) with Vedic svara.',
		},
	},
	'durga-suktam': {
		description: 'Durgā Sūktam (Durga Suktam) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Durgā Sūktam (Durga Suktam, Durgasuktam) with svara.',
			iast: 'Durgā Sūktam (Durga Suktam) with Vedic svara.',
		},
	},
	'medha-suktam': {
		description: 'Medhā Sūktam (Medha Suktam) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Medhā Sūktam (Medha Suktam) with svara.',
			iast: 'Medhā Sūktam (Medha Suktam) with Vedic svara. Ṛgveda compilation: Medhā Sūktam (Ṛgveda).',
		},
	},
	'vishnu-suktam': {
		description: 'Viṣṇu Sūktam (Vishnu Suktam) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Viṣṇu Sūktam (Vishnu Suktam) with svara.',
			iast: 'Viṣṇu Sūktam (Vishnu Suktam) with Vedic svara. Ṛgveda compilation: Viṣṇu Sūktam (Ṛgveda).',
		},
	},
	'ganapathy-atharvasirsham': {
		description:
			'Gaṇapati Atharvaśīrṣam (Ganesha Atharvashirsha, Atharvasirsha) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Gaṇapati Atharvaśīrṣam (Ganesha Atharvashirsha, Atharvasirsha) with svara.',
			iast: 'Gaṇapati Atharvaśīrṣam (Ganesha Atharvashirsha, Atharvasirsha) with Vedic svara.',
		},
	},
	'pancha-rudram': {
		description: 'Pañca Rudram (Pancha Rudram, Pancarudra) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Pañca Rudram (Pancha Rudram, pancarudra) with svara.',
			iast: 'Pañca Rudram (Pancha Rudram, pancarudra) with Vedic svara.',
		},
	},
	'navagraha-suktam': {
		description: 'Navagraha Sūktam (Navagraha Suktam) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Navagraha Sūktam (Navagraha Suktam) with svara.',
			iast: 'Navagraha Sūktam with Vedic svara. Ṛgveda compilation: Navagraha Sūktam (Ṛgveda).',
		},
	},
	'pavamana-suktam': {
		description: 'Pavamāna Sūktam (Pavamana Suktam) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Pavamāna Sūktam (Pavamana Suktam) with svara.',
			iast: 'Pavamāna Sūktam (Pavamana Suktam) with Vedic svara.',
		},
	},
	'ganapathy-suktam': {
		description:
			'Gaṇapati Sūktam (Ganapati Suktam, Ganesha Suktam, Brahmaṇaspati) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Gaṇapati Sūktam (Ganapati / Ganesha Suktam) from the Ṛgveda, with svara.',
			iast: 'Gaṇapati Sūktam (Ganapati Suktam, Ganesha Suktam) from the Ṛgveda, with Vedic svara.',
		},
	},
	'brahmanaspati-suktam': {
		description: 'Brahmaṇaspati Sūktam (Brahmanaspati Suktam) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Brahmaṇaspati Sūktam (Brahmanaspati Suktam) from the Ṛgveda, with svara.',
			iast: 'Brahmaṇaspati Sūktam from the Ṛgveda, with Vedic svara.',
		},
	},
	'swasti-suktam': {
		description: 'Svasti Sūktam (Swasti Suktam, svasti-vācana) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Svasti Sūktam (Swasti Suktam) from the Ṛgveda, with svara.',
			iast: 'Svasti Sūktam (Swasti Suktam, svasti-vācana) from the Ṛgveda, with Vedic svara.',
		},
	},
	'a-no-bhadrauh-suktam': {
		description: 'Ā no bhadrāḥ Sūktam (A no bhadrah, auspicious thought hymn) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Ā no bhadrāḥ Sūktam — the Ṛgveda hymn “ā no bhadrāḥ kratavo yantu”, with svara.',
			iast: 'Ā no bhadrāḥ Sūktam — Ṛgveda “ā no bhadrāḥ kratavo yantu viśvataḥ”, with Vedic svara.',
		},
	},
	'shamvati-suktam': {
		description: 'Śaṃvatī Sūktam (Shamvati Suktam) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Śaṃvatī Sūktam (Shamvati Suktam) from the Ṛgveda, with svara.',
			iast: 'Śaṃvatī Sūktam (Shamvati Suktam) from the Ṛgveda, with Vedic svara.',
		},
	},
	'mangala-suktam': {
		description: 'Maṅgala Sūktam (Mangala Suktam) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Maṅgala Sūktam (Mangala Suktam) from the Ṛgveda, with svara.',
			iast: 'Maṅgala Sūktam (Mangala Suktam) from the Ṛgveda, with Vedic svara.',
		},
	},
	'purusha-suktam-rig': {
		description: 'Puruṣa Sūktam from the Ṛgveda (Purusha Sukta RV) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Puruṣa Sūktam as compiled from the Ṛgveda (Purusha Sukta), with svara.',
			iast: 'Puruṣa Sūktam compiled from the Ṛgveda (Purusha Sukta), with Vedic svara.',
		},
	},
	'vishnu-suktam-rig': {
		description: 'Viṣṇu Sūktam from the Ṛgveda (Vishnu Suktam RV) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Viṣṇu Sūktam from the Ṛgveda (Vishnu Suktam), with svara.',
			iast: 'Viṣṇu Sūktam from the Ṛgveda (Vishnu Suktam), with Vedic svara.',
		},
	},
	'vamana-suktam': {
		description: 'Vāmana Sūktam (Vamana Suktam) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Vāmana Sūktam (Vamana Suktam) from the Ṛgveda, with svara.',
			iast: 'Vāmana Sūktam (Vamana Suktam) from the Ṛgveda, with Vedic svara.',
		},
	},
	'rudra-suktam-rig': {
		description: 'Rudra Sūktam from the Ṛgveda (Rudra Suktam, Rudrasuktam) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Rudra Sūktam from the Ṛgveda (Rudra Suktam), with svara.',
			iast: 'Rudra Sūktam from the Ṛgveda (Rudra Suktam, Rudrasuktam), with Vedic svara.',
		},
	},
	'hiranyagarbha-suktam': {
		description: 'Hiraṇyagarbha Sūktam (Hiranyagarbha Suktam, creation hymn) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Hiraṇyagarbha Sūktam (Hiranyagarbha Suktam) from the Ṛgveda, with svara.',
			iast: 'Hiraṇyagarbha Sūktam (Hiranyagarbha, golden-embryo hymn) from the Ṛgveda, with Vedic svara.',
		},
	},
	'saura-suktam': {
		description: 'Saura Sūktam (Saura Suktam, Sūrya hymn) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Saura Sūktam (Sūrya / Saura Suktam) from the Ṛgveda, with svara.',
			iast: 'Saura Sūktam (Sūrya hymn) from the Ṛgveda, with Vedic svara.',
		},
	},
	'sarasvati-suktam': {
		description: 'Sarasvatī Sūktam (Sarasvati Suktam) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Sarasvatī Sūktam (Sarasvati Suktam) from the Ṛgveda, with svara.',
			iast: 'Sarasvatī Sūktam (Sarasvati Suktam) from the Ṛgveda, with Vedic svara.',
		},
	},
	'sri-suktam-rig': {
		description: 'Śrī Sūktam from the Ṛgveda (Sri Suktam RV) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Śrī Sūktam compiled from the Ṛgveda (Sri Suktam), with svara.',
			iast: 'Śrī Sūktam compiled from the Ṛgveda (Sri Suktam), with Vedic svara.',
		},
	},
	'devi-suktam': {
		description: 'Devī Sūktam (Devi Suktam, Vāk Sūkta) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Devī Sūktam (Devi Suktam, Vāk / Ambhṛṇī hymn) from the Ṛgveda, with svara.',
			iast: 'Devī Sūktam (Devi Suktam, Vāk Sūkta) from the Ṛgveda, with Vedic svara.',
		},
	},
	'jnana-suktam': {
		description: 'Jñāna Sūktam (Jnana Suktam, knowledge hymn) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Jñāna Sūktam (Jnana Suktam) from the Ṛgveda, with svara.',
			iast: 'Jñāna Sūktam (Jnana Suktam, knowledge hymn) from the Ṛgveda, with Vedic svara.',
		},
	},
	'ratri-suktam': {
		description: 'Rātrī Sūktam (Ratri Suktam, hymn to Night) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Rātrī Sūktam (Ratri Suktam) from the Ṛgveda, with svara.',
			iast: 'Rātrī Sūktam (Ratri Suktam, hymn to Night) from the Ṛgveda, with Vedic svara.',
		},
	},
	'shraddha-suktam': {
		description: 'Śraddhā Sūktam (Shraddha Suktam) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Śraddhā Sūktam (Shraddha Suktam) from the Ṛgveda, with svara.',
			iast: 'Śraddhā Sūktam (Shraddha Suktam) from the Ṛgveda, with Vedic svara.',
		},
	},
	'nasadiya-suktam': {
		description:
			'Nāsadīya Sūktam (Nasadiya Suktam, Rigveda creation hymn 10.129) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Nāsadīya Sūktam (Nasadiya Suktam, Ṛgveda 10.129 creation hymn) with svara.',
			iast: 'Nāsadīya Sūktam (Nasadiya Suktam, Ṛgveda 10.129 creation hymn) with Vedic svara.',
		},
	},
	'medha-suktam-rig': {
		description: 'Medhā Sūktam from the Ṛgveda (Medha Suktam RV) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Medhā Sūktam from the Ṛgveda (Medha Suktam), with svara.',
			iast: 'Medhā Sūktam from the Ṛgveda (Medha Suktam), with Vedic svara.',
		},
	},
	'manyu-suktam': {
		description: 'Manyu Sūktam (Manyu Suktam) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Manyu Sūktam (Manyu Suktam) from the Ṛgveda, with svara.',
			iast: 'Manyu Sūktam from the Ṛgveda, with Vedic svara.',
		},
	},
	'oshadhi-suktam': {
		description: 'Oṣadhi Sūktam (Oshadhi Suktam, hymn to herbs) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Oṣadhi Sūktam (Oshadhi Suktam, hymn to herbs) from the Ṛgveda, with svara.',
			iast: 'Oṣadhi Sūktam (Oshadhi Suktam, hymn to herbs) from the Ṛgveda, with Vedic svara.',
		},
	},
	'vastu-suktam': {
		description: 'Vāstu Sūktam (Vastu Suktam) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Vāstu Sūktam (Vastu Suktam) from the Ṛgveda, with svara.',
			iast: 'Vāstu Sūktam (Vastu Suktam) from the Ṛgveda, with Vedic svara.',
		},
	},
	'pratah-suktam': {
		description: 'Prātaḥ Sūktam (Pratah Suktam, morning hymn) from the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Prātaḥ Sūktam (Pratah Suktam, morning hymn) from the Ṛgveda, with svara.',
			iast: 'Prātaḥ Sūktam (Pratah Suktam, morning hymn) from the Ṛgveda, with Vedic svara.',
		},
	},
	'rigveda-samhita': {
		description:
			'Ṛgveda Śākala Saṃhitā (Rigveda, Rgveda) with Vedic svara, maṇḍala and sūkta index — Vaidhika Dharma.',
		intro: {
			root: 'Ṛgveda Śākala Saṃhitā (Rigveda, Rgveda) with svara — browse maṇḍalas and sūktas.',
			iast: 'Ṛgveda Śākala Saṃhitā (Rigveda, Rgveda) with Vedic svara — browse maṇḍalas and sūktas.',
		},
	},
	'kanva-samhita': {
		description:
			'Vājasaneyi Saṃhitā Kāṇva (Kanva, Shukla Yajurveda) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Vājasaneyi Saṃhitā, Kāṇva recension (Kanva, Śukla Yajurveda) with svara.',
			iast: 'Vājasaneyi Saṃhitā, Kāṇva recension (Kanva, Śukla Yajurveda) with Vedic svara.',
		},
	},
	'madhyandina-samhita': {
		description:
			'Vājasaneyi Saṃhitā Mādhyandina (Madhyandina, Shukla Yajurveda) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Vājasaneyi Saṃhitā, Mādhyandina recension (Madhyandina) with svara.',
			iast: 'Vājasaneyi Saṃhitā, Mādhyandina recension (Madhyandina, Śukla Yajurveda) with Vedic svara.',
		},
	},
	'taittiriya-samhita': {
		description:
			'Taittirīya Saṃhitā (Krishna Yajurveda, Taittiriya Samhita) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Taittirīya Saṃhitā (Kṛṣṇa Yajurveda, Taittiriya) with svara — kāṇḍa and prapāṭhaka index.',
			iast: 'Taittirīya Saṃhitā (Kṛṣṇa Yajurveda, Taittiriya Samhita) with Vedic svara.',
		},
	},
	'maitrayani-samhita': {
		description:
			'Maitrāyaṇī Saṃhitā (Maitrayani Samhita, Krishna Yajurveda) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Maitrāyaṇī Saṃhitā (Maitrayani, Kṛṣṇa Yajurveda) with svara.',
			iast: 'Maitrāyaṇī Saṃhitā (Maitrayani Samhita, Kṛṣṇa Yajurveda) with Vedic svara.',
		},
	},
	'aitareya-brahmana': {
		description: 'Aitareya Brāhmaṇa (Aitareya Brahmanam) of the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Aitareya Brāhmaṇa (Aitareya Brahmanam) of the Ṛgveda, with svara.',
			iast: 'Aitareya Brāhmaṇa (Aitareya Brahmanam) of the Ṛgveda, with Vedic svara.',
		},
	},
	'taittiriya-brahmana': {
		description: 'Taittirīya Brāhmaṇa (Taittiriya Brahmana) of the Kṛṣṇa Yajurveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Taittirīya Brāhmaṇa (Taittiriya Brahmana) with svara.',
			iast: 'Taittirīya Brāhmaṇa of the Kṛṣṇa Yajurveda, with Vedic svara.',
		},
	},
	'aitareya-aranyaka': {
		description: 'Aitareya Āraṇyaka (Aitareya Aranyaka) of the Ṛgveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Aitareya Āraṇyaka (Aitareya Aranyaka) of the Ṛgveda, with svara.',
			iast: 'Aitareya Āraṇyaka of the Ṛgveda, with Vedic svara.',
		},
	},
	'taittiriya-aranyaka': {
		description: 'Taittirīya Āraṇyaka (Taittiriya Aranyaka) of the Kṛṣṇa Yajurveda with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Taittirīya Āraṇyaka (Taittiriya Aranyaka) with svara.',
			iast: 'Taittirīya Āraṇyaka of the Kṛṣṇa Yajurveda, with Vedic svara.',
		},
	},
	'isha-upanishad': {
		description: 'Īśāvāsyopaniṣad (Isha Upanishad, Isavasya) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Īśāvāsyopaniṣad (Isha / Isavasya Upanishad) with svara.',
			iast: 'Īśāvāsyopaniṣad (Isha Upanishad, Īśāvāsya) with Vedic svara.',
		},
	},
	'kena-upanishad': {
		description: 'Kenopaniṣad (Kena Upanishad) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Kenopaniṣad (Kena Upanishad) with svara.',
			iast: 'Kenopaniṣad (Kena Upanishad) with Vedic svara.',
		},
	},
	'katha-upanishad': {
		description: 'Kaṭhopaniṣad (Katha Upanishad, Kathopanishad) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Kaṭhopaniṣad (Katha Upanishad) with svara.',
			iast: 'Kaṭhopaniṣad (Katha Upanishad, Kathopanishad) with Vedic svara.',
		},
	},
	'prashna-upanishad': {
		description: 'Praśnopaniṣad (Prashna Upanishad, Prasna, Pippalada) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Praśnopaniṣad (Prashna / Prasna Upanishad, Pippalāda) with svara.',
			iast: 'Praśnopaniṣad (Prashna Upanishad, Prasna, Pippalāda) with Vedic svara.',
		},
	},
	'taittiriya-upanishad': {
		description: 'Taittirīyopaniṣad (Taittiriya Upanishad) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Taittirīyopaniṣad (Taittiriya Upanishad) with svara.',
			iast: 'Taittirīyopaniṣad (Taittiriya Upanishad) with Vedic svara.',
		},
	},
	'mahanarayana-upanishad': {
		description: 'Mahānārāyaṇa Upaniṣad (Mahanarayana, Narayana Upanishad) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Mahānārāyaṇa Upaniṣad (Mahanarayana Upanishad) with svara.',
			iast: 'Mahānārāyaṇa Upaniṣad (Mahanarayana, Nārāyaṇa Upanishad) with Vedic svara.',
		},
	},
	'aitareya-upanishad': {
		description: 'Aitareyopaniṣad (Aitareya Upanishad) with Vedic svara — Vaidhika Dharma.',
		intro: {
			root: 'Aitareyopaniṣad (Aitareya Upanishad) with svara.',
			iast: 'Aitareyopaniṣad (Aitareya Upanishad) with Vedic svara.',
		},
	},
	search: {
		description:
			'Search Vaidhika Dharma for Vedic mantras, sandhyāvandanam, sūktas, saṃhitās, and upaniṣads.',
		intro: {
			root: 'Search mantras and rituals by common names (rudram, sandhyā, puruṣa, ganapati). Results are ordinary links Google can crawl.',
			iast: 'Search mantras and rituals by common names (rudram, sandhyā, puruṣa, ganapati). Results are ordinary links Google can crawl.',
		},
	},
};

function latinAliases(aliases: string[]): string {
	return aliases
		.filter((alias) => /[A-Za-z]/.test(alias))
		.slice(0, 4)
		.join(', ');
}

function synonymFallback(key: string): PageSeoCopy | null {
	const hrefRoot = `/${key}/`;
	const entry = SEARCH_SYNONYMS.find((item) => item.href.root === hrefRoot);
	if (!entry) return null;
	const latin = latinAliases(entry.aliases);
	const also = latin ? ` Also called ${latin}.` : '';
	return {
		description: `${entry.label.iast}${also} Vedic text with svara — Vaidhika Dharma.`,
		intro: {
			root: `${entry.label.root}.${also} Svara-marked text on Vaidhika Dharma.`,
			iast: `${entry.label.iast}.${also} Vedic svara-marked text on Vaidhika Dharma.`,
		},
	};
}

export function getPageSeoCopy(slug: string): PageSeoCopy | null {
	const key = pageKey(slug);
	if (!key) return null;
	return PAGE_SEO[key] ?? synonymFallback(key);
}

export function getUniqueSeoDescription(slug: string): string | null {
	return getPageSeoCopy(slug)?.description ?? null;
}

export function getSeoIntro(slug: string, locale: HomeLocale): string | null {
	const copy = getPageSeoCopy(slug);
	if (!copy) return null;
	return copy.intro[locale];
}
