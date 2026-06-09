import type { CaseStudy } from './types'

export const constructionOperations: CaseStudy = {
  slug: 'construction-operations',
  title: 'Replacing Manual Site Tracking with an Operations Platform',
  industry: 'Construction',
  status: 'published',
  featured: true,
  relatedProject: 'isp-platform',
  challenge:
    'A regional construction firm was managing field operations through a patchwork of spreadsheets, paper forms, and phone calls. Site supervisors tracked progress manually, office staff reconciled data at end of day, and project managers had no real-time visibility into what was happening on the ground.',
  constraints: [
    'Field teams had minimal technical literacy — any solution had to work like a tool, not a computer system',
    'No dedicated IT team meant the system had to be self-service to deploy across 12+ active sites',
    'Offline resilience was critical — many sites had unreliable cellular connectivity',
    'Legacy accounting system had a fixed data format that reports had to conform to',
  ],
  solution:
    'Built a multi-role operations platform with two distinct interfaces: a mobile-first field app for site supervisors to log progress, flag issues, and submit daily reports offline, and a web dashboard for office staff and project managers to view real-time status, generate client reports, and reconcile against the legacy accounting system.',
  outcome:
    'Daily reporting time dropped from 45 minutes per site to under 5. Office reconciliation went from end-of-day fire drill to a live dashboard. Project managers gained real-time visibility into site progress for the first time. The legacy accounting integration eliminated manual data re-entry.',
  lessons: [
    'Offline-first was not a nice-to-have — it was the difference between adoption and rejection. Supervisors simply would not use a system that required connectivity.',
    'Building for the least technical user made the system better for everyone. The simple interface that field teams needed turned out to be what office staff preferred too.',
    'The accounting integration was the highest-value surprise. The original scope was just digital reporting, but connecting to the legacy system eliminated an entire category of manual work nobody had flagged.',
  ],
  relatedServices: ['web-applications', 'business-automation'],
  relatedDemos: ['webapp', 'security'],
  architectureSummary:
    'Offline-capable mobile interface for field teams, real-time web dashboard for operations staff, and an integration layer that normalized data into the legacy accounting system. Server-side reconciliation ensured data integrity when mobile reports synced.',
  metrics: [
    { label: 'Daily reporting time', value: '45min → 5min' },
    { label: 'Active sites', value: '12+' },
    { label: 'Manual data re-entry eliminated', value: '100%' },
  ],
}
