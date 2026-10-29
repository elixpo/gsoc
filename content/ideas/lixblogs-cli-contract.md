---
title: LixBlogs CLI automation contract v1
slug: lixblogs-cli-contract
order: 6
theme: Developer tools
size_hours: 90
difficulty: Easy
primary_mentor: divyanshuj91
backup_mentor: Circuit-Overtime
repository: https://github.com/elixpo/blogs.elixpo
setup: https://github.com/elixpo/blogs.elixpo/blob/main/README.md
env_example: https://github.com/elixpo/blogs.elixpo/blob/main/.env.example
summary: Version and specify the JSON output of the LixBlogs CLI so that scripts and AI agents built on it don't break silently.
in_short: Write down and test exactly what the LixBlogs command-line tool prints, so scripts and AI tools that depend on it don't break without warning.
skills:
  - Node.js
  - JSON Schema
  - Testing
related_issues: []
---

## Description

[`@elixpo/lixblogs-cli`](https://www.npmjs.com/package/@elixpo/lixblogs-cli)
(v1.8.0 on npm) is used by people and by AI agents through
`--json --no-input`, but its output shapes are not versioned or specified.
An unnoticed change breaks every script and agent skill built on it.

**Impact.** A written, versioned and tested description of the output protects
everyone who builds scripts and agent tools on the CLI.

## Expected outcomes

- A JSON Schema with a `schemaVersion` for every command's output and error
  envelope.
- Snapshot tests for human-readable and JSON output.
- Idempotent media-upload retries.
- Shell completions and a `doctor` command.
- A packed-tarball test matrix on three operating systems.

## Stretch goals

- CI detection of breaking contract changes.

## Out of scope

- New API endpoints.
- Telemetry.
- Offline sync.
- Plugins.

## How success is measured

- The schemas validate every snapshot.
- A forced duplicate upload creates exactly one record.
- The packed artifact passes CI on three operating systems.

## Warm-up tasks

1. Install the CLI from npm and run several commands with
   `--json --no-input`.
2. Read the CLI source in `packages/lixblogs-cli` in the LixBlogs repository.
3. Record every JSON output shape you observe, including errors, and send the
   notes to [gsoc@elixpo.com](mailto:gsoc@elixpo.com).
4. Open a small documentation or test improvement pull request in the repository, and respond to review until it is merged or closed.

## Terms used on this page

- **CLI**: a command-line interface, a tool you use by typing commands in a
  terminal.
- **npm**: the main place to publish and install JavaScript packages.
- **JSON**: a common text format for structured data.
- **`--json --no-input`**: options that make the CLI print JSON and never
  stop to ask questions, so scripts can use it.
- **Contract**: a promise about the exact shape of the output.
- **JSON Schema, `schemaVersion`**: a standard way to describe what JSON must
  look like, and a number in the output saying which version it follows.
- **Error envelope**: the standard shape of the output when something goes
  wrong.
- **Snapshot test**: a test that saves the output once and fails if it later
  changes.
- **Idempotent**: doing it twice has the same effect as doing it once.
- **Shell completions**: suggestions when you press Tab in the terminal.
- **Packed tarball, packed artifact**: the exact package file that is
  published to npm.
- **Test matrix**: running the same tests on several systems.
- **CI**: tests that run automatically on every proposed change.
- **Telemetry**: sending usage data back to the developers.
