---
title: "Falera Simulator: FaleraOS and its CLI without a badge"
slug: oreo-badge-simulator
order: 6
theme: Embedded, open hardware
size_hours: 175
difficulty: Intermediate
primary_mentor: Circuit-Overtime
backup_mentor: ez-vivek
repository: https://github.com/elixpo/falera
setup: https://github.com/elixpo/falera/blob/main/CONTRIBUTING.md
summary: Run FaleraOS on the MicroPython unix port behind a raw-REPL bridge, so the real falera CLI drives a simulated badge and CI tests both together.
in_short: Build a simulated Falera badge on an ordinary computer that the falera command-line tool can talk to exactly like real hardware, so everything can be tested without a badge.
skills:
  - Python and MicroPython
  - Serial protocols, ptys and MicroPython's raw REPL (mpremote)
  - pygame or SDL (for the windowed backend)
  - unittest or pytest
  - Basic embedded knowledge
related_issues:
  - "64 Falera Simulator: run FaleraOS and the falera CLI end to end without a badge"
  - "67 List the modules that import hardware directly"
  - "227 Read the battery through api.py in home.py"
  - "47 feat: Oreo 2.0 Mega-Refactor, Simulator & Market Apps (prior art)"
---

## Description

Falera is an open MicroPython OS and hardware platform for an ESP32-S3 badge.
Its command-line tool, `falera` (the `falera-cli` package), finds the badge
over USB and installs apps, pushes and pulls files, sets the owner's profile
and sends files to the Transfer app. It talks to the badge only through one
transport, `SerialLink` in `cli/oreo_cli/transport.py`, which drives
MicroPython's raw REPL using the methods `open`, `enter`, `exec`, `restart`,
`close`, `interrupt`, `mount` and `friendly`.

The project has about 600 host tests for the OS and about 350 for the CLI.
`cli/tests/fake.py` and `cli/tests/test_contract.py` already run the CLI's
code snippets in CPython against the real OS modules. What has never happened
is running them on a real MicroPython runtime, over the real raw-REPL
protocol, the way a badge runs them. The contracts between the two sides
(profile keys, the Transfer protocol, the app checks) are therefore only
proven together on a physical badge.

An outside contributor, sea-deep, built a desktop simulator prototype in
CPython and pygame ([#47](https://github.com/elixpo/falera/pull/47)). Parts
of it were merged with credit in
[#196](https://github.com/elixpo/falera/pull/196); the simulator itself was
kept for this project. It is prior art to study, not a base: it runs CPython
rather than MicroPython, and the CLI cannot drive it.

**Impact.** A simulator that the real `falera` tool can connect to as if it
were a badge opens Falera to contributors without hardware, and lets CI test
every change from the command line down to the app on the screen.

## Expected outcomes

- FaleraOS and its apps run on the MicroPython unix port, headless and in a
  window, with a shim standing in for the badge's hardware drivers.
- The real `falera` tool connects to the simulator through a pty that speaks
  raw REPL and raw-paste, including soft and hard resets, exactly as it does
  to a badge.
- CI runs the main `falera` flows (push, pull, profile, transfer, app
  install) against a headless simulator on every change.

The project is **175 hours**: the unix-port runtime with the hardware shim,
the raw-REPL bridge and the `falera` flows in CI. An experienced applicant
may propose an extended **350-hour** version, which adds the windowed backend, golden-frame tests, mpremote `mount`, a
deterministic clock and building or stubbing the C usermods.

## Stretch goals

- The Gallery app plays RV565 clips, the badge's video format, in the
  simulator. The `rv565` package on PyPI already decodes them in Python.
- A fake IR bus connecting two simulator instances.
- Wi-Fi and HTTP mocks for the App Store, OTA updates and weather.
- A web-canvas build.

## Out of scope

- Routing every module through `oreoOS/api.py`. That refactor is warm-up
  work (#67, #227), not part of this project.
- Cycle-accurate ESP32 emulation.
- Bluetooth and BLE emulation.
- Changes to the RV565 format.

## How success is measured

- FaleraOS boots on the MicroPython unix port with a hardware shim, headless,
  and the built-in apps that need no radio start and respond to scripted
  button input.
- `falera` connects to the simulator over a pty, and push, pull, profile,
  transfer and app install pass against it in CI with no hardware.
- The first design question is answered in writing before the midterm:
  whether the unix port's REPL can serve raw REPL and raw-paste as it is, or
  needs a bridge.
- Extended version (350 hours): a windowed backend, golden-frame tests that reuse the
  framebuffer capture behind `falera screenshot`, mpremote `mount`, a
  deterministic clock, and the C usermods (`firmware/usermods/oreo_ir`,
  `oreo_rv565`) built for the unix port or stubbed.
- A new contributor goes from `falera new` to the app running in the
  simulator, following the documentation alone.

## Warm-up tasks

1. Clone Falera and read `CONTRIBUTING.md`. No badge hardware is required.
2. Run `python3 -m unittest discover -s tests` and
   `python3 tools/validate_app.py`. They need only the standard library.
3. Install the CLI from the checkout (`pip install -e cli/`), create an app
   with `falera new my_app`, and read `cli/tests/fake.py` to see how the CLI
   is tested today.
4. Install the MicroPython unix port, try to enter its raw REPL the way
   `SerialLink.enter` does, and record what works, then {{warm-up-results}}.
5. Take a warm-up issue such as #227 or #67, open a pull request, and respond
   to review until it is merged or closed.

## Terms used on this page

- **MicroPython**: a small version of Python for tiny computers.
- **ESP32-S3**: the small computer chip inside the badge.
- **CLI**: a command-line tool. Here it is `falera`, which talks to the badge
  over USB.
- **Raw REPL, raw-paste**: modes of MicroPython's interactive prompt that
  programs use to send code to a board and read the result. `mpremote` is the
  official tool for them, and `falera` uses it as a library.
- **pty**: a pseudo-terminal, a pretend serial port that one program can
  offer to another.
- **MicroPython unix port**: the version of MicroPython that runs on Linux
  and macOS.
- **Shim**: a thin stand-in for a real part, here the badge's hardware
  drivers.
- **CPython**: the standard Python interpreter.
- **Contract**: something both sides must agree on, such as the names of
  profile keys or the messages of the file-transfer protocol.
- **Simulator**: a program that pretends to be the hardware, on an ordinary
  computer.
- **Headless**: running without a window, for automated tests.
- **Golden-frame tests**: tests that compare the screen with a saved,
  known-good picture.
- **Deterministic clock**: a fake clock that tests control, so results are
  always the same.
- **Usermod**: a module written in C and built into the MicroPython firmware.
- **IR**: infrared, the invisible light the badges use to talk to each other.
- **RV565**: the badge's video format, built for small screens.
- **unittest, pytest, pygame, SDL**: unittest and pytest are Python testing
  tools. pygame and SDL are libraries for drawing windows and graphics.
- **CI**: tests that run automatically on every proposed change.
- **Cycle-accurate emulation**: copying the chip's exact behaviour, step by
  step.
- **BLE**: Bluetooth Low Energy.
