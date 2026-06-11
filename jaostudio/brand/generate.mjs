import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const BG = '#050505'
const PURPLE = '#7C3AED'
const PURPLE_LIGHT = '#8B5CF6'
const AMBER = '#D97706'
const TEXT = '#E4E4E7'
const TEXT_DIM = '#A1A1AA'

function celestialMark(cx, cy, s) {
  return `
    <defs>
      <radialGradient id="sg${cx}" cx="50%" cy="50%" r="35%">
        <stop offset="0%" stop-color="${PURPLE}" stop-opacity="0.3" />
        <stop offset="60%" stop-color="${PURPLE}" stop-opacity="0.06" />
        <stop offset="100%" stop-color="${PURPLE}" stop-opacity="0" />
      </radialGradient>
      <filter id="gl${cx}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="${3 * s}" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <circle cx="${cx - 11 * s}" cy="${cy - 12 * s}" r="${0.3 * s}" fill="${TEXT_DIM}" opacity="0.25" />
    <circle cx="${cx + 12 * s}" cy="${cy - 13 * s}" r="${0.2 * s}" fill="${TEXT_DIM}" opacity="0.2" />
    <circle cx="${cx - 13 * s}" cy="${cy + 11 * s}" r="${0.25 * s}" fill="${TEXT_DIM}" opacity="0.2" />
    <circle cx="${cx + 11 * s}" cy="${cy + 12 * s}" r="${0.2 * s}" fill="${TEXT_DIM}" opacity="0.18" />
    <circle cx="${cx - 6 * s}" cy="${cy - 14 * s}" r="${0.15 * s}" fill="${AMBER}" opacity="0.3" />
    <circle cx="${cx + 8 * s}" cy="${cy + 14 * s}" r="${0.15 * s}" fill="${AMBER}" opacity="0.25" />
    <circle cx="${cx}" cy="${cy}" r="${12 * s}" fill="url(#sg${cx})" />
    <ellipse cx="${cx}" cy="${cy}" rx="${8.5 * s}" ry="${3.5 * s}" transform="rotate(-20 ${cx} ${cy})"
      stroke="${TEXT_DIM}" stroke-width="${0.25 * s}" opacity="0.12" fill="none" />
    <ellipse cx="${cx}" cy="${cy}" rx="${12.5 * s}" ry="${5.5 * s}" transform="rotate(15 ${cx} ${cy})"
      stroke="${TEXT_DIM}" stroke-width="${0.2 * s}" opacity="0.08" fill="none" />
    <circle cx="${cx}" cy="${cy}" r="${2.5 * s}" fill="${PURPLE}" filter="url(#gl${cx})" opacity="0.95" />
    <circle cx="${cx}" cy="${cy}" r="${1.4 * s}" fill="${PURPLE_LIGHT}" opacity="0.6" />
    <circle cx="${cx - 6.5 * s}" cy="${cy - 2 * s}" r="${0.9 * s}" fill="${PURPLE}" opacity="0.55" />
    <circle cx="${cx + 7 * s}" cy="${cy - 3 * s}" r="${0.7 * s}" fill="${AMBER}" opacity="0.6" />
    <circle cx="${cx + 5 * s}" cy="${cy + 3.5 * s}" r="${1 * s}" fill="${PURPLE}" opacity="0.35" />
    <circle cx="${cx - 10 * s}" cy="${cy + 3 * s}" r="${0.55 * s}" fill="${AMBER}" opacity="0.45" />
    <circle cx="${cx + 9.5 * s}" cy="${cy - 7 * s}" r="${0.45 * s}" fill="${AMBER}" opacity="0.4" />
    <line x1="${cx - 1.2 * s}" y1="${cy - 0.7 * s}" x2="${cx - 6 * s}" y2="${cy - 2 * s}" stroke="${TEXT_DIM}" stroke-width="${0.15 * s}" opacity="0.12" />
    <line x1="${cx + 1.2 * s}" y1="${cy - 0.7 * s}" x2="${cx + 6.5 * s}" y2="${cy - 3 * s}" stroke="${TEXT_DIM}" stroke-width="${0.15 * s}" opacity="0.12" />
    <line x1="${cx + 1 * s}" y1="${cy + 1 * s}" x2="${cx + 4.5 * s}" y2="${cy + 3 * s}" stroke="${TEXT_DIM}" stroke-width="${0.15 * s}" opacity="0.1" />
  `
}

function markOnlySvg(size) {
  const cx = size / 2, cy = size / 2, s = size / 30
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}" />
  ${celestialMark(cx, cy, s)}
</svg>`
}

function markWithTextSvg(size) {
  const cx = size / 2, cy = size * 0.42, s = size / 30
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}" />
  ${celestialMark(cx, cy, s)}
  <text x="${cx}" y="${size * 0.78}" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif" font-size="${size * 0.06}" font-weight="500"
    fill="${TEXT}" letter-spacing="${size * 0.003}">jaostudio.dev</text>
</svg>`
}

function pwaIconSvg(size) {
  const cx = size / 2, cy = size / 2, s = size / 30
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}" rx="${size * 0.18}" />
  ${celestialMark(cx, cy, s)}
</svg>`
}

async function render(svg, width, height, filename) {
  const out = join(__dirname, filename)
  await sharp(Buffer.from(svg)).resize(width, height).png({ quality: 100 }).toFile(out)
  console.log(`  \u2713 ${filename} (${width}\u00d7${height})`)
}

async function main() {
  await mkdir(__dirname, { recursive: true })
  console.log('Generating brand assets...\n')

  for (const size of [2048, 1024, 512, 256, 192]) {
    await render(markOnlySvg(size), size, size, `logo-mark-${size}.png`)
  }

  for (const size of [2048, 1024, 512]) {
    await render(markWithTextSvg(size), size, size, `logo-full-${size}.png`)
  }

  await render(pwaIconSvg(512), 512, 512, 'android-chrome-512x512.png')
  await render(pwaIconSvg(192), 192, 192, 'android-chrome-192x192.png')
  await render(pwaIconSvg(180), 180, 180, 'apple-touch-icon.png')

  console.log('\nDone \u2014 brand assets generated in brand/')
}

main().catch(err => { console.error(err); process.exit(1) })
