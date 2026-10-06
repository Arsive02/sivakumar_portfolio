// stdin: image bytes → stdout: WebP ≤1024px. Run in its own process so sharp/libvips
// is isolated from the WASM modules loaded by the model optimiser.
import sharp from 'sharp'

const chunks = []
for await (const c of process.stdin) chunks.push(c)
const out = await sharp(Buffer.concat(chunks))
  .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 82, effort: 5 })
  .toBuffer()
process.stdout.write(out)
