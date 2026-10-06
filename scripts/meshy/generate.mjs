#!/usr/bin/env node
/**
 * Meshy text-to-3D pipeline. Runs offline only — the API key never reaches the client bundle.
 *
 *   node scripts/meshy/generate.mjs preview [name ...]   # cheap untextured previews → assets-src/models/<name>.preview.glb
 *   node scripts/meshy/generate.mjs refine  <name ...>   # textured refine of an approved preview → assets-src/models/<name>.glb
 *   node scripts/meshy/generate.mjs image <name> <url>   # image-to-3D (textured) from a reference photo → assets-src/models/<name>.glb
 *   node scripts/meshy/generate.mjs status               # show task ids / states
 *
 * Key: MESHY_API from the environment or from ../.env (Portfolio/.env).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../..')
const outDir = path.join(root, 'assets-src/models')
const stateFile = path.join(here, 'tasks.json')
const API = 'https://api.meshy.ai/openapi/v2/text-to-3d'
const IMAGE_API = 'https://api.meshy.ai/openapi/v1/image-to-3d'

async function loadKey() {
  if (process.env.MESHY_API) return process.env.MESHY_API
  for (const p of [path.join(root, '.env'), path.join(root, '../.env')]) {
    try {
      const m = (await fs.readFile(p, 'utf8')).match(/^\s*MESHY_API\s*=\s*"?([^"\r\n]+)"?/m)
      if (m) return m[1].trim()
    } catch {}
  }
  throw new Error('MESHY_API not found in env or .env')
}

const readJSON = async (p, fallback) => JSON.parse(await fs.readFile(p, 'utf8').catch(() => JSON.stringify(fallback)))
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function api(key, method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status}: ${text.slice(0, 400)}`)
  return JSON.parse(text)
}

async function poll(key, id, label, base = API) {
  for (;;) {
    const t = await api(key, 'GET', `${base}/${id}`)
    process.stdout.write(`\r  ${label}: ${t.status} ${t.progress ?? 0}%   `)
    if (t.status === 'SUCCEEDED') return process.stdout.write('\n'), t
    if (t.status === 'FAILED' || t.status === 'CANCELED') throw new Error(`${label} ${t.status}: ${JSON.stringify(t.task_error ?? {})}`)
    await sleep(8000)
  }
}

async function download(url, file) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download ${res.status}`)
  await fs.writeFile(file, Buffer.from(await res.arrayBuffer()))
  const kb = ((await fs.stat(file)).size / 1024).toFixed(0)
  console.log(`  saved ${path.relative(root, file)} (${kb} KB)`)
}

async function main() {
  const [cmd = 'status', ...names] = process.argv.slice(2)
  const prompts = await readJSON(path.join(here, 'prompts.json'), {})
  const state = await readJSON(stateFile, {})
  const save = () => fs.writeFile(stateFile, JSON.stringify(state, null, 2))
  await fs.mkdir(outDir, { recursive: true })

  if (cmd === 'status') return console.table(state)
  const key = await loadKey()
  const targets = names.length ? names : Object.keys(prompts).filter((n) => !n.startsWith('_'))

  if (cmd === 'preview') {
    // Start all previews in parallel, then poll each.
    for (const name of targets) {
      const p = prompts[name]
      if (!p) throw new Error(`no prompt named "${name}"`)
      const { result } = await api(key, 'POST', API, {
        mode: 'preview',
        prompt: p.prompt,
        negative_prompt: p.negative_prompt,
        art_style: p.art_style ?? 'realistic',
        topology: 'triangle',
        target_polycount: 30000,
        should_remesh: true,
      })
      state[name] = { ...state[name], preview: result }
      await save()
      console.log(`started preview ${name}: ${result}`)
    }
    for (const name of targets) {
      const t = await poll(key, state[name].preview, `${name} preview`)
      await download(t.model_urls.glb, path.join(outDir, `${name}.preview.glb`))
      if (t.thumbnail_url) await download(t.thumbnail_url, path.join(outDir, `${name}.preview.png`))
    }
  } else if (cmd === 'refine') {
    if (!names.length) throw new Error('refine needs explicit names — only refine previews you approved')
    for (const name of targets) {
      if (!state[name]?.preview) throw new Error(`no preview task for "${name}" — run preview first`)
      const { result } = await api(key, 'POST', API, { mode: 'refine', preview_task_id: state[name].preview, enable_pbr: true })
      state[name].refine = result
      await save()
      console.log(`started refine ${name}: ${result}`)
    }
    for (const name of targets) {
      const t = await poll(key, state[name].refine, `${name} refine`)
      await download(t.model_urls.glb, path.join(outDir, `${name}.glb`))
      if (t.thumbnail_url) await download(t.thumbnail_url, path.join(outDir, `${name}.png`))
    }
    console.log('\nNext: npm run assets:models')
  } else if (cmd === 'image') {
    const [name, imageUrl] = names
    if (!name || !imageUrl) throw new Error('usage: image <name> <public url | local .jpg/.png>')
    // Local files are sent inline as a data URI.
    const image_url = /^https?:/.test(imageUrl)
      ? imageUrl
      : `data:image/${imageUrl.endsWith('.png') ? 'png' : 'jpeg'};base64,${(await fs.readFile(path.resolve(imageUrl))).toString('base64')}`
    const { result } = await api(key, 'POST', IMAGE_API, {
      image_url,
      enable_pbr: true,
      should_remesh: true,
      should_texture: true,
      topology: 'triangle',
      target_polycount: 30000,
    })
    state[name] = { ...state[name], image: result, source: /^https?:/.test(imageUrl) ? imageUrl : path.basename(imageUrl) }
    await save()
    console.log(`started image-to-3d ${name}: ${result}`)
    const t = await poll(key, result, `${name} image-to-3d`, IMAGE_API)
    await download(t.model_urls.glb, path.join(outDir, `${name}.glb`))
    if (t.thumbnail_url) await download(t.thumbnail_url, path.join(outDir, `${name}.png`))
  } else throw new Error(`unknown command "${cmd}"`)
}

main().catch((e) => {
  console.error('\n' + e.message)
  process.exit(1)
})
