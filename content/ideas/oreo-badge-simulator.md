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
summary: Open Oreo to contributors without hardware by building a desktop simulator with a headless mode that runs badge apps in CI.
in_short: Build a program that runs the Oreo badge's software on an ordinary computer, so people can build and test badge apps without the hardware.
skills:
  - Python and MicroPython
  - pygame or SDL
  - pytest
  - Basic embedded knowledge
related_issues:
  - "64 Running OreoOS apps without hardware"
  - "67 List the modules that import hardware directly"
---

## Description

Oreo is an open MicroPython OS for an ESP32-S3 conference badge: about 22k
lines of Python and 21 apps. The project is young, and today apps run only on
hand-built hardware, with no automated tests, so very few people can
contribute.

The OS already defines a hardware abstraction layer (`oreoOS/api.py`), but
several modules bypass it.

**Impact.** A simulator, a program that runs the badge software on an ordinary
computer, opens Oreo to contributors without hardware and allows automated
tests to check the apps on every change.

## Expected outcomes

- Anyone can run and develop Oreo apps on an ordinary computer, with no
  badge hardware.
- Badge apps are tested automatically on every change.
- The OS reaches the hardware only through its abstraction layer, so the
  simulator and the real badge run the same app code.

## Stretch goals

- A fake IR bus connecting two simulator instances.
- Golden-image tests that compare the screen with saved pictures.
- A web-canvas build.
- Wifi and HTTP mocks.
- A video playback fallback.

## Out of scope

- Cycle-accurate ESP32 emulation.
- BLE emulation.
- A new quest protocol.

## How success is measured

- The launcher receives its dependencies by injection, and IR, wifi and
  battery sit behind `oreoOS/api.py`.
- A desktop backend on the MicroPython unix port runs in a windowed mode and
  a headless mode, with scripted button input and a deterministic clock.
- At least 10 of the 21 apps start and respond to scripted input
  unmodified.
- A pytest harness runs the apps headless in CI on every change.
- A new contributor builds an app from `app_templates/` without hardware.

## Warm-up tasks

1. Clone Oreo and read the README. No badge hardware is required.
2. Read `oreoOS/api.py`, then identify one module that imports hardware
   directly instead of going through it.
3. Install the MicroPython unix port and record how far an app runs before it
   requires hardware.
4. Open a small documentation or test improvement pull request in the repository, and respond to review until it is merged or closed.

## Terms used on this page

- **MicroPython**: a small version of Python for tiny computers.
- **ESP32-S3**: the small computer chip inside the badge.
- **Simulator**: a program that pretends to be the hardware, on an ordinary
  computer.
- **Hardware abstraction layer**: one shared layer of code that apps use to
  talk to the hardware. Here it is `oreoOS/api.py`.
- **Bypass**: code that talks to the hardware directly instead of
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
