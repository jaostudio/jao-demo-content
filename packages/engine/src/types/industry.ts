import type { Theme } from '../theme/types'
import type { IconKey, SectionData } from './section'

export type NavItem = {
  label: string
  href: string
}

export type IndustryProfile = {
  slug: string
  company: {
    name: string
    category: string
    tagline: string
    description: string
    cta: { label: string; href: string }
    heroStats?: { value: string; label: string }[]
    personality?: string
    domain: string
  }
  theme: Theme
  imagery: {
    hero: string
    thumbnail?: string
    gallery: string[]
  }
  switcher: {
    previewType: "photo" | "icon"
    icon?: IconKey
  }
  navigation: NavItem[]
  sections: SectionData[]
}
