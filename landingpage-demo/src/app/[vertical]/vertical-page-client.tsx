'use client'

import { PageRenderer } from '@jaostudio/engine/rendering'
import { defaultSectionComponents } from '@jaostudio/ui/sections'
import type { VerticalContent } from '@jaostudio/engine/types'

export function VerticalPageClient({ content }: { content: VerticalContent }) {
  return (
    <main>
      <PageRenderer sections={content.sections} componentMap={defaultSectionComponents} />
    </main>
  )
}
