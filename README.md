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
description, Open Graph and Twitter tags, JSON-LD (Organization everywhere,
ItemList on `/ideas/`, BreadcrumbList on idea pages, FAQPage on `/faq/`),
one `<h1>`, `lang="en"`, the skip link, the status banner and footer, broken
internal links, and claims the site must not make. It also checks that idea
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

The site is static, so any static host works. The intended host is a
Cloudflare Pages project called `elixpo-gsoc`, with `public/_headers` copied
into the export for security headers.

```bash
./deploy.sh --pages build                       # build + checks
./deploy.sh --pages build deploy --branch preview
```

`deploy.sh` runs `npx wrangler pages deploy out --project-name elixpo-gsoc`
with the maintainer's own Wrangler login. No Cloudflare credentials or other
secrets are stored in this repository.

TODO (maintainer) before the first deploy:

- Create the `elixpo-gsoc` Cloudflare Pages project.
- Attach `gsoc.elixpo.com` as a custom domain in Pages, then add the DNS
  record.
- Decide whether to move deployment into a trusted GitHub Actions workflow,
  as `research.elixpo` does.
- Only set `NEXT_PUBLIC_SITE_LAUNCHED=true` for the agreed launch build.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). This project follows the
[Elixpo Code of Conduct](CODE_OF_CONDUCT.md). Report security issues as
described in [SECURITY.md](SECURITY.md).

## Licence

- Site source code: MIT, see [LICENSE](LICENSE).
- Site text in `content/`: CC BY 4.0, see [LICENSE-CONTENT](LICENSE-CONTENT).
- The Elixpo name and logo are brand marks and are not covered by either
  licence. Each Elixpo project linked from the site keeps its own licence.

Not affiliated with or endorsed by Google. Google Summer of Code is a Google
programme.
