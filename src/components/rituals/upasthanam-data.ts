import type { HomeLocale } from '../../data/home';

export type SandhyaTime = 'prata' | 'madhyahnika' | 'sayam';
export type RitualVariant = 'aswalayana' | 'apastamba';
export type LocaleKey = 'root' | 'iast';

export interface MetaBlock {
	meta: string;
	lines: string[];
	beforeNote?: string;
	afterNote?: string;
}

export interface DirectionRow {
	cells: string[];
}

export interface SlokaBlock {
	instruction?: string;
	text: string;
}

export interface UpasthanaBlock {
	title: string;
	instruction?: string;
	opening?: MetaBlock[];
	shared?: MetaBlock[];
	directionIntro?: string;
	directionRows: DirectionRow[];
	slokas: SlokaBlock[];
}

const apDirectionRows = {
	root: [
		['१. प्राच्यै नम​:', '२. दक्षिणायै नम​:'],
		['३. प्रतीच्यै नम​:', '४. उदीच्यै नम​:'],
		['५. ऊर्ध्वाय नम​:', '६. अधराय नम​:'],
		['७. अन्तरिक्षाय नम​:', '८. भूम्यै नम​:'],
		['९. ब्रह्मणे नम​:', '१०. विष्णवे नम​:'],
		['११. मृत्यवे नम​:', '१२. यमाय नम​:'],
	],
	iast: [
		['1.Prācyai nama​: (East)', '2.Dakṣiṇāyai nama​: (South)'],
		['3.Pratīcyai nama​: (West)', '4.Udīcyai nama​: (North)'],
		['5.Ūrdhvāya nama​: (Sky)', '6.Adharāya nama​: (Earth)'],
		['7.Antarikṣāya nama​: (Sky)', '8.Bhūmyai nama​: (Earth)'],
		['9.Brahmaṇe nama​: (Sky)', '10.Viṣṇave nama​: (Earth)'],
		['11.Mṛtyave nama​: (South)', '12.Yamāya nama​: (South)'],
	],
} as const;

const asDirectionRows = {
	prata: {
		root: [
			['१. सन्ध्यायै नम​:', '२. सावित्र्यै नम​:'],
			['३. गायत्र्यै नम:', '४. सरस्वत्यै नम​:'],
			['५. सर्वाभ्यो देवताभ्यो नम​:', '६. प्राच्यै नम​:'],
			['७. दक्षिणायै नम​:', '८. प्रतीच्यै नम​:'],
			['९. उदीच्यै नम​:', '१०. ऊर्ध्वाय नम​:'],
			['११. अधराय नम​:', '१२. अन्तरिक्षाय नम​:'],
			['१३. भूम्यै नम​:', '१४. ब्रह्मणे नम​:'],
			['१५. विष्णवे नम​:', '१६. यमाय नम​:'],
		],
		iast: [
			['1.Sandhyāyai nama​: (East)', '2.Sāvitryai nama​: (South)'],
			['3.Gāyatryai nama: (West)', '4.Sarasvatyai nama​: (North)'],
			['5.Sarvābhyo devatābhyo nama​: (East)', '6.Prācyai nama​: (East)'],
			['7.Dakṣiṇāyai nama​: (South)', '8.Pratīcyai nama​: (West)'],
			['9.Udīcyai nama​: (North)', '10.Ūrdhvāya nama​: (Sky)'],
			['11.Adharāya nama​: (Earth)', '12.Antarikṣāya nama​: (Sky)'],
			['13.Bhūmyai nama​: (Earth)', '14.Brahmaṇe nama​: (Sky)'],
			['15.Viṣṇave nama​: (Earth)', '16.Yamāya nama​: (South)'],
		],
	},
	sayam: {
		root: [
			['१. सन्ध्यायै नम​:', '२. सावित्र्यै नम​:'],
			['३. गायत्र्यै नम:', '४. सरस्वत्यै नम​:'],
			['५. सर्वाभ्यो देवताभ्यो नम​:', '६. प्रतीच्यै नम​:'],
			['७. उदीच्यै नम​:', '८. प्राच्यै नम​:'],
			['९. दक्षिणायै नम​:', '१०. ऊर्ध्वाय नम​:'],
			['११. अधराय नम​:', '१२. अन्तरिक्षाय नम​:'],
			['१३. भूम्यै नम​:', '१४. ब्रह्मणे नम​:'],
			['१५. विष्णवे नम​:', '१६. यमाय नम​:'],
		],
		iast: [
			['1.Sandhyāyai nama​: (West)', '2.Sāvitryai nama​: (North)'],
			['3.Gāyatryai nama: (East)', '4.Sarasvatyai nama​: (South)'],
			['5.Sarvābhyo devatābhyo nama​: (West)', '6.Pratīcyai nama​: (West)'],
			['7.Udīcyai nama​: (North)', '8.Prācyai nama​: (East)'],
			['9.Dakṣiṇāyai nama​: (South)', '10.Ūrdhvāya nama​: (Sky)'],
			['11.Adharāya nama​: (Earth)', '12.Antarikṣāya nama​: (Sky)'],
			['13.Bhūmyai nama​: (Earth)', '14.Brahmaṇe nama​: (Sky)'],
			['15.Viṣṇave nama​: (Earth)', '16.Yamāya nama​: (South)'],
		],
	},
} as const;

