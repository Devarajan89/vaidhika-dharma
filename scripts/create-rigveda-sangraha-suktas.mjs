import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const INDEX = JSON.parse(
	fs.readFileSync(path.join(ROOT, 'src/data/rigveda/verse-index.json'), 'utf8')
);
const COMP_DIR = path.join(ROOT, 'src/data/rigveda/compilations');
const ROOT_SANGGRAHA = fs
	.readdirSync(path.join(ROOT, 'src/content/docs/vedamantras'))
	.find((name) => name.includes('ऋग्वेद'));
const IAST_SANGGRAHA = 'ṛgvedasūktasaṅgraha';

/** @type {{ id: string; rootTitle: string; iastTitle: string; suktas: [number, number][]; order: number }[]} */
const SUKTA_DEFS = [
	{ id: 'oshadhi-suktam', rootTitle: 'औषधि सूक्तम्', iastTitle: 'Auṣadhi Sūktam', suktas: [[10, 97]], order: 10 },
	{ id: 'kumara-suktam', rootTitle: 'कुमार सूक्तम्', iastTitle: 'Kumāra Sūktam', suktas: [[5, 2]], order: 11 },
	{ id: 'devi-suktam', rootTitle: 'देवी सूक्तम्', iastTitle: 'Devī Sūktam', suktas: [[10, 125]], order: 12 },
	{ id: 'nasadiya-suktam', rootTitle: 'नासदीय सूक्तम्', iastTitle: 'Nāsadīya Sūktam', suktas: [[10, 129]], order: 13 },
	{ id: 'pitri-suktam', rootTitle: 'पितृ सूक्तम्', iastTitle: 'Pitṛ Sūktam', suktas: [[10, 15]], order: 14 },
	{
		id: 'purusha-suktam-rig',
		rootTitle: 'पुरुष सूक्तम् (ऋग्वेद)',
		iastTitle: 'Puruṣa Sūktam (Ṛgveda)',
		suktas: [[10, 90]],
		order: 15,
	},
	{ id: 'bhaga-suktam', rootTitle: 'भाग्य (भग) सूक्तम्', iastTitle: 'Bhāgya (Bhaga) Sūktam', suktas: [[7, 41]], order: 16 },
	{
		id: 'manyu-suktam',
		rootTitle: 'मन्यु सूक्तम्',
		iastTitle: 'Manyu Sūktam',
		suktas: [
			[10, 83],
			[10, 84],
		],
		order: 17,
	},
	{ id: 'ratri-suktam', rootTitle: 'रात्रि सूक्तम्', iastTitle: 'Rātri Sūktam', suktas: [[10, 127]], order: 18 },
	{ id: 'vastu-suktam', rootTitle: 'वास्तु सूक्तम्', iastTitle: 'Vāstu Sūktam', suktas: [[7, 54]], order: 19 },
	{ id: 'shraddha-suktam', rootTitle: 'श्रद्धा सूक्तम्', iastTitle: 'Śraddhā Sūktam', suktas: [[10, 151]], order: 20 },
	{
		id: 'sarasvati-suktam',
		rootTitle: 'सरस्वती सूक्तम्',
		iastTitle: 'Sarasvatī Sūktam',
		suktas: [[6, 61]],
		order: 21,
	},
	{ id: 'samjnana-suktam', rootTitle: 'संज्ञान सूक्तम्', iastTitle: 'Saṃjñāna Sūktam', suktas: [[10, 191]], order: 22 },
	{
		id: 'hiranyagarbha-suktam',
		rootTitle: 'हिरण्यगर्भ सूक्तम्',
		iastTitle: 'Hiraṇyagarbha Sūktam',
		suktas: [[10, 121]],
		order: 23,
	},
];

/**
 * @param {number} mandala
 * @param {number} sukta
 */
function suktaMeta(mandala, sukta) {
	return INDEX.suktas[`${mandala}:${sukta}`];
}

/**
 * @param {number} mandala
 * @param {number} sukta
 */
function allVerses(mandala, sukta) {
	const meta = suktaMeta(mandala, sukta);
	if (!meta) throw new Error(`Missing sukta ${mandala}.${sukta}`);
	return meta.verses.map((verse, index) => ({
		mandala,
		sukta,
		verse,
		label: index + 1,
	}));
}

/**
 * @param {{ id: string; suktas: [number, number][] }} def
 */
function buildCompilation(def) {
	const sections = def.suktas.map(([mandala, sukta]) => {
		const meta = suktaMeta(mandala, sukta);
		return {
			header: meta.header,
			mantras: allVerses(mandala, sukta),
		};
	});
	return { id: def.id, sections };
}

/**
 * @param {object} options
 */
function buildMdx({ id, title, slug, locale, order, description }) {
	const prefix = locale === 'iast' ? 'iast/' : '';
	return `---
title: ${title}
pubDate: 2026-06-17T00:00:00+05:30
slug: ${prefix}${slug}
sidebar:
  order: ${order}
lastUpdated: 2026-06-17
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 4
description: '${description}'
---
import RigvedaCompilation from '/src/components/content/RigvedaCompilation.astro';

<RigvedaCompilation id="${id}" locale="${locale}" />
`;
}

function main() {
	fs.mkdirSync(COMP_DIR, { recursive: true });

	for (const def of SUKTA_DEFS) {
		const compilation = buildCompilation(def);
		const jsonPath = path.join(COMP_DIR, `${def.id}.json`);
		fs.writeFileSync(jsonPath, `${JSON.stringify(compilation, null, 2)}\n`, 'utf8');

		const rootMdx = buildMdx({
			id: def.id,
			title: def.rootTitle,
			slug: def.id,
			locale: 'root',
			order: def.order,
			description: `${def.rootTitle} — svara-sahita Ṛgveda mantra, Vaidhika Dharma.`,
		});
		const iastMdx = buildMdx({
			id: def.id,
			title: def.iastTitle,
			slug: def.id,
			locale: 'iast',
			order: def.order,
			description: `${def.iastTitle} — Ṛgveda mantra with svara, Vaidhika Dharma.`,
		});

		fs.writeFileSync(
			path.join(ROOT, 'src/content/docs/vedamantras', ROOT_SANGGRAHA, `${def.id}.mdx`),
			rootMdx,
			'utf8'
		);
		fs.writeFileSync(
			path.join(ROOT, 'src/content/docs/iast/vedamantras', IAST_SANGGRAHA, `${def.id}.mdx`),
			iastMdx,
			'utf8'
		);

		const count = compilation.sections.reduce((sum, s) => sum + s.mantras.length, 0);
		console.log(`${def.id}: ${count} mantras`);
	}
}

main();
