'use client'

import { useState, useMemo } from 'react'
import { FeedTabs } from './feed-tabs'
import { FeedSection } from './feed-section'
import { ProcessSpotlight } from './process-spotlight'
import { HowLikhaWorks } from './how-likha-works'
import { WorkCard } from '@/components/new/work/work-card'
import { Reveal } from '@/components/new/motion/reveal'
import type { ArticleSummary } from '@content-platform/shared'

interface FeedContentProps {
  initial: ArticleSummary[]
}

export function FeedContent({ initial }: FeedContentProps) {
  const [activeTab, setActiveTab] = useState('recent')

  const filtered = useMemo(() => {
    if (activeTab === 'trending') {
      return [...initial].sort((a, b) => b.likes - a.likes)
    }
    return initial
  }, [initial, activeTab])

  if (filtered.length === 0) return null

  const [featured, ...rest] = filtered
  const compactRow = rest.slice(0, 2)
  const spotlight = rest.find((w) => w.provenanceStatus === 'PROCESS_DOCUMENTED') || rest[2]
  const moreWorks = rest.slice(compactRow.includes(spotlight) ? 3 : compactRow.length + 1)

  return (
    <>
      <FeedTabs onChange={setActiveTab} />

      {/* Featured work */}
      <Reveal>
        <div className="mb-6">
          <WorkCard
            articleId={featured.id}
            title={featured.title}
            slug={featured.slug}
            excerpt={featured.excerpt}
            authorName={featured.authorName}
            categoryName={featured.categoryName}
            readingTime={featured.readingTime}
            commentCount={featured.commentCount}
            image={featured.image}
            format={featured.format}
            aiFreeDeclaration={featured.aiFreeDeclaration}
            provenanceStatus={featured.provenanceStatus}
            publishAt={featured.publishAt}
            variant="featured"
          />
        </div>
      </Reveal>

      {/* Compact works grid */}
      {compactRow.length > 0 && (
        <FeedSection title="Recent works">
          <div className="grid gap-4 md:grid-cols-2">
            {compactRow.map((article) => (
              <Reveal key={article.slug}>
                <WorkCard
                  articleId={article.id}
                  title={article.title}
                  slug={article.slug}
                  excerpt={article.excerpt}
                  authorName={article.authorName}
                  categoryName={article.categoryName}
                  readingTime={article.readingTime}
                  commentCount={article.commentCount}
                  image={article.image}
                  format={article.format}
                  aiFreeDeclaration={article.aiFreeDeclaration}
                  provenanceStatus={article.provenanceStatus}
                  publishAt={article.publishAt}
                  variant="compact"
                />
              </Reveal>
            ))}
          </div>
        </FeedSection>
      )}

      {/* Process spotlight */}
      {spotlight && (
        <Reveal>
          <ProcessSpotlight work={spotlight} />
        </Reveal>
      )}

      {/* More works */}
      {moreWorks.length > 0 && (
        <FeedSection title="More works">
          <div className="space-y-4">
            {moreWorks.map((article) => (
              <Reveal key={article.slug}>
                <WorkCard
                  articleId={article.id}
                  title={article.title}
                  slug={article.slug}
                  excerpt={article.excerpt}
                  authorName={article.authorName}
                  categoryName={article.categoryName}
                  readingTime={article.readingTime}
                  commentCount={article.commentCount}
                  image={article.image}
                  format={article.format}
                  aiFreeDeclaration={article.aiFreeDeclaration}
                  provenanceStatus={article.provenanceStatus}
                  publishAt={article.publishAt}
                  variant="feed"
                />
              </Reveal>
            ))}
          </div>
        </FeedSection>
      )}

      {/* How Likha Works */}
      <Reveal>
        <HowLikhaWorks />
      </Reveal>
    </>
  )
}
