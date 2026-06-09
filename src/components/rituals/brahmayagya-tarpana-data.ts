import type { LocaleKey, RitualVariant } from './sandhya-types';

export interface TarpanaBlock {
	instruction?: string;
	label?: string;
	rows: string[][];
	columns: number;
	note?: string;
}

export function getBrahmayagyaTarpanaBlocks(
	localeKey: LocaleKey,
	variant: RitualVariant,
): TarpanaBlock[] {
	const key = `${localeKey}:${variant}` as const;
	return blocks[key] ?? [];
}

const pitruMatruNote = {
	root: '*पितृवर्ग / मातृवर्ग - तर्पणानि – जीवत्पितृकः न कुर्यात् ।*',
	iastAs: "*pitṛvarga / mātṛvarga tarpaṇa — should not be performed if one's father is alive.*",
	iastAp: '*pitṛvarga / mātṛvarga - tarpaṇāni – jīvatpitṛkaḥ na kuryāt |*',
} as const;

const devaRows = {
	root: [
		['१.प्रजापतिस्तृप्यतु', '२.ब्रह्मा तृप्यतु', '३.वेदास्तृप्यन्तु'],
		['४.देवास्तृप्यन्तु', '५.ऋषयस्तृप्यन्तु', '६.सर्वाणि छन्दांसि तृप्यन्तु'],
		['७.ओङ्कारस्तृप्यतु', '८.वषट्कारस्तृप्यतु', '९.व्याहृतयस्तृप्यन्तु'],
		['१०.सावित्री तृप्यतु', '११.यज्ञास्तृप्यन्तु', '१२.द्यावापृथिवी तृप्येताम्'],
		['१३.अन्तरिक्षं तृप्यतु', '१४.अहोरात्राणि तृप्यतु', '१५.साङ्ख्यास्तृप्यन्तु'],
		['१६.सिद्धास्तृप्यन्तु', '१७.समुद्रास्तृप्यन्तु', '१८.नद्यस्तृप्यन्तु'],
		['१९.गिरयस्तृप्यन्तु', '२०.क्षेत्रौषधिवनस्पतिगन्धर्वाप्सरसस्तृप्यन्तु', '२१.नागास्तृप्यन्तु'],
		['२२.व्यांसि तृप्यन्तु', '२३.गावस्तृप्यन्तु', '२४.साध्यास्तृप्यन्तु'],
		['२५.विप्रास्तृप्यन्तु', '२६.यक्षास्तृप्यन्तु', '२७.रक्षांसि तृप्यन्तु'],
		['२८.भूतानि तृप्यन्तु', '२९.एवमन्तानि तृप्यन्तु ॥'],
	],
} as const;

const rishiRows = {
	root: [
		['१.शतर्चिनस्तृप्यन्तु', '२.माध्यमास्तृप्यन्तु', '३.गृत्समदस्तृप्यतु'],
		['४.विश्वामित्रस्तृप्यतु', '५.वामदेवस्तृप्यतु', '६.अत्रिस्तृप्यतु'],
		['७.भरद्वाजस्तृप्यतु', '८.वसिष्ठस्तृप्यतु', '९.प्रगाथास्तृप्यन्तु'],
		['१०.पावमान्यस्तृप्यन्तु', '११.क्षुद्रसूक्तास्तृप्यन्तु', '१२.महासूक्तास्तृप्यन्तु ॥'],
	],
} as const;

const acharyaRows = {
	root: [
		['१.सुमन्तु - जैमिनि - वैशम्पायन - पैल - सूत्र - भाष्य - भारत - महाभारत - धर्माचार्यास्तृप्यन्तु'],
		['२.जानन्ति - बाहवि - गार्ग्य - गौतम - शाकल - बाभ्रव्य - माण्डव्य - माण्डूकेयास्तृप्यन्तु'],
		['३.वाचक्नवी तृप्यतु', '४.वडवा प्रातीथेयी तृप्यतु'],
		['५.सुलभा मैत्रेयी तृप्यतु', '६.कहोळं तर्पयामि'],
		['७.कौषीतकं तर्पयामि', '८.महाकौषीतकं तर्पयामि'],
		['९.पैङ्ग्यं तर्पयामि', '१०.महापैङ्ग्यं तर्पयामि'],
		['११.सुयज्ञं तर्पयामि', '१२.साङ्ख्यायनं तर्पयामि'],
		['१३.ऐतरेयं तर्पयामि', '१४.महैतरेयं तर्पयामि'],
		['१५.शाकलं तर्पयामि', '१६.बाष्कलं तर्पयामि'],
		['१७.सुजातवक्रं तर्पयामि', '१८.औदवाहिं तर्पयामि'],
		['१९.महौदवाहिं तर्पयामि', '२०.सौजामिं तर्पयामि'],
		['२१.शौनकं तर्पयामि', '२२.आश्वलायनं तर्पयामि'],
		['२३.ये चान्ये आचार्यास्ते सर्वे तृप्यन्तु (त्रिः) ॥'],
	],
} as const;

