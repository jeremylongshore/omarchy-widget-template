const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const read = (name) => fs.readFileSync(path.join(__dirname, "..", name), "utf8")

test("the bar control exposes a named button role and pointer activation", () => {
  const qml = read("BarWidget.qml")
  assert.match(qml, /Accessible\.role:\s*Accessible\.Button/)
  assert.match(qml, /Accessible\.name:\s*root\.opened\s*\?\s*"Close Widget Name"\s*:\s*"Open Widget Name"/)
  assert.match(qml, /onPressed:\s*function\(b\)/)
})

test("the popup has a real keyboard focus target, close, and tab routing", () => {
  const qml = read("Panel.qml")
  assert.match(qml, /KeyboardPanel\s*{/)
  assert.match(qml, /focusTarget:\s*keyCatcher/)
  assert.match(qml, /PanelKeyCatcher\s*{/)
  assert.match(qml, /onCloseRequested:\s*root\.close\(\)/)
  assert.match(qml, /onTabRequested:\s*function\(direction\)/)
})

test("every external row value is plain text and width bounded", () => {
  const qml = read("Panel.qml")
  for (const property of ["modelData.name", "modelData.value"]) {
    const start = qml.indexOf(`text: ${property}`)
    assert.notEqual(start, -1, `${property} binding is present`)
    const block = qml.slice(start, start + 280)
    assert.match(block, /textFormat:\s*Text\.PlainText/)
    assert.match(block, /width:/)
    assert.match(block, /elide:\s*Text\.ElideRight/)
  }
})
