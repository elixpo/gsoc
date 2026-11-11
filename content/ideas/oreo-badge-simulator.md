---
title: Oreo badge simulator and CLI test bench
slug: oreo-badge-simulator
order: 5
theme: Embedded, open hardware
size_hours: 175
difficulty: Intermediate
primary_mentor: Circuit-Overtime
backup_mentor: ez-vivek
repository: https://github.com/elixpo/oreo
setup: https://github.com/elixpo/oreo/blob/main/CONTRIBUTING.md
summary: Run the Oreo badge's OS and apps on a computer, and let the oreo CLI drive that simulated badge so CI tests the whole path without hardware.
in_short: Build a program that runs the Oreo badge's software on an ordinary computer and answers the oreo command-line tool like a real badge, so people can build and test without the hardware.
skills:
  - Python and MicroPython
  - pygame or SDL
  - Serial protocols and MicroPython's raw REPL (mpremote)
  - unittest or pytest
  - Basic embedded knowledge
related_issues:
  - "64 Running OreoOS apps without hardware"
  - "67 List the modules that import hardware directly"
---

## Description

Oreo is an open MicroPython OS for an ESP32-S3 conference badge: about 39,000
lines of MicroPython across the OS, the drivers and 20 built-in apps, with 11
more apps in its App Store. Since November 2026 it also has a released
command-line tool, `oreo` (oreo-cli 1.0.0, about 12,700 lines of Python). The
tool finds the badge over USB and installs apps, sends files to the Transfer
app, sets the owner's profile and updates the OS, all through MicroPython's
raw REPL.

The project has 407 host tests for the OS and 313 for the CLI, using only the
standard library, plus an app validator that runs on every pull request. They
test pieces with fakes. Nothing runs a whole app, and nothing runs the CLI
against a running OS. The two sides share contracts (profile keys, the
Transfer protocol, the app checks, the screens the CLI shows on the badge),
and today those are checked together only on a physical badge.

The OS already defines a hardware abstraction layer (`oreoOS/api.py`), but
several modules bypass it.

**Impact.** A simulator that runs the badge software on an ordinary computer,
and that the `oreo` tool can connect to as if it were a badge, opens Oreo to
contributors without hardware. It also lets CI test every change from the
command line down to the app on the screen.

## Expected outcomes

- Anyone can run OreoOS and its apps on an ordinary computer, in a window or
  headless, with no badge hardware.
- The `oreo` tool works against the simulator as it does against a badge, so
  the contracts between the CLI and the OS are tested end to end on every
  change.
- The OS reaches the hardware only through its abstraction layer, so the
  simulator and the real badge run the same app code.

## Stretch goals

- Golden-image tests that compare the screen with saved pictures.
- The Gallery app plays RV565 clips, the badge's video format, in the
  simulator. The `rv565` package on PyPI already decodes them in Python.
- A fake IR bus connecting two simulator instances.
- Wi-Fi and HTTP mocks for the App Store, OTA updates and weather.
- A web-canvas build.

## Out of scope

- Cycle-accurate ESP32 emulation.
- Bluetooth and BLE emulation. Bluetooth is the project's last planned
  feature.
- A new quest protocol, or changes to the RV565 format.

## How success is measured

- The launcher receives its dependencies by injection, and IR, Wi-Fi and
  battery sit behind `oreoOS/api.py` (#67).
- A desktop backend on the MicroPython unix port runs in a windowed mode and
  a headless mode, with scripted button input and a deterministic clock.
- At least 10 of the 20 built-in apps start and respond to scripted input
  unmodified.
- `oreo` connects to a simulated badge, and `oreo info`, `oreo app install`,
  `oreo push`, `oreo pull`, `oreo setup` and `oreo transfer send` pass
  against it in CI.
- A new contributor goes from `oreo new` to the app running in the simulator
  without hardware, following the documentation alone.

## Warm-up tasks

1. Clone Oreo and read `CONTRIBUTING.md`. No badge hardware is required.
2. Run `python3 -m unittest discover -s tests` and
   `python3 tools/validate_app.py`. They need only the standard library.
3. Install the CLI from the checkout (`pip install -e cli/`), create an app
   with `oreo new my_app`, and list which `oreo` commands would need a badge
   to go further.
4. Read `oreoOS/api.py`, then identify one module that imports hardware
   directly instead of going through it.
5. Install the MicroPython unix port and record how far an app runs before it
   requires hardware.
6. Open a small documentation or test pull request in the repository (for
   example #65 or #66), and respond to review until it is merged or closed.

## Terms used on this page

- **MicroPython**: a small version of Python for tiny computers.
- **ESP32-S3**: the small computer chip inside the badge.
- **CLI**: a command-line tool. Here it is `oreo`, which talks to the badge
  over USB.
- **Raw REPL**: the mode of MicroPython's interactive prompt that programs
  use to send code to a board and read the result. `mpremote` is the
  official tool for it, and `oreo` uses it as a library.
- **Contract**: something both sides must agree on, such as the names of
  profile keys or the messages of the file-transfer protocol.
- **Simulator**: a program that pretends to be the hardware, on an ordinary
  computer.
- **Hardware abstraction layer**: one shared layer of code that apps use to
  talk to the hardware. Here it is `oreoOS/api.py`.
- **Bypass**: code that talks to the hardware directly instead of
  going through that layer.
- **Inject dependencies**: pass in the parts a module needs, so a test or the
  simulator can swap in fakes.
- **IR**: infrared, the invisible light the badges use to talk to each other.
- **RV565**: the badge's video format, built for small screens.
- **MicroPython unix port**: the version of MicroPython that runs on Linux
  and macOS.
- **Headless**: running without a window, for automated tests.
- **Deterministic clock**: a fake clock that tests control, so results are
  always the same.
- **unittest, pytest, pygame, SDL**: unittest and pytest are Python testing
  tools. pygame and SDL are libraries for drawing windows and graphics.
- **Golden-image tests**: tests that compare the screen with a saved,
  known-good picture.
- **CI**: tests that run automatically on every proposed change.
- **Cycle-accurate emulation**: copying the chip's exact behaviour, step by
  step.
- **BLE**: Bluetooth Low Energy.
