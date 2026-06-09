import type { LocaleKey, RitualVariant, SandhyaTime } from './sandhya-types';

export interface PrashanamBlock {
	title: string;
	instruction?: string;
	meta?: string;
	mantra: string;
	afterNote?: string;
}

const blocks: Record<
	LocaleKey,
	Record<RitualVariant, Partial<Record<SandhyaTime, PrashanamBlock>>>
> = {
	root: {
		aswalayana: {
			prata: {
				title: 'प्राशनम्',
				meta: '**सूर्यश्चेत्यस्य अग्निरृषि: । सूर्यो देवता । देवी गायत्री छन्द​: - अपां प्राशने विनियोग​:**',
				mantra:
					'सूर्यश्च मा मऩ्युश्च मन्युपतयश्च मन्यु॑कृते॒भ्य​: । पापेभ्यो॑ रक्ष॒न्ताम् । यद्रात्र्या  पाप॑मका॒र्षम् । मनसावाचा॑ हस्ता॒भ्यां । पद्भ्यामुदरे॑णशि॒ष्न । रात्रि॒स्तद॑व लु॒म्पतु । यत्किंच॑ दुरि॒तम् मयि॑ । इदमहं माममृ॑त यो॒नौ । सूर्ये ज्योतिषि जुहो॑मि स्वा॒हा।',
				afterNote: 'इति अप​: प्राश्य​',
			},
			madhyahnika: {
				title: 'प्राशनम्',
				meta: '**आप​: पुनन्तु इत्यस्य विश्वेदेवा ऋषय: । अनुष्टुप् छन्द​: । आपो देवता - अपां प्राशने विनियोग​:**',
				mantra:
					'आप॑: पुनंतु प्रुथि॒वीम् प्रु॑थि॒वी पू॒ता पु॑नातु॒माम् । पु॒नंतु॒ ब्रह्म॑ण॒स्पति॒र्ब्रह्म॑ पू॒ता पु॑नातु॒मां ॥ यदुच्छि॑ष्ट॒म भो॑ज्यम्॒ यद्वा॑ दु॒श्चरि॑तं॒ मम॑ । सर्वं॑ पुनंतु॒॑ मामापो स॒तांच॑ प्रति॒ग्रहं॒ स्वाहा ॥',
				afterNote: 'इति अप​: प्राश्य​',
			},
			sayam: {
				title: 'प्राशनम्',
				meta: '**अग्निश्चेत्यस्य सूर्य​ऋषि: । अग्निर्देवता । देवी गायत्री छन्द​: - अपां प्राशने विनियोग​:**',
				mantra:
					'अक्ऩिश्च मामऩ्युश्च मन्युपतयश्च मन्यु॑क्रुते॒भ्य: । पापेभ्यो॑ रक्षं॒ताम् । यतऩ्हा  पाप॑मका॒र्षम् । मऩसावाचा॑ हस्ता॒भ्यां पद्भ्यां उदरे॑णशि॒ष्न । अह॒स्तत॑व लुं॒पतु । यत्किंच॑ दुरि॒तं मयि॑ । इदमहमाममृ॑त  यो॒नौ । सत्ये  ज्योतिषि जुहो॑मि स्वा॒हा ।',
				afterNote: 'इति अप​: प्राश्य​',
			},
		},
		apastamba: {
			prata: {
				title: 'प्राशनम्',
				mantra:
					'सूर्यश्च मा मऩ्युश्च मन्युपतयश्च मन्यु॑कृते॒भ्य​: । पापेभ्यो॑ रक्ष॒न्ताम् । यद्रात्रिया  पाप॑मका॒र्षम् । मनसावाचा॑ हस्ता॒भ्यां । पद्भ्यामुदरे॑णशि॒ष्न । रात्रि॒स्तद॑व लु॒म्पतु । यत्किंच॑ दुरि॒तं मयि॑ । इदमहं माममृ॑त यो॒नौ । सूर्ये ज्योतिषि जुहो॑मि स्वा॒हा।',
				afterNote: 'इति अप​: प्राश्य​',
			},
			madhyahnika: {
				title: 'प्राशनम्',
				mantra:
					'आप॑: पुनंतु प्रुथि॒वीम् प्रु॑थि॒वी पू॒ता पु॑नातु॒माम् । पु॒नंतु॒ ब्रह्म॑ण॒स्पति॒र्ब्रह्म॑ पू॒ता पु॑नातु॒मां ॥ यदुच्छि॑ष्ट॒म भो॑ज्यम्॒ यद्वा॑ दु॒श्चरि॑तं॒ मम॑ । सर्वं॑ पुनंतु॒॑ मामापो स॒तांच॑ प्रति॒ग्रहं॒ स्वाहा ॥',
				afterNote: 'इति अप​: प्राश्य​',
			},
			sayam: {
				title: 'प्राशनम्',
				mantra:
					'अग्निश्च मामन्युश्च मन्युपतयश्च मन्यु॑क्रुते॒भ्य: । पापेभ्यो रक्षं॒ताम् ।  यदन्हा  पापमका॒र्षम् । मनसावाचा हस्ताभ्याम् पद्भ्याम् उदरे॑णशि॒ष्न । अह॒स्तत॑व लु॒म्पतु । यत्किम्च॑ दुरि॒तं मयि॑ । इदमहं माममरु॑त यो॒नौ । सत्ये ज्योतिषि जुहो॑मि स्वा॒हा ।',
				afterNote: 'इति अप​: प्राश्य​',
			},
		},
	},
	iast: {
		aswalayana: {
			prata: {
				title: 'Prāśanam',
				instruction: 'Take one uttaraṇī of water and hold it in the right hand.',
				meta: '**sūryaścetyasya agnirṛṣi: . sūryo devatā . devī gāyatrī chanda​: - apaṃ prāśane viniyoga​:**',
				mantra:
					'Sūryaśca mā maṉyuśca manyupatayaśca manyu̍kṛte̱bhya​: . Pāpebhyo̍ rakṣa̱ntām . Yadrātryā  pāpa̍makā̱rṣam . Manasāvācā̍ hastā̱bhyāṃ . Padbhyāmudare̍ṇaśi̱ṣna . Rātri̱stada̍va lu̱mpatu . Yatkiñca̍ duri̱tam mayi̍ . Idamahaṃ māmamṛ̍ta yo̱nau . Sūrye jyotiṣi juho̍mi svā̱hā.',
				afterNote: 'Chant this and drink the tīrtha.',
			},
			madhyahnika: {
				title: 'prāśanam',
				instruction: 'Take one uttaraṇī of water and hold it in the right hand.',
				meta: '**āpa​: punantu ityasya viśvedevā ṛṣaya: . anuṣṭup chanda​: . āpo devatā - apāṃ prāśane viniyoga​:**',
				mantra:
					'āpa̍: punaṃtu pruthi̱vīm pru̍thi̱vī pū̱tā pu̍nātu̱mām . pu̱naṃtu̱ brahma̍ṇa̱spati̱rbrahma̍ pū̱tā pu̍nātu̱māṃ .. yaducchi̍ṣṭa̱ma bho̍jyam̱ yadvā̍ du̱ścari̍ta̱ṃ mama̍ . sarva̍ṃ punaṃtu̱̍ māmāpo sa̱tāṃca̍ prati̱graha̱ṃ svāhā ..',
				afterNote: 'Chant this and drink the tīrtha.',
			},
			sayam: {
				title: 'Prāśanam',
				instruction: 'Take one uttaraṇī of water and hold it in the right hand.',
				meta: '**agniścetyasya sūrya​ṛṣi: . agnirdevatā . devī gāyatrī chanda​: - apāṃ prāśane viniyoga​:**',
				mantra:
					'Akṉiśca māmaṉyuśca manyupatayaśca manyu̍krute̱bhya: . pāpebhyo̍ rakṣa̱ṃtām . yataṉhā  pāpa̍makā̱rṣam . maṉasāvācā̍ hastā̱bhyāṃ padbhyāṃ udare̍ṇaśi̱ṣna . aha̱stata̍va lu̱ṃpatu . yatkiṃca̍ duri̱taṃ mayi̍ . idamahamāmamṛ̍ta  yo̱nau . satye  jyotiṣi juho̍mi svā̱hā .',
				afterNote: 'Chant this and drink the tīrtha.',
			},
		},
		apastamba: {
			prata: {
				title: 'Prāśanam',
				instruction: 'Take one uttaraṇī of water and hold it in the right hand.',
				mantra:
					'Sūryaśca mā maṉyuśca manyupatayaśca manyu̍kṛte̱bhya​: . Pāpebhyo̍ rakṣa̱ntām . Yadrātryā  pāpa̍makā̱rṣam . Manasāvācā̍ hastā̱bhyāṃ . Padbhyāmudare̍ṇaśi̱ṣna . Rātri̱stada̍va lu̱mpatu . Yatkiñca̍ duri̱tam mayi̍ . Idamahaṃ māmamṛ̍ta yo̱nau . Sūrye jyotiṣi juho̍mi svā̱hā.',
				afterNote: 'Chant this and drink the tīrtha.',
			},
			madhyahnika: {
				title: 'Prāśanam',
				instruction: 'Take one uttaraṇī of water and hold it in the right hand.',
				mantra:
					'Āpa̍: punantu pruthi̱vīm pru̍thi̱vī pū̱tā pu̍nātu̱mām . Pu̱nantu̱ brahma̍ṇa̱spati̱rbrahma̍ pū̱tā pu̍nātu̱māṃ .. Yaducchi̍ṣṭa̱ma bho̍jyam̱ yadvā̍ du̱ścari̍ta̱ṃ mama̍ . Sarva̍ṃ punantu̱̍ māmāpo sa̱tāñca̍ prati̱graha̱ṃ svāhā ..',
				afterNote: 'Chant this and drink the tīrtha.',
			},
			sayam: {
				title: 'Prāśanam',
				instruction: 'Take one uttaraṇī of water and hold it in the right hand.',
				mantra:
					'Agniśca māmanyuśca manyupatayaśca manyu̍krute̱bhya: . Pāpebhyo rakṣa̱ntām .  Yadanhā  pāpamakā̱rṣam . Manasāvācā hastābhyām padbhyām udare̍ṇaśi̱ṣna . Aha̱stata̍va luu̱mpatu . Yatkimca̍ duri̱tam mayi̍ . Idamaham māmamaru̍ta yo̱nau . Satye jyotiṣi juho̍mi s̱vāhā .',
				afterNote: 'Chant this and drink the tīrtha.',
			},
		},
	},
};

export function getPrashanamBlock(
	localeKey: LocaleKey,
	variant: RitualVariant,
	time: SandhyaTime,
): PrashanamBlock {
	return blocks[localeKey][variant][time]!;
}
