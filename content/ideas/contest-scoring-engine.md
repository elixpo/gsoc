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
in_short: Build the part of Elixpo Open Source that turns GitHub activity into contest points, in a way anyone can check and that is hard to cheat.
skills:
  - TypeScript
  - Test design
  - GitHub event semantics
related_issues: []
---

## Why this matters

Elixpo Open Source will run contests in which people earn points for
contributing to open source. For a contest to be fair, everyone must be able
to see why they got their points, get the same result when the scores are
worked out again, and not be able to earn points with tricks.

Today the leaderboard shows made-up data, because the part that calculates
the points does not exist yet.

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

## Words used on this page

- **Scoring engine**: the code that calculates points.
- **Ledger, ledger entry**: a list of every point awarded, and one line in
  it.
- **Schema**: a formal description of what data must look like.
- **Leaderboard**: the ranked list of contest participants.
- **Deterministic, pure**: the same input always gives exactly the same
  output, and nothing else is changed.
- **DSL**: a domain-specific language, a small custom programming language.
  This idea asks for typed settings instead.
- **GitHub events, webhooks**: messages GitHub sends when something happens,
  such as a pull request being merged.
- **Normalised**: converted into one standard shape.
- **Idempotency key**: a unique label that stops the same event from being
  counted twice.
- **Anti-gaming rules**: rules that stop people earning points with tricks.
- **Replay CLI**: a command-line tool that runs saved events through the
  engine again.
- **Fixtures, golden outputs**: saved example inputs, and the exact results
  they should produce.
- **Byte-identical**: exactly the same, down to the last character.
- **D1**: a hosted database service from Cloudflare.
- **Tie-breakers**: rules that decide the order when two people have the
  same score.
