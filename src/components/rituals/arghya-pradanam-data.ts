import type { LocaleKey, RitualVariant, SandhyaTime } from './sandhya-types';

export interface ArghyaPradanamBlock {
	title: string;
	instruction?: string;
	meta?: string;
	mantra: string;
	afterNote?: string;
}

const aswalayanaGayatri = {
	root: 'ऒं तत्स॑वि॒तुर्वरे॑ण्यं॒ भर्गो॑ दे॒वस्य॑ धीमहि । धियो॒ योन॑: प्रचो॒दया॑॑त् ॥',
	iast: 'Ŏṃ tatsa̍vi̱turvare̍ṇya̱ṃ bhargo̍ de̱vasya̍ dhīmahi . Dhiyo̱ yona̍: praco̱dayā̍̍t ..',
} as const;

const apastambaGayatri = {
	root: 'ओं भूर्भुव॒:सुव॑: तत्स॑वि॒तुर्वरे॑ण्यं॒ भर्गो॑ दे॒वस्य॑ धीमहि । धियो॒ योन॑: प्रचो॒दया॑॑त् ॥',
	iast: 'Oṃ bhūrbhuva̱:suva̍: tatsa̍vi̱turvare̎ṇya̱ṃ bhargo̍ de̱vasya̍ dhīmahi . Dhiyo̱ yona̍: praco̱dayā̎t ..',
} as const;

export function getArghyaPradanamBlock(
	localeKey: LocaleKey,
	variant: RitualVariant,
	time: SandhyaTime,
): ArghyaPradanamBlock {
	if (variant === 'aswalayana') {
		const instruction =
			localeKey === 'iast'
				? time === 'sayam'
					? 'Stand with water in both hands, raise them to the eyebrows, and offer the arghya tīrtha on clean ground or into water while completing the mantra. In the morning, face east; in the evening, face west; offer three arghyas. During madhyāhnika, offer two. In all three periods, offer arghya while standing.'
					: 'Stand with water in both hands, raise them to the eyebrows, and offer the arghya tīrtha on clean ground or into water while completing the mantra. In the morning and evening, offer three arghyas. During madhyāhnika, offer two. In all three periods, offer arghya while standing.'
				: undefined;

		return {
			title: localeKey === 'root' ? 'अर्घ्य प्रदानं' : 'Arghya pradānaṃ',
			instruction,
			meta:
				localeKey === 'root'
					? '**अर्घ्यप्रदान मन्त्रस्य विश्वामित्र ऋषि: । सविता देवता । गायत्री छन्द​: - अर्घ्य प्रदाने विनियोग​:**'
					: '**arghyapradāna mantrasya viśvāmitra ṛṣi: . savitā devatā . gāyatrī chanda​: - arghya pradāne viniyoga​:**',
			mantra: aswalayanaGayatri[localeKey],
			afterNote:
				localeKey === 'root'
					? time === 'madhyahnika'
						? 'इति अर्घ्यं द्विवारं समन्त्रकं दद्यात्'
						: 'इति अर्घ्यं त्रिवारं समन्त्रकं दद्यात्'
					: undefined,
		};
	}

	return {
		title: localeKey === 'root' ? 'अर्घ्य प्रदानं' : 'Arghya pradānaṃ',
		instruction:
			localeKey === 'iast'
				? 'Stand with water in both hands, raise them to the eyebrows, and offer the arghya tīrtha on clean ground or into water while completing the mantra. In the morning and evening, offer three arghyas. During madhyāhnika, offer two. In all three periods, offer arghya while standing.'
				: undefined,
		mantra: apastambaGayatri[localeKey],
		afterNote:
			localeKey === 'root'
				? time === 'prata'
					? 'इति अर्घ्यं त्रिवारं दद्यात्'
					: 'इति अर्घ्यं दद्यात्'
				: undefined,
	};
}
