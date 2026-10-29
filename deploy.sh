#!/usr/bin/env bash
set -euo pipefail

# Elixpo GSoC site build and Cloudflare Pages deployment helper.
# Deployment is delegated to the trusted GitHub Actions workflow so local
# shells never need the production Cloudflare credentials.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPOSITORY="elixpo/gsoc"
WORKFLOW="deploy-cloudflare-pages.yml"
BRANCH="main"
DRY_RUN=false
DO_BUILD=false
DO_DEPLOY=false
PROMOTE=false

usage() {
  cat <<'USAGE'
Usage: ./deploy.sh --pages PHASE... [options]

Phases:
  build       Lint, typecheck, build the static site and run the site check
  deploy      Dispatch the trusted Cloudflare Pages workflow

Options:
  --ref NAME  Git ref to deploy (default: main)
  --promote   Also attach gsoc.elixpo.com after the candidate passes smoke tests
  --dry-run   Print commands without executing them
  -h, --help  Show this help

The launch gate comes from the repository variable SITE_LAUNCHED in GitHub
Actions. Leave it unset until launch; set it to "true" on launch day.
For a local launched build: NEXT_PUBLIC_SITE_LAUNCHED=true ./deploy.sh --pages build

Examples:
  ./deploy.sh --pages build
  ./deploy.sh --pages build deploy
  ./deploy.sh --pages deploy --promote
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
  echo "==> Validating and building (NEXT_PUBLIC_SITE_LAUNCHED=${NEXT_PUBLIC_SITE_LAUNCHED:-unset})..."
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
    echo 'Error: commit and push repository changes before production deployment.' >&2
    exit 1
  fi
  echo "==> Dispatching $WORKFLOW from $BRANCH (promote_domain=$PROMOTE)..."
  run gh workflow run "$WORKFLOW" --repo "$REPOSITORY" --ref "$BRANCH" -f promote_domain="$PROMOTE"
  echo '==> Deployment dispatched. Track it with:'
  echo "    gh run list --repo $REPOSITORY --workflow $WORKFLOW --limit 1"
}

[[ $# -gt 0 ]] || { usage; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pages) ;;
    build) DO_BUILD=true ;;
    deploy) DO_DEPLOY=true ;;
    --ref)
      [[ $# -ge 2 ]] || { echo 'Error: --ref requires a value.' >&2; exit 1; }
      BRANCH="$2"
      shift
      ;;
    --promote) PROMOTE=true ;;
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
