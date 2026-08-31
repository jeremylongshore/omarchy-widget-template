# Marketplace claim ledger

Replace this template ledger before calling a generated plugin submission-ready.
Every meaningful listing claim needs a shipped source and an executable proof.
Do not infer behavior from a mockup, README, test name, or intended design.

| Claim | Shipped source | Executable proof |
|---|---|---|
| Visible bar outcome and primary panel action | `BarWidget.qml`, `Panel.qml` | plugin-specific contract and interaction tests |
| Data source, scope, cadence, and bounds | service QML, `Model.js`, or shipped helper | fixture-backed unit, boundary, and failure tests |
| Local writes, network use, credentials, and explicit exclusions | every shipped runtime path | security contract tests plus canonical gates |
| Marketplace image tells the same product story | `assets/banner.svg`, deterministic E2E fixture | hash-bound Buzz render receipt and visual approval |

The final description and `barWidget.description` must be identical, exactly
500 characters, name the product, explain what appears in the bar or panel,
state what the user can do, and disclose the material trust boundary. Replace
this file's generic rows with the plugin's exact claims, source paths, and test
names.
