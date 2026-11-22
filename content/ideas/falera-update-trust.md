---
title: "FaleraOS update trust: signed OTA and App Store"
slug: falera-update-trust
order: 7
theme: Embedded security
size_hours: 175
difficulty: Hard
primary_mentor: Circuit-Overtime
backup_mentor: divyanshuj91
repository: https://github.com/elixpo/falera
setup: https://github.com/elixpo/falera/blob/main/CONTRIBUTING.md
summary: Design and build signed update metadata for FaleraOS, with expiry and key rotation, so OTA updates and App Store installs stay trusted even if TLS fails.
in_short: Make sure a Falera badge only installs updates and apps that Elixpo really signed, even if a server or account is compromised, and prove it with tests.
skills:
  - Python and MicroPython
  - Applied cryptography (signatures, hashes)
  - Threat modelling
  - unittest or pytest
related_issues:
  - "225 FaleraOS update trust: signed metadata, expiry and key rotation for OTA and the App Store"
  - "226 Document the App Store index format"
  - "228 docs(roadmap): reserve OTA and App Store update trust for an outside contributor"
---

## Description

FaleraOS updates itself over the air (`oreoOS/ota.py`) and installs apps from
an App Store index, `apps_market/index.json` (`oreoOS/store.py`). Both trust
whatever arrives over TLS from GitHub. The release manifest that lists every
file's SHA-256 is built by `tools/build_release.py` and is not signed, and
neither is the store index.

Downgrades are already refused: the OS installs only a newer version. What is
missing is protection when the source itself is wrong: a compromised host or
account serving a malicious "newer" release, a stale index frozen in place so
that a fix never arrives, or a leaked signing key with no way to replace it.

The work is reserved for an outside contributor on the project roadmap
([#228](https://github.com/elixpo/falera/pull/228)); maintainers will not build
it before the programme.

**Impact.** A badge that installs software only from signed, fresh metadata
stays safe even when TLS, a server or an account fails. The design also gives
small MicroPython devices a worked example of update trust in the spirit of
TUF and Uptane.

## Expected outcomes

- A small update-trust design, sized for a microcontroller: signed root,
  targets and timestamp metadata, expiry, protection against freeze attacks
  and a path to rotate keys, written up and reviewed before the midterm.
- An on-badge verifier, chosen and benchmarked, that covers OTA updates, App
  Store installs and the `falera` CLI's install path.
- Signing built into the release tooling, with host tests that prove
  tampered, replayed, frozen, expired and wrongly signed metadata is refused.

## Stretch goals

- App capability declarations (network, IR, storage), checked by
  `tools/validate_app.py` and shown to the user at install time.
- Threshold signatures for the root role.

## Out of scope

- Sandboxing apps. MicroPython cannot isolate apps from each other.
- Secure boot and flash encryption on the ESP32-S3.
- Changes to the update channel or the App Store's hosting.

## How success is measured

- The design document is merged before the midterm and names the attacks it
  covers and the ones it does not.
- The verifier choice (pure-Python Ed25519 or a C usermod, since the firmware
  already builds custom usermods) is backed by measured verify time and
  memory on the badge. A maintainer runs the on-badge measurement.
- `tools/build_release.py` and the store index builder sign their output.
- Host tests with throwaway keys show that tampered, replayed, frozen,
  expired and wrongly signed metadata is refused by OTA, the App Store and the
  CLI. No hardware or real keys are needed to run them.
- A key-rotation drill is documented and tested.

## Warm-up tasks

1. Clone Falera, read `CONTRIBUTING.md` and run
   `python3 -m unittest discover -s tests`. No badge hardware is required.
2. Read `oreoOS/ota.py`, `oreoOS/store.py` and `tools/build_release.py`, and
   write down what each one trusts, then {{warm-up-results}}.
3. Take [#226](https://github.com/elixpo/falera/issues/226) (document the App
   Store index format), open a pull request, and respond to review until it is
   merged or closed.

## Terms used on this page

- **OTA (over the air)**: updating a device's software over Wi-Fi.
- **App Store index**: the list of apps a badge can install, with their
  versions and files.
- **Manifest**: a file listing every file in a release and its hash.
- **SHA-256, hash**: a short fingerprint of a file. Any change to the file
  changes the fingerprint.
- **Signature, signing key**: proof, made with a secret key, that a file came
  from its owner and was not changed.
- **TLS**: the encryption that protects web connections (HTTPS).
- **TUF, Uptane**: published designs for trustworthy software updates. Uptane
  adapts TUF for vehicles.
- **Root, targets and timestamp metadata**: separate signed files that say
  which keys to trust, which files are valid, and how fresh the information
  is.
- **Freeze attack**: keeping a device on old metadata so that it never sees a
  fix.
- **Key rotation**: replacing a signing key, for example after a leak.
- **Ed25519**: a modern, fast digital-signature scheme.
- **Usermod**: a module written in C and built into the MicroPython firmware.
- **Threat modelling**: listing who might attack a system, how, and what the
  design must stop.
- **Threshold signatures**: requiring several keys to sign before something
  is trusted.
- **MicroPython, ESP32-S3**: a small version of Python, and the chip inside
  the badge.
