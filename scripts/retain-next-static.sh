#!/usr/bin/env bash
set -euo pipefail

: "${GH_REPO:?Set GH_REPO to the GitHub repository that owns the deployments}"

destination=out/_next/static
current_artifact=next-static-current
legacy_artifact=github-pages
workflow=.github/workflows/deploy.yml

if [[ ! -d "$destination" ]]; then
  echo "Expected Next.js export assets at $destination" >&2
  exit 1
fi

recent_runs=$(gh api --method GET "repos/$GH_REPO/actions/workflows/deploy.yml/runs" \
  -f branch=main -f status=success -f per_page=3 \
  --jq '.workflow_runs[] | [.id, .head_sha] | @tsv')

temporary=$(mktemp -d)
trap 'rm -rf -- "$temporary"' EXIT

while IFS=$'\t' read -r run sha; do
  [[ -n "$run" ]] || continue
  echo "Checking assets for deployment run $run ($sha)"
  artifacts=$(gh api --paginate "repos/$GH_REPO/actions/runs/$run/artifacts" \
    --jq '.artifacts[] | [.name, .expired] | @tsv')
  restore="$temporary/$run"

  if grep -Fxq "$current_artifact"$'\tfalse' <<< "$artifacts"; then
    gh run download "$run" --repo "$GH_REPO" --name "$current_artifact" --dir "$restore"
    source="$restore"
  elif grep -Fxq "$legacy_artifact"$'\tfalse' <<< "$artifacts"; then
    # A newer Pages artifact can contain inherited files. Only legacy exports
    # can safely substitute for the current-only archive without extending retention.
    deployed_workflow=$(gh api -H 'Accept: application/vnd.github.raw+json' \
      "repos/$GH_REPO/contents/$workflow?ref=$sha")
    if [[ "$deployed_workflow" == *"name: $current_artifact"* ]]; then
      echo "Run $run has no available current-only asset archive. Skipping."
      continue
    fi

    gh run download "$run" --repo "$GH_REPO" --name "$legacy_artifact" --dir "$restore"
    tar -xf "$restore/artifact.tar" -C "$restore" ./_next/static
    source="$restore/_next/static"
  else
    echo "Run $run has no available asset archive. It may have expired. Skipping."
    continue
  fi

  # The export and the newest restored build win any filename collisions.
  cp -an "$source/." "$destination/"
  echo "Restored hashed assets from run $run"
done <<< "$recent_runs"