const slokas = {
	root: {
		south: {
			text: 'यमाय धर्मराजाय मृत्यवे चांतकाय च । वैवस्वताय कालाय सर्वभूतक्षयाय च ।\nऔदुंबराय तध्नाय नीलाय परमेष्ठिने । व्रुकोधराय चित्राय चित्रगुप्ताय वै नम: ॥ \nचित्रगुप्ताय वै नमो नम इति ।',
		},
		north: {
			text: 'ऋतं सत्यं परं ब्रह्म पुरुषं क्रुष्ण पिंगलम् । ऊर्ध्वरेतं विरूपाक्षं विश्वरूपायवै नम: ॥ विश्वरूपायवै नमो नम इति ।',
		},
		west: {
			text: 'नर्मदायै नम: प्रातर्नर्मदायै नमो निशि । नमोस्तु नर्मदे तुभ्यं पाहिमां विषसर्पत: ॥ अपसर्प सर्प भत्रं ते दूरं गच्छ महायश: । जनमेजयस्य यञांते आस्तीक वचनं स्मरन् ॥ जरत्कारो जरत्कार्वां समुत्पन्नो महायशा: । आस्तीक: सत्य संधोमां पन्नगेभ्योभिरक्षतु ॥',
		},
		east: {
			text: 'नमस्सवित्रे जगदेक चक्षुषे जगत्प्रसूति-स्थिति नाशहेतवे । त्रयीमयाय त्रिगुणात्म धारिणे विरिंचि नारायण शंकरात्मने ॥ध्येयस्स्दा सवित्रुमंडल मध्यवर्ती नारायण: सरसिजासन सन्निविष्ट: ।केयूरवान् मकरकुंडलवान् किरीटिहारि हिराण्मय वपुर्ध्रुत शंख चक्र: ॥ \nशंखचक्र गदापाणे द्वारका निलयाच्युत । गोविंद पुंडरीकाक्ष रक्षमां शरणागतम् ॥ \nआकशात्पतितम्तोयं यथा गच्छति सागरम् । सर्व देव नमस्कार: केशवं प्रतिगच्छति ॥\nकेशवं प्रतिगच्छत्योम् नम इति ।',
		},
	},
	iast: {
		south: {
			instruction: 'Face south and recite the following śloka.',
			text: 'Yamāya dharmarājāya mṛtyave cāntakāya ca . Vaivasvatāya kālāya sarvabhūtakṣayāya ca .Audumbarāya tadhnāya nīlāya parameṣṭhine . Vrukodharāya citrāya citraguptāya vai nama: .. Citraguptāya vai namo nama iti .',
		},
		north: {
			instruction: 'Face north and recite the following śloka.',
			text: 'Ṛtaṃ satyaṃ paraṃ brahma puruṣaṃ kruṣṇa piṅgalam . Ūrdhvaretaṃ virūpākṣaṃ viśvarūpāyavai nama: .. Viśvarūpāyavai namo nama iti .',
		},
		west: {
			instruction: 'Face west and recite the following śloka.',
			text: 'Narmadāyai nama: prātarnarmadāyai namo niśi . Namostu narmade tubhyaṃ pāhimāṃ viṣasarpata: .. Apasarpa sarpa bhatraṃ te dūraṃ gaccha mahāyaśa: . Janamejayasya yañānte āstīka vacanaṃ smaran .. Jaratkāro jaratkārvāṃ samutpanno mahāyaśā: . Āstīka: satya sandhomāṃ pannagebhyobhirakṣatu ..',
		},
		east: {
			instruction: 'Face east and recite the following śloka.',
			text: 'Namassavitre jagadeka cakṣuṣe jagatprasūti-sthiti nāśahetave . Trayīmayāya triguṇātma dhāriṇe viriñci nārāyaṇa śaṅkarātmane ..Dhyeyassdā savitrumaṇḍala madhyavartī nārāyaṇa: sarasijāsana sanniviṣṭa: .Keyūravān makarakuṇḍalavān kirīṭihāri hirāṇmaya vapurdhruta śaṅkha cakra: .. Śaṅkhacakra gadāpāṇe dvārakā nilayācyuta . Govinda puṇḍarīkākṣa rakṣamāṃ śaraṇāgatam .. \nĀkaśātpatitamtoyaṃ yathā gacchati sāgaram . Sarva deva namaskāra: keśavaṃ pratigacchati ..\nKeśavaṃ pratigacchatyom nama iti .',
		},
	},
} as const;

