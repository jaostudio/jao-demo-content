import type { ServiceId } from '@/lib/services'

export type SystemId = 'landing' | 'commerce' | 'marketplace' | 'content' | 'webapp' | 'security'

export interface SystemEntry {
  id: SystemId
  name: string
  category: string
  outcome: string
  relatedServices: ServiceId[]
}

export const SYSTEMS: readonly SystemEntry[] = [
  {
    id: 'landing',
    name: 'Lead Generation Platform',
    category: 'growth',
    outcome: 'Turn visitors into booked appointments',
    relatedServices: ['custom-websites'],
  },
  {
    id: 'commerce',
    name: 'Revenue Operations Platform',
    category: 'revenue',
    outcome: 'From catalog to delivery, one platform',
    relatedServices: ['web-applications', 'client-portals'],
  },
  {
    id: 'marketplace',
    name: 'Multi-Vendor Commerce Platform',
    category: 'platform',
    outcome: 'Run a marketplace, not a spreadsheet of vendors',
    relatedServices: ['web-applications', 'internal-tools'],
  },
  {
    id: 'content',
    name: 'Editorial Workflow Platform',
    category: 'publishing',
    outcome: 'From pitch to publish, tracked at every state',
    relatedServices: ['web-applications'],
  },
  {
    id: 'webapp',
    name: 'Internal Operations Platform',
    category: 'operations',
    outcome: 'One platform for every org in your company',
    relatedServices: ['web-applications', 'internal-tools'],
  },
  {
    id: 'security',
    name: 'Compliance & Audit Platform',
    category: 'governance',
    outcome: 'Who did what, when — and who allowed it',
    relatedServices: ['web-applications'],
  },
] as const
