import type { ServiceDef, ServiceId } from './types'

const ALL: Record<ServiceId, ServiceDef> = {
  'custom-websites': {
    id: 'custom-websites',
    slug: 'custom-websites',
    titleKey: 'services.registry.customWebsites.title',
    descriptionKey: 'services.registry.customWebsites.description',
    seoTitleKey: 'services.registry.customWebsites.seoTitle',
    seoDescriptionKey: 'services.registry.customWebsites.seoDescription',
  },
  'web-applications': {
    id: 'web-applications',
    slug: 'web-applications',
    titleKey: 'services.registry.webApplications.title',
    descriptionKey: 'services.registry.webApplications.description',
    seoTitleKey: 'services.registry.webApplications.seoTitle',
    seoDescriptionKey: 'services.registry.webApplications.seoDescription',
  },
  'business-automation': {
    id: 'business-automation',
    slug: 'business-automation',
    titleKey: 'services.registry.businessAutomation.title',
    descriptionKey: 'services.registry.businessAutomation.description',
    seoTitleKey: 'services.registry.businessAutomation.seoTitle',
    seoDescriptionKey: 'services.registry.businessAutomation.seoDescription',
  },
  'internal-tools': {
    id: 'internal-tools',
    slug: 'internal-tools',
    titleKey: 'services.registry.internalTools.title',
    descriptionKey: 'services.registry.internalTools.description',
    seoTitleKey: 'services.registry.internalTools.seoTitle',
    seoDescriptionKey: 'services.registry.internalTools.seoDescription',
  },
  'client-portals': {
    id: 'client-portals',
    slug: 'client-portals',
    titleKey: 'services.registry.clientPortals.title',
    descriptionKey: 'services.registry.clientPortals.description',
    seoTitleKey: 'services.registry.clientPortals.seoTitle',
    seoDescriptionKey: 'services.registry.clientPortals.seoDescription',
  },
}

export function getService(id: ServiceId): ServiceDef {
  const s = ALL[id]
  if (!s) throw new Error(`Unknown service: ${id}`)
  return s
}

export function getAllServices(): ServiceDef[] {
  return Object.values(ALL)
}

export function getServiceBySlug(slug: string): ServiceDef | undefined {
  return Object.values(ALL).find((s) => s.slug === slug)
}

export type { ServiceDef, ServiceId }
export { ALL as SERVICES }