const pitruMatruRows = {
	iast: [
		['1. pitṝn svadhā namastarpayāmi', '2. pitāmahān svadhā namastarpayāmi', '3. prapitāmahān svadhā namastarpayāmi'],
		['4. mātṛḥ svadhā namastarpayāmi', '5. pitāmahī svadhā namastarpayāmi', '6. prapitāmahī svadhā namastarpayāmi'],
		['7. mātāmahān svadhā namastarpayāmi', '8. mātuḥ pitāmahān svadhā namastarpayāmi', '9. mātuḥ prapitāmahān svadhā namastarpayāmi'],
		['10. mātāmahī svadhā namastarpayāmi', '11. mātuḥ pitāmahī svadhā namastarpayāmi', '12. mātuḥ prapitāmahī svadhā namastarpayāmi'],
	],
	iastAp: [
		['1.Pitṝn svadhā namastarpayāmi', '2.Pitāmahān svadhā namastarpayāmi', '3.Prapitāmahān svadhā namastarpayāmi'],
		['4.Mātṛḥ svadhā namastarpayāmi', '5.Pitāmahī svadhā namastarpayāmi', '6.Prapitāmahī svadhā namastarpayāmi'],
		['7.Mātāmahān svadhā namastarpayāmi', '8.Mātuḥ pitāmahān svadhā namastarpayāmi', '9.Mātuḥ prapitāmahān svadhā namastarpayāmi'],
		['10.Mātāmahī svadhā namastarpayāmi', '11.Mātuḥ pitāmahī svadhā namastarpayāmi', '12.Mātuḥ prapitāmahī svadhā namastarpayāmi'],
	],
	root: [
		['१.पितॄन् स्वधा नमस्तर्पयामि', '२.पितामहान् स्वधा नमस्तर्पयामि', '३.प्रपितामहान् स्वधा नमस्तर्पयामि'],
		['४.मातृः स्वधा नमस्तर्पयामि', '५.पितामही स्वधा नमस्तर्पयामि', '६.प्रपितामही स्वधा नमस्तर्पयामि'],
		['७.मातामहान् स्वधा नमस्तर्पयामि', '८.मातुः पितामहान् स्वधा नमस्तर्पयामि', '९.मातुः प्रपितामहान् स्वधा नमस्तर्पयामि'],
		['१०.मातामही स्वधा नमस्तर्पयामि', '११.मातुः पितामही स्वधा नमस्तर्पयामि', '१२.मातुः प्रपितामही स्वधा नमस्तर्पयामि'],
	],
} as const;

const closingMantra = {
	iast: {
		aswalayana:
			'yatra kvacana saṃsthānāṃ kṣuttṛṣṇopahatātmanām . bhūtānāṃ tṛptaye toyam idamastu yathāsukham ॥ tṛpyata, tṛpyata, tṛpyata ॥',
		apastamba:
			'Ūrjaṃ vahantī-ramṛtaṃ ghṛtaṃ payaḥ kīlālaṃ parisrutaṃ svadhāstha tarpayata me pitṝn || tṛpyata, tṛpyata, tṛpyata ||',
	},
	root: {
		aswalayana:
			'यत्र क्वचन संस्थानां क्षुत्तृष्णोपहतात्मनाम् । भूतानां तृप्तये तोयम् इदमस्तु यथासुखम् ॥ तृप्यत, तृप्यत, तृप्यत ॥',
		apastamba:
			'ऊर्जं वहन्ती-रमृतं घृतं पयः कीलालं परिस्रुतं स्वधास्थ तर्पयत मे पितॄन् ॥ तृप्यत, तृप्यत, तृप्यत ॥',
	},
} as const;

