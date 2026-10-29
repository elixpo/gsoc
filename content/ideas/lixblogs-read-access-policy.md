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
env_example: https://github.com/elixpo/blogs.elixpo/blob/main/.env.example
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

## Why this matters

LixBlogs has content that is meant to be private: drafts, secret posts and
posts inside private organisations. Today, each part of the code checks on its
own who may see that content. In October 2026, several reports showed that
some of those checks were wrong.

One shared set of rules, with tests that run the real code, makes this kind
of mistake much harder to repeat. It protects the privacy of everyone who
writes on LixBlogs.

## Problem

LixBlogs decides who can read a post, draft, secret post or
private-organisation item separately in each of its ~135 API routes. The same
SQL filter is copied about 100 times, and there is no shared `canRead` rule.

In October 2026 that duplication led to a cluster of privacy-leak reports
(listed under "Related issues" on this page). Nothing stops the next one. There are no route-level tests:
the 47 existing tests stub the database by hand.

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

## Not in scope

- Fixing unrelated bugs.
- Building UI.
- Testing against production.
- Changing the auth provider.

## Proof of success

- Reverting the October fix commits makes the suite fail.
- 100% of routes are classified.
- CI needs no secrets.

## How to start

1. Set up LixBlogs locally from the README and `.env.example`. You should not
   need any production secret. If you do, tell us in Discussions: that is a
   bug we want to fix.
2. Read the issues listed under "Related issues" and find the route each one touches.
3. Look at `migrations/` and the existing tests in `tests/` to see how data
   and tests are structured today.
4. Make a small, reviewed contribution to the repository, then say hello in
   GitHub Discussions with what you learned.

## Words used on this page

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
