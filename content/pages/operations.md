---
title: How we run the programme
description: How Elixpo runs Google Summer of Code 2027: each phase, weekly check-ins and reports, mentor cover, evaluations, escalation and life after the programme.
heading: How we run *the programme*
lead: This page sets out how Elixpo will run Google Summer of Code 2027 from selection to the end of the programme and after it. These are our commitments, based on Google's published responsibilities for organisations, mentors and contributors. We will follow them for every contributor.
tldr:
  - One contributor, two mentors: the primary mentor leads and the backup mentor takes over during any absence.
  - Every week: a call with the primary mentor, at least one more written exchange, and a short public progress report.
  - If work falls behind, we say so early, in writing, and agree a recovery plan before any evaluation.
  - Escalation runs from the primary mentor to the backup mentor, the organisation administrators, then Google.
  - Questions and concerns: [gsoc@elixpo.com](mailto:gsoc@elixpo.com).
  - [Browse the six project ideas](/ideas/).
next:
  - /mentors/
  - /contributor-guide/
  - /timeline/
---

## Who does what

| Role | People | Responsible for |
|---|---|---|
| Primary mentor | Named on each [idea page](/ideas/) | Planning the work with the contributor, the weekly check-in, review of every pull request, and the Google evaluations |
| Backup mentor | Named on each idea page | Reading every weekly report, joining reviews, and taking over whenever the primary mentor is away |
| Organisation administrators | Ayushman Bhattacharya (lead) and Vivek Yadav | Communication with Google, deadlines, evaluation oversight, mentor cover, and any concern a contributor raises |
| Programme coordinator | Anwesha Chakraborty | Programme questions at gsoc@elixpo.com, onboarding sessions and the public weekly progress log; does not mentor or review code |

Every mentor and administrator signs the same one-page commitment.
{{commitment-status}} The people are listed on the
[mentors page](/mentors/).

## The programme, phase by phase

