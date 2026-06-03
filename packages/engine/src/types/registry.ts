import type { ComponentType } from 'react'
import type { SectionData } from './section'

export type SectionComponentMap = {
  [T in SectionData['type']]: ComponentType<{ data: Extract<SectionData, { type: T }>['data'] }>
}
