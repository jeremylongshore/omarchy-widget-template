# Requirements Traceability Matrix: Omarchy Widget Template

| ID | Priority | Requirement | Layers | Evidence |
|---|---|---|---|---|
| REQ-TPL-001 | MUST | Model parsing is deterministic, sanitizes external strings, bounds length, and fails closed | L3, L5 | `tests/model.test.js` |
| REQ-TPL-002 | MUST | Gate output is exactly one schema-valid verdict and all malformed/crashed outputs block | L1, L3 | `tests/gate-runner.test.js` |
| REQ-TPL-003 | MUST | Vendored gates come only from a clean, complete canonical commit | L1, L3 | `tests/gate-sync.test.js`, `scripts/gates/.lane-manifest` |
| REQ-TPL-004 | MUST | CI actions are immutable and permissions are least privilege | L1, L2 | `.github/workflows/` |
| REQ-TPL-005 | MUST | Coverage, mutation, race stability, audit, and shell lint remain enforced | L1, L2, L3 | `package.json`, `tests/TESTING.md`, CI |
| REQ-TPL-006 | MUST | Buzz validator and qmllint receipts bind the exact clean source package | L6, L7 | `scripts/rig-verify.sh`, `e2e/buzz.sh` |
| REQ-TPL-007 | MUST | The rendered preview binds the exact clean package, image hash, dimensions, and evidence boundary | L6, L7 | `scripts/rig-render.sh`, `e2e/buzz.sh` |
| REQ-TPL-008 | MUST | Each generated plugin replaces placeholders and proves its populated primary action | L6, L7 | plugin-specific tests and render extension |
| REQ-TPL-009 | MUST | Interactive controls expose accessible names/roles and the popup supports close and tab keyboard routing | L5, L7 | `tests/a11y.test.js` |
| REQ-TPL-010 | MUST | QML calls only exported Model functions and all identity/entry-point contracts resolve | L4, L6 | `tests/contract.test.js`, `contracts/qml-model.md` |
