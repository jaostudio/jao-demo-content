'use client'

import { motion } from 'framer-motion'
import type { SectionData, SectionComponentMap } from '../types'
import { containerVariants } from '../transitions'
import { SectionRenderer } from './section-renderer'

export function PageRenderer({
  sections,
  componentMap,
  animateOverrides,
}: {
  sections: SectionData[]
  componentMap: SectionComponentMap
  animateOverrides?: Record<number, boolean>
}) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {sections.map((section, i) => (
        <SectionRenderer
          key={`${section.type}-${i}`}
          section={section}
          componentMap={componentMap}
          animate={animateOverrides?.[i] ?? true}
        />
      ))}
    </motion.div>
  )
}
