---
title: Explainable contest-scoring engine for Elixpo Open Source
slug: contest-scoring-engine
order: 4
theme: Community, data
size_hours: 90
difficulty: Intermediate
primary_mentor: divyanshuj91
backup_mentor: Circuit-Overtime
repository: https://github.com/elixpo/opensource.elixpo
setup: https://github.com/elixpo/opensource.elixpo/blob/main/README.md
env_example: null
summary: Build a deterministic engine that turns GitHub events into explainable, reproducible contest points that are hard to game.
skills:
  - TypeScript
  - Test design
  - GitHub event semantics
related_issues: []
---

## Problem

Elixpo Open Source is the platform Elixpo is building to run open-source
contests and mentorship programmes. Its points ledger schema and written
scoring policy exist, but no engine connects them, and the leaderboard is
mock data.

Contest hosts need points that are reproducible, explainable and hard to
game.

## Expected outcomes

- A typed, versioned rules configuration with schema validation, not a
  free-form DSL.
- A deterministic, pure engine that turns normalised GitHub events into
  ledger entries with idempotency keys.
- Two or three anti-gaming rules (for example self-merge, bot actors,
  trivial diffs), each producing an explicit "held" or "denied" entry with a
  reason.
- A replay CLI using recorded webhook fixtures.
- An explanation trace for every ledger entry.

## Stretch goals

- More anti-gaming rules (PR splitting, unlinked PRs).
- A dry-run diff showing who moves when a rule changes.
- A D1 adapter.
- Tie-breakers.

## Not in scope

- Webhook ingestion.
- The GitHub App.
- UI.
- Payouts.

## Proof of success

- 20 or more fixture scenarios with golden outputs.
- Two replays produce byte-identical output.
- Every point traces back to its events and the rule that awarded it.

## How to start

1. Set up Elixpo Open Source locally from the README.
2. Find the points ledger schema and the written scoring policy in the
   repository, and note where they disagree or leave gaps.
3. Read GitHub's webhook event documentation for pull requests and reviews.
4. Make a small, reviewed contribution to the repository, then share your
   notes in GitHub Discussions.
