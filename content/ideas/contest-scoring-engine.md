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
summary: Build a deterministic engine that turns GitHub events into explainable, reproducible contest points that are hard to game.
in_short: Build the part of Elixpo Open Source that turns GitHub activity into contest points, in a way anyone can check and that is hard to cheat.
skills:
  - TypeScript
  - Test design
  - GitHub event semantics
related_issues: []
---

## Description

Elixpo Open Source is the platform Elixpo is building to run open-source
contests and mentorship programmes. Its points ledger schema and written
scoring policy exist, but no engine connects them, and the leaderboard is
mock data.

Contest hosts need points that are reproducible, explainable and hard to
game.

**Impact.** A fair contest requires that every participant can see why they
received their points, that recalculating the scores gives the same result,
and that points cannot be earned through tricks.

## Expected outcomes

- Contest points come from one deterministic engine: the same GitHub events
  always give the same ledger, and every entry says which rule and which
  events produced it.
- Common tricks for earning points are caught and shown openly, with a
  reason, instead of being silently counted or dropped.
- Anyone can replay recorded events and check the scores for themselves.

## Stretch goals

- Schema validation and versioning for the rules configuration.
- More anti-gaming rules (trivial diffs, PR splitting, unlinked PRs).
- A readable explanation report for every ledger entry.
- A dry-run diff showing who moves when a rule changes.
- A D1 adapter.
- Tie-breakers.

## Out of scope

- Webhook ingestion.
- The GitHub App.
- UI.
- Payouts, prizes or any link between points and money.

## How success is measured

- The engine is pure and is driven by a small typed rules configuration,
  not a free-form DSL. Idempotency keys stop an event from counting twice.
- Two anti-gaming rules (for example self-merge and bot actors) each produce
  an explicit "held" or "denied" entry with a reason.
- A replay CLI runs recorded webhook fixtures through the engine.
- 10 or more fixture scenarios with golden outputs.
- Two replays produce byte-identical output.
- Every point traces back to its events and the rule that awarded it.

## Warm-up tasks

1. Set up Elixpo Open Source locally from the README.
2. Locate the points ledger schema and the written scoring policy in the
   repository, and note where they disagree or leave gaps.
3. Read GitHub's
   [webhook event documentation](https://docs.github.com/en/webhooks/webhook-events-and-payloads)
   for pull requests and reviews, and summarise which events the engine would
   need in your own words.
4. Open a small documentation or test improvement pull request in the repository, and respond to review until it is merged or closed.

## Terms used on this page

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
