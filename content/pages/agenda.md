---
title: Our agenda
description: Why Elixpo takes part in Google Summer of Code 2027: what we build in public, how we approve contributions and our commitments to contributors.
heading: Our *agenda*
lead: Elixpo takes part in Google Summer of Code to help one contributor become the supported owner of one part of a real project. This page sets out what Elixpo is, what it ships in public, how it decides what to approve, and what it commits to contributors.
tldr:
  - Elixpo is an open-source project foundry: build in public, release as a project.
  - Our aim: one contributor who becomes the supported owner of one part of one codebase.
  - The ideas belong to five codebases released as hosted services, npm packages and a Debian package.
  # TODO: Update to 'participating projects have no paid plans' after the pricing-removal PRs merge.
  - No Google Summer of Code idea involves payments, pricing or paid features.
  - Two mentors, human review, and replies within 48 hours on weekdays.
  - [Browse the six project ideas](/ideas/).
next:
  - /contributor-guide/
  - /ideas/
  - /about/
---

## What Elixpo is

In its own words, Elixpo is "an open-source project foundry where people
build in public and release meaningful projects together." Its public line is
"Build in public. Release as a project."

> Elixpo works with active maintainers to build and release open software,
> reproducible research, and publicly operated services. Time-bounded
> Chapters give work a clear public story, prepared contribution pathways,
> accountable review, and a durable release record. Successful projects may
> continue as Elixpo Member Projects.

Source: [elixpo.com](https://elixpo.com) and the
[Elixpo portal README](https://github.com/elixpo/elixpo).

## What we want Google Summer of Code to achieve

Short contributions bring people into open source, but they rarely turn
newcomers into maintainers. Our aim for Google Summer of Code is the longer
path:

**newcomer → first contribution → understands one part of a project →
designs and ships it with review → helps review others → keeps it running**

In 2027 that means one contributor who becomes the supported owner of one
part of one codebase: with two mentors, results that can be measured, and an
invitation to keep reviewing and maintaining that part after the programme.

## What we ship in public

The ideas belong to five codebases, described on the
[projects page](/projects/):

- **LixBlogs**, hosted at [blogs.elixpo.com](https://blogs.elixpo.com).
- **LixSketch**, hosted at [sketch.elixpo.com](https://sketch.elixpo.com).
- **Crumb**, packaged in Debian
  ([package tracker](https://tracker.debian.org/pkg/crumb)) and in the Elixpo
  APT repository at [packages.elixpo.com](https://packages.elixpo.com).
- **Elixpo Open Source**, in development at
  [opensource.elixpo.com](https://opensource.elixpo.com).
- **Oreo**, with its operating system and hardware files on
  [GitHub](https://github.com/elixpo/oreo).

Packages released on npm, as listed by the registry in October 2026:

| Package | What it is | Version | Licence |
|---|---|---|---|
| [@elixpo/lixblogs-cli](https://www.npmjs.com/package/@elixpo/lixblogs-cli) | Command-line tool for LixBlogs | 1.8.0 | MIT |
| [@elixpo/lixeditor](https://www.npmjs.com/package/@elixpo/lixeditor) | Block editor and renderer used by LixBlogs | 2.8.12 | MIT |
| [@elixpo/lixsketch](https://www.npmjs.com/package/@elixpo/lixsketch) | Whiteboard engine and canvas component of LixSketch | 5.6.14 | MIT |
| [@elixpo/accounts](https://www.npmjs.com/package/@elixpo/accounts) | OAuth and OpenID Connect SDK for Elixpo Accounts | 1.1.0 | MIT |

## How we decide what to approve

**Contributions.** The project governance documents
([Elixpo](https://github.com/elixpo/elixpo/blob/main/GOVERNANCE.md),
[LixBlogs](https://github.com/elixpo/blogs.elixpo/blob/main/GOVERNANCE.md))
set out how changes are accepted:

- Maintainers review contributions, manage releases and decide what is
  merged. Project maintainers keep authority over their own repositories.
- Material changes begin with an issue or discussion when early agreement
  would prevent wasted work.
- Review matches the risk of the change. Passing automated checks is
  evidence, not approval to merge.
- Changes to security, privacy, authentication, payments, moderation,
  migrations, package publication or deployment require a maintainer with
  access to the affected system.
- Organisation-level changes, such as licensing, contributor attribution or
  sponsorship policy, go through a reviewable pull request with primary
  evidence. Automated checks may detect problems but do not make these
  decisions.
- Contributor credit points to attributable work such as merged changes,
  reviews, releases and documentation. Commit count alone is not a rank.

**Project ideas.** Each idea for 2027 had to meet four rules:

- **One problem per idea**, in one codebase, with what is in and out of scope
  written down.
- **Two mentors per idea**: a primary mentor and a backup mentor.
- **Proof, not promises**: every idea states how success is measured,
  usually with tests that anyone can run.
- **No private keys**: every project can be set up from its public
  repository.

**Proposals.** Mentors assess every proposal against the published
[selection criteria](/selection/).

## Money and commercial interests

<!-- TODO: Update to 'participating projects have no paid plans' after the pricing-removal PRs merge. -->

- Elixpo does not sell anything through this programme. No Google Summer of
  Code idea involves payments, pricing or paid features; the contest-scoring
  idea lists payouts as out of scope.
- The source code of the participating projects is published under the MIT
  licence. Project names, published package names and the official hosted
  deployments are reserved to Elixpo, as each repository's `NOTICE` file
  records.
- Some hosted Elixpo services, including blogs.elixpo.com and
  sketch.elixpo.com, offer optional paid plans. Google Summer of Code work
  does not involve them.
- Elixpo does not currently solicit, accept, hold or route organisation-level
  sponsorship funds. See the
  [community partnership programme](https://elixpo.com/partnerships).

## Care for contributors

- **Human review.** Mentors review all work personally and make every
  decision.
- **Timely replies.** Mentors aim to reply within 48 hours on weekdays.
- **Two mentors.** Every idea has a primary and a backup mentor, so that the
  contributor always has support.
- **Credit.** Elixpo publishes contribution records for attributable public
  work at [elixpo.com/contributors](https://elixpo.com/contributors).
- **Conduct.** Everyone follows the [Code of Conduct](/code-of-conduct/), and
  reports are handled privately.
- **Published commitments.** Every mentor and administrator signs the
  commitments on the [agreements page](/agreements/).
- **After the summer.** The contributor is invited to keep reviewing and
  maintaining the part they built.

[How we run the programme](/operations/) sets out these commitments in
detail: the weekly cadence, mentor cover, evaluations, escalation and what
happens after the programme.
