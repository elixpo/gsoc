---
title: "Warm-up: set up a project without keys"
description: Set up each Elixpo GSoC 2027 project from a clean checkout without private keys: prerequisites, exact commands, expected results and warm-up tasks.
heading: Set up a project *without keys*
lead: Every warm-up task can be done from a public checkout, without decrypting any Elixpo configuration. This page gives, for each of the five projects, what runs without keys, the commands taken from the repository's own files, how to tell it worked, and the limitations you may meet today.
tldr:
  - You never need an Elixpo key, password or paid account to set up a project or complete a warm-up task.
  - Each project below lists its prerequisites and the exact commands its own CI or README uses, with the source file.
  - Where a project falls short today, its section says so under "Known limitations".
  - If a step asks for a secret, report it as a setup issue. Questions go to [gsoc@elixpo.com](mailto:gsoc@elixpo.com).
  - Pick the idea you will work on: [browse the six project ideas](/ideas/).
next:
  - /ideas/
  - /contributor-guide/
  - /projects/
---

## Our warm-up policy

These are our commitments to every applicant, for every participating
project. Where a project does not meet one yet, its section below says so.

- **Documented setup.** Each project can be set up from a clean checkout with
  commands written down in the repository, and those commands match what its
  continuous integration (CI) runs.
- **No keys.** Setup and the warm-up tasks never require decrypting Elixpo
  configuration. If they do, that is a defect in our instructions, and we fix
  it.
- **Tests without secrets.** The tests for the area of each idea run on your
  computer without secrets and on every pull request.
- **Fakes, not services.** Where an idea touches an outside service, the
  project provides fakes or fixtures so you can work without it.
- **Versions stated.** Each project states the runtime versions it needs and
  the operating systems it supports.
- **Contribution basics.** Each repository has contribution guidelines, a Code
  of Conduct and a pull request template.
- **Named reviewers.** Your warm-up pull request is reviewed by the idea's
  mentors, who aim to reply within 48 hours on weekdays.
