---
title: Oreo badge desktop simulator
slug: oreo-badge-simulator
order: 5
theme: Embedded, open hardware
size_hours: 175
difficulty: Intermediate
primary_mentor: Circuit-Overtime
backup_mentor: ez-vivek
repository: https://github.com/elixpo/oreo
setup: https://github.com/elixpo/oreo/blob/main/README.md
env_example: null
summary: Open Oreo to contributors without hardware by building a desktop simulator with headless golden-image tests.
skills:
  - Python and MicroPython
  - pygame or SDL
  - pytest
  - Basic embedded knowledge
related_issues: []
---

## Problem

Oreo is an open MicroPython OS for an ESP32-S3 conference badge: about 22k
lines of Python and 21 apps. The project is young, and today apps run only on
hand-built hardware, with no automated tests. That means almost nobody else
can contribute.

This project is the one that opens Oreo to contributors. The OS already
defines a hardware abstraction layer (`oreoOS/api.py`), but several modules
bypass it.

## Expected outcomes

- Close the abstraction-layer leaks: inject dependencies into the launcher,
  and put IR, wifi and battery behind the API.
- A desktop backend on the MicroPython unix port, with a windowed mode and a
  headless mode.
- Scripted button input and a deterministic clock.
- A fake IR bus connecting two simulator instances.
- A pytest harness with golden-image tests, running in CI.

## Stretch goals

- A web-canvas build.
- Wifi and HTTP mocks.
- A video playback fallback.

## Not in scope

- Cycle-accurate ESP32 emulation.
- BLE emulation.
- A new quest protocol.

## Proof of success

- At least 15 of the 21 apps run unmodified.
- Two simulated badges exchange an IR frame.
- Headless CI checks golden images.
- A new contributor builds an app from `app_templates/` without hardware.

## How to start

1. Clone Oreo and read the README. You do not need a badge.
2. Read `oreoOS/api.py`, then find one module that imports hardware directly
   instead of going through it.
3. Install the MicroPython unix port and see how far an app gets before it
   needs hardware.
4. Make a small, reviewed contribution to the repository, then share your
   findings in GitHub Discussions.
