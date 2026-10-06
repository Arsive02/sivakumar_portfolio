#!/usr/bin/env node
/**
 * Flute performance: 35.7 MB MP4 → 720p H.264 MP4 + VP9 WebM (+ WebP poster).
 * Audio is kept (it's a music performance) at modest bitrates; the page starts muted and offers unmute.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from '@ffmpeg-installer/ffmpeg'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const input = path.resolve(root, '../sivakumar_portfolio/public/assets/vids/flute_public.mp4')
const out = path.join(root, 'public/media')
await fs.mkdir(out, { recursive: true })

const run = (args) => execFileSync(ffmpeg.path, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
const scale = "scale='min(720,iw)':-2"

console.log('→ mp4 (H.264)')
run(['-i', input, '-vf', scale, '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '96k', path.join(out, 'flute.mp4')])
console.log('→ webm (VP9)')
run(['-i', input, '-vf', scale, '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-c:a', 'libopus', '-b:a', '80k', path.join(out, 'flute.webm')])
console.log('→ poster')
const png = path.join(out, 'flute-poster.png')
run(['-ss', '3', '-i', input, '-frames:v', '1', '-vf', scale, png])
await sharp(png).webp({ quality: 72 }).toFile(path.join(out, 'flute-poster.webp'))
await fs.rm(png)

const before = (await fs.stat(input)).size
for (const f of ['flute.mp4', 'flute.webm', 'flute-poster.webp']) {
  const s = (await fs.stat(path.join(out, f))).size
  console.log(`${f}: ${(s / 1048576).toFixed(2)} MB`)
}
console.log(`source was ${(before / 1048576).toFixed(2)} MB`)
