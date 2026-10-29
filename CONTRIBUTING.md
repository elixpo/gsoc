# Contributing to the Elixpo GSoC site

This repository is the single source for Elixpo's Google Summer of Code
pages. Every page on https://gsoc.elixpo.com is rendered from the Markdown in
`content/` and the people list in `src/data/people.ts`. Change it here, and
every page that shows it changes together.

## What goes where

| You want to change | Edit |
|---|---|
| A project idea | `content/ideas/<slug>.md` |
| A page's text (FAQ, proposal template, AI policy, ...) | `content/pages/<page>.md` |
| A person's name, role or email | `src/data/people.ts` |
| The status banner, capacity statement or shared contact | `src/data/site.ts` |
| Layout, styles, metadata | `src/` |

## Rules for ideas

- Every idea has these frontmatter fields: `title`, `slug` (same as the file
  name), `order`, `theme`, `size_hours` (90 or 175), `difficulty` (`Easy`,
  `Easy–Intermediate`, `Intermediate`, `Intermediate–Hard` or `Hard`),
  `primary_mentor` and `backup_mentor` (GitHub handles of mentors in
  `src/data/people.ts`), `repository`, `setup`, `env_example`, `summary`,
  `skills` and `related_issues` (entries like `"123 Issue title"`).
- The body has exactly these sections, in order: Problem, Expected outcomes,
  Stretch goals, Not in scope, Proof of success, How to start.
- Describe the need, not a week-by-week plan. The applicant's proposal should
  show their own reasoning.
- No claim without evidence. Link only to public repositories and issues that
  exist. Don't add numbers you can't point to.
- A new idea, a size change or a mentor change needs agreement from both
  mentors named on it. Say so in the pull request.

The build fails if an idea breaks these rules, and `npm run site:check`
checks that sizes, difficulty and mentors match on every page.

## Writing style

Plain English, short paragraphs, lists where they help. Say "we plan to",
not "we will", for anything that depends on Google. Never say or imply that
Elixpo has been accepted into Google Summer of Code until Google announces it.

## Local checks

Use Node.js 24.

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm run site:check
```

## Pull requests

Fill in the pull request template. Fork pull requests receive no secrets.
