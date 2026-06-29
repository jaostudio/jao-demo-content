'use client'

import { useState } from 'react'

const TABS = [
  { id: 'recent', label: 'Live', signal: true },
  { id: 'trending', label: 'Trending' },
  { id: 'following', label: 'Following' },
]

interface FeedTabsProps {
  onChange?: (tab: string) => void
}

export function FeedTabs({ onChange }: FeedTabsProps) {
  const [active, setActive] = useState('recent')

  return (
    <div className="flex gap-0 border-b border-hairline mb-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => { setActive(tab.id); onChange?.(tab.id) }}
          className="relative px-4 py-2 text-[13px] font-medium transition-colors flex items-center gap-1.5"
          style={{ color: active === tab.id ? 'var(--color-text-primary)' : 'var(--color-fog-gray)' }}
        >
          {tab.signal && <span className="inline-block h-1.5 w-1.5 rounded-full bg-reactor-green" />}
          {tab.label}
          {active === tab.id && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-reactor-green"
              style={{ transition: 'all 220ms var(--ease-spring)' }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
