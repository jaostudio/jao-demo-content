import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');

// ── OG Image (1200x630) ──

async function generateOG() {
  const width = 1200;
  const height = 630;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#050509"/>
        <stop offset="100%" stop-color="#0D1020"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#8B5CF6"/>
        <stop offset="100%" stop-color="#38BDF8"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <!-- Grid pattern -->
    <g stroke="rgba(167,139,250,0.06)" stroke-width="0.5">
      ${Array.from({length: 20}, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${height}"/>`).join('\n')}
      ${Array.from({length: 12}, (_, i) => `<line x1="0" y1="${i * 60}" x2="${width}" y2="${i * 60}"/>`).join('\n')}
    </g>
    <!-- V-shield big -->
    <path d="M600 100 L420 200 Q420 400 600 530 Q780 400 780 200 Z"
          fill="none" stroke="url(#accent)" stroke-width="4" opacity="0.3"/>
    <path d="M540 250 L600 330 L660 250"
          fill="none" stroke="url(#accent)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Archipelago dots -->
    <circle cx="480" cy="350" r="8" fill="#8B5CF6" opacity="0.5"/>
    <circle cx="720" cy="350" r="8" fill="#38BDF8" opacity="0.5"/>
    <circle cx="540" cy="400" r="6" fill="#8B5CF6" opacity="0.35"/>
    <circle cx="660" cy="400" r="6" fill="#38BDF8" opacity="0.35"/>
    <!-- Lock icon -->
    <rect x="585" y="295" width="30" height="22" rx="4" fill="none" stroke="url(#accent)" stroke-width="2.5"/>
    <path d="M590 300 v-8 a10 10 0 0 1 20 0 v8" fill="none" stroke="url(#accent)" stroke-width="2.5"/>
    <circle cx="600" cy="308" r="3" fill="url(#accent)"/>
    <!-- Title -->
    <text x="600" y="550" font-family="Inter, system-ui, sans-serif" font-size="52" font-weight="bold"
          fill="white" text-anchor="middle" letter-spacing="4">ISLAVAULT</text>
    <text x="600" y="585" font-family="Inter, system-ui, sans-serif" font-size="18"
          fill="#94A3B8" text-anchor="middle" letter-spacing="1">Secure client portals for distributed organizations</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(publicDir, 'opengraph-image.png'));
  console.log('Generated opengraph-image.png');
}

// ── Favicon ICO (32x32 PNG → ICO) ──

async function generateFavicon() {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="32" y2="32">
        <stop offset="0%" stop-color="#8B5CF6"/>
        <stop offset="100%" stop-color="#38BDF8"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="28" height="28" rx="6" fill="#0D1020"/>
    <path d="M16 6L6 12v5c0 6 3.5 11 10 13 6.5-2 10-7 10-13v-5L16 6z" fill="url(#g)" opacity="0.15"/>
    <path d="M10 13l6 8 6-8" stroke="url(#g)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="16" cy="14" r="1.8" fill="url(#g)"/>
  </svg>`;

  // Generate 32x32 PNG first
  const pngBuf = await sharp(Buffer.from(svg)).resize(32, 32).png().toBuffer();

  // Wrap in ICO format (simple ICO header + one entry)
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);     // reserved
  icoHeader.writeUInt16LE(1, 2);     // ICO type
  icoHeader.writeUInt16LE(1, 4);     // count

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(32, 0);        // width
  icoEntry.writeUInt8(32, 1);        // height
  icoEntry.writeUInt8(0, 2);         // color palette
  icoEntry.writeUInt8(0, 3);         // reserved
  icoEntry.writeUInt16LE(1, 4);      // color planes
  icoEntry.writeUInt16LE(32, 6);     // bits per pixel
  icoEntry.writeUInt32LE(pngBuf.length, 8);  // image size
  icoEntry.writeUInt32LE(22, 12);    // image offset (6 + 16)

  const ico = Buffer.concat([icoHeader, icoEntry, pngBuf]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
  console.log('Generated favicon.ico');

  // Also generate larger PNG versions for apple-touch-icon
  const appleSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180, 256];
  for (const size of appleSizes) {
    const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
    fs.writeFileSync(path.join(publicDir, `apple-touch-icon-${size}x${size}.png`), buf);
  }
  console.log('Generated apple-touch-icon PNGs');
}

async function main() {
  await generateOG();
  await generateFavicon();
  console.log('All brand assets generated');
}

main().catch(console.error);
