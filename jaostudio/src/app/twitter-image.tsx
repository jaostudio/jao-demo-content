import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BG = '#050505'
const FRAME_BG = '#1A1A1A'
const FRAME_BORDER = '#333333'
const FG = '#FAFAFA'
const MUTED = '#A1A1AA'
const ACCENT = '#7C3AED'

function getBaseUrl(): string {
  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) return `https://${vercelUrl}`
  return 'https://jaostudio.dev'
}

function getScreenshotUrl(): string {
  try {
    const cwd = process.cwd()
    const candidates = [
      path.join(cwd, 'jaostudio', 'public', 'images', 'og', 'og-home.png'),
      path.join(cwd, 'public', 'images', 'og', 'og-home.png'),
    ]
    for (const fp of candidates) {
      if (fs.existsSync(fp)) {
        const buf = fs.readFileSync(fp)
        return `data:image/png;base64,${buf.toString('base64')}`
      }
    }
  } catch { /* */ }
  const base = getBaseUrl()
  return `${base}/images/og/og-home.png`
}

export default function TwitterImage() {
  const imgSrc = getScreenshotUrl()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: BG,
          fontFamily: 'system-ui',
          padding: '10px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            border: `1px solid ${FRAME_BORDER}`,
            background: FRAME_BG,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '38px',
              padding: '0 16px',
              background: FRAME_BG,
              borderBottom: `1px solid ${FRAME_BORDER}`,
            }}
          >
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FEBC2E' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28C840' }} />
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                marginRight: '52px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#2A2A2A',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontSize: '13px',
                  color: MUTED,
                }}
              >
                <span>jaostudio.dev</span>
              </div>
            </div>
          </div>
          <img
            src={imgSrc}
            style={{
              width: '100%',
              flex: 1,
              objectFit: 'cover',
              display: 'flex',
            }}
            alt=""
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '6px',
            fontSize: '12px',
            color: '#52525B',
            letterSpacing: '0.1em',
          }}
        >
          <span
            style={{
              display: 'flex',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: ACCENT,
            }}
          />
          JAOstudio
        </div>
      </div>
    ),
    { ...size },
  )
}
