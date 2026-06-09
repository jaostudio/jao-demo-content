import { ImageResponse } from 'next/og'
import { getCaseStudy } from '@/lib/case-studies'
import { getProject } from '@/lib/projects'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function OpenGraphImage({ params }: Props) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: '#FAFAFA', fontSize: 48, fontFamily: 'system-ui' }}>
          JAOstudio
        </div>
      ),
      { ...size },
    )
  }

  const project = getProject(cs.relatedProject)
  const outcomeLine = cs.outcome.split('.')[0]

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
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <span style={{ fontSize: 20, color: '#7C3AED', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            {cs.industry}
          </span>
          <span
            style={{
              fontSize: 14,
              color: '#A1A1AA',
              padding: '4px 12px',
              borderRadius: 999,
              border: '1px solid #27272A',
            }}
          >
            Case Study
          </span>
        </div>

        <h1
          style={{
            fontSize: 56,
            color: '#FAFAFA',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {cs.title}
        </h1>

        <div
          style={{
            marginTop: 32,
            padding: '16px 24px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid #27272A',
            fontSize: 22,
            color: '#D4D4D8',
            lineHeight: 1.4,
          }}
        >
          {outcomeLine}
        </div>

        {project && (
          <div style={{ marginTop: 24, fontSize: 18, color: '#52525B' }}>
            {project.title}
          </div>
        )}

        <div style={{ marginTop: 'auto', fontSize: 18, color: '#52525B', letterSpacing: '0.1em' }}>
          jaostudio.dev
        </div>
      </div>
    ),
    { ...size },
  )
}
