<p align="center">
  <img src="public/elixpo-logo.png" width="96" alt="Elixpo logo: the Oreo panda" />
</p>

<h1 align="center">Elixpo · Google Summer of Code 2027</h1>

<p align="center">
  <strong>Learn open source by working on a real project, with two mentors beside you.</strong><br/>
  <a href="https://gsoc.elixpo.com">gsoc.elixpo.com</a> ·
  <a href="https://gsoc.elixpo.com/ideas/">Project ideas</a> ·
  <a href="https://gsoc.elixpo.com/contributor-guide/">Get involved</a> ·
  <a href="https://github.com/orgs/elixpo/discussions">Discussions</a> ·
  <a href="mailto:gsoc@elixpo.com">gsoc@elixpo.com</a>
</p>

---

## About

This repository is the home of Elixpo's Google Summer of Code (GSoC)
programme. It holds everything a prospective contributor needs to read before
applying: the project ideas, the projects they belong to, how to get involved,
how to write a proposal, how we select contributors, our AI policy and the
people who mentor.

**Status:** Elixpo is applying to be a mentoring organisation for Google Summer
of Code 2027. Google announces accepted organisations after the application
period. In 2027 we expect to mentor one contributor.

## Direction

Short contributions bring people into open source, but they rarely turn
newcomers into maintainers. Our aim for GSoC is the longer path:

> **newcomer → first contribution → understands one part of a project →
> designs and ships it with review → helps review others → keeps it running**

Everything in this programme is built around that path:

- **One problem per idea.** Each idea is one clear problem in one codebase,
  with what is in and out of scope written down.
- **Two mentors per idea.** A primary mentor is the main contact; a backup
  mentor knows the project and can step in.
- **Proof, not promises.** Every idea says how success is measured, usually
  with tests anyone can run.
- **No private keys.** Every project can be set up from its public repository.
- **Ownership after the summer.** The contributor is invited to keep reviewing
  and maintaining the part they built.

## Project ideas

| # | Idea | Project | Theme | Size | Difficulty |
|---|---|---|---|---|---|
| 1 | [LixBlogs read-access policy and offline conformance harness](https://gsoc.elixpo.com/ideas/lixblogs-read-access-policy/) | LixBlogs | Security | 175 h | Hard |
| 2 | [Accessible LixSketch canvas](https://gsoc.elixpo.com/ideas/accessible-lixsketch-canvas/) | LixSketch | Accessibility | 175 h | Intermediate |
| 3 | [Crumb connector contract and offline conformance kit](https://gsoc.elixpo.com/ideas/crumb-connector-contract/) | Crumb | Rust, agent security | 175 h | Hard |
| 4 | [Explainable contest-scoring engine](https://gsoc.elixpo.com/ideas/contest-scoring-engine/) | Elixpo Open Source | Community, data | 90 h | Intermediate |
| 5 | [Oreo badge desktop simulator](https://gsoc.elixpo.com/ideas/oreo-badge-simulator/) | Oreo | Embedded, open hardware | 175 h | Intermediate |
| 6 | [LixBlogs CLI automation contract v1](https://gsoc.elixpo.com/ideas/lixblogs-cli-contract/) | LixBlogs | Developer tools | 90 h | Easy |

The full descriptions, warm-up tasks and mentors are on
[gsoc.elixpo.com/ideas](https://gsoc.elixpo.com/ideas/). The source text is in
[`content/ideas/`](content/ideas/).

## Participating projects

| Project | What it is | Repository |
|---|---|---|
| **LixBlogs** | A collaborative publishing platform with an API and a CLI | [elixpo/blogs.elixpo](https://github.com/elixpo/blogs.elixpo) |
| **LixSketch** | A shared canvas for sketches, diagrams and documents | [elixpo/sketch.elixpo](https://github.com/elixpo/sketch.elixpo) |
| **Crumb** | A self-hosted agent harness and terminal, written in Rust | [elixpo/crumb.elixpo](https://github.com/elixpo/crumb.elixpo) |
| **Elixpo Open Source** | A platform for running open-source contests and mentorship programmes | [elixpo/opensource.elixpo](https://github.com/elixpo/opensource.elixpo) |
| **Oreo** | An open MicroPython OS and hardware platform for an ESP32-S3 badge | [elixpo/oreo](https://github.com/elixpo/oreo) |

## People

| Person | Role |
|---|---|
| Ayushman Bhattacharya ([@Circuit-Overtime](https://github.com/Circuit-Overtime)) | Lead organisation administrator, mentor, founder of Elixpo |
| Vivek Yadav ([@ez-vivek](https://github.com/ez-vivek)) | Organisation administrator, mentor, programme point of contact |
| Divyanshu ([@divyanshuj91](https://github.com/divyanshuj91)) | Mentor |
| Anwesha Chakraborty ([@anwe-ch](https://github.com/anwe-ch)) | Programme coordinator, programme point of contact |

## Our record

Elixpo has run open contribution in public since 2024. Maintainers took part
in Hacktoberfest in October 2024 and October 2025: preparing work for outside
contributors, reviewing their pull requests and merging them. In October 2025
the Chapter repository merged 47 Hacktoberfest-labelled pull requests from 24
GitHub accounts. The dated record, with links to the evidence, is on
[gsoc.elixpo.com/about](https://gsoc.elixpo.com/about/).

## Get involved

1. Read the [project ideas](https://gsoc.elixpo.com/ideas/) and pick one or two.
2. Set up the project from its repository and try a
   [warm-up task](https://gsoc.elixpo.com/contributor-guide/).
3. Introduce yourself and ask questions in
   [GitHub Discussions](https://github.com/orgs/elixpo/discussions).
4. Write your proposal with our [template](https://gsoc.elixpo.com/proposal/)
   and submit it through the official
   [Google Summer of Code website](https://summerofcode.withgoogle.com/).

Programme questions and private matters: **gsoc@elixpo.com**.

## Improving this site

Spotted a mistake or have a suggestion for an idea? Open an issue or a pull
request; see [CONTRIBUTING.md](CONTRIBUTING.md). Developer notes (building,
checks and deployment) are in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md). This
project follows the [Elixpo Code of Conduct](CODE_OF_CONDUCT.md); report
security issues as described in [SECURITY.md](SECURITY.md).

## License

- **Site code:** MIT. See [LICENSE](LICENSE).
- **Site text** (`content/`): Creative Commons Attribution 4.0. See
  [LICENSE-CONTENT](LICENSE-CONTENT) and
  [LICENSES/CC-BY-4.0.txt](LICENSES/CC-BY-4.0.txt).
- **Names and logos** are not covered by either licence. See
  [TRADEMARKS.md](TRADEMARKS.md) and [NOTICE](NOTICE).

Google Summer of Code and the GSoC logo are trademarks of Google LLC. Elixpo
is applying as a mentoring organisation and is not affiliated with or endorsed
by Google.
