export interface LocaleSwitch {
	href: string;
	label: string;
}

export interface TrikalaLink {
	time: 'prata' | 'madhyahnika' | 'sayam';
	href: string;
	label: string;
	isCurrent: boolean;
}

export interface ContextChip {
	label: string;
}

export interface DocPageNavData {
	localeSwitch?: LocaleSwitch;
	trikalaLinks?: TrikalaLink[];
	contextChips?: ContextChip[];
}

interface DocEntry {
	id: string;
	data: { slug?: string };
}

const SANDHYA_SLUG =
	/^(?<iast>iast\/)?(?<shakha>aswalayana|apastamba)-sandhyavandanam\/(?<time>prata|madhyahnika|sayam)$/;

const TRIKALA = [
	{ time: 'prata' as const, rootLabel: 'प्रातः सन्ध्या', iastLabel: 'Prataḥ sandhyā' },
	{ time: 'madhyahnika' as const, rootLabel: 'माध्यान्हिकम्', iastLabel: 'Madhyāhnika' },
	{ time: 'sayam' as const, rootLabel: 'सायं सन्ध्या', iastLabel: 'Sāyam sandhyā' },
] as const;

function toHref(slugPath: string): string {
	if (!slugPath || slugPath === 'index') return '/';
	return `/${slugPath}/`;
}

/** URL slug used for routing (frontmatter slug when set, otherwise collection id). */
export function getEffectiveSlug(entry: DocEntry): string {
	const custom = entry.data.slug;
	if (custom) {
		if (custom === 'index') return '';
		if (custom === 'iast/index') return 'iast';
		return custom;
	}
	if (entry.id === 'index') return '';
	return entry.id;
}

export function getDocPageNav(
	entry: DocEntry,
	locale: string | undefined
): DocPageNavData {
	const slug = getEffectiveSlug(entry);
	const isIast = locale === 'iast' || slug.startsWith('iast/');

	const localeSwitch = getLocaleSwitch(slug, isIast);
	const sandhya = slug.match(SANDHYA_SLUG);

	if (!sandhya?.groups) {
		const nityaMatch = slug.match(
			/^(?:iast\/)?(?<shakha>aswalayana|apastamba)-(?<kind>brahmayagyam|samidadhanam)$/
		);
		if (nityaMatch?.groups) {
			const { shakha, kind } = nityaMatch.groups;
			const contextChips: ContextChip[] = [
				{
					label:
						shakha === 'apastamba'
							? isIast
								? 'Āpastamba · Kṛṣṇa Yajurveda'
								: 'आपस्तम्ब · कृष्ण यजुर्वेद'
							: isIast
								? 'Aśvalāyana · Ṛgveda'
								: 'आश्वलायन · ऋग्वेद',
				},
				{
					label: isIast
						? kind === 'brahmayagyam'
							? 'Brahmayajñam'
							: 'Samidādhānam'
						: kind === 'brahmayagyam'
							? 'ब्रह्मयज्ञम्'
							: 'समिदाधानम्',
				},
			];
			return { localeSwitch, contextChips };
		}

		const suktaSlug = slug.replace(/^iast\//, '');
		if (/-suktam$/.test(suktaSlug) || suktaSlug.endsWith('-prashnah') || suktaSlug === 'chamakam') {
			return {
				localeSwitch,
				contextChips: [{ label: isIast ? 'Veda mantra' : 'वेद मन्त्रः' }],
			};
		}

		return { localeSwitch };
	}

	const { iast, shakha, time } = sandhya.groups;
	const prefix = `${iast ?? ''}${shakha}-sandhyavandanam`;
	const useIastLabels = Boolean(iast);

	const trikalaLinks: TrikalaLink[] = TRIKALA.map(({ time: t, rootLabel, iastLabel }) => ({
		time: t,
		href: toHref(`${prefix}/${t}`),
		label: useIastLabels ? iastLabel : rootLabel,
		isCurrent: t === time,
	}));

	const contextChips: ContextChip[] =
		shakha === 'apastamba'
			? [
					{
						label: useIastLabels
							? 'Āpastamba · Kṛṣṇa Yajurveda'
							: 'आपस्तम्ब · कृष्ण यजुर्वेद',
					},
				]
			: [
					{
						label: useIastLabels ? 'Aśvalāyana · Ṛgveda' : 'आश्वलायन · ऋग्वेद',
					},
				];

	return { localeSwitch, trikalaLinks, contextChips };
}

function getLocaleSwitch(slug: string, isIast: boolean): LocaleSwitch {
	if (isIast) {
		if (slug === 'iast') {
			return { href: '/', label: 'देवनागरी' };
		}
		return { href: toHref(slug.replace(/^iast\//, '')), label: 'देवनागरी' };
	}

	if (!slug) {
		return { href: '/iast/', label: 'IAST' };
	}

	return { href: toHref(`iast/${slug}`), label: 'IAST' };
}
