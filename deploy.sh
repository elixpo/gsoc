#!/usr/bin/env bash
set -euo pipefail

# Elixpo GSoC site: build and Cloudflare Pages deployment helper.
#
# No secrets are stored in this repository. Deployment uses the maintainer's
# own Wrangler login (`npx wrangler login`) or CLOUDFLARE_API_TOKEN /
# CLOUDFLARE_ACCOUNT_ID already present in the shell.
#
# TODO (maintainer): create the Cloudflare Pages project "elixpo-gsoc", attach
# the gsoc.elixpo.com custom domain in Pages before adding the DNS record, and
# decide whether to move deployment into a trusted GitHub Actions workflow as
# research.elixpo does.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="elixpo-gsoc"
BRANCH="main"
DRY_RUN=false
DO_BUILD=false
DO_DEPLOY=false

usage() {
  cat <<'USAGE'
Usage: ./deploy.sh --pages PHASE... [options]

Phases:
  build       Lint, typecheck, build the static export and run the site check
  deploy      Upload out/ to Cloudflare Pages with Wrangler

Options:
  --branch NAME  Cloudflare Pages branch (default: main = production)
  --dry-run      Print commands without executing them
  -h, --help     Show this help

The launch gate is read from NEXT_PUBLIC_SITE_LAUNCHED at build time. Leave it
unset until launch; set it to "true" only for the launch build.

Examples:
  ./deploy.sh --pages build
  ./deploy.sh --pages build deploy --branch preview
  NEXT_PUBLIC_SITE_LAUNCHED=true ./deploy.sh --pages build deploy
USAGE
}

run() {
  if "$DRY_RUN"; then
    printf '[dry-run]'
    printf ' %q' "$@"
    printf '\n'
  else
    "$@"
  fi
}

build_site() {
  echo "==> Building (NEXT_PUBLIC_SITE_LAUNCHED=${NEXT_PUBLIC_SITE_LAUNCHED:-unset})..."
  run npm run lint
  run npm run typecheck
  run npm run build
  run npm run site:check
  if ! "$DRY_RUN" && [[ ! -f "$SCRIPT_DIR/out/index.html" ]]; then
    echo 'Error: static export out/index.html was not produced.' >&2
    exit 1
  fi
  echo '==> Static export is ready in out/.'
}

deploy_site() {
  if ! "$DRY_RUN" && [[ -n "$(git -C "$SCRIPT_DIR" status --porcelain)" ]]; then
    echo 'Error: commit your changes before deploying.' >&2
    exit 1
  fi
  if ! "$DRY_RUN" && [[ ! -f "$SCRIPT_DIR/out/index.html" ]]; then
    echo 'Error: run the build phase first.' >&2
    exit 1
  fi
  echo "==> Deploying out/ to Cloudflare Pages project $PROJECT_NAME (branch $BRANCH)..."
  run npx wrangler pages deploy out --project-name "$PROJECT_NAME" --branch "$BRANCH"
}

[[ $# -gt 0 ]] || { usage; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pages) ;;
    build) DO_BUILD=true ;;
    deploy) DO_DEPLOY=true ;;
    --branch)
      [[ $# -ge 2 ]] || { echo 'Error: --branch requires a value.' >&2; exit 1; }
      BRANCH="$2"
      shift
      ;;
    --dry-run) DRY_RUN=true ;;
    -h|--help|help) usage; exit 0 ;;
    *) echo "Error: unknown argument: $1" >&2; usage; exit 1 ;;
  esac
  shift
done

"$DO_BUILD" || "$DO_DEPLOY" || { echo 'Error: choose build, deploy, or both.' >&2; exit 1; }
cd "$SCRIPT_DIR"
if "$DO_BUILD"; then build_site; fi
if "$DO_DEPLOY"; then deploy_site; fi