const sharedAswalayana = {
	root: [
		{
			meta: '**जातवेदसे इत्यस्य कश्यप ऋषि: । त्रिष्टुप् छन्द​: । अग्निर्देवता - सन्ध्योपस्थाने विनियोग​:**',
			lines: [
				'जा॒तवे॑दसे सुनवाम॒ सोम॑ मरातीय॒तो निद॑हाति॒ वेद॑: । स न॑: पर्ष॒दति॑ दु॒र्गानि॒विश्वा॑ ना॒वेव॒ सिंधुं॑ दुरि॒तान्य॒ग्नi:॥',
			],
		},
		{
			meta: '**पिशङ्गभृष्टिमित्यस्य परुच्छेप​: ऋषि: । गायत्री छन्द​: । इन्द्रो देवता - उपस्थाने विनियोग​:**',
			lines: [
				'पि॒शंग॑भ्रुष्टि॒मम् भ्रु॒नम् पि॒शाचि॑मिंद्र॒सं मृ॑न । सर्वं॒ रक्षो॒ निब॑र्हय ॥',
			],
		},
		{
			meta: '**भद्रं कर्णेभि: इत्यस्य गोतम ऋषि: । त्रिष्टुप् छन्द​: । विश्वेदेवा देवता: - उपस्थाने विनियोग​:**',
			lines: [
				'भ॒द्रं कर्णे॑भि: श्रुनुयाम देवा भ॒द्रं प॑श्येमा॒क्षभि॑र्यजत्रा: । स्थि॒रैरङ्गै॑: तुष्टु॒वाम्स॑: त॒नूभि॒र्व्य॑शेम दे॒वहि॑त॒म् यदायु॑: ॥',
			],
		},
		{
			meta: '**केशीत्यस्य जूति ऋषि: । अनुष्टुप् छन्द​: ।अग्निर्देवता - उपस्थाने विनियोग​:**',
			lines: [
				'के॒श्य १॒॑ ग्निं के॒शी वि॒षं के॒शी बि॑भर्ति॒ रोद॑सि । के॒शी विश्वं॒ स्व॑र्द्रु॒शे के॒शीदं ज्योति॑रुच्यते ॥',
			],
		},
	],
	iast: [
		{
			meta: '**jātavedase ityasya kaśyapa ṛṣi: . triṣṭup chanda​: . agnirdevatā - sandhyopasthāne viniyoga​:**',
			lines: [
				'Jā̱tave̍dase sunavāma̱ soma̍ marātīya̱to nida̍hāti̱ veda̍: . Sa na̍: parṣa̱dati̍ du̱rgāni̱viśvā̍ nā̱veva̱ sindhu̍ṃ duri̱tānya̱gni:..',
			],
		},
		{
			meta: '**piśaṅgabhṛṣṭimityasya parucchepa​: ṛṣi: . gāyatrī chanda​: . indro devatā - upasthāne viniyoga​:**',
			lines: [
				'Pi̱śaṅga̍bhruṣṭi̱mam bhru̱nam pi̱śāci̍mindra̱saṃ mṛ̍na . Sarva̱ṃ rakṣo̱ niba̍rhaya ..',
			],
			beforeNote: 'Recite the mantra below and circle the face three times with the little finger.',
		},
		{
			meta: '**bhadraṃ karṇebhi: ityasya gotama ṛṣi: . triṣṭup chanda​: . viśvedevā devatā: - upasthāne viniyoga​:**',
			lines: [
				'Bha̱draṃ karṇe̍bhi: śrunuyāma devā bha̱draṃ pa̍śyemā̱kṣabhi̍ryajatrā: . Sthi̱rairaṅgai̍: tuṣṭu̱vāmsa̍: ta̱nūbhi̱rvya̍śema de̱vahi̍ta̱m yadāyu̍: ..',
			],
			beforeNote:
				'Chant the mantra below and circumambulate the right ear three times with the ring finger.',
		},
		{
			meta: '**keśītyasya jūti ṛṣi: . anuṣṭup chanda​: .agnirdevatā - upasthāne viniyoga​:**',
			lines: [
				'Ke̱śya 1̱̍ gniṃ ke̱śī vi̱ṣaṃ ke̱śī bi̍bharti̱ roda̍si . Ke̱śī viśva̱ṃ sva̍rdru̱śe ke̱śīdaṃ jyoti̍rucyate ..',
			],
			beforeNote:
				'Recite the mantra below and circle the śikhā with the thumb three times in pradakṣiṇa.',
		},
	],
} as const;