const apDevaRows = {
	root: [
		['१.ब्रह्मादयो ये देवाः तान् देवाꣴस्तर्पयामि', '२.सर्वान् देवाꣴस्तर्पयामि'],
		['३.सर्वदेवगणाꣴस्तर्पयामि', '४.सर्वदेवपत्नीस्तर्पयामि'],
		['५.सर्वदेवगणपत्नीस्तर्पयामि'],
	],
} as const;

const apRishiRows = {
	root: [
		[
			'१.कृष्णद्वैपायनादयो ये ऋषयस्तान् ऋषीꣴस्तर्पयामि',
			'२.सर्वान् ऋषीꣴस्तर्पयामि',
			'३.सर्वर्षिगणाꣴस्तर्पयामि',
		],
		['४.सर्वर्षिपत्नीस्तर्पयामि', '५.सर्वर्षिगणपत्नीस्तर्पयामि', '६.प्रजापतिं काण्डऋषिं तर्पयामि'],
		['७.सोमं काण्डऋषिं तर्पयामि', '८.अग्निं काण्डऋषिं तर्पयामि', '९.विश्वान् देवान् काण्डऋषीꣴस्तर्पयामि'],
	],
} as const;

const apDeva2Rows = {
	root: [
		['१०.साꣳहितीर्देवताः उपनिषदस्तर्पयामि', '११.याज्ञिकीर्देवताः उपनिषदस्तर्पयामि'],
		['१२.वारुणीर्देवताः उपनिषदस्तर्पयामि', '१३.हव्यवाहं तर्पयामि'],
		['१४.विश्वान् देवान् काण्डऋषीꣴस्तर्पयामि'],
	],
} as const;

const apRishi2Rows = {
	root: [
		['१६.विश्वान् देवान् काण्डऋषीꣴस्तर्पयामि', '१७.अरुणान् काण्डऋषीꣴस्तर्पयामि'],
	],
} as const;

const apDeva3Rows = {
	root: [
		['१८.सदसस्पतिं तर्पयामि', '१९.ऋग्वेदं तर्पयामि', '२०.यजुर्वेदं तर्पयामि'],
		['२१.सामवेदं तर्पयामि', '२२.अथर्ववेदं तर्पयामि', '२३.इतिहासपुराणं तर्पयामि'],
		['२४.कल्पं तर्पयामि'],
	],
} as const;

const apPitruIntroRows = {
	root: [
		[
			'१. सोमः पितृमान् यमोऽङ्गिरस्वान् अग्निः कव्यवाहनः <br />इत्यादयो ये पितरस्तान् पितॄꣴस्तर्पयामि',
			'२. सर्वान् पितॄꣴस्तर्पयामि',
		],
		['३. सर्वपितृगणाꣴस्तर्पयामि', '४. सर्वपितृ-पत्नीस्तर्पयामि'],
		['५. सर्वपितृ-गण-पत्नीस्तर्पयामि'],
	],
} as const;

