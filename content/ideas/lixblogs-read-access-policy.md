---
title: "LixBlogs Access Policy: one read rule for every route"
slug: lixblogs-read-access-policy
order: 1
theme: Security
size_hours: 350
difficulty: Hard
primary_mentor: ez-vivek
backup_mentor: divyanshuj91
repository: https://github.com/elixpo/blogs.elixpo
setup: https://github.com/elixpo/blogs.elixpo/blob/main/README.md
summary: Replace read checks copied across LixBlogs API routes with one policy for visibility and redaction, proven by an offline harness, then build search on it.
in_short: Make one clear set of rules for who may read what on LixBlogs, build tests that prove private posts stay private, and then build full-text search that follows the same rules.
skills:
  - JavaScript and Node
  - SQL and SQLite
  - Next.js route handlers
  - Test design
  - Cloudflare D1 (helpful)
related_issues:
  - "559 LixBlogs Access Policy: one read rule for every route, checked by a conformance harness"
  - "507 Popular tags count drafts, trashed, and secret posts"
  - "510 Collab status endpoint exposes draft editor identity without permission"
  - "511 Blog collaborator list is readable for any draft by any signed-in user"
  - "512 Repost and report routes accept drafts and trashed posts"
  - "515 Saved and history lists return unpublished and trashed posts"
  - "516 Subpage listing reveals draft subpage titles"
  - "517 Org visibility accepts arbitrary values that bypass privacy checks"
  - "518 Org collections and links endpoints expose private org data"
  - "519 Private org posts surface in follow lists, discovery, and public reading lists"
---

## Description

LixBlogs decides who can read a post, draft, secret post or
private-organisation item separately in each of its 135 API routes. The same
SQL visibility filters are copied across many of them, and there is no shared
`canRead` rule.

In October 2026 an outside contributor reported a cluster of privacy
defects caused by that duplication (#507, #510–#512 and #515–#519, linked
under Material). They are fixed on `main`, route by route, in
[#535](https://github.com/elixpo/blogs.elixpo/pull/535)–[#537](https://github.com/elixpo/blogs.elixpo/pull/537), [#548](https://github.com/elixpo/blogs.elixpo/pull/548) and
[#549](https://github.com/elixpo/blogs.elixpo/pull/549), and contributors keep
fixing similar cases one route at a time. Nothing keeps them fixed: today's
tests check SQL text or use a hand-written schema, not the real routes. This
project builds the guard that keeps them fixed, as proposed in
[#559](https://github.com/elixpo/blogs.elixpo/issues/559).

The policy has two dimensions, not one:

- **Row visibility**: who may see an item at all (drafts, unlisted posts,
  trashed posts, private organisations).
- **Field redaction**: what they may see of it. A secret post is public, but
  its author must never be revealed (`migrations/0037_secret_blogs.sql`), so
  the policy must hide fields, not only filter rows.

**Impact.** LixBlogs holds content that must remain private, and authors who
must remain anonymous. One shared policy, tested against the real route
handlers, makes this class of defect much harder to reintroduce, and gives
new features such as search a safe base to build on.

## Expected outcomes

- Who may read what, and which fields they may see, is decided in one
  declarative policy, so a new or changed route cannot quietly invent its
  own rules.
- Anyone can prove, offline and without secrets, that private content stays
  private, by running the real route handlers against a local database.
- For 350 hours: full-text search over post bodies, built as the first
  feature on the policy, so search can never show what the policy hides.

The project can be proposed at **175 hours**: the policy, the harness and
the highest-risk routes. The **350-hour** version migrates every read route
and adds access-aware full-text search.

## Stretch goals

- Property-based fixtures.
- Differential checks: a list endpoint never returns an item that the
  single-item endpoint refuses.
- Search ranking and highlighted snippets that respect redaction.

## Out of scope

- Fixing unrelated bugs.
- Building new UI beyond showing search results.
- Testing against production.
- Changing the auth provider.

## How success is measured

- The policy covers each type of viewer, each content state and each
  redacted field, and the shared query helpers are derived from it.
- The harness runs the real route handlers against SQLite built from
  `migrations/` (routes reach the database through `lib/cloudflare.js`, so it
  can be replaced in tests), with a fake session and a fixture "world".
- Every read route is checked against a viewer × status × visibility matrix,
  and CI fails when a new route skips the policy.
- Reverting the October fixes linked above makes the suite fail.
- For 350 hours: post content is stored compressed (`lib/compress.js`), so
  plain text is extracted at write time and indexed with SQLite FTS5; the
  index stays in sync on publish, edit and delete; the proposal explains what
  the index means for D1 exports and backups; and the harness proves search
  respects the policy.
- CI needs no secrets.

## Warm-up tasks

1. Set up LixBlogs locally from the README and run the existing tests in
   `tests/`. No private keys are needed. If a step asks for a secret, report
   it as a setup issue (see
   [#562](https://github.com/elixpo/blogs.elixpo/issues/562) and
   [configuration and access](/contributor-guide/#configuration-and-access)).
2. Read the October reports linked under Material and the pull requests
   that fixed them, identify the route each one touches, and summarise the
   cause in your own words, then {{warm-up-results}}.
3. Read `migrations/` and the existing tests in `tests/`, and describe how data
   and tests are structured today.
4. Take a warm-up issue such as #564 or #392, open a pull request, and respond
   to review until it is merged or closed.

## Terms used on this page

- **Read-access policy**: the rules that decide who may read a piece of
  content.
- **Row visibility, field redaction**: whether an item can be seen at all,
  and which of its details are hidden.
- **Secret post**: a public post whose author is never shown.
- **Declarative**: the rules are written down once, in one place, instead of
  being repeated as code in many places.
- **API route, route handler**: a server address that the website or an app
  calls, and the code that answers it.
- **SQL filter**: the part of a database query that decides which rows to
  return.
- **Harness, conformance harness**: a set of automated tests that runs the
  real code and checks that it follows the rules.
- **Offline**: runs on your own computer, with no online services or secrets.
- **SQLite, Cloudflare D1**: small databases. D1 is a hosted database service
  from Cloudflare, based on SQLite.
- **FTS5**: SQLite's full-text search feature.
- **Migrations** (`migrations/`): files that create and change the database
  tables, step by step.
- **Fake session, fixture "world"**: a pretend signed-in user and a small,
  made-up set of users, posts and organisations, used in tests.
- **CI**: tests that run automatically on every proposed change.
- **Property-based fixtures**: test data generated automatically, to find
  cases a person might not think of.
- **Differential checks**: comparing two parts of the system that should
  agree, here a list and a single item.
