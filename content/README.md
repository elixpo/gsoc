# Site content

Everything a reader sees on https://gsoc.elixpo.com comes from this folder,
plus the people list in `src/data/people.ts` and the shared facts (status
banner, capacity statement, contact email) in `src/data/site.ts`.

| File | Route |
|---|---|
| `pages/home.md` | `/` |
| `pages/ideas.md` | `/ideas/` (intro; the table is built from `ideas/*.md`) |
| `ideas/<slug>.md` | `/ideas/<slug>/` (sections: Description, Expected outcomes, Stretch goals, Out of scope, How success is measured, Warm-up tasks, Terms used on this page) |
| `pages/projects.md` + `projects/<slug>.md` | `/projects/` (one file per codebase; ideas and mentors are taken from the idea files) |
| `pages/mentors.md` | `/mentors/` (intro; people come from `src/data/people.ts`) |
| `pages/operations.md` | `/operations/` (how the programme runs: phases, weekly cadence and report, mentor cover, evaluations, escalation, after the programme; full handbook in `../operations/`) |
| `pages/contributor-guide.md` | `/contributor-guide/` |
| `pages/warm-up.md` | `/warm-up/` (setting up each project without keys; commands are cited to each repository's own files, and each project section must be named after `projects/*.md` `name`) |
| `pages/proposal.md` | `/proposal/` |
| `pages/selection.md` | `/selection/` |
| `pages/ai-policy.md` | `/ai-policy/` |
| `pages/timeline.md` | `/timeline/` |
| `pages/faq.md` | `/faq/` (each `##` heading is one question) |
| `pages/contact.md` | `/contact/` |
| `pages/privacy.md`, `pages/terms.md`, `pages/code-of-conduct.md`, `pages/contributing.md` | `/privacy/`, `/terms/`, `/code-of-conduct/`, `/contributing/` |
| `pages/agreements.md` | `/agreements/` (people and signed copies come from `src/data/agreements.ts`) |
| `pages/agenda.md` | `/agenda/` (mission, what Elixpo ships, how it decides, money and commercial interests, care for contributors) |
| `pages/why-elixpo.md` | `/why-elixpo/` (questions a programme reviewer may ask, each `##` heading one question with an evidence link) |
| `pages/about.md` | `/about/` (history from `elixpo/content/history.json`; each step is `### Date — Title` with its evidence) |

Facts that change with the site's data are written inline as `{{name}}` and
filled in at build time (`INLINE_FACTS` in `src/lib/content.ts`). For example,
`{{commitment-status}}` says whether the commitments are signed yet, from
`src/data/agreements.ts`; never state that by hand.

Every page in `pages/` except `timeline.md` has a `tldr:` list in its
frontmatter: three to six short points with the page's most important facts or
actions, shown as the numbered TL;DR row under the hero. Points are inline
Markdown, so they may contain links. Keep them identical to the page body. The
last point links back to the relevant project idea(s): the ideas of a codebase,
or "Browse the six project ideas" (`/ideas/`) on general pages. Idea pages
build their TL;DR from the idea's frontmatter and end with "See all six ideas".

## Ideas

| # | Idea | Theme | Size | Difficulty | Primary / backup mentor |
|---|---|---|---|---|---|
| 1 | [LixBlogs read-access policy and offline conformance harness](ideas/lixblogs-read-access-policy.md) | Security | 175 h | Hard | Divyanshu / Vivek Yadav |
| 2 | [Accessible LixSketch canvas](ideas/accessible-lixsketch-canvas.md) | Accessibility | 175 h | Intermediate | Vivek Yadav / Divyanshu |
| 3 | [Crumb connector contract and offline conformance kit](ideas/crumb-connector-contract.md) | Rust, agent security | 175 h | Hard | Ayushman Bhattacharya / Vivek Yadav |
| 4 | [Explainable contest-scoring engine for Elixpo Open Source](ideas/contest-scoring-engine.md) | Community, data | 90 h | Intermediate | Divyanshu / Ayushman Bhattacharya |
| 5 | [Oreo badge desktop simulator](ideas/oreo-badge-simulator.md) | Embedded, open hardware | 175 h | Intermediate | Ayushman Bhattacharya / Vivek Yadav |
| 6 | [LixBlogs CLI automation contract v1](ideas/lixblogs-cli-contract.md) | Developer tools | 90 h | Easy | Divyanshu / Ayushman Bhattacharya |

This table is for reading on GitHub. The site builds its own table from the
idea files, so if you change an idea, update this table in the same pull
request.

Text in this folder is licensed under CC BY 4.0; see `../LICENSE-CONTENT`.
