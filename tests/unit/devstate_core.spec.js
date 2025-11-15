#!/usr/bin/env node
const assert = require('assert')
async function run() {
  process.env.REPO_ROOT = process.cwd()
  const mcp = require('../../server/devstate-server.js')
  const state = await mcp.getState()
  assert(state && state.json, 'state must be present')
  const up = await mcp.updateState({ no_drift: true }, 'unit')
  assert(up && up.ok === true, 'state update ok')
  const ap = await mcp.appendHistory({ actor: 'unit', action: 'append_test', metadata: { rnd: Math.random().toString(36).slice(2) } })
  assert(ap && ap.ok === true, 'append ok')
  const vf = await mcp.verifyHmacChain(0)
  assert(vf && vf.ok === true, 'verify ok')
  console.log('UNIT OK')
}
run().catch((e) => { console.error(e); process.exit(1) })