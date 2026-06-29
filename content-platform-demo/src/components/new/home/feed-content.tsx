'use client'

import { useState, useMemo } from 'react'
import { FeedTabs } from './feed-tabs'
import type { ArticleSummary } from '@content-platform/shared'

interface FeedContentProps {
  initial: ArticleSummary[]
  children: (items: ArticleSummary[]) => React.ReactNode
}

export function FeedContent({ initial, children }: FeedContentProps) {
  const [activeTab, setActiveTab] = useState('recent')

  const filtered = useMemo(() => {
    if (activeTab === 'trending') {
      return [...initial].sort((a, b) => b.likes - a.likes)
    }
    if (activeTab === 'following') {
      return initial
    }
    return initial
  }, [initial, activeTab])

  return (
    <>
      <FeedTabs onChange={setActiveTab} />
      {children(filtered)}
    </>
  )
}
