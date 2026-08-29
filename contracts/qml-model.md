# QML to Model Contract

`Panel.qml` may call only top-level ES5 functions that also appear on the node
`module.exports` surface in `Model.js`. The offline contract test derives every
`Model.*()` call from QML and verifies that export. It also proves the manifest,
bar host, and panel share one module ID and every declared entry point resolves
to a repository file.

An instantiated plugin must add captured response fixtures for its external
data contract. Network calls do not belong in the offline suite.
