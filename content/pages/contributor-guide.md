---
title: Contributor guide
description: Get started with Elixpo for Google Summer of Code 2027: why contribute, what each project does and a step-by-step path from first contribution to proposal.
heading: Getting *started*
lead: This guide is for anyone who wants to contribute to Elixpo through Google Summer of Code 2027. It explains what Elixpo offers, what each project is for, and the steps from choosing an idea to what happens after selection.
tldr:
  - Elixpo is an open-source project foundry where people build in public and release projects together. Read [our agenda](/agenda/).
  - We offer a real project used in public, two mentors on every idea, review by people, and credit for attributable work.
  - The steps: choose an idea, set it up, complete a warm-up task, introduce yourself, make a small pull request, then write your proposal.
  - Write to [gsoc@elixpo.com](mailto:gsoc@elixpo.com). GitHub Discussions for GSoC 2027 will open once Google announces the programme dates.
  - Submit your final proposal on the [official GSoC website](https://summerofcode.withgoogle.com/). Proposals sent anywhere else are not considered.
next:
  - /ideas/
  - /proposal/
  - /agenda/
---

## Why contribute to Elixpo

- **Real projects, used in public.** Every idea belongs to a codebase that
  Elixpo operates or releases publicly, as a hosted service, an npm package or
  a Debian package. The [projects page](/projects/) lists them.
- **Two mentors on every idea.** A primary mentor is your main contact; a
  backup mentor knows the project and can step in.
- **Review by people.** Mentors review all work personally. Automated checks
  are evidence for a review, not a replacement for it.
- **Credit for your work.** Elixpo publishes contribution records for
  attributable public work at
  [elixpo.com/contributors](https://elixpo.com/contributors), each with a
  stable record ID and links to its evidence. Credit points to work such as
  merged changes, reviews, releases and documentation; commit count alone is
  not the measure.
- **A path beyond the summer.** The contributor is invited to keep reviewing
  and maintaining the part they built.

## What each project is for

- **[LixBlogs](/projects/#lixblogs)** is a collaborative blogging platform
  with an API and a command-line tool, where many publications run on one
  deployment. Ideas: [read-access policy](/ideas/lixblogs-read-access-policy/)
  and [CLI automation contract](/ideas/lixblogs-cli-contract/).
- **[LixSketch](/projects/#lixsketch)** is an end-to-end encrypted canvas for
  sketches, diagrams and documents. Idea:
  [accessible canvas](/ideas/accessible-lixsketch-canvas/).
- **[Crumb](/projects/#crumb)** is a self-hosted agent harness and
  natural-language terminal, written in Rust, that controls what AI agents
  may do. Idea: [connector contract](/ideas/crumb-connector-contract/).
- **[Elixpo Open Source](/projects/#elixpo-open-source)** is a platform, in
  development, for running open-source contests and mentoring programmes.
  Idea: [contest-scoring engine](/ideas/contest-scoring-engine/).
- **[Oreo](/projects/#oreo)** is an open MicroPython operating system and
  hardware design for an ESP32-S3 conference badge. Idea:
  [desktop simulator](/ideas/oreo-badge-simulator/).

## Step by step

1. **Read the ideas and choose one or two.** Read the [ideas list](/ideas/)
   and each idea page in full: the problem, expected outcomes, out-of-scope
   items and how success is measured. *Why:* a proposal must answer one
   idea's problem. *Done when:* you can explain the problem in your own words.
2. **Set up the project locally.** Follow the [warm-up page](/warm-up/) for
   your project: it gives the exact commands from the repository, how to tell
   they worked and any known limitations. No private keys needed: you do not
   need any Elixpo key, password, account or paid service to build the code
   and run the tests for your idea; see
   [configuration and access](#configuration-and-access). *Why:* every later
   step depends on a working setup. *Done when:* the project builds and its
   tests run. If a step asks for a secret, report it as a setup issue: it is
   a defect in our instructions, and fixing it is a valid first contribution.
3. **Complete a warm-up task.** Each idea page lists warm-up tasks, and the
   [warm-up page](/warm-up/) links them for each project. *Why:* it
   shows you how the code is organised and gives mentors evidence of your
   work. *Done when:* you have finished one task and recorded what you
   learned.
4. **Introduce yourself.** Write to
   [gsoc@elixpo.com](mailto:gsoc@elixpo.com) with the idea you intend to
   apply for, your background and a link to your warm-up work. GitHub
   Discussions for GSoC 2027 will open once Google announces the programme
   dates. Use the programme address rather than mentors' personal accounts,
   so that every message reaches both mentors on the idea. *Done when:* a
   mentor has replied.
5. **Make a first small pull request and respond to review.** Fix a small
   defect, add a test or improve the documentation in the repository for
   your idea. State what you changed and how you tested it, and disclose
   meaningful use of AI tools as the [AI policy](/ai-policy/) requires.
   *Why:* review is how mentors and contributors work together. A small,
   finished, reviewed change carries more weight than a large unfinished one.
   *Done when:* the pull request is merged or closed after review.
6. **Draft your proposal and share it early.** Use the
   [proposal template](/proposal/) and read the
   [selection criteria](/selection/). Send the draft to
   [gsoc@elixpo.com](mailto:gsoc@elixpo.com) so that the mentors can comment
   on it. *Done when:* you have revised the draft after feedback.
7. **Submit on the official GSoC website before the deadline.** Read the
   [Google Summer of Code rules](https://summerofcode.withgoogle.com/rules)
   and Google's
   [contributor guide](https://google.github.io/gsocguides/student/). Google
   sets eligibility, the number of proposals you may submit and the deadline;
   see the [timeline](/timeline/). *Done when:* your final proposal appears on
   the [official GSoC website](https://summerofcode.withgoogle.com/).
8. **What happens next.** Mentors read every proposal and interview
   shortlisted applicants; Google allocates contributor slots and announces
   the results. A selected contributor then meets the mentors in the
   community bonding period, agrees milestones and a communication plan, and
   starts coding. Mentors complete Google's evaluations at the midterm and at
   the end of the programme; [How we run the programme](/operations/) sets
   out the weekly cadence and how evaluations work. If you are not selected,
   your merged work remains part of the project and you are welcome to keep
   contributing.

## Configuration and access

<!-- shared: configuration-and-access -->

## What we expect from you

- **Ownership.** You are responsible for your work and your communication;
  respect the time of reviewers and other applicants.
- **Careful work.** Review your own pull request before asking for review,
  keep changes focused, and test what you submit.
- **Clear communication.** Ask specific questions, report progress regularly,
  and tell your mentors early when you are blocked or your availability
  changes.
- **Honesty.** Write your own proposal, disclose meaningful use of AI tools,
  and never claim work or results that do not exist.
- **Conduct.** Follow the [Code of Conduct](/code-of-conduct/) in every
  Elixpo space.

## What you can expect from us

- **Timely replies.** Mentors aim to reply within 48 hours on weekdays.
- **Two mentors.** A primary and a backup mentor on every idea, so that you
  always have support.
- **Honest feedback.** Written review on your pull requests and comments on
  your draft proposal.
- **Human decisions.** Mentors review all work personally and make every
  decision.
- **Published commitments.** Every mentor and administrator signs the
  commitments published on the [agreements page](/agreements/).

## Communication channels

| Purpose | Channel |
|---|---|
| Questions about an idea or the code | [gsoc@elixpo.com](mailto:gsoc@elixpo.com) |
| Defects and setup problems | An issue in the relevant repository |
| Programme questions and private matters | [gsoc@elixpo.com](mailto:gsoc@elixpo.com) |
| Code of Conduct reports | The [Code of Conduct](/code-of-conduct/) reporting steps |

GitHub Discussions for GSoC 2027 will open once Google announces the
programme dates. Until then, write to
[gsoc@elixpo.com](mailto:gsoc@elixpo.com).

If you have not received a reply within 48 hours on weekdays, send a reminder
in the same email thread.
