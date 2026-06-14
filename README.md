# Vaidhika Dharma

**[vaidhikadharma.org](https://vaidhikadharma.org)** — a digital guide to the Vedic way of life: daily rituals (*nityakarma*), Vedic mantras, and scripture (*saṃhitā*).

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

## Local development

**Requirements:** Node.js 22.12+ and npm.

```bash
git clone https://github.com/Devarajan89/vaidhika-dharma.git
cd vaidhika-dharma
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

```bash
npm run build    # production build
npm run preview  # preview the built site
```

## Repository

**https://github.com/Devarajan89/vaidhika-dharma**

Source code and deployment live in this single repository.

## Deployment

Pushes to `main` run [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which builds the site and pushes the contents of `dist/` to the **`vd`** branch.

| Branch | Contents |
|--------|----------|
| `main` | Source code |
| `vd` | Built static site (updated by CI) |

**One-time setup** on the repository:

1. **Settings → Pages → Build and deployment** — deploy from branch **`vd`**, folder **`/` (root)**
2. **Settings → Pages → Custom domain** — set `vaidhikadharma.org` (a `CNAME` file is included in the build)

No deploy keys or second repository are required.

## Contributing

Pull requests are welcome for content corrections, translations, and improvements. Please keep changes focused and match existing conventions.

## Connect

- **Website:** [vaidhikadharma.org](https://vaidhikadharma.org)
- **Email:** [contact@vaidhikadharma.org](mailto:contact@vaidhikadharma.org)

## License

Content is shared under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
