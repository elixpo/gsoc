# Site content

Everything a reader sees on https://gsoc.elixpo.com comes from this folder,
plus the people list in `src/data/people.ts` and the shared facts (status
banner, capacity statement, contact email) in `src/data/site.ts`.

| File | Route |
|---|---|
| `pages/home.md` | `/` |
| `pages/ideas.md` | `/ideas/` (intro; the table is built from `ideas/*.md`) |
| `ideas/<slug>.md` | `/ideas/<slug>/` |
| `pages/people.md` | `/people/` (intro; people come from `src/data/people.ts`) |
| `pages/contributor-guide.md` | `/contributor-guide/` |
| `pages/proposal.md` | `/proposal/` |
| `pages/selection.md` | `/selection/` |
| `pages/ai-policy.md` | `/ai-policy/` |
| `pages/timeline.md` | `/timeline/` |
| `pages/faq.md` | `/faq/` (each `##` heading is one question) |
| `pages/contact.md` | `/contact/` |

## Ideas

| # | Idea | Theme | Size | Difficulty | Primary / backup mentor |
|---|---|---|---|---|---|
| 1 | [LixBlogs read-access policy and offline conformance harness](ideas/lixblogs-read-access-policy.md) | Security | 175 h | Intermediate–Hard | Divyanshu / Vivek Yadav |
| 2 | [Accessible LixSketch canvas](ideas/accessible-lixsketch-canvas.md) | Accessibility | 175 h | Intermediate | Vivek Yadav / Divyanshu |
| 3 | [Crumb connector contract and offline conformance kit](ideas/crumb-connector-contract.md) | Rust, agent security | 175 h | Hard | Ayushman Bhattacharya / Vivek Yadav |
| 4 | [Explainable contest-scoring engine for Elixpo Open Source](ideas/contest-scoring-engine.md) | Community, data | 90 h | Easy–Intermediate | Divyanshu / Ayushman Bhattacharya |
| 5 | [Oreo badge desktop simulator](ideas/oreo-badge-simulator.md) | Embedded, open hardware | 175 h | Intermediate | Ayushman Bhattacharya / Vivek Yadav |
| 6 | [LixBlogs CLI automation contract v1](ideas/lixblogs-cli-contract.md) | Developer tools | 90 h | Easy | Divyanshu / Ayushman Bhattacharya |

This table is for reading on GitHub. The site builds its own table from the
idea files, so if you change an idea, update this table in the same pull
request.

Text in this folder is licensed under CC BY 4.0; see `../LICENSE-CONTENT`.
