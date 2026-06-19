/**
 * Downloads all CS2 minimap images from totalcsgo.com into ./downloaded-maps/
 * then upload that folder to your R2 bucket at:
 *   cnd.thaprophet.eu/images/cs2/minimaps/
 *
 * Usage:
 *   node scripts/download-maps.mjs
 *
 * Upload to R2 (using wrangler):
 *   for f in downloaded-maps/*.png; do
 *     wrangler r2 object put YOUR_BUCKET/images/cs2/minimaps/$(basename $f) --file $f
 *   done
 */

import { createWriteStream } from 'fs'
import { mkdir } from 'fs/promises'
import { pipeline } from 'stream/promises'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dir, '..', 'downloaded-maps')

const MAPS = [
  { name: 'ancient',     url: 'https://static.totalcsgo.com/totalcsgo-strapi/ancient_e1cd37a9c9.png' },
  { name: 'anubis',      url: 'https://static.totalcsgo.com/totalcsgo-strapi/de_anubis_radar_annotated_5976c09e20.png' },
  { name: 'cache',       url: 'https://static.totalcsgo.com/totalcsgo-strapi/cache_5a5bb344bb.png' },
  { name: 'cobblestone', url: 'https://static.totalcsgo.com/totalcsgo-strapi/cobblestone_85b0d69929.png' },
  { name: 'dust2',       url: 'https://static.totalcsgo.com/totalcsgo-strapi/dust2_ef3240573c.png' },
  { name: 'inferno',     url: 'https://static.totalcsgo.com/totalcsgo-strapi/inferno_0db58dbab1.png' },
  { name: 'mirage',      url: 'https://static.totalcsgo.com/totalcsgo-strapi/mirage_11347b32ec.png' },
  { name: 'nuke',        url: 'https://static.totalcsgo.com/totalcsgo-strapi/nuke_1ddbc08495.png' },
  { name: 'overpass',    url: 'https://static.totalcsgo.com/totalcsgo-strapi/overpass_9132996be5.png' },
  { name: 'train',       url: 'https://static.totalcsgo.com/totalcsgo-strapi/train_5e06a21f04.png' },
  { name: 'vertigo',     url: 'https://static.totalcsgo.com/totalcsgo-strapi/vertigo_3cbf64fa88.png' },
]

await mkdir(outDir, { recursive: true })
console.log(`📂 Saving to: ${outDir}\n`)

for (const { name, url } of MAPS) {
  const dest = join(outDir, `${name}.png`)
  process.stdout.write(`⬇  ${name.padEnd(14)}`)
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://totalcsgo.com/',
      }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await pipeline(res.body, createWriteStream(dest))
    const { statSync } = await import('fs')
    const kb = (statSync(dest).size / 1024).toFixed(0)
    console.log(`✓  ${kb} KB`)
  } catch (err) {
    console.log(`✗  ${err.message}`)
  }
}

console.log(`
✅ Done! Now upload to R2:

  Using Wrangler CLI:
  for f in downloaded-maps/*.png; do
    wrangler r2 object put YOUR_BUCKET_NAME/images/cs2/minimaps/$(basename $f) --file "$f" --content-type image/png
  done

  Or drag-and-drop via the Cloudflare dashboard into:
  YOUR_BUCKET → images/cs2/minimaps/
`)
