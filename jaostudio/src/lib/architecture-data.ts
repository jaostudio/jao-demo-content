import type { ArchitectureData } from '@/types/architecture'

export const ispArchitecture: ArchitectureData = {
  nodes: [
    { id: 'browser', label: 'Browser', type: 'client', x: 110, y: 30 },
    { id: 'edge', label: 'CDN / Edge', type: 'edge', x: 110, y: 100 },
    { id: 'ssg', label: 'Next.js SSG', type: 'static', x: 110, y: 170 },
    { id: 'pricing', label: 'Pricing Config', type: 'cache', x: 30, y: 240 },
    { id: 'cms', label: 'CMS Content', type: 'external', x: 190, y: 240 },
    { id: 'export', label: 'Static Export', type: 'static', x: 110, y: 310 },
    { id: 'analytics', label: 'Analytics (PostHog)', type: 'external', x: 110, y: 380 },
  ],
  edges: [
    { from: 'browser', to: 'edge' },
    { from: 'edge', to: 'ssg' },
    { from: 'ssg', to: 'pricing' },
    { from: 'ssg', to: 'cms' },
    { from: 'pricing', to: 'export' },
    { from: 'cms', to: 'export' },
    { from: 'export', to: 'analytics' },
  ],
}

export const saasArchitecture: ArchitectureData = {
  nodes: [
    { id: 'browser', label: 'Client', type: 'client', x: 110, y: 30 },
    { id: 'auth', label: 'Auth Boundary', type: 'auth', x: 110, y: 100 },
    { id: 'admin', label: 'Admin Dashboard', type: 'client', x: 30, y: 170 },
    { id: 'member', label: 'Member Dashboard', type: 'client', x: 190, y: 170 },
    { id: 'api', label: 'API Layer', type: 'api', x: 110, y: 240 },
    { id: 'db', label: 'PostgreSQL', type: 'db', x: 110, y: 310 },
    { id: 'ext', label: 'Analytics + Email', type: 'external', x: 110, y: 380 },
  ],
  edges: [
    { from: 'browser', to: 'auth' },
    { from: 'auth', to: 'admin' },
    { from: 'auth', to: 'member' },
    { from: 'admin', to: 'api' },
    { from: 'member', to: 'api' },
    { from: 'api', to: 'db' },
    { from: 'db', to: 'ext' },
  ],
}

export const webAppArchitecture: ArchitectureData = {
  nodes: [
    { id: 'client', label: 'Client UI', type: 'client', x: 110, y: 30 },
    { id: 'validation', label: 'Validation', type: 'validation', x: 110, y: 100 },
    { id: 'api', label: 'API Routes', type: 'api', x: 110, y: 170 },
    { id: 'pg', label: 'PostgreSQL', type: 'db', x: 30, y: 240 },
    { id: 'queue', label: 'Async Queue', type: 'cache', x: 190, y: 240 },
    { id: 'optimistic', label: 'Optimistic Updates', type: 'client', x: 110, y: 310 },
    { id: 'monitor', label: 'Monitoring', type: 'external', x: 110, y: 380 },
  ],
  edges: [
    { from: 'client', to: 'validation' },
    { from: 'validation', to: 'api' },
    { from: 'api', to: 'pg' },
    { from: 'api', to: 'queue' },
    { from: 'pg', to: 'optimistic' },
    { from: 'queue', to: 'optimistic' },
    { from: 'optimistic', to: 'monitor' },
  ],
}

export const architectureRegistry: Record<string, ArchitectureData> = {
  'isp-platform': ispArchitecture,
  'saas-frontend': saasArchitecture,
  'web-application': webAppArchitecture,
}
