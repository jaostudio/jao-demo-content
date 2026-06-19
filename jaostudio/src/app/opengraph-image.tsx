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
          color: '#FAFAFA',
          fontFamily: 'system-ui',
          fontSize: '64px',
          fontWeight: 500,
          gap: '24px',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <span style={{ color: '#7C3AED', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '24px' }}>
          jaostudio
        </span>
        <span>
          OGs {process.env.VERCEL_URL || 'local'}
        </span>
        <span style={{ fontSize: '20px', color: '#A1A1AA' }}>
          {process.env.NEXT_PUBLIC_VERCEL_ENV || 'dev'}
        </span>
      </div>
    ),
    { ...size },
  )
}
