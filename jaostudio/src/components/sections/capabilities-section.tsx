'use client'

import { Section } from '@/components/ui/section'
import { Badge } from '@/components/typography/badge'
import { cn } from '@/lib/cn'
import { useTranslations } from 'next-intl'
import { useActiveNode } from '@/components/layout/system-provider'
import type { NodeId } from '@/lib/graph/types'

type NodeCapabilityMap = Partial<Record<NodeId, number>>

const nodeToCapability: NodeCapabilityMap = {
  platform: 0,
  data: 1,
  pipeline: 2,
  inference: 2,
}

const capabilities = [
  { tech: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Vercel'] },
  { tech: ['Next.js', 'PostgreSQL', 'REST APIs', 'Auth systems'] },
  { tech: ['Next.js', 'Shopify', 'Stripe', 'Tailwind CSS'] },
  { tech: ['LLM integration', 'RAG pipelines', 'Webhooks', 'CI/CD'] },
]

export function CapabilitiesSection() {
  const t = useTranslations('capabilities')
  const activeNode = useActiveNode()
  const highlightedIndex = activeNode ? nodeToCapability[activeNode] : undefined

  return (
    <Section id="capabilities" density="compact">
      <div className="flex flex-col gap-4 items-center text-center">
        <Badge variant="accent">{t('badge')}</Badge>
        <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          {t('heading')}
        </h2>
        <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
          {t('description')}
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:gap-6 md:grid-cols-2">
        {capabilities.map((item, index) => {
          const isHighlighted = highlightedIndex === index
          const isDimmed = highlightedIndex !== undefined && !isHighlighted

          return (
            <div
              key={index}
              className={cn(
                'rounded-2xl border p-4 md:p-6 transition-colors duration-500',
                isHighlighted
                  ? 'border-accent/30 bg-accent/8 shadow-[0_0_0_1px_rgba(124,58,237,0.14)]'
                  : isDimmed
                    ? 'border-border-subtle bg-bg-surface/20 opacity-50'
                    : 'border-border-subtle bg-bg-surface/30',
              )}
            >
              <p className="text-[var(--text-meta)] uppercase tracking-[0.2em] text-text-secondary">
                {t(`card${index + 1}Title`)}
              </p>
              <p className="mt-2 text-[var(--text-body)] leading-relaxed text-text-secondary">
                {t(`card${index + 1}Desc`)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border-subtle bg-bg-elevated px-2 py-0.5 text-xs text-text-tertiary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
