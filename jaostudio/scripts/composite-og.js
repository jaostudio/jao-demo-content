const sharp = require('sharp')
const path = require('path')
const fs = require('fs-extra')

const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'public', 'images', 'og', 'og-home.png')
const OUT = SRC

// SVG overlay: dark gradient at bottom with "Built with care" tagline
const OVERLAY_SVG = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#050505" stop-opacity="0"/>
      <stop offset="55%" stop-color="#050505" stop-opacity="0"/>
      <stop offset="100%" stop-color="#050505" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#fade)"/>
  <text
    x="60"
    y="560"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="42"
    font-weight="500"
    fill="#FAFAFA"
    letter-spacing="-0.02em"
  >Built with care</text>
  <text
    x="60"
    y="595"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="18"
    fill="#A1A1AA"
    letter-spacing="0.02em"
  >JAOstudio — Custom websites, web apps &amp; automation</text>
</svg>
`)

async function main() {
  await fs.ensureDir(path.dirname(OUT))
  const img = sharp(SRC)
  const meta = await img.metadata()
  console.log(`Source: ${SRC} (${meta.width}x${meta.height})`)

  await img
    .composite([{ input: OVERLAY_SVG, top: 0, left: 0 }])
    .png()
    .toFile(OUT + '.tmp')

  await fs.move(OUT + '.tmp', OUT, { overwrite: true })
  const stat = await fs.stat(OUT)
  console.log(`Done: ${OUT} (${Math.round(stat.size / 1024)} KB)`)
}

main().catch((err) => { console.error(err); process.exit(1) })
