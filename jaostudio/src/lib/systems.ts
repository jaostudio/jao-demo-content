export interface SystemEntry {
  id: string
  name: string
  category: string
  outcome: string
}

export const SYSTEMS: readonly SystemEntry[] = [
  {
    id: 'landing',
    name: 'Lead Generation Platform',
    category: 'growth',
    outcome: 'Turn visitors into booked appointments',
  },
  {
    id: 'commerce',
    name: 'Revenue Operations Platform',
    category: 'revenue',
    outcome: 'From catalog to delivery, one platform',
  },
  {
    id: 'marketplace',
    name: 'Multi-Vendor Commerce Platform',
    category: 'platform',
    outcome: 'Run a marketplace, not a spreadsheet of vendors',
  },
  {
    id: 'content',
    name: 'Editorial Workflow Platform',
    category: 'publishing',
    outcome: 'From pitch to publish, tracked at every state',
  },
  {
    id: 'webapp',
    name: 'Internal Operations Platform',
    category: 'operations',
    outcome: 'One platform for every org in your company',
  },
  {
    id: 'security',
    name: 'Compliance & Audit Platform',
    category: 'governance',
    outcome: 'Who did what, when — and who allowed it',
  },
] as const
