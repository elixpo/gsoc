---
title: Crumb connector contract and offline conformance kit
slug: crumb-connector-contract
order: 3
theme: Rust, agent security
size_hours: 175
difficulty: Hard
primary_mentor: Circuit-Overtime
backup_mentor: ez-vivek
repository: https://github.com/elixpo/crumb.elixpo
setup: https://github.com/elixpo/crumb.elixpo/blob/main/README.md
env_example: null
summary: Design a versioned, scoped contract for Crumb connectors to external accounts, with an offline conformance kit that proves a connector behaves correctly.
skills:
  - Rust (traits, async)
  - HTTP and OAuth basics
  - Test design
related_issues:
  - "29 Plan professional productivity connectors"
  - "30 Plan GitHub connector for repository workflows"
  - "31 Plan storage connectors for media workflows"
---

## Problem

Crumb is Elixpo's self-hosted Rust agent harness: 29 crates, about 700
tests, and packaged in Debian. Skills already have a signed, verified
manifest with a conformance test. External accounts do not have one: GitHub
access is hand-written native tools, and MCP servers are unscoped.

There is no versioned contract for declaring scopes, storing and revoking
credentials, separating read approval from write approval, or proving that a
connector behaves correctly. The planned connectors (linked below) are
blocked until that contract exists.

## Expected outcomes

- A versioned connector manifest with scopes and an effects classification,
  validated by the existing marketplace crate.
- A connector trait and host that work with Crumb's approval flow and the OS
  keyring. Credentials are never stored in plain text.
- An offline conformance kit: fake HTTP servers, recorded fixtures and the
  existing mock LLM provider. It covers scope enforcement, fail-closed
  handling of revoked or expired tokens, redaction and cancellation.
- The GitHub tools migrated onto the contract as the reference connector.

## Stretch goals

- A second reference connector (storage, #31).
- Wrapping MCP servers as connectors.
- A `crumb connector doctor` command.

## Not in scope

- Email and calendar connectors.
- OAuth app registration.
- Marketplace UI.
- New LLM providers.

## Proof of success

- The kit runs in CI on Linux, macOS and Windows with no secrets.
- Negative tests prove that undeclared scopes are denied.
- The GitHub connector passes the kit and the existing GitHub tests still
  pass.
- The design document is merged before the midterm.

## How to start

1. Build Crumb and run its test suite from a clean checkout, following the
   README. The tests use a mock LLM provider, so you should not need an API
   key.
2. Read the `crumb-marketplace` crate to see how skill manifests are
   verified today.
3. Read the connector planning issues linked below.
4. Make a small, reviewed contribution to the repository, then share your
   questions in GitHub Discussions.
