import { construction } from './construction'
import { dental } from './dental'
import { realEstate } from './real-estate'
import { trades } from './trades'
import { legal } from './legal'
import type { VerticalContent } from '@jaostudio/engine/types'

export const verticals: Record<string, VerticalContent> = {
  construction,
  dental,
  'real-estate': realEstate,
  trades,
  legal,
}

export const verticalList: VerticalContent[] = Object.values(verticals)
