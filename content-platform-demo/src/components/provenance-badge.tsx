'use client'

import { useState } from 'react'

const PROVENANCE_LABELS: Record<string, string> = {
  UNDECLARED: 'Unverified',
  DECLARED_HUMAN_MADE: 'Declared Human-Made',
  AI_ASSISTED: 'AI-Assisted',
  PROCESS_DOCUMENTED: 'Process Documented',
  REMOVED_BY_ADMIN: 'Badge Removed',
}

const PROVENANCE_TOOLTIPS: Record<string, string> = {
  UNDECLARED: 'This work has no provenance declaration.',
  DECLARED_HUMAN_MADE: 'The artist declared this work as human-made.',
  AI_ASSISTED: 'The artist marked this work as AI-assisted.',
  PROCESS_DOCUMENTED: 'This work includes process documentation.',
  REMOVED_BY_ADMIN: 'An admin removed the previous provenance badge.',
}

const PROVENANCE_STYLES: Record<string, string> = {
  UNDECLARED: 'bg-hairline text-fog-gray',
  DECLARED_HUMAN_MADE: 'bg-reactor-green/10 text-reactor-green border-reactor-green/20',
  AI_ASSISTED: 'bg-surface-alt text-graphite border-hairline',
  PROCESS_DOCUMENTED: 'bg-reactor-green/10 text-reactor-green border-reactor-green/20',
  REMOVED_BY_ADMIN: 'bg-surface-alt text-fog-gray line-through border-hairline',
}

interface ProvenanceBadgeProps {
  status: string
}

export function ProvenanceBadge({ status }: ProvenanceBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const label = PROVENANCE_LABELS[status] || status
  const tooltip = PROVENANCE_TOOLTIPS[status]
  const style = PROVENANCE_STYLES[status] || PROVENANCE_STYLES.UNDECLARED

  if (!status || status === 'UNDECLARED') return null

  return (
    <span
      className="relative inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium cursor-help transition-colors"
      style={{ letterSpacing: '0.02em' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
      role="status"
      aria-label={label}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${status === 'PROCESS_DOCUMENTED' || status === 'DECLARED_HUMAN_MADE' ? 'bg-reactor-green' : 'bg-fog-gray'}`} />
      {label}
      {showTooltip && tooltip && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-md bg-void-black px-2.5 py-1.5 text-[11px] text-white shadow-lg z-10"
          role="tooltip"
        >
          {tooltip}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-void-black" />
        </span>
      )}
    </span>
  )
}
