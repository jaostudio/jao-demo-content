import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#050505',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <p
            style={{
              fontSize: '28px',
              color: '#7C3AED',
              fontFamily: 'system-ui',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            JAOstudio
          </p>
          <h1
            style={{
              fontSize: '64px',
              color: '#FAFAFA',
              fontFamily: 'system-ui',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Custom websites, web applications, and dashboards.
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: '#A1A1AA',
              fontFamily: 'system-ui',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Built for performance, clarity, and measurable results
          </p>
        </div>
      </div>
    ),
    { ...size },
  )
}