export function getUpasthanaBlock(
	localeKey: LocaleKey,
	variant: RitualVariant,
	time: SandhyaTime
): UpasthanaBlock {
	if (variant === 'apastamba') {
		return {
			title: localeKey === 'root' ? 'उपस्थानं' : 'Upasthānam',
			directionIntro:
				localeKey === 'root'
					? 'इति ताम् ताम् दिशं प्रति अन्जलिं कृत्वा'
					: 'Starting from the east, recite the mantras below and pray to the deities of each direction.',
			directionRows: apDirectionRows[localeKey].map((cells) => ({ cells: [...cells] })),
			slokas: [
				slokas[localeKey].south,
				slokas[localeKey].north,
				slokas[localeKey].west,
				slokas[localeKey].east,
			],
		};
	}

	const directionKey = time === 'sayam' ? 'sayam' : 'prata';
	const opening = getAswalayanaOpening(localeKey, time);
	const shared = sharedAswalayana[localeKey].map((b) => ({ ...b, lines: [...b.lines] }));

	return {
		title: localeKey === 'root' ? 'उपस्थानं' : 'upasthānaṃ',
		instruction:
			localeKey === 'iast'
				? 'Stand facing east, fold your hands, and recite the following upasthāna mantra.'
				: undefined,
		opening,
		shared,
		directionIntro:
			localeKey === 'root'
				? 'इति ताम् ताम् दिशं प्रति अन्जलिं कृत्वा'
				: 'Starting from the east, recite the mantras below and pray to the deities of each direction.',
		directionRows: asDirectionRows[directionKey][localeKey].map((cells) => ({
			cells: [...cells],
		})),
		slokas: [
			slokas[localeKey].south,
			slokas[localeKey].north,
			slokas[localeKey].west,
			slokas[localeKey].east,
		],
	};
}

