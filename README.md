# justindoone.com

Personal portfolio site for Justin Doone — Toronto-based digital marketing strategist.

Built with [Astro 5](https://astro.build) + [Tailwind CSS 4](https://tailwindcss.com). Deployed to GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server on `localhost:4321` |
| `npm run build` | Build for production into `./dist/` |
| `npm run preview` | Preview the production build locally |

## Editing content

All case studies live in [`src/content/work/`](src/content/work/) as Markdown files. Each one has a frontmatter block at the top:

```markdown
---
title: "Case study title"
client: "Client name"
role: "Your role on the project"
date: "October 2025"
year: 2025
summary: "One- or two-sentence summary."
tags: ["Tag", "Tag"]
metrics:
  - value: "10×"
    label: "Traffic growth"
featured: true        # appears on the homepage
order: 1              # lower numbers appear first
accent: "#b34a2a"     # accent color used on metrics + hover
---

Body content in regular Markdown.
```

To add a new case study, just create a new `.md` file in that folder. No code changes required.

Static text (about page, contact page, hero copy) lives in [`src/pages/`](src/pages/).

## Deploying to GitHub Pages

1. Push this repo to GitHub. The repo can be named anything, but `justindoone.github.io` is the cleanest option if you want the free `justindoone.github.io` URL with no extra config.
2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source:** select **GitHub Actions**.
3. Every push to `main` will rebuild and redeploy the site automatically (the workflow is at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

### Custom domain (e.g. `justindoone.com`)

1. Buy the domain (Cloudflare Registrar is at-cost; Namecheap is fine too).
2. In the GitHub repo: **Settings → Pages → Custom domain** → enter `justindoone.com` and save.
3. Add the DNS records GitHub tells you to — typically four `A` records pointing the apex domain at GitHub's IPs, plus one `CNAME` for `www`.
4. Wait a few minutes; GitHub auto-provisions HTTPS once DNS resolves.
5. Update `site:` in [`astro.config.mjs`](astro.config.mjs) to your final URL so sitemaps and OG tags are correct.

## Project structure

```
portfolio/
├── public/                      # static assets (favicon, images)
├── src/
│   ├── components/              # Nav, Footer, WorkCard
│   ├── content/
│   │   └── work/                # case study markdown files
│   ├── layouts/
│   │   └── BaseLayout.astro     # site-wide HTML shell
│   ├── pages/
│   │   ├── index.astro          # homepage
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   └── work/
│   │       ├── index.astro      # /work — all case studies
│   │       └── [...slug].astro  # /work/[slug] — single case study
│   ├── styles/
│   │   └── global.css           # Tailwind + theme tokens
│   ├── content.config.ts        # case-study schema
│   └── env.d.ts
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```
