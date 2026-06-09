export type ServiceId = 'custom-websites' | 'web-applications' | 'business-automation' | 'internal-tools' | 'client-portals'

export interface ServiceDef {
  id: ServiceId
  slug: string
  titleKey: string
  descriptionKey: string
  seoTitleKey?: string
  seoDescriptionKey?: string
  featured?: boolean
}
