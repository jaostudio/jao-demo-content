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
    <!-- Starfield -->
    <circle cx="${cx - 11 * s}" cy="${cy - 12 * s}" r="${0.3 * s}" fill="${TEXT_DIM}" opacity="0.25" />
    <circle cx="${cx + 12 * s}" cy="${cy - 13 * s}" r="${0.2 * s}" fill="${TEXT_DIM}" opacity="0.2" />
    <circle cx="${cx - 13 * s}" cy="${cy + 11 * s}" r="${0.25 * s}" fill="${TEXT_DIM}" opacity="0.2" />
    <circle cx="${cx + 11 * s}" cy="${cy + 12 * s}" r="${0.2 * s}" fill="${TEXT_DIM}" opacity="0.18" />
    <circle cx="${cx - 6 * s}" cy="${cy - 14 * s}" r="${0.15 * s}" fill="${AMBER}" opacity="0.3" />
    <circle cx="${cx + 8 * s}" cy="${cy + 14 * s}" r="${0.15 * s}" fill="${AMBER}" opacity="0.25" />
    <!-- Radial glow -->
    <circle cx="${cx}" cy="${cy}" r="${12 * s}" fill="url(#sg${cx})" />
    <!-- Orbital ring 1 -->
    <ellipse cx="${cx}" cy="${cy}" rx="${8.5 * s}" ry="${3.5 * s}" transform="rotate(-20 ${cx} ${cy})"
      stroke="${TEXT_DIM}" stroke-width="${0.25 * s}" opacity="0.12" fill="none" />
    <!-- Orbital ring 2 -->
    <ellipse cx="${cx}" cy="${cy}" rx="${12.5 * s}" ry="${5.5 * s}" transform="rotate(15 ${cx} ${cy})"
      stroke="${TEXT_DIM}" stroke-width="${0.2 * s}" opacity="0.08" fill="none" />
    <!-- Central star -->
    <circle cx="${cx}" cy="${cy}" r="${2.5 * s}" fill="${PURPLE}" filter="url(#gl${cx})" opacity="0.95" />
    <circle cx="${cx}" cy="${cy}" r="${1.4 * s}" fill="${PURPLE_LIGHT}" opacity="0.6" />
    <!-- Orbiting nodes — ring 1 -->
    <circle cx="${cx - 6.5 * s}" cy="${cy - 2 * s}" r="${0.9 * s}" fill="${PURPLE}" opacity="0.55" />
    <circle cx="${cx + 7 * s}" cy="${cy - 3 * s}" r="${0.7 * s}" fill="${AMBER}" opacity="0.6" />
    <circle cx="${cx + 5 * s}" cy="${cy + 3.5 * s}" r="${1 * s}" fill="${PURPLE}" opacity="0.35" />
    <!-- Orbiting nodes — ring 2 -->
    <circle cx="${cx - 10 * s}" cy="${cy + 3 * s}" r="${0.55 * s}" fill="${AMBER}" opacity="0.45" />
    <circle cx="${cx + 9.5 * s}" cy="${cy - 7 * s}" r="${0.45 * s}" fill="${AMBER}" opacity="0.4" />
    <!-- Connecting lines -->
    <line x1="${cx - 1.2 * s}" y1="${cy - 0.7 * s}" x2="${cx - 6 * s}" y2="${cy - 2 * s}" stroke="${TEXT_DIM}" stroke-width="${0.15 * s}" opacity="0.12" />
    <line x1="${cx + 1.2 * s}" y1="${cy - 0.7 * s}" x2="${cx + 6.5 * s}" y2="${cy - 3 * s}" stroke="${TEXT_DIM}" stroke-width="${0.15 * s}" opacity="0.12" />
    <line x1="${cx + 1 * s}" y1="${cy + 1 * s}" x2="${cx + 4.5 * s}" y2="${cy + 3 * s}" stroke="${TEXT_DIM}" stroke-width="${0.15 * s}" opacity="0.1" />
  `
}

function profileSvg(size) {
  const cx = size / 2, cy = size * 0.42, s = size / 30
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}" />
  ${celestialMark(cx, cy, s)}
  <text x="${cx}" y="${size * 0.78}" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif" font-size="${size * 0.06}" font-weight="500"
    fill="${TEXT}" letter-spacing="${size * 0.003}">jaostudio.dev</text>
</svg>`
}

