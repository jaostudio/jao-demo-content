import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function RootOGImage() {
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
          background: '#050505',
          fontFamily: 'system-ui',
        }}
      >
        <p
          style={{
            fontSize: '24px',
            color: '#7C3AED',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          JAOstudio
        </p>
        <h1
          style={{
            fontSize: '48px',
            color: '#FAFAFA',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            margin: 0,
            marginTop: '16px',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Custom Websites & Web Applications
        </h1>
      </div>
    ),
    { ...size },
  )
}
