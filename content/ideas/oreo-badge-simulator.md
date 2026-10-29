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
in_short: Build a program that runs the Oreo badge's software on an ordinary computer, so people can build and test badge apps without the hardware.
skills:
  - Python and MicroPython
  - pygame or SDL
  - pytest
  - Basic embedded knowledge
related_issues: []
---

## Why this matters

Today, Oreo apps only run on the physical badge, and the badges are
hand-built. So almost nobody else can try or test a change.

A simulator, a program that pretends to be the badge on your own computer,
lets anyone contribute. It also lets automated tests check the apps on every
change.

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

## Words used on this page

- **MicroPython**: a small version of Python for tiny computers.
- **ESP32-S3**: the small computer chip inside the badge.
- **Simulator**: a program that pretends to be the hardware, on an ordinary
  computer.
- **Hardware abstraction layer**: one shared layer of code that apps use to
  talk to the hardware. Here it is `oreoOS/api.py`.
- **Leak, bypass**: code that talks to the hardware directly instead of
  going through that layer.
- **Inject dependencies**: pass in the parts a module needs, so a test or the
  simulator can swap in fakes.
- **IR**: infrared, the invisible light the badges use to talk to each other.
- **MicroPython unix port**: the version of MicroPython that runs on Linux
  and macOS.
- **Headless**: running without a window, for automated tests.
- **Deterministic clock**: a fake clock that tests control, so results are
  always the same.
- **pytest, pygame, SDL**: pytest is a Python testing tool. pygame and SDL
  are libraries for drawing windows and graphics.
- **Golden-image tests**: tests that compare the screen with a saved,
  known-good picture.
- **CI**: tests that run automatically on every proposed change.
- **Cycle-accurate emulation**: copying the chip's exact behaviour, step by
  step.
- **BLE**: Bluetooth Low Energy.
