export interface RelatedLink {
	label: string;
	href: string;
}

export interface DocRelatedLinksData {
	title: string;
	links: RelatedLink[];
}

interface DocEntry {
	id: string;
	data: { slug?: string; title?: string };
}

function toHref(slugPath: string): string {
	if (!slugPath || slugPath === 'index') return '/';
	return `/${slugPath}/`;
}

function getEffectiveSlug(entry: DocEntry): string {
	const custom = entry.data.slug;
	if (custom) {
		if (custom === 'index') return '';
		if (custom === 'iast/index') return 'iast';
		return custom;
	}
	if (entry.id === 'index') return '';
	return entry.id;
}

function prefix(slug: string, isIast: boolean): string {
	return isIast ? (slug.startsWith('iast/') ? slug : `iast/${slug}`) : slug.replace(/^iast\//, '');
}

function link(
	isIast: boolean,
	slug: string,
	rootLabel: string,
	iastLabel: string,
	slugToTitle?: Map<string, string>
): RelatedLink {
	const path = prefix(slug, isIast);
	const label = slugToTitle?.get(path) ?? (isIast ? iastLabel : rootLabel);
	return { label, href: toHref(path) };
}

const sandhyaTimes = ['prata', 'madhyahnika', 'sayam'] as const;

const SUkta_COLLECTIONS: Record<
	'rigveda' | 'yajusha',
	{ root: string; iast: string; peers: string[] }
> = {
	rigveda: {
		root: 'ऋग्वेद सूक्त संग्रह',
		iast: 'Ṛgveda Sūkta Saṅgraha',
		peers: [
			'brahmanaspati-suktam',
			'ganapathy-suktam',
			'swasti-suktam',
			'a-no-bhadrauh-suktam',
			'pancha-rudram',
			'devi-suktam',
			'nasadiya-suktam',
			'purusha-suktam-rig',
			'oshadhi-suktam',
			'hiranyagarbha-suktam',
		],
	},
	yajusha: {
		root: 'याजुष मन्त्र रत्नाकरम्',
		iast: 'Yājuṣa Mantra Ratnākaram',
		peers: [
			'sri-rudra-prashnah',
			'chamakam',
			'sri-rudra-laghunyasa',
			'purusha-suktam',
			'narayana-suktam',
			'sri-suktam',
			'durga-suktam',
			'medha-suktam',
			'vishnu-suktam',
			'ganapathy-atharvasirsham',
		],
	},
};

const UPANISHAD_SLUGS = [
	'isha-upanishad',
	'kena-upanishad',
	'katha-upanishad',
	'prashna-upanishad',
	'taittiriya-upanishad',
	'mahanarayana-upanishad',
	'aitareya-upanishad',
];

function getSuktaCollectionKey(entryId: string): 'rigveda' | 'yajusha' | undefined {
	if (/ऋग्वेद|ṛgveda|rigveda/i.test(entryId)) return 'rigveda';
	if (/याजुष|yājuṣa|yajusha/i.test(entryId)) return 'yajusha';
	return undefined;
}

export function getDocRelatedLinks(
	entry: DocEntry,
	locale: string | undefined,
	slugToTitle?: Map<string, string>
): DocRelatedLinksData | undefined {
	const slug = getEffectiveSlug(entry);
	const isIast = locale === 'iast' || slug.startsWith('iast/');

	const sandhyaMatch = slug.match(
		/^(?:iast\/)?(?<shakha>aswalayana|apastamba)-sandhyavandanam\/(?<time>prata|madhyahnika|sayam)$/
	);
	if (sandhyaMatch?.groups) {
		const { shakha, time } = sandhyaMatch.groups;
		const other = shakha === 'apastamba' ? 'aswalayana' : 'apastamba';
		const links: RelatedLink[] = [
			...sandhyaTimes
				.filter((t) => t !== time)
				.map((t) =>
					link(
						isIast,
						`${shakha}-sandhyavandanam/${t}`,
						t === 'prata' ? 'प्रातः सन्ध्या' : t === 'madhyahnika' ? 'माध्यान्हिकम्' : 'सायं सन्ध्या',
						t === 'prata' ? 'Prataḥ sandhyā' : t === 'madhyahnika' ? 'Madhyāhnika' : 'Sāyam sandhyā',
						slugToTitle
					)
				),
			link(
				isIast,
				`${other}-sandhyavandanam/prata`,
				other === 'apastamba' ? 'आपस्तम्ब सन्ध्या' : 'आश्वलायन सन्ध्या',
				other === 'apastamba' ? 'Āpastamba sandhyā' : 'Aśvalāyana sandhyā',
				slugToTitle
			),
			link(isIast, `${shakha}-brahmayagyam`, 'ब्रह्मयज्ञम्', 'Brahmayajñam', slugToTitle),
			link(isIast, `${shakha}-samidadhanam`, 'समिदाधानम्', 'Samidādhānam', slugToTitle),
		];
		return {
			title: isIast ? 'Related nityakarma' : 'सम्बद्ध नित्यकर्म',
			links,
		};
	}

	const nityaMatch = slug.match(/^(?:iast\/)?(?<shakha>aswalayana|apastamba)-(?<kind>brahmayagyam|samidadhanam)$/);
	if (nityaMatch?.groups) {
		const { shakha, kind } = nityaMatch.groups;
		const other = shakha === 'apastamba' ? 'aswalayana' : 'apastamba';
		const links: RelatedLink[] = [
			link(isIast, `${shakha}-sandhyavandanam/prata`, 'सन्ध्यावन्दनम्', 'Sandhyāvandanam', slugToTitle),
			link(
				isIast,
				`${other}-${kind}`,
				kind === 'brahmayagyam' ? 'अन्य शाखा — ब्रह्मयज्ञम्' : 'अन्य शाखा — समिदाधानम्',
				kind === 'brahmayagyam' ? 'Other śākhā — brahmayajñam' : 'Other śākhā — samidādhānam',
				slugToTitle
			),
		];
		return {
			title: isIast ? 'Related nityakarma' : 'सम्बद्ध नित्यकर्म',
			links,
		};
	}

	const suktaSlug = slug.replace(/^iast\//, '');
	const collectionKey = getSuktaCollectionKey(entry.id);

	if (collectionKey) {
		const meta = SUkta_COLLECTIONS[collectionKey];
		const links = meta.peers
			.filter((peer) => peer !== suktaSlug)
			.map((peer) => link(isIast, peer, peer, peer, slugToTitle));
		return {
			title: isIast ? `More from ${meta.iast}` : `${meta.root} — अन्य सूक्तानि`,
			links,
		};
	}

	if (/-suktam$/.test(suktaSlug) || suktaSlug.endsWith('-prashnah') || suktaSlug === 'chamakam' || suktaSlug.endsWith('-laghunyasa') || suktaSlug.endsWith('-atharvasirsham')) {
		const defaults = [
			'sri-rudra-prashnah',
			'chamakam',
			'sri-rudra-laghunyasa',
			'purusha-suktam',
			'narayana-suktam',
			'sri-suktam',
		].filter((s) => s !== suktaSlug);
		return {
			title: isIast ? 'Related mantras' : 'सम्बद्ध मन्त्राः',
			links: defaults.slice(0, 5).map((s) => link(isIast, s, s, s, slugToTitle)),
		};
	}

	if (UPANISHAD_SLUGS.includes(suktaSlug)) {
		return {
			title: isIast ? 'Other upaniṣads' : 'अन्याः उपनिषदः',
			links: UPANISHAD_SLUGS.filter((peer) => peer !== suktaSlug).map((peer) =>
				link(isIast, peer, peer, peer, slugToTitle)
			),
		};
	}

	const rvSukta = suktaSlug.match(/^rigveda-samhita\/mandala-(\d+)\/sukta-(\d+)$/);
	if (rvSukta) {
		const mandala = Number(rvSukta[1]);
		const sukta = Number(rvSukta[2]);
		const links: RelatedLink[] = [
			link(
				isIast,
				`rigveda-samhita/mandala-${mandala}`,
				`मण्डल ${mandala}`,
				`Maṇḍala ${mandala}`,
				slugToTitle
			),
			link(isIast, 'rigveda-samhita', 'ऋग्वेद संहिता', 'Ṛgveda Saṃhitā', slugToTitle),
		];
		if (sukta > 1) {
			links.unshift(
				link(
					isIast,
					`rigveda-samhita/mandala-${mandala}/sukta-${sukta - 1}`,
					`सूक्तम् ${sukta - 1}`,
					`Sūkta ${sukta - 1}`,
					slugToTitle
				)
			);
		}
		links.push(
			link(
				isIast,
				`rigveda-samhita/mandala-${mandala}/sukta-${sukta + 1}`,
				`सूक्तम् ${sukta + 1}`,
				`Sūkta ${sukta + 1}`,
				slugToTitle
			)
		);
		if (mandala === 10 && sukta === 90) {
			links.push(link(isIast, 'purusha-suktam-rig', 'पुरुष सूक्तम्', 'Puruṣa Sūktam', slugToTitle));
		}
		if (mandala === 10 && sukta === 129) {
			links.push(link(isIast, 'nasadiya-suktam', 'नासदीय सूक्तम्', 'Nāsadīya Sūktam', slugToTitle));
		}
		return {
			title: isIast ? 'Related Ṛgveda' : 'सम्बद्ध ऋग्वेद',
			links,
		};
	}

	const tsPrap = suktaSlug.match(/^taittiriya-samhita\/kanda-(\d+)\/prapathaka-(\d+)$/);
	if (tsPrap) {
		const kanda = Number(tsPrap[1]);
		const prapathaka = Number(tsPrap[2]);
		const links: RelatedLink[] = [
			link(
				isIast,
				`taittiriya-samhita/kanda-${kanda}`,
				`काण्ड ${kanda}`,
				`Kāṇḍa ${kanda}`,
				slugToTitle
			),
			link(isIast, 'taittiriya-samhita', 'तैत्तिरीय संहिता', 'Taittirīya Saṃhitā', slugToTitle),
			link(isIast, 'sri-rudra-prashnah', 'श्री रुद्रम्', 'Śrī Rudram', slugToTitle),
		];
		if (prapathaka > 1) {
			links.unshift(
				link(
					isIast,
					`taittiriya-samhita/kanda-${kanda}/prapathaka-${prapathaka - 1}`,
					`प्रपाठक ${prapathaka - 1}`,
					`Prapāṭhaka ${prapathaka - 1}`,
					slugToTitle
				)
			);
		}
		return {
			title: isIast ? 'Related Taittirīya' : 'सम्बद्ध तैत्तिरीय',
			links,
		};
	}

	const chapterMatch = suktaSlug.match(/^(kanva-samhita|madhyandina-samhita)\/chapter-(\d+)(?:-index)?$/);
	if (chapterMatch) {
		const corpus = chapterMatch[1];
		const chapter = Number(chapterMatch[2]);
		const corpusLabel =
			corpus === 'kanva-samhita'
				? { root: 'काण्व संहिता', iast: 'Kāṇva Saṃhitā' }
				: { root: 'माध्यन्दिन संहिता', iast: 'Mādhyandina Saṃhitā' };
		const links: RelatedLink[] = [
			link(isIast, corpus, corpusLabel.root, corpusLabel.iast, slugToTitle),
		];
		if (chapter > 1) {
			links.unshift(
				link(
					isIast,
					`${corpus}/chapter-${chapter - 1}`,
					`अध्याय ${chapter - 1}`,
					`Adhyāya ${chapter - 1}`,
					slugToTitle
				)
			);
		}
		links.push(
			link(
				isIast,
				`${corpus}/chapter-${chapter + 1}`,
				`अध्याय ${chapter + 1}`,
				`Adhyāya ${chapter + 1}`,
				slugToTitle
			)
		);
		return {
			title: isIast ? 'Related chapters' : 'सम्बद्ध अध्यायाः',
			links,
		};
	}

	return undefined;
}
