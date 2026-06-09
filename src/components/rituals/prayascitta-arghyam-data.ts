import type { LocaleKey, RitualVariant, SandhyaTime } from './sandhya-types';

export type PrayascittaBody = string;

const bodies: Record<LocaleKey, Record<RitualVariant, Partial<Record<SandhyaTime, PrayascittaBody>>>> = {
	"root": {
		"aswalayana": {
			"prata": ">ममोपात्त समस्त दुरित क्षयद्वारा श्री परमेश्वर प्रीत्यर्थं प्रात: सन्ध्या कालातीत प्रायश्चित्त अर्घ्यप्रदानं करिष्ये  ॥ \n\n**प्रायश्चित्तार्घ्यप्रदान मन्त्रस्य । यदद्य इत्यस्य शौनक​: ऋषि । सूर्यो देवता । गायत्री छन्द​: - प्रायश्चित्तार्घ्यप्रदाने विनियोग​:**\n\n>यद॒द्य कच्च॑ व्रुत्रहन्नु॒दगा॑ अ॒भि सू॑र्य । सर्वं॒ तदि॑न्द्र ते॒वषे॑ ॥\n\n*इति एकं अर्घ्यं दत्वा* \n\n>ओं भूर्भुव॒स्व॑: असावादित्यो ब्रह्मा \n\n*इति आत्मानं परिषिच्य​*",
			"madhyahnika": ">ममोपात्त समस्त दुरित क्षयद्वारा श्री परमेश्वर प्रीत्यर्थं माध्यान्हिक​ कालातीत प्रायश्चित्त अर्घ्यप्रदानं करिष्ये  ॥ \n\n**उद्धेदभि इत्यस्य. सुकक्ष​: ऋषि: । गायत्री छन्द​: । सूर्यो देवता - प्रायश्चित्तार्घ्य प्रदाने विनियोग​:**\n\n>उद्धेद॒भि श्रु॒ताम॑घं वृष॒भं नर्या॑पसम् । अस्ता॑रमेषि सूर्य ॥\n\n*इति एकं अर्घ्यं दत्वा* \n\n>ओं भूर्भुव॒स्व॑: असावादित्यो ब्रह्मा \n\n*इति आत्मानं परिषिच्य​*",
			"sayam": ">ममोपात्त समस्त दुरित क्षयद्वारा श्री परमेश्वर प्रीत्यर्थं प्रात: सन्ध्या कालातीत प्रायश्चित्त अर्घ्यप्रदानं करिष्ये  ॥ \n\n**प्रायश्चित्तार्घ्यप्रदान मन्त्रस्य । नतस्येत्यस्य विश्वमना: ऋषि: । उष्णिक् छन्द​: । अग्निर्देवता - प्रायश्चित्तार्घ्यप्रदाने विनियोग​:**\n\n>न तस्य॑ मा॒यया॑ च॒न रि॒पुरी॑शीत॒ मर्त्य॑: । यो अ॒ग्नये॑ त॒दाश॑ ह॒व्यता॑तिभि: ॥\n\n*इति एकं अर्घ्यं दत्वा* \n\n>ओं भूर्भुव॒स्व॑: असावादित्यो ब्रह्मा \n\n*इति आत्मानं परिषिच्य​*"
		},
		"apastamba": {
			"prata": ">ममोपात्त समस्त दुरित क्षयद्वारा श्री परमेश्वर प्रीत्यर्थं प्रात: सन्ध्या कालातीत प्रायश्चित्त अर्घ्यप्रदानं करिष्ये  ॥ \nओं भूर्भुव॒:सुव॑: तत्स॑वि॒तुर्वरे᳚ण्यं॒ भर्गो॑ दे॒वस्य॑ धीमहि । धियो॒ योन॑: प्रचो॒दया᳚त् ॥\n\n>ओं भूर्भुव॒:सुव॑  असावादित्यो ब्रह्मा ।  ब्रह्मैवाहमस्मि ।\n\n*इति आत्मानं परिषिच्य​*",
			"madhyahnika": ">ममोपात्त समस्त दुरित क्षयद्वारा श्री परमेश्वर प्रीत्यर्थं माध्याऩ्हिक कालातीत प्रायश्चित्त अर्घ्यप्रदानं करिष्ये  ॥ \nओं भूर्भुव॒:सुव॑: तत्स॑वि॒तुर्वरे॑ण्यं॒ भर्गो॑ दे॒वस्य॑ धीमहि । धियो॒ योन॑: प्रचो॒दया॑॑त् ॥\n\n>ओं भूर्भुव॒:सुव॑  असावादित्यो ब्रह्मा ।  ब्रह्मैवाहमस्मि ।\n\n*इति आत्मानं परिषिच्य​*",
			"sayam": ">ममोपात्त समस्त दुरित क्षयद्वारा श्री परमेश्वर प्रीत्यर्थं सायं सन्ध्या कालातीत प्रायश्चित्त अर्घ्यप्रदानं करिष्ये  ॥ \nओं भूर्भुव॒:सुव॑: तत्स॑वि॒तुर्वरे॑ण्यं॒ भर्गो॑ दे॒वस्य॑ धीमहि । धियो॒ योन॑: प्रचो॒दया॑॑त् ॥\n\n>ओं भूर्भुव॒:सुव॑: । \nअसावादित्यो ब्रह्मा ।  ब्रह्मैवाहमस्मि ।\n\n*इति आत्मानं परिषिच्य​*"
		}
	},
	"iast": {
		"aswalayana": {
			"prata": ">Mamopātta samasta durita kṣayadvārā śrī parameśvara prītyarthaṃ Sāyam sandhyā kālātīta prāyaścitta arghyapradānaṃ kariṣye  .. \n\n**prāyaścittārghyapradāna mantrasya . yadadya ityasya śaunaka​: ṛṣi . sūryo devatā . gāyatrī chanda​: - prāyaścittārghyapradāne viniyoga​:**\n\n>Yada̱dya kacca̍ vrutrahannu̱dagā̍ a̱bhi sū̍rya . Sarva̱ṃ tadi̍ndra te̱vaṣe̍ ..\n\n*Swirl the water around the head thoroughly.*\n\n>Oṃ bhūrbhuva̱sva​:̍  asāvādityo brahmā",
			"madhyahnika": ">mamopātta samasta durita kṣayadvārā śrī parameśvara prītyarthaṃ mādhyānhika​ kālātīta prāyaścitta arghyapradānaṃ kariṣye  .. \n\n**uddhedabhi ityasya. sukakṣa​: ṛṣi: . gāyatrī chanda​: . sūryo devatā - prāyaścittārghya pradāne viniyoga​:**\n\n>uddheda̱bhi śru̱tāma̍ghaṃ vṛṣa̱bhaṃ naryā̍pasam . astā̍rameṣi sūrya ..\n\n*Swirl the water around the head thoroughly.*\n\n>Oṃ bhūrbhuva̱sva̍:  asāvādityo brahmā",
			"sayam": ">Mamopātta samasta durita kṣayadvārā śrī parameśvara prītyarthaṃ sāyaṃ sandhyā kālātīta prāyaścitta arghyapradānaṃ kariṣye  .. \n\n**prāyaścittārghyapradāna mantrasya . natasyetyasya viśvamanā: ṛṣi: . uṣṇik chanda​: . agnirdevatā - prāyaścittārghyapradāne viniyoga​:**\n\n>na tasya̍ mā̱yayā̍ ca̱na ri̱purī̍śīta̱ martya̍: . yo a̱gnaye̍ ta̱dāśa̍ ha̱vyatā̍tibhi: ..\n*Swirl the water around the head thoroughly.*\n\n>Oṃ bhūrbhuva̱sva​:̍  asāvādityo brahmā"
		},
		"apastamba": {
			"prata": ">Mamopātta samasta durita kṣayadvārā śrī parameśvara prītyarthaṃ prāta: sandhyā kālātīta prāyaścitta arghyapradānaṃ kariṣye  .. \n\n>Oṃ bhūrbhuva̱:suva̍: tatsa̍vi̱turvare̎ṇya̱ṃ bhargo̍ de̱vasya̍ dhīmahi . Dhiyo̱ yona̍: praco̱dayā̎t ..\nOṃ bhūrbhuva̱sva​:̍  asāvādityo brahmā  brahmaivāhamasmi .\n\n*Swirl the water around the head thoroughly.*",
			"madhyahnika": ">Mamopātta samasta durita kṣayadvārā śrī parameśvara prītyarthaṃ Mādhyāṉhika kālātīta prāyaścitta arghyapradānaṃ kariṣye  .. \nOṃ bhūrbhuva̱:suva̍: tatsa̍vi̱turvare̎ṇya̱ṃ bhargo̍ de̱vasya̍ dhīmahi . Dhiyo̱ yona̍: praco̱dayā̎t ..\nOṃ bhūrbhuva̱sva​:̍  asāvādityo brahmā  brahmaivāhamasmi .\n\n*(Swirl and throw an uttaraṇī of water around the head.)*",
			"sayam": ">Mamopātta samasta durita kṣayadvārā śrī parameśvara prītyarthaṃ Sāyam sandhyā kālātīta prāyaścitta arghyapradānaṃ kariṣye  .. \nOṃ bhūrbhuva̱:suva̍: tatsa̍vi̱turvare̎ṇya̱ṃ bhargo̍ de̱vasya̍ dhīmahi . Dhiyo̱ yona̍: praco̱dayā̎t ..\nOṃ bhūrbhuva̱sva​:̍  asāvādityo brahmā  brahmaivāhamasmi .\n\n*(Swirl and throw an uttaraṇī of water around the head.)*"
		}
	}
};

export function getPrayascittaBody(localeKey: LocaleKey, variant: RitualVariant, time: SandhyaTime): string {
  return bodies[localeKey][variant][time]!;
}
