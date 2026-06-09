import type { ReactElement } from 'react'

interface OGImageTemplateProps {
  badge?: string
  title: string
  subtitle?: string
  items?: readonly string[]
  footer: string
}

const BG = '#050505'
const ACCENT = '#7C3AED'
const FG = '#FAFAFA'
const MUTED = '#A1A1AA'
const SUBDUED = '#52525B'
const BORDER = '#27272A'

export function OGTemplate({ badge, title, subtitle, items, footer }: OGImageTemplateProps): ReactElement {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: BG,
        padding: '80px',
        fontFamily: 'system-ui',
      }}
    >
      {badge && (
        <p
          style={{
            fontSize: '20px',
            color: ACCENT,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            margin: 0,
            marginBottom: '16px',
          }}
        >
          {badge}
        </p>
      )}
      <h1
        style={{
          fontSize: '56px',
          color: FG,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: 0,
          maxWidth: '900px',
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: '24px',
            color: MUTED,
            lineHeight: 1.5,
            margin: 0,
            marginTop: '20px',
            maxWidth: '800px',
          }}
        >
          {subtitle}
        </p>
      )}
      {items && items.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '36px',
            maxWidth: '1000px',
          }}
        >
          {items.map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '20px',
                color: MUTED,
                padding: '8px 16px',
                borderRadius: '8px',
                border: `1px solid ${BORDER}`,
              }}
            >
              <span style={{ color: ACCENT, fontSize: '12px' }}>◆</span>
              {item}
            </div>
          ))}
        </div>
      )}
      <div
        style={{
          marginTop: 'auto',
          fontSize: '16px',
          color: SUBDUED,
          letterSpacing: '0.1em',
        }}
      >
        {footer}
      </div>
    </div>
  )
}
