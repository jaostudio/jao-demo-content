import type { ArticleSummary } from '@content-platform/shared'
import { WorkPoster } from '@/components/new/work/work-poster'
import { ProvenanceBadge } from '@/components/provenance-badge'
import Link from 'next/link'

interface ProcessSpotlightProps {
  work: ArticleSummary
}

export function ProcessSpotlight({ work }: ProcessSpotlightProps) {
  return (
    <section className="studio-frame relative overflow-hidden rounded-xl mb-8 p-5" style={{ border: '1px solid var(--brand-border)', backgroundColor: 'var(--brand-surface)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="signal-dot text-[13px] font-semibold text-text-primary">Process Spotlight</span>
      </div>
      <div className="grid gap-5 md:grid-cols-5">
        <div className="md:col-span-2">
          <WorkPoster
            title={work.title}
            authorName={work.authorName}
            category={work.categoryName}
            provenanceStatus={work.provenanceStatus}
            variant="compact"
          />
        </div>
        <div className="md:col-span-3 flex flex-col justify-center">
          <p className="text-[11px] uppercase tracking-[0.12em] text-fog-gray mb-1">{work.categoryName}</p>
          <h3 className="text-[18px] font-semibold text-text-primary leading-snug tracking-[-0.03em]">
            {work.title}
          </h3>
          {work.excerpt && (
            <p className="mt-1.5 text-[13px] text-graphite line-clamp-2">{work.excerpt}</p>
          )}
          <div className="mt-3 flex items-center gap-3">
            {work.aiFreeDeclaration && <ProvenanceBadge status="DECLARED_HUMAN_MADE" />}
            {work.provenanceStatus && work.provenanceStatus !== 'UNDECLARED' && work.provenanceStatus !== 'DECLARED_HUMAN_MADE' && (
              <ProvenanceBadge status={work.provenanceStatus} />
            )}
          </div>
          <div className="mt-3">
            <Link
              href={`/work/${work.slug}`}
              className="inline-flex items-center gap-1 text-[12px] font-medium text-text-primary hover:text-graphite transition-colors"
            >
              View Process &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
