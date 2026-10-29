---
title: Accessible LixSketch canvas
slug: accessible-lixsketch-canvas
order: 2
theme: Accessibility
size_hours: 175
difficulty: Intermediate
primary_mentor: ez-vivek
backup_mentor: divyanshuj91
repository: https://github.com/elixpo/sketch.elixpo
setup: https://github.com/elixpo/sketch.elixpo/blob/main/README.md
env_example: null
summary: Make the LixSketch infinite canvas usable from the keyboard and with screen readers, and prove it with keyboard-only end-to-end tests in CI.
in_short: Make the LixSketch drawing canvas usable for people who use only a keyboard or a screen reader, and add tests that prove it.
skills:
  - JavaScript and DOM
  - ARIA and WCAG
  - Playwright
related_issues: []
---

## Why this matters

Some people cannot use a mouse. Some people cannot see the screen and use a
screen reader, which reads the page aloud. Today they cannot use the LixSketch
canvas, the main area where you draw and connect shapes.

This project makes the canvas usable for them, and adds automatic tests so
it stays that way.

## Problem

LixSketch's infinite canvas is SVG drawn with rough.js. The toolbar and menus
are accessible, but the canvas is not. Shapes can't be focused, nothing is
announced to screen readers, and there is no way to connect or edit shapes
from the keyboard.

This fails WCAG success criteria 2.1.1, 2.4.3, 2.4.7, 4.1.2 and 4.1.3.
Shapes already have IDs, types, labels, frames and arrow bindings, so an
accessible model can be layered on without a rewrite.

## Expected outcomes

- An accessible shape tree mirrored from the scene, kept in sync through
  undo/redo and live collaboration.
- Keyboard navigation between shapes, frames and connections.
- Keyboard select, move, resize, connect and label editing.
- A live announcer for selections, connections and edits.
- A Playwright and axe suite of keyboard-only scenarios in CI.

## Stretch goals

- A command palette.
- A text outline view of a diagram.
- A high-contrast theme.

## Not in scope

- The docs editor (BlockNote is already accessible).
- Freehand drawing.
- The landing pages.

## Proof of success

- Zero serious axe violations on the canvas.
- At least 8 keyboard-only end-to-end scenarios pass, such as building a
  three-node flowchart.
- NVDA and VoiceOver test scripts exist.
- A WCAG checklist is mapped to the tests.

## How to start

1. Set up LixSketch locally from the README and open the canvas.
2. Try to draw and connect three shapes using only the keyboard, then with a
   screen reader. Write down where you get stuck.
3. Find where shapes are created and rendered in `src/`, and how a shape's
   ID, label and bindings are stored.
4. Make a small, reviewed contribution to the repository, then share your
   notes in GitHub Discussions.

## Words used on this page

- **Canvas**: the area where you draw and connect shapes.
- **SVG, rough.js**: SVG is a format for drawing shapes in web pages. rough.js
  is a library that draws them with a hand-drawn look.
- **Screen reader**: software that reads the screen aloud, used by blind and
  low-vision people. NVDA and VoiceOver are two common screen readers.
- **Focus**: the element on the page that the keyboard is acting on.
- **ARIA**: HTML attributes that tell screen readers what an element is and
  what state it is in.
- **WCAG**: the Web Content Accessibility Guidelines, the standard rules for
  accessible websites. Each numbered "success criterion" is one rule.
- **Accessible shape tree**: a structure, not shown on screen, that describes
  the shapes on the canvas to screen readers.
- **Live announcer**: a part of the page that tells screen readers when
  something changes.
- **Playwright**: a tool that controls a real browser to run tests.
- **axe**: a tool that checks web pages for accessibility problems
  automatically.
- **End-to-end test**: a test that uses the app the way a person would, from
  start to finish.
- **CI**: tests that run automatically on every proposed change.
- **Command palette**: a search box that lets you run any command by typing
  its name.
