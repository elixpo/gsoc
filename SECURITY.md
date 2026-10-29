# Security policy

This repository builds a static website with no server, no accounts and no
user data. The most likely issues are a compromised dependency, a workflow
that could leak a token, or content injected into the built pages.

## Reporting a vulnerability

Do not open a public issue for an unpatched vulnerability. Use GitHub's
private vulnerability reporting for this repository if it is enabled, or
email gsoc@elixpo.com with the subject **Security report**. Include the
affected file or page, the impact and steps to reproduce.

A vulnerability in an Elixpo project linked from the site (LixBlogs,
LixSketch, Crumb, Elixpo Open Source, Oreo) belongs to that project: follow
the `SECURITY.md` in its repository.

Broken links and content mistakes are not security issues. Open an issue or
a pull request instead.

## Supported scope

The `main` branch and the deployed site at https://gsoc.elixpo.com.
