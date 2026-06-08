# Vaidhika Dharma

**[vaidhikadharma.org](https://vaidhikadharma.org)** — a digital guide to the Vedic way of life: daily *anuṣṭhāna* (rituals), *dharma* (right conduct), and *svādhyāya* (study of the scriptures).

## About

Vaidhika Dharma preserves and shares authentic Dharmic knowledge — Vedic rituals, mantras, and allied texts — in a form that is easy to read, search, and follow. Content is organized by tradition and practice, with support for multiple scripts and languages.

## Features

- **Nityakarma** — step-by-step ritual guides (e.g. sandhyāvandanam, brahmayajñam, samidhādhānam) for Āśvalāyana and Āpastamba traditions
- **Veda Mantras** — curated mantra collections and references
- **Multilingual** — IAST (default), Sanskrit (देवनागरी), and Tamil (தமிழ்) locales
- **Reusable ritual blocks** — shared Astro components (e.g. `Achamanam`) to keep repeated ritual steps consistent across pages
- **Search** — full-text search via Starlight / Pagefind

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Astro](https://astro.build) 6 |
| Docs theme | [Starlight](https://starlight.astro.build) |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4 |
| Content | Markdown / MDX in `src/content/docs/` |
| Images | Sharp |
| Hosting | GitHub Pages → [vaidhikadharma.org](https://vaidhikadharma.org) |

## Local development

**Requirements:** Node.js 22.12+ and npm.

```bash
git clone <repository-url>
cd vaidhika-dharma
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). Other commands:

```bash
npm run build    # production build → dist/
npm run preview  # serve the built site locally
```

## Project structure

```
src/
├── assets/              # logos, images
├── components/          # Astro UI (Hero, Sidebar, CategoryTree, rituals/, …)
├── content/
│   ├── docs/            # main documentation
│   │   ├── nityakarma/  # daily rituals (IAST)
│   │   ├── vedamantras/
│   │   ├── sa/          # Sanskrit locale
│   │   └── ta/          # Tamil locale
│   └── i18n/            # locale strings
├── data/                # categories, homepage content
├── fonts/
└── styles/
astro.config.mjs         # Starlight config, locales, sidebar
```

### Adding or editing content

- Ritual pages live under `src/content/docs/nityakarma/` (and mirrored under `sa/` and `ta/`).
- Use `.mdx` when a page needs Astro components (e.g. `<Achamanam />`, `<Achamanam locale="sa" />`).
- English instructional text should be clear, grammatically correct, and use consistent transliteration (IAST).

### Reusable ritual components

Repeated ritual steps are defined once in `src/components/rituals/` and imported in MDX:

```mdx
import Achamanam from '/src/components/rituals/Achamanam.astro';

<Achamanam />
<Achamanam variant="compact" />
<Achamanam locale="sa" />
```

## Repositories

| Repository | Remote | Contents |
|------------|--------|----------|
| **Private (source)** | `git@github.com:Devarajan89/vaidhika-dharma-pvt.git` | Full Astro/Starlight project — develop and push here |
| **Public (site only)** | `git@github.com:Devarajan89/vaidhika-dharma.git` | Built static files only (`dist/`); updated by CI, not by hand |

```bash
# One-time: point your local clone at the private repo
git remote add origin git@github.com:Devarajan89/vaidhika-dharma-pvt.git
git push -u origin main
```

Do not push source code to the public repository. Only the GitHub Action publishes there.

## Deployment

Pushes to `main` on the **private** repo trigger [.github/workflows/deploy.yml](.github/workflows/deploy.yml):

1. Check out the private repository and run `npm run build`
2. Push the contents of `dist/` to the `main` branch of `Devarajan89/vaidhika-dharma`

### Required secret (private repo)

Add this under **Settings → Secrets and variables → Actions** on `vaidhika-dharma-pvt`:

| Secret | Purpose |
|--------|---------|
| `PUBLIC_REPO_DEPLOY_TOKEN` | GitHub PAT with **write** access to `Devarajan89/vaidhika-dharma` |

Create a [fine-grained personal access token](https://github.com/settings/tokens?type=beta) scoped to the public repo with **Contents: Read and write**, or a classic PAT with the `repo` scope.

### GitHub Pages (public repo)

On `Devarajan89/vaidhika-dharma`, set **Settings → Pages → Build and deployment** to deploy from the **`main`** branch, folder **`/` (root)**. The custom domain [vaidhikadharma.org](https://vaidhikadharma.org) should be configured on that repository.

## Contributing

Contributions are welcome.

- **Content** — translations, ritual corrections, or new guides via pull request
- **Code** — UI improvements, components, accessibility, or bug fixes
- **Feedback** — open an issue with suggestions or corrections

Please keep changes focused and match existing naming, transliteration, and file layout conventions.

## Connect

- **Website:** [vaidhikadharma.org](https://vaidhikadharma.org)
- **Email:** [contact@vaidhikadharma.org](mailto:contact@vaidhikadharma.org)

## License

Content is shared under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — free for non-commercial use with attribution.

---

*ॐ सर्वं ज्ञानप्लावितं मङ्गलम्।*
