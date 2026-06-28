'use client'

import { useState } from 'react'

interface Tab {
  id: string
  label: string
}

interface AnimatedTabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (id: string) => void
}

export function AnimatedTabs({ tabs, defaultTab, onChange }: AnimatedTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)

  return (
    <div className="flex gap-0 border-b border-hairline">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => { setActive(tab.id); onChange?.(tab.id) }}
          className="relative px-4 py-2 text-[13px] font-medium transition-colors"
          style={{ color: active === tab.id ? 'var(--color-text-primary)' : 'var(--color-fog-gray)' }}
        >
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
