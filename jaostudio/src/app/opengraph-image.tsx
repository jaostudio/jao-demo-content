import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BG = '#050505'
const FRAME_BG = '#1A1A1A'
const FRAME_BORDER = '#333333'
const FG = '#FAFAFA'
const MUTED = '#A1A1AA'
const ACCENT = '#7C3AED'

function getScreenshotDataUri(): string | null {
  const cwd = process.cwd()
  const candidates = [
    path.join(cwd, 'jaostudio', 'public', 'images', 'og', 'og-home.png'),
    path.join(cwd, 'public', 'images', 'og', 'og-home.png'),
    path.resolve('/var/task', 'public', 'images', 'og', 'og-home.png'),
    path.resolve('/var/task', 'jaostudio', 'public', 'images', 'og', 'og-home.png'),
  ]
  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        process.stdout.write('[OG] FOUND at ' + filePath + '\n')
        const buffer = fs.readFileSync(filePath)
        return `data:image/png;base64,${buffer.toString('base64')}`
      }
      process.stdout.write('[OG] MISS at ' + filePath + '\n')
    } catch (e) {
      process.stdout.write('[OG] ERROR at ' + filePath + ': ' + (e as Error).message + '\n')
    }
  }
  process.stdout.write('[OG] CWD=' + cwd + '\n')
  try {
    process.stdout.write('[OG] LS=' + fs.readdirSync(cwd).join(',') + '\n')
  } catch { /* */ }
  return null
}

export default function RootOGImage() {
  const screenshotUri = getScreenshotDataUri()

  if (!screenshotUri) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050505',
            color: '#FAFAFA',
            fontSize: 48,
            fontWeight: 500,
          }}
        >
          fallback
        </div>
      ),
      { ...size },
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#050505',
        }}
      >
        <img
          src={screenshotUri}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          alt=""
        />
      </div>
    ),
    { ...size },
  )
}
