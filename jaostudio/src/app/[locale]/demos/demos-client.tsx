'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ActiveSystemView, type SystemContent } from '@/components/sections/active-system-view'
import { ArchitectureSection } from '@/components/sections/architecture-section'

const VALID_SYSTEM_IDS = new Set(['landing', 'commerce', 'marketplace', 'content', 'webapp', 'security'])

export function DemosClient({
  systems,
  systemDetails,
}: {
  systems: { id: string }[]
  systemDetails: Record<string, SystemContent>
}) {
  const searchParams = useSearchParams()
  const [activeId, setActiveId] = useState(() => {
    const requested = searchParams.get('system')
    if (requested && VALID_SYSTEM_IDS.has(requested)) return requested
    return systems[0]?.id ?? ''
  })

  useEffect(() => {
    const requested = searchParams.get('system')
    if (requested && VALID_SYSTEM_IDS.has(requested)) {
      setActiveId(requested)
    }
  }, [searchParams])

  const active = activeId ? systemDetails[activeId] : null

  return (
    <>
      <section className="relative py-[var(--section-py-compact)]">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12">
          <ActiveSystemView
            systems={systems}
            systemDetails={systemDetails}
            activeId={activeId}
            onActiveChange={setActiveId}
          />
        </div>
      </section>
      <ArchitectureSection activeSystem={active} />
    </>
  )
}
