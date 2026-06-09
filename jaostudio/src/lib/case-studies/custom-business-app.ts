import type { CaseStudy } from './types'

export const customBusinessApp: CaseStudy = {
  slug: 'custom-business-app',
  title: 'From Spreadsheets to Real-Time Operations: A Logistics Dashboard',
  industry: 'Logistics',
  status: 'published',
  featured: true,
  relatedProject: 'web-application',
  challenge:
    'A mid-size logistics company was running its entire operation through spreadsheets. Inventory tracking, order status, dispatch scheduling — every function had its own document, and none of them talked to each other. The operations team spent hours each day manually reconciling data across sheets instead of running the business.',
  constraints: [
    'No dedicated designer meant the frontend had to ship with built-in UX patterns — every pixel decision had to come from a component library, not custom mocks',
    'The existing API was a fixed legacy system that could not be modified, so the frontend had to adapt to its shape rather than the other way around',
    'Role-based access was required: warehouse staff, dispatchers, and executives needed fundamentally different views of the same data',
    'Real-time data accuracy was non-negotiable — inventory counts and order statuses had to reflect the actual state of operations at all times',
  ],
  solution:
    'Built a server-side rendered dashboard that normalized data from the legacy API before the client ever saw it. Role-based views let each team member see only what they needed: warehouse staff tracked inventory, dispatchers managed orders, executives viewed aggregated KPIs. A shared component library kept the interface consistent without a designer.',
  outcome:
    'Spreadsheet reconciliation disappeared entirely. The operations team shifted from data-entry to exception-handling — instead of hours spent copying numbers between sheets, they now reviewed alerts and edge cases flagged by the system. Login-to-decision time dropped significantly across all roles.',
  lessons: [
    'The component library choice was the right call for a team with no designer, but the most-used component — the data table — needed heavy customization. Tradeoffs are real, and you feel them most in the hot path.',
    'Server-side data fetching was the single highest-impact architecture decision. By normalizing the legacy API on the server, the frontend never had to deal with inconsistent data shapes. Zero client-state synchronization bugs in production.',
    'Role-based views surfaced a surprising pattern: the data that warehouse staff corrected during daily operations was often the most accurate, but it never reached executives. The dashboard closed that loop.',
  ],
  relatedServices: ['web-applications'],
  relatedDemos: ['webapp'],
  architectureSummary:
    'Next.js dashboard with server-side data fetching from a fixed legacy API. Role-based view composition using a shared component library. Server-side normalization layer transformed inconsistent API responses before they reached client components.',
  metrics: [
    { label: 'Spreadsheet reconciliation', value: 'Eliminated' },
    { label: 'Team focus shift', value: 'Data entry → exception handling' },
    { label: 'Design team needed', value: 'Zero' },
  ],
}
