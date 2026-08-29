const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const Model = require("../Model.js")

// TEMPLATE: capture real API responses into tests/fixtures/ and load them
// here. Tests run against captured bodies, never the network.
const fixture = (name) =>
  fs.readFileSync(path.join(__dirname, "fixtures", name), "utf8")

test("clean strips angle brackets so AutoText can never promote to StyledText", () => {
  assert.equal(Model.clean('<img src="http://x/y.png">Bo'), 'img src="http://x/y.png"Bo')
})

test("clean strips control characters", () => {
  assert.equal(Model.clean("a\x00b\x1fc\x7fd"), "abcd")
})

test("clean caps pathological length", () => {
  assert.equal(Model.clean("x".repeat(500), 64).length, 64)
})

test("clean tolerates null and undefined", () => {
  assert.equal(Model.clean(null), "")
  assert.equal(Model.clean(undefined), "")
})

test("parseExample returns [] on malformed input, keeping last-good state", () => {
  assert.deepEqual(Model.parseExample("not json"), [])
  assert.deepEqual(Model.parseExample(""), [])
  assert.deepEqual(Model.parseExample(null), [])
  assert.deepEqual(Model.parseExample("null"), [])
  assert.deepEqual(Model.parseExample("[]"), [])
})

test("parseExample maps rows through clean", () => {
  const rows = Model.parseExample(JSON.stringify([{ name: "<b>alpha</b>", value: "1" }]))
  assert.equal(rows.length, 1)
  assert.equal(rows[0].name, "balpha/b")
})

test("parseExample maps every row and bounds both fields", () => {
  const rows = Model.parseExample(JSON.stringify([
    { name: "n".repeat(80), value: "v".repeat(40) },
    { name: "second", value: "2" }
  ]))
  assert.equal(rows.length, 2)
  assert.equal(rows[0].name.length, 32)
  assert.equal(rows[0].value.length, 16)
  assert.deepEqual(rows[1], { name: "second", value: "2" })
})

test("pillText is empty when there is nothing to say", () => {
  assert.equal(Model.pillText([]), "")
  assert.equal(Model.pillText(null), "")
})

test("pillText returns a bounded first-row label", () => {
  assert.equal(Model.pillText([{ name: "x".repeat(40) }]), "x".repeat(24))
})

test("tooltipText reports the row count and tolerates empty input", () => {
  assert.equal(Model.tooltipText([{ name: "one" }, { name: "two" }]), "2 item(s)")
  assert.equal(Model.tooltipText([]), "")
  assert.equal(Model.tooltipText(null), "")
})