const blocks: Record<string, TarpanaBlock[]> = {
	'iast:aswalayana': [
		{
			instruction: '*upavītī. Perform tarpaṇa once with the fingertips.*',
			columns: 3,
			rows: [
				['1. prajāpatistṛpyatu', '2. brahmā tṛpyatu', '3. vedāstṛpyantu'],
				['4. devāstṛpyantu', '5. ṛṣayastṛpyantu', '6. sarvāṇi chandāṃsi tṛpyantu'],
				['7. oṅkārastṛpyatu', '8. vaṣaṭkārastṛpyatu', '9. vyāhṛtayastṛpyantu'],
				['10. sāvitrī tṛpyatu', '11. yajñāstṛpyantu', '12. dyāvāpṛthivī tṛpyetām'],
				['13. antarikṣaṃ tṛpyatu', '14. ahorātrāṇi tṛpyatu', '15. sāṅkhyāstṛpyantu'],
				['16. siddhāstṛpyantu', '17. samudrāstṛpyantu', '18. nadyastṛpyantu'],
				['19. girayastṛpyantu', '20. kṣetrauṣadhivanaspatigandharvāpsarasastṛpyantu', '21. nāgāstṛpyantu'],
				['22. vyāṃsi tṛpyantu', '23. gāvastṛpyantu', '24. sādhyāstṛpyantu'],
				['25. viprāstṛpyantu', '26. yakṣāstṛpyantu', '27. rakṣāṃsi tṛpyantu'],
				['28. bhūtāni tṛpyantu', '29. evamantāni tṛpyantu ॥'],
			],
		},
		{
			instruction:
				'*nivītī. Wear the yajñopavīta as a garland and perform tarpaṇa twice with the little finger of the right hand.*',
			columns: 3,
			rows: [
				['1. śatarcinastṛpyantu', '2. mādhyamāstṛpyantu', '3. gṛtsamadastṛpyatu'],
				['4. viśvāmitrastṛpyatu', '5. vāmadevastṛpyatu', '6. atristṛpyatu'],
				['7. bharadvājastṛpyatu', '8. vasiṣṭhastṛpyatu', '9. pragāthāstṛpyantu'],
				['10. pāvamānyastṛpyantu', '11. kṣudrasūktāstṛpyantu', '12. mahāsūktāstṛpyantu ॥'],
			],
		},
		{
			instruction:
				'*prācīnāvītī. Perform tarpaṇa three times between the thumb and index finger. If your father is alive, take care not to let the yajñopavīta cross above the wrist.*',
			columns: 2,
			rows: [
				[
					'1. sumantu - jaimini - vaiśampāyana - paila - sūtra - bhāṣya - bhārata - mahābhārata - dharmācāryāstṛpyantu',
				],
				[
					'2. jānanti - bāhavi - gārgya - gautama - śākala - bābhravya - māṇḍavya - māṇḍūkeyāstṛpyantu',
				],
				['3. vācaknavī tṛpyatu', '4. vaḍavā prātītheyī tṛpyatu'],
				['5. sulabhā maitreyī tṛpyatu', '6. kahol̤aṃ tarpayāmi'],
				['7. kauṣītakaṃ tarpayāmi', '8. mahākauṣītakaṃ tarpayāmi'],
				['9. paiṅgyaṃ tarpayāmi', '10. mahāpaiṅgyaṃ tarpayāmi'],
				['11. suyajñaṃ tarpayāmi', '12. sāṅkhyāyanaṃ tarpayāmi'],
				['13. aitareyaṃ tarpayāmi', '14. mahaitareyaṃ tarpayāmi'],
				['15. śākalaṃ tarpayāmi', '16. bāṣkalaṃ tarpayāmi'],
				['17. sujātavakraṃ tarpayāmi', '18. audavāhiṃ tarpayāmi'],
				['19. mahaudavāhiṃ tarpayāmi', '20. saujāmiṃ tarpayāmi'],
				['21. śaunakaṃ tarpayāmi', '22. āśvalāyanaṃ tarpayāmi'],
				['23. ye cānye ācāryāste sarve tṛpyantu (triḥ) ॥'],
			],
		},
		{
			note: pitruMatruNote.iastAs,
			columns: 3,
			rows: pitruMatruRows.iast,
		},
		{
			columns: 1,
			rows: [[closingMantra.iast.aswalayana]],
		},
	],
	'root:aswalayana': [
		{
			instruction: '*उपवीती । सकृत् देवतीर्थेन ।*',
			columns: 3,
			rows: devaRows.root,
		},
		{
			instruction: '*निवीती । द्विः । ऋषितीर्थेन ।*',
			columns: 3,
			rows: rishiRows.root,
		},
		{
			instruction: '*प्राचीनावीती । त्रिः । पितृतीर्थेन ।*',
			columns: 2,
			rows: acharyaRows.root,
		},
		{
			note: pitruMatruNote.root,
			columns: 3,
			rows: pitruMatruRows.root,
		},
		{
			columns: 1,
			rows: [[closingMantra.root.aswalayana]],
		},
	],
	'iast:apastamba': [
		{
			instruction: '*upavītī | sakṛt devatīrthena |*',
			columns: 2,
			rows: [
				['1.Brahmādayo ye devāḥ tān devāgͫ̄starpayāmi', '2.Sarvān devāgͫ̄starpayāmi'],
				['3.Sarvadevagaṇāgͫ̄starpayāmi', '4.Sarvadevapatnīstarpayāmi'],
				['5.Sarvadevagaṇapatnīstarpayāmi'],
			],
		},
		{
			instruction: '*nivītī | dviḥ | ṛṣitīrthena |*',
			columns: 3,
			rows: [
				[
					'1.Kṛṣṇadvaipāyanādayo ye ṛṣayastān ṛṣīgͫ̄starpayāmi',
					'2.Sarvān ṛṣīgͫ̄starpayāmi',
					'3.Sarvarṣigaṇāgͫ̄starpayāmi',
				],
				['4.Sarvarṣipatnīstarpayāmi', '5.Sarvarṣigaṇapatnīstarpayāmi', '6.Prajāpatiṃ kāṇḍaṛṣiṃ tarpayāmi'],
				['7.Somaṃ kāṇḍaṛṣiṃ tarpayāmi', '8.Agniṃ kāṇḍaṛṣiṃ tarpayāmi', '9.Viśvān devān kāṇḍaṛṣīgͫ̄starpayāmi'],
			],
		},
		{
			label: 'Sakṛt devatīrthena',
			columns: 2,
			rows: [
				['10.Sāgͫhitīrdevatāḥ upaniṣadastarpayāmi', '11.Yājñikīrdevatāḥ upaniṣadastarpayāmi'],
				['12.Vāruṇīrdevatāḥ upaniṣadastarpayāmi', '13.Havyavāhaṃ tarpayāmi'],
				['14.Viśvān devān kāṇḍaṛṣīgͫ̄starpayāmi'],
			],
		},
		{
			label: 'Dviḥ| brahmatīrthena',
			columns: 1,
			rows: [['15.Brahmāṇaṃ svayambhuvaṃ tarpayāmi']],
		},
		{
			label: 'Punaḥ ṛṣitīrthena| dviḥ',
			columns: 2,
			rows: [
				['16.Viśvān devān kāṇḍaṛṣīgͫ̄starpayāmi', '17.Aruṇān kāṇḍaṛṣīgͫ̄starpayāmi'],
			],
		},
		{
			label: 'Sakṛt devatīrthena',
			columns: 3,
			rows: [
				['18.Sadasaspatiṃ tarpayāmi', '19.Ṛgvedaṃ tarpayāmi', '20.Yajurvedaṃ tarpayāmi'],
				['21.Sāmavedaṃ tarpayāmi', '22.Atharvavedaṃ tarpayāmi', '23.Itihāsapurāṇaṃ tarpayāmi'],
				['24.Kalpaṃ tarpayāmi'],
			],
		},
		{
			instruction: '*prācīnāvītī | triḥ | pitṛtīrthena |*',
			columns: 2,
			rows: [
				[
					'1. Somaḥ pitṛmān yamo\'ṅgirasvān agniḥ kavyavāhanaḥ <br />ityādayo ye pitarastān pitṝgͫ̄starpayāmi',
					'2. Sarvān pitṝgͫ̄starpayāmi',
				],
				['3. Sarvapitṛgaṇāgͫ̄starpayāmi', '4. Sarvapitṛ-patnīstarpayāmi'],
				['5. Sarvapitṛ-gaṇa-patnīstarpayāmi'],
			],
		},
		{
			note: pitruMatruNote.iastAp,
			columns: 3,
			rows: pitruMatruRows.iastAp,
		},
		{
			columns: 1,
			rows: [[closingMantra.iast.apastamba]],
		},
	],
	'root:apastamba': [
		{
			instruction: '*उपवीती । सकृत् देवतीर्थेन ।*',
			columns: 2,
			rows: apDevaRows.root,
		},
		{
			instruction: '*निवीती । द्विः । ऋषितीर्थेन ।*',
			columns: 3,
			rows: apRishiRows.root,
		},
		{
			label: 'सकृत् देवतीर्थेन',
			columns: 2,
			rows: apDeva2Rows.root,
		},
		{
			label: 'द्विः। ब्रह्मतीर्थेन',
			columns: 1,
			rows: [['१५.ब्रह्माणं स्वयम्भुवं तर्पयामि']],
		},
		{
			label: 'पुनः ऋषितीर्थेन। द्विः',
			columns: 2,
			rows: apRishi2Rows.root,
		},
		{
			label: 'सकृत् देवतीर्थेन',
			columns: 3,
			rows: apDeva3Rows.root,
		},
		{
			instruction: '*प्राचीनावीती । त्रिः । पितृतीर्थेन ।*',
			columns: 2,
			rows: apPitruIntroRows.root,
		},
		{
			note: pitruMatruNote.root,
			columns: 3,
			rows: pitruMatruRows.root,
		},
		{
			columns: 1,
			rows: [[closingMantra.root.apastamba]],
		},
	],
};