Google sets the dates for every phase; see the official
[Google Summer of Code timeline](https://developers.google.com/open-source/gsoc/timeline)
and our [timeline page](/timeline/).

1. **Applications and selection.** Mentors answer applicants' questions
   through [gsoc@elixpo.com](mailto:gsoc@elixpo.com), comment on draft
   proposals and review warm-up pull requests. They read every proposal
   against the published [selection criteria](/selection/), and we talk to
   every shortlisted applicant on a call before ranking. We never select on
   the proposal alone. A mentor who knows an applicant personally declares it
   and steps away from that ranking decision.
2. **Community bonding.** The organisation administrators send a welcome
   email covering the Code of Conduct, how to reach the administrators, the
   communication channels and the project's licence. The contributor meets
   both mentors on an introductory call, sets up the project, and agrees a
   written plan with them: milestones, a midterm checkpoint, the weekly
   schedule, availability and planned absences. The contributor and both
   mentors sign off the plan early in the bonding period.
3. **Coding.** The contributor works in small, reviewable pull requests to
   the project's main repository, so that work is merged as it goes rather
   than at the end. The weekly cycle below applies throughout. If the
   contributor is well ahead of or behind the plan, the mentors and the
   contributor rescope it together and record the change in the plan.
4. **Midterm evaluation.** The primary mentor completes Google's midterm
   evaluation, measured against the milestones agreed in the plan.
5. **Final evaluation.** The contributor submits their final work and
   Google's evaluation; the primary mentor completes the final evaluation.
   Mentors help the contributor prepare a final work summary that links the
   merged pull requests, tests and documentation, and lists what remains.
6. **After the programme.** Open tasks are filed as issues, remaining work
   is either merged or documented, and the contributor is invited to stay on.
   See [After the programme](#after-the-programme).

## Communication

- **Weekly one-to-one.** The contributor and the primary mentor hold a call
  every week at a time agreed in the plan. The backup mentor joins at least
  every other week.
- **At least twice a week.** Besides the call, the mentor and contributor
  exchange at least one written update each week, so they are in contact at
  least twice a week, as Google asks of mentors.
- **Weekly progress report.** Each week the contributor posts a short public
  report (template below) on the tracking issue for their project, in the
  project's repository. The programme coordinator links each report in the
  public weekly progress log.
- **Technical discussion in public.** Design questions and review happen in
  issues and pull requests in the project's repository, so that other
  maintainers can follow and help. Private matters go to
  [gsoc@elixpo.com](mailto:gsoc@elixpo.com).
- **Response times.** Mentors aim to reply within 48 hours on weekdays,
  including first review of a pull request. The organisation administrators
  acknowledge any concern within two working days.
- **Raising a blocker.** Name the blocker in the weekly report and tell the
  primary mentor straight away; do not wait for the next call. If there is no
  reply within 48 hours on weekdays, write to the backup mentor, then to
  [gsoc@elixpo.com](mailto:gsoc@elixpo.com).

GitHub Discussions for GSoC 2027 will open once Google announces the
programme dates. Until then, the programme email is the channel for
questions.

### Weekly progress report template

```text
Week N - <idea title>

Done this week
- <what was finished, with links to pull requests or issues>

Next week
- <what you plan to do>

Blockers
- <anything stopping you, and what help you need; or "None">

Plan status
- On track / ahead / behind (one sentence on why)
```

## Mentor operations

- **Primary mentor.** Plans the work with the contributor, holds the weekly
  call, reviews every pull request personally, keeps the plan up to date and
  completes Google's evaluations.
- **Backup mentor.** Knows the same codebase, reads every weekly report,
  joins reviews and takes over the primary mentor's duties during any
  absence, so that the contributor never waits for a reviewer.
- **Absence cover.** A mentor tells the contributor, the other mentor and the
  organisation administrators in advance of any absence of two working days
  or more. The backup mentor takes over the weekly call and reviews for that
  period. If both mentors are unavailable, an organisation administrator
  checks in with the contributor and arranges cover.
- **Review standards.** Mentors review all work personally; automated checks
  are evidence for a review, not a replacement for it. Review comments are
  written, specific and explain what to change. Use of AI tools follows the
  [AI policy](/ai-policy/).
- **Notes for evaluations.** Mentors keep brief private notes after each
  weekly call: progress against the plan, communication, and any concern
  raised. Evaluations are based on these notes and on the public record, not
  on memory.
- **Availability.** Mentors tell the organisation administrators early if
  their capacity will drop, so that cover can be arranged.

## Capacity and cover

<!-- shared: capacity-and-cover -->

## Configuration and access

<!-- shared: configuration-and-access -->

## Evaluations

- **Who completes them.** The primary mentor completes Google's midterm and
  final evaluations after agreeing the result with the backup mentor. The
  organisation administrators make sure each evaluation is submitted at least
  36 hours before Google's deadline and complete it themselves, under
  Google's process, if a mentor cannot. If the mentors disagree, the
  organisation administrators decide.
- **What they are based on.** Progress against the milestones agreed in the
  written plan; communication, including the weekly reports and calls; and
  the code, tests and documentation merged or ready for review.
- **Early warning.** If a contributor falls behind, the primary mentor raises
  it at once: first in conversation, then in writing to the contributor with
  the administrators copied. Together we adjust the scope where that is
  reasonable and agree a written recovery plan with dated steps. A
  contributor at risk of not passing is told so in advance and in writing,
  never through the evaluation itself.
- **Google's rules.** Elixpo follows Google's rules on evaluations,
  including that a contributor who does not pass an evaluation leaves the
  programme, and Google's guidance that mentors talk to the administrators
  and the contributor before any decision not to pass. See Google's
  [responsibilities for mentors and administrators](https://developers.google.com/open-source/gsoc/help/responsibilities),
  the mentor guide on
  [evaluations](https://google.github.io/gsocguides/mentor/evaluations) and
  the [programme rules](https://summerofcode.withgoogle.com/rules).
- **Extensions.** If the plan needs more time, the contributor, mentors and
  an administrator may agree an extension within Google's limits, entered
  before Google's deadline for changes.

## Escalation and conduct

If something is not working, raise it in this order, moving on when a step
does not resolve it:

1. **The primary mentor.**
2. **The backup mentor.**
3. **The organisation administrators**, Ayushman Bhattacharya (lead) and
   Vivek Yadav, at [gsoc@elixpo.com](mailto:gsoc@elixpo.com).
4. **Google's programme administrators**, at
   [gsoc-support@google.com](mailto:gsoc-support@google.com), if a concern
   cannot be resolved within Elixpo.

Code of Conduct reports go to [gsoc@elixpo.com](mailto:gsoc@elixpo.com) and
are handled privately, as the [Code of Conduct](/code-of-conduct/) page
describes. If a report or concern involves one of the organisation
administrators, write directly to the other administrator, using the
addresses on the [mentors page](/mentors/). Violations of Google's
programme rules, such as plagiarism or harassment, are reported to Google by
the organisation administrators, as Google requires.

## After the programme

- **An invitation to stay.** The contributor is invited to continue as a
  reviewer and maintainer of the part of the project they built, with the
  same mentors available for questions.
- **Follow-up.** An organisation administrator contacts the contributor
  about 30 days and about 90 days after the programme ends, to ask what they
  are working on, what support would help, and what we should change.
- **Credit.** Elixpo publishes contribution records for attributable public
  work at [elixpo.com/contributors](https://elixpo.com/contributors), each
  with a stable record ID and links to its evidence. Work from the programme
  is credited there on the same basis.
- **Unfinished work.** Open tasks are filed as issues and known defects are
  recorded, so that the work can continue with or without the contributor.

## What we publish

After the final evaluations, Elixpo will publish an honest retrospective on
this site: what was planned, what was merged, what was not finished and why,
and what we will change next time. It will not include the contents of
evaluations or anything the contributor asks to keep private. The weekly
progress reports and the merged work remain public in the project's
repository.

## What this is based on

- Google:
  [Responsibilities of participants](https://developers.google.com/open-source/gsoc/help/responsibilities),
  [tips for organisation administrators](https://developers.google.com/open-source/gsoc/help/oa-tips)
  and the [mentor guide](https://google.github.io/gsocguides/mentor/).
- The practice of established organisations, including the
  [Wikimedia mentor guidance](https://www.mediawiki.org/wiki/Google_Summer_of_Code/Mentors)
  (weekly check-ins and documenting open work at the end of the programme).
