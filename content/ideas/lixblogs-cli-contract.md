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
skills:
  - Node.js
  - JSON Schema
  - Testing
related_issues: []
---

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
