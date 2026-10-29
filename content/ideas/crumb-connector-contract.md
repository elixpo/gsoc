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
in_short: Design a safe, standard way for Crumb to connect to outside accounts such as GitHub, and build tests that prove each connection only does what it is allowed to do.
skills:
  - Rust (traits, async)
  - HTTP and OAuth basics
  - Test design
related_issues:
  - "29 Plan professional productivity connectors"
  - "30 Plan GitHub connector for repository workflows"
  - "31 Plan storage connectors for media workflows"
---

## Description

Crumb is Elixpo's self-hosted Rust agent harness: 29 crates, about 700
tests, and packaged in Debian. Skills already have a signed, verified
manifest with a conformance test. External accounts do not have one: GitHub
access is hand-written native tools, and MCP servers are unscoped.

There is no versioned contract for declaring scopes, storing and revoking
credentials, separating read approval from write approval, or proving that a
connector behaves correctly. The planned connectors, linked under Material,
are blocked until that contract exists.

**Impact.** When an agent can reach a user's accounts, it must do only what
the user has allowed, and credentials must stay protected. A shared, tested
contract makes that guarantee explicit and unblocks the planned connectors.

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

## Out of scope

- Email and calendar connectors.
- OAuth app registration.
- Marketplace UI.
- New LLM providers.

## How success is measured

- The kit runs in CI on Linux, macOS and Windows with no secrets.
- Negative tests prove that undeclared scopes are denied.
- The GitHub connector passes the kit and the existing GitHub tests still
  pass.
- The design document is merged before the midterm.

## Warm-up tasks

1. Build Crumb and run its test suite from a clean checkout, following the
   README. The tests use a mock LLM provider, so no API key is required.
2. Read the `crumb-marketplace` crate and describe how skill manifests are
   verified today.
3. Read the connector planning issues linked under Material and summarise
   their requirements in your own words in GitHub Discussions.
4. Open a small documentation or test improvement pull request in the repository, and respond to review until it is merged or closed.

## Terms used on this page

- **Agent harness**: a program that runs AI agents and controls what they
  may do. **Self-hosted** means you run it on your own computer.
- **Crate**: a Rust package. **Trait**: Rust's way to describe what a type
  must be able to do.
- **Skill**: an add-on that gives Crumb a new ability.
- **Connector**: the part of Crumb that connects to an outside service, such
  as GitHub.
- **Contract**: a written, versioned agreement on how every connector must
  behave.
- **Manifest**: a file in which a connector says what it is and what it
  needs.
- **Scope**: one specific permission, such as "read issues" but not "delete
  repositories".
- **Effects classification**: labelling each action by what it can change,
  for example read-only or write.
- **Credentials, tokens**: the secret keys that let a program act on your
  account.
- **OS keyring**: the secure password store built into your operating
  system.
- **OAuth**: a common way for an app to get limited access to your account
  without your password.
- **MCP server**: a program that offers tools to AI agents through the Model
  Context Protocol.
- **Conformance kit**: a set of automated tests that every connector must
  pass.
- **Fake HTTP server, recorded fixtures**: pretend versions of outside
  services and saved example responses, so tests run without the internet.
- **Mock LLM provider**: a pretend AI model used in tests, so you need no API
  key.
- **Fail-closed**: when something goes wrong, such as an expired token,
  access is refused rather than allowed.
- **Redaction**: hiding secrets from logs and output.
- **CI**: tests that run automatically on every proposed change.
