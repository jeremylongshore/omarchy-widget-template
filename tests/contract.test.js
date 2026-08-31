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
  assert.equal(manifest.barWidget.description.length, 500)
  assert.equal(manifest.barWidget.description, manifest.description)
  const banner = read("assets/banner.svg")
  assert.match(banner, /<title[^>]*>Widget Name<\/title>/)
  assert.match(banner, /<(?:path|circle)\b/)
  const marketplaceContract = read("contracts/marketplace.md")
  assert.match(marketplaceContract, /\| Claim \| Shipped source \| Executable proof \|/)
  assert.match(marketplaceContract, /exactly\s+500 characters/)
  assert.match(marketplaceContract, /bar or panel/)
  assert.match(marketplaceContract, /trust boundary/)
  assert.match(marketplaceContract, /hash-bound Buzz render receipt/)
  const render = read("scripts/rig-render.sh")
  assert.match(render, /dbus-daemon --session --fork --print-address=1 --print-pid=1/)
  assert.match(render, /export DBUS_SESSION_BUS_ADDRESS/)
  assert.match(render, /export PATH="\\\$OMARCHY_PATH\/bin:\\\$PATH"/)
  assert.match(render, /rig-render: pre-capture hook failed/)
  assert.match(render, /OMARCHY_RIG_RESOLUTION:-1280x720/)
  assert.match(render, /OMARCHY_RIG_SCALE:-1\.25/)
  assert.match(render, /rawShellLogSha256/)
  assert.match(render, /visualInspection:\{status:"pending"/)
  assert.match(render, /refusing to write a clean receipt for a warning-bearing shell log/)
  assert.doesNotMatch(render, /bin preview\.png/,
    "a failed capture must not poison the next source-clean retry")
  assert.match(render, /grim "\\\$SHOT"/)
  assert.match(render, /-path '\.\/e2e\/\*'/)
  assert.match(render, /export PATH="\\\$PLUGIN_DIR\/e2e\/bin:/)
  assert.match(render, /e2e\/bin fixture commands must be executable/)
  const preShellHook = render.indexOf("PRE_HOOK=\\$PLUGIN_DIR/e2e/rig-before-shell.sh")
  const shellStart = render.indexOf("qs -p /root/omarchy/shell")
  const postStartHook = render.indexOf("HOOK=\\$PLUGIN_DIR/e2e/rig-before-capture.sh")
  assert.ok(preShellHook >= 0 && preShellHook < shellStart)
  assert.ok(postStartHook > shellStart)
  assert.doesNotMatch(render, /grim -g|pkill/)

  const approval = read("scripts/approve-preview.sh")
  assert.match(approval, /product value is visible without reading the README/)
  assert.match(approval, /no primary content is clipped/)
  assert.match(approval, /plugin-specific visual identity/)

  const presentationGate = read("scripts/gates/c43-omarchy-marketplace-presentation.sh")
  assert.match(presentationGate, /descriptions tell different product stories/)
  assert.match(presentationGate, /opening sentence is too thin to establish the user outcome/)
  assert.match(presentationGate, /visible bar, panel, pill, or widget/)
  assert.match(presentationGate, /concrete user interaction or visible behavior/)
  assert.match(presentationGate, /privacy, network, data, or write boundary/)
  assert.match(presentationGate, /generic marketing filler/)
  assert.match(presentationGate, /render receipt does not match the current plugin tree/)
  assert.match(presentationGate, /-path '\.\/e2e\/\*'/)
})

test("canonical freshness compares a cloned tree without executable downloads", () => {
  const freshness = read("scripts/check-lane-freshness.sh")
  assert.match(freshness, /git clone --quiet --depth 1 --branch/)
  assert.match(freshness, /sha256sum "\$canonical"/)
  assert.doesNotMatch(freshness, /\bcurl\b|\bwget\b/)
})
