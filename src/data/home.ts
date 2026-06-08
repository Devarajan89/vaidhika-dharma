export type HomeLocale = 'root' | 'sa' | 'ta';

export interface HomeQuote {
	text: string;
	source: string;
}

export interface HomeContent {
	searchHint: string;
	aboutTitle: string;
	aboutBody: string[];
	quoteTitle: string;
	recentTitle: string;
}

export const homeContent: Record<HomeLocale, HomeContent> = {
	root: {
		searchHint: 'Use the search bar above to find mantras, rituals, and scriptures.',
		aboutTitle: 'About',
		aboutBody: [
			'Vaidhika Dharma is dedicated to preserving and sharing the Vedic way of life — nityakarma (daily rituals), dharma (right conduct), and svādhyāya (scriptural study).',
			'Content is presented in IAST, Devanāgarī, and Tamil so practitioners can follow anuṣṭhāna in the tradition of their gurus.',
		],
		quoteTitle: 'Śloka of the Day',
		recentTitle: 'Recently Updated',
	},
	sa: {
		searchHint: 'मन्त्र, अनुष्ठान और ग्रन्थ खोजने के लिए उपरि खोज-पट्टिका का उपयोग करें।',
		aboutTitle: 'परिचय',
		aboutBody: [
			'वैधिकधर्मः वैदिकजीवनमार्गस्य संरक्षणार्थं नित्यकर्म, धर्म, स्वाध्यायश्च प्रदर्शयति।',
			'सामग्री देवनागरी, तमिळ् तथा IAST में गुरुपरम्परानुसारम् उपलब्धा अस्ति।',
		],
		quoteTitle: 'दैनिक श्लोक',
		recentTitle: 'नूतनतम अद्यतन',
	},
	ta: {
		searchHint: 'மந்திரங்கள், சடங்குகள் மற்றும் நூல்களைக் கண்டறிய மேலே உள்ள தேடல் பட்டியைப் பயன்படுத்துங்கள்.',
		aboutTitle: 'பற்றி',
		aboutBody: [
			'வைதிக தர்மம் வேத வாழ்க்கை முறையைப் பாதுகாத்து பகிர்வதற்காக — நித்ய கர்மம், தர்மம், சுவாத்யாயம்.',
			'உள்ளடக்கம் IAST, தமிழ், தேவநாகரியில் குரு பரம்பரையின்படி கிடைக்கிறது.',
		],
		quoteTitle: 'இன்றைய ஶ்லோகம்',
		recentTitle: 'சமீபத்திய புதுப்பிப்புகள்',
	},
};

export const homeQuotes: Record<HomeLocale, HomeQuote[]> = {
	root: [
		{
			text: 'Vedo\'khilo dharmamūlaṃ — the Veda is the root of all dharma.',
			source: 'Manu Smṛti 2.6',
		},
		{
			text: 'Yato dharmas tato jayaḥ — where there is dharma, there is victory.',
			source: 'Mahābhārata',
		},
		{
			text: 'Satyaṃ vada, dharmaṃ cara — speak the truth, follow dharma.',
			source: 'Taittirīya Upaniṣad',
		},
		{
			text: 'Ācāraḥ paramo dharmaḥ — right conduct is the highest dharma.',
			source: 'Traditional',
		},
		{
			text: 'Gurur brahmā gurur viṣṇuḥ gurur devo maheśvaraḥ — the guru is Brahma, Viṣṇu, and Śiva.',
			source: 'Guru Gītā',
		},
	],
	sa: [
		{
			text: 'वेदोऽखिलो धर्ममूलम्',
			source: 'मनुस्मृति २.६',
		},
		{
			text: 'यतो धर्मस्ततो जयः',
			source: 'महाभारतम्',
		},
		{
			text: 'सत्यं वद धर्मं चर',
			source: 'तैत्तिरीयोपनिषत्',
		},
		{
			text: 'आचारः परमो धर्मः',
			source: 'परम्परा',
		},
		{
			text: 'गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः',
			source: 'गुरुगीता',
		},
	],
	ta: [
		{
			text: 'வேதோ³(அ)கி²லோ த⁴ர்மமூலம்',
			source: 'மனு ஸ்ம்ருதி २.६',
		},
		{
			text: 'யதோ³ த⁴ர்மஸ்ததோ³ ஜய​:',
			source: 'மஹாபாரதம்',
		},
		{
			text: 'ஸத்யம் வத த⁴ர்மம் சர',
			source: 'தைத்திரீய உபநிஷத்',
		},
		{
			text: 'ஆசார​: பரமோ த⁴ர்ம​:',
			source: 'பரம்பரை',
		},
		{
			text: 'கு³ரு⁴ர்ப்³ரஹ்மா கு³ரு⁴ர்விஷ்ணு⁴​: கு³ரு⁴ர்தே³வோ மஹேஶ்வர​:',
			source: 'கு³ரு⁴கீ³தா',
		},
	],
};

export function getQuoteOfDay(locale: HomeLocale): HomeQuote {
	const quotes = homeQuotes[locale];
	const start = new Date(new Date().getFullYear(), 0, 0);
	const day = Math.floor((Date.now() - start.getTime()) / 86_400_000);
	return quotes[day % quotes.length];
}
