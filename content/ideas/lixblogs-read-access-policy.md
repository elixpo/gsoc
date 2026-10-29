---
title: LixBlogs read-access policy and offline conformance harness
slug: lixblogs-read-access-policy
order: 1
theme: Security
size_hours: 175
difficulty: Intermediate–Hard
primary_mentor: divyanshuj91
backup_mentor: ez-vivek
repository: https://github.com/elixpo/blogs.elixpo
setup: https://github.com/elixpo/blogs.elixpo/blob/main/README.md
env_example: https://github.com/elixpo/blogs.elixpo/blob/main/.env.example
summary: Replace read-access checks copied across LixBlogs API routes with one declarative policy, and prove it with an offline harness that runs the real route handlers.
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

## Problem

LixBlogs decides who can read a post, draft, secret post or
private-organisation item separately in each of its ~135 API routes. The same
SQL filter is copied about 100 times, and there is no shared `canRead` rule.

In October 2026 that duplication led to a cluster of privacy-leak reports
(linked below). Nothing stops the next one. There are no route-level tests:
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
2. Read the issues linked below and find the route each one touches.
3. Look at `migrations/` and the existing tests in `tests/` to see how data
   and tests are structured today.
4. Make a small, reviewed contribution to the repository, then say hello in
   GitHub Discussions with what you learned.
