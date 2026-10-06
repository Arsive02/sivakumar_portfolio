#!/usr/bin/env node
/**
 * GLB optimiser: assets-src/models/*.glb → public/models/*.glb
 * dedup → weld → simplify (meshoptimizer) → textures resized to ≤1024 & re-encoded as WebP → meshopt compression.
 * Budget: ≤ 1.5 MB per model. Preview GLBs (*.preview.glb) are skipped.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, EXTMeshoptCompression, EXTTextureWebP } from '@gltf-transform/extensions'
import { dedup, weld, simplify, prune, meshopt, resample, instance } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer'
import { execFileSync } from 'node:child_process'
import draco3d from 'draco3dgltf'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(root, 'assets-src/models')
const dst = path.join(root, 'public/models')
const BUDGET = 1.5 * 1024 * 1024

await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready, MeshoptSimplifier.ready])
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'meshopt.encoder': MeshoptEncoder,
    'meshopt.decoder': MeshoptDecoder,
    'draco3d.decoder': await draco3d.createDecoderModule(), // NASA's JWST ships Draco-compressed
  })

/** Resize textures to ≤1024 and re-encode as WebP; anything sharp can't decode is kept as-is. */
async function webpTextures(doc, label) {
  let converted = false
  for (const tex of doc.getRoot().listTextures()) {
    const img = tex.getImage()
    if (!img) continue
    try {
      const out = execFileSync(process.execPath, [path.join(root, 'scripts/webp-worker.mjs')], { input: Buffer.from(img), maxBuffer: 64 << 20 })
      tex.setImage(new Uint8Array(out)).setMimeType('image/webp')
      if (tex.getURI()) tex.setURI(tex.getURI().replace(/\.[a-z]+$/i, '.webp'))
      converted = true
    } catch (e) {
      console.warn(`  ${label}: kept texture "${tex.getName() || tex.getURI()}" (${e.message.split('\n')[0]})`)
    }
  }
  if (converted) doc.createExtension(EXTTextureWebP).setRequired(true)
}

await fs.mkdir(dst, { recursive: true })
const files = (await fs.readdir(src).catch(() => [])).filter((f) => f.endsWith('.glb') && !f.includes('.preview.'))
if (!files.length) console.log('No refined models in assets-src/models yet.')

for (const f of files) {
  const before = (await fs.stat(path.join(src, f))).size
  let ratio = 0.5
  let bytes = 0
  // Tighten simplification until the model fits the budget (or we hit a floor).
  for (let attempt = 0; attempt < 4; attempt++) {
    const doc = await io.read(path.join(src, f))
    // sharp runs in a child process (scripts/webp-worker.mjs): in-process, libvips fails with
    // "colourspace: parameter space not set" once the gltf-transform/WASM modules are loaded.
    await webpTextures(doc, f)
    await doc.transform(
      dedup(),
      instance(),
      weld(),
      simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.001 * (attempt + 1) }),
      resample(),
      prune(),
      meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
    )
    doc.getRoot().listExtensionsUsed().filter((e) => e.extensionName === 'KHR_draco_mesh_compression').forEach((e) => e.dispose())
    doc.createExtension(EXTMeshoptCompression).setRequired(true)
    await io.write(path.join(dst, f), doc)
    bytes = (await fs.stat(path.join(dst, f))).size
    if (bytes <= BUDGET) break
    ratio *= 0.6
  }
  const mb = (n) => (n / 1048576).toFixed(2) + ' MB'
  console.log(`${f}: ${mb(before)} → ${mb(bytes)}${bytes > BUDGET ? '  ⚠ over budget' : ''}`)
}
