#!/usr/bin/env bash
# Acceptance lane: validate, lint, load, toggle, and capture the real QML panel.
# Generated plugins must extend rig-render.sh with deterministic integration
# fixture data and an assertion for the plugin's primary action.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
"$REPO_ROOT/scripts/rig-verify.sh" "$REPO_ROOT"
"$REPO_ROOT/scripts/rig-render.sh" "$REPO_ROOT" "$REPO_ROOT/preview.png"
test -s "$REPO_ROOT/preview.png"
jq -e '.sourceDirty == false and .sourcePackageSha256 == .remotePackageSha256' \
  "$REPO_ROOT/.rig-proof.json" >/dev/null
jq -e '.sourceDirty == false and .sourcePackageSha256 == .remotePackageSha256
  and (.previewSha256 | length == 64) and .dimensions == "1280 x 720"
  and .nonblackCoverage >= 0.35 and (.runId | length > 0)
  and (.rawShellLogSha256 | length == 64)
  and .visualInspection.status == "pending"' \
  "$REPO_ROOT/.render-proof.json" >/dev/null
