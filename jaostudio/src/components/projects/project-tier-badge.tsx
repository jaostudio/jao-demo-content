import { cn } from '@/lib/cn'

interface Props {
  tier: 'flagship' | 'production' | 'concept'
}

export function ProjectTierBadge({ tier }: Props) {
  if (tier === 'flagship') {
    return (
      <span className="rounded-md border border-accent/20 bg-accent/8 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-accent">
        Flagship
      </span>
    )
  }

  if (tier === 'concept') {
    return (
      <span className="rounded-md border border-border-subtle bg-bg-surface px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
        Concept
      </span>
    )
  }

  return null
}
