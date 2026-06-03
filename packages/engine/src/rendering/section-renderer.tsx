'use client'

import { motion } from 'framer-motion'
import type { SectionData, SectionComponentMap } from '../types'
import { itemVariants } from '../transitions'

export function SectionRenderer({
  section,
  componentMap,
}: {
  section: SectionData
  componentMap: SectionComponentMap
}) {
  const Component = componentMap[section.type]
  if (!Component) return null

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      <Component data={section.data as any} />
    </motion.div>
  )
}
