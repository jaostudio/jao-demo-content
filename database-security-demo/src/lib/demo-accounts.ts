export const DEMO_ACCOUNTS = [
  {
    name: 'Jao',
    email: 'jao@luntian.demo',
    role: 'ORG_ADMIN' as const,
    tenant: 'Luntian Health',
    access: 'Documents, Audit, Settings',
  },
  {
    name: 'Gina',
    email: 'gina@talapay.demo',
    role: 'ORG_ADMIN' as const,
    tenant: 'TalaPay',
    access: 'Documents, Audit, Settings',
  },
  {
    name: 'Kiko',
    email: 'kiko@bayani.demo',
    role: 'ORG_USER' as const,
    tenant: 'Bayani Freight',
    access: 'Documents only',
  },
  {
    name: 'Grace',
    email: 'grace@pulodata.demo',
    role: 'SYSTEM_ADMIN' as const,
    tenant: 'Global Control Plane',
    access: 'All organizations',
  },
] as const

export type DemoAccount = (typeof DEMO_ACCOUNTS)[number]

export const DEMO_PASSWORD = 'password123'
