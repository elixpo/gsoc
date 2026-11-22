---
title: "Crumb Sandbox: one policy for everything an agent runs"
slug: crumb-sandbox
order: 4
theme: Rust, agent security
size_hours: 350
difficulty: Hard
primary_mentor: Circuit-Overtime
backup_mentor: ez-vivek
repository: https://github.com/elixpo/crumb.elixpo
setup: https://github.com/elixpo/crumb.elixpo/blob/main/docs/NEWCOMERS.md
summary: Give Crumb one capability policy for every process an agent starts, enforced on Linux and macOS and proven by an adversarial escape suite in CI.
in_short: Make sure everything a Crumb agent starts, from shell commands to plug-in servers, can only touch the files and network it is allowed to, and prove it with tests that try to break out.
skills:
  - Rust
  - Operating-system security (Landlock, seccomp, Seatbelt)
  - Test design
related_issues:
  - "326 Crumb Sandbox: one capability policy for everything an agent spawns"
  - "296 Sandbox agent shell commands on Linux (Landlock write confinement)"
  - "328 Document every process Crumb spawns, and how each is confined"
  - "330 Test that external MCP servers start with a cleared environment"
  - "329 evals/run.py: list scenarios without running them"
---

## Description

Crumb is Elixpo's self-hosted agent harness and natural-language terminal,
written in Rust: 29 crates and over 700 tests, packaged in Debian. An agent
in Crumb starts many kinds of child processes: shell commands, external MCP
servers, skills, hooks and delegated agent work.

Only agent shell commands are confined today. On Linux, a Landlock ruleset
limits their writes to the workspace, temporary folders and the usual
toolchain caches (`crates/crumb-tools/src/sandbox.rs`,
[#296](https://github.com/elixpo/crumb.elixpo/issues/296)); every path stays
readable. External MCP servers start with a cleared environment but no limits
on files or network. There is no network policy, and nothing on macOS or
Windows.

Agent CLIs such as Codex already pair Landlock and seccomp on Linux with
Seatbelt profiles on macOS, and that is prior art to study. What Crumb needs
is **one policy shared by every kind of process an agent can start**, which
only the user's approval can widen.

**Impact.** People let agents run code on their own machines. A single,
tested policy for everything an agent starts turns "the agent probably won't
do that" into "the agent cannot do that", and the escape suite keeps it true
as Crumb grows.

## Expected outcomes

- One declarative capability policy (files read and write, network,
  processes) applies to shell commands, MCP servers, skills and sub-agents
  alike, and only explicit user approval widens it.
- The policy is enforced on Linux (Landlock for files and TCP, seccomp where
  Landlock cannot reach, such as UDP and DNS) and on macOS (Seatbelt), with an
  honest fallback on Windows; `/permissions` shows what is really enforced.
- An adversarial escape suite runs in CI and keeps the guarantees true.

The project can be proposed at **175 hours**: the policy, plus Linux
enforcement for MCP servers and skills. The **350-hour** version adds macOS,
network rules and the full escape suite.

## Stretch goals

- Per-connector policies for MCP servers declared in the marketplace
  catalogue.
- A `crumb sandbox doctor` command that explains what the current machine can
  enforce.

## Out of scope

- Virtual machines or containers as the isolation layer.
- New tools or LLM providers.
- Windows enforcement beyond a documented fallback.

## How success is measured

- The policy format is documented and versioned, and every spawn site listed
  in #328 goes through it.
- On Linux, MCP servers and skills run confined, and network access is denied
  unless approved, including UDP and DNS.
- For 350 hours: the same policy is enforced on macOS through Seatbelt.
- The escape suite (writes outside the workspace, persistence through tool
  caches, network access, reading secrets) runs in CI on Linux, and on macOS
  for 350 hours. A scripted model drives the escape attempts with Crumb's
  existing `ScriptedProvider`, so no API key is needed.
- `/permissions` reports the real enforcement state on every platform.

## Warm-up tasks

1. Build Crumb and run its test suite from a clean checkout, following
   `docs/NEWCOMERS.md`. The tests use a mock model provider, so no API key is
   needed.
2. Read `crates/crumb-tools/src/sandbox.rs` and
   `crates/crumb-mcp/src/client.rs`, and describe what each confines today.
3. Check which GitHub-hosted runners support Landlock and `sandbox-exec`, and
   share what you find, then {{warm-up-results}}.
4. Take a warm-up issue such as #328, #329 or #330, open a pull request, and
   respond to review until it is merged or closed.

## Terms used on this page

- **Agent harness**: a program that runs AI agents and controls what they may
  do. **Self-hosted** means you run it on your own computer.
- **Crate**: a Rust package.
- **Child process, spawn**: a program started by another program.
- **MCP server**: a program that offers tools to AI agents through the Model
  Context Protocol.
- **Skill**: an add-on that gives Crumb a new ability.
- **Sandbox**: limits that stop a program from touching what it should not.
- **Capability policy**: the written rules for what a process may do.
- **Landlock, seccomp**: Linux kernel features that restrict which files and
  system calls a process may use.
- **Seatbelt** (`sandbox-exec`): the macOS sandbox.
- **TCP, UDP, DNS**: kinds of network traffic. DNS turns names into addresses.
- **Escape suite**: tests that try to break out of the sandbox and must fail.
- **Scripted model**: a pretend AI model that follows a script, used in tests.
- **CI**: tests that run automatically on every proposed change.
