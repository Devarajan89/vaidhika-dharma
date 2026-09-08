import type { HomeLocale } from '../data/home';

function slugPath(slug: string): string {
	if (!slug || slug === 'index') return '';
	if (slug === 'iast/index') return 'iast';
	return slug.replace(/^\/+|\/+$/g, '');
}

export interface CorpusSeoCopy {
	description: string;
	intro: Record<HomeLocale, string>;
	citation?: string;
	ogAlt: string;
}

function extractOpening(title: string): string | null {
	const emDash = title.match(/[—–-]\s*([^(—–-]+?)(?:\s*\(|$)/);
	if (emDash?.[1]) {
		const opening = emDash[1].trim();
		if (opening.length >= 2 && !/^(sūktam|सूक्तम्|adhyāya|अध्याय)/i.test(opening)) {
			return opening;
		}
	}
	const paren = title.match(/\(([^)]+)\)/);
	if (paren?.[1] && !/मन्त्रा?|mantras?/i.test(paren[1])) {
		const inner = paren[1].trim();
		if (inner.length >= 2 && inner.length <= 48) return inner;
	}
	return null;
}

function extractMantraCount(title: string): number | null {
	const match = title.match(/\((\d+)\s*(?:मन्त्राः|mantras?)\)/i);
	return match ? Number(match[1]) : null;
}

function scriptPhrase(isIast: boolean): string {
	return isIast ? 'IAST transliteration with Vedic svara' : 'Devanagari with Vedic svara';
}

function withOpening(base: string, opening: string | null, count: number | null): string {
	const bits = [base];
	if (opening) bits.push(`(${opening})`);
	if (count) bits.push(`— ${count} mantras`);
	return bits.join(' ');
}

function buildPair(
	description: string,
	introRoot: string,
	introIast: string,
	citation: string | undefined,
	ogAlt: string
): CorpusSeoCopy {
	return {
		description,
		intro: { root: introRoot, iast: introIast },
		citation,
		ogAlt,
	};
}

/** Rich meta/intro for deep corpus URLs (saṃhitā leaves, etc.). */
export function getCorpusSeoCopy(
	slug: string,
	title: string,
	isIast: boolean
): CorpusSeoCopy | null {
	const path = slugPath(slug).replace(/^iast\//, '');
	if (!path) return null;

	const opening = extractOpening(title);
	const count = extractMantraCount(title);
	const script = scriptPhrase(isIast);

	const rvSukta = path.match(/^rigveda-samhita\/mandala-(\d+)\/sukta-(\d+)$/);
	if (rvSukta) {
		const mandala = Number(rvSukta[1]);
		const sukta = Number(rvSukta[2]);
		const cite = `RV ${mandala}.${sukta}`;
		const head = withOpening(`Ṛgveda ${cite}`, opening, count);
		const description = `${head}. ${script} | Śākala Saṃhitā — Vaidhika Dharma.`;
		const introRoot = `${cite} — ऋग्वेद शाकल संहिता, मण्डल ${mandala}, सूक्तम् ${sukta}${opening ? ` (${opening})` : ''}${count ? `, ${count} मन्त्राः` : ''}। स्वरचिह्नित पाठः।`;
		const introIast = `${cite} — Ṛgveda Śākala Saṃhitā, maṇḍala ${mandala}, sūkta ${sukta}${opening ? ` (${opening})` : ''}${count ? `, ${count} mantras` : ''}. Vedic svara-marked text.`;
		return buildPair(description, introRoot, introIast, cite, `${cite} — Vaidhika Dharma`);
	}

	const rvMandala = path.match(/^rigveda-samhita\/mandala-(\d+)$/);
	if (rvMandala) {
		const mandala = Number(rvMandala[1]);
		const cite = `RV ${mandala}`;
		const description = `Ṛgveda maṇḍala ${mandala} (${cite}) sūkta index with Vedic svara | Śākala Saṃhitā — Vaidhika Dharma.`;
		const introRoot = `ऋग्वेद मण्डल ${mandala} — सूक्तानां सूचीः, स्वरचिह्नित पाठः।`;
		const introIast = `Ṛgveda maṇḍala ${mandala} — sūkta index with Vedic svara (Śākala Saṃhitā).`;
		return buildPair(description, introRoot, introIast, cite, `Ṛgveda maṇḍala ${mandala}`);
	}

	const tsPrap = path.match(/^taittiriya-samhita\/kanda-(\d+)\/prapathaka-(\d+)$/);
	if (tsPrap) {
		const kanda = Number(tsPrap[1]);
		const prapathaka = Number(tsPrap[2]);
		const cite = `TS ${kanda}.${prapathaka}`;
		const description = `Taittirīya Saṃhitā ${cite} (Kṛṣṇa Yajurveda) with Vedic svara — Vaidhika Dharma.`;
		const introRoot = `${cite} — तैत्तिरीय संहिता, काण्ड ${kanda}, प्रपाठक ${prapathaka}। स्वरचिह्नित पाठः।`;
		const introIast = `${cite} — Taittirīya Saṃhitā, kāṇḍa ${kanda}, prapāṭhaka ${prapathaka}. Vedic svara-marked text.`;
		return buildPair(description, introRoot, introIast, cite, `${cite} — Taittirīya Saṃhitā`);
	}

	const tsKanda = path.match(/^taittiriya-samhita\/kanda-(\d+)$/);
	if (tsKanda) {
		const kanda = Number(tsKanda[1]);
		const description = `Taittirīya Saṃhitā kāṇḍa ${kanda} (TS ${kanda}) prapāṭhaka index with Vedic svara — Vaidhika Dharma.`;
		const introRoot = `तैत्तिरीय संहिता काण्ड ${kanda} — प्रपाठकानां सूचीः।`;
		const introIast = `Taittirīya Saṃhitā kāṇḍa ${kanda} — prapāṭhaka index with Vedic svara.`;
		return buildPair(description, introRoot, introIast, `TS ${kanda}`, `Taittirīya kāṇḍa ${kanda}`);
	}

	const msChapter = path.match(/^maitrayani-samhita\/kanda-(\d+)\/prapathaka-(\d+)$/);
	if (msChapter) {
		const kanda = Number(msChapter[1]);
		const prapathaka = Number(msChapter[2]);
		const cite = `MS ${kanda}.${prapathaka}`;
		const description = `Maitrāyaṇī Saṃhitā ${cite} (Kṛṣṇa Yajurveda) with Vedic svara — Vaidhika Dharma.`;
		const introRoot = `${cite} — मैत्रायणी संहिता, काण्ड ${kanda}, प्रपाठक ${prapathaka}। स्वरचिह्नित पाठः।`;
		const introIast = `${cite} — Maitrāyaṇī Saṃhitā, kāṇḍa ${kanda}, prapāṭhaka ${prapathaka}. Vedic svara-marked text.`;
		return buildPair(description, introRoot, introIast, cite, `${cite} — Maitrāyaṇī Saṃhitā`);
	}

	const kanva = path.match(/^kanva-samhita\/chapter-(\d+)(?:-index)?$/);
	if (kanva) {
		const chapter = Number(kanva[1]);
		const cite = `VS (Kāṇva) ${chapter}`;
		const description = `Vājasaneyi Saṃhitā Kāṇva adhyāya ${chapter} (${cite}) with Vedic svara — Vaidhika Dharma.`;
		const introRoot = `${cite} — काण्व संहिता, अध्याय ${chapter}। स्वरचिह्नित पाठः।`;
		const introIast = `${cite} — Kāṇva Saṃhitā, adhyāya ${chapter}. Vedic svara-marked text.`;
		return buildPair(description, introRoot, introIast, cite, cite);
	}

	const madhy = path.match(/^madhyandina-samhita\/chapter-(\d+)(?:-index)?$/);
	if (madhy) {
		const chapter = Number(madhy[1]);
		const cite = `VS (Mādhyandina) ${chapter}`;
		const description = `Vājasaneyi Saṃhitā Mādhyandina adhyāya ${chapter} (${cite}) with Vedic svara — Vaidhika Dharma.`;
		const introRoot = `${cite} — माध्यन्दिन संहिता, अध्याय ${chapter}। स्वरचिह्नित पाठः।`;
		const introIast = `${cite} — Mādhyandina Saṃhitā, adhyāya ${chapter}. Vedic svara-marked text.`;
		return buildPair(description, introRoot, introIast, cite, cite);
	}

	const aitBrah = path.match(/^aitareya-brahmana\/panchika-(\d+)\/adhyaya-(\d+)$/);
	if (aitBrah) {
		const panchika = Number(aitBrah[1]);
		const adhyaya = Number(aitBrah[2]);
		const cite = `AB ${panchika}.${adhyaya}`;
		const description = `Aitareya Brāhmaṇa ${cite} (Ṛgveda) with Vedic svara — Vaidhika Dharma.`;
		const introRoot = `${cite} — ऐतरेय ब्राह्मणम्, पञ्चिका ${panchika}, अध्याय ${adhyaya}।`;
		const introIast = `${cite} — Aitareya Brāhmaṇa, pañcikā ${panchika}, adhyāya ${adhyaya}.`;
		return buildPair(description, introRoot, introIast, cite, cite);
	}

	const aitAr = path.match(/^aitareya-aranyaka\/aranyaka-(\d+)\/adhyaya-(\d+)$/);
	if (aitAr) {
		const aranyaka = Number(aitAr[1]);
		const adhyaya = Number(aitAr[2]);
		const cite = `AA ${aranyaka}.${adhyaya}`;
		const description = `Aitareya Āraṇyaka ${cite} (Ṛgveda) with Vedic svara — Vaidhika Dharma.`;
		const introRoot = `${cite} — ऐतरेय आरण्यकम्, आरण्यक ${aranyaka}, अध्याय ${adhyaya}।`;
		const introIast = `${cite} — Aitareya Āraṇyaka, āraṇyaka ${aranyaka}, adhyāya ${adhyaya}.`;
		return buildPair(description, introRoot, introIast, cite, cite);
	}

	const tbPrap = path.match(/^taittiriya-brahmana\/kanda-(\d+)\/prapathaka-(\d+)$/);
	if (tbPrap) {
		const kanda = Number(tbPrap[1]);
		const prapathaka = Number(tbPrap[2]);
		const cite = `TB ${kanda}.${prapathaka}`;
		const description = `Taittirīya Brāhmaṇa ${cite} with Vedic svara — Vaidhika Dharma.`;
		const introRoot = `${cite} — तैत्तिरीय ब्राह्मणम्, काण्ड ${kanda}, प्रपाठक ${prapathaka}।`;
		const introIast = `${cite} — Taittirīya Brāhmaṇa, kāṇḍa ${kanda}, prapāṭhaka ${prapathaka}.`;
		return buildPair(description, introRoot, introIast, cite, cite);
	}

	const taPrap = path.match(/^taittiriya-aranyaka\/prashna-(\d+)$/);
	if (taPrap) {
		const prashna = Number(taPrap[1]);
		const cite = `TA ${prashna}`;
		const description = `Taittirīya Āraṇyaka praśna ${prashna} (${cite}) with Vedic svara — Vaidhika Dharma.`;
		const introRoot = `${cite} — तैत्तिरीय आरण्यकम्, प्रश्न ${prashna}।`;
		const introIast = `${cite} — Taittirīya Āraṇyaka, praśna ${prashna}.`;
		return buildPair(description, introRoot, introIast, cite, cite);
	}

	return null;
}

export function getCorpusSeoDescription(
	slug: string,
	title: string,
	isIast: boolean
): string | null {
	return getCorpusSeoCopy(slug, title, isIast)?.description ?? null;
}

export function getCorpusSeoIntro(
	slug: string,
	title: string,
	locale: HomeLocale
): string | null {
	const copy = getCorpusSeoCopy(slug, title, locale === 'iast');
	return copy?.intro[locale] ?? null;
}

export function getCorpusOgAlt(slug: string, title: string, isIast: boolean): string | null {
	return getCorpusSeoCopy(slug, title, isIast)?.ogAlt ?? null;
}
