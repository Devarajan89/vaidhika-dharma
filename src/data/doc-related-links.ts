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
		peers: ['brahmanaspati-suktam', 'ganapathy-suktam', 'swasti-suktam', 'pancha-rudram'],
	},
	yajusha: {
		root: 'याजुष मन्त्र रत्नाकरम्',
		iast: 'Yājuṣa Mantra Ratnākaram',
		peers: ['purusha-suktam', 'narayana-suktam', 'sri-suktam', 'vishnu-suktam', 'rudra-suktam'],
	},
};

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

	if (/-suktam$/.test(suktaSlug) || suktaSlug.endsWith('-prashnah') || suktaSlug === 'chamakam') {
		const defaults = ['purusha-suktam', 'narayana-suktam', 'sri-suktam', 'vishnu-suktam'].filter(
			(s) => s !== suktaSlug
		);
		return {
			title: isIast ? 'Related mantras' : 'सम्बद्ध मन्त्राः',
			links: defaults.slice(0, 4).map((s) => link(isIast, s, s, s, slugToTitle)),
		};
	}

	return undefined;
}