function facebookCoverSvg() {
  const w = 820, h = 312
  const horizon = h * 0.52
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="nebula" x1="0.2" y1="0" x2="0.8" y2="0.6">
      <stop offset="0%" stop-color="${PURPLE}" stop-opacity="0.18" />
      <stop offset="50%" stop-color="#4C1D95" stop-opacity="0.08" />
      <stop offset="100%" stop-color="${BG}" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="horizonGlow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${PURPLE}" stop-opacity="0.25" />
      <stop offset="50%" stop-color="${PURPLE}" stop-opacity="0.06" />
      <stop offset="100%" stop-color="${BG}" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${TEXT_DIM}" stop-opacity="0.12" />
      <stop offset="100%" stop-color="${TEXT_DIM}" stop-opacity="0.02" />
    </linearGradient>
  </defs>

  <!-- Deep space background -->
  <rect width="${w}" height="${h}" fill="${BG}" />

  <!-- Nebula cloud top-left -->
  <rect width="${w}" height="${h}" fill="url(#nebula)" />

  <!-- Horizon glow -->
  <rect x="0" y="${horizon - 40}" width="${w}" height="80" fill="url(#horizonGlow)" />

  <!-- Starfield — upper cosmos -->
  <circle cx="60" cy="28" r="1" fill="${TEXT_DIM}" opacity="0.35" />
  <circle cx="140" cy="52" r="0.7" fill="${TEXT_DIM}" opacity="0.25" />
  <circle cx="230" cy="18" r="0.8" fill="${AMBER}" opacity="0.3" />
  <circle cx="310" cy="65" r="0.6" fill="${TEXT_DIM}" opacity="0.2" />
  <circle cx="420" cy="35" r="1.1" fill="${TEXT_DIM}" opacity="0.3" />
  <circle cx="520" cy="22" r="0.7" fill="${TEXT_DIM}" opacity="0.25" />
  <circle cx="600" cy="58" r="0.8" fill="${AMBER}" opacity="0.28" />
  <circle cx="680" cy="30" r="0.6" fill="${TEXT_DIM}" opacity="0.22" />
  <circle cx="760" cy="48" r="0.9" fill="${TEXT_DIM}" opacity="0.3" />
  <circle cx="100" cy="85" r="0.5" fill="${TEXT_DIM}" opacity="0.18" />
  <circle cx="350" cy="42" r="0.5" fill="${TEXT_DIM}" opacity="0.15" />
  <circle cx="480" cy="75" r="0.6" fill="${TEXT_DIM}" opacity="0.2" />
  <circle cx="650" cy="68" r="0.5" fill="${AMBER}" opacity="0.22" />
  <circle cx="190" cy="105" r="0.4" fill="${TEXT_DIM}" opacity="0.15" />
  <circle cx="550" cy="95" r="0.4" fill="${TEXT_DIM}" opacity="0.12" />
  <circle cx="720" cy="90" r="0.5" fill="${TEXT_DIM}" opacity="0.18" />

  <!-- Horizon line -->
  <line x1="0" y1="${horizon}" x2="${w}" y2="${horizon}" stroke="${TEXT_DIM}" stroke-width="0.8" opacity="0.2" />

  <!-- Digital grid — perspective lines below horizon -->
  <g stroke="url(#gridFade)" stroke-width="0.6" fill="none">
    <!-- Horizontal grid lines -->
    <line x1="0" y1="${horizon + 18}" x2="${w}" y2="${horizon + 18}" opacity="0.15" />
    <line x1="0" y1="${horizon + 38}" x2="${w}" y2="${horizon + 38}" opacity="0.12" />
    <line x1="0" y1="${horizon + 60}" x2="${w}" y2="${horizon + 60}" opacity="0.09" />
    <line x1="0" y1="${horizon + 85}" x2="${w}" y2="${horizon + 85}" opacity="0.06" />
    <line x1="0" y1="${horizon + 112}" x2="${w}" y2="${horizon + 112}" opacity="0.04" />
    <!-- Vertical grid lines (converging toward center) -->
    <line x1="100" y1="${horizon}" x2="180" y2="${h}" opacity="0.1" />
    <line x1="220" y1="${horizon}" x2="260" y2="${h}" opacity="0.1" />
    <line x1="340" y1="${horizon}" x2="360" y2="${h}" opacity="0.12" />
    <line x1="410" y1="${horizon}" x2="410" y2="${h}" opacity="0.12" />
    <line x1="480" y1="${horizon}" x2="460" y2="${h}" opacity="0.1" />
    <line x1="600" y1="${horizon}" x2="560" y2="${h}" opacity="0.1" />
    <line x1="720" y1="${horizon}" x2="640" y2="${h}" opacity="0.08" />
  </g>

  <!-- Text — centered on horizon -->
  <text x="${w / 2}" y="${horizon - 18}" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="600"
    fill="${TEXT}" letter-spacing="2">JAO Studio Dev</text>
  <text x="${w / 2}" y="${horizon + 36}" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="400"
    fill="${TEXT_DIM}" letter-spacing="0.8">Building digital systems that orbit your business</text>
  <text x="${w / 2}" y="${horizon + 58}" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="400"
    fill="${TEXT_DIM}" opacity="0.5" letter-spacing="0.4">Custom websites, dashboards &amp; tools</text>
</svg>`
}

function starBody(cx, cy, s) {
  return `
    <defs>
      <radialGradient id="starCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.9" />
        <stop offset="40%" stop-color="${PURPLE}" stop-opacity="0.7" />
        <stop offset="100%" stop-color="${PURPLE}" stop-opacity="0" />
      </radialGradient>
      <filter id="starGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="${6 * s}" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${10 * s}" fill="url(#starCore)" />
    <circle cx="${cx}" cy="${cy}" r="${3.5 * s}" fill="#C4B5FD" filter="url(#starGlow)" opacity="0.95" />
    <circle cx="${cx}" cy="${cy}" r="${2 * s}" fill="#DDD6FE" opacity="0.7" />
    <!-- Rays -->
    <line x1="${cx}" y1="${cy - 5 * s}" x2="${cx}" y2="${cy - 9 * s}" stroke="${PURPLE_LIGHT}" stroke-width="${0.4 * s}" opacity="0.3" />
    <line x1="${cx}" y1="${cy + 5 * s}" x2="${cx}" y2="${cy + 9 * s}" stroke="${PURPLE_LIGHT}" stroke-width="${0.4 * s}" opacity="0.3" />
    <line x1="${cx - 5 * s}" y1="${cy}" x2="${cx - 9 * s}" y2="${cy}" stroke="${PURPLE_LIGHT}" stroke-width="${0.4 * s}" opacity="0.3" />
    <line x1="${cx + 5 * s}" y1="${cy}" x2="${cx + 9 * s}" y2="${cy}" stroke="${PURPLE_LIGHT}" stroke-width="${0.4 * s}" opacity="0.3" />
    <line x1="${cx - 3.5 * s}" y1="${cy - 3.5 * s}" x2="${cx - 6.5 * s}" y2="${cy - 6.5 * s}" stroke="${PURPLE_LIGHT}" stroke-width="${0.3 * s}" opacity="0.2" />
    <line x1="${cx + 3.5 * s}" y1="${cy - 3.5 * s}" x2="${cx + 6.5 * s}" y2="${cy - 6.5 * s}" stroke="${PURPLE_LIGHT}" stroke-width="${0.3 * s}" opacity="0.2" />
    <line x1="${cx - 3.5 * s}" y1="${cy + 3.5 * s}" x2="${cx - 6.5 * s}" y2="${cy + 6.5 * s}" stroke="${PURPLE_LIGHT}" stroke-width="${0.3 * s}" opacity="0.2" />
    <line x1="${cx + 3.5 * s}" y1="${cy + 3.5 * s}" x2="${cx + 6.5 * s}" y2="${cy + 6.5 * s}" stroke="${PURPLE_LIGHT}" stroke-width="${0.3 * s}" opacity="0.2" />
    <!-- Tiny orbiting planets -->
    <circle cx="${cx - 8 * s}" cy="${cy + 3 * s}" r="${0.6 * s}" fill="${AMBER}" opacity="0.5" />
    <circle cx="${cx + 6 * s}" cy="${cy - 7 * s}" r="${0.4 * s}" fill="${TEXT_DIM}" opacity="0.35" />
  `
}

function ringedPlanetBody(cx, cy, s) {
  return `
    <defs>
      <radialGradient id="planetGrad" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stop-color="${PURPLE_LIGHT}" stop-opacity="0.8" />
        <stop offset="100%" stop-color="${PURPLE}" stop-opacity="0.4" />
      </radialGradient>
      <filter id="planetGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="${2 * s}" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <!-- Rings (behind planet) -->
    <ellipse cx="${cx}" cy="${cy}" rx="${9 * s}" ry="${2.5 * s}" transform="rotate(-25 ${cx} ${cy})"
      stroke="${TEXT_DIM}" stroke-width="${0.6 * s}" opacity="0.15" fill="none" />
    <ellipse cx="${cx}" cy="${cy}" rx="${11 * s}" ry="${3 * s}" transform="rotate(-25 ${cx} ${cy})"
      stroke="${AMBER}" stroke-width="${0.4 * s}" opacity="0.12" fill="none" />
    <ellipse cx="${cx}" cy="${cy}" rx="${13 * s}" ry="${3.5 * s}" transform="rotate(-25 ${cx} ${cy})"
      stroke="${TEXT_DIM}" stroke-width="${0.3 * s}" opacity="0.08" fill="none" />
    <!-- Planet body -->
    <circle cx="${cx}" cy="${cy}" r="${4.5 * s}" fill="url(#planetGrad)" filter="url(#planetGlow)" />
    <circle cx="${cx}" cy="${cy}" r="${4.5 * s}" fill="none" stroke="${PURPLE_LIGHT}" stroke-width="${0.3 * s}" opacity="0.3" />
    <!-- Surface detail -->
    <ellipse cx="${cx - 1 * s}" cy="${cy - 0.5 * s}" rx="${1.5 * s}" ry="${0.8 * s}" fill="${PURPLE}" opacity="0.2" />
    <ellipse cx="${cx + 1.5 * s}" cy="${cy + 1 * s}" rx="${1 * s}" ry="${0.6 * s}" fill="${PURPLE}" opacity="0.15" />
    <!-- Rings (in front of planet — top half) -->
    <clipPath id="ringFront"><rect x="${cx - 15 * s}" y="${cy}" width="${30 * s}" height="${8 * s}" /></clipPath>
    <g clip-path="url(#ringFront)">
      <ellipse cx="${cx}" cy="${cy}" rx="${9 * s}" ry="${2.5 * s}" transform="rotate(-25 ${cx} ${cy})"
        stroke="${TEXT_DIM}" stroke-width="${0.6 * s}" opacity="0.2" fill="none" />
      <ellipse cx="${cx}" cy="${cy}" rx="${11 * s}" ry="${3 * s}" transform="rotate(-25 ${cx} ${cy})"
        stroke="${AMBER}" stroke-width="${0.4 * s}" opacity="0.15" fill="none" />
    </g>
    <!-- Nodes on rings -->
    <circle cx="${cx - 10 * s}" cy="${cy - 1 * s}" r="${0.5 * s}" fill="${AMBER}" opacity="0.5" />
    <circle cx="${cx + 12 * s}" cy="${cy + 0.5 * s}" r="${0.4 * s}" fill="${PURPLE_LIGHT}" opacity="0.4" />
    <circle cx="${cx - 5 * s}" cy="${cy + 3.2 * s}" r="${0.35 * s}" fill="${TEXT_DIM}" opacity="0.3" />
  `
}

function binaryStarBody(cx, cy, s) {
  return `
    <defs>
      <radialGradient id="b1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.8" />
        <stop offset="100%" stop-color="${PURPLE}" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="b2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${AMBER}" stop-opacity="0.7" />
        <stop offset="100%" stop-color="${AMBER}" stop-opacity="0" />
      </radialGradient>
      <filter id="binGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="${3 * s}" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <!-- Shared orbital path -->
    <ellipse cx="${cx}" cy="${cy}" rx="${7 * s}" ry="${3.5 * s}" transform="rotate(-10 ${cx} ${cy})"
      stroke="${TEXT_DIM}" stroke-width="${0.4 * s}" opacity="0.12" fill="none" />
    <!-- Glow halos -->
    <circle cx="${cx - 4 * s}" cy="${cy - 1 * s}" r="${5 * s}" fill="url(#b1)" />
    <circle cx="${cx + 4 * s}" cy="${cy + 1 * s}" r="${4 * s}" fill="url(#b2)" />
    <!-- Star 1 (purple, larger) -->
    <circle cx="${cx - 4 * s}" cy="${cy - 1 * s}" r="${2.5 * s}" fill="${PURPLE}" filter="url(#binGlow)" opacity="0.9" />
    <circle cx="${cx - 4 * s}" cy="${cy - 1 * s}" r="${1.5 * s}" fill="${PURPLE_LIGHT}" opacity="0.6" />
    <!-- Star 2 (amber, smaller) -->
    <circle cx="${cx + 4 * s}" cy="${cy + 1 * s}" r="${1.8 * s}" fill="${AMBER}" filter="url(#binGlow)" opacity="0.85" />
    <circle cx="${cx + 4 * s}" cy="${cy + 1 * s}" r="${1 * s}" fill="#FCD34D" opacity="0.5" />
    <!-- Gravitational connection lines -->
    <line x1="${cx - 1.8 * s}" y1="${cy - 0.3 * s}" x2="${cx + 2.2 * s}" y2="${cy + 0.3 * s}"
      stroke="${TEXT_DIM}" stroke-width="${0.25 * s}" opacity="0.15" stroke-dasharray="${0.8 * s} ${0.5 * s}" />
    <!-- Small orbiting bodies -->
    <circle cx="${cx - 8 * s}" cy="${cy + 2.5 * s}" r="${0.4 * s}" fill="${TEXT_DIM}" opacity="0.3" />
    <circle cx="${cx + 7 * s}" cy="${cy - 3 * s}" r="${0.3 * s}" fill="${AMBER}" opacity="0.35" />
  `
}

function nebulaBody(cx, cy, s) {
  return `
    <defs>
      <radialGradient id="neb1" cx="45%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${PURPLE}" stop-opacity="0.3" />
        <stop offset="60%" stop-color="#4C1D95" stop-opacity="0.1" />
        <stop offset="100%" stop-color="${BG}" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="neb2" cx="60%" cy="55%" r="45%">
        <stop offset="0%" stop-color="${AMBER}" stop-opacity="0.15" />
        <stop offset="100%" stop-color="${BG}" stop-opacity="0" />
      </radialGradient>
      <filter id="nebBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="${5 * s}" />
      </filter>
    </defs>
    <!-- Gas clouds -->
    <ellipse cx="${cx - 2 * s}" cy="${cy - 2 * s}" rx="${8 * s}" ry="${5 * s}" fill="url(#neb1)" filter="url(#nebBlur)" />
    <ellipse cx="${cx + 3 * s}" cy="${cy + 2 * s}" rx="${6 * s}" ry="${4 * s}" fill="url(#neb2)" filter="url(#nebBlur)" />
    <ellipse cx="${cx}" cy="${cy}" rx="${5 * s}" ry="${3 * s}" fill="${PURPLE}" opacity="0.08" filter="url(#nebBlur)" />
    <!-- Bright core (star being born) -->
    <circle cx="${cx}" cy="${cy}" r="${1.5 * s}" fill="#C4B5FD" opacity="0.7" />
    <circle cx="${cx}" cy="${cy}" r="${0.8 * s}" fill="#DDD6FE" opacity="0.5" />
    <!-- Scattered young stars -->
    <circle cx="${cx - 5 * s}" cy="${cy - 3 * s}" r="${0.3 * s}" fill="${TEXT}" opacity="0.5" />
    <circle cx="${cx + 4 * s}" cy="${cy - 4 * s}" r="${0.25 * s}" fill="${TEXT}" opacity="0.4" />
    <circle cx="${cx + 6 * s}" cy="${cy + 1 * s}" r="${0.35 * s}" fill="${AMBER}" opacity="0.45" />
    <circle cx="${cx - 3 * s}" cy="${cy + 4 * s}" r="${0.2 * s}" fill="${TEXT}" opacity="0.35" />
    <circle cx="${cx + 2 * s}" cy="${cy + 5 * s}" r="${0.3 * s}" fill="${PURPLE_LIGHT}" opacity="0.4" />
    <circle cx="${cx - 7 * s}" cy="${cy}" r="${0.2 * s}" fill="${TEXT}" opacity="0.3" />
    <circle cx="${cx + 8 * s}" cy="${cy - 2 * s}" r="${0.25 * s}" fill="${TEXT}" opacity="0.25" />
    <!-- Dust lanes -->
    <line x1="${cx - 6 * s}" y1="${cy + 1 * s}" x2="${cx + 5 * s}" y2="${cy - 1 * s}"
      stroke="${TEXT_DIM}" stroke-width="${0.3 * s}" opacity="0.08" />
  `
}

function spaceStationBody(cx, cy, s) {
  return `
    <defs>
      <filter id="stGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="${1.5 * s}" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <!-- Orbit path -->
    <ellipse cx="${cx}" cy="${cy}" rx="${10 * s}" ry="${4 * s}" transform="rotate(-15 ${cx} ${cy})"
      stroke="${TEXT_DIM}" stroke-width="${0.3 * s}" opacity="0.1" fill="none" />
    <!-- Central module -->
    <rect x="${cx - 2 * s}" y="${cy - 1.2 * s}" width="${4 * s}" height="${2.4 * s}" rx="${0.4 * s}"
      fill="${PURPLE}" opacity="0.7" filter="url(#stGlow)" />
    <rect x="${cx - 1.5 * s}" y="${cy - 0.8 * s}" width="${3 * s}" height="${1.6 * s}" rx="${0.2 * s}"
      fill="${PURPLE_LIGHT}" opacity="0.4" />
    <!-- Solar panels — left -->
    <rect x="${cx - 7 * s}" y="${cy - 0.8 * s}" width="${4.5 * s}" height="${1.6 * s}" rx="${0.15 * s}"
      fill="${AMBER}" opacity="0.35" />
    <line x1="${cx - 2 * s}" y1="${cy}" x2="${cx - 2.5 * s}" y2="${cy}"
      stroke="${TEXT_DIM}" stroke-width="${0.4 * s}" opacity="0.4" />
    <!-- Solar panels — right -->
    <rect x="${cx + 2.5 * s}" y="${cy - 0.8 * s}" width="${4.5 * s}" height="${1.6 * s}" rx="${0.15 * s}"
      fill="${AMBER}" opacity="0.35" />
    <line x1="${cx + 2 * s}" y1="${cy}" x2="${cx + 2.5 * s}" y2="${cy}"
      stroke="${TEXT_DIM}" stroke-width="${0.4 * s}" opacity="0.4" />
    <!-- Panel grid lines -->
    <line x1="${cx - 5 * s}" y1="${cy - 0.8 * s}" x2="${cx - 5 * s}" y2="${cy + 0.8 * s}" stroke="${TEXT_DIM}" stroke-width="${0.15 * s}" opacity="0.2" />
    <line x1="${cx - 3 * s}" y1="${cy - 0.8 * s}" x2="${cx - 3 * s}" y2="${cy + 0.8 * s}" stroke="${TEXT_DIM}" stroke-width="${0.15 * s}" opacity="0.2" />
    <line x1="${cx + 4.5 * s}" y1="${cy - 0.8 * s}" x2="${cx + 4.5 * s}" y2="${cy + 0.8 * s}" stroke="${TEXT_DIM}" stroke-width="${0.15 * s}" opacity="0.2" />
    <line x1="${cx + 6 * s}" y1="${cy - 0.8 * s}" x2="${cx + 6 * s}" y2="${cy + 0.8 * s}" stroke="${TEXT_DIM}" stroke-width="${0.15 * s}" opacity="0.2" />
    <!-- Docking port -->
    <circle cx="${cx}" cy="${cy + 1.8 * s}" r="${0.5 * s}" fill="${TEXT_DIM}" opacity="0.3" />
    <!-- Orbiting moon -->
    <circle cx="${cx + 9 * s}" cy="${cy - 2.5 * s}" r="${0.8 * s}" fill="${TEXT_DIM}" opacity="0.25" />
    <circle cx="${cx + 9 * s}" cy="${cy - 2.5 * s}" r="${0.5 * s}" fill="${PURPLE}" opacity="0.2" />
  `
}

function blackHoleBody(cx, cy, s) {
  return `
    <defs>
      <radialGradient id="bhAcc" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${BG}" stop-opacity="1" />
        <stop offset="30%" stop-color="${BG}" stop-opacity="0.9" />
        <stop offset="55%" stop-color="${PURPLE}" stop-opacity="0.3" />
        <stop offset="70%" stop-color="${AMBER}" stop-opacity="0.2" />
        <stop offset="100%" stop-color="${BG}" stop-opacity="0" />
      </radialGradient>
      <filter id="bhGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="${4 * s}" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <!-- Accretion disk — outer glow -->
    <ellipse cx="${cx}" cy="${cy}" rx="${9 * s}" ry="${3 * s}" fill="url(#bhAcc)" filter="url(#bhGlow)" />
    <!-- Accretion disk — ring -->
    <ellipse cx="${cx}" cy="${cy}" rx="${7 * s}" ry="${2.2 * s}" transform="rotate(-5 ${cx} ${cy})"
      stroke="${AMBER}" stroke-width="${0.8 * s}" opacity="0.2" fill="none" />
    <ellipse cx="${cx}" cy="${cy}" rx="${8 * s}" ry="${2.6 * s}" transform="rotate(-5 ${cx} ${cy})"
      stroke="${PURPLE}" stroke-width="${0.5 * s}" opacity="0.15" fill="none" />
    <!-- Event horizon (black center) -->
    <circle cx="${cx}" cy="${cy}" r="${2.5 * s}" fill="${BG}" />
    <circle cx="${cx}" cy="${cy}" r="${2.5 * s}" stroke="${PURPLE}" stroke-width="${0.3 * s}" opacity="0.2" fill="none" />
    <!-- Gravitational lensing — light bending around -->
    <path d="M ${cx - 5 * s} ${cy - 1.5 * s} Q ${cx} ${cy - 3.5 * s} ${cx + 5 * s} ${cy - 1.5 * s}"
      stroke="${TEXT_DIM}" stroke-width="${0.3 * s}" opacity="0.12" fill="none" />
    <path d="M ${cx - 5 * s} ${cy + 1.5 * s} Q ${cx} ${cy + 3.5 * s} ${cx + 5 * s} ${cy + 1.5 * s}"
      stroke="${TEXT_DIM}" stroke-width="${0.3 * s}" opacity="0.12" fill="none" />
    <!-- Jet streams (polar) -->
    <line x1="${cx}" y1="${cy - 3 * s}" x2="${cx}" y2="${cy - 7 * s}"
      stroke="${PURPLE_LIGHT}" stroke-width="${0.4 * s}" opacity="0.15" />
    <line x1="${cx}" y1="${cy + 3 * s}" x2="${cx}" y2="${cy + 7 * s}"
      stroke="${PURPLE_LIGHT}" stroke-width="${0.4 * s}" opacity="0.15" />
    <!-- Scattered debris -->
    <circle cx="${cx - 6 * s}" cy="${cy - 3 * s}" r="${0.2 * s}" fill="${AMBER}" opacity="0.3" />
    <circle cx="${cx + 5 * s}" cy="${cy + 2.5 * s}" r="${0.15 * s}" fill="${TEXT_DIM}" opacity="0.25" />
    <circle cx="${cx - 3 * s}" cy="${cy + 4 * s}" r="${0.2 * s}" fill="${TEXT}" opacity="0.2" />
  `
}

const storyCovers = [
  { label: 'Lead Generation', sub: 'Landing Pages', body: starBody },
  { label: 'Revenue Operations', sub: 'E-Commerce', body: ringedPlanetBody },
  { label: 'Multi-Vendor', sub: 'Marketplace', body: binaryStarBody },
  { label: 'Content Pipeline', sub: 'Editorial', body: nebulaBody },
  { label: 'Internal Ops', sub: 'Web Applications', body: spaceStationBody },
  { label: 'Compliance', sub: 'Audit &amp; Security', body: blackHoleBody },
]

function storyCoverSvg(index) {
  const w = 1080, h = 1920
  const { label, sub, body } = storyCovers[index]
  const cx = w / 2, cy = h * 0.38, s = 18
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${BG}" />
  ${body(cx, cy, s)}
  <text x="${w / 2}" y="${h * 0.70}" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="500"
    fill="${TEXT}" letter-spacing="1.5">${label}</text>
  <text x="${w / 2}" y="${h * 0.75}" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="400"
    fill="${TEXT_DIM}" letter-spacing="0.8">${sub}</text>
  <text x="${w / 2}" y="${h * 0.82}" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400"
    fill="${TEXT_DIM}" opacity="0.4" letter-spacing="0.5">jaostudio.dev</text>
</svg>`
}

async function render(svg, width, height, filename) {
  const out = join(__dirname, filename)
  await sharp(Buffer.from(svg)).resize(width, height).png({ quality: 100 }).toFile(out)
  console.log(`  \u2713 ${filename} (${width}\u00d7${height})`)
}

async function main() {
  await mkdir(__dirname, { recursive: true })
  console.log('Generating social media assets...\n')

  await render(profileSvg(1200), 1200, 1200, 'facebook-profile.png')
  await render(profileSvg(1080), 1080, 1080, 'instagram-profile.png')
  await render(facebookCoverSvg(), 820, 312, 'facebook-cover.png')

  for (let i = 0; i < storyCovers.length; i++) {
    await render(storyCoverSvg(i), 1080, 1920, `instagram-story-cover-${i + 1}.png`)
  }

  console.log('\nDone \u2014 9 files generated in socials/')
}

main().catch(err => { console.error(err); process.exit(1) })
