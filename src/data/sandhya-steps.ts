import type { HomeLocale } from './home';

export const RITUAL_STEP_LABELS: Record<string, Record<HomeLocale, string>> = {
	achamanam: { root: 'आचमनम्', iast: 'Ācamanam' },
	'ganapati-dhyanam': { root: 'गणपतिध्यानम्', iast: 'Gaṇapati dhyānam' },
	pranayamam: { root: 'प्राणायामः', iast: 'Prāṇāyāmaḥ' },
	sankalpam: { root: 'सङ्कल्पः', iast: 'Saṅkalpaḥ' },
	marjanam: { root: 'मार्जनम्', iast: 'Mārjanam' },
	prashanam: { root: 'प्राशनम्', iast: 'Prāśanam' },
	punarmarjanam: { root: 'पुनर्मार्जनम्', iast: 'Punarmārjanam' },
	'arghya-pradanam': { root: 'अर्घ्यप्रदानम्', iast: 'Arghyapradānam' },
	'prayascitta-arghyam': { root: 'प्रायश्चित्तार्घ्यम्', iast: 'Prāyaścittārghyam' },
	'keshavadi-tarpanam': { root: 'केशवादि तर्पणम्', iast: 'Keśavādi tarpaṇam' },
	'pranayama-nyasam': { root: 'प्राणायामन्यासः', iast: 'Prāṇāyāma nyāsaḥ' },
	'gayatri-avahanam': { root: 'गायत्र्यावाहनम्', iast: 'Gāyatryāvāhanam' },
	'gayatri-nyasam': { root: 'गायत्रीन्यासः', iast: 'Gāyatrī nyāsaḥ' },
	dhyanam: { root: 'ध्यानम्', iast: 'Dhyānam' },
	'gayatri-japam': { root: 'गायत्रीजपः', iast: 'Gāyatrī japaḥ' },
	gayatryudvasanam: { root: 'गायत्र्युद्वासनम्', iast: 'Gāyatryudvāsanam' },
	upasthanam: { root: 'उपस्थानम्', iast: 'Upasthānam' },
	'abhivada-namaskara': { root: 'अभिवादनम्', iast: 'Abhivādanam' },
	'raksha-dharanam': { root: 'रक्षाधारणम्', iast: 'Rakṣādhāraṇam' },
	'brahmayagya-tarpanam': { root: 'तर्पणम्', iast: 'Tarpaṇam' },
};

export function ritualStepKey(el: Element): string | undefined {
	for (const cls of el.classList) {
		if (cls !== 'ritual-step' && cls in RITUAL_STEP_LABELS) return cls;
	}
	return undefined;
}

export function ritualSourceLine(pathname: string, locale: HomeLocale): string | undefined {
	const isIast = locale === 'iast';
	const time = /\/prata\//.test(pathname)
		? isIast
			? 'prātaḥ'
			: 'प्रातः'
		: /\/madhyahnika\//.test(pathname)
			? isIast
				? 'madhyāhnika'
				: 'माध्यान्हिकम्'
			: /\/sayam\//.test(pathname)
				? isIast
					? 'sāyam'
					: 'सायं'
				: '';
	if (/aswalayana-sandhyavandanam/.test(pathname)) {
		return isIast
			? `Āśvalāyana Gṛhyasūtra · sandhyāvandanam${time ? ` · ${time}` : ''}`
			: `आश्वलायन गृह्यसूत्रम् · सन्ध्यावन्दनम्${time ? ` · ${time}` : ''}`;
	}
	if (/apastamba-sandhyavandanam/.test(pathname)) {
		return isIast
			? `Āpastamba Gṛhyasūtra · sandhyāvandanam${time ? ` · ${time}` : ''}`
			: `आपस्तम्ब गृह्यसूत्रम् · सन्ध्यावन्दनम्${time ? ` · ${time}` : ''}`;
	}
	if (/aswalayana-brahmayagyam/.test(pathname)) {
		return isIast ? 'Āśvalāyana Gṛhyasūtra · brahmayajña' : 'आश्वलायन गृह्यसूत्रम् · ब्रह्मयज्ञम्';
	}
	if (/apastamba-brahmayagyam/.test(pathname)) {
		return isIast ? 'Āpastamba Gṛhyasūtra · brahmayajña' : 'आपस्तम्ब गृह्यसूत्रम् · ब्रह्मयज्ञम्';
	}
	if (/aswalayana-samidadhanam/.test(pathname)) {
		return isIast ? 'Āśvalāyana Gṛhyasūtra · samidādhāna' : 'आश्वलायन गृह्यसूत्रम् · समिदाधानम्';
	}
	if (/apastamba-samidadhanam/.test(pathname)) {
		return isIast ? 'Āpastamba Gṛhyasūtra · samidādhāna' : 'आपस्तम्ब गृह्यसूत्रम् · समिदाधानम्';
	}
	return undefined;
}
