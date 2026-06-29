'use client'

import { useState, useMemo } from 'react'
import { FeedTabs } from './feed-tabs'
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

  return (
    <>
      <FeedTabs onChange={setActiveTab} />
      <div className="space-y-4">
        {filtered.map((article, i) => (
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
              variant={i === 0 ? 'featured' : 'feed'}
            />
          </Reveal>
        ))}
      </div>
    </>
  )
}
