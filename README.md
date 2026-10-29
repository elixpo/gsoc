# Elixpo GSoC site

The source of **https://gsoc.elixpo.com**, Elixpo's Google Summer of Code
programme site: project ideas, mentors, contributor guide, proposal template,
selection criteria, AI policy and FAQ.

Elixpo is preparing to apply to GSoC 2027 as a first-time mentoring
organisation. Google has not yet announced GSoC 2027.

## How content maps to routes

Markdown in [`content/`](content/) is the source of truth and reads well on
GitHub. See [`content/README.md`](content/README.md) for the full map.

| Source | Route |
|---|---|
| `content/pages/home.md` | `/` |
| `content/pages/ideas.md` + `content/ideas/*.md` | `/ideas/` |
| `content/ideas/<slug>.md` | `/ideas/<slug>/` |
| `content/pages/people.md` + `src/data/people.ts` | `/people/` |
| `content/pages/contributor-guide.md` | `/contributor-guide/` |
| `content/pages/proposal.md` | `/proposal/` |
| `content/pages/selection.md` | `/selection/` |
| `content/pages/ai-policy.md` | `/ai-policy/` |
| `content/pages/timeline.md` | `/timeline/` |
| `content/pages/faq.md` | `/faq/` |
| `content/pages/contact.md` + `src/data/people.ts` | `/contact/` |
| `content/pages/about.md` | `/about/` (history entries are `### Date — Title`) |
| `src/app/not-found.tsx` | 404 page |

People, roles and emails live only in `src/data/people.ts`. Shared facts (the
status banner, the one-contributor statement, the contact address) live only
in `src/data/site.ts`.

## Stack

Next.js 16 static export (`output: "export"`, `trailingSlash: true`), React 19
and TypeScript, following `research.elixpo`. Markdown is rendered at build
time with [`marked`](https://marked.js.org/) (pinned). The site works without
JavaScript. Social cards (`/social/<page>.png`) are generated at build time.

## Run, build and check

Use Node.js 24.

```bash
npm ci
npm run dev          # http://localhost:3000
npm run typecheck
npm run lint
npm run build        # static export in out/
npm run site:check   # crawl metadata, launch gate, links, consistency
```

`scripts/check_site.py` checks every exported page for title, canonical URL,
description, Open Graph and Twitter tags (with `og:image` sizes that match the
real PNG), JSON-LD (Organization and WebSite everywhere, BreadcrumbList on
inner pages, ItemList on `/ideas/`, FAQPage on `/faq/`, AboutPage on
`/about/`), one `<h1>`, `lang="en"`, the skip link, the status banner, the GSoC
trademark notice in every footer, the main navigation order, broken internal
links, the GSoC logo placement on `/`, history evidence links on `/about/`,
role chips on `/people/`, `security.txt`, icons and the manifest, no
`::before`/`::after` in the built CSS, and claims the site must not make. It also checks that idea
sizes, difficulty levels and mentors are identical on `/`, `/ideas/`, each
idea page, `/people/`, `/faq/` and `content/README.md`.

## Launch gate

The site must not be indexed until the team decides to launch.

| `NEXT_PUBLIC_SITE_LAUNCHED` at build time | robots.txt | Every page |
|---|---|---|
| unset, or anything but `true` (default) | `Disallow: /`, no sitemap | `<meta name="robots" content="noindex, nofollow">` |
| `true` | `Allow: /` and `Sitemap: https://gsoc.elixpo.com/sitemap.xml` | `index, follow` |

The value is baked in at build time, so changing it needs a rebuild. Check
both states with:

```bash
npm run build && npm run site:check -- --not-launched
NEXT_PUBLIC_SITE_LAUNCHED=true npm run build && npm run site:check -- --launched
```

CI runs both. The 404 page is always `noindex`.

## Deploy

The site is static and is hosted on Cloudflare Pages (project `elixpo-gsoc`),
deployed the same way as `research.elixpo`: by the trusted GitHub Actions
workflow [`.github/workflows/deploy-cloudflare-pages.yml`](.github/workflows/deploy-cloudflare-pages.yml).
No Cloudflare credentials are stored in this repository or needed locally.

Every push to `main` lints, typechecks, builds and checks the site, creates the
Pages project if it is missing, deploys to `https://elixpo-gsoc.pages.dev` and
smoke-tests the result. Running the workflow by hand with `promote_domain`
also attaches `gsoc.elixpo.com`.

```bash
./deploy.sh --pages build              # local build + checks
./deploy.sh --pages deploy             # dispatch the workflow on main
./deploy.sh --pages deploy --promote   # ...and attach gsoc.elixpo.com
```

One-time setup (maintainer):

- Add the repository secrets `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID` (the same values `research.elixpo` uses).
- Launch gate: the repository variable `SITE_LAUNCHED` controls indexing. Leave
  it unset until launch; set it to `true` on launch day and redeploy.

Social card: put a PNG at `public/og-image.png` (the Elixpo branding pipeline
outputs 1280x720) to replace the generated home card (also the site-wide
default). Its real size is read from the file at build time. Other pages keep
their generated 1200x630 cards. Never use the GSoC logo as a social card or icon.

Search Console (optional): set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` at build
time to emit `<meta name="google-site-verification">`. Unset, nothing is emitted.

## GSoC logo and brand rules

`public/brand/gsoc/` holds Google's official GSoC logo files, unmodified, from
[Google's downloads](https://developers.google.com/open-source/gsoc/resources/downloads/).
Follow Google's [brand guidelines](https://developers.google.com/open-source/gsoc/resources/brand_guidelines):
do not alter or recolour the logo, never combine it with the Elixpo mark in one
lockup, always label it ("Elixpo is preparing to apply to"), and never imply
that Google endorses Elixpo. Every page carries the trademark notice in its
footer (`GSOC_TRADEMARK_NOTICE` in `src/data/site.ts`).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). This project follows the
[Elixpo Code of Conduct](CODE_OF_CONDUCT.md). Report security issues as
described in [SECURITY.md](SECURITY.md).

## Licence

- Site source code: MIT, see [LICENSE](LICENSE).
- Site text in `content/`: CC BY 4.0, see [LICENSE-CONTENT](LICENSE-CONTENT).
- The Elixpo name and logo are brand marks and are not covered by either
  licence. Each Elixpo project linked from the site keeps its own licence.

Google Summer of Code and the GSoC logo are trademarks of Google LLC. Elixpo
is preparing to apply as a mentoring organisation and is not affiliated with or
endorsed by Google.
