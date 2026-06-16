import { ImageResponse } from 'next/og'
import { ORG_ID } from '@/lib/json-ld-ids'

export const size = { width: 1200, height: 630 }

export default function OG() {
  return new ImageResponse(
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
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ fontSize: 48, fontWeight: 600, letterSpacing: '-0.02em' }}>Live Projects</div>
      <div style={{ marginTop: 16, fontSize: 24, color: '#A1A1AA', textAlign: 'center', maxWidth: 600 }}>
        Tools I build and maintain - running live code
      </div>
    </div>,
    { ...size },
  )
}
