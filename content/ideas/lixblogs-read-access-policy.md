---
title: LixBlogs read-access policy and offline conformance harness
slug: lixblogs-read-access-policy
order: 1
theme: Security
size_hours: 175
difficulty: Hard
primary_mentor: divyanshuj91
backup_mentor: ez-vivek
repository: https://github.com/elixpo/blogs.elixpo
setup: https://github.com/elixpo/blogs.elixpo/blob/main/README.md
summary: Replace read-access checks copied across LixBlogs API routes with one declarative policy, and prove it with an offline harness that runs the real route handlers.
in_short: Make one clear set of rules for who may read what on LixBlogs, and build tests that prove private posts stay private.
skills:
  - JavaScript and Node
  - SQL
  - Next.js route handlers
  - Test design
  - Cloudflare D1 (helpful)
related_issues:
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
private-organisation item separately in each of its ~135 API routes. The same
SQL filter is copied about 100 times, and there is no shared `canRead` rule.

In October 2026 that duplication led to a cluster of privacy-leak reports,
linked under Material. Nothing prevents the next one. There are no
route-level tests: the 47 existing tests stub the database by hand.

**Impact.** LixBlogs holds content that must remain private: drafts, secret
posts and posts in private organisations. One shared policy, tested against
the real route handlers, makes this class of defect much harder to
reintroduce and protects everyone who writes on LixBlogs.

## Expected outcomes

- One declarative read-access policy covering each type of viewer and each
  content state, with shared query rules derived from it.
- A harness that runs the real route handlers against a local SQLite or D1
  database built from `migrations/`, with no secrets, a fake session and a
  fixture "world".
- A generated route inventory, plus a CI check that fails when a route is
  left unclassified.
- High-risk read routes migrated to the shared policy (cap agreed in the
  proposal).

## Stretch goals

- Property-based fixtures.
- Differential checks: a list endpoint never returns an item that the
  single-item endpoint refuses.

## Out of scope

- Fixing unrelated bugs.
- Building UI.
- Testing against production.
- Changing the auth provider.

## How success is measured

- Reverting the October fix commits makes the suite fail.
- 100% of routes are classified.
- CI needs no secrets.

## Warm-up tasks

1. Set up LixBlogs locally from the README and run the existing tests in
   `tests/`. Set up from the README; no private keys needed. If a step asks
   for a secret, report it as a setup issue; see
   [configuration and access](/contributor-guide/#configuration-and-access).
2. Read the related issues linked under Material, identify the route each one
   touches, and summarise the cause in your own words. Send the summary to
   [gsoc@elixpo.com](mailto:gsoc@elixpo.com).
3. Read `migrations/` and the existing tests in `tests/`, and describe how data
   and tests are structured today.
4. Open a small documentation or test improvement pull request in the repository, and respond to review until it is merged or closed.

## Terms used on this page

- **Read-access policy**: the rules that decide who may read a piece of
  content.
- **Declarative**: the rules are written down once, in one place, instead of
  being repeated as code in many places.
- **API route, route handler**: a server address that the website or an app
  calls, and the code that answers it.
- **SQL filter**: the part of a database query that decides which rows to
  return.
- **Stub**: a hand-written fake that stands in for a real part, such as the
  database, in a test.
- **Harness, conformance harness**: a set of automated tests that runs the
  real code and checks that it follows the rules.
- **Offline**: runs on your own computer, with no online services or secrets.
- **SQLite, Cloudflare D1**: small databases. D1 is a hosted database service
  from Cloudflare, based on SQLite.
- **Migrations** (`migrations/`): files that create and change the database
  tables, step by step.
- **Fake session, fixture "world"**: a pretend signed-in user and a small,
  made-up set of users, posts and organisations, used in tests.
- **Route inventory, unclassified route**: a generated list of every route,
  and a route that has not yet been given an access rule.
- **CI**: tests that run automatically on every proposed change.
- **Property-based fixtures**: test data generated automatically, to find
  cases a person might not think of.
- **Differential checks**: comparing two parts of the system that should
  agree, here a list and a single item.
