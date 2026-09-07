# Vaidhika Dharma

**[vaidhikadharma.org](https://vaidhikadharma.org)** — Vedic nityakarma, mantras with svara, and scripture (saṃhitā, brāhmaṇa, āraṇyaka, upaniṣad).

Devanagari is the default. The same pages exist in Latin transliteration under [`/iast/`](https://vaidhikadharma.org/iast/). Search is at [`/search/`](https://vaidhikadharma.org/search/).

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

## Content

| Area | What is on the site |
|------|---------------------|
| **Nityakarma** | Aśvalāyana and Āpastamba sandhyāvandana (prātaḥ, mādhyāhnika, sāyam), brahmayajña, samidādhāna |
| **Veda mantras** | Yajuṣa mantra ratnākaram (Rudra, Camaka, Puruṣa, Śrī, and related sūktas) and Ṛgveda sūkta saṅgraha (compilations assembled from Śākala ṛks) |
| **Saṃhitās** | Ṛgveda Śākala; Vājasaneyi Kāṇva and Mādhyandina; Taittirīya; Maitrāyaṇī |
| **Brāhmaṇa / āraṇyaka** | Aitareya and Taittirīya brāhmaṇa; Aitareya and Taittirīya āraṇyaka |
| **Upaniṣads** | Īśā, Kena, Kaṭha, Praśna, Taittirīya, Mahānārāyaṇa, Aitareya |

A machine-readable outline of public URLs is in [`public/llms.txt`](public/llms.txt).

## Local development

**Requirements:** Node.js 22.12+ and npm.

```bash
git clone https://github.com/Devarajan89/vaidhika-dharma.git
cd vaidhika-dharma
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). `npm run dev` regenerates the doc cache and offline pack, then starts Astro.

```bash
npm run build     # production build (runs the same generators via prebuild)
npm run preview   # preview the built site
```

## Layout

| Path | Role |
|------|------|
| `src/content/docs/` | Pages (Devanagari). IAST mirrors live under `src/content/docs/iast/` |
| `src/data/` | Saṃhitā JSON, Ṛgveda verse index, compilation maps, search synonyms |
| `src/data/rigveda/compilations/` | Sūkta-saṅgraha assemblies; thin MDX wrappers import `RigvedaCompilation` |
| `src/components/` | Reader UI, search, offline packs, verse/sukta renderers |
| `scripts/` | Fetch, generate, transliterate, and validate content |
| `public/` | Service worker, offline pack, headers, `llms.txt` |

Starlight locales: `root` (`lang: sa`, Devanagari) and `iast` (`lang: sa-Latn`).

## Reader features

- Site search (`/search/`, `/iast/search/`) plus mantra-reference lookups (for example `RV 10.90.1`, `TS 1.1.1`).
- Offline packs at [`/offline/`](https://vaidhikadharma.org/offline/) — daily nityakarma, Rudra, and saṅgraha sets, plus a service worker.
- Devanagari / IAST switch on matching slugs.

## Content scripts

Most generate or fetch steps are idempotent and write into `src/content/docs/` and `src/data/`. Common ones:

```bash
npm run generate:offline-pack
npm run validate:rigveda-compilations
npm run build:rigveda-verse-index
npm run build:rigveda-compilation-maps
npm run generate:rigveda-suktas
```

Saṃhitā / brāhmaṇa / āraṇyaka pipelines are named `fetch:*` and `generate:*` in `package.json` (Taittirīya, Maitrāyaṇī, Kāṇva, Mādhyandina, Aitareya).

## Deployment

Pushes to `main` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site and pushes `dist/` to the **`vd`** branch.

| Branch | Contents |
|--------|----------|
| `main` | Source |
| `vd` | Built static site (CI) |

**One-time GitHub Pages setup:** Settings → Pages → deploy from branch **`vd`**, folder **`/` (root)**; custom domain `vaidhikadharma.org` (a `CNAME` is included in the build).

## Contributing

Pull requests are welcome for content corrections, transliteration, and small UI fixes. Keep diffs focused and match existing frontmatter, slugs, and dual-locale pairs (every Devanagari page should have an IAST counterpart).

For Ṛgveda saṅgraha entries, prefer editing `src/data/rigveda/compilations/*.json` and run `npm run validate:rigveda-compilations`.

## Connect

- **Website:** [vaidhikadharma.org](https://vaidhikadharma.org)
- **Email:** [contact@vaidhikadharma.org](mailto:contact@vaidhikadharma.org)
- **Source:** [github.com/Devarajan89/vaidhika-dharma](https://github.com/Devarajan89/vaidhika-dharma)

## License

Content is shared under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
