#!/usr/bin/env node
/**
 * Site icons, structured the way Apple's Icon Composer builds app icons:
 *   background layer   full-bleed gradient (no pre-masking where the OS masks for us)
 *   foreground layers  a translucent phase-shifted wave (depth), the main sine wave with a
 *                      specular edge lit from above, and the point riding the crest with its own
 *                      highlight and a soft contact shadow
 *   appearances        default (light), dark, mono
 *
 * Outputs (public/):
 *   favicon.svg                adaptive light/dark, rounded (browsers don't mask favicons)
 *   icons/mask-icon.svg        mono, for Safari pinned tabs
 *   apple-touch-icon.png       180², unmasked square (iOS applies the corner mask)
 *   icons/icon-192.png, icon-512.png            rounded, for the manifest "any" purpose
 *   icons/icon-maskable-512.png                 full-bleed, content inside the 80% safe zone
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(root, 'public')
await fs.mkdir(path.join(pub, 'icons'), { recursive: true })

const S = 1024
const palettes = {
  dark: { bg0: '#17302c', bg1: '#0b1110', wave: '#2dd4bf', ghost: '#2dd4bf', point: '#ede8de', shadow: '#000' },
  light: { bg0: '#f7f4ee', bg1: '#d9ebe6', wave: '#0f766e', ghost: '#14b8a6', point: '#16140f', shadow: '#0b3b36' },
}

/** One sine period across the icon, centred; `k` scales it (for the maskable safe zone). */
function wavePath(phase = 0, k = 1) {
  const x0 = S / 2 - 340 * k, x1 = S / 2 + 340 * k, A = 150 * k, cy = S / 2 + 30 * k
  let d = ''
  for (let i = 0; i <= 96; i++) {
    const t = i / 96
    const x = x0 + (x1 - x0) * t
    const y = cy - A * Math.sin(t * Math.PI * 2 + phase)
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)} `
  }
  // crest of the main wave (t = 0.25 when phase = 0)
  return { d, crest: { x: x0 + (x1 - x0) * 0.25, y: cy - A } }
}

/** Layers for one appearance. `mask` = draw rounded corners ourselves; `k` = content scale. */
function layers(p, { k = 1, id = 'a' } = {}) {
  const main = wavePath(0, k), ghost = wavePath(0.65, k)
  const r = 76 * k, w = 84 * k
  return `
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.bg0}"/><stop offset="1" stop-color="${p.bg1}"/>
    </linearGradient>
    <linearGradient id="spec-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="pt-${id}" cx=".38" cy=".32" r=".75">
      <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft-${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${18 * k}"/></filter>
  </defs>
  <!-- background layer -->
  <rect width="${S}" height="${S}" fill="url(#bg-${id})"/>
  <!-- background sheen, lit from above -->
  <rect width="${S}" height="${S / 2}" fill="url(#spec-${id})" opacity=".18"/>
  <!-- foreground 1: translucent ghost wave (depth) -->
  <path d="${ghost.d}" fill="none" stroke="${p.ghost}" stroke-width="${w}" stroke-linecap="round" opacity=".28"/>
  <!-- foreground 2: main wave + specular edge -->
  <path d="${main.d}" fill="none" stroke="${p.wave}" stroke-width="${w}" stroke-linecap="round"/>
  <path d="${main.d}" fill="none" stroke="url(#spec-${id})" stroke-width="${w * 0.42}" stroke-linecap="round" transform="translate(0 ${-w * 0.22})" opacity=".55"/>
  <!-- foreground 3: the point on the crest, with contact shadow + highlight -->
  <ellipse cx="${main.crest.x}" cy="${main.crest.y + r * 0.95}" rx="${r * 0.9}" ry="${r * 0.32}" fill="${p.shadow}" opacity=".35" filter="url(#soft-${id})"/>
  <circle cx="${main.crest.x}" cy="${main.crest.y}" r="${r}" fill="${p.point}"/>
  <circle cx="${main.crest.x}" cy="${main.crest.y}" r="${r}" fill="url(#pt-${id})"/>`
}

const svg = (body, { rounded = false } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">${
    rounded ? `<clipPath id="round"><rect width="${S}" height="${S}" rx="${S * 0.225}"/></clipPath><g clip-path="url(#round)">${body}</g>` : body
  }</svg>`

// Adaptive favicon: light by default, dark when the OS prefers dark.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
  <style>.dark{display:none}@media (prefers-color-scheme: dark){.dark{display:inline}.light{display:none}}</style>
  <clipPath id="round"><rect width="${S}" height="${S}" rx="${S * 0.225}"/></clipPath>
  <g clip-path="url(#round)"><g class="light">${layers(palettes.light, { id: 'l' })}</g><g class="dark">${layers(palettes.dark, { id: 'd' })}</g></g>
</svg>`
await fs.writeFile(path.join(pub, 'favicon.svg'), favicon)

// Mono (Safari pinned tab): single colour, shapes only.
const mono = wavePath(0)
await fs.writeFile(
  path.join(pub, 'icons/mask-icon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}"><path d="${mono.d}" fill="none" stroke="#000" stroke-width="84" stroke-linecap="round"/><circle cx="${mono.crest.x}" cy="${mono.crest.y}" r="76"/></svg>`,
)

const png = (body, size, file, opts) => sharp(Buffer.from(svg(body, opts))).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(pub, file))
await png(layers(palettes.dark), 180, 'apple-touch-icon.png') // unmasked: iOS rounds it
await png(layers(palettes.dark), 192, 'icons/icon-192.png', { rounded: true })
await png(layers(palettes.dark), 512, 'icons/icon-512.png', { rounded: true })
await png(layers(palettes.dark, { k: 0.78 }), 512, 'icons/icon-maskable-512.png') // safe-zone content, full bleed

await fs.writeFile(
  path.join(pub, 'manifest.webmanifest'),
  JSON.stringify(
    {
      name: 'Sivakumar Ramakrishnan',
      short_name: 'Sivakumar',
      start_url: '/',
      display: 'standalone',
      background_color: '#0e0d0b',
      theme_color: '#0e0d0b',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  ),
)
console.log('icons written')