- **Clear boundaries.** We explain what configuration is encrypted and how
  access is granted after acceptance. See
  [configuration and access](/contributor-guide/#configuration-and-access).

## LixBlogs

Repository: [elixpo/blogs.elixpo](https://github.com/elixpo/blogs.elixpo).
Ideas: [read-access policy](/ideas/lixblogs-read-access-policy/#warm-up-tasks)
and [CLI automation contract](/ideas/lixblogs-cli-contract/#warm-up-tasks).

### What runs without keys

The full unit test suite of the web app (`tests/`, run with Node's built-in
test runner) and the test suite of the command-line tool
(`packages/lixblogs-cli`). These are the warm-up path.

### Prerequisites

Git, Node.js 22 and npm. Node 22 is the version the pull request tests use.

### Commands

```bash
git clone https://github.com/elixpo/blogs.elixpo
cd blogs.elixpo
npm ci
npm test
```

Source:
[`.github/workflows/pr-tests.yml`](https://github.com/elixpo/blogs.elixpo/blob/main/.github/workflows/pr-tests.yml)
(runs `npm ci` and `npm test` on Node 22 for every pull request, without
secrets).

```bash
cd packages/lixblogs-cli
npm ci
npm test
```

Source:
[`packages/lixblogs-cli/package.json`](https://github.com/elixpo/blogs.elixpo/blob/main/packages/lixblogs-cli/package.json)
(the `test` script, `node --test tests/*.test.mjs`).

### How you know it worked

Node's test runner ends with a summary. `# fail 0` means every test passed.

### Warm-up tasks

See the warm-up tasks on the
[read-access policy](/ideas/lixblogs-read-access-policy/#warm-up-tasks) and
[CLI automation contract](/ideas/lixblogs-cli-contract/#warm-up-tasks) idea
pages.

### Known limitations

- The development server (`npm run dev`) will not start until a `.env.local`
  file exists (`next.config.mjs`), and signing in needs an Elixpo Accounts
  application that applicants do not have. Signed-in pages are therefore not
  part of the warm-up; the tests cover the code instead.
- The repository contains an encrypted `.env` file. Leave it alone: do not try
  to decrypt it. Do not create `.dev.vars`; the README explains that it
  overrides local settings.

## LixSketch

Repository: [elixpo/sketch.elixpo](https://github.com/elixpo/sketch.elixpo).
Idea: [accessible canvas](/ideas/accessible-lixsketch-canvas/#warm-up-tasks).

### What runs without keys

The drawing engine's tests (Vitest unit tests and Node tests for its MCP
server), and the canvas itself in your browser, together with a local
collaboration server. When run locally, the canvas connects to the local
collaboration server instead of the hosted one.

### Prerequisites

Git, Node.js 20 or newer and npm (`engines` in `package.json`).

### Commands

```bash
git clone https://github.com/elixpo/sketch.elixpo
cd sketch.elixpo
npm ci
npm test
npm run dev
```

Sources:
[`.elixpo/project.yml`](https://github.com/elixpo/sketch.elixpo/blob/main/.elixpo/project.yml)
(`test_cmd: npm test`, run by
[`.github/workflows/quality-gate.yml`](https://github.com/elixpo/sketch.elixpo/blob/main/.github/workflows/quality-gate.yml)
on every pull request) and the
[README](https://github.com/elixpo/sketch.elixpo/blob/main/README.md#running-this-project-locally)
(`npm run dev`). `npm run dev` first applies the database migrations to a local
database, then starts the web app and the collaboration server on port 8787.

### How you know it worked

`npm test` prints a Vitest summary with every test file passed, then a Node
test summary ending in `# fail 0`. After `npm run dev`, open
[http://localhost:3000](http://localhost:3000): the canvas loads and you can
draw shapes.

### Warm-up tasks

See the [accessible canvas](/ideas/accessible-lixsketch-canvas/#warm-up-tasks)
idea page.

### Known limitations

- Signing in is not available locally; drawing and the accessibility work do
  not need it.
- The repository contains an encrypted `.env` file, and the development tools
  read it, so some settings arrive as unreadable values. The canvas does not
  depend on them. Do not try to decrypt the file.

## Crumb

Repository: [elixpo/crumb.elixpo](https://github.com/elixpo/crumb.elixpo).
Idea: [connector contract](/ideas/crumb-connector-contract/#warm-up-tasks).

### What runs without keys

Building the whole Rust workspace and running its full test suite. The tests
use a mock AI model provider, so no API key is needed. Only the end-to-end
agent evaluations in `evals/` call a real provider; they are not part of the
warm-up.

### Prerequisites

Git and Rust stable, version 1.95 or newer, with `rustfmt` and `clippy`
(`rust-toolchain.toml` and `Cargo.toml`). With `rustup`, the toolchain file
selects the right components. CI tests on Linux, macOS and Windows.

### Commands

```bash
git clone https://github.com/elixpo/crumb.elixpo
cd crumb.elixpo
cargo fmt --all --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace --all-targets
```

Sources:
[`.github/workflows/ci.yml`](https://github.com/elixpo/crumb.elixpo/blob/main/.github/workflows/ci.yml)
(runs these on every pull request) and the "Checks" section of
[`CONTRIBUTING.md`](https://github.com/elixpo/crumb.elixpo/blob/main/CONTRIBUTING.md).

### How you know it worked

`cargo fmt` prints nothing, `cargo clippy` finishes without warnings, and every
crate's tests end with `test result: ok.`

### Warm-up tasks

See the [connector contract](/ideas/crumb-connector-contract/#warm-up-tasks)
idea page.

### Known limitations

- The README describes installing released binaries, not building from
  source. Use the commands above, from `CONTRIBUTING.md`.
- Chatting with a real AI model needs a provider key and is not part of the
  warm-up.

## Elixpo Open Source

Repository:
[elixpo/opensource.elixpo](https://github.com/elixpo/opensource.elixpo).
Idea: [contest-scoring engine](/ideas/contest-scoring-engine/#warm-up-tasks).

### What runs without keys

Type-checking and linting the code, applying the database schema to a local
database, and running the web frontend, which shows example (mock) data. The
backend services are not written yet: `workers/` holds only the database
migrations.

### Prerequisites

Git, Node.js 20 or newer and npm (README and `engines` in `package.json`).

### Commands

```bash
git clone https://github.com/elixpo/opensource.elixpo
cd opensource.elixpo
npm install
npm run typecheck
./biome.sh ci
npm run db:migrate:local
npm run dev
```

Sources: the
[README](https://github.com/elixpo/opensource.elixpo/blob/main/README.md#running-this-project-locally)
(`npm install`, `npm run db:migrate:local`, `npm run dev`, `npm run typecheck`),
[`package.json`](https://github.com/elixpo/opensource.elixpo/blob/main/package.json)
scripts, and
[`.github/workflows/biome.yml`](https://github.com/elixpo/opensource.elixpo/blob/main/.github/workflows/biome.yml)
(`./biome.sh ci` on every pull request).

### How you know it worked

`npm run typecheck` finishes without errors, `./biome.sh ci` reports no
errors, and [http://localhost:3000](http://localhost:3000) shows the landing
page.

### Warm-up tasks

See the [contest-scoring engine](/ideas/contest-scoring-engine/#warm-up-tasks)
idea page. The points ledger schema is in `workers/migrations/`.

### Known limitations

- The README's first setup step copies a settings template that is not in the
  repository. Skip it: the app has local defaults.
- There are no automated tests yet. A first test is a welcome warm-up pull
  request.
- The repository contains an encrypted `.env` file, which the development
  server reads. Do not try to decrypt it; the frontend does not need it.

## Oreo

Repository: [elixpo/oreo](https://github.com/elixpo/oreo).
Idea: [desktop simulator](/ideas/oreo-badge-simulator/#warm-up-tasks).

### What runs without keys

Without the badge, you can install the host tools and read and change the
code. OreoOS apps run only on the ESP32-S3 badge today, and the repository has
no tests. Running apps on a computer is exactly what the simulator idea
builds, so the warm-up is hardware-free reading and analysis, not running
apps.

### Prerequisites

Git and Python 3.9 or newer (`pyproject.toml`). No badge hardware.

### Commands

```bash
git clone https://github.com/elixpo/oreo
cd oreo
python -m venv .venv && source .venv/bin/activate
pip install -r oreoOS/requirements.txt
```

Source: the
[README](https://github.com/elixpo/oreo/blob/main/README.md) "Get going"
section. Stop there: the README's next command, `tools/deploy.py`, flashes a
connected badge.

### How you know it worked

`pip` finishes installing the host tools listed in
`oreoOS/requirements.txt`. Then open `oreoOS/api.py`, the hardware
abstraction every app is meant to go through.

### Warm-up tasks

See the [desktop simulator](/ideas/oreo-badge-simulator/#warm-up-tasks) idea
page: read `oreoOS/api.py`, find modules that import hardware directly, and
try the MicroPython unix port from MicroPython's own documentation.

### Known limitations

- No automated tests and no way to run apps without the badge yet.
- The deploy tool reads secrets from the encrypted `.env` file. You do not
  need it for the warm-up; do not try to decrypt it.
- The README links `templates/example_app/`; the folder is `app_templates/`.

## Common problems

- **A setup step asks for a secret, a key or an encrypted file.** Do not try to
  decrypt the repository's `.env` file or ask anyone to share keys. Report it
  as a setup issue in the repository: it is a defect in our instructions, and
  fixing it is a valid first contribution. See
  [configuration and access](/contributor-guide/#configuration-and-access).
- **A feature needs a real service** (sign-in, email, media uploads, AI
  models). Skip it: warm-up tasks do not depend on it.
- **Your Node.js or Rust version differs.** Use the version in the project's
  prerequisites above.

## Where to ask

{{write-to}} with the project, the command you ran and its full output.
{{discussions}} A defect in a project's setup also belongs in an issue in
that repository.