function getAswalayanaOpening(localeKey: LocaleKey, time: SandhyaTime): MetaBlock[] {
	if (time === 'prata') {
		return localeKey === 'root'
			? [
					{
						meta: '**मित्रस्येति तृचस्य विश्वामित्र ऋषि: । गायत्री त्रिष्टुभौ छन्दांसि ।मित्रो देवता - प्रात​:सन्ध्या उपस्थाने विनियोग​:**',
						lines: [
							'ॐ मि॒त्रस्य॑ चर्षनीध्रु॒तोवो॑ दे॒वस्य॑ सान॒सि । द्यु॒म्नं चि॒रत्रश्र॑वस्तमम् ॥ मि॒त्रो जना॑न् यातयतिब्रुवा॒नो मि॒त्रो दा॑धार प्रुथि॒वीमु॒त द्याम् । मि॒त्र: कृष्टीरनि॑मिषा॒भि च॑ष्टे मि॒त्राय॑ ह॒व्यम् घ्रु॒तव॑त् जुहोत ॥ प्रसमि॑त्र॒ मर्तो॑ अस्तु॒ प्रय॑स्वा॒न् यस्त॑ आदित्य॒ शिक्ष॑ति व्र॒तेन॑ । नह॑न्यते॒ नजी॑यते॒ त्वोतो॒ नैन॒मम्हो॑ अश्नो॒त्यंति॑ तो॒न दू॒रात् ॥',
						],
					},
				]
			: [
					{
						meta: '**mitrasyeti tṛcasya viśvāmitra ṛṣi: . gāyatrī triṣṭubhau chandāṃsi .mitro devatā - prāta: sandhyā upasthāne viniyoga​:**',
						lines: [
							'Mi̱trasya̍ carṣanīdhru̱tovo̍ de̱vasya̍ sāna̱si . Dyu̱mnaṃ ci̱ratraśra̍vastamam ..',
							'Mi̱tro janā̍n yātayatibruvā̱no mi̱tro dā̍dhāra pruthi̱vīmu̱ta dyām . Mi̱tra: kṛṣṭīrani̍miṣā̱bhi ca̍ṣṭe mi̱trāya̍ ha̱vyam ghru̱tava̍t juhota ..',
							'Prasami̍tra̱ marto̍ astu̱ praya̍svā̱n yasta̍ āditya̱ śikṣa̍ti vra̱tena̍ . Naha̍nyate̱ najī̍yate̱ tvoto̱ naina̱mamho̍ aśno̱tyanti̍ to̱na dū̱rāt ..',
						],
					},
				];
	}

	if (time === 'madhyahnika') {
		return localeKey === 'root'
			? [
					{
						meta: '**उदुत्यमिति त्रयोद्शर्चस्य सूक्तस्य प्रस्कण्व ऋषि: । आद्या नव गायत्र्य: । अन्त्या: चतस्र​: अनुष्टुभ​: । सूर्यो देवता । माध्यान्हिक उपस्थाने विनियोग​:**',
						lines: [
							'उदु॒त्यं जा॒तवे॑दसं दे॒वं व॑हंति के॒तव॑: । द्रु॒शे विश्वा॒॑य सूर्यम्॑ ॥',
						],
						afterNote:
							'उदुत्यमिति प्रथममन्त्र कथन काले व्योम मुद्रया दक्षिणेन नेत्रेण सूर्यं सकृत् विलोक्य​',
					},
					{
						meta: '',
						lines: [
							'अप॒त्ये ता॒यवो॑  यथा॒ नक्ष॑त्रा यंत्य॒क्तुभि॑: । सूरा॑य वि॒श्व च॑क्षसे ॥',
							'अद्रु॑श्यमस्य के॒तवो॒ विर॒श्मयो॒ जनाँ॒ अनु॑ । भ्राजं॑तो अ॒ग्नयो॑ यथा ॥',
							'त॒रणि॑र्वि॒श्वद॑र्शतो॒ ज्योति॒ष्कृद॑सि  सूर्य । विष्व॒मा भा॑सि रोच॒नम् ॥',
							'प्र॒त्यङ् दे॒वानां॒ विश॑: प्र॒त्यङ्ङु दे॑षि॒  मानु॑षान् ॥ प्र॒त्यङ् विश्वं॒ स्व॑र्दृ॒शे ॥',
							'येना॑ पावक॒ चक्ष॑सा भुर॒ण्यंतं॒ जनाँ॒ अनु॑ । त्वं व॑रुण॒ पश्य॑सि ॥',
							'वि॒द्यामे॑षि॒ रज॑स्पृ॒थ्वहा॒ मिमा॑नो अ॒क्तुभि॑: । प॒श्यन् जन्मा॑नि सूर्य ॥',
							'स॒प्त त्वा॑ ह॒रितो॒रथे॒ वहं॑ति देव सूर्य । शो॒चिष्के॑शं विचक्षण ॥',
							'अयु॑क्त स॒प्त शुं॒ध्युव॒: सूरो॒ रथ॑स्य न॒प्त्य॑: ।  ताभि॑र्याति॒ स्वयु॑क्तिभि: ॥',
							'उद्व॒यं तम॑स॒स्परि॒ ज्योति॒ष्पश्यं॑त॒ उत्त॑रम् । दे॒वं दे॑व॒त्रा सूर्य॒मग॑न्म॒ ज्योति॒रुत्त॑मम् ॥ उ॒द्यन्न॒द्य मि॑त्रमह आ॒रोह॒न्नुत्त॑रां॒ दिवम्॑ । हृ॒द्रो॒गं मम॑ सूर्य हरि॒माणं॑ च नाशय ॥',
							'शुके॑षुमे हरि॒माणं॑ रोप॒णाका॑सु दध्मसि ॥ अथो॑ हारिद्र॒वेषु॑ मे हरि॒माणं॒ नि द॑ध्मसि ॥',
							'उद॑गाद॒यमा॑दि॒त्यो विश्वे॑न॒ सह॑सा स॒ह ॥ द्वि॒षन्तं॒ मह्यं॑ रं॒धय॒न् मो अ॒हं द्वि॑ष॒ते र॑धम् ॥',
						],
					},
					{
						meta: '**चित्रं देवानामिति षडृचस्य सूक्तस्य आङ्गिरस: कुत्सः ऋषिः त्रिष्टुप् छन्दः । सूर्यो देवता । सूर्योपस्थाने विनियोगः**',
						lines: [
							'चि॒त्रं दे॒वाना॒मुद॑गा॒दनी॑कं॒ चक्षु॑र्मि॒त्रस्य॒ वरु॑णस्या॒ग्नेः । आप्रा॒ द्यावा॑ पृथि॒वी अ॒न्तरि॑क्षं॒ सूर्य॑ आ॒त्मा जग॑तस्त॒स्थुष॑श्च ॥',
							'सूर्यो॑ दे॒वीमु॒षसं॒ रोच॑मानां॒ मर्यो॒ न योषा॑म॒भ्ये॑ति प॒श्चात् । यत्रा॒ नरो॑ देव॒यन्तो॑ यु॒गानि॑ वितन्व॒ते प्रति॑ भ॒द्राय॑ भ॒द्रम् ॥',
							'भ॒द्रा अश्वा॑ ह॒रितः॒ सूर्य॑स्य चि॒त्रा एत॑ग्वा अनु॒माद्या॑सः । न॒म॒स्यन्तो॑ दि॒व आ पृ॒ष्ठम॑स्थुः परि॒ द्यावा॑पृथि॒वी य॑न्ति स॒द्यः ॥',
							'तत्सूर्य॑स्य देव॒त्वं तन्म॑हि॒त्वं म॒ध्या कर्तो॒र्वित॑त॒ सं ज॑भार । य॒देदयु॑क्त ह॒रितः॑ स॒धस्था॒द् आद्रात्री॒ वास॑स्तनुते सि॒मिस्मै॑ ॥',
							'तन्मि॒त्रस्य॒ वरु॑णस्याभि॒चक्षे॒ सूर्यो॑ रू॑पं कृ॑णुते द्योरु॒पस्थे॑ । अ॒न॒न्तम॒न्यद् रुश॑दस्य॒ पाजः॑ कृ॒ष्णम॒न्यद् ह॒रितः॒ सं भ॑रन्ति ॥',
							'अ॒द्या दे॑वा॒ उदि॑ता॒ सूर्य॑स्य॒ निरंह॑सः पिपृ॒ता निर॑व॒द्यात् । तन्नो॑ मि॒त्रो वरु॑णो मामहन्तां॒ अदि॑तिः॒ सिन्धुः॑ पृथि॒वी उ॒त द्यौः ॥',
						],
					}				]
			: [
					{
						meta: '**udutyamiti trayodśarcasya sūktasya praskaṇva ṛṣi: . ādyā nava gāyatrya: . antyā: catasra​: anuṣṭubha​: . sūryo devatā . mādhyānhika upasthāne viniyoga​:**',
						lines: [
							'udu̱tyaṃ jā̱tave̍dasaṃ de̱vaṃ va̍haṃti ke̱tava̍: . dru̱śe viśvā̱̍ya sūryam̍ ..',
						],
						afterNote: 'Gaze at the sun with Vyoma mudrā.',
					},
					{
						meta: '',
						lines: [
							'apa̱tye tā̱yavo̍  yathā̱ nakṣa̍trā yaṃtya̱ktubhi̍: . sūrā̍ya vi̱śva ca̍kṣase ..',
							'adru̍śyamasya ke̱tavo̱ vira̱śmayo̱ janā̱m̐ anu̍ . bhrāja̍ṃto a̱gnayo̍ yathā ..',
							'ta̱raṇi̍rvi̱śvada̍rśato̱ jyoti̱ṣkṛda̍si  sūrya . viṣva̱mā bhā̍si roca̱nam ..',
							'pra̱tyaṅ de̱vānā̱ṃ viśa̍: pra̱tyaṅṅu de̍ṣi̱  mānu̍ṣān .. pra̱tyaṅ viśva̱ṃ sva̍rdṛ̱śe ..',
							'yenā̍ pāvaka̱ cakṣa̍sā bhura̱ṇyaṃta̱ṃ janā̱m̐ anu̍ . tvaṃ va̍ruṇa̱ paśya̍si ..',
							'vi̱dyāme̍ṣi̱ raja̍spṛ̱thvahā̱ mimā̍no a̱ktubhi̍: . pa̱śyan janmā̍ni sūrya ..',
							'sa̱pta tvā̍ ha̱rito̱rathe̱ vaha̍ṃti deva sūrya . śo̱ciṣke̍śaṃ vicakṣaṇa ..',
							'ayu̍kta sa̱pta śu̱ṃdhyuva̱: sūro̱ ratha̍sya na̱ptya̍: .  tābhi̍ryāti̱ svayu̍ktibhi: ..',
							'udva̱yaṃ tama̍sa̱spari̱ jyoti̱ṣpaśya̍ṃta̱ utta̍ram . de̱vaṃ de̍va̱trā sūrya̱maga̍nma̱ jyoti̱rutta̍mam .. u̱dyanna̱dya mi̍tramaha ā̱roha̱nnutta̍rā̱ṃ divam̍ . hṛ̱dro̱gaṃ mama̍ sūrya hari̱māṇa̍ṃ ca nāśaya ..',
							'śuke̍ṣume hari̱māṇa̍ṃ ropa̱ṇākā̍su dadhmasi .. atho̍ hāridra̱veṣu̍ me hari̱māṇa̱ṃ ni da̍dhmasi ..',
							'uda̍gāda̱yamā̍di̱tyo viśve̍na̱ saha̍sā sa̱ha .. dvi̱ṣanta̱ṃ mahya̍ṃ ra̱ṃdhaya̱n mo a̱haṃ dvi̍ṣa̱te ra̍dham ..',
						],
					},
					{
						meta: '**citraṃ devānāmiti ṣaḍṛcasya sūktasya āṅgirasa: kutsaḥ ṛṣiḥ triṣṭup chandaḥ . sūryo devatā . sūryopasthāne viniyogaḥ**',
						lines: [
							'ci̱traṃ de̱vānā̱muda̍gā̱danī̍ka̱ṃ cakṣu̍rmi̱trasya̱ varu̍ṇasyā̱gneḥ . āprā̱ dyāvā̍ pṛthi̱vī a̱ntari̍kṣa̱ṃ sūrya̍ ā̱tmā jaga̍tasta̱sthuṣa̍śca ..',
							'sūryo̍ de̱vīmu̱ṣasa̱ṃ roca̍mānā̱ṃ maryo̱ na yoṣā̍ma̱bhye̍ti pa̱ścāt . yatrā̱ naro̍ deva̱yanto̍ yu̱gāni̍ vitanva̱te prati̍ bha̱drāya̍ bha̱dram ..',
							'bha̱drā aśvā̍ ha̱rita̱ḥ sūrya̍sya ci̱trā eta̍gvā anu̱mādyā̍saḥ . na̱ma̱syanto̍ di̱va ā pṛ̱ṣṭhama̍sthuḥ pari̱ dyāvā̍pṛthi̱vī ya̍nti sa̱dyaḥ ..',
							'tatsūrya̍sya deva̱tvaṃ tanma̍hi̱tvaṃ ma̱dhyā karto̱rvita̍ta̱ saṃ ja̍bhāra . ya̱dedayu̍kta ha̱rita̍ḥ sa̱dhasthā̱d ādrātrī̱ vāsa̍stanute si̱mismai̍ ..',
							'tanmi̱trasya̱ varu̍ṇasyābhi̱cakṣe̱ sūryo̍ rū̍paṃ kṛ̍ṇute dyoru̱pasthe̍ . a̱na̱ntama̱nyad ruśa̍dasya̱ pāja̍ḥ kṛ̱ṣṇama̱nyad ha̱rita̱ḥ saṃ bha̍ranti ..',
							'a̱dyā de̍vā̱ udi̍tā̱ sūrya̍sya̱ niraṃha̍saḥ pipṛ̱tā nira̍va̱dyāt . tanno̍ mi̱tro varu̍ṇo māmahantā̱ṃ adi̍ti̱ḥ sindhu̍ḥ pṛthi̱vī u̱ta dyauḥ ..',
						],
					},
				];
	}

	// sayam
	return localeKey === 'root'
		? [
				{
					meta: '**इमं मे - तत्वा - यच्चिद्धि - यत्किन्च - कितवास​: इति मन्त्राणां । शुनश्शेप - वसिष्ठ - अत्रय​: ऋषय​: । गायत्री - त्रिष्टुप् - गायत्री - त्रिष्टुभश्छन्दांसि । वरुण​: - सूर्यो वा देवता । सायं सन्ध्योपस्थाने विनियोग​:**',
					lines: [
						'ॐ इ॒मं मे॑ वरुण श्रुधी॒हव॑ म॒द्या च॑ म्रुळय । त्वाम॑ व॒स्युराच॑के ॥',
						'तत्व॑यामि ब्र॒ह्मणा॒ वंद॑मान॒: तदा शा॑स्ते॒ यज॑मानो ह॒विर्भि: । अहे॑ळमानो वरुणे॒ह पो॒ध्युरु॑शम्स॒ मान॒ आयु॒: प्रमो॑षी: ॥ यच्चि॒द्धिते॒ विशो॑ यथा॒ प्रदे॑व वरुण व्र॒तम् । मि॒नी॒मसि॒ द्यवि॑द्यवि ॥ यत्किंचे॒दं व॑रुण॒ दैव्ये॒ जने॑भि द्रो॒हं म॑नु॒ष्या३॒॑ श्चरामसि । अचि॑त्ती॒ यत्तव॒ धर्मा॑ युयोपिम॒ मा न॒स्तस्मा॒ देन॑सो देव रीरिष: ॥ कि॒त॒वासो॒ यत् रि॑रि॒पुर्न दी॒वि यद् वा॑ घा स॒त्यमु॒त यन्न वि॒द्म । सर्वा॒ ता विष्य॑ शिथि॒रेव॑ दे॒वाऽधा॑ ते स्याम वरुण प्रि॒यास॑: ॥',
					],
				},
			]
		: [
				{
					meta: '**imaṃ me - tatvā - yacciddhi - yatkinca - kitavāsa​: iti mantrāṇāṃ . śunaśśep - vasiṣṭha - atraya​: ṛṣaya​: . gāyatrī - triṣṭup - gāyatrī - triṣṭubhaśchandāṃsi . varuṇa​: - sūryo vā devatā . sāyaṃ sandhyopasthāne viniyoga​:**',
					lines: [
						'Oṃ i̱maṃ me̍ varuṇa śrudhī̱hava̍ ma̱dyā ca̍ mrul̤aya . tvāma̍ va̱syurāca̍ke ..',
						'tatva̍yāmi bra̱hmaṇā̱ vaṃda̍māna̱: tadā śā̍ste̱ yaja̍māno ha̱virbhi: . ahe̍l̤amāno varuṇe̱ha po̱dhyuru̍śamsa̱ māna̱ āyu̱: pramo̍ṣī: .. yacci̱ddhite̱ viśo̍ yathā̱ prade̍va varuṇa vra̱tam . mi̱nī̱masi̱ dyavi̍dyavi .. yatkiṃce̱daṃ va̍ruṇa̱ daivye̱ jane̍bhi dro̱haṃ ma̍nu̱ṣyā3̱̍ ścarāmasi . aci̍ttī̱ yattava̱ dharmā̍ yuyopima̱ mā na̱stasmā̱ dena̍so deva rīriṣa: .. ki̱ta̱vāso̱ yat ri̍ri̱purna dī̱vi yad vā̍ ghā sa̱tyamu̱ta yanna vi̱dma . sarvā̱ tā viṣya̍ śithi̱reva̍ de̱vā\u2019dhā̍ te syāma varuṇa pri̱yāsa̍: ..',
					],
				},
			];
}
