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

## Why this matters

People and AI agents use the LixBlogs command-line tool from their own
scripts, and those scripts read what it prints. If the output changes, even
slightly, the scripts can break without anyone noticing.

A written, versioned description of the output, checked by tests, protects
everyone who builds on the tool.

## Problem

[`@elixpo/lixblogs-cli`](https://www.npmjs.com/package/@elixpo/lixblogs-cli)
(v1.8.0 on npm) is used by people and by AI agents through
`--json --no-input`, but its output shapes are not versioned or specified.
An unnoticed change breaks every script and agent skill built on it.

## Expected outcomes

- A JSON Schema with a `schemaVersion` for every command's output and error
  envelope.
- Snapshot tests for human-readable and JSON output.
- Idempotent media-upload retries.
- Shell completions and a `doctor` command.
- A packed-tarball test matrix on three operating systems.

## Stretch goals

- CI detection of breaking contract changes.

## Not in scope

- New API endpoints.
- Telemetry.
- Offline sync.
- Plugins.

## Proof of success

- The schemas validate every snapshot.
- A forced duplicate upload creates exactly one record.
- The packed artifact passes CI on three operating systems.

## How to start

1. Install the CLI from npm and run a few commands with `--json --no-input`.
2. Read the CLI source in `packages/lixblogs-cli` in the LixBlogs
   repository.
3. Write down every JSON shape you see, including errors.
4. Make a small, reviewed contribution to the repository, then share your
   notes in GitHub Discussions.

## Words used on this page

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
