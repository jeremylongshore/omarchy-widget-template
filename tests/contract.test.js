const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const root = path.join(__dirname, "..")
const read = (name) => fs.readFileSync(path.join(root, name), "utf8")
const Model = require("../Model.js")

test("every Model function called by QML exists on the node/QML export surface", () => {
  const qml = read("Panel.qml")
  const called = [...qml.matchAll(/Model\.([A-Za-z][A-Za-z0-9_]*)\s*\(/g)].map((match) => match[1])
  assert.ok(called.length > 0)
  for (const name of new Set(called)) assert.equal(typeof Model[name], "function", name)
})

test("manifest, bar host, and panel use one module id", () => {
  const manifestId = JSON.parse(read("manifest.json")).id
  for (const file of ["BarWidget.qml", "Panel.qml"]) {
    assert.match(read(file), new RegExp(`moduleName: "${manifestId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`))
  }
})

test("manifest entry points exist and stay inside the repository root", () => {
  const manifest = JSON.parse(read("manifest.json"))
  for (const entry of Object.values(manifest.entryPoints)) {
    const resolved = path.resolve(root, entry)
    assert.ok(resolved.startsWith(root + path.sep))
    assert.equal(fs.statSync(resolved).isFile(), true)
  }
})

test("template makes marketplace presentation requirements impossible to overlook", () => {
  const manifest = JSON.parse(read("manifest.json"))
  assert.equal(manifest.description.length, 500)
  const banner = read("assets/banner.svg")
  assert.match(banner, /<title[^>]*>Widget Name<\/title>/)
  assert.match(banner, /<(?:path|circle)\b/)
  const render = read("scripts/rig-render.sh")
  assert.match(render, /OMARCHY_RIG_RESOLUTION:-1280x720/)
  assert.match(render, /rawShellLogSha256/)
  assert.match(render, /refusing to write a clean receipt for a warning-bearing shell log/)
  assert.match(render, /grim "\\\$SHOT"/)
  assert.doesNotMatch(render, /grim -g|pkill/)
})
