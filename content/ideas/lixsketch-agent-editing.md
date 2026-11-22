---
title: LixSketch collaborative agent editing
slug: lixsketch-agent-editing
order: 3
theme: Agents, collaboration
size_hours: 350
difficulty: Hard
primary_mentor: Circuit-Overtime
backup_mentor: divyanshuj91
repository: https://github.com/elixpo/sketch.elixpo
setup: https://github.com/elixpo/sketch.elixpo/blob/main/README.md
summary: Let an AI agent and a person edit the same LixSketch diagram safely, with per-shape rebase, scene diffs, bound arrows and a keyless diagram benchmark.
in_short: Make it safe for an AI assistant and a person to work on the same LixSketch diagram at once, and build a benchmark that measures how well agents draw.
skills:
  - JavaScript
  - Data structures for merging changes
  - Graph basics
  - Test design
related_issues:
  - "235 LixSketch collaborative agent editing: rebase, diffs and a diagram benchmark"
  - "237 Estimate MCP text bounds instead of a fixed box"
  - "224 mcp-file-store test fails on Windows (POSIX permission check)"
---

## Description

LixSketch is a collaborative canvas for sketches, diagrams and documents. Its
npm package, `@elixpo/lixsketch`, includes an MCP server
(`packages/lixsketch/src/mcp/`) with eight tools over stdio, such as
`canvas_get`, `canvas_apply_patch`, `canvas_preview` and `lixscript_apply`,
plus revision checks and dry runs. It works for one agent drawing alone. It
does not yet work for an agent and a person editing the same diagram:

- One stale revision rejects the whole patch (`applyScenePatch` in
  `scene.js`), even when the agent and the person touched different shapes.
- There is no way to ask what changed since a revision, so the agent must
  read the whole scene again.
- Arrows added through `canvas_apply_patch` carry no shape bindings, and
  `lixscript_apply` resolves connections to fixed points, so arrows detach
  when a shape moves.
- Nothing measures how well an agent draws a diagram.

**Impact.** Agents are becoming collaborators on documents and diagrams, and
most canvas tools treat them as one-shot generators. Safe concurrent editing
and an open, keyless benchmark make LixSketch a place where a person and an
agent can really work on the same diagram, and give others a way to measure
agents that draw.

## Expected outcomes

- Human and agent edits to the same diagram both apply when they touch
  different shapes, and real conflicts come back as clear, per-shape errors.
- Agents can ask what changed since a revision, and arrows stay attached to
  their shapes through headless edits.
- For 350 hours: a keyless diagram benchmark, scored structurally, measures
  how well any MCP client draws.

The project can be proposed at **175 hours**: rebase, `canvas_diff` and
bound arrows. The **350-hour** version adds the benchmark and layout
operations such as align and distribute.

## Stretch goals

- Auto-layout through an existing library such as ELK or dagre.
- A benchmark report page that compares runs over time.

## Out of scope

- Remote or hosted MCP endpoints.
- Changes to the live collaboration server.
- Training or fine-tuning models.

## How success is measured

- A three-way merge over the scene applies non-overlapping human and agent
  edits and reports per-shape conflicts, backed by property-based tests.
- `canvas_diff(sinceRevision)` returns what changed, and moving a shape keeps
  its bound arrows attached, in headless tests.
- For 350 hours: about 30 diagram tasks are scored on the headless scene
  (required edges present, no overlapping shapes, labels inside their shapes,
  edge crossings), and the benchmark runs without any API key against
  recorded or scripted agent output.
- Existing MCP tests still pass, and the new tests run with `node --test`.

## Warm-up tasks

1. Set up LixSketch locally from the README and run the MCP tests in
   `packages/lixsketch/test/`. No private keys are needed.
2. Read `packages/lixsketch/src/mcp/scene.js` and describe how a patch is
   applied and when it is rejected, then {{warm-up-results}}.
3. Take a warm-up issue such as #237 or #224, open a pull request, and
   respond to review until it is merged or closed.

## Terms used on this page

- **Canvas**: the area where you draw and connect shapes.
- **MCP (Model Context Protocol)**: a standard way for AI agents to use
  tools. An **MCP server** offers those tools.
- **stdio**: talking to a program through its standard input and output.
- **Scene**: the saved description of every shape on a canvas.
- **Patch**: a list of changes to apply to the scene.
- **Revision**: a version number that goes up with every change.
- **Rebase, three-way merge**: combining two sets of changes made to the same
  starting version.
- **Diff**: the list of what changed between two versions.
- **Binding**: an arrow's link to the shape it starts or ends at.
- **Headless**: running without a window or browser, for automated tests.
- **Benchmark**: a fixed set of tasks used to measure and compare results.
- **Property-based tests**: tests that generate many inputs automatically.
- **ELK, dagre**: libraries that lay out graphs and diagrams automatically.
- **CI**: tests that run automatically on every proposed change.
