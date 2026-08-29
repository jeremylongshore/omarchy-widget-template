# Testing Policy: Omarchy Widget Template

## Classification

Repo type: frontend (Omarchy QML plugin template with offline JavaScript model)
Primary languages: QML, JavaScript ES5, Bash
Applicable layers: L1, L2, L3, L5-security, L5-a11y, L6-e2e, L6-visual, L7-acceptance
Waived layers: L4-contract and L4-migration until an instantiated plugin adds an external contract or state schema

## Thresholds

coverage.line: 95
coverage.branch: 90
coverage.function: 95
mutation.kill_rate: 90
flaky.tolerance: 0/3runs
personas.flow_coverage_min: 100
journeys.step_coverage_min: 100

## Required gates

- L1: pre-push plugin gate lane plus pinned GitHub Actions.
- L2: ShellCheck, actionlint, manifest-verified Omarchy gates, and npm audit.
- L3: node:test, c8 coverage, Stryker mutation, exact-commit audit-harness, and three repeated concurrent runs.
- L5: plain and bounded untrusted text, bounded network bodies, fixed argv, keyboard semantics, and accessibility roles in every instantiated plugin.
- L6: Buzz validator, qmllint, actual shell load, IPC toggle, curated screenshot, and a plugin-specific primary-action assertion.
- L7: the plugin-author, end-user, and marketplace-maintainer journeys in this directory.

An instantiated plugin must replace template placeholders in the RTM and extend
the Buzz render with deterministic populated data. A green generic load does
not prove the plugin's integration or primary action.
