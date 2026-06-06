'use client'

import { motion } from 'framer-motion'
import type { SectionData, SectionComponentMap } from '../types'
import { itemVariants } from '../transitions'

export function SectionRenderer({
  section,
  componentMap,
  animate = true,
}: {
  section: SectionData
  componentMap: SectionComponentMap
  animate?: boolean
}) {
  const Component = componentMap[section.type]
  if (!Component) return null

  const node = <Component data={section.data as any} />

  if (!animate) return node

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {node}
    </motion.div>
  )
}
