#!/usr/bin/env node
/**
 * Responsive images: v1 site's PNG/JPGs → public/media/img/<name>-<w>.{avif,webp}
 * Also copies PDFs into public/docs (they're linked, never embedded).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const legacy = path.resolve(root, '../sivakumar_portfolio/public')
const out = path.join(root, 'public/media/img')
const WIDTHS = [480, 960, 1600, 2400]

await fs.mkdir(out, { recursive: true })
const sources = [
  ...(await fs.readdir(path.join(legacy, 'assets/imgs'))).map((f) => path.join(legacy, 'assets/imgs', f)),
  path.join(legacy, 'img/ProfilePic_6-Photoroom.png'),
  path.join(legacy, 'img/pro_pic.jpg'),
  // New portrait: background removed (rembg), mirrored, on black. Source in assets-src/img.
  path.join(root, 'assets-src/img/profile.png'),
].filter((f) => /\.(png|jpe?g)$/i.test(f))

let before = 0, after = 0
const manifest = {}
for (const file of sources) {
  const name = path.basename(file).replace(/\.[^.]+$/, '')
  const img = sharp(file).rotate()
  const meta = await img.metadata()
  before += (await fs.stat(file)).size
  // Diagrams and screenshots (few distinct colours, hard edges, text) get lossless WebP and no
  // AVIF: lossy codecs smear their text. Photos get high-quality AVIF + WebP.
  const { data: px } = await img.clone().resize(96, 96, { fit: 'inside' }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const colours = new Set()
  for (let i = 0; i < px.length; i += 3) colours.add((px[i] >> 3) << 10 | (px[i + 1] >> 3) << 5 | px[i + 2] >> 3)
  const diagram = colours.size < 900
  // Every standard width that fits, plus the native width itself, so HiDPI screens never get an
  // upscaled file.
  const widths = [...new Set([...WIDTHS.filter((w) => w < meta.width * 0.95), meta.width])].sort((a, b) => a - b)
  manifest[name] = { w: meta.width, h: meta.height, widths, avif: [] }
  for (const w of widths) {
    const base = path.join(out, `${name}-${w}`)
    const lossy = await img.clone().resize({ width: w }).webp({ quality: 88, effort: 6 }).toBuffer()
    // Lossless only pays off for flat diagrams: keep it when it's at most 1.8x the lossy size.
    const lossless = diagram ? await img.clone().resize({ width: w }).webp({ lossless: true, effort: 6 }).toBuffer() : null
    const useLossless = !!lossless && lossless.length <= lossy.length * 1.8
    await fs.writeFile(`${base}.webp`, useLossless ? lossless : lossy)
    if (!useLossless) {
      await img.clone().resize({ width: w }).avif({ quality: 72, effort: 6 }).toFile(`${base}.avif`)
      after += (await fs.stat(`${base}.avif`)).size
      manifest[name].avif.push(w) // lossless widths ship WebP only
    } else after += lossless.length
  }
}
await fs.writeFile(path.join(root, 'src/content/images.json'), JSON.stringify(manifest, null, 1))

// PDFs → public/docs (resume renamed to a URL-safe name)
const docs = path.join(root, 'public/docs')
await fs.mkdir(docs, { recursive: true })
for (const f of await fs.readdir(path.join(legacy, 'certificates'))) if (f.endsWith('.pdf')) await fs.copyFile(path.join(legacy, 'certificates', f), path.join(docs, f))
await fs.copyFile(path.join(legacy, 'img/Sivakumar Ramakrishnan Resume.pdf'), path.join(docs, 'Sivakumar_Ramakrishnan_Resume.pdf'))

const mb = (n) => (n / 1048576).toFixed(2) + ' MB'
console.log(`${sources.length} images: ${mb(before)} → ${mb(after)} (AVIF, all widths)`)
